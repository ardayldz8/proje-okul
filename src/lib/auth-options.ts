import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/teacher/login",
  },
  providers: [
    CredentialsProvider({
      name: "E-posta ve sifre",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Sifre", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const profile = await db.profile.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: { user: true },
        });

        if (!profile || !profile.isActive) {
          return null;
        }

        const passwordMatches = await verifyPassword(parsed.data.password, profile.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: profile.user.id,
          email: profile.email,
          name: profile.fullName,
          role: profile.role,
          profileId: profile.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.profileId = user.profileId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
        session.user.profileId = token.profileId;
      }

      return session;
    },
  },
};
