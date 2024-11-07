"use client";
import { userApi } from "@/store/apis/userApi";
import style from "@/styles/table.module.css";
import { SortDto } from "@/utils/dto/sortDto";
import { UserDto } from "@/utils/dto/userDto";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import CustomePagination from "@/utils/widgets/CustomePagination";
import { useEffect, useReducer, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FaSort } from "react-icons/fa";
import { ActionTypes, genericReducer, initialState } from "../roles/roleStore";
import { GenericResponse } from "@/utils/types";
import { PaginationDto } from "@/utils/dto/paginationDto";
export type queryByTypeForUser = "Name" | "ID" | "Phone";
export const queryByConstForUser: queryByTypeForUser[] = [
  "Name",
  "ID",
  "Phone",
];
export default function UsersPage() {
  const [{ currentPage, lastPage, entities, isChecked }, dispatch] = useReducer(
    genericReducer<UserDto>,
    initialState
  );

  const [sort, setSort] = useState<
    SortDto<"id" | "created_at" | "balance"> | undefined
  >(undefined);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [queryBy, setQueryBy] = useState<queryByTypeForUser>("Name");

  const { data, isLoading, isError, isSuccess, isFetching, refetch } =
    userApi.useGetAllUsersQuery({
      page: currentPage,
      sortBy: sort?.sortBy ?? undefined,
      sortOrder: sort?.sortOrder ?? undefined,
    });

  const [searchUser] = userApi.useSearchUserMutation();

  const onDelete = async () => {
    const selectedAdmins = Object.keys(isChecked)
      .filter((item) => isChecked[parseInt(item)])
      .map((key) => parseInt(key));
    try {
      // await deleteAdminUser({ ids: selectedAdmins }).unwrap();
      // dispatch({ type: ActionTypes.DELETE_ENTITY, payload: selectedAdmins });
      //todo show success message
    } catch (error) {
      // todo show error message
      debugger;
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      const fetchedUser = data.data?.data || [];
      const lastPage = data.data?.last_page;
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: fetchedUser, lastPage },
      });
    }
  }, [isSuccess, data, isFetching]);

  const onSearch = async (query: string) => {
    try {
      if (!query) {
        refetch();
        return;
      }
      const response = (await searchUser({
        query,
        query_by:
          queryBy === "Name"
            ? "full_name"
            : queryBy === "ID"
            ? "searchable_id"
            : "phone",
        paginate: true,
      }).unwrap()) as GenericResponse<PaginationDto<UserDto[]>>;
      const fetchedUser = response.data?.data!;
      const lastPage = response.data?.last_page;
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: fetchedUser, lastPage },
      });
    } catch (error) {}
  };
  return (
    <div className="m-8">
      <div className=" flex justify-self-end">
        <input
          type="text"
          className=" border-2 border-purple min-w-[15rem] rounded-l-xl  px-4 outline-none"
          onChange={(event) => {
            onSearch(event.target.value);
          }}
          placeholder="Search User"
        />
        <div className=" relative">
          <button
            type="button"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className="h-[3rem] bg-purple rounded-r-xl w-max px-2 text-white flex gap-2  justify-center items-center"
          >
            <p>{queryBy}</p>
            <BiFilter />
          </button>
          {showDropdown && (
            <ul className=" absolute z-50 min-w-max bg-purple text-white font-[600] w-full mt-2 border-2  border-softLavender">
              {queryByConstForUser.map((value, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      setQueryBy(value);
                      setShowDropdown(false);
                    }}
                    className={`${
                      index !== queryByConstForUser.length - 1 &&
                      "border-b-[1px] border-white"
                    } py-[.5rem] px-2 cursor-pointer  hover:bg-white  hover:text-purple transition-all ease-in-out duration-150  `}
                  >
                    {value}{" "}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className={style.table__container__highlight}>
        <div className="generic-table__header">
          <h2>Users</h2>
        </div>
        <div className={style.table__container__fullheight}>
          <table className={style.table}>
            <thead>
              <tr>
                <th
                  className="sortable"
                  onClick={() => {
                    setSort({
                      sortBy: "id",
                      sortOrder: sort?.sortOrder === "asc" ? "desc" : "asc",
                    });
                  }}
                >
                  <div className=" flex  items-center gap-2">
                    <p>ID</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                <th className="sortable   ">
                  <div className="flex items-center gap-2">
                    <p>Full Name</p>
                  </div>
                </th>
                <th
                  className="sortable"
                  onClick={() => {
                    setSort({
                      sortBy: "balance",
                      sortOrder: sort?.sortOrder === "asc" ? "desc" : "asc",
                    });
                  }}
                >
                  <div className=" flex  items-end gap-2">
                    <p>Balance</p>
                    <FaSort className="sort-icon" />
                  </div>
                </th>
                <th className="sortable">Phone</th>
                <th className="sortable">Phone Verified</th>
                <th className="sortable">Suspended</th>

                <th
                  className="sortable"
                  onClick={() => {
                    setSort({
                      sortBy: "created_at",
                      sortOrder: sort?.sortOrder === "asc" ? "desc" : "asc",
                    });
                  }}
                >
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
                columns: [
                  {
                    render(record) {
                      return <p>{record.id}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.full_name}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.balance}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{record.phone}</p>;
                    },
                  },

                  {
                    render(record) {
                      return <p>{!record.phone_verified ? "No" : "Yes"}</p>;
                    },
                  },
                  {
                    render(record) {
                      return <p>{!record.is_suspended ? "No" : "Yes"}</p>;
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
