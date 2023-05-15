import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthProps {
  /**
   * Indicates if the user is logged in
   */
  logged: boolean | null;
  /**
   * Indicates if the user completed the registration process.
  */
  registrationCompleted: boolean | null;
  /**
   * User ID if logged in
   */
  userId: number | null;
  /**
   * Business ID
   */
  id: number | null;
  /**
   * User email
   */
  email: string | null;
  /**
   * User token if logged in
   */
  token: string | null;
  /**
   * User refresh token if logged in
   */
  refresh: string | null;
}

const initialState: AuthProps = {
  logged: false,
  registrationCompleted: false,
  userId: null,
  id: null,
  email: null,
  token: null,
  refresh: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state: AuthProps) => {
      state.logged = false;
      state.registrationCompleted = false;
      state.userId = null;
      state.id = null;
      state.email = null;
      state.token = null;
      state.refresh = null;
    },
    loginUser: (state: AuthProps, action: PayloadAction<AuthProps>) => {
      state.logged = true;
      state.userId = action.payload.userId;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
    },
    setToken: (state: AuthProps, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRefresh: (state: AuthProps, action: PayloadAction<string>) => {
      state.refresh = action.payload;
    },
  },
});

export const { logoutUser, loginUser, setToken, setRefresh } = auth.actions;
export default auth.reducer;
