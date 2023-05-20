import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from '../../../src/config';

interface CustomSession extends Session {
  idToken?: string;
}

interface CustomJWT extends JWT {
  idToken?: string;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || '',
      clientSecret: GOOGLE_CLIENT_SECRET || ''
    }),
  ],
  secret: JWT_SECRET,
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