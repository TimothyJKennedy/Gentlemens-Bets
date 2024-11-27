import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { JWT } from "next-auth/jwt"
import type { Session, DefaultSession, User, Account, Profile } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import type { NextAuthOptions } from "next-auth"
import type { RequestInternal } from "next-auth"

// NextAuth configuration for handling authentication
const handler = NextAuth({
  // Custom pages for authentication
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  // Define authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Authorize function to validate credentials
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
  // Callbacks for handling JWT and session
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
  // Use JWT for session management
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST } 