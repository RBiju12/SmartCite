import {NextRequest, NextResponse} from "next/server";
import {pipeline, env} from '@xenova/transformers'

env.allowLocalModels = false;

export async function GET(req: NextRequest): Promise<any>
{
    try
    {
        const {data, words_limit} = await req.json()

        if (data && words_limit)
        {
            const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6')
            const output: any = await generator(data, {
                max_new_tokens: words_limit
            })

            return NextResponse.json({text: output?.summary_text})
        }

        else
        {    
            return NextResponse.json({text: 'Invalid input'})
        }
    }
    catch(err: any) 
    {
        throw new Error(err.message)
    }

}