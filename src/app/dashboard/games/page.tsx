"use client";
import CreateGameModal from "@/utils/modals/CreateGameModal";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BiRightArrow } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import GamesNavbar from "./widgets/GamesNavbar";
import { gameApi } from "@/store/apis/gameApis";

export default function Games() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { data, isLoading } = gameApi.useGetGameWithCategoryQuery();
  return (
    <div className="flex flex-col h-screen">
      <div className="  mx-8 my-4">
        <GamesNavbar setModalOpen={setModalOpen} />
      </div>
      <AnimatePresence>
        {modalOpen && (
          <CreateGameModal isOpen={modalOpen} setIsOpen={setModalOpen} />
        )}
      </AnimatePresence>
      <div className="flex-grow overflow-y-auto ">
        {isLoading && <GameLoadingShimmer />}
        <div className=" mx-8 mb-8">
          {data?.data?.map((category, index) => {
            return (
              <>
                <div className=" flex  justify-between  mb-4">
                  <div className=" flex flex-col ">
                    <p className=" text-[1.5rem] font-[600]">
                      {category.title_en} ({category.title_am})
                    </p>
                    <p className=" text-gray-500 font-[200] text-[1.4rem]">
                      Total Games for this Category{" "}
                      <span className=" text-purple font-bold ]">
                        {category.games.length}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className=" h-[2rem] flex gap-2 items-center justify-center text-white bg-purple px-4 py-1 rounded-3xl "
                  >
                    <p className=" font-[600] ">more</p>
                    <BiRightArrow strokeWidth={2} size={12} />
                  </button>
                </div>
                {category.games.length === 0 && (
                  <div className="  ">
                    <div className=" bg-gray-100 rounded-xl w-full min-h-[16rem] flex ">
                      <p className=" m-auto  text-purple font-[600]  text-center">
                        NO Games found! <br />{" "}
                        <span className=" font-[200]">
                          For {category.title_en}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                <div className=" flex gap-2">
                  {category.games.map((game, index) => {
                    return (
                      <div className="game-card ">
                        <p>ID {game.id}</p>
                        <div>
                          <p>Name</p>
                          <p>{game.name}</p>
                        </div>

                        <p>{game.status}</p>
                        <p>
                          Total sold Ticket{" "}
                          <span>{game.sold_ticket_count}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function GameLoadingShimmer() {
  return (
    <div className="mx-8 mb-8">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index}>
          <div className="flex justify-between items-center">
            <Skeleton className="w-[12rem] h-[3rem]" />
            <button
              type="button"
              className="flex gap-2 items-center justify-center text-white bg-purple px-4 py-1 rounded-3xl"
            >
              <p className="font-[600]">more</p>
              <BiRightArrow strokeWidth={2} size={12} />
            </button>
          </div>
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <Skeleton
                key={item}
                containerClassName="w-full h-[20rem]"
                inline={true}
                className="w-full h-[20rem] my-4 mr-4 border-2"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
