import { xhrClient } from 'app/utilities/DataRequest';
import { config } from 'config.js';
const { isProd } = config;
//..SCREENBUILDER ENDPOINT 
const API_ENDPOINT = isProd
    ? config.production.api_endpoint
    : config.development.screenbuilder_api_endpoint;

const APIVERSION = "screenbuilder/api/v1";
//..ONBOARDING ENDPOINT
const ONBOARDING_API_ENDPOINT = isProd
    ? config.production.api_endpoint
    : config.development.api_endpoint;
const ONBOARDING_APIVERSION = "api/v1";
//..SIGN IN API
const signInService = (data) => {
    return xhrClient.post(`${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/users/authenticate`, null, data);
}

//..LOG OUT API
const logOutService = (data) => {
    return xhrClient.put(`${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/logout`);
}

//..CHANGE PASSWORD API
const changePasswordService = (data) => {
    return xhrClient.post(`${ONBOARDING_API_ENDPOINT}${ONBOARDING_APIVERSION}/profiles/changepassword`, null, data);
}

export {
    signInService,
    logOutService,
    changePasswordService
};
