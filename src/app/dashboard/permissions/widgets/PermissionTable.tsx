import style from "@/styles/table.module.css";
import { httpRequestStatus } from "@/utils/constants";
import { PermissionDto } from "@/utils/dto/permissionDto";
import { GenericResponse } from "@/utils/types";
import CustomePagination from "@/utils/widgets/CustomePagination";
import LoadingSpinner from "@/utils/widgets/LoadingSpinner";
import LoadingSpiner from "@/utils/widgets/LoadingSpinner";
import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { RenderStrategy } from "node_modules/@headlessui/react/dist/utils/render";
import { permission } from "process";
import { useEffect, useReducer, useState } from "react";
import { BiBasket, BiSolidBasket } from "react-icons/bi";
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
}

// An interface for our actions
interface AddPermissionsAction {
  type: PermissionTableActionTypes.ADD_PERMISSIONS;
  payload: PermissionDto[];
}

interface AddIsCheckedAction {
  type: PermissionTableActionTypes.ADD_ISCHECKED;
  payload: string;
}

interface RemoveIsCheckedAction {
  type: PermissionTableActionTypes.REMOVE_ISCHECKED;
  payload: string;
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

// Add other action interfaces here...

// Combine all action types into one discriminated union type
type PermissionActionType =
  | AddPermissionsAction
  | AddIsCheckedAction
  | RemoveIsCheckedAction
  | AddAllIsCheckedAction
  | RemoveAllIsCheckedAction
  | SetLoadingStatusAction;
// Add other action interfaces as needed...
// An interface for our state
interface PermissionTableState {
  isChecked: Record<string, boolean>;
  permissions: PermissionDto[];
  loading: httpRequestStatus;
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

    default:
      return state;
  }
}

export default function PermissionTable({}: {}) {
  const [state, dispatch] = useReducer(permissionReducer, {
    isChecked: {},
    permissions: [],
    loading: "initial",
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
  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get("token");
        dispatch({
          type: PermissionTableActionTypes.SET_LOADING_STATUS,
          payload: "loading",
        });
        const response = await fetch(
          "http://localhost:3000/api/admin/permission",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: GenericResponse<PermissionDto[]> = await response.json();
        if (data.status === 200) {
          dispatch({
            type: PermissionTableActionTypes.SET_LOADING_STATUS,
            payload: "success",
          });
          dispatch({
            type: PermissionTableActionTypes.ADD_PERMISSIONS,
            payload: data.content ?? [],
          });
        } else {
          dispatch({
            type: PermissionTableActionTypes.SET_LOADING_STATUS,
            payload: "error",
          });
        }
      } catch (error) {
        dispatch({
          type: PermissionTableActionTypes.SET_LOADING_STATUS,
          payload: "error",
        });
      }
    })();
  }, []);
  return (
    <div className={style.table__container__highlight}>
      <div className="flex justify-between items-end">
        <h2>Permissions</h2>
        {Object.values(state.isChecked).some((item) => item === true) && (
          <button
            type="button"
            className="   text-white bg-red-600 rounded-xl  min-w-[6rem] min-h-[2.5rem]"
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
          <tbody>{renderTableBody(state, dispatch)}</tbody>
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
  dispatch: (value: PermissionActionType) => void
) {
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
        <td>{item.category}</td>
        <td className="w-[1rem]">
          <div className="flex justify-between gap-2">
            <button>
              <MdDelete
                size={30}
                className="hover:fill-darkPurple"
                color="#9a0ae4"
              />
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
