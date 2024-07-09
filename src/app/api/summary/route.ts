import { NextApiRequest, NextApiResponse} from "next";
import {pipeline} from '@xenova/transformers'


interface NextRequest extends NextApiRequest {
    body: {
        data: {
            text: string
        }
        words_limit: number
    }
}

export async function GET(req: NextRequest, res: NextApiResponse): Promise<any>
{
    try
    {
        if (Object.keys(req.body).length > 0 && Object.keys(req.body).length === 2) 
        {
            const {data, words_limit} = req.body

            if (data && words_limit)
            {
                const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6')
                const output: any = await generator(data?.text, {
                max_new_tokens: words_limit
            })

                return res.status(200).json({text: output?.summary_text})
            }

            else
            {
               return res.status(400).json({text: 'Invalid input'})
            }

        }
        else
        {
            return res.status(400).json({text: 'Invalid arguments'})
        }
    }
    catch(err: any) 
    {
        throw new Error(err)
    }

}