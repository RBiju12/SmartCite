import {NextRequest, NextResponse} from 'next/server'
import {chromium} from 'playwright'

interface WebCitation {
    title: string | null,
    author: string | null,
    publisher: string | null,
    time: string | null,
    review: string | null,
    pageNumber: string | null
}

enum CitationStyle {
    MLA = 'MLA',
    APA = 'APA',
    CHICAGO = 'CHICAGO'
}

export async function GET(req: NextRequest): Promise<any>
{

    try
    {
        const {link, citation_style} = await req.json()

        if (link && citation_style)
        {
            const data: any = await getCitation(link)
            return NextResponse.json({
                citation: generateCitation(link, data, citation_style)
            })
                
        }
        else
        {
            return NextResponse.json({
                citation: 'Error could not parse following cite'
            })
        }

    }
    catch (e: any)
    {
        throw new Error(e)
    }
}

async function getCitation(link: string): Promise<WebCitation | null>
{
    try
    {
        const browser = await chromium.launch()
        const page: any = await browser.newPage()
        await page.goto(link) 

        const header: any = await page.locator('css=head')
        
        if (header)
        {
            let siteInfo: WebCitation = {
                title: null,
                author: null,
                publisher: null,
                time: null,
                review: null,
                pageNumber: null
            }

            let titles: any = await header.locator('title')
            let metaTag: any = await header.locator('meta[name]').findAll()
            let metaPropTag: any = await header.locator('meta[property]').findAll()

            const [title, metaTags, metaPropTags] = await Promise.allSettled([titles, metaTag, metaPropTag])

            if (title.status === 'fulfilled')
            {
                siteInfo.title = title.value
            }
            let objValues = Object.entries(siteInfo).filter(([key, value]) => value !== null)

            if (metaTags.status === 'fulfilled')
            {
                metaTags.value.map(async (meta: any) => 
                {
                    if (objValues.length === 5)
                    {
                        return;
                    }

                    const name: any = await meta.getAttribute('name')
                    const content: any = await meta.getAttribute('content') 

                    if (name.includes("author"))
                    {
                        siteInfo.author = content
                    }

                    else if (name.includes('publisher'))
                    {
                        siteInfo.publisher = content
                    }

                    else if (name.includes("keywords"))
                    {
                        siteInfo.review = content
                    }

                    else if (name.includes("pageNumber"))
                    {
                        siteInfo.pageNumber = content
                    }
                }
            )}

            if (metaPropTags.status === 'fulfilled')
            {
                metaPropTags.value.map(async (prop: any) => 
                {
                    if (objValues.length === 6)
                    {
                        return;
                    }

                    const time = await prop.getAttribute('property')

                    if (time.includes("modified_time") || time.includes('updated_time')) 
                    {
                        siteInfo.time = prop.getAttribute('content').split('T')[0]
                    }

                    else if (!siteInfo.title && time.includes("title"))
                    {
                        siteInfo.title = prop.getAttribute('content')
                    }

                    else if (!siteInfo.author && time.incudes("author"))
                    {
                        siteInfo.author = prop.getAttribute('content')
                    }

                    else if (!siteInfo.publisher && time.includes('publisher'))
                    {
                        siteInfo.publisher = prop.getAttribute('content')
                    }

                }
            )}

            await browser.close()
            return siteInfo
        }

        await browser.close()
        return null
    }

    catch (e: any)
    {
        throw new Error(e)
    }
}

function generateCitation(url: string, obj: any, citation_style: string): string
{
    switch (citation_style)
    {
        case CitationStyle.MLA:
            return `${obj?.author.split(' ').reverse().join(',') ? obj.author : "Not Found"}. "${obj?.title ? obj.title : "Not Found"}." 
                ${obj?.publisher ? obj.publisher : "Not Found"}, ${obj.time.slice(0, 4) ? obj.time : "Not Found"}, ${url}.`
        
        case CitationStyle.APA:
            return `(${obj?.time.slice(0, 4) ? obj.time : "Not Found"}). ${obj?.review ? obj.review : "Not Found"}. 
                ${obj?.title ? obj.title : "Not Found"}. ${obj?.pageNumber ? obj.pageNumber : "Not Found"}. ${url}.`

        case CitationStyle.CHICAGO:
            return `${obj?.author ? obj.author : "Not Found"}. ${obj?.title ? obj.title : "Not Found"}. 
                ${obj?.publisher ? obj.publisher : "Not Found"}. ${url}.`

        default:
            return `${obj?.author.split(' ').reverse().join(',') ? obj.author : "Not Found"}. "${obj?.title ? obj.title : "Not Found"}." 
                ${obj?.publisher ? obj.publisher : "Not Found"}, ${obj.time.slice(0, 4) ? obj.time : "Not Found"}, ${url}.`
    }
}