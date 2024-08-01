'use client'

import {TypeAnimation} from 'react-type-animation'
import {useRouter} from 'next/navigation'
import useCookies from './hooks/useCookies'
import ReactiveButton from 'reactive-button'
import {useState} from 'react'
import Image from 'next/image'
import logo from '../app/assets/logo.png'

export default function Home() {
  const isLoggedIn: string | null = useCookies()
  const [isOpened, setIsOpened] = useState<string | undefined>('idle')
  const [isPressed, setIsPressed] = useState<string | undefined>('idle')
  const router = useRouter()

  const handleOpen = (title: string) => 
  {
     setIsOpened('success')
     router.push(`/pages/${title}`)

     return 'Success...'
  }

  const handlePress = (title: string) => 
    {
       setIsPressed('success')
       router.push(`/pages/${title}`)
  
       return 'Success...'
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <Image src={logo} alt='Logo'/>
      <div className="flex flex-col space-y-10 font-mono text-sm lg:">
        <h1 className='flex items-center justify-center' style={{color: 'white', fontSize: 20}}>Welcome to SmartCite</h1>
        <TypeAnimation sequence={['"Summarize and Cite in Seconds"', 3000, '"We are the future of Automation"', 3000, '"Your Research, Simplified and Automated"', 3000]} wrapper='h2' style={{color: 'white', fontSize: 20}} repeat={Infinity} />
      </div>
      <div className='relative bottom-50 flex flex-col space-y-20 items-center justify-between'>
      {isLoggedIn === null &&
        <>
          <ReactiveButton rounded idleText='SignUp' loadingText='Loading' successText='Done' size='large' buttonState={isOpened} onClick={() => setIsOpened('loading')}/>
          {isOpened === 'loading' && handleOpen('signup')}
          <ReactiveButton rounded idleText='Login' loadingText='Loading' successText='Done' size='large' buttonState={isPressed} onClick={() => setIsPressed('loading')}/>
          {isPressed === 'loading' && handlePress('login')}
        </>
      }
      </div>
      
    </main>
  );
}
