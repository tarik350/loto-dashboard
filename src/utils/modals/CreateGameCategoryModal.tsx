import { AnimatePresence, motion } from "framer-motion";
import ModalLayout from "./ModalLayout";
import { BiSolidDownArrow } from "react-icons/bi";

export default function CreateGameCategoryModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className=" bg-black  bg-opacity-30 z-50 fixed left-0 top-0 w-full h-full flex justify-end items-center"
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
            className="h-screen overflow-auto flex flex-col gap-4 justify-center relative items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-yellow/90 via-purple to-green/70 "></div>

            <div className="  create-category__sidebar__container  ">
              <label className=" ">
                Game Title
                <input
                  type="text"
                  className=" "
                  placeholder="Game Category Title"
                />
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
                <input type="text" className=" " placeholder="Winning prize" />
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
              <button type="submit" className=" mt-6 ">
                <p className=" gradient-text-color">Create Game Category</p>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
