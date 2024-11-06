"use client";
import { gameApi } from "@/store/apis/gameApis";
import style from "@/styles/table.module.css";
import CreateGameModal from "@/utils/modals/CreateGameModal";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BiRightArrow } from "react-icons/bi";
import { GameCard } from "./widgets/GameCard";
import { GameLoadingShimmer } from "./widgets/GameLoadingShimmer";
import GamesNavbar from "./widgets/GamesNavbar";
import { useRouter } from "next/navigation";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";

export default function Games() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { data, isLoading, isError, isFetching } =
    gameApi.useGetAllGamesWithCategoryQuery();
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
              <ul className="mb-[1rem]">
                <div className=" flex  justify-between  ">
                  <div className=" flex flex-col ">
                    <p className=" text-[1.5rem] font-[600]">
                      {category.title_en} ({category.title_am})
                    </p>
                    <p className=" text-gray-500 font-[200] text-[1.4rem]">
                      Total Games for this Category{" "}
                      <span className=" text-purple font-bold ]">
                        {category.games_count}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/dashboard/games/category/${category.id}`);
                    }}
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
                {category.games.length !== 0 && (
                  <div className={style.table__container__fullheight}>
                    <table className={style.table}>
                      <thead>
                        <tr>
                          <th className="sortable">
                            <div className="flex items-center gap-2">
                              <p>ID</p>
                            </div>
                          </th>
                          <th className="sortable">
                            <div className="flex items-center gap-2">
                              <p>Game Name</p>
                            </div>
                          </th>
                          <th className="sortable">
                            <div className="flex items-center gap-2">
                              <p>Status</p>
                            </div>
                          </th>
                          <th className="sortable">
                            <div className="flex items-center gap-2">
                              <p>Sold Tickets</p>
                            </div>
                          </th>
                          <th className="sortable">
                            <div className="flex items-center gap-2">
                              <p>Created At</p>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderTableBody({
                          data: category.games,
                          isLoading: isLoading || isFetching,
                          isError,
                          onClick: ({ id }) => {
                            router.push(`/dashboard/games/${id}`);
                          },
                          columns: [
                            {
                              render(record) {
                                return <div>{record.id}</div>;
                              },
                            },
                            {
                              render(record) {
                                return <div>{record.name}</div>;
                              },
                            },
                            {
                              render(record) {
                                return (
                                  <div className=" bg-purple text-white px-2 font-bold w-max rounded-xl">
                                    {record.status}
                                  </div>
                                );
                              },
                            },
                            {
                              render(record) {
                                return (
                                  <p className=" font-bold text-[1rem] ">
                                    {record.sold_ticket_count} /{" "}
                                    {category.ticket_count}
                                  </p>
                                );
                              },
                            },
                            {
                              render(record) {
                                return (
                                  <div>
                                    {formatToReadableDateTime(
                                      record.updated_at
                                    )}
                                  </div>
                                );
                              },
                            },
                          ],
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
}
