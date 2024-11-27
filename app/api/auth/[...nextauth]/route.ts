import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { JWT } from "next-auth/jwt"
import type { Session, DefaultSession, User, Account, Profile } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import type { NextAuthOptions } from "next-auth"
import type { RequestInternal } from "next-auth"

const handler = NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !await compare(credentials.password, user.password)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }: {
      token: JWT;
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
    }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token, user }: {
      session: Session & { user?: DefaultSession["user"] };
      token: JWT;
      user: AdapterUser;
    }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email || undefined;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST } 