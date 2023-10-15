import { getTokenId, getUrl, getHostName } from "../../utils/api.utils";
import { openConfigWindow } from "./integration.react";
const url = window.location.origin + "/uintgw/integrations";

let Admin: any = localStorage.getItem("adminUser");
let AdminCheck = JSON.parse(Admin);

let User: any = localStorage.getItem("user");
let userView: any = localStorage.getItem("userView");
let UserCheck: any = JSON.parse(User);

function getDashboardUrl() {
  return window.location.href.split("/").slice(0, -2).join("/") + "/dashboard";
}

const request_headers = {
  headers: {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
  },
};

export async function getIntegrationRequest() {
  let requestOptions;
  let response;
  if (AdminCheck && userView === "n") {
    requestOptions = {
      method: "GET",
      headers: {
        authorization: `Bearer ${AdminCheck["tokenId"]}`,
        "Content-Type": "application/json",
      },
    };
    response = await fetch(
      getUrl("integrationsList") + `?userName=${UserCheck.emailId}`,
      requestOptions
    );
  } else {
    requestOptions = {
      method: "GET",
      headers: {
        authorization: `Bearer ${UserCheck["tokenId"]}`,
        "Content-Type": "application/json",
      },
    };
    response = await fetch(getUrl("integrationsList"), requestOptions);
  }

  const res = await response.json();

  return res;
}

export async function getIntegrationRequestById(id: any) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getTokenId()}`,
    },
  };

  const url = `${getUrl("integrationsList")}/config?integrationId=${id}`;

  const response = await fetch(url, requestOptions);

  const res = await response.json();

  return res;
}

export async function deleteIntegrationRequestById(id: any) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getTokenId()}`,
    },
  };

  const response = await fetch(
    `${getUrl("integrationsList")}?integrationId=${id}`,
    requestOptions
  );

  const res = await response.json();

  return res;
}

export async function patchIntegrationRequestById(id: any) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getTokenId()}`,
    },
  };

  const response = await fetch(
    `${getUrl("integrationsList")}?integrationId=${id}&authSuccess=true`,
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .then(
      (data) => console.log(data)
      // window.open(data.location, "_blank", "toolbar=0,location=0,menubar=0")
    );
  // f16e07f4-15d9-4e95-9243-87ecf04627e4

  const res = response;

  return res;
}

export async function putPatchIntegrationRequestById(id: any) {
  const token = getTokenId();
  let reqBody = {};

  const q = new URLSearchParams({ integrationId: id });
  const response = await fetch(`${url}?` + q, {
    method: "PUT",
    headers: {
      authorization: "Bearer " + token,
      "content-type": "application/json",
    },
  });
  if (response.status === 401) {
    window.location.href = getDashboardUrl();
    return;
  }
  const respJson = await response.json();
  const configWindow: any = openConfigWindow(id, updateIntegSuccess);
  configWindow.location = respJson.location;
  return configWindow;
}
export async function putIntegrationRequestById(payload: any) {
  const token = getTokenId();
  let reqBody = {};
  const { id, obj } = payload;
  reqBody = obj;
  const q = new URLSearchParams({ integrationId: id });
  const response = await fetch(`${url}?` + q, {
    method: "PUT",
    headers: {
      authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  if (response.status === 401) {
    window.location.href = getDashboardUrl();
    return;
  }
  const respJson = await response.json();
  const configWindow: any = openConfigWindow(id, updateIntegSuccess);
  configWindow.location = respJson.location;
}

async function updateIntegSuccess(integrationId: any) {
  let authSuccess: any = true;
  const token = getTokenId();
  const q: any = new URLSearchParams({ integrationId, authSuccess });
  const response = await fetch(`${url}?` + q, {
    method: "PATCH",
    headers: {
      authorization: "Bearer " + token,
    },
  });
  if (response.status === 401) {
    window.location.href = getDashboardUrl();
    return;
  }
}

export async function selectiveEnablingRequest(payload: any) {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      authorization: `Bearer ${AdminCheck["tokenId"]}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  let res = await fetch(
    `${getHostName()}/uintgw/integrations/state?userName=${UserCheck.emailId}`,
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => data);

  return res;
}

export async function selectiveAllRequest() {
  let requestOptions;
  if (AdminCheck && userView === "n") {
    requestOptions = {
      method: "GET",
      headers: {
        authorization: `Bearer ${AdminCheck["tokenId"]}`,
        "Content-Type": "application/json",
      },
    };
  } else {
    requestOptions = {
      method: "GET",
      headers: {
        authorization: `Bearer ${UserCheck["tokenId"]}`,
        "Content-Type": "application/json",
      },
    };
  }

  let res = await fetch(
    `${getHostName()}/uintgw/integrations/state?userName=${UserCheck.emailId}`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        return response
          .text()
          .then((result) => Promise.reject(new Error(result)));
      }

      return response.json();
    })
    .then((data) => data);

  return res;
}
