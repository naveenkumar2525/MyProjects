import { LegacyWorkflow, Workflow } from "../../../api";
import {
  CreateWorkflowRequest,
  WorkflowUpdateContext,
} from "../interfaces/api";
import {
  createWorkflowUsingLegacyApi,
  getWorkflowUsingLegacyApi,
  updateWorkflowUsingLegacyApi,
} from "./legacyWorkflowAPI";
import { transformLegacyWorkflowToNewWorkflow } from "./utils/transformWorkflow";
import {
  createWorkflowUsingNewApi,
  getWorkflowUsingNewApi,
  updateWorkflowUsingNewApi,
} from "./workflowAPI";

// import { initUshur } from "./simulatorAPI";

export * from "./legacyWorkflowAPI";
export * from "./legacyWorkflowTagAPI";
export * from "./workflowAPI";
export * from "./simulatorAPI";
/**
 * Create a workflow using the new workflow API or legacy API depending on configuration.
 *
 * @param param0 The workflow request.
 * @param param0.appContext The app context.
 * @param param0.workflowId The workflow ID.
 * @param param0.description The description.
 * @returns A workflow creation response.
 */
export async function createWorkflow<T>({
  appContext,
  workflowId,
  description = "",
}: CreateWorkflowRequest): Promise<T> {
  if (process.env.REACT_APP_CANVAS2_USE_LEGACY_WORKFLOW_API === "true") {
    return createWorkflowUsingLegacyApi({
      appContext,
      workflowId,
      description,
    });
  }

  return createWorkflowUsingNewApi({
    appContext,
    workflowId,
    description,
  });
}

/**
 * Get a workflow. Convert a legacy workflow to the new workflow format if required.
 *
 * @param workflowId The workflow ID.
 * @returns The workflow.
 */
export async function getWorkflow<T>(workflowId: string): Promise<T> {
  if (process.env.REACT_APP_CANVAS2_USE_LEGACY_WORKFLOW_API === "true") {
    const legacyWorkflow = await getWorkflowUsingLegacyApi<LegacyWorkflow>(
      workflowId
    );

    return transformLegacyWorkflowToNewWorkflow(legacyWorkflow) as unknown as T;
  }

  const workflow = await getWorkflowUsingNewApi<Workflow>(workflowId);

  return workflow as unknown as T;
}

/**
 * Update a workflow using the new workflow API or legacy API depending on configuration.
 *
 * @param workflow The workflow request.
 * @param context Workflow update context.
 * @returns A legacy workflow update response.
 */
export async function updateWorkflow<T>(
  workflow: Workflow,
  context: WorkflowUpdateContext
): Promise<T> {
  if (process.env.REACT_APP_CANVAS2_USE_LEGACY_WORKFLOW_API === "true") {
    return updateWorkflowUsingLegacyApi(workflow, context);
  }

  return updateWorkflowUsingNewApi(workflow, context);
}
