"use client";

import CreateGameCategoryForm from "@/app/dashboard/gamecategory/widgets/CreateGameCategoryForm";
import { motion, Variants } from "framer-motion";
import { exit } from "process";
import { ReactNode, useEffect, useState } from "react";

export default function ModalLayout({
  setIsOpen,
  children,
  configMethod,
}: {
  setIsOpen: (value: boolean) => void;
  configMethod?: (value: boolean) => void;
  children: ReactNode;
}) {
  const [createPaymentLinkModalWidth, setCreatePaymentLinkModalWidth] =
    useState("18rem");

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setCreatePaymentLinkModalWidth("28rem");
      } else {
        setCreatePaymentLinkModalWidth("18rem");
      }
    }

    if (window.innerWidth >= 768) {
      setCreatePaymentLinkModalWidth("28rem");
    } else {
      setCreatePaymentLinkModalWidth("18rem");
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const parentVariant: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 1 } },
    exit: { opacity: 0 },
  };

  // const childrenVariant: Variants = {
  //   initial: {
  //     opacity: 0,
  //     width: 0,
  //   },
  //   animate: {
  //     width: `${createPaymentLinkModalWidth}`,
  //     opacity: 1,
  //     transition: {
  //       ease: "easeOut",
  //       duration: 0.3,
  //     },
  //   },
  //   exi: {
  //     width: "0vw",
  //     opacity: 0,
  //     transition: {
  //       ease: "easeIn",
  //       duration: 0.3,
  //     },
  //   },
  // };
  return (
    <div className="    ">
      <motion.div
        variants={parentVariant}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={() => {
          configMethod && configMethod(false);
          setIsOpen(false);
        }}
        className="   modal-bg cursor-pointer"
      ></motion.div>

      <motion.div
        initial={{
          opacity: 0,
          width: 0,
        }}
        animate={{
          width: `${createPaymentLinkModalWidth}`,
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
        onAnimationComplete={() => {
          configMethod && configMethod(true);
        }}
        // variants={childrenVariant}
        // initial="initial"
        // animate="animate"
        // exit="exit"
        className="modal-container  blackpurple-gradient-background h-screen overflow-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}
