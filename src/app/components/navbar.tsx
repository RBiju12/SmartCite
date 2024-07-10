import React, { use } from 'react'
import type {GetServerSideProps} from 'next'
import axios from 'axios'
import Slider from './slider'


interface Props {
  username: string
  response: {
    success: string
  }
}

interface Response {
  success: string
}

//create another api route that determines if the user has been authenticated by checking its cookies in the the api route, if the cookies
//match the particular sessionToken then return True 
export async function GetServerSideProps()
{
    try
    {
      const apiRequest: any = process.env.API_VERIFICATION

      const response: Response = await axios.get(apiRequest)

      return {
        props: {
          response
        }
      }

    }
    catch(e: any)
    {
      throw new Error(e)
    }
}


export default function Navbar({response, username}: Props)
{
  return (
    <div>
      {response.success === "Authorized" ?
      <Slider username={username}/>: 'Please SignUp'
      }
    </div>
      
  )
}
