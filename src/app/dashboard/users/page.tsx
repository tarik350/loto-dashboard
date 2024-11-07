"use client";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import CustomePagination from "@/utils/widgets/CustomePagination";
import style from "@/styles/table.module.css";
import { ActionTypes, genericReducer, initialState } from "../roles/roleStore";
import { AdminUserDto } from "@/utils/dto/adminUserDto";
import { UserDto } from "@/utils/dto/userDto";
import { useEffect, useReducer, useState } from "react";
import { FaSort } from "react-icons/fa";
import { userApi } from "@/store/apis/userApi";
import { SortDto } from "@/utils/dto/sortDto";
export default function UsersPage() {
  const [{ currentPage, lastPage, entities, isChecked }, dispatch] = useReducer(
    genericReducer<UserDto>,
    initialState
  );

  const [sort, setSort] = useState<
    SortDto<"id" | "created_at" | "balance"> | undefined
  >(undefined);

  const { data, isLoading, isError, isSuccess, isFetching, refetch } =
    userApi.useGetAllUsersQuery({
      page: currentPage,
      sortBy: sort?.sortBy ?? undefined,
      sortOrder: sort?.sortOrder ?? undefined,
    });

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
      const fetchedAdminUsers = data.data?.data || [];
      const lastPage = data.data?.last_page;
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: fetchedAdminUsers, lastPage },
      });
    }
  }, [isSuccess, data, isFetching]);
  return (
    <div className="m-8">
      <div className={style.table__container__highlight}>
        <div className="generic-table__header">
          <h2>Users</h2>
          {/* {Object.values(isChecked).some((item) => item === true) && (
            <button
              type="button"
              onClick={onDelete}
              className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
            >
              {"Delete"}
            </button>
          )} */}
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
