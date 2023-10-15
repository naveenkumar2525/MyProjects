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

export function createRulesetRequest(ruleset = {}) {
  const payload = ruleset;
  let headers: any = { ...request_headers };
  headers.tokenid = getTokenId();
  const response = fetch(getUrl("ushur/ruleset/"), {
    // const response = fetch("/ushur/ruleset", {
    ...headers,
    body: getHttpBody(payload),
    // method: getHttpMethod(),
    method: "POST",
  }).then(toJson);
  return response;
}

export function updateRulesetRequest(ruleset: any = {}) {
  const payload = { ...ruleset };
  const id = ruleset.rulesetId;
  let headers: any = { ...request_headers };
  headers.tokenid = getTokenId();
  const response = fetch(getUrl("ushur/ruleset/") + id, {
    // const response = fetch("/ushur/ruleset/"+id, {
    ...headers,
    body: getHttpBody(payload),
    // method: getHttpMethod(),
    method: "PUT",
  }).then(toJson);
  return response;
}

export function deleteRulesetRequest(rulesetid: String) {
  let headers: any = { ...request_headers };
  headers.tokenid = getTokenId();
  const response = fetch(getUrl("ushur/ruleset/") + rulesetid, {
    // const response = fetch("/ushur/ruleset/"+rulesetid, {
    ...headers,
    // method: getHttpMethod(),
    method: "DELETE",
  }).then(toJson);
  return response;
}

export function getRulesetsListRequest() {
  let headers: any = { ...request_headers };
  headers.headers.tokenId = getTokenId();
  const response = fetch(getUrl("ushur/ruleset/"), {
    // const response = fetch("/ushur/ruleset", {
    ...headers,
    // body: getHttpBody(payload),
    method: "GET",
  })
    .then(toJson)
    .catch((error: any) => {
      console.log(error);
    });
  return response;
}

export function getRulesListRequest(id: String) {
  let headers: any = { ...request_headers };
  headers.headers.tokenId = getTokenId();
  // const response = fetch(getUrl("rulesetbyid/"+id), { //Used for local dev using json server

  const response = fetch(getUrl("ushur/ruleset/") + id, {
    // const response = fetch("/ushur/ruleset/"+id, {
    ...headers,
    // body: getHttpBody(payload),
    method: "GET",
  }).then(toJson);
  console.log("GET ruleset by id: ", response);
  return response;
}

export function getMetaInfoRequest() {
  let headers: any = { ...request_headers };
  headers.headers.tokenId = getTokenId();
  const response = fetch(getUrl("ushur/ruleset/metainfo"), {
    // const response = fetch("/ushur/ruleset/metainfo", {
    ...headers,
    // body: getHttpBody(payload),
    method: "GET",
  }).then(toJson);
  return response;
}
