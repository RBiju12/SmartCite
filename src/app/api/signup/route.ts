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


export default async function POST(req: UserInfo, res: NextApiResponse): Promise<any>
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

            const dbName: any = process.env.MONGODB_NAME
            const dbCollectionName: any = process.env.MONGODB_COLLECT

            const db = client.db(dbName)
            const collection = db.collection(dbCollectionName)
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

            const result = collection.find({username: username})
            if (result)
            {
                return res.status(400).json({
                    message: 'User already Exists'
                })
            }

            else
            {
                const information = {
                    username : username,
                    data: {
                        id: id,
                        email: email,
                        password: hashedPass
                    }
                }
                collection.insertOne(information)
                const secretKey: any = process.env.SECRET_KEY

                const jwtExpirationTime = process.env.JWT_EXPIRATION

                const accessToken = jwt.sign({time: Date(), id: id}, secretKey, {
                    expiresIn: jwtExpirationTime
                }) 

                res.setHeader('Authorization', `Bearer= ${accessToken}`)

                return res.status(200).json({
                    message: "User was successfully created",
                    username: username
                })
            }

        }

        catch (e: any)
        {
            return res.status(500).json({data: 'Something went Wrong!', username: null})
        }

        finally
        {
            await client.close()
        }

    }
    else
    {
        return res.status(400).json({
            message: 'Bad Request Sent'
        })
    }
}
    