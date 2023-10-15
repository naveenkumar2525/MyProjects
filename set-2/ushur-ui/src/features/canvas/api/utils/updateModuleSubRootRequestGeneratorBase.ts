import { Workflow } from "../../../../api";
import { LegacyModuleSection, Module } from "../../interfaces/api";

export interface UpdateModuleSubRootRequestGeneratorBase {
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    module?: Module | null
  ): object;
}
