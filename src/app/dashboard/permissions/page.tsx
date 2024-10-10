"use client";
import CreatePermissionModal from "@/utils/modals/CreatePermissionModal";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import PermissionTable from "./widgets/PermissionTable";
export default function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div>
      <AnimatePresence>
        {modalOpen && <CreatePermissionModal setIsOpen={setModalOpen} />}
      </AnimatePresence>
      <div className=" mb-8">
        <GenericFilterNavbar
          setModalOpen={setModalOpen}
          filterStrings={["username", "email"]}
          buttonTitle={"Create Permissions"}
        />
      </div>
      <PermissionTable />
    </div>
  );
}
