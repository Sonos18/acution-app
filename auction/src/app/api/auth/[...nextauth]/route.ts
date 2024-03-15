
import { session } from '@/lib/session'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";

const GOOGLE_CLIENT_ID = "1071565071627-t4a9fcrh4v4v4pvh199f1597opn5no5f.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
const GIT_CLIENT_ID="d2f2bf8fe656f8a6500e"
const GIT__CLIENT_SECRET="807f6593d1685e0b4ea95510ef868fdeb503f558"


const authOption: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: GIT_CLIENT_ID,
      clientSecret: GIT__CLIENT_SECRET
    })
  
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        throw new Error('No profile')
      }
      console.log(profile);
      return true
    },
    session,
    async jwt({ token, user, account, profile }) {
      if (profile) {
        // if (!user) {
        //   throw new Error('No user found')
        // }
        token.id ="shafghdsfg"
      }
      return token
    },
  },
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }