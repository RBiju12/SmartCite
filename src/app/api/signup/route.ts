import { NextRequest, NextResponse} from "next/server";
import {MongoClient} from 'mongodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 


export async function POST(req: NextRequest): Promise<any>
{
        const formData: any = await req.json()
        const {username, email, password} = formData
        const mongoID: any = process.env.MONGO_URI as string
        const client = new MongoClient(mongoID) 

        try
        {
            await client.connect()
            const saltRounds: number = 10

            const dbName: any = process.env.MONGODB_NAME
            const dbCollectionName: any = process.env.MONGODB_COLLECT

            const db = client.db(dbName)
            const collection = db.collection(dbCollectionName)

            const result = await collection.findOne({username: username})
            if (result)
            {
                return NextResponse.json({
                    message: 'User already Exists'
                }, {status: 400})
            }

            else
            {
                const generateHash: any = await new Promise((resolve, reject) => {
                    bcrypt.hash(decodeURIComponent(password), saltRounds, (err, hash) => {
                        if (err)
                        {
                            reject(err)
                        }

                        resolve(hash)
                    })
                })

                const hashedPass = await generateHash

                const information = {
                    username : username,
                    data: {
                        email: email,
                        password: hashedPass
                    }
                }
                await collection.insertOne(information)
                const secretKey: any = process.env.SECRET_KEY

                const jwtExpirationTime = process.env.JWT_EXPIRATION

                const accessToken = jwt.sign({time: Date(), username: username}, secretKey, {
                    expiresIn: jwtExpirationTime
                }) 

                NextResponse.next().headers.set('Set-Cookie', `cookieToken=${accessToken}; Path=/; HttpOnly`)

                return NextResponse.json({
                    message: "Success",
                    username: username
                }, {status: 200})
            }

        }

        catch (e: any)
        {
            throw new Error(e?.message)
        }

        finally
        {
            await client.close()
        }

}
    