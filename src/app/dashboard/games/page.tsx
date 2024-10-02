"use client";
import { BiArrowToRight, BiRightArrow } from "react-icons/bi";
import GamesNavbar from "./widgets/GamesNavbar";
import GameListForCategory from "./widgets/GameListForCategory";
import CreateGameModal from "@/utils/modals/CreateGameModal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Games() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <div>
      <GamesNavbar setModalOpen={setModalOpen} />
      <AnimatePresence>
        {modalOpen && (
          <CreateGameModal setIsOpen={setModalOpen} isOpen={modalOpen} />
        )}
      </AnimatePresence>
      {[{ name: "Holiday" }, { name: "Life Changer" }, { name: "Pocket" }].map(
        (item, index) => {
          return <GameListForCategory key={index} title={item.name} />;
        }
      )}
    </div>
  );
}
