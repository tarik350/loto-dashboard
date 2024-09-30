"use client";
import CreateGameCategoryModal from "@/utils/modals/CreateGameCategoryModal";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import GameCategoryNavbar from "./widgets/GameCategoryNavbar";
import GameCategoryTable from "./widgets/GameCategoryTable";

export default function GameCategoryView() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div className=" ">
      <AnimatePresence>
        {modalOpen && <CreateGameCategoryModal setIsOpen={setModalOpen} />}
      </AnimatePresence>
      <GameCategoryNavbar setModalOpen={setModalOpen} modalOpen={modalOpen} />
      <GameCategoryTable />
    </div>
  );
}
