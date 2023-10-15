import { xhrClient } from 'app/utilities/DataRequest'
import { config } from 'config.js'

const { isProd } = config
const API_ENDPOINT = isProd
    ? config.production.api_endpoint
    : config.development.api_endpoint
const APIVERSION = 'api/v1'
const APIVERSION_SCREEN_BUILDER = "screenbuilder/api/v1"
const SCREEN_BUILDER_API_ENDPOINT = isProd
    ? config.production.api_endpoint
    : config.development.screenbuilder_api_endpoint

// FETCH DASHBOARD DATA API
const getDashboardDataService = () => {
    return xhrClient.get(`${API_ENDPOINT}${APIVERSION}/dashboard/users`)
}

const getUserProfilePhoto = (profileId) => {
    return xhrClient.get(
        `${API_ENDPOINT}${APIVERSION}/files/${profileId}`,
        null,
        null,
        'blob'
    )
}
const getSubModulesService = (moduleId) => {
    return xhrClient.get(`${SCREEN_BUILDER_API_ENDPOINT}${APIVERSION_SCREEN_BUILDER}/modules/${moduleId}/submodules`);
}
const filterSites = () => {
    return xhrClient.get(`${API_ENDPOINT}${APIVERSION}/users/filter-sites`)
}

const getChartDataService = (chartId, payload) => {
    const { siteIds, from, to } = payload
    let queryParams = []
    if (siteIds?.length > 0) {
        queryParams.push(`sites=${siteIds.join(',')}`)
    }
    if (from) {
        queryParams.push(`from=${from}`)
    }
    if (to) {
        queryParams.push(`to=${to}`)
    }
    const apiUrl = `${SCREEN_BUILDER_API_ENDPOINT}${APIVERSION}/charts/${chartId}`
    const url = queryParams ? `${apiUrl}?${queryParams.join('&')}` : apiUrl
    return xhrClient.get(url)
}

export {
    getDashboardDataService,
    getUserProfilePhoto,
    getSubModulesService,
    filterSites,
    getChartDataService,
}
