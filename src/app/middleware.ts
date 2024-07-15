import {NextRequest, NextResponse} from "next/server";

export default function middleware(request: NextRequest, response: NextResponse) 
{
    response.headers.append('Access-Control-Allow-Origin', '*') 

    return response
}

export const config = {
    matcher: '/api/:*'
}
