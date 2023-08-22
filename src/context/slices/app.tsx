import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppProps {
  /**
   * Indicates if the app is loading
   */
  spinner?: boolean;
}

const initialState: AppProps = {
  spinner: false,
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    logoutApp: (state: AppProps) => {
      state.spinner = false;
    },
    setSpinner: (state: AppProps, action: PayloadAction<boolean>) => {
      state.spinner = action.payload;
    },
  },
});

export const {
  logoutApp,
  setSpinner,
} = app.actions;
export default app.reducer;
