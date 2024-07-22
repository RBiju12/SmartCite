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
        const {searchParams} = new URL(req?.url)
        const link = searchParams.get('link')
        const citation_style = searchParams.get('citation-style')

        if (link && citation_style)
        {
            const data: any = await getCitation(link)
            return NextResponse.json({
                citation: `(${generateCitation(link, data, citation_style)})`
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
        throw new Error(e?.message)
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

            let titles: any = await page.title()
            let metaTag: any = await header.locator('meta[name]').elementHandles()
            let metaPropTag: any = await header.locator('meta[property]').elementHandles()

            const [title, metaTags, metaPropTags] = await Promise.allSettled([titles, metaTag, metaPropTag])

            if (title.status === 'fulfilled')
            {
                siteInfo.title = title.value
            }
            let objValues = Object.entries(siteInfo).filter(([key, value]) => value !== null)

            if (metaTags.status === 'fulfilled')
            {
                for (let meta of metaTags.value)  
                {
                    if (objValues.length === 5)
                    {
                        break;
                    }

                    const key: any = meta as any

                    const name: any = await key.getAttribute('name')
                    const content: any = await key.getAttribute('content') 

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

                    else if (!siteInfo.title && name.includes('title'))
                    {
                        siteInfo.title = content
                    }
                }
            }

            if (metaPropTags.status === 'fulfilled')
            {
                for (let metaProp of metaPropTags.value)
                {
                    if (objValues.length === 6)
                    {
                        break;
                    }

                    const key: any = metaProp as any

                    let props = await key.getAttribute('property')
                    let content = await key.getAttribute('content')


                    if (props.includes("modified_time") || props.includes('updated_time')) 
                    {
                        if (content)
                        {
                            siteInfo.time = content.split('T')[0]
                        }
                    }

                    else if (!siteInfo.title && props.includes("title"))
                    {
                        siteInfo.title = content
                    }

                    else if (!siteInfo.author && props.includes("author"))
                    {
                        siteInfo.author = content
                    }

                    else if (!siteInfo.publisher && props.includes('publisher'))
                    {
                        siteInfo.publisher = content
                    }
                }
            }

            await browser.close()
            return siteInfo
        }

        await browser.close()
        return null
    }

    catch (e: any)
    {
        throw new Error(e?.message)
    }
}

function generateCitation(url: string, obj: any, citation_style: string): string
{
    switch (citation_style)
    {
        case CitationStyle.MLA:
            return `${obj?.author ? obj?.author.split(' ').reverse().join(',') : "Not Found"}. "${obj?.title ? obj.title : "Not Found"}." 
                ${obj?.publisher ? obj.publisher : "Not Found"}, ${obj?.time ? obj.time.slice(0, 4) : "Not Found"}, ${url}.`
        
        case CitationStyle.APA:
            return `(${obj?.time ? obj.time.slice(0, 4) : "Not Found"}). ${obj?.review ? obj.review : "Not Found"}. 
                ${obj?.title ? obj.title : "Not Found"}. ${obj?.pageNumber ? obj.pageNumber : "Not Found"}. ${url}.`

        case CitationStyle.CHICAGO:
            return `${obj?.author ? obj.author : "Not Found"}. ${obj?.title ? obj.title : "Not Found"}. 
                ${obj?.publisher ? obj.publisher : "Not Found"}. ${url}.`

        default:
            return `${obj?.author ? obj?.author.split(' ').reverse().join(',') : "Not Found"}. "${obj?.title ? obj.title : "Not Found"}." 
                ${obj?.publisher ? obj.publisher : "Not Found"}, ${obj?.time ? obj.time.slice(0, 4) : "Not Found"}, ${url}.`
    }
}