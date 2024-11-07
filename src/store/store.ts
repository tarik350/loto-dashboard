import { configureStore } from "@reduxjs/toolkit";

import { api } from "./api";
import { authApi } from "./authApi";
import { thunk } from "redux-thunk";
import rootReducer from "./rootReducers";

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
