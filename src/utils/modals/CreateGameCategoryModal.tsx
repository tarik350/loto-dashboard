"use client";

import CreateGameCategoryForm from "@/app/dashboard/gamecategory/widgets/CreateGameCategoryForm";
import { motion } from "framer-motion";
import ModalLayout from "./ModalLayout";
import { useState } from "react";

export default function CreateGameCategoryModal({
  setIsOpen,
  refetch,
}: {
  setIsOpen: (value: boolean) => void;
  refetch: () => void;
}) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);

  return (
    <ModalLayout
      setIsOpen={setIsOpen}
      configMethod={(value: boolean) => {
        setIsTitleVisible(value);
      }}
    >
      <div className="  ">
        <CreateGameCategoryForm
          isTitleVisible={isTitleVisible}
          refetch={refetch}
        />
      </div>
    </ModalLayout>
  );
}
