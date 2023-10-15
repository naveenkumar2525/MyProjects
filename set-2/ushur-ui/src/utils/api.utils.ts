export const isMockJsonServer = () => process.env.REACT_APP_MOCK_SERVER && process.env.REACT_APP_MOCK_SERVER !== 'MSW';
export const isLocalMockJsonServer = () => isMockJsonServer() && process.env.REACT_APP_MOCK_SERVER?.includes("localhost");
export const getHostName = () => {
  if (isMockJsonServer()) {
    return process.env.REACT_APP_MOCK_SERVER;
  }
  const Window = window as any;
  const { host, protocol } = Window.location;
  return `${protocol}//${host}`;
};

export const getInfoQueryUrl = () => `${getHostName()}/infoQuery`;

export const getHttpMethod = (method = "POST") => {
  if (isLocalMockJsonServer()) {
    return "GET";
  }
  return method;
};

export const toJson = (response: any) => response.json();

export const getHttpBody = (payload: any) => {
  
  if (isLocalMockJsonServer()) {
    return undefined;
  }
  return JSON.stringify(payload);
};

export const getUserInfo = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : {};
};

export const getTokenId = () => {
  const user = localStorage.getItem("user");
  const tokenId = user ? JSON.parse(user).tokenId : "";
  return tokenId;
};

export const getAdminTokenId = () => {
  const user = localStorage.getItem("adminUser");
  const tokenId = user ? JSON.parse(user).tokenId : "";
  return tokenId;
};

export const getAppContext = () => {
  const appContext = localStorage.getItem("appContext");
  return appContext ? appContext :  'Main';
};

export const getUserEmailId = () => {
  const user = localStorage.getItem("user");
  const emailId = user ? JSON.parse(user).emailId : "";
  return emailId;
};

export const getUserNickname= () => {
  const user = localStorage.getItem("user");
  const nickName = user ? JSON.parse(user).nickName : "";
  return nickName;
};

export const getDefaultVirtualNo = () => {
  const virtualNo = localStorage.getItem("defaultVirtualNo");
  return virtualNo;
};

export const isAdminAccess = () => {
  const adminUser = localStorage.getItem("adminUser");
  const userView = localStorage.getItem("userView")
  return adminUser && userView !== "y";
};

const urls: { [key: string]: string } = {
  getShortLinksListRequestUrl: "infoQuery",
  createShortLinkForFileRequestUrl: "rest/document/upload",
  deleteShortlinkForFile: "rest/document",
  integrationsList: "uintgw/integrations",
  getHubsList: "apps/hub",
  createHubPortal: "apps/hub",
  "ushur/ruleset/":"ushur/ruleset/",
  "ushur/ruleset/metainfo":"ushur/ruleset/metainfo",
  "workflows/serviceinfo/details":"workflows/serviceinfo/details",
  "workflows/serviceinfo":"workflows/serviceinfo",
  "getAllCampaignAssociations": "rest/upnTable/v2/getAllCampaignAssociations",
  "downloadAsset": "rest/asset/download-asset/"
};

export const getUrl = (api: string) => {
  const path = isLocalMockJsonServer() ? api : urls[api] ?? "infoQuery";
  return `${getHostName()}/${path}`;
};

export const getStaticUrl = (api: string) => {
  const path = isLocalMockJsonServer() ? api : urls[api] ?? "rest/account/jsondata/get";
  return `${getHostName()}/${path}`;
};

export const getDataUrl = (api: string) => {
  const path = isLocalMockJsonServer() ? api : urls[api] ?? "uneda/data/get";
  return `${getHostName()}/${path}`;
};

export const getAddDataUrl = (api: string) => {
  const path = isLocalMockJsonServer() ? api : urls[api] ?? "uneda/data/add";
  return `${getHostName()}/${path}`;
};

export const getDeleteDataUrl = (api: string) => {
  const path = isLocalMockJsonServer() ? api : urls[api] ?? "uneda/data/delete";
  return `${getHostName()}/${path}`;
};

export const getUploadDataUrl = (api: string) => {
  const path = isLocalMockJsonServer()
    ? api
    : urls[api] ?? `udi/metadata/upload/v2?AppContext=${getAppContext()}`;
  return `${getHostName()}/${path}`;
};


export const isNonAdminUser = () => {
  const user = localStorage.getItem("user");
  return user ? (JSON.parse(user).RefEntId === "y") : false;
};

export const commonHeaders = {
  "accept": "application/json, text/javascript, */*; q=0.01",
  "accept-language": "en-US,en;q=0.9",
  "sec-ch-ua":
  '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "XMLHttpRequest",
}
