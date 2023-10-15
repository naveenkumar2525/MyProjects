// Until this file has more logic, the value
// in testing it is low.
/* istanbul ignore file */
import {
  InitializeWorkflowSimulatorApi,
  InitUshurRequest,
  ContinueWorkflowSimulatorStepApi,
  ContinueUshurRequest,
} from "../../../api";
import {
  commonHeaders,
  getHostName,
  getTokenId,
} from "../../../utils/api.utils";

/**
 * Update a workflow using the workflow API.
 *
 * @param body Init Ushur Request body.
 * @returns Init Ushur Response.
 */
export async function initUshur<T>(body: InitUshurRequest): Promise<T> {
  if (!body.ushurId) {
    throw new Error("Expecting workflow to have a ushurId");
  }
  const api = new InitializeWorkflowSimulatorApi({}, getHostName(), fetch);
  const options: Record<string, unknown> = {
    headers: {
      ...commonHeaders,
      tokenid: getTokenId() as string,
    },
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };

  const result = await api.initUshur(body, options);

  if (!result) {
    throw new Error("No data found");
  }

  return result as unknown as T;
}

/**
 * Update a workflow using the workflow API.
 *
 * @param body Continue Ushur Request body.
 * @returns Continue Ushur Response.
 */
export async function continueUshur<T>(body: ContinueUshurRequest): Promise<T> {
  if (!body.sid) {
    throw new Error("Expecting payload to have an sid");
  }
  const api = new ContinueWorkflowSimulatorStepApi({}, getHostName(), fetch);

  const options: Record<string, unknown> = {
    headers: {
      ...commonHeaders,
      tokenid: getTokenId() as string,
    },
    referrerPolicy: "no-referrer",
    mode: "cors",
    credentials: "omit",
  };

  const result = await api.continueUshur(body, options);

  if (!result) {
    throw new Error("No data found");
  }

  return result as unknown as T;
}
