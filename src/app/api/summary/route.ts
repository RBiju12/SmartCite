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

        const maxTokens = 4000

        if (url)
        {
            try
            {
                const browser = await chromium.launch()
                const page: any = await browser.newPage()
                const timeLimit = 30000

                await page.goto(url)
                await page.waitForLoadState('load', {timeout: timeLimit})

                let paragraphs: string[] = await page.locator('p').allInnerTexts();

                const body = paragraphs.join('.')

                await browser.close();

                if (body.length > 5000)
                {
                    const output = await hf.summarization({
                        model: 'facebook/bart-large-cnn',
                        inputs: body.slice(0, 4300),
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
                return NextResponse.json({text: 'Url Could not be parsed'}, {status: 400})
            }
        }

        else
        {    
            return NextResponse.json({text: 'Invalid input'}, {status: 400})
        }
    }
    catch(err: any) 
    {
        return NextResponse.json({text: 'Invalid Url'}, {status: 400})
    }

}