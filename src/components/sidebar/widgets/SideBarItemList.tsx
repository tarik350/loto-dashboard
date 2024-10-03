"use client";

import { sidebarItems } from "@/utils/constants";
import { sidebarItemType } from "@/utils/types";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";

export default function SidebarItemList() {
  const router = useRouter();
  const pathname = usePathname();
  const [showSubroute, setShowSubroute] = useState<boolean>(false);

  const subrouteVariant: Variants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  const highlightRoute = (item: sidebarItemType): boolean => {
    if (item.route === pathname) return true;
    if (!item.subRoute) return false;
    if (showSubroute) return false;
    if (item.subRoute.some((subroute) => subroute.route === pathname))
      return true;

    return false;
  };

  return (
    <div className=" flex flex-col gap-2   mx-4 ">
      <h1 className="  text-[28px] max- font-[800]   mt-4  mb-6 mx-auto border-2 text-white border-white px-12 py-4">
        Logo
      </h1>
      <ul className="  flex flex-col gap-2   ">
        {sidebarItems.map((item, index) => {
          return (
            <div>
              <button
                type="button"
                onClick={() => {
                  if (!item.subRoute) {
                    router.push(item.route);
                  } else {
                    setShowSubroute(!showSubroute);
                  }
                }}
                key={index}
                className={` flex  justify-between  group hover:text-textColor hover:bg-white w-full  pr-8 py-2 rounded-xl items-center gap-2 cursor-pointer  ${
                  highlightRoute(item) && "bg-white text-textColor"
                } border-2 py-4 my-1`}
              >
                <div className=" flex  items-center ">
                  <item.icon
                    className={`${item.className} group-hover:fill-textColor ${
                      highlightRoute(item) ? "fill-textColor" : "fill-white"
                    } `}
                  />
                  <p
                    className={` font-[600] text-[18px] group-hover:text-textColor ${
                      highlightRoute(item) ? "text-textColor" : "text-white"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
                {item.subRoute && (
                  <BiSolidDownArrow
                    className={` group-hover:fill-textColor ${
                      highlightRoute(item) ? "fill-textColor" : "fill-white"
                    } `}
                  />
                )}
              </button>
              <AnimatePresence>
                {item.subRoute && showSubroute && (
                  <motion.ul
                    variants={subrouteVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      ease: "easeInOut",
                      duration: ".5",
                      type: "spring",
                      // damping: "100",
                    }}
                    className={`flex flex-col gap-2  ml-6 `}
                  >
                    {item.subRoute.map((subroute, subrouteIndex) => {
                      return (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(subroute.route);
                          }}
                          className={`border-white border-2  group hover:text-textColor hover:bg-white cursor-pointer py-2  rounded-xl flex items-center  gap-4 px-4  ${
                            pathname === subroute.route && "bg-white"
                          }`}
                          key={subrouteIndex}
                        >
                          <subroute.icon
                            className={` group-hover:fill-textColor ${
                              pathname === subroute.route
                                ? "fill-textColor"
                                : "fill-white"
                            } `}
                          />
                          <p
                            className={` font-[600] text-[18px] group-hover:text-textColor ${
                              pathname !== subroute.route && "text-white "
                            }`}
                          >
                            {subroute.title}
                          </p>
                        </button>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
