"use client";
import { store } from "@/store/store";
import { authPages } from "@/utils/constants";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname().split("/").slice(-1)[0];
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  return (
    <div className=" h-screen w-screen   flex bg-softLavender">
      <div className="  m-auto w-[28rem] ">
        <div>
          {/* logo goes here */}
          <h1 className=" text-center font-bold text-[2rem] mb-12">
            EDIL DASHBOARD
          </h1>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
