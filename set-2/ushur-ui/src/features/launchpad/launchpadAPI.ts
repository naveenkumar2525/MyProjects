import {
  getHostName,
  getHttpBody,
  getHttpMethod,
  getTokenId,
} from "../../utils/api.utils";
export async function getContactListRequest(
  groupId: any,
  lastRecordId: any = null
) {
  const payload = {
    cmd: "getUserInfo",
    groupId: groupId === "Enterprise" ? "" : groupId,
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
  const res = await response.json();
  res.groupId = groupId;
  return res;
}

export async function getStaticLaunchChannels() {
  const requestOptions = {
    method: "GET",
    headers: { accept: "application/json, text/javascript, */*; q=0.01" },
  };
  const response = await fetch(
    `${getHostName()}/mob3.0/static/config_no_token.json`,
    requestOptions
  );
  const res = await response.json();
  return res;
}

export async function initLaunchUshur(payload: any) {
  const { workflow, channel, users } = payload;
  const commonParams = {
    cmd: "initCampaign",
    // userPhoneNo: "+16614187487",
    // requestId: "UT-124",
    campaignId: workflow,
    channel,
    tokenId: getTokenId(),
    apiVer: "3.1",
  };
  const requestOptions = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(
      users.map((user: string) => ({ ...commonParams, userPhoneNo: user }))
    ),
  };
  const response = await fetch(`${getHostName()}/initUshur`, requestOptions);
  const res: any  = await response.json();
  return res;
}
