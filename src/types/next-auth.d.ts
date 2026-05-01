import type { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      profileId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    profileId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    profileId?: string;
  }
}
