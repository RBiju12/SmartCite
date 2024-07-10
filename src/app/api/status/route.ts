import { NextApiRequest, NextApiResponse} from "next";


export default function GET(req: NextApiRequest, res:NextApiResponse)
{
    try 
    {
        const cookies = req.headers.cookie
    
        if (cookies)
        {
            const secretKey: any = process.env.SECRET_KEY
            const userToken = cookies.split(';')[0].split('=')[1]

            if (userToken === secretKey)
            {
                res.status(200).json({
                    success: 'Authorized'
                })
            }

            else
            {
                res.status(400).json({
                    success: 'Not Authorized'
                })
            }   
        }
    }
    catch(e: any)
    {
        throw new Error(e)
    }

}