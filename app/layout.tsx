import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import Header from "@/components/Header";
import Head from "next/head";
import Sidebar from "@/components/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mauliburan",
  description: "Generated by create next app",
  icons: '/malib-logo-short.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;

  return (
    <html lang="en">
      <Head>
                <link rel="icon" href="/malib-logo-short.png" />
            </Head>
      <GoogleOAuthProvider clientId={clientId || ""}>
        <body className={inter.className}>
          <SidebarProvider>
              <AppSidebar />
              <div className="overflow-x-hidden w-screen">
                <SidebarInset>
                    <Header />
                    {children}
                </SidebarInset>
              </div>
          </SidebarProvider>
        </body>
      </GoogleOAuthProvider>
    </html>
  );
}
