import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Guard } from "@/components/guard";

export const metadata: Metadata = {
  title: "LedgerPay",
  description: "Modern Accounting System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Providers>
          <Guard>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto bg-gray-50">
                  {children}
                </main>
              </div>
            </div>
          </Guard>
        </Providers>
      </body>
    </html>
  );
}
