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

  async function authenticate(formData: FormData)
  {
      if (title === 'signup')
      {
         try
         {
            const data: FormInfo = {
               username: formData.get('username'),
               email: formData.get('email'),
               password: formData.get('password')
            }

            const authToken: any = process.env.SECRET_KEY

            const headers: {Authorization: string} = {
              Authorization: `${authToken}`
            }
            
            const res = await axios.post(`http://localhost:3000/api/${title}`, {
              headers,
              data
            })

            if (res?.status === 200)
            {
               Cookies.set('username', res?.data?.username, {secure: true})
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
          const data: LoginInfo = {
            username: formData.get('username'),
            password: formData.get('password')
          }

          const query = `?username=${data.username}&password=${data.password}`
          const res = await axios.get(`http://localhost:3000/api/${title}` + query)

          if (res?.status === 200)
          {
            Cookies.set('username', res?.data?.username, {secure: true})
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
    <>
    <SessionProvider>
      <div>
        <title className='flex items-center justify-center'>{title}</title>
      </div>

      <main>
        <form action={authenticate}>
        {title === 'signup' ? 
        <div className='flex flex-col space-y-6'>
          <input id="username" type='text' placeholder='Enter username' required />

          <input id="email" type='text' placeholder='Enter email address' required />

          <input id="password" type='text' placeholder='Enter password' required />

          <button type='submit'>Submit</button> 
        </div>
        :
        <div className='flex flex-col space-y-6'>
          <input id="username" type='text' placeholder='Enter username' required />

          <input id="password" type='text' placeholder='Enter password' required />

          <button type='submit'>Submit</button> 
        </div>}      
        </form>

      <GoogleAuth />
      </main>
      </SessionProvider>
    </>
  )
}

export default Form
