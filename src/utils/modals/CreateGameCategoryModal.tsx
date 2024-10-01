"use client";

import CreateGameCategoryForm from "@/app/dashboard/gamecategory/widgets/CreateGameCategoryForm";
import { motion } from "framer-motion";

export default function CreateGameCategoryModal({
  setIsOpen,
  refetch,
}: {
  setIsOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  return (
    <div className="  ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="   modal-bg cursor-pointer"
      ></motion.div>

      <motion.div
        initial={{
          opacity: 0,
          width: "0vw",
        }}
        animate={{
          width: `30vw`,
          opacity: 1,
          transition: {
            ease: "easeOut",
            duration: 0.3,
          },
        }}
        exit={{
          width: "0vw",
          opacity: 0,
          transition: {
            ease: "easeIn",
            duration: 0.3,
          },
        }}
        className="  modal-container blackpurple-gradient-background"
      >
        <div
          style={{ width: "22vw", height: "100%" }}
          className="  m-auto relative z-50 flex justify-center items-center "
        >
          <CreateGameCategoryForm refetch={refetch} />
        </div>
      </motion.div>
    </div>
  );
}
