import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Headshots AI",
  description: "Generate awesome headshots in minutes using AI",
};


export default function RootLayout({ children }: any) {

  return (
    <html lang="en">
            <body className="min-h-screen flex flex-col">

      <section>
          <Suspense
            fallback={
              <div className="flex w-full px-4 lg:px-40 py-4 items-center border-b text-center gap-8 justify-between h-[69px]" />
            }
          >
            <Navbar />
          </Suspense>
          </section>
          <main className="flex flex-1 flex-col items-center py-16">
          {children}
        </main>
       
        <Toaster />
        <Analytics />
        </body>
    </html>
  );
}
