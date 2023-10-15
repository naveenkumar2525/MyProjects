import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getIntegrationRequest,
  getIntegrationRequestById,
  deleteIntegrationRequestById,
  putIntegrationRequestById,
  patchIntegrationRequestById,
  putPatchIntegrationRequestById,
  selectiveEnablingRequest,
  selectiveAllRequest,
} from "./integrationApi";
import { AppThunk, RootState } from "../../app/store";

interface IntegrationSliceState {
  integrationList: any;
  integrationAdminList: any;
  integrationbById: any;
  status: string;
  delItem: any;
  putItem: any;
  delStatus: string;
  putStatus: string;
  patchStatus: string;
  putPatchStatus: string;
}

const initialState: IntegrationSliceState = {
  integrationList: [],
  integrationAdminList: [],
  integrationbById: [],
  status: "idle",
  delItem: [],
  putItem: [],
  delStatus: "idle",
  putStatus: "idle",
  patchStatus: "idle",
  putPatchStatus: "idle",
};

const SLICE_NAME = "integration";

export const getIntegrationAPI = createAsyncThunk(
  `${SLICE_NAME}/getIntegration`,
  async () => {
    const data = getIntegrationRequest();

    return data;
  }
);
export const getIntegrationAPIById = createAsyncThunk(
  `${SLICE_NAME}/getIntegrationById`,
  async (payload: any) => {
    const data: any = getIntegrationRequestById(payload);

    return data;
  }
);

export const deleteIntegrationAPIById = createAsyncThunk(
  `${SLICE_NAME}/deleteIntegrationById`,
  async (id: any) => {
    const data: any = deleteIntegrationRequestById(id);

    return data;
  }
);

export const putIntegrationAPIById = createAsyncThunk(
  `${SLICE_NAME}/putIntegrationById`,
  async (payload: any) => {
    const data: any = putIntegrationRequestById(payload);

    return data;
  }
);

export const patchIntegrationAPIById = createAsyncThunk(
  `${SLICE_NAME}/patchIntegrationById`,
  async (id: any) => {
    const data: any = patchIntegrationRequestById(id);

    return data;
  }
);

export const putPatchIntegrationAPIById = createAsyncThunk(
  `${SLICE_NAME}/putPatchIntegrationById`,
  async (id: any) => {
    const data: any = putPatchIntegrationRequestById(id);

    return data;
  }
);

export const postSelectiveEnabling = createAsyncThunk(
  `${SLICE_NAME}/selectiveEnablingRequest`,
  async (payload: any) => {
    const data: any = selectiveEnablingRequest(payload);

    return data;
  }
);

export const getSelectiveEnabling = createAsyncThunk(
  `${SLICE_NAME}/selectiveAllRequest`,
  async () => {
    const data: any = selectiveAllRequest();

    return data;
  }
);

const integrationSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIntegrationAPI.pending, (state) => {
        state.status = "starting";
      })
      .addCase(getIntegrationAPI.fulfilled, (state, { payload }) => {
        state.integrationList = payload;
        state.status = "done";
      })
      .addCase(getIntegrationAPI.rejected, (state) => {
        state.status = "error";
      });

    builder
      .addCase(getIntegrationAPIById.pending, (state) => {
        state.status = "starting";
      })
      .addCase(getIntegrationAPIById.fulfilled, (state, { payload }) => {
        state.integrationbById = payload;
        state.status = "done";
      })
      .addCase(getIntegrationAPIById.rejected, (state) => {
        state.status = "error";
      });

    builder
      .addCase(deleteIntegrationAPIById.pending, (state) => {
        state.delStatus = "starting";
      })
      .addCase(deleteIntegrationAPIById.fulfilled, (state, { payload }) => {
        state.delItem = payload;
        state.putStatus = "doneDel";
      })
      .addCase(deleteIntegrationAPIById.rejected, (state) => {
        state.delStatus = "error";
      });

    builder
      .addCase(putIntegrationAPIById.pending, (state) => {
        state.putStatus = "starting";
      })
      .addCase(putIntegrationAPIById.fulfilled, (state, { payload }) => {
        state.putItem = payload;
        state.putStatus = "done";
      })
      .addCase(putIntegrationAPIById.rejected, (state) => {
        state.putStatus = "error";
      });

    builder
      .addCase(patchIntegrationAPIById.pending, (state) => {
        state.patchStatus = "starting";
      })
      .addCase(patchIntegrationAPIById.fulfilled, (state, { payload }) => {
        state.patchStatus = "done";
      })
      .addCase(patchIntegrationAPIById.rejected, (state) => {
        state.patchStatus = "error";
      });
    builder
      .addCase(putPatchIntegrationAPIById.pending, (state) => {
        state.putPatchStatus = "starting";
      })
      .addCase(putPatchIntegrationAPIById.fulfilled, (state, { payload }) => {
        state.putPatchStatus = "done";
      })
      .addCase(putPatchIntegrationAPIById.rejected, (state) => {
        state.putPatchStatus = "done";
      });

    builder
      .addCase(postSelectiveEnabling.pending, (state) => {
        state.putStatus = "idle";
      })
      .addCase(postSelectiveEnabling.fulfilled, (state, { payload }) => {
        if (payload.errMsg) {
          state.putStatus = payload.errMsg;
        } else {
          state.putStatus = "done";
        }
      })
      .addCase(postSelectiveEnabling.rejected, (state, { payload }) => {
        state.putPatchStatus = "catch error";
      });

    builder
      .addCase(getSelectiveEnabling.pending, (state) => {
        state.patchStatus = "starting";
      })
      .addCase(getSelectiveEnabling.fulfilled, (state, { payload }) => {
        state.integrationAdminList = payload;
        state.patchStatus = "done";
      })
      .addCase(getSelectiveEnabling.rejected, (state) => {
        state.patchStatus = "error";
      });
  },
});

export const integrationsAdmin = (state: RootState) =>
  state.integration.integrationAdminList;
export const integrations = (state: RootState) =>
  state.integration.integrationList;
export const integrationById = (state: RootState) =>
  state.integration.integrationbById;
export const putStatus = (state: RootState) => state.integration.putStatus;
export default integrationSlice.reducer;
