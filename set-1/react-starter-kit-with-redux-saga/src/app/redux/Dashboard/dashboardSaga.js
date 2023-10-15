import { call, put, takeEvery, all } from 'redux-saga/effects'
import { setDashboardData, setSitesData, setSubModules } from './dashboardSlice'
import { SNACKBAR_ERROR } from './../slices/snackbar'
import { getDashboardDataService, filterSites, getSubModulesService } from './dashboardService'

function* getDashboardData() {
    try {
        const res = yield call(getDashboardDataService)
        yield put(setDashboardData(res))
    } catch (error) {
        yield put(SNACKBAR_ERROR(error.message))
    }
}
function* getSubModules(payload) {
    try {
        const { moduleId } = payload;
        const res = yield call(getSubModulesService, moduleId);
        yield put(setSubModules(res.data));
    } catch (error) {
        // yield put(SNACKBAR_ERROR(error.message))
    }
}
function* getSitesData() {
    try {
        const res = yield call(filterSites)
        yield put(setSitesData(res))
    } catch (error) {
        yield put(SNACKBAR_ERROR(error.message))
    }
}

function* watchGetSitesData() {
    yield takeEvery('getSitesDataAction', getSitesData)
}
function* watchGetSubModules() {
    yield takeEvery('getSubModulesAction', getSubModules);
}
function* watchGetDashboardData() {
    yield takeEvery('getDashboardDataAction', getDashboardData)
}

// Actions
export default function* dashboardSaga() {
    yield all([
        watchGetDashboardData(),
        watchGetSitesData(),
        watchGetSubModules()
    ])
}
