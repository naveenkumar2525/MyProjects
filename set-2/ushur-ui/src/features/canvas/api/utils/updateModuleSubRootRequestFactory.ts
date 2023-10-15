import ModuleTypes from "../../interfaces/module-types";
import { UpdateModuleSubRootRequestGeneratorBase } from "./updateModuleSubRootRequestGeneratorBase";
import UpdateMessageModuleSubRootRequestGenerator from "./updateMessageModuleSubRootRequestGenerator";
import UpdateFormModuleSubRootRequestGenerator from "./updateFormModuleSubRootRequestGenerator";
import UpdateUnimplementedModuleRequestGenerator from "./updateUnimplementedModuleSubRootRequestGenerator";

export default class UpdateModuleSubRootRequestFactory {
  // eslint-disable-next-line complexity
  static create(moduleType: string): UpdateModuleSubRootRequestGeneratorBase {
    switch (moduleType) {
      case ModuleTypes.MESSAGE_MODULE:
        return new UpdateMessageModuleSubRootRequestGenerator();
      case ModuleTypes.FORM_MODULE:
        return new UpdateFormModuleSubRootRequestGenerator();
      case ModuleTypes.COMPUTE_MODULE:
      case ModuleTypes.AI_MODULE:
      case ModuleTypes.MENU_MODULE:
      case ModuleTypes.BRANCH_MODULE:
        return new UpdateUnimplementedModuleRequestGenerator();
      default:
        throw new Error(
          `Attempt to create legacy section for unknown module type ${moduleType}`
        );
    }
  }
}
