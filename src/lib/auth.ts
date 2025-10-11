import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(
          "🔐 [AUTH] authorize called with email:",
          credentials?.email
        );

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [AUTH] Missing credentials");
          return null;
        }

        try {
          console.log("🔍 [AUTH] Looking for user in database...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("❌ [AUTH] User not found in database");
            return null;
          }

          console.log(
            "✅ [AUTH] User found:",
            user.email,
            "- Has password:",
            !!user.password
          );

          if (!user.password) {
            console.log("❌ [AUTH] User has no password field");
            return null;
          }

          console.log("🔑 [AUTH] Comparing passwords...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log("🔑 [AUTH] Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("❌ [AUTH] Invalid password");
            return null;
          }

          console.log("✅ [AUTH] Authentication successful!");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("❌ [AUTH] Error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
