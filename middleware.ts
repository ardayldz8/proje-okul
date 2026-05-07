import { UserRole } from "@prisma/client";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/teacher/login")) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        return token?.role === UserRole.ADMIN;
      }

      if (pathname.startsWith("/teacher")) {
        return token?.role === UserRole.TEACHER || token?.role === UserRole.ADMIN;
      }

      return true;
    },
  },
  pages: {
    signIn: "/teacher/login",
  },
});

export const config = {
  matcher: ["/admin", "/teacher/:path*"],
};
