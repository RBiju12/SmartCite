'use client'
import React, {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
 
import Squash from 'hamburger-react'
import Navbar from '../components/Navbar'

export default function Slider()
{
  const [toggle, setToggle] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')

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

  return (
      <div className='absolute top-0 right-20 bg-black'>
        <Squash toggled={toggle} toggle={setToggle} color='white' />
        {toggle ? <Navbar username={username ? username : null}/> : null}
      </div>
  )
}

