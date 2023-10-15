import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
// import { useAppSelector } from "../../app/hooks";
// import moment from "moment";
// import { useParams } from "react-router-dom";
//import { cloneDeep } from "../../utils/helpers.utils";
import { RootState, AppThunk } from "../../app/store";
import { formatDate } from "../../utils/helpers.utils";
import {
  getValidationListRequest,
  getValidationDetailsRequest,
} from "./ValidationAPI";
export interface ValidationListState {
  list: any;
  status: "idle" | "loading" | "failed";
  isAutoRefresh: boolean;
  dataRefreshState: "idle" | "refreshed" | "loading" | "failed";
  pinned: true | false;
  searchText: string;
  searchedFrom: string;
  validationDetails: any;
}

const initialState: ValidationListState = {
  list: [],
  status: "idle",
  isAutoRefresh: false,
  dataRefreshState: "idle",
  pinned:false,
  searchText: "",
  searchedFrom: "",
  validationDetails: {},
};

const SLICE_NAME = "Validation";

export const getValidationsList = createAsyncThunk(
  `${SLICE_NAME}/getValidationList`,
  async (payload: any) => {
    const campaignId = payload.campaignId;
    const response = await getValidationListRequest(campaignId);
    const results = response?.data?.engagements ?? [];

    return results;
  }
);

export const getValidationsDetails = createAsyncThunk(
  `${SLICE_NAME}/getValidationDetails`,
  async (payload: any) => {
    const sessionId = payload.sessionId;
    const campaignId = payload.campaignId;
    const response = await getValidationDetailsRequest(campaignId, sessionId);
    const result = response.data.responses ?? {};

    return result;
  }
);

const groupArrayOfObjects = (list: any[], key: string) => {
  return list.reduce(function (rv, x) {
    rv[x[key]] = rv[x[key]] || {};
    rv[x[key]].name = x.name;
    rv[x[key]].processed = formatDate(x.date);
    (rv[x[key]].response = rv[x[key]].response || []).push(x.response);
    return rv;
  }, {});
};
const convertObjToArray = (obj: any) => {
  let retObj: any = [];
  Object.keys(obj).map((key) => {
    if (
      obj[key].response.filter((r: any) => r.UeTag == "UeTag_End").length > 0
    ) {
      obj[key].status = "complete";
    } else {
      obj[key].status = "processing";
    }
    retObj.push(obj[key]);
  });
  return retObj;
};
export const ValidationSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAutoRefreshOn: (state) => {
      state.isAutoRefresh = true;
    },
    setAutoRefreshOff: (state) => {
      state.isAutoRefresh = false;
    },
    setDataRefreshState: (state, action) => {
      state.dataRefreshState = action.payload;
    },
    setPinned: (state, action) => {
      state.pinned = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setSearchedFrom: (state, action) => {
      state.searchedFrom = action.payload;
    },
    setValidationsList: (state, action) => {
      state.list = action.payload;
    },
    setValidationsDetails: (state, action) => {
      state.validationDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getValidationsList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getValidationsList.fulfilled, (state, action) => {
        state.status = "idle";
        state.dataRefreshState = "refreshed";
        let list = action.payload ?? [];
        list.map((item: any) => {
          item.value = item.sessionId;
          item.processed = formatDate(item.date);
          item.text = item.emailId + " (" + item.processed + ")";
        });
        state.list = list;
      })
      .addCase(getValidationsDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getValidationsDetails.fulfilled, (state, action) => {
        state.status = "idle";
        state.dataRefreshState = "refreshed";
        let details = action.payload ?? {};

        state.validationDetails = details;
      });
  },
});

export const {
  setAutoRefreshOff,
  setAutoRefreshOn,
  setDataRefreshState,
  setPinned,
  setSearchText,
  setSearchedFrom,
  setValidationsList,
  setValidationsDetails
} = ValidationSlice.actions;

export const validationsList = (state: RootState) => state.validation.list;
export const validationDetails = (state: RootState) =>
  state.validation.validationDetails;
export const isAutoRefresh = (state: RootState) =>
  state.validation.isAutoRefresh;
export const dataRefreshState = (state: RootState) =>
  state.validation.dataRefreshState;
export const pinned = (state: RootState) =>
  state.validation.pinned;
export const searchText = (state: RootState) => state.validation.searchText;
export const searchedFrom = (state: RootState) => state.validation.searchedFrom;

export default ValidationSlice.reducer;
