"use client";
import { roleApi } from "@/store/apis/roleApi";
import style from "@/styles/table.module.css";
import { RoleDto } from "@/utils/dto/roleDto";
import { formatToReadableDateTime, renderTableBody } from "@/utils/helper";
import CustomePagination from "@/utils/widgets/CustomePagination";
import GenericFilterNavbar from "@/utils/widgets/GenericFilterNavbar";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { ActionTypes, genericReducer, initialState } from "./roleStore";

export default function RolesPage() {
  const router = useRouter();

  // Mutations
  const [deleteRole] = roleApi.useDeleteRoleMutation();
  const [searchRole] = roleApi.useSearchRoleMutation();

  const [{ currentPage, lastPage, entities, isChecked }, dispatch] = useReducer(
    genericReducer<RoleDto>,
    initialState
  );

  const { data, isError, isLoading, isFetching, isSuccess, refetch } =
    roleApi.useGetAllRolesQuery({
      page: currentPage,
    });

  const onDelete = async () => {
    const selectedRoles = Object.keys(isChecked)
      .filter((item) => isChecked[parseInt(item)])
      .map((key) => parseInt(key));
    try {
      await deleteRole({ roles: selectedRoles }).unwrap();
      dispatch({ type: ActionTypes.DELETE_ENTITY, payload: selectedRoles });
    } catch (error) {
      // todo show error message
    }
  };

  const onSearch = async (query: string) => {
    try {
      if (!query) {
        refetch();
        return;
      }
      const response = await searchRole({ query }).unwrap();
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
      const fetchedRoles = data.data?.data || [];
      const lastPage = data.data?.last_page;
      dispatch({
        type: ActionTypes.FETCH_ENTITIES_SUCCESS,
        payload: { entities: fetchedRoles, lastPage },
      });
    }
  }, [isSuccess, data, isFetching]);
  return (
    <div>
      <div className=" mb-8">
        <GenericFilterNavbar
          setModalOpen={() => {
            router.push("/dashboard/roles/create-role");
          }}
          buttonTitle={"Create Role"}
          searchMethod={onSearch}
          searchLabel={"Type role name"}
        />
      </div>

      <div className={style.table__container__highlight}>
        <div className="generic-table__header">
          <h2>Roles</h2>
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
                    <p>Role Name</p>
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
