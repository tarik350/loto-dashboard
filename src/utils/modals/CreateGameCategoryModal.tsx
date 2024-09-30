"use client";

import CreateGameCategoryForm from "@/app/dashboard/gamecategory/widgets/CreateGameCategoryForm";
import { motion } from "framer-motion";

export default function CreateGameCategoryModal({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className=" bg-black   bg-opacity-30 z-50 fixed right-0 top-0 w-full h-full flex justify-end items-center"
      onClick={() => setIsOpen(false)}
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
        className="h-screen w-[30vw]  overflow-auto flex flex-col gap-[.5rem] justify-center relative items-center"
      >
        <div className="absolute   inset-0 bg-gradient-to-bl from-yellow/90 via-purple to-green/70 overflow-hidden "></div>

        <CreateGameCategoryForm />
      </motion.div>
    </motion.div>
  );
}
