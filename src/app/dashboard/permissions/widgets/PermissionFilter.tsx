import { permissionApi } from "@/store/apis/permissionApi";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  PermissionActionType,
  PermissionTableActionTypes,
} from "./permissionTableStore";

export default function PermissionFilter({
  dispatch,
  categoryId,
}: {
  dispatch: Dispatch<PermissionActionType>;
  categoryId: number | undefined;
}) {
  const { data } = permissionApi.useGetPermissionCategoriesQuery();

  return (
    <div className=" mt-2 flex gap-2">
      <GenericDropdown<string>
        title="Permission Category"
        callback={(value: string) => {
          const selectedCategory = data?.data?.find(
            (category) => category.name === value
          );
          dispatch({
            type: PermissionTableActionTypes.SET_CATEGORY_FILTER,
            payload: selectedCategory?.id,
          });
        }}
        listItem={
          data?.data?.reduce((acc: string[], item) => {
            if (item.name) {
              acc.push(item.name);
            }
            return acc;
          }, []) ?? []
        }
        selectedOption={categoryId}
      />
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: PermissionTableActionTypes.SET_CATEGORY_FILTER,
            payload: undefined,
          });
        }}
        className=" border-2  border-purple  rounded-xl px-2 py-1 min-w-max flex justify-between items-center gap-4"
      >
        Clear Filter
      </button>
    </div>
  );
}

export function GenericDropdown<T>({
  listItem,
  title,
  selectedOption,
  callback,
}: {
  listItem: T[];
  selectedOption: any;
  title: string;
  callback: (value: string) => void;
}) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [displayTitle, setDisplayTitle] = useState<string>(title);
  const dropdownRef = useRef<HTMLDivElement>(null);

  //when clear filter clicked set title to default
  useEffect(() => {
    if (!selectedOption) {
      setDisplayTitle(title);
    }
  }, [selectedOption]);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={dropdownRef} className=" relative">
      <button
        type="button"
        onClick={() => {
          setShowOptions(!showOptions);
        }}
        className={`border-2  border-purple  rounded-xl px-2 py-1 min-w-max flex justify-between items-center gap-4 ${
          displayTitle !== title
            ? " bg-purple text-white fill-white"
            : "text-purple fill-purple s"
        }`}
      >
        <p className="font-[600] ">{displayTitle}</p>
        <IoIosArrowDown className="" strokeWidth={4} />
      </button>
      <AnimatePresence>
        {showOptions && (
          <motion.ul
            initial={{
              y: -20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.1,
            }}
            className=" filter-dropdown__container absolute top-10 z-50 bg-white text-black border-purple border-2"
          >
            {listItem?.map((item, index) => {
              return (
                <li
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowOptions(false);
                    setDisplayTitle(item as string);
                    callback(item as string);
                  }}
                  className=" "
                  key={index}
                >
                  {item as string}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
