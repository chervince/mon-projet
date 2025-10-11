import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    // Pour les routes admin sauf login, vérifier le rôle
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Vérifier le rôle admin (simplifié, on pourrait faire un appel API)
    // Pour l'instant, on laisse passer et on vérifie côté client
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
