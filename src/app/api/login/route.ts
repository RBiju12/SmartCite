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
                    return NextResponse.json({message: 'No account associated, please signup'})
                }

                const jwtRefreshToken: any = process.env.JWT_REFRESHKEY
                const jwtRefreshExpiration: any = process.env.JWT_REFRESHEXPIRATION

                const refreshToken = jwt.sign({time: Date(), username: username}, jwtRefreshToken, {
                    expiresIn: jwtRefreshExpiration
                })

                const hashedPass = handleQuery?.data?.password

                if (hashedPass)
                {

                    const result: any = new Promise((resolve, reject) => {
                        bcrypt.compare(password, hashedPass, async(err, result) => {
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
                else
                {
                    throw new Error('Password cannot be empty')
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
            return NextResponse.json({
                message: 'Not Valid Credentials'
            })
        }   
        
        
    }
    catch(e: any)
    {
        throw new Error(e?.message)
    }

}