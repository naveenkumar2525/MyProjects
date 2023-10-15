import {
  getHostName,
  getHttpBody,
  getHttpMethod,
  getTokenId,
} from "../../utils/api.utils";
// /userInfoUpload/v2
const request_headers = {
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
  },
};

const getGroupId = (value: any) => {
  let groupId;
  groupId = value === [] ? null : value;
  groupId = value === "" ? null : value;
  groupId = value === "null" ? null : value;
  groupId = value === "Enterprise" ? null : value;
  groupId = value === undefined ? null : value;
  return groupId;
}

export async function getContactListRequest(groupId: any, pageNum: any, pageSize: any, searchParameter: string) {
  if (groupId === "All groups") {
    return;
  }

  const payload = {
    groupId: getGroupId(groupId),
    lastRecordId: "",
    searchParameter,
    pageNumber: pageNum+"",
    count: pageSize,
    checkIfBlackListed: true
  };

  const requestOptions = {
    method: getHttpMethod(),
    headers: { "Content-Type": "application/json" , "tokenId":getTokenId()},
    body: getHttpBody(payload),
  };
  const response = await fetch(`${getHostName()}/contacts/list`, requestOptions);

  // const response = await fetch(
  //   " http://localhost:3030/users,
  //   requestOptions
  // );

  const res = await response.json();
  // res.groupId = groupId === "" ? "Enterprise" : groupId;
  // res.groupId = groupId === "null" ? "Enterprise" : groupId;
  res.groupId = groupId === null ? "Enterprise" : groupId;
  // res.groupId = groupId === undefined ? "Enterprise" : groupId;
  res.groupId = groupId;

  return res;
}

export async function getAllContactListRequest(groupId: any,lastRecordId: any = null) {
  const payload = {
    cmd: "getUserInfo",
    groupId: getGroupId(groupId),
    tokenId: getTokenId(),
    apiVer: "2.2",
    lastRecordId: lastRecordId,
    params: "Method,id,Verified,opInit",
    campaignId: null,
  };

  const requestOptions = {
    method: getHttpMethod(),
    headers: { "Content-Type": "application/json" },
    body: getHttpBody(payload),
  };
  const response = await fetch(`${getHostName()}/infoQuery`, requestOptions);

  // const response = await fetch(
  //   " http://localhost:3030/users,
  //   requestOptions
  // );

  const res = await response.json();
  // res.groupId = groupId === "" ? "Enterprise" : groupId;
  // res.groupId = groupId === "null" ? "Enterprise" : groupId;
  res.groupId = groupId === null ? "Enterprise" : groupId;
  // res.groupId = groupId === undefined ? "Enterprise" : groupId;
  res.groupId = groupId;

  return res;
}

export async function createContactListRequest(payload: any) {
  if(Object.keys(payload).length === 0) {
    return {};
  }
  else {
  // payload.groupId = payload.groupId === "Enterprise" ? null  : payload.groupId
  payload.groupId = getGroupId(payload.groupId);

  const requestOptions = {
    method: getHttpMethod(),
    headers: { "Content-Type": "application/json",  tokenid: getTokenId() },
    body: getHttpBody(payload),
  };
  const response = await fetch(`${getHostName()}/contacts/`, requestOptions);

  const res = await response.json();

  return res;
 }
}

export const setPhone = (phone: string) => {
  return phone;
};

export const createContactsForFileRequest = (payload: any) => {
  const formData = new FormData();
  if (payload.file) {
    formData.append('file', payload.file);
  }

  const arr = ['Enterprise', undefined, null, ''];
  if (!arr.includes(payload.groupId)) {
    return fetch(`${getHostName()}/udi/userInfoUpload/v2?groupId=${payload.groupId}`, {
      headers: {
        tokenid: getTokenId()
      },
      body: formData,
      method: 'POST'
    }).then((res) => res.text());
  } else {
    return fetch(`${getHostName()}/udi/userInfoUpload/v2`, {
      headers: {
        tokenid: getTokenId()
      },
      body: formData,
      method: 'POST'
    }).then((res) => res.text());
  }
};

export async function editContactRequest(payload: any) {
  if(Object.keys(payload).length === 0) {
    return {};
  }
  else {
  payload.groupId = getGroupId(payload.groupId);
  const requestOptions = {
    method: 'PUT',
    headers: { "Content-Type": "application/json",  tokenid: getTokenId() },
    body: getHttpBody(payload),
  };
  const response = await fetch(`${getHostName()}/contacts/`, requestOptions);

  const res = await response.json();

  return res;
}
}

export async function deleteContactRequest(payload: any) {
  payload.groupId = getGroupId(payload.groupId);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
  const response = await fetch(`${getHostName()}/initUshur`, requestOptions);

  const res = await response.json();

  return res;
}

export const getGroupListRequest = async () => {
  const payload = {
    cmd: "listGroups",
    tokenId: getTokenId(),
    apiVer: "2.2",
  };

  const requestOptions = {
    method: getHttpMethod(),
    headers: { "Content-Type": "application/json" },
    body: getHttpBody(payload),
  };
  const response = await fetch(`${getHostName()}/infoQuery`, requestOptions);

  const res = await response.json();

  return res;
};

export const getNewGroupListRequest = async () => {
  const requestOptions = {
    method: "GET",
    headers: {
       tokenId: getTokenId()
    }
  };
  const response = await fetch(`${getHostName()}/contacts/groups`, requestOptions);
  const res = await response.json();
  return res;
};

export async function createGroupRequest(payload: any) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
  const response = await fetch(`${getHostName()}/infoQuery`, requestOptions);

  const res = await response.json();

  return res;
}

export const getLogsHistory = async (content: any) => {
  const payload = {
    cmd: "getProcLogs",
    tokenId: getTokenId(),
    procContext: "Contact_Enterprise",
    apiVer: "2.1",
    AppContext: null,
    ...content,
  };

  const response = await fetch(`${getHostName()}/infoQuery`, {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  });

  const res = await response.json();

  return res;
};

export const exportContacts = async (groupId: any) => {
  const uri = `${getHostName()}/contacts/export?groupId=${groupId === 'Enterprise' ? '' : groupId}`;
  const response = fetch(uri, {
    method: 'GET',
    headers: {
      tokenId: getTokenId()
    }
  })
    .then((res: any) => {
      if (res.status === 200) {
        return res.blob().then((blob: any) => blob);
      }
      return {error: true};
    })
    .catch((err) => {
      return {error: true};
    });
  return response;
};
