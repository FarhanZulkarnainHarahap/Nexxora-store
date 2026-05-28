import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexxora",
  description: "Nexxora e-commerce experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#415A77",
              color: "#F8F9FA",
              border: "1px solid rgba(248, 249, 250, 0.12)",
            },
            success: {
              iconTheme: {
                primary: "#22C55E",
                secondary: "#1B263B",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#F8F9FA",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
