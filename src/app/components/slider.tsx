import React from 'react'
import Link from 'next/link'

type UserName = {
  username: string
}

export default function Slider({username}: UserName)
{
  return (
      <>
      <li> 
      <Link href="/">
        Smart Cite
      </Link>
    </li>

    <li>
      <Link href="/pages/generator">
        Generator
      </Link>
    </li>

    <li>
      <Link href={`/${username}/dashboard`}>
        My Dashboard
      </Link>
    </li> 
    </>
  )
}

