import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BusinessProps {
  /**
   * Business id
   */
  id: number | null;
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
  /**
   * Business phonenumber
   */
  phoneNumber: string | null;
}

const initialState: BusinessProps = {
  id: null,
  name: null,
  verified: null,
  tier: null,
  phoneNumber: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutBusiness: (state: BusinessProps) => {
      state.id = null;
      state.name = null;
      state.verified = null;
      state.tier = null;
      state.phoneNumber = null;
    },
    loginBusiness: (
      state: BusinessProps,
      action: PayloadAction<BusinessProps>
    ) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.verified = action.payload.verified;
      state.tier = action.payload.tier;
      state.phoneNumber = action.payload.phoneNumber;
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
    setPhoneNumber: (state: BusinessProps, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
  },
});

export const {
  logoutBusiness,
  loginBusiness,
  setName,
  setVerified,
  setTier,
  setPhoneNumber,
} = auth.actions;
export default auth.reducer;
