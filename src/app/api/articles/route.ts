import {NextRequest, NextResponse} from "next/server";
import {getJson} from 'serpapi'


export async function GET(req: NextRequest): Promise<any>
{
    try
    {
        if (req.url)
        {
            const url = new URL(req.url)

            const topic = url.searchParams.get('topic')

            const apiKey = process.env.SERP_KEY as string

            if (topic)
            {
                let searchQuery: any = getJson({
                    engine: 'google_scholar',
                    q: topic,
                    api_key: apiKey
                }, (json) => json.organic_results)
                let links: any = await searchQuery
                let results: any = await links.organic_results.map((sources: any) => sources.link).slice(0, 5)
                
                return NextResponse.json({'links': results}, {status: 200}) 
            }
            else
            {
                return NextResponse.json({"error": 'Invalid Topic'}, {status: 400})
            }
        }
        else
        {
            throw new Error("Invalid url")
        }
    }
    catch (e: any)
    {
        throw new Error(e?.message)
    }

}

