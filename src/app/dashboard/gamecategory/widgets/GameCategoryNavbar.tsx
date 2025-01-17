"use client";
import { useState } from "react";
import { BiFilter, BiPlusCircle, BiSearch } from "react-icons/bi";

export default function GameCategoryNavbar({
  setModalOpen,
  modalOpen,
}: {
  setModalOpen: (value: boolean) => void;
  modalOpen: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedDropdown, setSelectedDropdown] = useState<"Name" | "ID">("ID");

  return (
    <div className=" flex justify-between w-full">
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
