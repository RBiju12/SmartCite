'use client'

import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'

export default function useCookies()
{
    const [username, setUsername] = useState<string | null>(null)

    useEffect(() => {
        let cookie = setInterval(() => {
          let data: any = Cookies.get('username')
   
          if (data)
          {
             setUsername(data)
          }
        }, 3000)
   
        return () => clearInterval(cookie)
     }, [])

    return username ? username : null
}