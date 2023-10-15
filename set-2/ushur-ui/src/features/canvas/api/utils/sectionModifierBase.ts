import { Workflow } from "../../../../api";
import { WorkflowUpdateModuleChange } from "../../interfaces/api";

export interface SectionModifierBase {
  modify(workflow: Workflow, change: WorkflowUpdateModuleChange): void;
}
