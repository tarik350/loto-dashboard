import { combineReducers } from "@reduxjs/toolkit";
import { api } from "./api";
import { authApi } from "./authApi";
import sessionSlice from "./features/sessionSlice";
const rootReducer = combineReducers({
  session: sessionSlice,
  [api.reducerPath]: api.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

export default rootReducer;
