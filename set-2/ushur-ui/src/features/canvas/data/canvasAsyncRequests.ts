/* eslint max-lines: ["error", 470] */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import {
  Workflow,
  WorkflowStep,
  WorkflowLink,
  WorkflowVariables,
  InitUshurRequest,
  ContinueUshurRequest,
  WorkflowAttributes,
  DeleteWorkflowLegacyRequest,
} from "../../../api";
// eslint-disable-next-line import/no-cycle
import { RootState } from "../../../app/store";
import {
  activateWorkflow,
  continueUshur,
  deactivateWorkflow,
  getWorkflow,
  getWorkflowVariablesUsingLegacyApi,
  initUshur,
  updateWorkflow,
  deleteWorkflowUsingLegacyApi,
  getVariablesByUeTagUsingLegacyApi,
  getTagTypesUsingLegacyApi,
  getTagsUsingLegacyApi,
  createTagsUsingLegacyApi,
  getDatatableTagsUsingLegacyApi,
} from "../api";
import createEmptyWorkflow from "../emptyWorkflow";
import {
  WorkflowAddModuleChange,
  WorkflowUpdateContextType,
  WorkflowConfigureModulesChange,
  WorkflowUpdateModuleChange,
  WorkflowAddCellChange,
  WorkflowDelCellChange,
  WorkflowUpdateCellChange,
  Module,
  WorkflowDelModuleChange,
  WorkflowUpdateChange,
} from "../interfaces/api";
import { SLICE_NAME } from "../interfaces/data/canvasState";
import { findStep, addModule, updateModule, delModule } from "./utils";

export const initUshurAsync = createAsyncThunk(
  `${SLICE_NAME}/initUshur`,
  async (body: InitUshurRequest) => {
    const result = await initUshur(body);
    return result;
  }
);

export const continueUshurAsync = createAsyncThunk(
  `${SLICE_NAME}/continueUshur`,
  async (body: ContinueUshurRequest) => {
    const result = await continueUshur(body);
    return result;
  }
);

export const activateWorkAsync = createAsyncThunk(
  `${SLICE_NAME}/activateWork`,
  async (
    params: {
      workflow: Workflow;
    },
    { getState }
  ) => {
    const clonedWorkflow = cloneDeep(params.workflow);
    clonedWorkflow.ui.active = true;
    const activateWorkflowDetails = await activateWorkflow(clonedWorkflow);

    const change: WorkflowUpdateChange = {
      Workflow: clonedWorkflow,
    };
    const state = getState() as RootState;

    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.UPDATE_PUBLISH,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });
    return activateWorkflowDetails;
  }
);

export const deactivateWorkAsync = createAsyncThunk(
  `${SLICE_NAME}/deactivateWork`,
  async (
    params: {
      workflow: Workflow;
    },
    { getState }
  ) => {
    const clonedWorkflow = cloneDeep(params.workflow);
    clonedWorkflow.ui.active = false;
    const deactivateWorkflowDetails = await deactivateWorkflow(clonedWorkflow);

    const change: WorkflowUpdateChange = {
      Workflow: clonedWorkflow,
    };
    const state = getState() as RootState;

    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.UPDATE_PUBLISH,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });
    return deactivateWorkflowDetails;
  }
);

export const getWorkflowAsync = createAsyncThunk(
  `${SLICE_NAME}/getWorkflow`,
  async (workflowId: string) => {
    let workflowDetails;
    if (!workflowId) {
      workflowDetails = createEmptyWorkflow(workflowId);
    } else {
      workflowDetails = await getWorkflow<Workflow>(workflowId);
      if (!workflowDetails) {
        workflowDetails = createEmptyWorkflow(workflowId);
      }
    }
    return workflowDetails;
  }
);
export const deleteWorkflowAsync = createAsyncThunk(
  `${SLICE_NAME}/deleteWorkflow`,
  async (workflowId: string) => {
    const deleteWorkflow =
      await deleteWorkflowUsingLegacyApi<DeleteWorkflowLegacyRequest>(
        workflowId
      );
    return deleteWorkflow;
  }
);
export const addModuleAsync = createAsyncThunk(
  `${SLICE_NAME}/addModule`,
  async (
    params: {
      workflow: Workflow;
      stepId: string;
      module: Module;
    },
    { getState }
  ) => {
    const { workflow, stepId, module } = params;
    const clonedWorkflow = cloneDeep(params.workflow);

    const step = findStep(stepId, clonedWorkflow);
    if (!step) {
      return workflow;
    }

    addModule(module, step.modules);

    const change: WorkflowAddModuleChange = {
      step,
      module,
    };

    const state = getState() as RootState;

    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.ADD_MODULE,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });

    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);

    return workflowDetails;
  }
);

export const delModuleAsync = createAsyncThunk(
  `${SLICE_NAME}/delModule`,
  async (
    params: { workflow: Workflow; stepId: string; module: Module },
    { getState }
  ) => {
    const { workflow, stepId, module } = params;
    const clonedWorkflow = cloneDeep(workflow);

    const step = findStep(stepId, clonedWorkflow);
    if (!step) {
      return workflow;
    }

    delModule(module, step.modules);

    const change: WorkflowDelModuleChange = {
      step,
      module,
      originalWorkflow: workflow,
    };

    const state = getState() as RootState;

    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.DEL_MODULE,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });

    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);

    return workflowDetails;
  }
);

export const reorderModulesAsync = createAsyncThunk(
  `${SLICE_NAME}/reorderModules`,
  async (
    params: {
      workflow: Workflow;
      stepId: string;
      modules: Module[];
      source: number;
      destination: number;
    },
    { getState }
  ) => {
    const { workflow, stepId, modules, source, destination } = params;
    const clonedWorkflow = cloneDeep(params.workflow);

    const step = findStep(stepId, clonedWorkflow);
    if (!step) {
      return workflow;
    }

    step.modules = modules;

    const change: WorkflowConfigureModulesChange = {
      step,
      modules,
      source,
      destination,
    };

    const state = getState() as RootState;

    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.REORDER_MODULES,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });

    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);
    return workflowDetails;
  }
);

export const setModulesAsync = createAsyncThunk(
  `${SLICE_NAME}/setModules`,
  async (
    params: {
      workflow: Workflow;
      stepId: string;
      modules: Module[];
    },
    { getState }
  ) => {
    const { workflow, stepId, modules } = params;
    const clonedWorkflow = cloneDeep(params.workflow);

    const step = findStep(stepId, clonedWorkflow);
    if (!step) {
      return workflow;
    }

    step.modules = modules;

    const change: WorkflowConfigureModulesChange = {
      step,
      modules,
      source: 0,
      destination: 0,
    };

    const state = getState() as RootState;

    await updateWorkflow<Workflow>(workflow, {
      type: WorkflowUpdateContextType.REORDER_MODULES,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });

    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);
    return workflowDetails;
  }
);

export const updateModuleAsync = createAsyncThunk(
  `${SLICE_NAME}/updateModule`,
  async (
    params: {
      workflow: Workflow;
      stepId: string;
      module: Module;
    },
    { getState }
  ) => {
    const { workflow, stepId, module } = params;

    const clonedWorkflow = cloneDeep(workflow);

    const step = findStep(stepId, clonedWorkflow);
    if (!step) {
      return workflow;
    }

    updateModule(module, step.modules);

    const change: WorkflowUpdateModuleChange = {
      step,
      module,
    };

    const state = getState() as RootState;
    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.UPDATE_MODULE,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });

    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);

    return workflowDetails;
  }
);

export const addCellsToWorkflowAsync = createAsyncThunk(
  `${SLICE_NAME}/addWorkflowCells`,
  async (
    params: {
      workflow: Workflow;
      cells: (WorkflowStep | WorkflowLink)[];
    },
    { getState }
  ) => {
    const clonedWorkflow = cloneDeep(params.workflow);
    if (clonedWorkflow) {
      const newCells = clonedWorkflow?.ui.cells.concat(params.cells);
      clonedWorkflow.ui.cells = newCells;
    }

    const change: WorkflowAddCellChange = {
      cells: params.cells,
    };
    const state = getState() as RootState;
    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.ADD_CELLS,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });
    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);
    return workflowDetails;
  }
);

export const deleteCellFromWorkflowAsync = createAsyncThunk(
  `${SLICE_NAME}/deleteWorkflowCell`,
  async (
    params: {
      workflow: Workflow;
      cellToDelete: WorkflowStep | WorkflowLink;
    },
    { getState }
  ) => {
    const clonedWorkflow = cloneDeep(params.workflow);
    if (clonedWorkflow) {
      const newCells = clonedWorkflow?.ui.cells.filter(
        (cell) => cell.id !== params.cellToDelete.id
      );
      clonedWorkflow.ui.cells = newCells;
    }

    const change: WorkflowDelCellChange = {
      cell: params.cellToDelete,
    };

    const state = getState() as RootState;
    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.DEL_CELLS,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });
    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);
    return workflowDetails;
  }
);

export const updateCellFromWorkflowAsync = createAsyncThunk(
  `${SLICE_NAME}/updateWorkflowCell`,
  async (
    params: {
      workflow: Workflow;
      cellToUpdate: WorkflowStep | WorkflowLink;
      cellID: string;
    },
    { getState }
  ) => {
    const clonedWorkflow = cloneDeep(params.workflow);
    for (let i = 0; i < clonedWorkflow?.ui.cells.length; i += 1) {
      const element = clonedWorkflow?.ui.cells[i];
      if (!element) {
        throw new Error("no cells found");
      }
      if (element.id === params.cellID) {
        element.attrs = params.cellToUpdate as WorkflowAttributes;
      }
    }

    const change: WorkflowUpdateCellChange = {
      cell: params.cellToUpdate,
    };
    const state = getState() as RootState;
    await updateWorkflow<Workflow>(clonedWorkflow, {
      type: WorkflowUpdateContextType.UPDATE_CELL,
      diagrammingService: state.canvas.diagrammingService,
      change,
    });
    const workflowDetails = await getWorkflow<Workflow>(clonedWorkflow.id);
    return workflowDetails;
  }
);

export const variablesWorkAsync = createAsyncThunk(
  `${SLICE_NAME}/variablesWork`,
  async (workflowId: string) => {
    const variablesWorkflowDetails =
      await getWorkflowVariablesUsingLegacyApi<WorkflowVariables>(workflowId);
    return variablesWorkflowDetails;
  }
);

export const getVariablesByUeTagAsync = createAsyncThunk(
  `${SLICE_NAME}/getVariablesByUeTag`,
  async (params: { campaignId: string; ueTag: string }) =>
    getVariablesByUeTagUsingLegacyApi(params)
);

export const getTagTypesAsync = createAsyncThunk(
  `${SLICE_NAME}/getTagTypes`,
  () => getTagTypesUsingLegacyApi()
);

export const getTagsAsync = createAsyncThunk(
  `${SLICE_NAME}/getTags`,
  (campaignId: string) => getTagsUsingLegacyApi(campaignId)
);

export const createTagAsync = createAsyncThunk(
  `${SLICE_NAME}/createTag`,
  (params: { campaignId: string; vars: Record<string, string>[] }) =>
    createTagsUsingLegacyApi(params)
);

export const getDatatableTagsAsync = createAsyncThunk(
  `${SLICE_NAME}/getDataTableTags`,
  (AppContext: string) => getDatatableTagsUsingLegacyApi(AppContext)
);
