import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const id: any = process.env.GOOGLE_ID
const secret: any = process.env.GOOGLE_SECRET

const handler: any = NextAuth({ 
 providers: [
  GoogleProvider({
   clientId: id,
   clientSecret: secret,
  }),
 ],
 session: {
  strategy: 'jwt',
 },
});


export {handler as GET, handler as POST};