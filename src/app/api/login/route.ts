import { NextRequest, NextResponse} from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 


export default async function GET(req: NextRequest): Promise<any>
{ 
    try
    {
        const {username, password} = await req.json()
        const mongoID: any = process.env.MONGO_URI
        const client = new MongoClient(mongoID)

        if (username && password)
        {
            try
            {
                await client.connect()

                const dbName: any = process.env.MONGODB_NAME
                const dbCollectionName: any = process.env.MONGODB_COLLECT

                const db = client.db(dbName)
                const collection = db.collection(dbCollectionName)
                const saltRounds: number = 10
                const hashedPass: any = bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err)
                    {
                        return "Unhashable data"
                    }
    
                    else
                    {
                        return hash
                    }
                })

                const query = collection.findOne({username: username, password: hashedPass})
                const result: any = bcrypt.compare(password, hashedPass, async(err, result) => {
                    if (err)
                    {
                        await client.close()
                        throw new Error(err.message)
                    }
                })

                const jwtRefreshToken: any = process.env.JWT_REFRESHKEY
                const jwtRefreshExpiration: any = process.env.JWT_REFRESHEXPIRATION

                const refreshToken = jwt.sign({time: Date(), username: username}, jwtRefreshToken, {
                    expiresIn: jwtRefreshExpiration
                })

                if (query !== null && result)
                {
                    NextResponse.next().headers.set('Set-Cookie', `cookieToken=${refreshToken}; Path=/; HttpOnly`)
                    return NextResponse.json({
                        message: 'Authorized',
                        username: username
                    })
                }
                else
                {
                    return NextResponse.json({
                        message: 'Not Authorized'
                    })
                }
            }

            catch (e: any)
            {
                throw new Error(e)
            }

            finally
            {
                await client.close()
            }
            
        }

        else
        {
            return NextResponse.json({
                message: 'Not Valid Credentials'
            })
        }   
        
        
    }
    catch(e: any)
    {
        throw new Error(e)
    }

}