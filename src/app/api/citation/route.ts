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
    time: string | null

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
            author: null,
            title: null,
            time: null
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
                        break;
                    }
                }
            }

            if (metaPropTags)
            {
                for (let prop of metaPropTags)
                {
                    const time = await prop.getAttribute('property')
                    if (time.includes("modified_time"))
                    {
                        siteInfo.time = await prop.getAttribute('content').split('T')[0]
                        break;
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
    if (citation_style === null)
    {
        return null
    }

    else if (citation_style === 'MLA')
    {
        let s = ''
        for (let key in obj)
        {
            if (key === "author")
            {
                s += Array.from(obj[key]).reverse().join("")
            }

            s += obj[key] + ', '
        }

        s += url

        return s
    }

    else
    {
        // let x = ''

        // for (let key in obj)
        //     {
        //         if (key === "author")
        //         {
        //             x += Array.from(obj[key]).reverse().join("")
        //         }
    
        //         s += obj[key] + ', '
        //     }
    
        //     s += url
    
        //     return s
        return ''
    }
}