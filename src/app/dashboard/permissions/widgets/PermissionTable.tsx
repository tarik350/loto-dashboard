import { permissionApi } from "@/store/permissionApi";
import style from "@/styles/table.module.css";
import { httpRequestStatus } from "@/utils/constants";
import { PermissionDto } from "@/utils/dto/permissionDto";
import CustomePagination from "@/utils/widgets/CustomePagination";
import {
  default as LoadingSpiner,
  default as LoadingSpinner,
} from "@/utils/widgets/LoadingSpinner";
import { useEffect, useReducer } from "react";
import { FaSort } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

// An enum with all the types of actions to use in our reducer
enum PermissionTableActionTypes {
  ADD_PERMISSIONS = "ADD_PERMISSIONS",
  ADD_ALL_ISCHECKED = "ADD_ALL_ISCHECKED",
  ADD_ISCHECKED = "ADD_ISCHECKED",
  REMOVE_ISCHECKED = "REMOVE_ISCHECKED",
  CLEAR_ISCHECKED = "CLEAR_ISCHECKED",
  SET_LOADING_STATUS = "SET_LOADING_STATUS",
  SET_BULK_DELETE_LOADING = "SET_BULK_DELETE_LOADING",
  SET_DELETE_LOADING = "SET_DELETE_LOADING",
}

// An interface for our actions
interface AddPermissionsAction {
  type: PermissionTableActionTypes.ADD_PERMISSIONS;
  payload: PermissionDto[];
}

interface AddIsCheckedAction {
  type: PermissionTableActionTypes.ADD_ISCHECKED;
  payload: number;
}

interface RemoveIsCheckedAction {
  type: PermissionTableActionTypes.REMOVE_ISCHECKED;
  payload: number;
}
interface AddAllIsCheckedAction {
  type: PermissionTableActionTypes.ADD_ALL_ISCHECKED;
  payload: Record<string, boolean>;
}
interface RemoveAllIsCheckedAction {
  type: PermissionTableActionTypes.CLEAR_ISCHECKED;
  payload: Record<string, boolean>;
}
interface SetLoadingStatusAction {
  type: PermissionTableActionTypes.SET_LOADING_STATUS;
  payload: httpRequestStatus;
}
interface SetBulkDeleteLoadingAction {
  type: PermissionTableActionTypes.SET_BULK_DELETE_LOADING;
  payload: {
    value: httpRequestStatus;
    message?: string;
  };
}
interface SetDeleteLoadingAction {
  type: PermissionTableActionTypes.SET_DELETE_LOADING;
  paylaod: { key: number; value: boolean };
}

// Add other action interfaces here...

// Combine all action types into one discriminated union type
type PermissionActionType =
  | AddPermissionsAction
  | AddIsCheckedAction
  | RemoveIsCheckedAction
  | AddAllIsCheckedAction
  | RemoveAllIsCheckedAction
  | SetLoadingStatusAction
  | SetBulkDeleteLoadingAction
  | SetDeleteLoadingAction;
// Add other action interfaces as needed...
// An interface for our state
interface PermissionTableState {
  isChecked: Record<number, boolean>;
  permissions: PermissionDto[];
  loading: httpRequestStatus;
  bulkDeleteLoading: {
    value: httpRequestStatus;
    message?: string;
  };
  deleteLoading: Record<string, boolean>;
}

// Our reducer function that uses a switch statement to handle our actions
function permissionReducer(
  state: PermissionTableState,
  action: PermissionActionType
): PermissionTableState {
  switch (action.type) {
    case PermissionTableActionTypes.ADD_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload,
      };

    case PermissionTableActionTypes.ADD_ISCHECKED:
      return {
        ...state,
        isChecked: { ...state.isChecked, [action.payload]: true },
      };

    case PermissionTableActionTypes.REMOVE_ISCHECKED:
      return {
        ...state,
        isChecked: { ...state.isChecked, [action.payload]: false },
      };

    case PermissionTableActionTypes.SET_LOADING_STATUS:
      return {
        ...state,
        loading: action.payload,
      };
    case PermissionTableActionTypes.ADD_ALL_ISCHECKED:
      return {
        ...state,
        isChecked: action.payload,
      };
    case PermissionTableActionTypes.CLEAR_ISCHECKED:
      return {
        ...state,
        isChecked: action.payload,
      };
    case PermissionTableActionTypes.SET_BULK_DELETE_LOADING:
      return {
        ...state,
        bulkDeleteLoading: action.payload,
      };
    case PermissionTableActionTypes.SET_DELETE_LOADING:
      return {
        ...state,
        deleteLoading: {
          ...state.deleteLoading,
          [action.paylaod.key]: action.paylaod.value,
        },
      };
    default:
      return state;
  }
}

export default function PermissionTable({}: {}) {
  const [state, dispatch] = useReducer(permissionReducer, {
    isChecked: {},
    permissions: [],
    loading: "initial",
    bulkDeleteLoading: {
      value: "initial",
    },
    deleteLoading: {},
  });
  const resetAllCheckbox = () => {
    dispatch({
      type: PermissionTableActionTypes.ADD_ALL_ISCHECKED,
      payload: state.permissions.reduce<Record<string, boolean>>(
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
      payload: state.permissions.reduce<Record<string, boolean>>(
        (prev, current) => {
          prev[current.id] = true;
          return prev;
        },
        {}
      ),
    });
  };
  const { data, isLoading, isSuccess, isError, error } =
    permissionApi.useGetPermissionsQuery();
  const [deletePermission] = permissionApi.useDeletePermissionMutation();
  useEffect(() => {
    if (isLoading) {
      dispatch({
        type: PermissionTableActionTypes.SET_LOADING_STATUS,
        payload: "success",
      });
    }
    if (isSuccess && data) {
      dispatch({
        type: PermissionTableActionTypes.ADD_PERMISSIONS,
        payload: data.data ?? [],
      });
    }
    if (isError || error) {
      dispatch({
        type: PermissionTableActionTypes.SET_LOADING_STATUS,
        payload: "error",
      });
    }
  }, [data, isSuccess, error, isError]);
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
      const response = await deletePermission({ ids }).unwrap();
      // const resposne = await authenticatedPost({
      //   url: "/api/admin/permission",
      //   method: "DELETE",
      //   body: { ids: id },
      // });
      // const data: GenericResponse<string | string[]> = await resposne.json();
      if (response.status === 200) {
        dispatch({
          type: PermissionTableActionTypes.SET_BULK_DELETE_LOADING,
          payload: {
            value: "success",
            message: `Permission deleted successfull : ${response.data?.id}`,
          },
        });
        // debugger;
      }
      // else {
      //   dispatch({
      //     type: PermissionTableActionTypes.SET_BULK_DELETE_LOADING,
      //     payload: {
      //       value: "error",
      //       message: `Error while deleting a permission: ${id}`,
      //     },
      //   });
      //   // debugger;
      // }
    } catch (error: any) {
      // debugger;
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
    }
  };
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
              <th></th>
            </tr>
          </thead>
          <tbody>{renderTableBody(state, dispatch, onDelete)}</tbody>
        </table>
      </div>
      <div className=" mt-8">
        <CustomePagination pageCount={5} handlePageClick={() => {}} />
      </div>
    </div>
  );
}

function renderTableBody(
  state: PermissionTableState,
  dispatch: (value: PermissionActionType) => void,
  onDelete: (value: number | number[]) => void
) {
  //delete logic

  if (state.loading === "loading") {
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

  if (state.loading === "error") {
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

  if (state.permissions && state.permissions.length > 0) {
    return state.permissions.map((item, index) => (
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
        <td className="w-[1rem]">
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onDelete(item.id);
              }}
            >
              {state.deleteLoading[item.id] ? (
                <LoadingSpiner dimension={15} />
              ) : (
                <MdDelete
                  size={30}
                  className="hover:fill-darkPurple"
                  color="#9a0ae4"
                />
              )}
            </button>
          </div>
        </td>
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
