import {
  getAddDataUrl,
  getDataUrl,
  getDeleteDataUrl,
  getHttpBody,
  getHttpMethod,
  getInfoQueryUrl,
  getTokenId,
  getAppContext,
  getUploadDataUrl,
  getUrl,
  getHostName,
} from "../../utils/api.utils";
import { previewOrDownload } from "../../utils/helpers.utils";

const request_headers = {
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
  },
};

const toJson = (response: any) => response.json();

export function getMetaData(
  content: any,
  dataAsIs = "yes",
  lastRecordId: any = null
) {
  const payload = {
    tokenId: getTokenId(),
    lastRecordId,
    "data-as-is": dataAsIs,
    AppContext: getAppContext(),
    content: [{}],
  };

  const response = fetch(getDataUrl("getMetaDataUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function addMetaData(content: any) {
  const payload = {
    tokenId: getTokenId(),
    AppContext: getAppContext(),
    content,
  };

  const response = fetch(getAddDataUrl("addMetaDataUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function deleteMetaData(content: any) {
  const payload = {
    tokenId: getTokenId(),
    AppContext: getAppContext(),
    content,
  };

  const response = fetch(getDeleteDataUrl("deleteMetaDataUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function getLogsHistory(content: any) {
  const payload = {
    cmd: "getProcLogs",
    tokenId: getTokenId(),
    procContext:
      "Uneda_Ftp_Push,Uneda_Ftp_Pull,Uneda_Http_Pull,Uneda_Parser,Uneda_Import",
    apiVer: "2.1",
    AppContext: getAppContext(),
    ...content,
  };

  const response = fetch(getUrl("getLogsHistoryRequestUrl"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then(toJson);
  return response;
}

export function bulkUploadData(content: any) {
  const formData = new FormData();
  if (content) {
    formData.append("file", content);
  }

  const response = fetch(getUploadDataUrl("bulkUploadDataUrl"), {
    headers: {
      tokenid: getTokenId(),
    },
    body: formData,
    method: "POST",
  }).then((res) => res.text());
  return response;
}
export function getmetaDataCount() {
  const payload = {
    filterCmd: "getCounts",
    tokenId: getTokenId(),
    AppContext: getAppContext(),
    apiVer: "2.2",
  };
  const response = fetch(getDataUrl("getMetaDataCount"), {
    ...request_headers,
    body: getHttpBody(payload),
    method: getHttpMethod(),
  }).then((res) => {
    return res.json();
  });

  return response;
}

export function downloadAsset(assetId: any, page = "") {
  const response = fetch(`${getHostName()}/rest/asset/download-asset/${assetId}?token=${getTokenId()}`, {
    ...request_headers,
    method: getHttpMethod('GET')
  })
    .then((res) => {
      if (res.status != 200) {
        throw "error";
      }
      return res.blob();
    })
    .then((blob) => {
      const fileType = blob.type;
      const file = new Blob([blob], {type: fileType});
      if (page === "campaignAnalytics") {
        return URL.createObjectURL(file);
      }
      previewOrDownload(file);
    })
    .catch((err) => {
      if (page === "campaignAnalytics") {
        return false;
      }
      return err;
    });
  return response;
}

