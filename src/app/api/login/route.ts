import { NextRequest, NextResponse} from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 


export async function GET(req: NextRequest): Promise<any>
{ 
    try
    {
        const {searchParams} = new URL(req?.url)
        const username = searchParams.get('username')
        const password = searchParams.get('password')

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

                const query = collection.findOne({username: username})
                const handleQuery = await query

                if (handleQuery === null)
                {
                    return Response.json({message: 'No account associated, please signup'}, {status: 401})
                }

                const jwtRefreshToken: any = process.env.JWT_REFRESHKEY
                const jwtRefreshExpiration: any = process.env.JWT_REFRESHEXPIRATION

                const refreshToken = jwt.sign({time: Date(), username: username}, jwtRefreshToken, {
                    expiresIn: jwtRefreshExpiration
                })

                const hashedPass = handleQuery?.data?.password
                console.log(decodeURIComponent(password))

                if (hashedPass)
                {

                    const result: any = new Promise((resolve, reject) => {
                        bcrypt.compare(decodeURIComponent(password), hashedPass, async(err, result) => {
                            if (err)
                            {
                                reject(err)
                            }

                            resolve(result)
                        })
                    })

                    const getResult = await result
                
                    if (getResult)
                    {
                        NextResponse.next().headers.set('Set-Cookie', `cookieToken=${refreshToken}; Path=/; HttpOnly`)
                        return Response.json({
                            message: 'Authorized',
                            username: username
                        }, {status: 200})
                    
                    }
                    else
                    {
                        return Response.json({
                            message: 'Not Authorized'
                        }, {status: 401})
                    }

                }
                else
                {
                    return Response.json({message: 'Hashed Password not present'}, {status: 400})
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

        else
        {
            return Response.json({
                message: 'Not Valid Credentials'
            }, {status: 401})
        }   
        
        
    }
    catch(e: any)
    {
        throw new Error(e?.message)
    }

}