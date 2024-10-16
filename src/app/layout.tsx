"use client";
import { store } from "@/store/store";
import { authPages } from "@/utils/constants";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Provider } from "react-redux";
import "./globals.css";

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
    <Provider store={store}>
      <html lang="en">
        {authPages.includes(pathname) ? (
          <body className=" h-screen grid grid-cols-2 ">
            <nav className=" bg-purple w-full flex  ">
              <h1 className="text-white text-[44px] font-[700] m-auto border-[12px] py-12 px-24">
                Logo
              </h1>
            </nav>
            <main className="h-full flex m-auto">{children}</main>
          </body>
        ) : (
          <body className="  ">{children}</body>
        )}
      </html>
    </Provider>
  );
}
