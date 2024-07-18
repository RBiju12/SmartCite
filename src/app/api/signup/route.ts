import { NextRequest, NextResponse} from "next/server";
import {MongoClient} from 'mongodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 


export default async function POST(req: NextRequest): Promise<any>
{
        const {username, email, password} = await req.json()
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
                return NextResponse.json({
                    message: 'User already Exists'
                })
            }

            else
            {
                const information = {
                    username : username,
                    data: {
                        email: email,
                        password: hashedPass
                    }
                }
                collection.insertOne(information)
                const secretKey: any = process.env.SECRET_KEY

                const jwtExpirationTime = process.env.JWT_EXPIRATION

                const accessToken = jwt.sign({time: Date(), username: username}, secretKey, {
                    expiresIn: jwtExpirationTime
                }) 

                NextResponse.next().headers.set('Set-Cookie', `cookieToken=${accessToken}; Path=/; HttpOnly`)

                return NextResponse.json({
                    message: "Success",
                    username: username
                })
            }

        }

        catch (e: any)
        {
            return NextResponse.json({message: 'Error'})
        }

        finally
        {
            await client.close()
        }

}
    