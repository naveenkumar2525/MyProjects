import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import {
  createVariableRequest,
  getKeysListRequest,
  getVariablesListRequest,
  getVariableTypesRequest,
  updateKeyRequest,
  editVariableRequest,
  getSettings,
  getDataSecurityRule,
} from "./variablesAPI";

export interface VariablesState {
  list: any;
  variableTypes: any;
  createResponse: any;
  status: "idle" | "loading" | "failed";
  keysList: any;
  keyUpdated: any;
  editResponse: any;
  globalSettings: any;
  dataSecurityRule: any;
}

const initialState: VariablesState = {
  list: [],
  variableTypes: [],
  createResponse: {},
  status: "idle",
  keysList: [],
  keyUpdated: false,
  editResponse: {},
  globalSettings: {},
  dataSecurityRule: {},
};

const SLICE_NAME = "variables";

export const getVariablesList = createAsyncThunk(
  `${SLICE_NAME}/getVariablesList`,
  async () => {
    const response = await getVariablesListRequest();
    return response ?? [];
  }
);

export const getVariableTypes = createAsyncThunk(
  `${SLICE_NAME}/getVariableTypes`,
  async () => {
    const response = await getVariableTypesRequest();
    let { id, content } = response;
    content =  content.sort((a:any,b:any) => (
      (a?.title?.toLowerCase() || a?.type?.toLowerCase()) > (b?.title?.toLowerCase()||b?.type?.toLowerCase()) ? 1 : (b?.title?.toLowerCase()||b?.type?.toLowerCase()) > (a?.title?.toLowerCase() || a?.type?.toLowerCase()) ? -1 : 0));
    return {id,content} ?? [];
  }
);

export const saveVariableAPI = createAsyncThunk(
  `${SLICE_NAME}/saveVariableAPI`,
  async (payload: any) => {
    const { content } = payload;
    const response = await createVariableRequest(content);
    return response;
  }
);

export const getKeysListAPI = createAsyncThunk(
  `${SLICE_NAME}/getKeysListAPI`,
  async () => {
    const response = await getKeysListRequest();
    return response ?? [];
  }
);

export const updateKeyAPI = createAsyncThunk(
  `${SLICE_NAME}/updateKeyAPI`,
  async (payload: any) => {
    const { content } = payload;
    const response = await updateKeyRequest(content);
    return response ?? [];
  }
);

export const editVariableAPI = createAsyncThunk(
  `${SLICE_NAME}/editVariableAPI`,
  async (payload: any) => {
    const { content } = payload;
    const response = await editVariableRequest(content);
    return response;
  }
);

export const getSettingsAPI = createAsyncThunk(
  `${SLICE_NAME}/getSettingsAPI`,
  async () => {
    const response = await getSettings();
    return response ?? [];
  }
);

export const getDataSecurityRuleAPI = createAsyncThunk(
  `${SLICE_NAME}/getDataSecurityRuleAPI`,
  async () => {
    const response = await getDataSecurityRule();
    return response ?? [];
  }
);

export const variablesSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVariablesList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVariablesList.fulfilled, (state, action) => {
        state.list = action.payload ?? [];
      });
    builder
      .addCase(saveVariableAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveVariableAPI.fulfilled, (state, action) => {
        state.status = "idle";
        state.createResponse = action.payload ?? {};
        state.keyUpdated = "false";
      });
    builder
      .addCase(getVariableTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVariableTypes.fulfilled, (state, action) => {
        state.status = "idle";
        state.variableTypes = action.payload ?? [];
      });
    builder
      .addCase(getKeysListAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getKeysListAPI.fulfilled, (state, action) => {
        state.status = "idle";
        state.keysList = action.payload ?? [];
      });
    builder
      .addCase(updateKeyAPI.pending, (state) => {
        state.status = "loading";
        state.keyUpdated = false;
      })
      .addCase(updateKeyAPI.fulfilled, (state, action) => {
        state.status = "idle";
        state.keyUpdated = action.payload ?? [];
      });
    builder
      .addCase(editVariableAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editVariableAPI.fulfilled, (state, action) => {
        state.status = "idle";
        state.editResponse = action.payload ?? {};
      });
    builder
      .addCase(getSettingsAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSettingsAPI.fulfilled, (state, action) => {
        state.globalSettings = action.payload ?? [];
      });
    builder
      .addCase(getDataSecurityRuleAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDataSecurityRuleAPI.fulfilled, (state, action) => {
        state.dataSecurityRule = action.payload ?? [];
      });
  },
});

export const encryptTotalCount = (list: any) => {
  let count = 0;
  if (list?.content?.length > 0) {
    const objects = list.content[0];
    for (let x in objects) {
      if (objects[x].sec == "yes") {
        count++;
      }
    }
  }
  return count;
};

export const getTotalVariableCount = (list:any) => {
  let count = 0;
  if (list?.content?.length > 0) {
    count = Object.keys(list?.content[0]).length - 1;
  }
  return count;
};

export const {} = variablesSlice.actions;

export const variablesList = (state: RootState) => state.variables.list;

export const variableTypes = (state: RootState) =>
  state.variables.variableTypes;

export const createResponse = (state: RootState) =>
  state.variables.createResponse;

export const keysList = (state: RootState) => state.variables.keysList;

export const keyUpdated = (state: RootState) => state.variables.keyUpdated;

export const editResponse = (state: RootState) => state.variables.editResponse;

export const globalSettings = (state: RootState) =>
  state.variables.globalSettings;

export const dataSecurityRule = (state: RootState) =>
  state.variables.dataSecurityRule;

export default variablesSlice.reducer;
