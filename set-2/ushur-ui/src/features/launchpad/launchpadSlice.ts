import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { getUshursAsync } from "../ushurs/ushursSlice";
import {
  getContactListRequest,
  getStaticLaunchChannels,
  initLaunchUshur,
} from "./launchpadAPI";
import { getGroupListRequest } from "../contacts/contactsApi";
import { getDataSecurityRule } from "../variables/variablesAPI";
export interface LaunchPadState {
  groupList: any;
  currentGroup: any;
  selectedGroup: any;
  contacts: any;
  channels: any;
  status: "idle" | "loading" | "failed" | "done" | "error";
  launchResp: any;
}

const initialState: LaunchPadState = {
  groupList: [],
  currentGroup: "",
  selectedGroup: "",
  contacts: [],
  channels: [],
  status: "idle",
  launchResp: null,
};

const SLICE_NAME = "launch_pad";

export const getGroupListForDropdown =
  () => async (dispatch: any, getState: any) => {
    await dispatch(getGroupListAsync());
  };

const getGroupListAsync = createAsyncThunk(
  "launchpad/getGroupListAsync",
  async () => {
    const response = await getGroupListRequest();
    return response;
  }
);

export const getContactList = createAsyncThunk(
  `${SLICE_NAME}/getContacts`,
  async (groupId: any) => {
    const entSettings = await getDataSecurityRule();
    const fetchLimit = +(entSettings?.data?.fetchLimit ?? "2000");
    const response = await getContactListRequest(groupId);
    let { counts, users = [], lastRecordId, totalRecords } = response;
    let allData = [].concat(users);
    let currRecords = counts;
    const requiredRecords = Math.min(fetchLimit, totalRecords);
    let noOfReqs = 0;
    while (currRecords < requiredRecords && noOfReqs++ < 20) {
      const curr_resp = await getContactListRequest(groupId, lastRecordId);
      currRecords += curr_resp?.counts ?? 0;
      lastRecordId = curr_resp?.lastRecordId ?? "";
      allData = allData.concat(curr_resp?.users ?? []);
    }

    return { users: allData, groupId };
  }
);

export const getLaunchChannels = createAsyncThunk(
  `${SLICE_NAME}/getLaunchChannels`,
  async () => {
    const entSettings = await getDataSecurityRule();
    const pushChannels = entSettings?.data?.additionalPushChannels ?? "";
    const response = await getStaticLaunchChannels();
    const all = response?.pushChannels?.options ?? {};
    const allowedChannels = Object.entries(all).filter(
      ([key, value]: any) => pushChannels.includes(key) || value?.display
    );
    return allowedChannels;
  }
);

export const launchUshur = createAsyncThunk(
  `${SLICE_NAME}/launchUshur`,
  async (payload: any) => {
    const response = await initLaunchUshur(payload);
    return response;
  }
);

export const launchpadSlice = createSlice({
  name: "launchpad",
  initialState,
  reducers: {
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    resetLaunchResp: (state) => {
      state.launchResp = null;
    },
    setFinalReciepents: (state, action) => {
      state.contacts = {
        ...state.contacts,
        users: state.contacts?.users?.map((user: any) => {
          if (user.checked) {
            return {
              ...user,
              deleted: true,
              checked: false,
            };
          }
          return { ...user };
        }),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGroupListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGroupListAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.groupList = action.payload ?? {};
      })
      .addCase(getContactList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getContactList.fulfilled, (state, action) => {
        const payload: any = action?.payload ?? {};
        const updatedUsers = (payload?.users ?? []).map((contact: any) => ({
          ...contact,
          checked: false,
          deleted: false,
          groupId: payload?.groupId ?? "",
          userEmail: ["undefined", "null", "", undefined, null].includes(
            contact?.userEmail?.trim()
          )
            ? ""
            : contact.userEmail,
          address: ["undefined", "null", "", undefined, null].includes(
            contact?.address?.trim()
          )
            ? ""
            : contact.address,
        }));
        state.contacts = { ...payload, users: updatedUsers };
        state.status = "done";
      })
      .addCase(getContactList.rejected, (state) => {
        state.status = "error";
      });
    builder
      .addCase(getLaunchChannels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLaunchChannels.fulfilled, (state, action) => {
        state.status = "done";
        state.channels = action.payload;
      });
    builder
      .addCase(launchUshur.pending, (state) => {
        state.status = "loading";
      })
      .addCase(launchUshur.fulfilled, (state, action) => {
        state.status = "done";
        state.launchResp = action.payload;
      });
  },
});

export const {
  setCurrentGroup,
  setContacts,
  setSelectedGroup,
  setFinalReciepents,
  resetLaunchResp,
} = launchpadSlice.actions;
export const groupList = (state: RootState) => state.launchpad.groupList;
export const currentGroup = (state: RootState) => state.launchpad.currentGroup;
export const selectedGroup = (state: RootState) =>
  state.launchpad.selectedGroup;
export const contactList = (state: RootState) => state.launchpad.contacts;
export const channels = (state: RootState) => state.launchpad.channels;
export const launchResp = (state: RootState) => state.launchpad.launchResp;
export const selectedContacts = (state: RootState) =>
  state.launchpad.contacts?.users?.filter(
    ({ deleted, userPhoneNo }: any) => !deleted && userPhoneNo
  ) ?? [];
export const errorContacts = (state: RootState) =>
  state.launchpad.contacts?.users?.filter(
    ({ deleted, userPhoneNo }: any) => !deleted && !userPhoneNo
  ) ?? [];
export default launchpadSlice.reducer;
