import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" h-screen grid grid-cols-2 ">
        <nav className=" bg-textColor w-full flex  ">
          <h1 className="text-white text-[44px] font-[700] m-auto border-[12px] py-12 px-24">
            Logo
          </h1>
        </nav>
        <main className="h-full flex m-auto">{children}</main>
      </body>
    </html>
  );
}
