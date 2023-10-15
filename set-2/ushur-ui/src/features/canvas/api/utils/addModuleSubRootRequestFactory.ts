import ModuleTypes from "../../interfaces/module-types";
import AddUnimplementedModuleSubRootRequestGenerator from "./addUnimplementedModuleSubRootRequestGenerator";
import AddMessageModuleSubRootRequestGenerator from "./addMessageModuleSubRootRequestGenerator";
import { AddModuleSubRootRequestGeneratorBase } from "./addModuleSubRootRequestGeneratorBase";
import AddFormModuleSubRootRequestGenerator from "./addFormModuleSubRootRequestGenerator";

export default class AddModuleSubRootRequestFactory {
  // eslint-disable-next-line complexity
  static create(moduleType: string): AddModuleSubRootRequestGeneratorBase {
    switch (moduleType) {
      case ModuleTypes.MESSAGE_MODULE:
        return new AddMessageModuleSubRootRequestGenerator();
      case ModuleTypes.FORM_MODULE:
        return new AddFormModuleSubRootRequestGenerator();
      case ModuleTypes.COMPUTE_MODULE:
      case ModuleTypes.AI_MODULE:
      case ModuleTypes.MENU_MODULE:
      case ModuleTypes.BRANCH_MODULE:
        return new AddUnimplementedModuleSubRootRequestGenerator();
      default:
        throw new Error(
          `Attempt to create legacy section for unknown module type ${moduleType}`
        );
    }
  }
}
