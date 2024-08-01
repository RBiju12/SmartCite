import {NextRequest, NextResponse} from "next/server";

export default function middleware(request: NextRequest, response: NextResponse) 
{
    response.headers.append('Access-Control-Allow-Origin', '*') 

    const cookies: any = request.headers.get('cookie')

    if (!request.nextUrl.pathname.endsWith('/login') && !request.nextUrl.pathname.endsWith('/signup'))
    {
        if (cookies)
        {
            let accessToken = cookies.cookieToken
            const accessToken1 = process.env.SECRET_KEY as string 
            const accessToken2 = process.env.JWT_REFRESHKEY as string

            if (accessToken === accessToken1 || accessToken == accessToken2)
            {
                return NextResponse.next()
            }

            else
            {
                return new NextResponse('Please Login or SignUp', {status: 401})
            }
        }

        else
        {
            return new NextResponse('Please Login or SignUp', {status: 401})
        }
    }

    return NextResponse.next()

}

export const config = {
    matcher: '/api/:path*'
}
