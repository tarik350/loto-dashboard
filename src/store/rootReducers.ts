import { combineReducers } from "@reduxjs/toolkit";
import { api } from "./api";
import { authApi } from "./authApi";

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authApi.reducerPath]: authApi.reducer,
});
