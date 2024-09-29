"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import SidebarItemList from "../widgets/SideBarItemList";

export default function Sidebar({ className }: { className: string }) {
  const router = useRouter();
  return (
    <nav className={` ${className}`}>
      <SidebarItemList />
      <button
        onClick={() => {
          Cookies.remove("loggedIn");
          router.push("/auth/login");
        }}
        className=" mx-4  mb-12 bg-white  text-black h-12 w-max px-12 rounded-xl"
      >
        Logout
      </button>
    </nav>
  );
}
