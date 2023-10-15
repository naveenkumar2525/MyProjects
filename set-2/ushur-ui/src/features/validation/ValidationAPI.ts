import {
  getHttpBody,
  getHttpMethod,
  getInfoQueryUrl,
  getTokenId,
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

export function getValidationListRequest(campaignId: string) {
  let headers: any = { ...request_headers };
  headers.headers.tokenId = getTokenId();

  const response = fetch(
    getUrl("workflows/serviceinfo") +
      "?ushur=" +
      campaignId +
      "&fromPage=1&pages=20&pageSize=20",
    {
      // const response = fetch("/ushur/ruleset", {
      ...headers,
      method: "GET",
    }
  )
    .then(toJson)
    .catch((error: any) => {
      console.log(error);
    });
  return response;
}

export function getValidationDetailsRequest(
  campaignId: string,
  sessionId: string
) {
  let headers: any = { ...request_headers };
  headers.headers.tokenId = getTokenId();

  const response = fetch(
    getUrl("workflows/serviceinfo/details") +
      "?ushur=" +
      campaignId +
      "&sessionId=" +
      sessionId,
    {
      ...headers,
      method: "GET",
    }
  )
    .then(toJson)
    .catch((error: any) => {
      console.log(error);
    });
  return response;
}
