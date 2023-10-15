import { UpdateModuleSubRootRequestGeneratorBase } from "./updateModuleSubRootRequestGeneratorBase";
import {
  LegacySubRootModule,
  SubRootModuleBase,
  Workflow,
} from "../../../../api";
import { LegacyModuleSection, Module } from "../../interfaces/api";
import { transformModuleSubJSON } from "./transformWorkflow";

export default class UpdateFormModuleSubRootRequestGenerator
  implements UpdateModuleSubRootRequestGeneratorBase
{
  // eslint-disable-next-line class-methods-use-this
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    module: Module | null
  ): object {
    const update: LegacySubRootModule = transformModuleSubJSON(
      workflow,
      module,
      SubRootModuleBase.CmdEnum.UpdateModule
    );
    return update;
  }
}
