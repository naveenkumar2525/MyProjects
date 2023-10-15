import {
  getAdminTokenId,
  getHostName,
  getHttpBody,
  getHttpMethod,
  getTokenId,
  getUserEmailId,
  isAdminAccess,
} from "../../utils/api.utils";

export async function getUserAccessInfo() {
  const payload = {
    apiVer: "2.1",
    tokenId:getTokenId()
  };
  const res: any = await fetch(`${getHostName()}/infoQuery/getUserAccessInfo`, {
    headers: {
      "content-type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then((res) => res.json().catch(() => null));
  return res ?? {};
}
export async function globalRoleTemplates(roleType: string = "AdminUser") {
  const res: any = await fetch(
    `${getHostName()}/rest/access/globalRoleTemplates?roleType=${roleType}`,
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "x-ushur-auth": getTokenId(),
      },
      referrerPolicy: "no-referrer",
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  ).then((res) => res.json().catch(() => null));
  return res ?? {};
}