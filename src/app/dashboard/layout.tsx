"use client";
import Sidebar from "@/components/sidebar/view/SidebarView";
import type { Metadata } from "next";
import "../globals.css";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/rootHooks";
import { debug } from "console";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);
  const session = useAppSelector((state) => state.session);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  useEffect(() => {
    console.log("your session has expird");
    console.log(session.isSessionExpired);
    if (session.isSessionExpired === "expired") {
      router.push("/login");
    }
  }, [session.isSessionExpired]);
  return (
    <>
      {isMounted && (
        <div className="grid grid-cols-[18rem_calc(100%_-18rem)] w-screen h-screen overflow-hidden">
          <Sidebar className="h-full overflow-hidden shadow-xl bg-purple flex flex-col justify-between" />
          <main className="  ">{children}</main>
        </div>
      )}
    </>
  );
}
