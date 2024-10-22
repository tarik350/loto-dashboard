// Define the action types
interface Entity {
  id: number; // Define the id property here
}
export const ActionTypes = {
  FETCH_ENTITIES_SUCCESS: "FETCH_ENTITIES_SUCCESS",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
  TOGGLE_CHECKBOX: "TOGGLE_CHECKBOX",
  SET_ALL_CHECKBOXES: "SET_ALL_CHECKBOXES",
  DELETE_ENTITY: "DELETE_ENTITY",
  SET_SEARCH_RESULTS: "SET_SEARCH_RESULTS",
} as const;

// Generic State Interface
interface State<T extends Entity> {
  currentPage: number;
  lastPage?: number;
  entities: T[];
  isChecked: Record<number, boolean>;
}

// Generic Action Interface
interface FetchEntitiesSuccessAction<T> {
  type: typeof ActionTypes.FETCH_ENTITIES_SUCCESS;
  payload: { entities: T[]; lastPage?: number };
}

interface SetCurrentPageAction {
  type: typeof ActionTypes.SET_CURRENT_PAGE;
  payload: number;
}

interface ToggleCheckboxAction {
  type: typeof ActionTypes.TOGGLE_CHECKBOX;
  payload: number; // ID of the entity
}

interface SetAllCheckboxesAction {
  type: typeof ActionTypes.SET_ALL_CHECKBOXES;
  payload: boolean; // Checked state
}

interface DeleteEntityAction<T extends Entity> {
  type: typeof ActionTypes.DELETE_ENTITY;
  payload: number[];
}

interface SetSearchResultsAction<T> {
  type: typeof ActionTypes.SET_SEARCH_RESULTS;
  payload: { entities: T[]; lastPage?: number };
}

// Combine all action types into a single type

type Action<T extends Entity> =
  | FetchEntitiesSuccessAction<T>
  | SetCurrentPageAction
  | ToggleCheckboxAction
  | SetAllCheckboxesAction
  | DeleteEntityAction<T>
  | SetSearchResultsAction<T>;

// Initial State
export const initialState: State<any> = {
  currentPage: 1,
  lastPage: undefined,
  entities: [],
  isChecked: {},
};

export const genericReducer = <T extends Entity>(
  state: State<T>,
  action: Action<T>
): State<T> => {
  switch (action.type) {
    case ActionTypes.FETCH_ENTITIES_SUCCESS:
      const { entities, lastPage } = action.payload;
      const isChecked = entities.reduce(
        (acc: Record<number, boolean>, entity) => {
          acc[entity.id] = false; // TypeScript knows entity has an id property
          return acc;
        },
        {}
      );
      return {
        ...state,
        entities,
        lastPage,
        isChecked,
      };

    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case ActionTypes.TOGGLE_CHECKBOX:
      return {
        ...state,
        isChecked: {
          ...state.isChecked,
          [action.payload]: !state.isChecked[action.payload],
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

    case ActionTypes.DELETE_ENTITY:
      const remainingEntities = state.entities.filter(
        (entity) => !action.payload.includes(entity.id) // Now TypeScript knows entity has an id property
      );
      return {
        ...state,
        entities: remainingEntities,
      };

    case ActionTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        entities: action.payload.entities,
        lastPage: action.payload.lastPage,
      };

    default:
      return state;
  }
};
