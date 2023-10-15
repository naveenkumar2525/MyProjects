import {
  getHttpBody,
  getHttpMethod,
  getInfoQueryUrl,
  getTokenId,
  getUrl,
} from "../../utils/api.utils";
import { lastRecordId } from "./shortlinksSlice";

const request_headers = {
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
  },
};

const toJson = (response: any) => response.json();

export function createShortLinkRequest(longUrl = "", tags = [], useExisting=true) {
  const payload = {
    apiVer: "2.1",
    cmd: "getSurl",
    tokenId: getTokenId(),
    longUrl,
    tags,
    useExisting,
  };
  const response = fetch(getUrl("createShortLinkRequestUrl"), {
    ...request_headers,
    body: JSON.stringify(payload),
    method: "POST",
  }).then(toJson);
  return response;
}

export function createShortLinkForFileRequest(file = "", tags = []) {
  const payload = {
    apiVer: "2.1",
    tags,
  };
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  formData.append("params", JSON.stringify(payload));
  const response = fetch(getUrl("createShortLinkForFileRequestUrl"), {
    headers: {
      token: getTokenId(),
    },
    body: formData,
    method: "POST",
  }).then(toJson);
  return response;
}

export function getShortLinksListRequest(
  startDate = "2021-10-01T07:00:00.000Z",
  endDate = "2021-11-01T06:59:59.999Z",
  searchString = "",
  lastRecordId = '',
  fetchLimit = "2000"
) {
  const payload: any = {
    cmd: "getSurlList",
    tokenId: getTokenId(),
    startDate,
    endDate,
    apiVer: "2.1",
    lastRecordId,
    nRecords: fetchLimit,
  };
  if (searchString) {
    payload["searchString"] = [searchString];
  }

  // getUrl("integraionsList")

  const response = fetch(getUrl("getShortLinksListRequestUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function getSurlVisitCountRequest(
  surl = ""
) {
  const payload = {
    cmd: "getSurlVisitCount",
    tokenId: getTokenId(),
    surl,
    apiVer: "2.1",
  };
  const response = fetch(getUrl("getSurlVisitCountRequestUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function deleteShortlinkForFile(surl: string) {
  const payload = {
    surl: surl?.split("/")?.pop() ?? "",
  };
  const response = fetch(getUrl("deleteShortlinkForFile"), {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      token: getTokenId(),
    },
    body: getHttpBody(payload),
    method: "DELETE",
  }).then(toJson);
  return response;
}

const fileUpload = () =>
  fetch("https://nightingale420.ushur.dev/userInfoUpload/v2", {
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundarynmQ7FANAlo9youJW",
      "sec-ch-ua":
        '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      tokenid:
        "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5ZThlYTViMS01NGJmLTRmN2UtYjM2Zi0zOTg3MTYwM2VlZDkiLCJpYXQiOjE2MzQ0MDY1NDQsInN1YiI6IkFjY291bnRBdXRoIiwiaXNzIjoiVVNIVVIiLCJ1c2VyQWNjb3VudCI6IkFVVE9fQURNSU5AVVNIVVJEVU1NWS5NRSIsImFjY291bnRFbmFibGVkIjoiWSIsImV4cCI6MTYzNDQxMDE0NH0.WJi3BJMOI_lLxu6DFzaCcPQaIsPA_y_PtkohuWKm8tA",
      "x-requested-with": "XMLHttpRequest",
    },
    referrerPolicy: "no-referrer",
    body: '------WebKitFormBoundarynmQ7FANAlo9youJW\r\nContent-Disposition: form-data; name="file"; filename="contacts_sample.csv"\r\nContent-Type: text/csv\r\n\r\n\r\n------WebKitFormBoundarynmQ7FANAlo9youJW--\r\n',
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

const fileUpload2 = () =>
  fetch("https://nightingale420.ushur.dev/rest/document/upload", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type":
        "multipart/form-data; boundary=----WebKitFormBoundaryRlMYDQkdfLDolTAp",
      "sec-ch-ua":
        '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      token:
        "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjOTM4YjY3OC1iOTA3LTQ1NjYtOTg3My02OWFlNDRjZDdkNmEiLCJpYXQiOjE2MzQ2MjE0MDYsInN1YiI6IkFjY291bnRBdXRoIiwiaXNzIjoiVVNIVVIiLCJ1c2VyQWNjb3VudCI6IlRFU1RfQURNSU5AVVNIVVJEVU1NWS5NRSIsImFjY291bnRFbmFibGVkIjoiWSIsImV4cCI6MTYzNDYyNTAwNn0.ot0Yww2r2bmsvhQ-WOJiZD_lux9AIUunGROeBfvbEOo",
      "x-requested-with": "XMLHttpRequest",
    },
    referrerPolicy: "no-referrer",
    body: '------WebKitFormBoundaryRlMYDQkdfLDolTAp\r\nContent-Disposition: form-data; name="file"; filename="IMG_20190707_103958.jpg"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryRlMYDQkdfLDolTAp\r\nContent-Disposition: form-data; name="params"\r\n\r\n{"tags":["test"],"apiVer":"2.1"}\r\n------WebKitFormBoundaryRlMYDQkdfLDolTAp--\r\n',
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

const deleteFile = () =>
  fetch("https://nightingale420.ushur.dev/rest/document", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      token:
        "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjOTM4YjY3OC1iOTA3LTQ1NjYtOTg3My02OWFlNDRjZDdkNmEiLCJpYXQiOjE2MzQ2MjE0MDYsInN1YiI6IkFjY291bnRBdXRoIiwiaXNzIjoiVVNIVVIiLCJ1c2VyQWNjb3VudCI6IlRFU1RfQURNSU5AVVNIVVJEVU1NWS5NRSIsImFjY291bnRFbmFibGVkIjoiWSIsImV4cCI6MTYzNDYyNTAwNn0.ot0Yww2r2bmsvhQ-WOJiZD_lux9AIUunGROeBfvbEOo",
      "x-requested-with": "XMLHttpRequest",
    },
    referrerPolicy: "no-referrer",
    body: '{"surl":"LOVwIK"}',
    method: "DELETE",
    mode: "cors",
    credentials: "include",
  });
