"use client";

import { sidebarItems } from "@/utils/constants";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SidebarItemList() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className=" flex flex-col gap-2   mx-4">
      <h1 className="  text-[28px] font-[800]   my-4  ">Logo</h1>

      <ul className="  flex flex-col gap-2  ">
        {sidebarItems.map((item, index) => {
          return (
            <a
              onClick={() => {
                router.push(item.route);
              }}
              key={index}
              className={` flex   group hover:text-textColor hover:bg-white w-full  pr-8 py-2 rounded-xl items-center gap-2 cursor-pointer  ${
                pathname === item.route && "bg-white text-textColor"
              } border-2 py-4 my-1`}
            >
              <item.icon
                className={`${item.className} group-hover:fill-textColor ${
                  pathname === item.route ? "fill-textColor" : "fill-white"
                } `}
              />
              <p
                className={` font-[600] text-[18px] group-hover:text-textColor ${
                  pathname !== item.route && "text-white "
                }`}
              >
                {item.title}
              </p>
            </a>
          );
        })}
      </ul>
    </div>
  );
}
