"use client";

import CreateGameModal from "@/utils/modals/CreateGameModal";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { BiFilter, BiPlusCircle, BiSearch } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

export default function GamesNavbar() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFitlerVisible, setIsFilterVisible] = useState<boolean>(false);
  const [modalOpen, setIsModalOpen] = useState<boolean>(false);
  const fitlerButtonController = useAnimation();
  return (
    <div className=" flex flex-col justify-start items-start">
      {modalOpen && (
        <CreateGameModal isOpen={modalOpen} setIsOpen={setIsModalOpen} />
      )}
      <div className=" flex justify-between w-full">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(modalOpen);
          }}
          className="bg-purple  text-white w-[12rem] h-[3rem] rounded-xl flex  justify-center items-center gap-2"
        >
          <BiPlusCircle className="" size={23} />
          <p className="  font-[600]">Create Game</p>
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
                className="h-[3rem] bg-purple rounded-r-xl w-max px-2 text-white flex gap-2  justify-center items-center"
              >
                <p>Select type</p>
                <BiFilter />
              </button>
              {showDropdown && (
                <ul className=" absolute bg-purple text-white font-[600] w-full mt-2">
                  <li>5</li>
                  <li>5</li>
                  <li>5</li>
                  <li>5</li>
                  <li>5</li>
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
