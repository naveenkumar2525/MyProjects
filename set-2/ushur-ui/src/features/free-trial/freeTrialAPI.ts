import {
    getHostName,
    getHttpBody,
    getHttpMethod,
    getTokenId,
  } from "../../utils/api.utils";
import { basePath } from '../../utils/helpers.utils';

export const getFreeTrialConfigRequest = async () => {
  const response = await fetch(`${basePath}/ushur-ui/freeTrial.json`, {
    method: "GET"
  })
    .then((res) => res.json())
    .catch((err) => {});
  return response;
};

  export async function getFreeTrialStatus() {
    const payload = {
      tokenId: getTokenId(),
      cmd: "getConfig",
      apiVer: "2.1",
      params: "ushur.platform.freeTrial",
    };
    const res: any = await fetch(`${getHostName()}/infoQuery`, {
      headers: {
        "content-type": "application/json",
      },
      body: getHttpBody(payload),
      method: getHttpMethod(),
    }).then((res) => res.json().catch(() => null));
    return res;
  }
  
