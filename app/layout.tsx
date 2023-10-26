import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { ClientCookiesProvider } from "@/providers/cookieProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSO",
  description: "Single Sign On",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <ClientCookiesProvider value={cookies().getAll()}>
          {children}
        </ClientCookiesProvider>
      </body>
    </html>
  );
}
