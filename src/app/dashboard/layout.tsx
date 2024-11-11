"use client";
import Sidebar from "@/components/sidebar/view/SidebarView";
import { useAppSelector } from "@/store/rootHooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../globals.css";

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
    if (session.isSessionExpired === "expired") {
      router.push("/login");
    }
  }, [session.isSessionExpired]);
  return (
    <>
      {isMounted && (
        <div className="grid grid-cols-[18rem_calc(100%_-18rem)] w-screen h-screen overflow-hidden ">
          <Sidebar className="h-full overflow-hidden  shadow-xl bg-purple flex flex-col justify-between" />
          <main className=" overflow-y-auto h-screen  ">{children}</main>
        </div>
      )}
    </>
  );
}
