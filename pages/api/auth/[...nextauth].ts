import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

interface CustomSession extends Session {
  idToken?: string;
}

interface CustomJWT extends JWT {
  idToken?: string;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }: {
      session: CustomSession;
      token: CustomJWT;
      user: any;
    }): Promise<CustomSession> {
      session.idToken = token.idToken;
      return session;
    }
  }
});