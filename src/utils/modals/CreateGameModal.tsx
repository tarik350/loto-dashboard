"use client";
import { AnimatePresence, motion } from "framer-motion";
import ModalLayout from "./ModalLayout";
import { useEffect, useRef } from "react";
import ParentComponent from "./ModalLayout";

export default function CreateGameModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <ModalLayout isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>thie children goes hrer</div>
    </ModalLayout>
  );
}
