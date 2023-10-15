import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  getUshursList,
  createUshur,
  createAssociationOnCampaign,
  ExportWorkflows,
  getCampaignInitiatedActivities,
  getPaginationCount,
  getActivitySummary,
  getInitiatedActivitiesStats,
  getUshurViewJSON,
} from "./ushursAPI";
import _ from "lodash";
import moment from "moment";
import { IA_STATUS_LABELS } from "../../utils/helpers.utils";
import { createWorkflow } from "../canvas/api";
import { CreateWorkflowRequest } from "../canvas/interfaces/api";

export interface UshursState {
  list: any;
  status: "idle" | "loading" | "failed";
  projectsSortState: "recent" | "name_asc" | "name_dsc";
  activeProjectMenu: any;
  initiatedActivitiesDetails: any;
  totalActivitiesCount: number;
  activitySummary: any;
  activitySummaryStatus: string;
  currentLastRecordId: string;
  previousLastRecordId: string;
  initiatedActivitiesStats: object;
  ushurJSON: any;
  ushurDetails: any;
}

const initialState: UshursState = {
  list: [],
  status: "idle",
  projectsSortState: "recent",
  activeProjectMenu: "",
  initiatedActivitiesDetails: [],
  totalActivitiesCount: 0,
  activitySummary: [],
  activitySummaryStatus: "",
  currentLastRecordId: '',
  previousLastRecordId: '',
  initiatedActivitiesStats: {},
  ushurJSON: [],
  ushurDetails: {},
};

export const createNewUshur = createAsyncThunk(
  "ushurs/createUshur",
  async (payload: any) => {
    const response = await createUshur(payload);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const createNewWorkflow = createAsyncThunk(
  "ushurs/createWorkflow",
  async (payload: CreateWorkflowRequest) => createWorkflow(payload)
);

export const createNewCampaign = createAsyncThunk(
  "ushurs/createAssociationOnCampaign",
  async (payload: any) => {
    const response = await createAssociationOnCampaign(payload);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const getUshursAsync = createAsyncThunk(
  "ushurs/getUshursAsync",
  async () => {
    const response = await getUshursList();
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const getExportWorkflow = createAsyncThunk(
  "ushurs/getExportWorkflow",
  async (payload: any) => {
    const response = await ExportWorkflows(payload);
    return response;
  }
);

export const getActiveUshurs = () => async (dispatch: any) => {
  await dispatch(getUshursAsync());
};

export const getUshurActivitiesStats = createAsyncThunk(
  "ushurs/getUshurActivitiesStats",
  async (payload: any) => {
    const response = await getInitiatedActivitiesStats(payload);
    return response;
  }
);

export const getUshurActivitiesDetails = createAsyncThunk(
  "ushurs/getUshurActivitiesDetails",
  async (payload: any) => {
    const response = await getCampaignInitiatedActivities(payload);
    return response;
  }
);

export const getPaginationCounts = createAsyncThunk(
  "ushurs/getPaginationCount",
  async (payload: any) => {
    const response = await getPaginationCount(payload);
    return response;
  }
);

export const getActivitySummaryData = createAsyncThunk(
  "ushurs/getActivitySummary",
  async (payload: any) => {
    const response = await getActivitySummary(payload);
    return response;
  }
);

export const getUshurViewJSONDetails = createAsyncThunk(
  "ushurs/getUshurViewJSON",
  async (payload: any) => {
    const response = await getUshurViewJSON(payload);
    return response;
  }
);

export const ushursSlice = createSlice({
  name: "ushurs",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUshurs: (state, action) => {
      state.list = action.payload;
    },
    setActiveMenu: (state, action) => {
      state.activeProjectMenu = action?.payload;
    },
    updateProjectsSortState: (state, action) => {
      state.projectsSortState = action?.payload ?? "recent";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getUshursAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUshursAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.list = action.payload ?? [];
      });
    builder
      .addCase(getUshurActivitiesStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUshurActivitiesStats.fulfilled, (state, action) => {
        state.status = "idle";
        state.initiatedActivitiesStats = action.payload.data ?? {};
      });
    builder
      .addCase(getUshurActivitiesDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUshurActivitiesDetails.fulfilled, (state, action) => {
        state.status = "idle";
        state.initiatedActivitiesDetails =
          action.payload.data?.results?.map((item: any) => {
            return {
              ...item,
              createdOn: moment(new Date(item.createdOn)).format(
                "MM/DD/YYYY hh:mm:ss A"
              ),
              updatedOn: moment(item.updatedOn).fromNow(),
              statusNew: IA_STATUS_LABELS[item.status],
            };
          }) ?? [];
        if (action.payload?.data?.pageAction !== "prev") {
          state.previousLastRecordId = state.currentLastRecordId;
          state.currentLastRecordId = action.payload?.data?.lastRecordId;
        } else {
          state.currentLastRecordId = state.previousLastRecordId;
          state.previousLastRecordId = action.payload?.data?.lastRecordId;
        }
      });
    builder
      .addCase(getPaginationCounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPaginationCounts.fulfilled, (state, action) => {
        state.status = "idle";
        state.totalActivitiesCount = action.payload?.data?.count || 0;
      });
    builder
      .addCase(getActivitySummaryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getActivitySummaryData.fulfilled, (state, action) => {
        state.status = "idle";
        state.activitySummary = action.payload?.data?.results ?? [];
        state.activitySummaryStatus = action.payload?.data?.status ?? "";
      });
    builder
      .addCase(getUshurViewJSONDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUshurViewJSONDetails.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "idle";
        state.ushurJSON = action.payload?.ui?.sections || [];
        state.ushurDetails = action.payload || {};
      });
  },
});

export const { setUshurs, updateProjectsSortState, setActiveMenu } =
  ushursSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const list = (state: RootState) => state.ushurs.list;
const activeprojectmenu = (state: RootState) => state.ushurs.activeProjectMenu;

export const ushurActivitiesDetails = (state: RootState) =>
  state.ushurs.initiatedActivitiesDetails;
export const totalActivitiesCount = (state: RootState) =>
  state.ushurs.totalActivitiesCount;
export const activitySummaryList = (state: RootState) =>
  state.ushurs.activitySummary;
export const activitySummaryStatus = (state: RootState) =>
  state.ushurs.activitySummaryStatus;
export const currentLastRecordId = (state: RootState) =>
  state.ushurs.currentLastRecordId;
export const previousLastRecordId = (state: RootState) =>
  state.ushurs.previousLastRecordId;
export const ushurActivitiesStats = (state: RootState) =>
  state.ushurs.initiatedActivitiesStats;

export const getUshurJSON = (state: RootState) => state.ushurs.ushurJSON;
export const ushurDetails = (state: RootState) => state.ushurs.ushurDetails;

export const subMenuID = createSelector(activeprojectmenu, (state) => {
  return state;
});

export const ushursList = createSelector(list, (lis) => {
  return lis.map((item: any) => ({
    ...item,
    status: item?.active === "Y",
  }));
});
export const ushursSelector = (ushurs: any) =>
  ushurs
    .filter(({ active }: any) => active === "Y")
    .map(({ campaignId, AppContext }: any) => ({
      text: campaignId,
      value: campaignId,
      category: AppContext,
    }));
export const activeUshurs = createSelector(list, ushursSelector);
const projectsSortState = (state: RootState) => state.ushurs.projectsSortState;

/**
 * Group workflows by campaign.
 *
 * @param lis- a List of workflows
 * @param psState - sorting request
 *
 * @returns Workflows grouped by campaign
 */
export const groupWorkflowsByCampaign = (lis: any[], psState: string) => {
  const list = lis.map((item: any) => ({
    ...item,
    status: item?.active === "Y",
  }));

  const getRecent = (item: any) =>
    item?.reduce((acc: number, curr: any) => {
      let val = Date.parse(curr?.lastEdited);
      if (isNaN(val)) {
        val = 0;
      }
      return val > acc ? val : acc;
    }, 0);

  const groupedByProjects = _(list)
    .filter((x) => x.AppContext?.length > 0)
    .groupBy((x) => x.AppContext)
    .map((value, key) => ({
      AppContext: key,
      workflows: value.filter((workflow: any) => workflow.FAQ !== "true"),
      recent: getRecent(value),
      faqs: value.filter((workflow: any) => workflow.FAQ === "true"),
    }))
    .value();

  groupedByProjects?.sort((a: any, b: any) => {
    if (psState === "name_asc") {
      return b?.AppContext?.toLowerCase() > a?.AppContext?.toLowerCase()
        ? -1
        : 1;
    } else if (psState === "name_dsc") {
      return a?.AppContext?.toLowerCase() > b?.AppContext?.toLowerCase()
        ? -1
        : 1;
    }
    return a.recent > b.recent ? -1 : 1;
  });

  return groupedByProjects;
};

export const workflowsGroupedByCampaign = createSelector(
  list,
  projectsSortState,
  (lis, psState) => groupWorkflowsByCampaign(lis, psState)
);

export default ushursSlice.reducer;