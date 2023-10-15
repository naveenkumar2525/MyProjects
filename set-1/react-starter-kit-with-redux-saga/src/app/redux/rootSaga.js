import { all } from 'redux-saga/effects';
import fileManagementSaga from './FileUploadManagement/FileManagementSaga';
import modulesManagementSaga from './ModuleManagement/moduleManagementSaga';
import userProfileManagementSaga from './UserProfileManagement/userProfileManagementSaga';
import reportsManagementSaga from './ReportsManagement/reportsManagementSaga';
import dashboardSaga from './Dashboard/dashboardSaga';

function* rootSaga() {
    yield all([
        modulesManagementSaga(),
        userProfileManagementSaga(),
        fileManagementSaga(),
        reportsManagementSaga(),
        dashboardSaga()
    ]);
}

export default rootSaga;