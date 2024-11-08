"use client";

import CreateGameModal from "@/utils/modals/CreateGameModal";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { BiFilter, BiPlusCircle, BiSearch } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

export default function GamesNavbar({
  setModalOpen,
}: {
  setModalOpen: (value: boolean) => void;
}) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFitlerVisible, setIsFilterVisible] = useState<boolean>(false);
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
          <p className="  font-[600]">Create Game</p>
        </button>
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
