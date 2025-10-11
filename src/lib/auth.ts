import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true, // Active les logs détaillés
  logger: {
    error: error => console.error("❌ [NEXTAUTH ERROR]", error),
    warn: message => console.warn("⚠️  [NEXTAUTH WARN]", message),
    debug: message => console.log("🐛 [NEXTAUTH DEBUG]", message),
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const timestamp = new Date().toISOString();
        console.log(
          `\n${"=".repeat(60)}\n🔐 [AUTH ${timestamp}] authorize called\nEmail: ${credentials?.email}\n${"=".repeat(60)}`
        );

        if (!credentials?.email || !credentials?.password) {
          console.log(
            "❌ [AUTH] Missing credentials - email or password empty"
          );
          console.log(`   Email provided: ${!!credentials?.email}`);
          console.log(`   Password provided: ${!!credentials?.password}`);
          return null;
        }

        try {
          console.log("🔍 [AUTH] Looking for user in database...");
          console.log(`   Table: public.users`);
          console.log(`   Where: email = '${credentials.email}'`);

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("❌ [AUTH] User not found in database");
            console.log(`   Searched email: ${credentials.email}`);
            return null;
          }

          console.log("✅ [AUTH] User found!");
          console.log(`   ID: ${user.id}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Name: ${user.name || "(no name)"}`);
          console.log(`   Role: ${user.role || "(no role)"}`);
          console.log(`   Has password hash: ${!!user.password}`);

          if (!user.password) {
            console.log("❌ [AUTH] User has no password field in database");
            return null;
          }

          console.log("🔑 [AUTH] Comparing passwords...");
          console.log(`   Password hash length: ${user.password.length}`);
          console.log(
            `   Password hash prefix: ${user.password.substring(0, 7)}`
          );

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log(
            `🔑 [AUTH] Password comparison result: ${isPasswordValid}`
          );

          if (!isPasswordValid) {
            console.log(
              "❌ [AUTH] Invalid password - bcrypt.compare returned false"
            );
            return null;
          }

          console.log(
            "✅ [AUTH] Authentication successful! Returning user object"
          );
          console.log(
            `   Returning: { id: ${user.id}, email: ${user.email}, name: ${user.name} }`
          );

          const returnValue = {
            id: user.id,
            email: user.email,
            name: user.name,
          };

          console.log(
            `${"=".repeat(60)}\n✅ [AUTH] AUTHORIZE COMPLETE - SUCCESS\n${"=".repeat(60)}\n`
          );

          return returnValue;
        } catch (error) {
          console.error("\n❌❌❌ [AUTH] CRITICAL ERROR IN AUTHORIZE ❌❌❌");
          console.error(
            "Error name:",
            error instanceof Error ? error.name : typeof error
          );
          console.error(
            "Error message:",
            error instanceof Error ? error.message : String(error)
          );
          console.error(
            "Error stack:",
            error instanceof Error ? error.stack : "No stack trace"
          );
          console.error(`${"=".repeat(60)}\n`);
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
