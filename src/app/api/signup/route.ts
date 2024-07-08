import { NextApiRequest, NextApiResponse} from "next";
import {MongoClient} from 'mongodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 

interface UserInfo extends NextApiRequest {
    body: {
        id: number,
        username: string,
        email: string,
        password: string
    }
}


export default async function POST(req: UserInfo, res: NextApiResponse) 
{
    if (req.body && Object.entries(req.body).length === 4)
    {
        const {id, username, email, password} = req.body
        const mongoID: any = process.env.MONGO_URI

        const client = new MongoClient(mongoID)

        try
        {
            await client.connect()
            const saltRounds: number = 10

            const db = client.db('SmartCite')
            const collection = db.collection('users')
            const hashedPass: string | void = bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err)
                {
                    return "Unhashable data"
                }

                else
                {
                    return hash
                }
            })

            const result = collection.find({password: hashedPass})
            if (result !== null)
            {
                res.status(400).json({
                    message: 'User already Exists'
                })
                return;
            }

            else
            {

                collection.insertOne({id: id, username: username, email: email, password: hashedPass})
                let secretKey: any = process.env.SECRET_KEY

                const token = jwt.sign({time: Date(), id: id}, secretKey) 

                res.status(200).json({
                    message: "User was successfully created",
                    token: token
                })
            }

        }

        catch (e: any)
        {
            res.status(500).json({data: 'Something went Wrong!'})
        }

        finally
        {
            await client.close()
        }

    }
    else
    {
        res.status(400).json({
            message: 'Bad Request Sent'
        })
    }
}
    