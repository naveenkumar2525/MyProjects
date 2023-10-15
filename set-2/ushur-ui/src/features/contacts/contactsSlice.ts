import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  getContactListRequest,
  createContactListRequest,
  createContactsForFileRequest,
  editContactRequest,
  deleteContactRequest,
  getGroupListRequest,
  getNewGroupListRequest,
  getLogsHistory,
  createGroupRequest,
  getAllContactListRequest,
} from "./contactsApi";

interface ContactsSliceState {
  contacts: any;
  Allcontacts: any;
  contactsCountByGroupId: any;
  groupList: any;
  createNewGroups :string;
  newGroupList: any;
  selectedGroup: any;
  logsHistory: any;
  status: string;
  dataUploaded: any;
  createResponse: any;
  editResponse: any;
  deleteResponse: any;
  isAutoRefresh: boolean;
  dataRefreshState: "idle" | "refreshed" | "loading" | "failed";
  addContactResponse: any;
  editContactResponse:any;
}

const initialState: ContactsSliceState = {
  contacts: [],
  Allcontacts: [],
  contactsCountByGroupId: {},
  groupList: [],
  newGroupList: [],
  createNewGroups:"idle",
  logsHistory: [],
  status: "idle",
  selectedGroup: "",
  createResponse: null,
  editResponse: "idle",
  deleteResponse: "idle",
  dataUploaded: false,
  isAutoRefresh: false,
  dataRefreshState: "idle",
  addContactResponse: {},
  editContactResponse:{}
};

const SLICE_NAME = "contacts";

export const getContactList = createAsyncThunk(
  `${SLICE_NAME}/getContacts`,
  async (payload: any) => {
    const groupId = payload?.group === "Enterprise(Default)" ? null : payload?.group || payload;
    const pageNum = payload?.pageNum || 1;
    const pageSize = payload?.pageSize || 20;
    const searchParameter = payload?.searchParameter||'';
    const response = await getContactListRequest(groupId, pageNum, pageSize,searchParameter);
    let { users, totalRecords, totalPages } = response;
    return { users, groupId, totalPages, totalRecords };
  }
);

export const getAllContactList = createAsyncThunk(
  `${SLICE_NAME}/getAllContacts`,

  async (groupId: any) => {
    const response = await getAllContactListRequest(groupId);
    let { totalRecords, users } = response;
    if (users.length > 0) {
      users = users.map((user: any) => ({...user, groupId, blockListed: true}))
    }
    return { totalRecords, groupId, users };
  }
);
export const getGroupList = createAsyncThunk(
  `${SLICE_NAME}/getGroup`,
  async () => {
    const data = getGroupListRequest();
    return data;
  }
);

export const getNewGroupList = createAsyncThunk(
  `${SLICE_NAME}/groups`,
  async () => {
    const data = getNewGroupListRequest();
    return data;
  }
);

export const createContactList = createAsyncThunk(
  `${SLICE_NAME}/createContacts`,
  async (payload: any) => {
    const data = createContactListRequest(payload);
    return data;
  }
);

export const createGroup = createAsyncThunk(
  `${SLICE_NAME}/createGroup`,
  async (payload: any) => {
    const data = createGroupRequest(payload);
    return data;
  }
);

export const uploadDataAPI = createAsyncThunk(
  `${SLICE_NAME}/uploadDataAPI `,
  async (payload: any) => {
    const response = await createContactsForFileRequest(payload);

    return response;
  }
);

export const editContactAPI = createAsyncThunk(
  `${SLICE_NAME}/editContact`,
  async (payload: any) => {
    const response = await editContactRequest(payload);
    return response;
  }
);

export const deleteContactAPI = createAsyncThunk(
  `${SLICE_NAME}/deleteContact`,
  async (payload: any) => {
    const response = await deleteContactRequest(payload);

    return response;
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
const contactsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAutoRefreshOn: (state) => {
      state.isAutoRefresh = true;
    },
    setAutoRefreshOff: (state) => {
      state.isAutoRefresh = false;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    setDataRefreshState: (state, action) => {
      state.dataRefreshState = action.payload;
    },
    resetDeleteResponse: (state) => {
      state.deleteResponse = 'idle';
    },
    resetCreateGroupResponse: (state) => {
      state.createNewGroups = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContactList.pending, (state) => {
        state.status = "starting";
      })
      .addCase(getContactList.fulfilled, (state, action) => {
        let array: any = [];
        const payload: any = action.payload;
        if (payload) {
          for (let i = 0; i < payload.users?.length; i++) {
            const element = payload.users[i];

            if (element.userEmail === "undefined") {
              element.userEmail = " ";
            }
            if (element.address === "undefined") {
              element.address = " ";
            }

            element.groupId =
              payload.groupId === "null" ? "Enterprise" : payload.groupId;
            element.groupId =
              payload.groupId === null ? "Enterprise" : payload.groupId;
            element.groupId =
              payload.groupId === "" ? "Enterprise" : payload.groupId;
            element.groupId =
              payload.groupId === undefined ? "Enterprise" : payload.groupId;
            if (!element.groupId) {
              element.groupId = "Enterprise";
            } else {
              element.groupId = payload.groupId;
            }
          }
        }

        state.contacts = payload;
        state.status = "done";
      })
      .addCase(getContactList.rejected, (state) => {
        state.status = "error";
      });
    builder
      .addCase(getAllContactList.pending, (state) => {
        state.status = "starting";
      })
      .addCase(getAllContactList.fulfilled, (state, action) => {
        const payload: any = action.payload;
        const groupId = !payload.groupId ? "Enterprise" : payload.groupId;
        state.contactsCountByGroupId = {
          ...state.contactsCountByGroupId,
          [groupId]: payload.totalRecords,
          ['users-'+groupId]: payload.users?.map((user: any) => ({...user, groupId, blockListed: true}))
        }
        state.Allcontacts = payload.users;
      })
      .addCase(getAllContactList.rejected, (state) => {
        state.status = "error";
      });
    builder
      .addCase(getGroupList.pending, (state) => {
        state.status = "starting";
      })
      .addCase(getGroupList.fulfilled, (state, { payload }) => {
        if (payload.groups) {
          state.groupList = payload;
          state.status = "done";
        }
      })
      .addCase(getGroupList.rejected, (state) => {
        state.status = "error";
      });

    builder
      .addCase(getNewGroupList.pending, (state) => {
        state.status = "starting";
      })
      .addCase(getNewGroupList.fulfilled, (state, { payload }) => {
        if (payload.ContactGroups) {
          let GroupList: any = [];
          payload.ContactGroups?.map((item: any, i: any) => {
            if (item.IsEnterprise) {
              GroupList.push(item.groupName + "(Default)");
            } else {
              GroupList.push(item.groupName);
            }
          });
          state.groupList = GroupList;
          state.newGroupList = payload.ContactGroups;
          state.status = "done";
        }
      })
      .addCase(getNewGroupList.rejected, (state) => {
        state.status = "error";
      });

    builder
      .addCase(createContactList.pending, (state) => {
        state.status = "creating starting";
      })
      .addCase(createContactList.fulfilled, (state, {payload}) => {
        state.status = "done";
        state.addContactResponse = payload;
      })
      .addCase(createContactList.rejected, (state) => {
        state.status = "creating error";
      });

    builder
      .addCase(createGroup.pending, (state) => {
        state.status = "creating starting";
        state.createNewGroups = "creating starting"
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.status = "done";
        state.createNewGroups = "done"
      })
      .addCase(createGroup.rejected, (state) => {
        state.status = "creating error";
      });
    builder
      .addCase(uploadDataAPI.pending, (state) => {
        state.createResponse = null;
        state.dataUploaded = false;
        state.status = "loading";
      })
      .addCase(uploadDataAPI.fulfilled, (state, action) => {
        state.status = "idle";
        state.dataUploaded = true ?? {};
        state.createResponse = action.payload;
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
      .addCase(editContactAPI.pending, (state) => {
        state.editResponse = "edit started";
      })
      .addCase(editContactAPI.fulfilled, (state, { payload }) => {
        state.editResponse = "done";
        state.status = "done";
        state.editContactResponse = payload;
      })
      .addCase(editContactAPI.rejected, (state) => {
        state.editResponse = "edit error";
      });

    builder
      .addCase(deleteContactAPI.pending, (state) => {
        state.deleteResponse = "delete started";
      })
      .addCase(deleteContactAPI.fulfilled, (state, { payload }) => {
        state.deleteResponse = "done";
        state.status = "done";
      })
      .addCase(deleteContactAPI.rejected, (state) => {
        state.deleteResponse = "delete error";
      });
  },
});

export const {
  setAutoRefreshOff,
  setAutoRefreshOn,
  resetDeleteResponse,
  resetCreateGroupResponse,
  setDataRefreshState,
  setSelectedGroup,
} = contactsSlice.actions;

export const contactList = (state: RootState) => state.contacts.contacts;
export const AllcontactList = (state: RootState) => state.contacts.Allcontacts;
export const groupList = (state: RootState) => state.contacts.groupList;
export const createNewGroups = (state: RootState) => state.contacts.createNewGroups;
export const newGroupList = (state: RootState) => state.contacts.newGroupList;
export const deleteResponse = (state: RootState) => state.contacts.deleteResponse;

export const createResponse = (state: RootState) =>
  state.contacts.createResponse;
  export const selectedGroup = (state: RootState) =>
  state.contacts.selectedGroup;
export const getLogsHistoryData = (state: RootState) =>
  state.contacts.logsHistory;
export const dataUploaded = (state: RootState) => state.contacts.dataUploaded;
export const editResponse = (state: RootState) => state.contacts.editResponse;
export const isAPILoading = (state: RootState) => state.contacts.status;
export const isAutoRefresh = (state: RootState) => state.contacts.isAutoRefresh;
export const getContactsByGroup = (state: RootState) => state.contacts.contactsCountByGroupId;
export const dataRefreshState = (state: RootState) =>
  state.contacts.dataRefreshState;
export const addContactResponse = (state: RootState) =>
  state.contacts.addContactResponse;
export const editContactResponse = (state: RootState) =>
  state.contacts.editContactResponse;
export default contactsSlice.reducer;