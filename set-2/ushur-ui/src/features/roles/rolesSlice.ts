import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { getUserAccessInfo ,globalRoleTemplates } from "./rolesAPI";
import {
  isAdminAccess,
} from "../../utils/api.utils";
export interface RolesState {
  data: any;
  status: "idle" | "loading" | "failed";
}

const initialState: RolesState = {
  data: {},
  status: "idle",
};

const SLICE_NAME = "roles";

export const getRolesDataAsync = createAsyncThunk(
  `${SLICE_NAME}/getRolesData`,
  async (payload: any) => {
    let rolesInfo;
    const { isNonAdminUser = false } = payload;
    const { isAdminAccess = false } = payload;
    if(isAdminAccess){
       return rolesInfo = await globalRoleTemplates();
      }else if(isNonAdminUser){
        rolesInfo = await getUserAccessInfo();
        return rolesInfo?.accessPrivileges ?? {};
      }else{
        return rolesInfo = await globalRoleTemplates();
      }
      
  }
);

export const rolesSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRolesDataAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRolesDataAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload ?? {};
      });
  },
});

export const rolesData = (state: RootState) => state.roles.data;
export const variableRoles = (state: RootState) => {
  const { data } = state.roles;
  return {
    showTable: data?.["uum-variable-table"] !== "off",
    allowAdd: data?.["uum-add-variable"] === "write",
    allowEdit: data?.["uum-variable-operations"] === "write",
  };
};

export const metaDataRoles = (state: RootState) => {
  const { data } = state.roles;
  return {
    showTable: data?.["uum-meta-data-table"] !== "off",
    allowAdd: data?.["uum-meta-data-add"] === "write",
    allowEdit: data?.["uum-meta-data-operations"] === "write",
    allowBulkUpload: data?.["uum-meta-data-bulk-upload"] === "write",
  };
};

export default rolesSlice.reducer;
