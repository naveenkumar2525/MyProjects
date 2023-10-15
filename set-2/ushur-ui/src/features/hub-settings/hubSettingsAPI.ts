import {
  getHostName,
  getHttpBody,
  getHttpMethod,
  getStaticUrl,
  getTokenId,
  getUrl,
  toJson,
} from "../../utils/api.utils";

const request_headers = {
  headers: {
    token: getTokenId(),
  },
};

export async function createHubPortal(payload: any) {
  const response = await fetch(getUrl("createHubPortal"), {
    headers: {
      token: getTokenId(),
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  }).then(toJson);
  return response;
}

export async function getHubsList() {
  const url = getUrl("getHubsList");
  const response = await fetch(url, {
    ...request_headers,
    method: "GET",
  }).then(toJson);
  return response;
}

export async function getHubSettings(id: string) {
  const url = `${getHostName()}/apps/hub/${id}/settings`;
  const response = await fetch(url, {
    ...request_headers,
    method: "GET",
  }).then(toJson);
  return response;
}

export async function createOrUpdateHubSettings(method: string, payload: any) {
  const { id, ...reqPayload } = payload;
  const url = `${getHostName()}/apps/hub/${id}/settings`;
  const response = await fetch(url, {
    headers: {
      token: getTokenId(),
      "content-type": "application/json",
    },
    method,
    body: JSON.stringify(reqPayload),
  }).then(toJson);
  return response;
}

export async function __createOrUpdateHubSettings(
  method: string,
  payload: any
) {
  const { id, ...reqPayload } = payload;
  const url = `${getHostName()}/apps/hub/${id}/settings`;
  const fd = new FormData();
  Object.entries(reqPayload).forEach(([key, value]: any) =>
    fd.append(key, value)
  );
  const response = await fetch(url, {
    ...request_headers,
    method,
    body: fd,
  }).then(toJson);
  return response;
}

export async function getHubWorkflows(id: string) {
  const url = `${getHostName()}/apps/hub/${id}/workflow`;
  const response = await fetch(url, {
    ...request_headers,
    method: "GET",
  }).then(toJson);
  return response;
}

export async function updateHubWorkflows(payload: any) {
  const { id, workflows } = payload;
  const url = `${getHostName()}/apps/hub/${id}/workflows`;
  const reqPayload = {
    updateWorkflows: workflows
      .filter(({ workflowId, deleted }: any) => workflowId && !deleted)
      .map(({ logoFile, ...item }: any) => item),
    addWorkflows: workflows
      .filter(({ workflowId, deleted }: any) => !workflowId && !deleted)
      .map(({ workflowId, logoFile, ...item }: any) => item),
    deleteWorkflows: workflows
      .filter(({ workflowId, deleted }: any) => workflowId && deleted)
      .map(({ workflowId }: any) => ({ workflowId })),
  };
  const response = await fetch(url, {
    headers: {
      token: getTokenId(),
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(reqPayload),
  }).then(toJson);
  return response;
}

export async function getJsonConfigForPortal() {
  const payload = {
    fields: "InvisiblePortalHostname",
    tokenId: getTokenId(),
  };
  const response = await fetch(getStaticUrl("getSettingsUrl"), {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    body: JSON.stringify(payload),
    method: "POST",
    mode: "cors",
    credentials: "include",
  }).then(toJson);
  return response;
}

export async function getAccessRoles(id: string) {
  const url = `${getHostName()}/apps/hub/${id}/accessRole`;
  const response = await fetch(url, {
    ...request_headers,
    method: "GET",
  }).then(toJson);
  return response;
}

export async function updateAccessRoles(payload: any) {
  const { id, accessRoles } = payload;
  const url = `${getHostName()}/apps/hub/${id}/accessRoles`;
  const reqPayload = {
    updateAccessRoles: accessRoles
      .filter(({ roleId, deleted }: any) => roleId && roleId.length > 6 && !deleted)
      .map(({ ...item }: any) => item),
    addAccessRoles: accessRoles
      .filter(({ roleId, deleted }: any) => roleId && roleId.length === 6 && !deleted)
      .map(({ roleName, roleType, status }: any) => ({ roleName, roleType, status })),
    deleteAccessRoles: accessRoles
      .filter(({ roleId, deleted }: any) => roleId && deleted)
      .map(({ roleId }: any) => ({ roleId })),
  };
  const response = await fetch(url, {
    headers: {
      token: getTokenId(),
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(reqPayload),
  }).then(toJson);
  return response;
}