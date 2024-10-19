import { httpRequestStatus } from "@/utils/constants";
import { PermissionDto } from "@/utils/dto/permissionDto";

export enum PermissionTableActionTypes {
  ADD_PERMISSIONS = "ADD_PERMISSIONS",
  ADD_ALL_ISCHECKED = "ADD_ALL_ISCHECKED",
  ADD_ISCHECKED = "ADD_ISCHECKED",
  REMOVE_ISCHECKED = "REMOVE_ISCHECKED",
  CLEAR_ISCHECKED = "CLEAR_ISCHECKED",
  SET_BULK_DELETE_LOADING = "SET_BULK_DELETE_LOADING",
  SET_DELETE_LOADING = "SET_DELETE_LOADING",
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  SET_IS_SEARCH = "SET_IS_SEARCH",
  SET_CATEGORY_FILTER = "SET_CATEGORY_FILTER",
}

// An interface for our actions
interface AddPermissionsAction {
  type: PermissionTableActionTypes.ADD_PERMISSIONS;
  payload: {
    permissions: PermissionDto[];
    pages?: number;
  };
}
interface SetIsSearchAction {
  type: PermissionTableActionTypes.SET_IS_SEARCH;
  payload: boolean;
}
interface SetCategoryFilter {
  type: PermissionTableActionTypes.SET_CATEGORY_FILTER;
  payload: number | undefined;
}

interface SetCurrentPageAction {
  type: PermissionTableActionTypes.SET_CURRENT_PAGE;
  payload: number;
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

export type PermissionActionType =
  | AddPermissionsAction
  | AddIsCheckedAction
  | RemoveIsCheckedAction
  | AddAllIsCheckedAction
  | RemoveAllIsCheckedAction
  | SetBulkDeleteLoadingAction
  | SetDeleteLoadingAction
  | SetIsSearchAction
  | SetCategoryFilter
  | SetCurrentPageAction;
// Add other action interfaces as needed...
// An interface for our state
export interface PermissionTableState {
  isChecked: Record<number, boolean>;
  isSearch: boolean;
  permissions: {
    permissions: PermissionDto[];
    pages?: number;
  };
  bulkDeleteLoading: {
    value: httpRequestStatus;
    message?: string;
  };
  deleteLoading: Record<string, boolean>;
  currentPage: number;
  filterCategoryId?: number;
}

export function permissionReducer(
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

    case PermissionTableActionTypes.ADD_ALL_ISCHECKED:
      return {
        ...state,
        isChecked: action.payload,
      };
    case PermissionTableActionTypes.SET_IS_SEARCH:
      return {
        ...state,
        isSearch: action.payload,
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
    case PermissionTableActionTypes.SET_CATEGORY_FILTER:
      return {
        ...state,
        filterCategoryId: action.payload,
      };
    case PermissionTableActionTypes.SET_DELETE_LOADING:
      return {
        ...state,
        deleteLoading: {
          ...state.deleteLoading,
          [action.paylaod.key]: action.paylaod.value,
        },
      };
    case PermissionTableActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
}
