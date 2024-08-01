'use client'

import { Suspense } from 'react'
import GoogleButton from 'react-google-button'
import { useSession } from 'next-auth/react'
import {signIn} from 'next-auth/react'
import Cookies from 'js-cookie'

export default function GoogleAuth()
{
    const {data: session, status} = useSession()

    if (status === 'loading')
    {
        return <Suspense fallback={<h1>Loading...</h1>}/>
    }

    const isVerified = (email: string) => {
        const uniqueKey = email.split('@')[1].split('.')[0]
        const valid_emails  = [`${uniqueKey}.com`]
        return email.includes(valid_emails[0]) && status === 'authenticated'
    }

    const handleSignIn = async(): Promise<void> => {
        await signIn('google')
    }

    if (session && isVerified(session?.user?.email as string))
    {
        Cookies.set('username', session?.user?.email as string, {secure: true})
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