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
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/navbar/NavBar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mauliburan.com"), // Tambahkan ini
  title: "Mauliburan - Rencana Wisata & Booking Hotel",
  description:
    "Buat rencana liburan, booking hotel, dan temukan pengalaman wisata terbaik di berbagai kota di Indonesia!",
  icons: "/malib-logo-circle.png",
  openGraph: {
    title: "Mauliburan - Rencana Wisata & Booking Hotel",
    description:
      "Buat rencana liburan, booking hotel, dan temukan pengalaman wisata terbaik di berbagai kota di Indonesia!",
    url: "https://mauliburan.com",
    siteName: "Mauliburan",
    images: [
      {
        url: "/malib-logo-circle.png", // Path relatif
        width: 1200,
        height: 630,
        alt: "Mauliburan - Rencana Wisata & Booking Hotel",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mauliburan - Rencana Wisata & Booking Hotel",
    description:
      "Buat rencana liburan, booking hotel, dan temukan pengalaman wisata terbaik di berbagai kota di Indonesia!",
    images: ["/malib-logo-circle.png"], // Path relatif
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;


  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/malib-logo-circle.png" />
        <meta name="agd-partner-manual-verification" />
      </head>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <GoogleOAuthProvider clientId={clientId || ""}>
        <body className={inter.className}>
          <div className="overflow-x-hidden w-screen">
            <NavBar />

            {children}
          </div>
          <Toaster />
        </body>
      </GoogleOAuthProvider>
    </html>
  );
}
