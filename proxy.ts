import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "creator_studio_session";

const PUBLIC_PAGES = [
  "/",
  "/login",
  "/register",
];

const PUBLIC_API = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
  "/api/auth/logout",
];

function matchesPath(pathname: string, path: string) {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isPublicPage(pathname: string) {
  return PUBLIC_PAGES.some((path) => matchesPath(pathname, path));
}

function isPublicApi(pathname: string) {
  return PUBLIC_API.some((path) => matchesPath(pathname, path));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/")
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const loggedIn = Boolean(session);

  if (isPublicPage(pathname)) {
    if (
      loggedIn &&
      (pathname === "/login" || pathname.startsWith("/login/") ||
        pathname === "/register" || pathname.startsWith("/register/"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (isPublicApi(pathname)) {
      return NextResponse.next();
    }

    if (!loggedIn) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Login diperlukan.",
        },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  if (!loggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};