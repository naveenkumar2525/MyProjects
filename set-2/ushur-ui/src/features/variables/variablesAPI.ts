import {
  getHttpBody,
  getHttpMethod,
  getInfoQueryUrl,
  getStaticUrl,
  getTokenId,
  getAppContext,
  getUrl,
} from "../../utils/api.utils";

const request_headers = {
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
  },
};

const toJson = (response: any) => response.json();

export function createVariableRequest(content: any) {
  const payload = {
    id: "EVarMap",
    cmd: "addAllContents",
    scope: "campaign",
    apiVer: "2.1",
    AppContext: getAppContext(),
    type: "vars",
    tokenId: getTokenId(),
    content,
  };
  const response = fetch(getUrl("createVariableRequestUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function getVariablesListRequest() {
  const payload = {
    id: "EVarMap",
    cmd: "getAllContents",
    scope: "campaign",
    tokenId: getTokenId(),
    type: "vars",
    apiVer: "2.1",
    AppContext: getAppContext(),
  };

  const response = fetch(getUrl("getVariablesListRequestUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function getVariableTypesRequest() {
  const payload = {
    apiVer: "2.1",
    cmd: "getAllContents",
    id: "UshurDataTypeMap",
    scope: "global",
    tokenId: getTokenId(),
    type: "vars",
  };

  const response = fetch(getUrl("getVariableTypesRequest"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function getKeysListRequest() {
  const payload = {
    apiVer: "2.1",
    cmd: "getAllContents",
    id: "ReqKeys",
    scope: "campaign",
    tokenId: getTokenId(),
    type: "vars",
    AppContext: getAppContext(),
  };

  const response = fetch(getUrl("getKeysListRequest"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function updateKeyRequest(content: any) {
  const payload = {
    id: "ReqKeys",
    cmd: "addAllContents",
    scope: "campaign",
    apiVer: "2.1",
    AppContext: getAppContext(),
    type: "vars",
    tokenId: getTokenId(),
    content,
  };
  const response = fetch(getUrl("updateKeyRequestUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function editVariableRequest(content: any) {
  const payload = {
    id: "EVarMap",
    cmd: "addAllContents",
    scope: "campaign",
    apiVer: "2.1",
    AppContext: getAppContext(),
    type: "vars",
    tokenId: getTokenId(),
    content,
  };

  const response = fetch(getUrl("editVariableRequestUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function getSettings() {
  const payload = {
    fields:
      "ImageUrl,mob-page,AccessOnlyUshursInSubAccount,fetchLimit,DisplayHiddenUshurs,InitialRouting,OptInFeature,ShowEnterpriseStats,visualLanguage,ushurVisualDisplayEditable,displayActivities,displayFAQ,displaySocialTab,displayLIModel,FacebookOAuthURL,FacebookClientID,FacebookRedirectURI,OperatorViewOnDashboard,DisplayBlacklistOnDashboard,LIModel,LIOrigin,FAQLimit,dynWordFilter,sim_avgword2vec_clf,sim_tfidf_clf,sim_doc2vec_clf,businessImageURL,triggerFeature,defaultDashboardFAQ,displayHTMLTemplatesTab,userAdminAcccountDeletion,displayOptinStatsTab,displayOptinEmailColumns,emailOptinHistoricalIncl,surveyUshurName,surveyOptinName,displayCrossover,entOverrideUserOptout,expectApiIndForEntOverrideUserOptout,displayConvo,businessImageProfileURL,displayBlackToWhiteListOnDashboard,displayWhitelistOnDashboard,getUserInfoForPh,AllowOnlyWhenInWhiteList,displayDataExtractionTab,displaySurlCustomDomain,analyticsGraphs,analyticsGraphsAxisDisplays,enableWelcomePopup,analyticsGraphsEngs,analyticsGraphsRespRate,analyticsGraphsCompRate,blacklistBatchSize,displayOperatorHITLViewTab,displayPageTitleOnAnalytics,customPageTitleOnAnalyticsTab,ShowAuditStats,enableHTML,allowMultiSelectKeys,allowApiKeys,ftagPassEnable2FA,showLinksTab,defaultShortLinksDateRange,BiCharts, engagementHistoryView",
    tokenId: getTokenId(),
  };

  const response = fetch(getStaticUrl("getSettingsUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function getDataSecurityRule() {
  const payload = {
    fields: "GlobalDataSecurity,fetchLimit,additionalPushChannels,ShowEnterpriseStats,BiCharts,showUi2Tabs",
    masterToken: getTokenId(),
    tokenId: getTokenId(),
  };

  const response = fetch(getStaticUrl("getDataSecurityRuleUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}
