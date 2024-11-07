"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import SidebarItemList from "../widgets/SideBarItemList";
import { useAppDispatch } from "@/store/rootHooks";
import { setSessionExpired } from "@/store/features/sessionSlice";

export default function Sidebar({ className }: { className: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <nav className={`    ${className}`}>
      <div className=" h-full overflow-auto">
        <SidebarItemList />
      </div>
      <button
        onClick={() => {
          Cookies.remove("token");
          dispatch(setSessionExpired("pure"));
          router.push("/login");
        }}
        className=" mx-auto my-8 bg-white  text-black h-12 w-max px-12 rounded-xl"
      >
        Logout
      </button>
    </nav>
  );
}
