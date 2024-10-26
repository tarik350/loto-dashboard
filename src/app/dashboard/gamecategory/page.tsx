"use client";

import { gameCategoryApis } from "@/store/apis/gameCategoryApis";
import style from "@/styles/table.module.css";
import { renderTableBody } from "@/utils/helper";
import CustomePagination from "@/utils/widgets/CustomePagination";
import LoadingSpiner from "@/utils/widgets/LoadingSpinner";

import { GameCategoryDto } from "@/utils/dto/createGameCategoryDto";
import CreateGameCategoryModal from "@/utils/modals/CreateGameCategoryModal";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { AnimatePresence } from "framer-motion";
import { useEffect, useReducer, useState } from "react";
import { FaSort } from "react-icons/fa";
import { ActionTypes, genericReducer, initialState } from "../roles/roleStore";

export default function GameCategoryView() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [{ currentPage, lastPage, entities, isChecked }, dispatch] = useReducer(
    genericReducer<GameCategoryDto>,
    initialState
  );

  //queries and mutations
  const { data, isLoading, isError, isFetching, isSuccess, refetch } =
    gameCategoryApis.useGetGameCategoriesQuery({
      page: currentPage,
    });
  const [deleteGameCategory, { isLoading: deleteLoading }] =
    gameCategoryApis.useDeleteGameCategoriesMutation();
  const [searchGameCategory] =
    gameCategoryApis.useSearchGameCategoriesMutation();

  const onDelete = async () => {
    try {
      const categories = Object.keys(isChecked)
        .filter((key) => isChecked[parseInt(key)])
        .map((item) => parseInt(item));
      await deleteGameCategory({ categories }).unwrap();
      debugger;
    } catch (error: any) {
      debugger;
    }
  };

  const onSearch = async (query: string) => {
    try {
      if (!query) {
        refetch();
        return;
      }
      const response = await searchGameCategory({ query }).unwrap();
      dispatch({
        type: ActionTypes.SET_SEARCH_RESULTS,
        payload: {
          entities: response.data?.data!,
          lastPage: response.data?.last_page,
        },
      });
    } catch (error) {
      // todo show error message
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: data.data?.data!, lastPage: data.data?.last_page },
      });
    }
  }, [isFetching, isSuccess, data]);
  return (
    <div className=" m-8">
      <AnimatePresence>
        {modalOpen && <CreateGameCategoryModal setIsOpen={setModalOpen} />}
      </AnimatePresence>
      <div className=" mb-8">
        <GenericFilterNavbar
          setModalOpen={() => {
            setModalOpen(!modalOpen);
          }}
          buttonTitle={"Create Game Category"}
          searchMethod={onSearch}
          searchLabel={"ID  or Title (Amharic , English)  "}
        />
      </div>
      {/* <GameCategoryTable /> */}
      <div className={style.table__container__highlight}>
        <div className=" flex justify-between">
          <h2>Game categories</h2>
          {Object.values(isChecked).some((item) => item === true) && (
            <button
              type="button"
              onClick={onDelete}
              className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
            >
              {deleteLoading ? <LoadingSpiner dimension={30} /> : "Delete"}
            </button>
          )}
        </div>
        <div className={`${style.table__container__fullheight} `}>
          <table className={style.table}>
            <thead>
              <tr className="text-white bg-purple rounded-xl text-center">
                <th>
                  <input
                    checked={
                      Object.values(isChecked).length > 0 &&
                      Object.values(isChecked).every((item) => item === true)
                    }
                    onChange={(event) => {
                      dispatch({
                        type: ActionTypes.SET_ALL_CHECKBOXES,
                        payload: event.target.checked,
                      });
                    }}
                    type="checkbox"
                  />
                </th>
                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>ID</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                <th className="p-3">Title</th>

                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>Winning Prize</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                <th className="p-3">2nd Place Prize</th>
                <th className="p-3">3rd Place Prize</th>
                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>Ticket Price</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>Total Tickets</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="">
              {renderTableBody({
                data: entities,
                isLoading: isLoading || isFetching,
                isError,
                columns: [
                  {
                    render(record) {
                      return (
                        <input
                          checked={isChecked[record.id]}
                          type="checkbox"
                          onChange={() => {
                            dispatch({
                              type: ActionTypes.TOGGLE_CHECKBOX,
                              payload: record.id,
                            });
                          }}
                        />
                      );
                    },
                  },
                  {
                    render({ id }) {
                      return <p>{id}</p>;
                    },
                  },
                  {
                    render({ title_am, title_en }) {
                      return (
                        <ul className="list-none space-y-2">
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <span>{title_en}</span>
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <span>{title_am}</span>
                          </li>
                        </ul>
                      );
                    },
                  },
                  {
                    render({ winning_prize }) {
                      return <p>{winning_prize.toLocaleString()} BIRR</p>;
                    },
                  },
                  {
                    render({ second_winning_prize }) {
                      return (
                        <p>{second_winning_prize.toLocaleString()} BIRR</p>
                      );
                    },
                  },
                  {
                    render({ third_winning_prize }) {
                      return <p>{third_winning_prize.toLocaleString()} BIRR</p>;
                    },
                  },
                  {
                    render({ ticket_price }) {
                      return <p>{ticket_price.toLocaleString()} BIRR</p>;
                    },
                  },
                  {
                    render({ ticket_count }) {
                      return <p>{ticket_count.toLocaleString()}</p>;
                    },
                  },
                ],
              })}
            </tbody>
          </table>
        </div>
        <div className=" mt-8">
          <CustomePagination
            pageCount={lastPage!}
            handlePageClick={({ selected }: { selected: number }) => {
              dispatch({
                type: ActionTypes.SET_CURRENT_PAGE,
                payload: selected + 1,
              });
              refetch();
            }}
          />
        </div>
      </div>
    </div>
  );
}
