'use client'
import React, {useState} from 'react'
import useCookies from '../hooks/useCookies'
 
import Squash from 'hamburger-react'
import Navbar from '../components/Navbar'

export default function Slider()
{
  const [toggle, setToggle] = useState<boolean>(false)
  const cookieData = useCookies()
  

  return (
      <div className='absolute top-0 right-10'>
        <Squash toggled={toggle} toggle={setToggle} color='white' />
        {toggle ? <Navbar username={cookieData ? cookieData : null}/> : null}
      </div>
  )
}

