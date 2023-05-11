import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BranchProps {
  /**
   * Branch id
   */
  id: number | null;
  /**
   * Branch address
   */
  address: string | null;
  /**
   * Exact location of the branch
   */
  coordinates: string | null;
  /**
   * Branch name
   */
  name: string | null;
  /**
   * Branch phone number. [TODO] agregar al back
   */
  phoneNumber: string | null;
  /**
   * Branch type. [TODO] agregar al back
   */
  type: string | null;
  /**
   * Branch overview
   */
  overview: string | null;
  /**
   * Branch score given by users
   */
  score: number | null;
  /**
   * Maximum number of clients that the branch can have at the same time
   */
  capacity: number | null;
  /**
   * Price of a reservation
   */
  reservationPrice: number | null;
  /**
   * Indicates if reservations can be made
   */
  reserveOff: boolean | null;
  /**
   * Average time a reservation lasts
   */
  averageReserveTime: number | null;
  /**
   * Indicates if the branch will be publicly visible
   */
  visibility: boolean | null;
}

interface BranchesProps {
  /**
   * List of business branches
   */
  branches: BranchProps[];
  /**
   * Branch you are currently focusing on
   */
  current: number;
}

const initialState: BranchesProps = {
  branches: [],
  current: -1,
};

const branches = createSlice({
  name: "branches",
  initialState,
  reducers: {
    unsetBranches: (state: BranchesProps) => {
      state.branches = [];
      state.current = -1;
    },
    setBranches: (
      state: BranchesProps,
      action: PayloadAction<BranchProps[]>
    ) => {
      state.branches = action.payload;
    },
    setCurrentBranch: (state: BranchesProps, action: PayloadAction<number>) => {
      state.current = state.branches.findIndex(
        (branch) => branch.id === action.payload
      );
    },
  },
});

export const { unsetBranches, setBranches, setCurrentBranch } =
  branches.actions;
export default branches.reducer;
