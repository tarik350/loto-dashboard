import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean; // Add this prop to control modal visibility
  setIsOpen: (value: boolean) => void; // Add a function to close the modal
}

const ModalLayout: React.FC<ModalProps> = ({ children, isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && ( // Only render modal when isOpen is true
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(false)} // Close modal on background click
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full w-[20rem] bg-white">adsfaklsdf</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalLayout;
