import { session } from "@/lib/session";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
const GIT_CLIENT_ID = process.env.GIT_CLIENT_ID ?? "";
const GIT_CLIENT_SECRET = process.env.GIT_CLIENT_SECRET ?? "";

console.log(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GIT_CLIENT_ID,
  GIT_CLIENT_SECRET
);

const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: GIT_CLIENT_ID,
      clientSecret: GIT_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        throw new Error("No profile");
      }
      console.log(profile);
      return true;
    },
    session,
    async jwt({ token, user, account, profile }) {
      if (profile) {
        // if (!user) {
        //   throw new Error('No user found')
        // }
        token.id = "shafghdsfg";
      }
      return token;
    },
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
