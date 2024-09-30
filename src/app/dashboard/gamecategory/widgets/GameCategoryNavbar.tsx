"use client";
import CreateGameCategoryModal from "@/utils/modals/CreateGameCategoryModal";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  BiFilter,
  BiPlusCircle,
  BiSearch,
  BiSolidDownArrow,
} from "react-icons/bi";

export default function GameCategoryNavbar() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedDropdown, setSelectedDropdown] = useState<"Name" | "ID">("ID");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <div className=" flex justify-between w-full">
      {/* <CreateGameCategoryModal isOpen={modalOpen} setIsOpen={setModalOpen} /> */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=" bg-black   bg-opacity-30 z-50 fixed right-0 top-0 w-full h-full flex justify-end items-center"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{
                width: "0vw",
              }}
              animate={{
                width: `30vw`,
                transition: {
                  ease: "easeOut",
                },
              }}
              exit={{
                width: "0vw",
                transition: {
                  ease: "easeIn",
                },
              }}
              onClick={(event) => event.stopPropagation()}
              className="h-screen  overflow-auto flex flex-col gap-[.5rem] justify-center relative items-center"
            >
              <div className="absolute   inset-0 bg-gradient-to-bl from-yellow/90 via-purple to-green/70 overflow-hidden "></div>

              <div className="  create-category__sidebar__container overflow-auto  py-12">
                <h2 className=" heading-two  text-center">
                  Craete a Game Category
                </h2>
                <label className=" ">
                  Game Title
                  <input
                    type="text"
                    className=" "
                    placeholder="Game Category Title"
                  />
                </label>{" "}
                <label className=" ">
                  Game Title (Amharic)
                  <input type="text" className=" " placeholder="የጫዋታ እርእስ" />
                </label>{" "}
                <label className=" ">
                  Game Duration
                  <div className="    relative">
                    <button
                      type="button"
                      className=" flex justify-between items-center "
                    >
                      <p className=" gradient-text-color ">Select Duration</p>
                      <BiSolidDownArrow
                        className="fill-purple text-purple"
                        size={20}
                      />
                    </button>
                    <div className=" h-max w-[20rem] bg-white absolute top-[3.5rem] z-50 flex flex-col  justify-start text-black"></div>
                  </div>
                </label>{" "}
                <label className=" ">
                  Winning Prize
                  <input
                    type="text"
                    className=" "
                    placeholder="Winning prize"
                  />
                </label>
                <label className=" ">
                  2nd Place prize
                  <input
                    type="text"
                    className=" "
                    placeholder="2nd place prize"
                  />
                </label>
                <label className=" ">
                  3nd Place prize
                  <input
                    type="text"
                    className=" "
                    placeholder="3rd place prize"
                  />
                </label>
                <label className=" ">
                  Ticket Price
                  <input type="text" className=" " placeholder="Ticket price" />
                </label>{" "}
                <label className=" ">
                  Number of Ticket
                  <input
                    type="text"
                    className=" "
                    placeholder="Number of Ticket"
                  />
                </label>
                <button type="submit" className="  mt-4 min-h-[3rem]">
                  <p className=" gradient-text-color">Create Game Category</p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          setModalOpen(!modalOpen);
        }}
        className="bg-purple  text-white w-max px-6 h-[3rem] rounded-xl flex  justify-center items-center gap-2"
      >
        <BiPlusCircle className="" size={23} />
        <p className="  font-[600]">Create Game Category</p>
      </button>
      <div className="flex gap-2">
        <div className=" flex">
          <input
            type="text"
            placeholder={`Please type ${selectedDropdown}`}
            className=" border-2 border-purple min-w-[15rem] rounded-l-xl px-2"
          />
          <div className=" ">
            <button
              type="button"
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
              className="h-[3rem] min-w-[6rem] bg-purple rounded-r-xl w-max px-2 text-white flex gap-2  justify-center items-center"
            >
              <p className=" font-[600]  text-[1.2rem] ">{selectedDropdown}</p>
              <BiFilter strokeWidth={1} size={20} />
            </button>
            {/* search by name and */}
            {showDropdown && (
              <ul className=" absolute min-w-[6rem] bg-purple text-white font-[600] w-full mt-2 rounded-xl search-dropdown">
                {["Name", "ID"].map((title, index) => {
                  return (
                    <li
                      onClick={() => {
                        setShowDropdown(!showDropdown);
                        setSelectedDropdown(title as never);
                      }}
                      key={index}
                    >
                      {title}
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
  );
}
