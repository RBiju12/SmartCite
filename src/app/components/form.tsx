'use client'
import React from 'react'
import GoogleAuth from './GoogleAuth'
import axios from 'axios'
import Cookies from 'js-cookie'
import { SessionProvider } from 'next-auth/react'

type Props = {
  title: string
}

interface FormInfo {
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface LoginInfo {
    username: FormDataEntryValue | null, 
    password: FormDataEntryValue | null
}



const Form = ({title}: Props) => {

  async function authenticate(e: any)
  {
      const formData: any = new FormData(e?.target)

      if (title === 'signup')
      {

         try
         {

            if (!formData)
            {
              throw new Error("Fields need to be present")
            }

            const data: FormInfo = {
              username: formData.get('username') as string,
              password: encodeURIComponent(formData.get('password') as string),
              email: formData.get('email') as string
            }

            const authToken = process.env.SECRET_KEY as string

            const headers: {Authorization: string} = {
              Authorization: `${authToken}`
            }

            
            const res: any = await fetch(`http://localhost:3000/api/${title}`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(data)
            })

            const result = await res.json()

            if (result?.status === 200)
            {
               Cookies.set('username', result?.username, {secure: true})
               return res?.data?.message
            }
            else
            {
              return "Error Signing Up"
            }

         }

         catch (e: any)
         {
           throw new Error(e?.message)
         }
      }

      else
      {
        try
        {
            if (!formData || !formData.get('username') || !formData.get('password'))
            {
               throw new Error("Fields need to be present")
            }

            const encodedPass = encodeURIComponent(formData.get('password') as string)
            const query = `?username=${formData.get('username')}&password=${encodedPass}}`

            const res = await fetch(`http://localhost:3000/api/${title}` + query, {
              method: 'GET',
            })

            const response = await res.json()

            if (response?.status === 200)
            {
              Cookies.set('username', response?.data?.username, {secure: true})
              return "Authorized"
            }
            else
            {
              return "Not Authorized"
            }

          }
          catch (e: any)
          {
            throw new Error(e?.message)
          }

      }

  }

  return (
    <div className='h-screen flex justify-center bg-black'>
    <SessionProvider>
      <main className='my-40'>
        <h1 style={{color: 'white', textAlign: 'center',fontSize: 25}}>{title.split('i')[0].toUpperCase() + title.slice(1, title.length)}</h1>
        <br />
        <br />
        <br />
        <form onSubmit={(e) => authenticate(e)} className='flex items-center align-items'>

        {title === 'signup' ? 
        <div className='flex flex-col justify-center items-center space-y-6'>
          <input name="username" type='text' placeholder='Enter username' required />

          <input name="email" type='text' placeholder='Enter email address' required />

          <input name="password" type='text' placeholder='Enter password' required />

          <button type='submit' style={{width: 100}} className='bg-purple-500'>Submit</button> 
        </div>
        :
        <div className='flex flex-col space-y-6'>
          <input name="username" type='text' placeholder='Enter username' required />

          <input name="password" type='text' placeholder='Enter password' required />

          <button type='submit' style={{width: 100}} className='bg-purple-500'>Submit</button> 
        </div>}      
        </form>
      <div className='absolute bottom-40'>
        <GoogleAuth />
      </div>
      </main>
      </SessionProvider>
    </div>
  )
}

export default Form
