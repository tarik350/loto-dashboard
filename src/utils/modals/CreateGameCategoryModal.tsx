"use client";

import CreateGameCategoryForm from "@/app/dashboard/gamecategory/widgets/CreateGameCategoryForm";
import { motion } from "framer-motion";
import ModalLayout from "./ModalLayout";
import { useState } from "react";

export default function CreateGameCategoryModal({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);

  return (
    <ModalLayout setIsOpen={setIsOpen}>
      <div className="flex">
        <CreateGameCategoryForm isTitleVisible={isTitleVisible} />
      </div>
    </ModalLayout>
  );
}
