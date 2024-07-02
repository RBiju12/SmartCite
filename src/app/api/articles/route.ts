import { NextApiRequest, NextApiResponse } from "next";
import {getJson} from 'serpapi'


export async function GET(req: NextApiRequest, res: NextApiResponse)
{
    try
    {
        if (req.url)
        {
            const url = new URL(req.url)

            const topic = url.searchParams.get('topic')

            const apiKey = process.env.SERP_KEY

            if (topic)
            {

                let searchQuery: any = getJson({
                    engine: 'google_scholar',
                    q: topic,
                    api_key: apiKey
                }, (json) => json.organic_results)

                let links: string[] = searchQuery.map((resource: any) => resource.link).slice(0, 5)

                res.status(200).json({"links": links}) 
            }
            else
            {
                res.status(400).json({"error": 'Invalid Topic'})
            }
        }
        else
        {
            throw new Error("Invalid url")
        }
    }
    catch (err: any)
    {
        throw new Error(err)
    }

}

