import {NextRequest, NextResponse} from "next/server";
import {HfInference} from '@huggingface/inference'
import {chromium} from 'playwright'

export async function GET(req: NextRequest): Promise<any>
{
    try
    {
        const {searchParams} = new URL(req?.url)
        const url = searchParams.get('url')
        const hfToken = process.env.HF_TOKEN as string
        
        const hf = new HfInference(hfToken)

        const maxTokens = 600

        if (url)
        {
            try
            {
                const browser = await chromium.launch()
                const page: any = await browser.newPage()
                await page.goto(url)

                let paragraphs: string[] = await page.locator('p').allInnerTexts();

                const body = paragraphs.join('.')

                await browser.close();

                if (body.length > 3000)
                {
                    const output = await hf.summarization({
                        model: 'facebook/bart-large-cnn',
                        inputs: body.slice(0, 3000),
                        parameters: {
                            max_length: maxTokens
                        }
                    })

                    return NextResponse.json({text: output?.summary_text}, {status: 200})

                }
                else
                {
                    const output = await hf.summarization({
                        model: 'facebook/bart-large-cnn',
                        inputs: body,
                        parameters: {
                            max_length: maxTokens
                        }
                    })

                    return NextResponse.json({text: output?.summary_text}, {status: 200})

                }

            }
            catch(err: any)
            {
                throw new Error(err?.message)
            }
        }

        else
        {    
            return NextResponse.json({text: 'Invalid input'}, {status: 400})
        }
    }
    catch(err: any) 
    {
        throw new Error(err?.message)
    }

}