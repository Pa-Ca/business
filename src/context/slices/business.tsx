import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BusinessProps {
  /**
   * Business name
   */
  name: string | null;
  /**
   * Indicates if the business is verified
   */
  verified: boolean | null;
  /**
   * Business tier
   */
  tier: string | null;
}

const initialState: BusinessProps = {
  name: null,
  verified: null,
  tier: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutBusiness: (state: BusinessProps) => {
      state.name = null;
      state.verified = null;
      state.tier = null;
    },
    loginBusiness: (
      state: BusinessProps,
      action: PayloadAction<BusinessProps>
    ) => {
      state.name = action.payload.name;
      state.verified = action.payload.verified;
      state.tier = action.payload.tier;
    },
    setName: (state: BusinessProps, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setVerified: (state: BusinessProps, action: PayloadAction<boolean>) => {
      state.verified = action.payload;
    },
    setTier: (state: BusinessProps, action: PayloadAction<string>) => {
      state.tier = action.payload;
    },
  },
});

export const { logoutBusiness, loginBusiness, setName, setVerified, setTier } =
  auth.actions;
export default auth.reducer;
