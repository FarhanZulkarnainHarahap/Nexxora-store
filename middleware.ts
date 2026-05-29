import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "nexxora_token";
const DEFAULT_API_URL = "http://localhost:8000/api";
const API_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

type UserRole = "USER" | "ADMIN";

function normalizeApiBaseUrl(url?: string) {
  const cleanUrl = (url ?? DEFAULT_API_URL).trim().replace(/\/+$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
}

function buildApiUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
}

const customerRouteMap: Record<string, string> = {
  "/home": "/dashboard/customer/home",
  "/catalog": "/dashboard/customer/catalog",
  "/about": "/dashboard/customer/about",
  "/search": "/dashboard/customer/search",
  "/cart": "/dashboard/customer/cart",
  "/checkout": "/dashboard/customer/checkout",
  "/profile": "/dashboard/customer/profile",
  "/notification": "/dashboard/customer/notification",
  "/order": "/dashboard/customer/order",
};

const adminRouteMap: Record<string, string> = {
  "/admin": "/dashboard/admin",
  "/admin/home": "/dashboard/admin/home",
  "/admin/product": "/dashboard/admin/product",
  "/admin/category": "/dashboard/admin/category",
  "/admin/order": "/dashboard/admin/order",
  "/admin/transaction": "/dashboard/admin/transaction",
};

function redirectToLogin(request: NextRequest) {
  const url = new URL("/login", request.url);
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectToRoleHome(request: NextRequest, role: UserRole) {
  return NextResponse.redirect(
    new URL(role === "ADMIN" ? "/admin/home" : "/home", request.url),
  );
}

async function getRoleFromDatabase(token: string): Promise<UserRole | null> {
  try {
    const response = await fetch(buildApiUrl("/auth/me"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = (await response.json()) as {
      success?: boolean;
      data?: {
        role?: UserRole;
      };
    };

    return json.success && json.data?.role ? json.data.role : null;
  } catch {
    return null;
  }
}

function getCleanRedirect(pathname: string) {
  if (pathname === "/dashboard" || pathname === "/dashboard/customer") return "/home";
  if (pathname === "/dashboard/admin") return "/admin";
  if (pathname.startsWith("/dashboard/customer/payment")) {
    return pathname.replace("/dashboard/customer/payment", "/payment");
  }
  if (pathname.startsWith("/dashboard/customer/product")) {
    return pathname.replace("/dashboard/customer/product", "/product");
  }
  if (pathname.startsWith("/dashboard/customer/order")) {
    return pathname.replace("/dashboard/customer/order", "/order");
  }
  if (pathname.startsWith("/dashboard/customer")) {
    return pathname.replace("/dashboard/customer", "");
  }
  if (pathname.startsWith("/dashboard/admin")) {
    return pathname.replace("/dashboard/admin", "/admin");
  }

  return null;
}

function getCustomerDestination(pathname: string) {
  if (customerRouteMap[pathname]) return customerRouteMap[pathname];
  if (pathname.startsWith("/product/")) return pathname.replace("/product", "/dashboard/customer/product");
  if (pathname.startsWith("/order/")) return pathname.replace("/order", "/dashboard/customer/order");
  if (pathname.startsWith("/payment/")) return pathname.replace("/payment", "/dashboard/customer/payment");

  return null;
}

function getAdminDestination(pathname: string) {
  return adminRouteMap[pathname] ?? null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cleanRedirect = getCleanRedirect(pathname);

  if (cleanRedirect) {
    return NextResponse.redirect(new URL(cleanRedirect || "/", request.url));
  }

  const customerDestination = getCustomerDestination(pathname);
  const adminDestination = getAdminDestination(pathname);

  if (!customerDestination && !adminDestination) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  const role = await getRoleFromDatabase(token);

  if (!role) {
    return redirectToLogin(request);
  }

  if (adminDestination && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  if (pathname === "/admin" && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/home", request.url));
  }

  if (pathname === "/home" && role === "ADMIN") {
    return redirectToRoleHome(request, role);
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = adminDestination ?? customerDestination ?? pathname;

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/home",
    "/catalog",
    "/about",
    "/search",
    "/cart",
    "/checkout",
    "/profile",
    "/notification",
    "/order/:path*",
    "/product/:path*",
    "/payment/:path*",
    "/admin/:path*",
  ],
};
