"use client";

import { BiPlusCircle } from "react-icons/bi";

export default function GenericFilterNavbar({
  setModalOpen,
  buttonTitle,
  searchMethod,
  searchLabel,
}: {
  buttonTitle: string;
  setModalOpen: (value: boolean) => void;
  searchMethod: (query: string) => void;
  searchLabel: string;
}) {
  return (
    <div className=" flex flex-col justify-start items-start">
      <div className=" flex justify-between w-full">
        <button
          type="button"
          onClick={() => {
            setModalOpen(true);
          }}
          className="generic-create__button px-4"
        >
          <BiPlusCircle className="" size={23} />
          <p className="  font-[600]">{buttonTitle}</p>
        </button>
        <div className="">
          <input
            type="text"
            onChange={(event) => {
              searchMethod(event.target.value);
            }}
            placeholder={searchLabel}
            className="  search-input"
          />
        </div>
      </div>
    </div>
  );
}
