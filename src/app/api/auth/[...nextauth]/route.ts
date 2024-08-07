import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';


export const handler: any = NextAuth({
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_ID as string,
   clientSecret: process.env.GOOGLE_SECRET as string,
   authorization: {
    params: {
        prompt: 'consent',
        access_type: 'offline',
        response_type: 'code'
    }
   }
  }),
 ],
   secret: process.env.SECRET_KEY as string,
 })

export {handler as GET, handler as POST}