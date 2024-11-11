"use client";

import { gameApi } from "@/store/apis/gameApis";
import { gameCategoryApis } from "@/store/apis/gameCategoryApis";
import style from "@/styles/table.module.css";
import { genericQueryByConst, GenericQueryByType } from "@/utils/constants";
import { GameCategoryDto } from "@/utils/dto/createGameCategoryDto";
import { GameDto } from "@/utils/dto/gameDto";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import CustomePagination from "@/utils/widgets/CustomePagination";
import { FilterButton } from "@/utils/widgets/FilterButton";
import SearchWithDropdown from "@/utils/widgets/SearchWithDropDown";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from "react";
import { FaSort } from "react-icons/fa";
import { GenericDropdown } from "../permissions/widgets/PermissionFilter";
import { ActionTypes, genericReducer, initialState } from "../roles/roleStore";
import { AnimatePresence, motion } from "framer-motion";

export default function AuditView() {
  //state
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [queryBy, setQueryBy] = useState<GenericQueryByType>("Name");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [{ currentPage, lastPage, entities, isChecked }, dispatch] = useReducer(
    genericReducer<GameDto & { category: GameCategoryDto }>,
    initialState
  );
  const router = useRouter();
  const { data, isLoading, isFetching, isError, isSuccess, refetch } =
    gameApi.useGetCompletedGamesQuery({
      page: currentPage,
      category: categoryFilter,
    });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: {
          entities: data?.data?.data!,
          lastPage: data?.data?.last_page,
        },
      });
    }
  }, [isSuccess, isFetching, data]);

  useEffect(() => {
    refetch();
  }, [categoryFilter]);
  const [searchGame] = gameApi.useSearchCompletedGamesMutation();
  const onSearch = async (query: string) => {
    try {
      if (!query) {
        refetch();
        return;
      }
      const response = await searchGame({
        query,
        query_by:
          queryBy.toLowerCase() === "id"
            ? "searchable_id"
            : queryBy.toLowerCase(),
      }).unwrap();
      dispatch({
        type: ActionTypes.SET_SEARCH_RESULTS,
        payload: {
          entities: response?.data?.data!,
          lastPage: response.data?.last_page,
        },
      });
    } catch (error) {
      // todo show error message
    }
  };

  return (
    <div className="m-8">
      <div className="flex justify-between">
        <FilterButton
          setIsFilterVisible={setShowFilter}
          isFitlerVisible={showFilter}
        />
        <SearchWithDropdown
          onSearch={onSearch}
          queryBy={queryBy}
          setQueryBy={(value: GenericQueryByType) => {
            setQueryBy(value);
          }}
          dropdownList={genericQueryByConst}
        />
      </div>
      {showFilter && (
        <CategoryFitler
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      )}
      <div className={style.table__container__highlight}>
        <div className="generic-table__header">
          <h2>Completed Games</h2>
        </div>
        <div className={style.table__container__fullheight}>
          <table className={style.table}>
            <thead>
              <tr>
                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>ID</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                <th className="sortable   ">
                  <div className="flex items-center gap-2">
                    <p>Game Name</p>
                  </div>
                </th>
                <th className="sortable">Status</th>
                <th className="sortable">Game Category</th>
                <th className="sortable">Winning prize</th>
                <th className="sortable">2nd Winning prize</th>
                <th className="sortable">3rd Winning prize</th>
                <th className="sortable">Ticket count</th>

                <th className="sortable">
                  <div className=" flex  items-center gap-2">
                    <p>Created At</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderTableBody({
                data: entities,
                isLoading: isLoading || isFetching,
                isError,
                onClick: ({ id }) => {
                  router.push(`audit/${id}`);
                },
                columns: [
                  {
                    render(record) {
                      return <p>{record.id}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.name}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.status}</p>;
                    },
                  },
                  {
                    render(record) {
                      return (
                        <div>
                          {record.category.title_en} ({record.category.title_am}
                          )
                        </div>
                      );
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.category.winning_prize}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.category.second_winning_prize}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.category.third_winning_prize}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.category.ticket_count}</p>;
                    },
                  },
                  {
                    render(record) {
                      return (
                        <p>{formatToReadableDateTime(record.created_at)}</p>
                      );
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

function CategoryFitler({
  categoryFilter,
  setCategoryFilter,
}: {
  categoryFilter: string | undefined;
  setCategoryFilter: Dispatch<SetStateAction<string | undefined>>;
}) {
  const [titles, setTitles] = useState<string[]>([]);
  const { data, isLoading, isFetching, isError, error, isSuccess } =
    gameCategoryApis.useGetAllUnpaginatedQuery();

  useEffect(() => {
    if (isSuccess && data) {
      const reducedCategories = data.data?.reduce<string[]>((current, prev) => {
        current.push(prev.title_en);
        return current;
      }, []);
      setTitles(reducedCategories!);
    }
  }, [isSuccess, data]);
  return (
    <div className=" mt-2 flex gap-2">
      <GenericDropdown<string>
        title="Game Category"
        callback={(value: string) => {
          setCategoryFilter(value);
        }}
        listItem={titles}
        selectedOption={categoryFilter}
      />
      <button
        type="button"
        onClick={() => {
          setCategoryFilter(undefined);
        }}
        className=" border-2  border-purple  rounded-xl px-2 py-1 min-w-max flex justify-between items-center gap-4"
      >
        Clear Filter
      </button>
    </div>
  );
}
