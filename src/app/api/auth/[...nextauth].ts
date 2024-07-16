import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {Account, Profile} from 'next-auth'


export const authOptions: any = {
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
 }

export default NextAuth(authOptions)
