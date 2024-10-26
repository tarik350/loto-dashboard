import { motion } from "framer-motion";
import { BiFilter } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

export function FilterButton({
  setIsFilterVisible,
  isFitlerVisible,
}: {
  setIsFilterVisible: (value: boolean) => void;
  isFitlerVisible: boolean;
}) {
  return (
    <motion.button
      onClick={() => {
        setIsFilterVisible(!isFitlerVisible);
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
  );
}
