import {
  LegacySubRootModule,
  SubRootModuleBase,
  Workflow,
} from "../../../../api";
import { LegacyModuleSection, Module } from "../../interfaces/api";
import {
  AddMessageModuleSubRootRequestGeneratorOptions,
  AddModuleSubRootRequestGeneratorBase,
} from "./addModuleSubRootRequestGeneratorBase";

import { transformModuleSubJSON } from "./transformWorkflow";

export default class AddFormModuleSubRootRequestGenerator
  implements AddModuleSubRootRequestGeneratorBase
{
  /* eslint max-params: ["error", 4] */
  /* eslint-disable-next-line class-methods-use-this */
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    options: AddMessageModuleSubRootRequestGeneratorOptions,
    module: Module
  ) {
    const newModuleUpdate: LegacySubRootModule = transformModuleSubJSON(
      workflow,
      module,
      SubRootModuleBase.CmdEnum.AddModule
    );

    return newModuleUpdate;
  }
}
