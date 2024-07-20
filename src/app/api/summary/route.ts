import {NextRequest, NextResponse} from "next/server";
import {HfInference} from '@huggingface/inference'

export async function GET(req: NextRequest): Promise<any>
{
    try
    {
        const {searchParams} = new URL(req?.url)
        const data = searchParams.get('data')
        const hfToken = process.env.HF_TOKEN as string
        
        const hf = new HfInference(hfToken)

        const maxTokens = 200

        if (data)
        {
            const output = await hf.summarization({
                model: 'facebook/bart-large-cnn',
                inputs: data,
                parameters: {
                    max_length: maxTokens
                }
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