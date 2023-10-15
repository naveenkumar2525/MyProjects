import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { getDataSecurityRule } from "../variables/variablesAPI";
import {
  getMetaData,
  getLogsHistory,
  addMetaData,
  deleteMetaData,
  bulkUploadData,
  getmetaDataCount,
} from "./metadataAPI";

export interface MetaDataState {
  dataList: any;
  logsHistory: any;
  dataUpdated: any;
  dataUploaded: any;
  status: "idle" | "loading" | "failed";
  isAutoRefresh: boolean;
  dataRefreshState: "idle" | "refreshed" | "loading" | "failed";
  encryptedData: any;
  decryptedData: any;
  count: any;
}

const initialState: MetaDataState = {
  dataList: {},
  logsHistory: [],
  dataUpdated: {},
  status: "idle",
  dataUploaded: false,
  isAutoRefresh: false,
  dataRefreshState: "idle",
  encryptedData: [],
  decryptedData: [],
  count: 0,
};

const SLICE_NAME = "metadata";

export const getMetaDataAPI = createAsyncThunk(
  `${SLICE_NAME}/getMetaData`,
  async (payload: any) => {
    const { content } = payload;
    const entSettings = await getDataSecurityRule();
    const fetchLimit = +(entSettings?.data?.fetchLimit ?? "2000");
    const response = await getMetaData(content, "yes");
    let { counts, data = [], lastRecordId, totalRecords } = response;

    let allData = [].concat(data);
    let currRecords = counts;
    const requiredRecords = Math.min(fetchLimit, totalRecords);
    let noOfReqs = 0;

    while (currRecords < requiredRecords && noOfReqs++ < 20) {
      const curr_resp = await getMetaData(content, "yes", lastRecordId);
      currRecords += curr_resp?.counts ?? 0;
      lastRecordId = curr_resp?.lastRecordId ?? "";
      allData = allData.concat(curr_resp?.data ?? []);
    }

    return allData ?? [];
  }
);

export const getDecryptedMetaData = createAsyncThunk(
  `${SLICE_NAME}/getMetaData?encrypt=no`,
  async (payload: any) => {
    const { content } = payload;

    const entSettings = await getDataSecurityRule();
    const fetchLimit = +(entSettings?.data?.fetchLimit ?? "2000");
    const response = await getMetaData(content, "no");
    let { counts, data = [], lastRecordId, totalRecords } = response;

    let allData = [].concat(data);
    let currRecords = counts;
    const requiredRecords = Math.min(fetchLimit, totalRecords);
    let noOfReqs = 0;

    while (currRecords < requiredRecords && noOfReqs++ < 20) {
      const curr_resp = await getMetaData(content, "no", lastRecordId);
      currRecords += curr_resp?.counts ?? 0;
      lastRecordId = curr_resp?.lastRecordId ?? "";
      allData = allData.concat(curr_resp?.data ?? []);
    }

    return allData ?? [];
  }
);

export const addMetaDataAPI = createAsyncThunk(
  `${SLICE_NAME}/addMetadata`,
  async (payload: any) => {
    const { content } = payload;
    const response = await addMetaData(content);
    return response ?? [];
  }
);

export const deleteMetaDataAPI = createAsyncThunk(
  `${SLICE_NAME}/deleteMetadata`,
  async (payload: any) => {
    const { content } = payload;
    const response = await deleteMetaData(content);
    return response ?? [];
  }
);

export const getLogsHistoryAPI = createAsyncThunk(
  `${SLICE_NAME}/getLogsHistory`,
  async (payload: any) => {
    const content = payload;
    const response = await getLogsHistory(content);
    return response ?? [];
  }
);

export const uploadDataAPI = createAsyncThunk(
  `${SLICE_NAME}/uploadData`,
  async (payload: any) => {
    const { content } = payload;
    const response = await bulkUploadData(content);
    return response ?? [];
  }
);

export const getMetaDataCountAPI = createAsyncThunk(
  `${SLICE_NAME}/getMetaDataCount`,
  async () => {
    const response = await getmetaDataCount();
    return response.counts || 0;
  }
);



export const metaDataSlice = createSlice({
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
    setMetaData: (state, action) => {
      state.dataList = { ...state.dataList, data: action.payload };
    },
    setUpdatedEncryptionData: (state, action) => {
      const newEncryptionRules = action.payload; 
      const existingMetadata = JSON.parse(JSON.stringify(state.dataList)) || [];
      const encryptedData: any[] =
        JSON.parse(JSON.stringify(state.encryptedData)) || [];
      const decryptedData: any[] =
        JSON.parse(JSON.stringify(state.decryptedData)) || [];

      const data = existingMetadata.map((row: any, i: any) => {
        Object.keys(row).map((key: any) => {
          if (newEncryptionRules[key] === "yes") {
            row[key] = encryptedData[i][key];
          }
          if (newEncryptionRules[key] === "no") {
            row[key] = decryptedData[i][key];
          }
        });
        return row;
      });
      state.dataList = data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMetaDataAPI.pending, (state) => {
        state.status = "loading";
        state.dataUpdated = {};
      })
      .addCase(getMetaDataAPI.fulfilled, (state, action) => {
        state.dataList = action.payload ?? {};
        state.encryptedData = action.payload || [];
        state.status = "idle";
      });
    builder
      .addCase(getDecryptedMetaData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDecryptedMetaData.fulfilled, (state, action) => {
        state.decryptedData = action.payload || [];
        state.status = "idle";
      });
    builder
      .addCase(getLogsHistoryAPI.pending, (state) => {
        state.status = "loading";
        state.dataRefreshState = "idle";
      })
      .addCase(getLogsHistoryAPI.fulfilled, (state, action) => {
        state.logsHistory = action.payload ?? [];
        state.dataRefreshState = "refreshed";
        state.status = "idle";
      });
    builder
      .addCase(addMetaDataAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addMetaDataAPI.fulfilled, (state, action) => {
        state.dataUpdated = action.payload ?? {};
        state.status = "idle";
      });
    builder
      .addCase(deleteMetaDataAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMetaDataAPI.fulfilled, (state, action) => {
        state.dataUpdated = action.payload ?? {};
        state.status = "idle";
      });
    builder
      .addCase(uploadDataAPI.pending, (state) => {
        state.status = "loading";
        state.dataUploaded = false;
      })
      .addCase(uploadDataAPI.fulfilled, (state, action) => {
        state.dataUploaded = true ?? {};
        state.status = "idle";
      });
    builder
      .addCase(getMetaDataCountAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMetaDataCountAPI.fulfilled, (state, action) => {
        state.count = action.payload;
        state.status = "idle";
      });

  },
});



export const {
  setAutoRefreshOff,
  setAutoRefreshOn,
  setDataRefreshState,
  setUpdatedEncryptionData,
} = metaDataSlice.actions;

export const listOfMetaData = (state: RootState) => state.metadata.dataList;

export const getLogsHistoryData = (state: RootState) =>
  state.metadata.logsHistory;

export const dataUpdated = (state: RootState) => state.metadata.dataUpdated;

export const dataUploaded = (state: RootState) => state.metadata.dataUploaded;

export const isAutoRefresh = (state: RootState) => state.metadata.isAutoRefresh;

export const metaDataCount = (state: RootState) => state.metadata.count;

export const dataRefreshState = (state: RootState) =>
  state.metadata.dataRefreshState;



export const isAPILoading = (state: RootState) => state.metadata.status;

export default metaDataSlice.reducer;
