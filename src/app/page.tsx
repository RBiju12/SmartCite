'use client'
import {TypeAnimation} from 'react-type-animation'
import Form from './components/Form'
import {Button} from '@mui/material'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black">
      <div className="flex flex-col space-y-40 items-center justify-between font-mono text-sm lg:">
        <h1 className='flex items-center justify-center' style={{color: 'white', fontSize: 20}}>Welcome to SmartCite</h1>
        <TypeAnimation sequence={['"Summarize and Cite in Seconds"', 3000, '"We are the future of Automation"', 3000, '"Your Research, Simplified and Automated"', 3000]} wrapper='h2' style={{color: 'white', fontSize: 20}} repeat={Infinity} />
      </div>
      <div className='relative bottom-30 flex items-center justify-between flex-row space-x-80'>
        <Button variant='contained'>Sign Up</Button>
        <Button variant='contained'>LogIn</Button>
      </div>
      
    </main>
  );
}
