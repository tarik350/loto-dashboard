"use client";
import Sidebar from "@/components/sidebar/view/SidebarView";
import type { Metadata } from "next";
import "../globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <html lang="en">
      {isMounted && (
        <body className="grid grid-cols-[18rem_calc(100%_-18rem)] w-screen h-screen overflow-hidden">
          <Sidebar className="h-full overflow-hidden shadow-xl bg-purple flex flex-col justify-between" />
          <main className="">{children}</main>
        </body>
      )}
    </html>
  );
}
