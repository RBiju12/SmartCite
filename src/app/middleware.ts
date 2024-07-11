import {NextRequest, NextResponse} from "next/server";

export default function middleware(request: NextRequest, response: NextResponse) 
{
    
    // res.headers.append('Access-Control-Allow-Origin', '*') 

    if (request.nextUrl.pathname.endsWith('/login'))
    {
        //Basically get the json response from the backend and pull the jwt tokens and verify that refresh token
        //Matches up with the SECRET key and if it does regenerate another key and modify
        //the response by sending additionally info saying that your authenticated else say that your not authorized 
        //Don't forget about CORS and enabling it
    }
}
