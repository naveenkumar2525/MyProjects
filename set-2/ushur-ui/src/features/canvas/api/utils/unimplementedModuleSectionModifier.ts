import { Workflow } from "../../../../api";
import { WorkflowUpdateModuleChange } from "../../interfaces/api";
import { SectionModifierBase } from "./sectionModifierBase";

export default class UnimplementedModuleSectionModifier
  implements SectionModifierBase
{
  // eslint-disable-next-line class-methods-use-this
  modify(_workflow: Workflow, _change: WorkflowUpdateModuleChange) {}
}
