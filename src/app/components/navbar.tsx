import Link from 'next/link'

type Props = {
  username: string
}

export default async function Navbar({username}: Props) 
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

    {username ?? 
    <li>
      <Link href={`/${username}/dashboard`}>
        My Dashboard
      </Link>
    </li> 
    }
    
    </>
      
  )
}
