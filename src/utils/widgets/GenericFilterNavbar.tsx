"use client";

import CreateGameModal from "@/utils/modals/CreateGameModal";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { BiFilter, BiPlusCircle, BiSearch } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

export default function GenericFilterNavbar({
  setModalOpen,
  filterStrings,
  buttonTitle,
}: {
  buttonTitle: string;
  filterStrings: string[];
  setModalOpen: (value: boolean) => void;
}) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFitlerVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedDropdown, setSelectedDropdown] = useState<string | undefined>(
    undefined
  );

  const fitlerButtonController = useAnimation();
  return (
    <div className=" flex flex-col justify-start items-start">
      <div className=" flex justify-between w-full">
        <button
          type="button"
          onClick={() => {
            setModalOpen(true);
          }}
          className="bg-purple  text-white w-[12rem] h-[3rem] rounded-xl flex  justify-center items-center gap-2"
        >
          <BiPlusCircle className="" size={23} />
          <p className="  font-[600]">{buttonTitle}</p>
        </button>
        <div className="flex gap-2">
          <div className=" flex">
            <input
              type="text"
              className=" border-2 border-purple min-w-[15rem] rounded-l-xl"
            />
            <div className=" relative">
              <button
                type="button"
                onClick={() => {
                  setShowDropdown(!showDropdown);
                }}
                className="h-[3rem] min-w-[6rem] bg-purple rounded-r-xl w-max px-2 text-white flex gap-2  justify-center items-center"
              >
                <p className=" font-[600]  text-[1.2rem] ">
                  {selectedDropdown ?? "Select type"}
                </p>
                <BiFilter strokeWidth={1} size={20} />
              </button>
              {showDropdown && (
                <ul className=" absolute min-w-[6rem] bg-purple text-white font-[600] w-full mt-2 rounded-xl search-dropdown">
                  {filterStrings.map((item, index) => {
                    return (
                      <li
                        onClick={() => {
                          setShowDropdown(!showDropdown);
                          setSelectedDropdown(item);
                        }}
                        key={index}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          <button className="bg-purple  text-white w-[8rem] h-[3rem] rounded-xl flex  justify-center items-center gap-2">
            <BiSearch className="" size={23} />
            <p className="  font-[600]">Search</p>
          </button>
        </div>
      </div>
      <motion.button
        animate={fitlerButtonController}
        onClick={() => {
          if (isFitlerVisible) {
            setIsFilterVisible(false);
          } else {
            setIsFilterVisible(true);
          }
        }}
        type="button"
        className="flex items-center gap-2 mt-4"
      >
        <BiFilter className=" text-purple" />
        <p className="  font-[600] text-purple">Filter by</p>
        <IoIosArrowDown
          className={`${
            !isFitlerVisible ? "" : " rotate-180"
          } transition-all ease-in-out duration-150 text-purple `}
        />
      </motion.button>
    </div>
  );
}
