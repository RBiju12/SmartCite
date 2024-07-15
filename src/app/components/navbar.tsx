import Link from 'next/link'

type Props = {
  username: string | null
}

export default async function Navbar({username}: Props) 
{
  return (
    <ul>
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

    {username && 
    <li>
      <Link href={`/pages/${username}/dashboard`}>
        My Dashboard
      </Link>
    </li>    
    }
    </ul>
      
  )
}
