"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import Footer from "./Footer";
import Navbar from "./Navbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAdminDashboard) {
    return <AdminSidebar>{children}</AdminSidebar>;
  }

  return (
    <>
      {!isAuthPage ? <Navbar /> : null}
      <div className="customer-content min-h-screen bg-white">{children}</div>
      {!isAuthPage ? <Footer /> : null}
    </>
  );
}
