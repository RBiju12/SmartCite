import { NextApiRequest, NextApiResponse } from "next";
import {pipeline} from '@xenova/transformers'


interface NextRequest extends NextApiRequest {
    body: {
        data: string,
        words_limit: number
    }
}

export async function POST(req: NextRequest, res: NextApiResponse)
{
    try
    {
        if (Object.keys(req.body).length > 0 && Object.keys(req.body).length === 2) 
        {
            const {data, words_limit} = req.body

            const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6')

            const output: any = await generator(data, {
            max_new_tokens: words_limit
        })

        return output.summary_text

        }
        else
        {
            return 'Missing Parameters'
        }
    }
    catch(err: any) 
    {
        throw new Error(err)
    }

}