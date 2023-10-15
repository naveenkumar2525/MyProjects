import {
  getHostName,
  getHttpBody,
  getHttpMethod,
  getTokenId,
  getUserEmailId,
  getDefaultVirtualNo,
} from "../../utils/api.utils";
import { downloadWorkflow } from "../../utils/helpers.utils";

export async function createUshur(data: any) {
  const description = data.description;
  const payload = {
    tokenId: getTokenId(),
    cmd: "addCampaign",
    campaignId: data.workflow,
    version: data.version,
    campaignData: {
      name: data.workflow,
      author: getUserEmailId(),
      id: data.workflow,
      IsInvisible: "yes",
      ...(description && { description }),
      virtualPhoneNumber: getDefaultVirtualNo(),
      visuallyUshur: false,
      AppContext: data.appContext,
      prompt: "",
      skipMenu: true,
      lastEdited: new Date().toISOString(),
      lang: "en",
      isEmptyUshur: false,
      options: {},
      routines: {
        Ushur_Initial_Routine: {
          action: "goToMenu",
          params: {
            menuId: "{{DEFAULTNEXT}}",
            stayInCampaign: true,
          },
        },
      },
      ui: {
        status: "regular",
        active: false,
        campaignId: data.workflow,
        sections: [],
      },
      visualData: {},
    },
    apiVer: "2.1",
    actionContext: "createCampaign",
  };
  const res: any = await fetch(`${getHostName()}/infoQuery`, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrerPolicy: "no-referrer",
    body: getHttpBody(payload),
    method: getHttpMethod(),
    mode: "cors",
    credentials: "omit",
  }).then((res) => res.json().catch(() => null));
  return res;
}

export async function getUshursList() {
  const payload = {
    tokenId: getTokenId(),
    cmd: "getCampaignList",
    withStatus: "yes",
    apiVer: "2.1",
    campaignIdPrefix: null,
    onlyParent: true,
    onlyPrimary: true,
  };
  const res: any = await fetch(`${getHostName()}/infoQuery`, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrerPolicy: "no-referrer",
    body: getHttpBody(payload),
    method: getHttpMethod(),
    mode: "cors",
    credentials: "omit",
  }).then((res) => res.json().catch(() => null));
  return res?.campaignList ?? [];
}

export async function getUshurVariables(wfId: string) {
  const payload = {
    id: "CVarMap",
    cmd: "getAllContents",
    scope: "campaign",
    tokenId: getTokenId(),
    type: "vars",
    campaignId: wfId,
    apiVer: "2.1",
  };
  const res: any = await fetch(`${getHostName()}/infoQuery`, {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrerPolicy: "no-referrer",
    body: getHttpBody(payload),
    method: getHttpMethod(),
    mode: "cors",
    credentials: "omit",
  }).then((res) => res.json().catch(() => null));
  return res?.content?.[0]?.vars;
}

export async function createAssociationOnCampaign(data: any) {
  const payload = {
    actionContext: "createCampaign",
    campaignDesc: "",
    campaignId: data.workflow,
    keyword:
      "UshurDefault_" +
      data.workflow +
      "_" +
      Math.floor(Math.random() * 90000) +
      10000,
    userName: getUserEmailId(),
    virtualNo: getDefaultVirtualNo(),
  };
  const res: any = await fetch(
    `${getHostName()}/rest/upnTable/v2/createAssociationOnCampaign`,
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        token: getTokenId(),
        "x-requested-with": "XMLHttpRequest",
      },
      referrerPolicy: "no-referrer",
      body: getHttpBody(payload),
      method: getHttpMethod(),
      mode: "cors",
      credentials: "omit",
    }
  )
    .then((res) => res.json())
    .catch(() => null);

  let associations: any[] = [];
  res?.data?.map((data: any) => {
    if (data.jsonData) {
      associations = [...associations, ...data.jsonData];
    }
  });
  return Object.assign(
    {},
    ...associations.map((item: any) => ({
      [item.campaignId]: item.active === "Y",
    }))
  );
}

export async function ExportWorkflows(data: any) {
  const payload = {
    author: getUserEmailId(),
    campaignId: data.campaignId_,
    exportContacts: false,
    exportDataExRules: data.exportDataExRules_,
    exportEnterpriseVariables: data.exportEnterpriseVariables_,
    exportMetaData: false,
    exportPushPullTags: false,
    exportSettings: false,
    exportTopics: data.exportTopics_,
    exportUshurVariables: true,
    virtualNumber: getDefaultVirtualNo(),
  };
  const res: any = await fetch(`${getHostName()}/rest/export`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      tokenId: getTokenId(),
    },
  }).then((res) =>
    res
      .blob()
      .then((blob) => {
        if (res.status === 200) {
          downloadWorkflow(blob);
        } else {
          alert("Something went wrong");
        }
      })
      .catch(() => null)
  );
  return res;
}

//get campaign specific Initiated activities details
export async function getCampaignInitiatedActivities(data: any) {
  const payload = {
    campaignId: data.campaignId,
    count: data.pageSize,
    endDate: "",
    lastRecordId: data.lastRecordId,
    pageAction: data.pageAction || "none",
    requestId: "",
    startDate: "",
    status: "",
    userEmail: "",
    userPhoneNumber: "",
  };
  const res = await fetch(`${getHostName()}/ushur-activities/list`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      token: getTokenId(),
    },
  }).then((res) => res.json().catch(() => null));
  if (res?.data) {
    res.data.pageAction = payload.pageAction;
  }
  return res;
}

export async function getPaginationCount(data: any) {
  const payload = {
    campaignId: data.campaignId,
    endDate: "",
    initialRecordId: data.initialRecordId,
    requestId: "",
    startDate: "",
    status: "",
    userEmail: "",
    userPhoneNumber: "",
  };
  const res = await fetch(`${getHostName()}/ushur-activities/counts`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      token: getTokenId(),
    },
  }).then((res) => res.json().catch(() => null));
  return res;
}

export async function getInitiatedActivitiesStats(data: any) {
  const payload = {
    campaignId: data.campaignId,
    initialRecordId: "",
  };
  const res = await fetch(`${getHostName()}/ushur-activities/stats`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      token: getTokenId(),
    },
  }).then((res) => res.json().catch(() => null));
  return res;
}

export async function getActivitySummary(data: any) {
  const res = await fetch(
    `${getHostName()}/ushur-activities/${data.sid}?deliverySummary=${
      data.summary
    }`,
    {
      method: "GET",
      headers: {
        token: getTokenId(),
      },
    }
  ).then((res) => res.json().catch(() => null));
  return res;
}

export async function getUshurViewJSON(data: any) {
  const payload = {
    tokenId: getTokenId(),
    cmd: "getCampaign",
    apiVer: "2.1",
    campaignId: data.campaignId,
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
