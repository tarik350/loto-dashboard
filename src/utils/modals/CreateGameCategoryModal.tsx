"use client";

import CreateGameCategoryForm from "@/app/dashboard/gamecategory/widgets/CreateGameCategoryForm";
import { AnimatePresence, motion } from "framer-motion";
import { IoSpeedometer } from "react-icons/io5";

// export default function CreateGameCategoryModal({
//   setIsOpen,
//   isOpen,
// }: {
//   isOpen: boolean;
//   setIsOpen: (value: boolean) => void;
// }) {
//   return (
//     <>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="    bg-opacity-30 z-50  fixed right-0 top-0 w-full h-full flex justify-end items-center"
//           onClick={() => setIsOpen(false)}
//         >
//           <motion.div
//             initial={{
//               width: "0vw",
//             }}
//             animate={{
//               width: `30vw`,
//               transition: {
//                 ease: "easeOut",
//               },
//             }}
//             exit={{
//               width: "0vw",
//               transition: {
//                 ease: "easeIn",
//               },
//             }}
//             onClick={(event) => event.stopPropagation()}
//             className="h-screen  overflow-auto flex flex-col gap-[.5rem] justify-center relative items-center"
//           >
//             <div className="absolute   inset-0 bg-gradient-to-bl from-yellow/90 via-purple to-green/70 overflow-hidden "></div>

//             <CreateGameCategoryForm />
//           </motion.div>
//         </motion.div>
//       )}
//     </>
//   );
// }

export default function CreateGameCategoryModal({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <div className="  ">
      <div onClick={() => setIsOpen(false)} className="   modal-bg"></div>

      <motion.div
        initial={{ width: "0vw" }}
        animate={{ width: "30vw" }}
        exit={{ width: "0vw" }}
        className=" modal-container  modal-background "
      >
        <div className=" relative z-50 ">
          <CreateGameCategoryForm />
        </div>
      </motion.div>
    </div>
  );
}
