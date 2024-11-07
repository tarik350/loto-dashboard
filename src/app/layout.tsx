"use client";
import { RootState, store } from "@/store/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Provider } from "react-redux";
import "./globals.css";
import { useAppSelector } from "@/store/rootHooks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname().split("/").slice(-1)[0];
  // useEffect(() => {
  //   console.log(pathname);
  // }, [pathname]);

  return (
    <Provider store={store}>
      <html lang="en">
        <body className="  ">{children}</body>
      </html>
    </Provider>
  );
}
