import { permissionApi } from "@/store/permissionApi";
import style from "@/styles/table.module.css";
import { PermissionDto } from "@/utils/dto/permissionDto";
import { renderTableBody } from "@/utils/helper";
import CustomePagination from "@/utils/widgets/CustomePagination";
import { default as LoadingSpiner } from "@/utils/widgets/LoadingSpinner";
import { Dispatch, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import {
  PermissionActionType,
  PermissionTableActionTypes,
  PermissionTableState,
} from "./permissionTableStore";

export default function PermissionTable({
  state,
  dispatch,
}: {
  state: PermissionTableState;
  dispatch: Dispatch<PermissionActionType>;
}) {
  const [deletePermission] = permissionApi.useDeletePermissionMutation();

  //queries and mutations
  const { data, isLoading, isError, isSuccess, refetch, isFetching } =
    permissionApi.useGetPermissionsQuery({
      page: state.currentPage,
      category_id: state.filterCategoryId,
    });

  const resetAllCheckbox = () => {
    dispatch({
      type: PermissionTableActionTypes.ADD_ALL_ISCHECKED,
      payload: state.permissions.permissions.reduce<Record<string, boolean>>(
        (prev, current) => {
          prev[current.id] = false;
          return prev;
        },
        {}
      ),
    });
  };

  const setAllcheckbox = () => {
    dispatch({
      type: PermissionTableActionTypes.ADD_ALL_ISCHECKED,
      payload: state.permissions.permissions.reduce<Record<string, boolean>>(
        (prev, current) => {
          prev[current.id] = true;
          return prev;
        },
        {}
      ),
    });
  };

  const onDelete = async (ids: number | number[]) => {
    const isBulk = Array.isArray(ids);
    try {
      if (isBulk) {
        dispatch({
          type: PermissionTableActionTypes.SET_BULK_DELETE_LOADING,
          payload: { value: "loading" },
        });
      } else {
        dispatch({
          type: PermissionTableActionTypes.SET_DELETE_LOADING,
          paylaod: { key: ids, value: true },
        });
      }
      await deletePermission({ ids }).unwrap();
      //todo show delete success message
      dispatch({
        type: PermissionTableActionTypes.SET_BULK_DELETE_LOADING,
        payload: {
          value: "success",
          message: "All permissions deleted successfully",
        },
      });
    } catch (error: any) {
      dispatch({
        type: PermissionTableActionTypes.SET_BULK_DELETE_LOADING,
        payload: {
          value: "error",
          message: `Eror while deleting a permission: ${error.toString()}`,
        },
      });
    } finally {
      if (!Array.isArray(ids))
        dispatch({
          type: PermissionTableActionTypes.SET_DELETE_LOADING,
          paylaod: { key: ids, value: false },
        });
      resetAllCheckbox();
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch({
        type: PermissionTableActionTypes.ADD_PERMISSIONS,
        payload: {
          permissions: data?.data?.data!,
          pages: data?.data?.last_page!,
        },
      });
    }
  }, [isSuccess, isFetching, data]);
  useEffect(() => {
    if (!state.isSearch) {
      refetch();
    }
  }, [state.isSearch]);
  useEffect(() => {
    refetch();
  }, [state.filterCategoryId]);
  return (
    <div className={style.table__container__highlight}>
      <div className="flex justify-between items-end">
        <h2>Permissions</h2>
        {Object.values(state.isChecked).some((item) => item === true) && (
          <button
            type="button"
            className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
            onClick={() => {
              onDelete(
                Object.keys(state.isChecked)
                  .filter((key) => state.isChecked[Number(key)])
                  .map((key) => Number(key))
              );
            }}
          >
            {state.bulkDeleteLoading.value === "loading" ? (
              <LoadingSpiner dimension={15} forgroundColor="white" />
            ) : (
              "Delete"
            )}
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
                    Object.values(state.isChecked).length > 0 &&
                    Object.values(state.isChecked).every(
                      (item) => item === true
                    )
                  }
                  onChange={(event) => {
                    if (event.target.checked) {
                      setAllcheckbox();
                    } else {
                      resetAllCheckbox();
                    }
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
              <th className="sortable">Permission Name</th>

              <th className="sortable">
                <p>Permission Category</p>
              </th>
              <th className="sortable">
                <p>Permission Description</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody<PermissionDto>({
              data: state.permissions.permissions,
              isError,
              isLoading: isLoading || isFetching,
              columns: [
                {
                  dataIndex: "categories",
                  render(record) {
                    return (
                      <input
                        checked={state.isChecked[record.id]}
                        type="checkbox"
                        onChange={(event) => {
                          if (event.target.checked) {
                            dispatch({
                              type: PermissionTableActionTypes.ADD_ISCHECKED,
                              payload: record.id,
                            });
                          } else {
                            dispatch({
                              type: PermissionTableActionTypes.REMOVE_ISCHECKED,
                              payload: record.id,
                            });
                          }
                        }}
                      />
                    );
                  },
                },
                {
                  dataIndex: "id",
                  render(record) {
                    return <div>{record.id}</div>;
                  },
                },
                {
                  dataIndex: "name",
                  render(record) {
                    return <div>{record.name}</div>;
                  },
                },
                {
                  dataIndex: "categories",
                  render(record) {
                    return <div>{record.categories.name}</div>;
                  },
                },
                {
                  dataIndex: "description",
                  className: "max-w-[1rem]",
                  render(record) {
                    return <div className=" ">{record.description}</div>;
                  },
                },
              ],
            })}
          </tbody>
        </table>
      </div>
      <div className=" mt-8">
        <CustomePagination
          pageCount={state.permissions.pages!}
          handlePageClick={({ selected }: { selected: number }) => {
            dispatch({
              type: PermissionTableActionTypes.SET_CURRENT_PAGE,
              payload: selected + 1,
            });
            refetch();
          }}
        />
      </div>
    </div>
  );
}
