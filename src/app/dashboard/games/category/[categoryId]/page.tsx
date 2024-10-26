"use client";
import { GenericDropdown } from "@/app/dashboard/permissions/widgets/PermissionFilter";
import {
  ActionTypes,
  genericReducer,
  initialState,
} from "@/app/dashboard/roles/roleStore";
import { gameApi } from "@/store/apis/gameApis";
import style from "@/styles/table.module.css";
import { gameStatus, gameStatusTitle } from "@/utils/constants";
import { GameDto } from "@/utils/dto/gameDto";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import CustomePagination from "@/utils/widgets/CustomePagination";
import { FilterButton } from "@/utils/widgets/FilterButton";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from "react";

export default function GamesOfGameCategory({
  params,
}: {
  params: { categoryId: string };
}) {
  const [{ currentPage, lastPage, entities, isChecked }, dispatch] = useReducer(
    genericReducer<GameDto>,
    initialState
  );
  const router = useRouter();
  const [isFitlerVisible, setIsFilterVisible] = useState<boolean>(false);
  const [statusFitler, setStatusFitler] = useState<gameStatus | undefined>(
    undefined
  );

  //query and mutation
  const { data, refetch, isSuccess, isLoading, isFetching, isError } =
    gameApi.useGetAllGamesForParticularCategoryQuery({
      categoryId: params.categoryId,
      page: currentPage,
      gameStatus: statusFitler,
    });
  const [searchGame, { isLoading: searchLoading }] =
    gameApi.useSearchGameMutation();
  useEffect(() => {
    if (isSuccess && data) {
      const games = data.data?.games.data || [];
      const lastPage = data.data?.games.last_page;
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: games, lastPage },
      });
    }
  }, [isSuccess, data, isFetching]);
  const onDelete = () => {
    try {
      const gameIds = Object.keys(isChecked)
        .filter((item) => isChecked[parseInt(item)])
        .map((val) => parseInt(val));
      //todo request to delete games
    } catch (error) {}
  };

  const onSearch = async (query: string) => {
    try {
      if (!query) {
        refetch();
        return;
      }
      const response = await searchGame({
        query,
        categoryId: data?.data?.category.id!,
      }).unwrap();
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
    refetch();
  }, [statusFitler]);
  return (
    <div className=" px-8 py-4 h-screen overflow-y-auto ">
      <div className="flex justify-between items-end">
        <h1 className="  font-bold text-[1.5rem]">
          {data?.data?.category.title_en} ({data?.data?.category.title_am})
          Games
        </h1>
        <div className="">
          <input
            type="text"
            onChange={(event) => {
              onSearch(event.target.value);
            }}
            placeholder={"Search for a game"}
            className="  search-input"
          />
        </div>
      </div>
      <FilterButton
        setIsFilterVisible={setIsFilterVisible}
        isFitlerVisible={isFitlerVisible}
      />
      {isFitlerVisible && (
        <GameFilter
          statusFilter={statusFitler}
          setStatusFitler={setStatusFitler}
        />
      )}
      <div className={`${style.table__container__highlight} `}>
        <div className="generic-table__header">
          <h2 className=" font-[600] text-[2rem]">All Games</h2>

          {Object.values(isChecked).some((item) => item === true) && (
            <button
              type="button"
              onClick={onDelete}
              className=" text-white bg-red-600 rounded-xl min-w-[6rem] min-h-[2.5rem]"
            >
              Delete
            </button>
          )}
        </div>
        <div className={style.table__container__fullheight}>
          <table className={style.table}>
            <thead>
              <tr>
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
                data: entities,
                isLoading: isLoading || isFetching,
                isError,
                onClick: ({ id }) => {
                  router.push(`/dashboard/games/${id}`);
                },
                columns: [
                  {
                    render(record) {
                      return (
                        <input
                          checked={isChecked[record.id]}
                          type="checkbox"
                          onClick={(event) => event.stopPropagation()}
                          onChange={(event) => {
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
                          {data?.data?.category.ticket_count}
                        </p>
                      );
                    },
                  },
                  {
                    render(record) {
                      return (
                        <div>{formatToReadableDateTime(record.updated_at)}</div>
                      );
                    },
                  },
                ],
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
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

function GameFilter({
  statusFilter,
  setStatusFitler,
}: {
  statusFilter: string | undefined;
  setStatusFitler: Dispatch<SetStateAction<gameStatus | undefined>>;
}) {
  return (
    <div className=" mt-2 flex gap-2">
      <GenericDropdown<string>
        title="Game Status"
        callback={(value: string) => {
          const gameStatus = gameStatusTitle[value];
          setStatusFitler(gameStatus);
        }}
        listItem={Object.keys(gameStatusTitle)}
        selectedOption={statusFilter}
      />
      <button
        type="button"
        onClick={() => {
          setStatusFitler(undefined);
        }}
        className=" border-2  border-purple  rounded-xl px-2 py-1 min-w-max flex justify-between items-center gap-4"
      >
        Clear Filter
      </button>
    </div>
  );
}
