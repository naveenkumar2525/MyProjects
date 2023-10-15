import {createAsyncThunk, createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';
import moment from 'moment';
import {RootState, AppThunk} from '../../app/store';
import { getDataSecurityRuleAPI } from '../variables/variablesSlice';
import {createShortLinkForFileRequest, createShortLinkRequest, deleteShortlinkForFile, getShortLinksListRequest, getSurlVisitCountRequest} from './shortlinksAPI';

export interface ShortLinksState {
  list: any;
  visited_data: any;
  searchText: string;
  createResponse: any;
  deleteResponse: any;
  status: 'idle' | 'loading' | 'failed';
  isAutoRefresh: boolean;
  dataRefreshState: 'idle' | 'refreshed' | 'loading' | 'failed';
  lastRecordId: '';
}

const initialState: ShortLinksState = {
  list: [],
  visited_data: [],
  createResponse: {surl: '', existingSurl: true},
  deleteResponse: null,
  searchText: '',
  status: 'idle',
  isAutoRefresh: false,
  dataRefreshState: 'idle',
  lastRecordId: '',
};

const SLICE_NAME = 'shortlinks';

export const getShortLinksList = createAsyncThunk(
  `${SLICE_NAME}/getShortLinksList`,
  async (payload: any, { getState }) => {
    const state: any = getState();
    let fetchLimit = state.variables?.dataSecurityRule?.data?.fetchLimit ?? '2000';
    if (payload?.fetchLimit) {
      fetchLimit = payload.fetchLimit;
    }
    const { startDate, endDate, searchString, lastRecordId, fetchNextBatch = false } = payload;
    const response = await getShortLinksListRequest(
      startDate,
      endDate,
      searchString,
      lastRecordId,
      fetchLimit
    );
    const results = response?.result ?? [];
    const res = results.map((item: any) => {
      return {
        ...item,
        visits: null,
        visitedTimestamp: null,
      };
    });
    return { response: res, lastRecordId: response.lastRecordId, fetchNextBatch };
  }
);

export const getSettingsAndShortLinksList =
  (payload: any) => async (dispatch: any, getState: any) => {
    let state = getState();
    let fetchLimit = state.variables?.dataSecurityRule?.data?.fetchLimit;
    if (!fetchLimit) {
      await dispatch(getDataSecurityRuleAPI());
      state = getState();
      fetchLimit =
        state.variables?.dataSecurityRule?.data?.fetchLimit ?? "2000";
      return await dispatch(getShortLinksList({ ...payload, fetchLimit }));
    }
  };

export const getSurlVisitCount = createAsyncThunk(`${SLICE_NAME}/getSurlVisitCount`, async (payload: any) => {
  const {surl} = payload;
  const response = await getSurlVisitCountRequest(surl);
  console.log(response);
  return response?.result ?? [];
});

export const createShortLink = createAsyncThunk(`${SLICE_NAME}/createShortLink`, async (payload: any) => {
  const {url, file, tags, existing} = payload;
  const response = file ? await createShortLinkForFileRequest(file, tags) : await createShortLinkRequest(url, tags, existing);
  return response;
});

export const shortlinksSlice = createSlice({
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
    setFilterText: (state, action) => {
      state.searchText = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShortLinksList.pending, (state) => {
        state.status = 'loading';
        state.dataRefreshState = 'idle';
      })
      .addCase(getShortLinksList.fulfilled, (state, action) => {
        let surlsList = action.payload?.response || [];
        let search = state.searchText;
        if (search.length > 1 && action.payload?.response) {
          const res = action.payload.response.filter((eachRow: any) => {
            return Object.values(eachRow).some((col: any) => {
    
              if (typeof col === 'string') {
                return col.toLocaleLowerCase().includes(search)
              }
              else if (Array.isArray(col)) {
                for (let index = 0; index < col.length; index++) {
                  if (col[index].toLocaleLowerCase().includes(search)) {
                    return true
                  }
                }
                return false;
              }
              else {
                return false;
              }
            })
          });
          surlsList = res;
        }
        state.status = 'idle';
        state.dataRefreshState = 'refreshed';
        state.list = (action.payload.fetchNextBatch ? state.list : []).concat(surlsList);
        state.lastRecordId = action.payload?.lastRecordId ?? '';
      });
    builder
      .addCase(getSurlVisitCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSurlVisitCount.fulfilled, (state, action) => {
        const existingList = JSON.parse(JSON.stringify(state.list));
        state.status = 'idle';
        const reqList  = existingList.map((item: any) => {
          if (item.surl === action.payload[0].surl) {
            item.visits = action.payload[0].visits;
            if (action.payload[0]?.LastVisitedTimeStamp) {
              item.visitedTimestamp = moment(new Date(action.payload[0].LastVisitedTimeStamp)).format('LL');
            }
          }
          return item;
        })
        state.list = reqList ?? [];
      });
    builder
      .addCase(createShortLink.pending, (state) => {
        state.createResponse = null;
        state.status = 'loading';
      })
      .addCase(createShortLink.fulfilled, (state, action) => {
        state.status = 'idle';
        state.createResponse = action.payload ?? {};
      });
    builder
      .addCase(deleteShortlinkForFileAsync.pending, (state) => {
        state.deleteResponse = null;
        state.status = 'loading';
      })
      .addCase(deleteShortlinkForFileAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.deleteResponse = action.payload ?? {};
      });
  }
});

export const deleteShortlinkForFileAsync = createAsyncThunk(`${SLICE_NAME}/deleteShortlinkForFile`, async (payload: any) => {
  const {surl} = payload;
  const response = await deleteShortlinkForFile(surl);
  return response;
});

export const deleteAndGet = (payload: any) => async (dispatch: any) => {
  await dispatch(deleteShortlinkForFileAsync(payload));
  return await dispatch(getShortLinksList(payload));
};

export const {setAutoRefreshOff, setAutoRefreshOn, setDataRefreshState, setFilterText} = shortlinksSlice.actions;

export const shorlinksList = (state: RootState) =>
  state.shortlinks.list.map((item: any) => ({
    ...item,
    urlOrFile: item.isAssetUrl ? item.assetName : item.longUrl,
    type: item.isAssetUrl ? 'file' : 'url',
    tags: item?.tags?.join(', ') ?? '',
    createdTimestamp: moment(new Date(item.createdTimestamp)).format('LL'),
    visitedTimestamp: '',
    createdTime: new Date(item.createdTimestamp)?.getTime() ?? 0
  }));

export const isAutoRefresh = (state: RootState) => state.shortlinks.isAutoRefresh;
export const dataRefreshState = (state: RootState) => state.shortlinks.dataRefreshState;
export const searchText = (state: RootState) => state.shortlinks.searchText;
export const createResponse = (state: RootState) => state.shortlinks.createResponse;
export const lastRecordId = (state: RootState) => state.shortlinks.lastRecordId;

export default shortlinksSlice.reducer;
