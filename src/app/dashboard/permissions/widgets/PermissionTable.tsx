import { permissionApi } from "@/store/permissionApi";
import style from "@/styles/table.module.css";
import CustomePagination from "@/utils/widgets/CustomePagination";
import {
  default as LoadingSpiner,
  default as LoadingSpinner,
} from "@/utils/widgets/LoadingSpinner";
import { Dispatch, use, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
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
  //queries and mutations
  const { data, isLoading, isError, isSuccess, refetch, isFetching } =
    permissionApi.useGetPermissionsQuery({
      page: state.currentPage,
      category_id: state.filterCategoryId,
    });
  const [deletePermission] = permissionApi.useDeletePermissionMutation();

  //helper methods
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
              onDelete(Object.keys(state.isChecked).map((key) => Number(key)));
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
            </tr>
          </thead>
          <tbody>{renderTableBody(state, isLoading, isError, dispatch)}</tbody>
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

function renderTableBody(
  state: PermissionTableState,
  isLoading: boolean,
  isError: boolean,
  dispatch: (value: PermissionActionType) => void
) {
  if (isLoading) {
    return (
      <tr>
        <td className="p-5 text-center bg-purple-50" colSpan={8}>
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner dimension={30} />
          </div>
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td className="p-5 text-center text-red-500" colSpan={8}>
          <div className="py-12 flex flex-col justify-center items-center">
            <IoWarning size={30} />
            <p className="font-[700] text-[1rem] ">Error fetching data</p>
          </div>
        </td>
      </tr>
    );
  }

  if (state.permissions && state.permissions.permissions.length > 0) {
    return state.permissions.permissions.map((item, index) => (
      <tr key={index}>
        <td>
          <input
            checked={state.isChecked[item.id]}
            onChange={(event) => {
              if (event.target.checked) {
                dispatch({
                  type: PermissionTableActionTypes.ADD_ISCHECKED,
                  payload: item.id,
                });
              } else {
                dispatch({
                  type: PermissionTableActionTypes.REMOVE_ISCHECKED,
                  payload: item.id,
                });
              }
            }}
            type="checkbox"
          />
        </td>
        <td>{item.id}</td>
        <td className="font-[600]">{item.name}</td>
        <td>{item.categories.name}</td>
      </tr>
    ));
  }

  return (
    <tr>
      <td className="p-5 text-center bg-purple-50" colSpan={8}>
        <p className="font-[700] text-[1rem] text-gray-500 py-12 flex justify-center items-center">
          No Data
        </p>
      </td>
    </tr>
  );
}
