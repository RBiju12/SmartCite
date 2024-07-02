import { NextResponse } from "next/server";

export default function middleware() {
    const res = NextResponse.next()

    console.log("Working")

    res.headers.append('Access-Control-Allow-Origin', '*') 

    return res
}


export const config = {
    matcher: ['/api/:path*']
}