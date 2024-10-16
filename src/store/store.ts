import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducers";
import { api } from "./api";
import { authApi } from "./authApi";
import { thunk } from "redux-thunk";

const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
    }).concat([api.middleware, authApi.middleware, thunk]),
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
