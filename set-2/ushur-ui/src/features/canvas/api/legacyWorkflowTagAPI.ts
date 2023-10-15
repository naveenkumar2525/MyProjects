import {
  LegacyWorkflowApi,
  GetTagTypesResponse,
  GetTagsResponse,
  CreateTagResponse,
  GetDatatableTagsResponse,
} from "../../../api";
import {
  commonHeaders,
  getHostName,
  getTokenId,
} from "../../../utils/api.utils";

/**
 * Get tag types using the legacy APIs.
 *
 * @returns Get tag types Response.
 */
export async function getTagTypesUsingLegacyApi() {
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(
    {
      cmd: "getAllContents",
      id: "UshurDataTypeMap",
      scope: "global",
      type: "vars",
      apiVer: "2.1",
      tokenId: getTokenId() as string,
    },
    options
  );
  return response as GetTagTypesResponse;
}
/**
 * Get tags using the legacy APIs.
 *
 * @param campaignId Workflow ID.
 * @returns Get tags Response.
 */
export async function getTagsUsingLegacyApi(campaignId: string) {
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(
    {
      campaignId,
      id: "CVarMap",
      cmd: "getAllContents",
      scope: "campaign",
      tokenId: getTokenId() as string,
      type: "vars",
      apiVer: "2.1",
    },
    options
  );
  return response as GetTagsResponse;
}
/**
 * Create tag using the legacy APIs.
 *
 * @param params Create tag request parameters.
 * @param params.campaignId Workflow ID.
 * @param params.vars Tags to be added.
 * @returns Create tag Response.
 */
export async function createTagsUsingLegacyApi(params: {
  campaignId: string;
  vars: Record<string, string>[];
}) {
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(
    {
      content: {
        campaignId: params.campaignId,
        vars: params.vars,
      },
      id: "CVarMap",
      cmd: "addAllContents",
      scope: "campaign",
      tokenId: getTokenId() as string,
      type: "vars",
      apiVer: "2.1",
    },
    options
  );
  return response as CreateTagResponse;
}
/**
 * Get data table tags using the legacy APIs.
 *
 * @param AppContext App Context.
 * @returns Get data table tags Response.
 */
export async function getDatatableTagsUsingLegacyApi(AppContext: string) {
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(
    {
      AppContext,
      id: "EVarMap",
      cmd: "getAllContents",
      scope: "campaign",
      tokenId: getTokenId() as string,
      type: "vars",
      apiVer: "2.1",
    },
    options
  );
  return response as GetDatatableTagsResponse;
}
