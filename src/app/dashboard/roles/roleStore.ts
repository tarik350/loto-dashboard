import { RoleDto } from "@/utils/dto/roleDto";

export const ActionTypes = {
  FETCH_ROLES_SUCCESS: "FETCH_ROLES_SUCCESS",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
  TOGGLE_CHECKBOX: "TOGGLE_CHECKBOX",
  SET_ALL_CHECKBOXES: "SET_ALL_CHECKBOXES",
  DELETE_ROLE: "DELETE_ROLE",
  SET_SEARCH_RESULTS: "SET_SEARCH_RESULTS",
} as const;
interface State {
  currentPage: number;
  lastPage?: number;
  roles: RoleDto[];
  isChecked: Record<number, boolean>;
  isLoading: boolean;
  isError: boolean;
}

interface Action {
  type: keyof typeof ActionTypes;
  payload?: any;
}

export const initialState: State = {
  currentPage: 1,
  lastPage: undefined,
  roles: [],
  isChecked: {},
  isLoading: false,
  isError: false,
};

export const roleReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.FETCH_ROLES_SUCCESS:
      const { roles, lastPage } = action.payload;
      const isChecked = roles.reduce(
        (acc: Record<number, boolean>, role: RoleDto) => {
          acc[role.id] = false;
          return acc;
        },
        {}
      );
      return {
        ...state,
        roles,
        lastPage,
        isChecked,
        isLoading: false,
        isError: false,
      };

    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case ActionTypes.TOGGLE_CHECKBOX:
      const id = action.payload;
      return {
        ...state,
        isChecked: {
          ...state.isChecked,
          [id]: !state.isChecked[id],
        },
      };

    case ActionTypes.SET_ALL_CHECKBOXES:
      const checked = action.payload;
      const updatedIsChecked = Object.keys(state.isChecked).reduce(
        (acc: Record<number, boolean>, id: string) => {
          acc[parseInt(id)] = checked;
          return acc;
        },
        {}
      );
      return {
        ...state,
        isChecked: updatedIsChecked,
      };

    case ActionTypes.DELETE_ROLE:
      const remainingRoles = state.roles.filter(
        (role) => !action.payload.includes(role.id)
      );
      return {
        ...state,
        roles: remainingRoles,
      };

    case ActionTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        roles: action.payload.roles,
        lastPage: action.payload.lastPage,
      };

    default:
      return state;
  }
};
