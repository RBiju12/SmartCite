'use client'

import GoogleButton from 'react-google-button'
import { useSession } from 'next-auth/react'
import {signIn} from 'next-auth/react'
import {cookies} from 'next/headers'

export default function GoogleAuth()
{
    const {data: session, status} = useSession()

    if (status === 'loading')
    {
        return <h1>...Loading</h1>
    }

    const isVerified = (email: string) => {
        const uniqueKey = email.split('@')[1].split('.')[0]
        const valid_emails  = [`${uniqueKey}.com`]
        return valid_emails.includes(uniqueKey) && status === 'authenticated'
    }

    const handleSignIn = async(): Promise<void> => {
        await signIn('google')
    }

    if (session && isVerified(session?.user?.email as string))
    {
        cookies().set('username', session?.user?.email as string)
    }

    return(
        <main>
            {session ?
             (
              isVerified(session?.user?.email as string) ?
              <div>
              <p>Verified</p>
              </div>
              : <p>Not Verified</p>)
             : 
             (<GoogleButton onClick={handleSignIn} className='mx-auto mt-16'/>)}
        </main>
    )
}