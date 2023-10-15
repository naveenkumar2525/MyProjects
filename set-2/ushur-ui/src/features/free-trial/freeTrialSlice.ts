import { getFreeTrialConfigRequest } from "./freeTrialAPI";
import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { getFreeTrialStatus } from "./freeTrialAPI";

export interface FreeTrialState {
  isFreeTrial: boolean | null;
  navPaths: any;
  accelerators: any;
  status: "idle" | "loading" | "failed" | "done" | "error";
}

const initialState: FreeTrialState = {
  isFreeTrial: null,
  navPaths: {},
  accelerators: [],
  status: "idle",
};

const SLICE_NAME = "freeTrial";

export const getFreeTrialConfig = createAsyncThunk(
  `${SLICE_NAME}/getFreeTrialConfigurations`,
  async () => {
    return await getFreeTrialConfigRequest();
  }
);

export const getFreeTrialEnvStatus = createAsyncThunk(
  `${SLICE_NAME}/getFreeTrialStatus`,
  async () => {
    const response = await getFreeTrialStatus();
    return response;
  }
);

export const freeTrialSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAccelerators: (state, action) => {
      state.accelerators = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFreeTrialConfig.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFreeTrialConfig.fulfilled, (state, { payload }) => {
        state.accelerators = payload?.accelerators || [];
        state.navPaths = payload?.navigator || {};
        state.status = "idle";
      })
      .addCase(getFreeTrialConfig.rejected, (state) => {
        state.status = "error";
      })
      .addCase(getFreeTrialEnvStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFreeTrialEnvStatus.fulfilled, (state, action) => {
        state.status = "idle";
        state.isFreeTrial =
          action.payload?.["ushur.platform.freeTrial"] === "yes";
      });
  }
});

export const isFreeTrial = (state: RootState) => state.freeTrial.isFreeTrial;
export const navPaths = (state: RootState) => state.freeTrial.navPaths;
export const accelerators = (state: RootState) => state.freeTrial.accelerators;

export const {setAccelerators} = freeTrialSlice.actions;
export default freeTrialSlice.reducer;
