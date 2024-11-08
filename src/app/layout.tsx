"use client";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className="  ">{children}</body>
      </html>
    </Provider>
  );
}
