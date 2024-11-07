import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type sessionExpirationStatus = "expired" | "active" | "pure";
interface SessionType {
  isSessionExpired: sessionExpirationStatus;
}
const initialState: SessionType = {
  isSessionExpired: "pure",
};

export const sessionSlice = createSlice({
  initialState,
  name: "session",
  reducers: {
    setSessionExpired: (
      state,
      action: PayloadAction<sessionExpirationStatus>
    ) => {
      state.isSessionExpired = action.payload;
    },
  },
});

export const { setSessionExpired } = sessionSlice.actions;
export default sessionSlice.reducer;
