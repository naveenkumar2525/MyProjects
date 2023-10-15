import { dia, ui } from "@clientio/rappid";
import { Workflow, WorkflowLink, WorkflowStep } from "../../../api";
import { AddStepMenuOptions } from "../components/AddStepMenu";

export type DiagramCellId = string | number;

export interface DiagramCell {
  getId(): string | number;
  getType(): string;
  getValue<T>(path: string | (string | number)[]): T;
  setValue<T>(path: string | (string | number)[], val: T): void;
  remove(): void;
  on(event: string, callback: () => void, context: object): void;
  off(event: string | null, callback: () => void | null, context: object): void;
}

export interface DiagrammingService {
  start(): void;
  destroy(): void;
  import(workflow: Workflow): void;
  getGraph(): dia.Graph;
  getInboundAndOutboundStepsToCell(
    workflow: Workflow,
    step: WorkflowStep
  ): {
    inboundStepsToCell: WorkflowStep[];
    outboundStepsToCell: WorkflowStep[];
  };
  getCellById(id: DiagramCellId): DiagramCell | null;
  startBatch(name: string): void;
  stopBatch(name: string): void;
  onClickAddStepPopupMenu(option: AddStepMenuOptions): void;
  addNewStep(parentStep: string, stepName: string): DiagramCellId;
  linkTwoSteps(parentStep: string, childStep: string): void;
}

export interface DiagrammingEventListeners {
  "blank:pointerdown": () => void;
  "element:pointerdown": (selection: unknown) => void;
  "element:pointerdblclick": () => void;
  "debug-workflow:pointerclick"?: () => void;
  onClickAddStepBtnInBranch: () => void;
  onAddNewObjects(cells: Array<WorkflowStep | WorkflowLink>): void;
  onRemoveObject(cell: WorkflowStep | WorkflowLink): void;
}

export enum Shapes {
  STEP = "app.Step",
  LINK = "app.Link",
  ADDSTEP = "app.AddStep",
  LINE = "app.Line",
}

export enum Group {
  in = "in",
  out = "out",
}

export interface AllSteps {
  childfulSteps: dia.Cell[];
  childlessSteps: dia.Cell[];
}

export interface StepContextMenu {
  anchor: HTMLDivElement;
  el: ui.Popup | null;
  branch: dia.Cell.ID | null;
}
