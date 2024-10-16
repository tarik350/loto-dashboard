"use client";
import CreateGameCategoryModal from "@/utils/modals/CreateGameCategoryModal";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import GameCategoryNavbar from "./widgets/GameCategoryNavbar";
import GameCategoryTable from "./widgets/GameCategoryTable";
import { getGameCategory } from "@/services/gameCategoryServices";
import { GenericResponse } from "@/utils/types";

import { httpRequestStatus } from "@/utils/constants";
import { CreateGameCategoryResponseDto } from "@/utils/dto/createGameCategoryDto";

export default function GameCategoryView() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<httpRequestStatus>("initial");
  const [response, setResponse] = useState<
    CreateGameCategoryResponseDto[] | undefined
  >();

  const fetchData = async () => {
    try {
      setFetchStatus("loading");
      const response: GenericResponse<CreateGameCategoryResponseDto[]> =
        await getGameCategory();
      if (response.status === 200) {
        setResponse(response.data!);
        setFetchStatus("success");
      }
    } catch (error) {
      setFetchStatus("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" ">
      <AnimatePresence>
        {modalOpen && (
          <CreateGameCategoryModal
            setIsOpen={setModalOpen}
            refetch={() => {
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
      <GameCategoryNavbar setModalOpen={setModalOpen} modalOpen={modalOpen} />
      <GameCategoryTable
        fetchStatus={fetchStatus}
        response={response}
        refetch={() => {
          fetchData();
        }}
      />
    </div>
  );
}
