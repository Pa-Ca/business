import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BranchInfoDTO from "../../objects/branch/BranchInfoDTO";

interface BranchesProps {
  /**
   * List of business branches
   */
  branches: BranchInfoDTO[];
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
    setBranches: (state: BranchesProps, action: PayloadAction<BranchInfoDTO[]>) => {
      state.branches = action.payload;
    },
    setCurrentBranch: (state: BranchesProps, action: PayloadAction<number>) => {
      state.current = action.payload;
    },
  },
});

export const { unsetBranches, setBranches, setCurrentBranch } =
  branches.actions;
export default branches.reducer;
