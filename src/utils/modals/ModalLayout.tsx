"use client";

import CreateGameCategoryForm from "@/app/dashboard/gamecategory/widgets/CreateGameCategoryForm";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function ModalLayout({
  setIsOpen,
  children,
}: {
  setIsOpen: (value: boolean) => void;
  children: ReactNode;
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
        className="   modal-container blackpurple-gradient-background"
      >
        {children}
      </motion.div>
    </div>
  );
}
