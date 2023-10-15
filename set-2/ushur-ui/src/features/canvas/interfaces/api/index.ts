import {
  WorkflowStep,
  WorkflowLink,
  LegacyMenuModuleSection,
  LegacyWelcomeModuleSection,
  LegacyMessageModuleSection,
  LegacyFormModuleSection,
  CreateWorkflowLegacyRequest,
  GetWorkflowLegacyRequest,
  GetWorkflowVariablesRequest,
  UpdateWorkflowLegacyRequest,
  LegacyWorkflow,
  LegacyWorkflowUpdateResponse,
  MessageModule,
  FormModule,
  MenuModule,
  ModuleBase,
  LegacySubRootModule,
  Workflow,
} from "../../../../api";
/* eslint-disable import/no-cycle */
import { DiagrammingService } from "../diagramming-service";

export interface CreateWorkflowRequest {
  appContext: string;
  workflowId: string;
  description?: string;
  version?: string;
}

export interface OnReturnRoutine {
  UeTag: string | undefined;
  action: string;
  params: {
    menuId: string;
    stayInCampaign: boolean;
  };
}

export interface SectionOnReturn {
  UeTag: string;
  jumpText: string;
  jump: string;
}

export enum WorkflowUpdateContextType {
  UPDATE_MODULE = "updateModule",
  REORDER_MODULES = "configureModules",
  ADD_MODULE = "addModule",
  DEL_MODULE = "delModule",
  ADD_CELLS = "addCells",
  DEL_CELLS = "delCells",
  UPDATE_CELL = "updateCell",
  UPDATE_PUBLISH = "updatePublish",
}

export interface WorkflowAddModuleChange {
  step: WorkflowStep;
  module: Module;
}

export interface WorkflowDelModuleChange {
  step: WorkflowStep;
  module: Module;

  originalWorkflow: Workflow;
}

export interface WorkflowUpdateChange {
  Workflow: Workflow;
}

export interface WorkflowConfigureModulesChange {
  step: WorkflowStep;
  modules: Module[];
  source: number;
  destination: number;
}

export interface WorkflowUpdateModuleChange {
  step: WorkflowStep;
  module: Module;
}

export interface WorkflowAddCellChange {
  cells: (WorkflowStep | WorkflowLink)[];
}

export interface WorkflowDelCellChange {
  cell: WorkflowStep | WorkflowLink;
}

export interface WorkflowUpdateCellChange {
  cell: WorkflowStep | WorkflowLink;
}

export interface WorkflowUpdateContext {
  type: WorkflowUpdateContextType;
  diagrammingService: DiagrammingService | undefined;
  change:
    | WorkflowAddCellChange
    | WorkflowDelCellChange
    | WorkflowConfigureModulesChange
    | WorkflowAddModuleChange
    | WorkflowUpdateModuleChange
    | WorkflowUpdateChange;
  subModules?: LegacySubRootModule[] | null;
}

export type LegacyModuleSection =
  | LegacyMenuModuleSection
  | LegacyWelcomeModuleSection
  | LegacyMessageModuleSection
  | LegacyFormModuleSection;

export type InfoQueryRequest =
  | CreateWorkflowLegacyRequest
  | GetWorkflowLegacyRequest
  | UpdateWorkflowLegacyRequest
  | GetWorkflowVariablesRequest;

export type InfoQueryResponse =
  | LegacyWorkflow
  | LegacyWorkflowUpdateResponse
  // eslint-disable-next-line @typescript-eslint/ban-types
  | {}
  | undefined;

export type Module = MessageModule | FormModule | MenuModule | ModuleBase;
