import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import SnackbarReducer from './slices/snackbar';
import modulesManagementSagaReducer from './ModuleManagement/moduleManagementSlice';
import userProfileReducer from './UserProfileManagement/userProfileManagementSlice';
import fileReducer from './FileUploadManagement/FileManagementSlice';
import reportsReducer from './ReportsManagement/reportsManagementSlice';
import dashboardReducer from './Dashboard/dashboardSlice';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  keyPrefix: 'redux-',
  whitelist: ['settings'],
};

const rootReducer = combineReducers({
  modules: modulesManagementSagaReducer,
  SnackbarReducer: SnackbarReducer,
  profile : userProfileReducer,
  file: fileReducer,
  reports: reportsReducer,
  dashboard: dashboardReducer
});

export { rootPersistConfig, rootReducer };