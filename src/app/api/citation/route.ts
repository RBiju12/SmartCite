import { NextApiRequest, NextApiResponse } from "next";
import {chromium} from 'playwright'

interface NextRequest extends NextApiRequest {
    body: {
        link: string, 
        citation_style: string
    }
}

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

export async function GET(req: NextRequest, res: NextApiResponse)
{
    try
    {
        if (Object.keys(req.body).length > 0 && Object.keys(req.body).length === 2) 
        {
            const {link, citation_style} = req.body

            if (link && citation_style)
            {
                const data: any = await getCitation(link)
                res.status(200).json({
                    citation: generateCitation(link, data, citation_style)
                })
                
            }
            res.status(400).json({
                citation: 'Error could not parse following cite'
            })

        }
        res.status(400).json({
            citation: 'Invalid request'
        })
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

        let siteInfo: WebCitation = {
            title: null,
            author: null,
            publisher: null,
            time: null,
            review: null,
            pageNumber: null
        }

        const header: any = await page.locator('css=head')
        
        if (header)
        {
            const title: any = await header.locator('title')
            const metaTags: any = await header.locator('meta[name]').findAll()
            const metaPropTags: any = await header.locator('meta[property]').findAll()
            siteInfo.title = title

            if (metaTags)
            {
                for (let meta of metaTags)
                {
                    const name: any = await meta.getAttribute('name')
                    if (name.includes("author"))
                    {
                        siteInfo.author = await meta.getAttribute('content')
                    }

                    if (name.includes('publisher'))
                    {
                        siteInfo.publisher = await meta.generateAttribute('content')
                    }

                    if (name.includes("keywords"))
                    {
                        siteInfo.review = await meta.getAttribute('content')
                    }

                    if (name.includes("pageNumber"))
                    {
                        siteInfo.pageNumber = await meta.getAttribute('content')
                    }
                }
            }

            if (metaPropTags)
            {
                for (let prop of metaPropTags)
                {
                    const time = await prop.getAttribute('property')
                    if (time.includes("modified_time") || time.includes('updated_time')) 
                    {
                        siteInfo.time = await prop.getAttribute('content').split('T')[0]
                    }

                    if (!siteInfo.author && time.incudes("author"))
                    {
                        siteInfo.author = await prop.getAttribute('content')
                    }

                    if (!siteInfo.publisher && time.includes('publisher'))
                    {
                        siteInfo.publisher = await prop.getAttribute('content')
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
        throw new Error(e)
    }
}

function generateCitation(url: string, obj: any, citation_style: string): string | null
{
    switch (citation_style)
    {
        case CitationStyle.MLA:
            return `${obj?.author.split(' ').reverse().join(',') ? obj.author : null}. "${obj?.title ? obj.title : null}." 
                ${obj?.publisher ? obj.publisher : null}, ${obj.time.slice(0, 4) ? obj.time : null}, ${url}.`
        
        case CitationStyle.APA:
            return `(${obj?.time.slice(0, 4) ? obj.time : null}). ${obj?.review ? obj.review : null}. 
                ${obj?.title ? obj.title : null}. ${obj?.pageNumber ? obj.pageNumber : null}. ${url}.`

        case CitationStyle.CHICAGO:
            return `${obj?.author ? obj.author : null}. ${obj?.title ? obj.title : null}. 
                ${obj?.publisher ? obj.publisher : null}. ${url}.`

        default:
            return `${obj?.author.split(' ').reverse().join(',') ? obj.author : null}. "${obj?.title ? obj.title : null}." 
                ${obj?.publisher ? obj.publisher : null}, ${obj.time.slice(0, 4) ? obj.time : null}, ${url}.`
    }
}