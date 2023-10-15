import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import {
  createOrUpdateHubSettings,
  getHubSettings,
  getHubsList,
  createHubPortal,
  getHubWorkflows,
  updateHubWorkflows,
  getJsonConfigForPortal,
  getAccessRoles,
  updateAccessRoles
} from "./hubSettingsAPI";

export interface HubSetttingsState {
  workflowGroupChanges: any;
  jsonConfig: any;
  status: "idle" | "loading" | "failed";
  hubsList: any;
  hubSettings: any;
  hubWorkflows: any;
  saveSettingsResp: any;
  saveWorkflowsResp: any;
  accessRoles: any;
  accessRoleGroupChanges: any;
  saveAccessRolesResp: any;
}

const initialState: HubSetttingsState = {
  workflowGroupChanges: {},
  jsonConfig: {},
  status: "idle",
  hubsList: [],
  hubSettings: {},
  hubWorkflows: [],
  saveSettingsResp: null,
  saveWorkflowsResp: null,
  accessRoles: [],
  accessRoleGroupChanges: {},
  saveAccessRolesResp: null
};

const SLICE_NAME = "hub_settings";

export const createHubPortalAsync = createAsyncThunk(
  `${SLICE_NAME}/createHubPortal`,
  async (payload: any) => {
    const response = await createHubPortal(payload);
    return response ?? {};
  }
);

export const getHubsListAsync = createAsyncThunk(
  `${SLICE_NAME}/getHubsList`,
  async () => {
    const response = await getHubsList();
    return response?.data ?? [];
  }
);

export const createPortalAndGet =
  (payload: any) => async (dispatch: any, getState: any) => {
    await dispatch(getHubsListAsync());
    const state = getState();
    const id = state.hubSettings.hubsList?.[0]?.id;
    if (!id) {
      await dispatch(createHubPortalAsync(payload));
      return await dispatch(getHubsListAsync());
    }
  };

export const getJsonConfigForPortalAsync = createAsyncThunk(
  `${SLICE_NAME}/getJsonConfigForPortal`,
  async () => {
    const response = await getJsonConfigForPortal();
    return response?.data ?? {};
  }
);

export const getHubsSettingsAsync = createAsyncThunk(
  `${SLICE_NAME}/getHubsSettings`,
  async (payload: any) => {
    const { id } = payload;
    const response = await getHubSettings(id);
    return response?.data ?? {};
  }
);

export const createHubsSettingsAsync = createAsyncThunk(
  `${SLICE_NAME}/createHubsSettings`,
  async (payload: any) => {
    const response = await createOrUpdateHubSettings("POST", payload);
    return response ?? {};
  }
);

export const updateHubsSettingsAsync = createAsyncThunk(
  `${SLICE_NAME}/updateHubsSettings`,
  async (payload: any) => {
    try {
      const response = await createOrUpdateHubSettings("PUT", payload);
      return response ?? {};
    } catch (err: any) {
      return {
        error: true,
      };
    }
  }
);

export const getHubWorkflowsAsync = createAsyncThunk(
  `${SLICE_NAME}/getHubWorkflows`,
  async (payload: any) => {
    const { id } = payload;
    const response = await getHubWorkflows(id);
    return response?.data;
  }
);

export const updateHubWorkflowsAsync = createAsyncThunk(
  `${SLICE_NAME}/updateHubWorkflows`,
  async (payload: any) => {
    try {
      const response = await updateHubWorkflows(payload);
      return response ?? { error: true };
    } catch (err: any) {
      return {
        error: true,
      };
    }
  }
);

export const getAccessRolesAsync = createAsyncThunk(
  `${SLICE_NAME}/accessRoles`,
  async (payload: any) => {
    const { id } = payload;
    const response = await getAccessRoles(id);
    return response?.data;
  }
);

export const updateAccessRolesAsync = createAsyncThunk(
  `${SLICE_NAME}/accessRole`,
  async (payload: any) => {
    try {
      const response = await updateAccessRoles(payload);
      return response ?? { error: true };
    } catch (err: any) {
      return {
        error: true,
      };
    }
  }
);

export const hubSettingsSlice = createSlice({
  name: "hubSettings",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateChanges: (state, action) => {
      const { id, fieldName, value } = action.payload;
      state.workflowGroupChanges = {
        ...state.workflowGroupChanges,
        [id]: { ...state.workflowGroupChanges[id], id, [fieldName]: value },
      };
    },
    updateAllChanges: (state, action) => {
      const workflows = action?.payload ?? [];
      state.workflowGroupChanges = workflows.reduce(
        (acc: any, curr: any) => ({
          ...acc,
          [curr.id]: { ...curr },
        }),
        {}
      );
    },
    deleteChanges: (state, action) => {
      const { id } = action.payload;
      state.workflowGroupChanges = {
        ...state.workflowGroupChanges,
        [id]: { ...state.workflowGroupChanges[id], deleted: true },
      };
    },
    resetSaveSettingsResp: (state, action) => {
      state.saveSettingsResp = null;
    },
    resetSaveWorkflowsResp: (state, action) => {
      state.saveWorkflowsResp = null;
    },
    resetAccessRolesResp: (state, action) => {
      state.saveAccessRolesResp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJsonConfigForPortalAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJsonConfigForPortalAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.jsonConfig = action.payload ?? {};
      });
    builder
      .addCase(getHubsListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHubsListAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.hubsList = action.payload ?? [];
      });
    builder
      .addCase(getHubsSettingsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHubsSettingsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.hubSettings = action.payload ?? {};
      });
    builder
      .addCase(getHubWorkflowsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHubWorkflowsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.hubWorkflows = action.payload ?? [];
      });
    builder
      .addCase(updateHubsSettingsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateHubsSettingsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.saveSettingsResp = action.payload ?? {
          error: true,
        };
      });
    builder
      .addCase(updateHubWorkflowsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateHubWorkflowsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.saveWorkflowsResp = action.payload ?? {
          error: true,
        };
      });
    builder
      .addCase(getAccessRolesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAccessRolesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.accessRoles = action.payload ?? [];
      })
      .addCase(updateAccessRolesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAccessRolesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.saveAccessRolesResp = action.payload ?? {
          error: true,
        };
      });
  },
});

export const {
  updateChanges,
  updateAllChanges,
  deleteChanges,
  resetSaveSettingsResp,
  resetSaveWorkflowsResp,
  resetAccessRolesResp
} = hubSettingsSlice.actions;

export const workflowGroupChanges = (state: RootState) =>
  state.hubSettings.workflowGroupChanges;

export const accessRoleGroupChanges = (state: RootState) => 
  state.hubSettings.accessRoleGroupChanges;

export const accessRoles = (state: RootState) =>
  state.hubSettings.accessRoles;

export const saveAccessRolesResp = (state: RootState) =>
  state.hubSettings.saveAccessRolesResp;

export const hubsList = (state: RootState) => state.hubSettings.hubsList;
export const hubSettings = (state: RootState) => state.hubSettings.hubSettings;
export const hubWorkflows = (state: RootState) =>
  state.hubSettings.hubWorkflows;

export const saveSettingsResp = (state: RootState) =>
  state.hubSettings.saveSettingsResp;
export const saveWorkflowsResp = (state: RootState) =>
  state.hubSettings.saveWorkflowsResp;
  
export const jsonConfigForPortal = (state: RootState) =>
  state.hubSettings.jsonConfig;

export default hubSettingsSlice.reducer;
