import React from 'react'
import Link from 'next/link'

export default function Navbar()
{
  return (
    <div>
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
        <Link href="/user/dashboard">
          Dashboard
        </Link>
      </li>
    </div>
  )
}
