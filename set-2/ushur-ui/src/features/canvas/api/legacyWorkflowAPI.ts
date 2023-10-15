/* eslint-disable max-lines */
// Until this file has more logic, the value
// in testing it is low.
/* istanbul ignore file */
import {
  LegacyWorkflowApi,
  GetWorkflowLegacyRequest,
  UpdateWorkflowLegacyRequest,
  Workflow,
  GetWorkflowVariablesRequest,
  GetVariablesByUeTagResponse,
  CreateWorkflowVariableRequest,
  CreateWorkflowVariableRequestContent,
  DeleteWorkflowLegacyRequest,
  LegacyWorkflowUpdateResponse,
} from "../../../api";
import {
  commonHeaders,
  getHostName,
  getTokenId,
} from "../../../utils/api.utils";
import createEmptyWorkflow from "../emptyWorkflow";
import {
  CreateWorkflowRequest,
  WorkflowUpdateContext,
} from "../interfaces/api";
import { generateSections } from "./utils/generateSections";
import generateSubRootModulesRequest from "./utils/generateSubrootRequest";
import { generateUeTagStructure } from "./utils/generateTag";
import { transformWorkflowToLegacyCreateWorkflowRequest } from "./utils/transformWorkflow";

/**
 * Obtain variables using the legacy APIs.
 *
 * @param workflowId The workflow ID.
 * @returns The legacy workflow.
 */
export async function getWorkflowVariablesUsingLegacyApi<T>(
  workflowId: string
): Promise<T> {
  const getWorkflowVariablesRequest: GetWorkflowVariablesRequest = {
    campaignId: workflowId,
    id: "CVarMap",
    cmd: "getAllContents",
    scope: "campaign",
    tokenId: getTokenId() as string,
    type: "vars",
    apiVer: "2.1",
  };
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(
    getWorkflowVariablesRequest,
    options
  );
  return response as unknown as T;
}
/**
 * Create variables using the legacy APIs.
 *
 * @param workflowId The workflow ID.
 * @param contents The variable contents.
 * @returns A legacy workflow creation response.
 */
export async function createWorkflowVariablesUsingLegacyApi<T>(
  workflowId: string,
  contents: Array<CreateWorkflowVariableRequestContent>
): Promise<T> {
  const createWorkflowVariablesRequest: CreateWorkflowVariableRequest = {
    campaignId: workflowId,
    id: "CVarMap",
    cmd: "getAllContents",
    scope: "campaign",
    tokenId: getTokenId() as string,
    type: "vars",
    apiVer: "2.1",
    content: contents,
  };
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(
    createWorkflowVariablesRequest,
    options
  );
  return response as unknown as T;
}
/**
 * Obtain a workflow using the legacy APIs.
 *
 * @param workflowId The workflow ID.
 * @returns The legacy workflow.
 */
export async function getWorkflowUsingLegacyApi<T>(
  workflowId: string
): Promise<T> {
  const getWorkflowRequest: GetWorkflowLegacyRequest = {
    tokenId: getTokenId() as string,
    cmd: "getCampaign",
    campaignId: workflowId,
    apiVer: "2.1",
  };
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(getWorkflowRequest, options);
  return response as unknown as T;
}
/**
 * Create a workflow using the legacy workflow API.
 *
 * @param param0 The workflow request.
 * @param param0.appContext The app context.
 * @param param0.workflowId The workflow ID.
 * @param param0.description The description.
 * @returns A legacy workflow creation response.
 */
export async function createWorkflowUsingLegacyApi<T>({
  appContext,
  workflowId,
  description = "",
}: CreateWorkflowRequest): Promise<T> {
  const emptyWorkflow = createEmptyWorkflow(workflowId);
  emptyWorkflow.AppContext = appContext;
  const createWorkflowRequest = transformWorkflowToLegacyCreateWorkflowRequest(
    emptyWorkflow,
    description
  );
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(createWorkflowRequest, options);
  return response as unknown as T;
}
/**
 * Update a workflow using the legacy workflow API.
 *
 * @param workflow The workflow to update.
 * @param context Workflow update context.
 * @returns A legacy workflow update response.
 */
export async function updateWorkflowUsingLegacyApi<T>(
  workflow: Workflow,
  context: WorkflowUpdateContext
): Promise<T> {
  const workflowToUpdate = workflow;
  const workflowId = workflowToUpdate.id;
  workflowToUpdate.ui.sections = generateSections(workflowToUpdate, context);
  workflowToUpdate.ui.UeTagStructure = generateUeTagStructure(
    workflowId,
    workflowToUpdate.ui.sections
  );

  const modules = [
    {
      cmd: "updateModule",
      campaignId: workflowToUpdate.id,
      campaignData: { ...workflowToUpdate },
      name: workflowId,
      isEmptyUshur: false,
      options: {},
      id: workflowId,
      lang: "en",
      prompt: "",
      userResponse: "no",
      landlineFlag: "N",
      properties: {},
    },
  ];
  const updateRequest: UpdateWorkflowLegacyRequest = {
    campaignName: workflowToUpdate.id,
    cmd: "manageCampaign",
    tokenId: getTokenId() as string,
    actionContext: "updateCampaign",
    apiVer: "2.1",
    modules,
  };
  const subRootModulesRequest = generateSubRootModulesRequest(
    workflowToUpdate,
    context
  );
  if (subRootModulesRequest.length) {
    updateRequest.modules?.push(...subRootModulesRequest);
  }
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };

  const response: LegacyWorkflowUpdateResponse = await api.legacyWorkflowApi(
    updateRequest,
    options
  );

  if (response.status !== "success") {
    throw new Error(response.respText);
  }

  return response as unknown as T;
}
/**
 * Get Variables by UeTag using the legacy APIs.
 *
 * @param params Get variable by ue tag request params.
 * @param params.campaignId The workflow ID.
 * @param params.ueTag The Ue Tag.
 * @returns Get Variables by Tag Response.
 */
export async function getVariablesByUeTagUsingLegacyApi(params: {
  campaignId: string;
  ueTag: string;
}): Promise<GetVariablesByUeTagResponse> {
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };

  const response = await api.legacyWorkflowApi(
    {
      campaignId: params.campaignId,
      cmd: "getVariables",
      filterCmd: "LastFirst",
      UeTag: params.ueTag,
      tokenId: getTokenId() as string,
    },
    options
  );

  return response as GetVariablesByUeTagResponse;
}

/**
 * Delete a workflow using the legacy workflow API.
 *
 * @param workflowId The workflow to delete.
 * @returns A legacy workflow delete response.
 */
export async function deleteWorkflowUsingLegacyApi<T>(
  workflowId: string
): Promise<T> {
  const deleteRequest: DeleteWorkflowLegacyRequest = {
    Languages: {},
    actionContext: "deleteCampaign",
    apiVer: "2.1",
    campaignId: workflowId,
    cmd: "deleteCampaign",
    inclAllXlatedUshurs: false,
    removeAssociations: true,
    tokenId: getTokenId() as string,
  };
  const api = new LegacyWorkflowApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: commonHeaders,
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const response = await api.legacyWorkflowApi(deleteRequest, options);
  return response as unknown as T;
}
