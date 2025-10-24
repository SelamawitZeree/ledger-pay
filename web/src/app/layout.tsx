import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "LedgerPay Console",
  description: "Internal console for LedgerPay microservices",
};

export default function RootLayout({ children }: { children: ReactNode }){
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Providers>
          <header className="sticky top-0 z-10 w-full border-b bg-white/90 backdrop-blur">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
              <Link className="font-semibold" href="/dashboard">LedgerPay</Link>
              <div className="ml-auto flex items-center gap-4 text-sm">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <Link href="/accounts" className="hover:underline">Accounts</Link>
                <Link href="/transactions" className="hover:underline">Transactions</Link>
                <Link href="/balances" className="hover:underline">Balances</Link>
                <Link href="/audit" className="hover:underline">Audit</Link>
                <Link href="/login" className="hover:underline">Login</Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
