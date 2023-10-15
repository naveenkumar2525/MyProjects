// Until this file has more logic, the value
// in testing it is low.
/* istanbul ignore file */
import {
  WorkflowApi,
  Workflow,
  WorkflowActivationApi,
  WorkflowActivationRequest,
} from "../../../api";
import {
  commonHeaders,
  getDefaultVirtualNo,
  getHostName,
  getTokenId,
  getUserEmailId,
} from "../../../utils/api.utils";
import createEmptyWorkflow from "../emptyWorkflow";
import {
  CreateWorkflowRequest,
  WorkflowUpdateContext,
} from "../interfaces/api";

/**
 * Base workflow activation/de-activation request.
 *
 * @param workflowActivationRequest The workflow activation request.
 * @returns The activation/deactivation response.
 */
async function baseWorkflowActivation<T>(
  workflowActivationRequest: WorkflowActivationRequest
): Promise<T> {
  const api = new WorkflowActivationApi({}, getHostName(), fetch);

  const options: Record<string, unknown> = {
    headers: {
      ...commonHeaders,
      token: getTokenId() as string,
    },
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };

  const response = await api.workflowActivation(
    workflowActivationRequest,
    options
  );

  return response as unknown as T;
}

/**
 * Activate workflow.
 *
 * @param workflow The workflow.
 * @returns The activation response.
 */
export async function activateWorkflow<T>(workflow: Workflow): Promise<T> {
  const workflowActivationRequest: WorkflowActivationRequest = {
    userName: getUserEmailId() as string,
    campaignId: workflow.id,
    active: "Y",
    actionContext: "activateCampaign",
    virtualNo: [getDefaultVirtualNo() || ""],
  };

  return baseWorkflowActivation(workflowActivationRequest);
}

/**
 * Deactivate workflow.
 *
 * @param workflow The workflow.
 * @returns The deactivation response.
 */
export async function deactivateWorkflow<T>(workflow: Workflow): Promise<T> {
  const workflowActivationRequest: WorkflowActivationRequest = {
    userName: getUserEmailId() as string,
    campaignId: workflow.id,
    active: "N",
    actionContext: "deactivateCampaign",
    virtualNo: [getDefaultVirtualNo() || ""],
  };

  return baseWorkflowActivation(workflowActivationRequest);
}

/**
 * Obtain a workflow.
 *
 * @param workflowId The workflow ID.
 * @returns The workflow.
 */
export async function getWorkflowUsingNewApi<T>(
  workflowId: string
): Promise<T> {
  const api = new WorkflowApi({}, getHostName(), fetch);

  const options: Record<string, unknown> = {
    headers: {
      ...commonHeaders,
      "x-ushur-auth": getTokenId() as string,
    },
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };

  // Temporary: The Sidebar menu item Canvas when clicked does not currently have a
  // workflow associated with it until the product team decides what approach to take.
  // The API endpoint needs a valid workflow Id.
  // Adjust the workflow id to be a valid id, otherwise the Canvas page will be blank.
  const id = workflowId ?? "someWorkflow";
  const result = await api.getWorkflowById(id, options);

  const response = result.data;

  if (!response) {
    // Temporary: Normally we would throw an error but for our feature branch during testing
    // return undefined to launch an empty workflow
    return undefined as unknown as T;
    // throw new Error("No data found");
  }

  return response as unknown as T;
}

/**
 * Create a workflow using the workflow API.
 *
 * @param param0 The workflow request.
 * @param param0.appContext The app context.
 * @param param0.workflowId The workflow ID.
 * @param param0.description The description.
 * @returns A workflow creation response.
 */
export async function createWorkflowUsingNewApi<T>({
  appContext,
  workflowId,
  description = "",
}: CreateWorkflowRequest): Promise<T> {
  const api = new WorkflowApi({}, getHostName(), fetch);

  const options: Record<string, unknown> = {
    headers: {
      ...commonHeaders,
    },
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };

  const emptyWorkflow = createEmptyWorkflow(workflowId);

  const cells = emptyWorkflow.ui?.cells ?? [];

  const createWorkflowRequest: Workflow = {
    id: workflowId,
    name: workflowId,
    callbackNumber: "", // TODO
    languages: {},
    UshurDescriptions: {},
    lastEdited: new Date().toISOString(),
    author: getUserEmailId() as string,
    ...(description && { description }),
    virtualPhoneNumber: getDefaultVirtualNo() || "",
    AppContext: appContext,
    lang: "en",
    ia: {},
    routines: {
      Ushur_Initial_Routine: {
        action: "goToMenu",
        params: {
          menuId: "{{DEFAULTNEXT}}",
          stayInCampaign: true,
        },
      },
    },
    active: false,
    ui: {
      cells,
      sections: [],
    },
  };

  const result = await api.createWorkflow(createWorkflowRequest, options);

  const response = result.data;

  if (!response) {
    throw new Error("No data found");
  }

  return response as unknown as T;
}

/**
 * Update a workflow using the workflow API.
 *
 * @param workflow The workflow to update.
 * @param _context Workflow update context.
 * @returns A workflow update response.
 */
export async function updateWorkflowUsingNewApi<T>(
  workflow: Workflow,
  _context: WorkflowUpdateContext
): Promise<T> {
  if (!workflow.id) {
    throw new Error("Expecting workflow to have an id");
  }
  const api = new WorkflowApi({}, getHostName(), fetch);

  const options: Record<string, unknown> = {
    headers: {
      ...commonHeaders,
    },
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };
  const result = await api.updateWorkflow(workflow.id, workflow, options);

  if (!result) {
    throw new Error("No data found");
  }

  return result as unknown as T;
}
