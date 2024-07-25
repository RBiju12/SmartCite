import Link from 'next/link'
import { useState } from 'react'

type Props = {
  username: string | null
}

interface Navigation {
  home: boolean,
  generator: boolean,
  dashboard: boolean
}

export default function Navbar({username}: Props) 
{
  const [pressed, setPressed] = useState<Navigation>({
    home: false,
    generator: false,
    dashboard: false
  })

  return (
    <div className='flex flex-col space-y-10'>
    <ul>
      <div> 
      <Link href="/" legacyBehavior>
      <a onClick={() => setPressed({
        home: true,
        generator: false,
        dashboard: false
      })} style={{color: pressed?.home ? 'purple' : 'black'}}>
         Home
      </a>
      </Link>
    </div>
 
    <div>
      <Link href="/pages/generator" legacyBehavior>
      <a onClick={() => setPressed({
        home: false,
        generator: true,
        dashboard: false
      })} style={{color: pressed?.generator ? 'purple' : 'black'}}>
        Generator
      </a>
      </Link>
    </div>

    {username && 
    <div>
      <Link href={`/pages/${username}/dashboard`} legacyBehavior>
      <a onClick={() => setPressed({
        home: false,
        generator: false,
        dashboard: true
      })} style={{color: pressed?.dashboard ? 'purple' : 'black'}}>  
        My Dashboard
      </a>
      </Link>
    </div>    
    }
    </ul>
    </div>
  )
}
