import { createSlice } from '@reduxjs/toolkit'
var initialState = {
    sites: [],
    login: {
        browser: '',
        ip: '',
        time: '',
    },
    reporting: {
        name: '',
        profileid: null,
        employeId: '',
    },
    modules: [],
    charts: [],
    subModules: []
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setInitialState(state, action) {
            // state.modules = initialState.modules;
            state.subModules = initialState.subModules;
        },
        setDashboardData(state, action) {
            const { login, reporting, modules, charts } = action.payload
            if (charts.length > 0) {
                modules.push({ name: "Charts" });
            }
            state.login = login
            state.reporting = reporting
            state.modules = modules
            state.charts = charts
        },
        setSubModules(state, action) {
            state.subModules = action.payload
        },
        setSitesData(state, action) {
            state.sites = action.payload || []
        },
    },
})
export default dashboardSlice.reducer

// Actions
export const { setInitialState, setDashboardData, setSubModules, setSitesData } = dashboardSlice.actions
