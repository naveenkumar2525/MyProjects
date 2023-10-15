import ModuleTypes from "../../interfaces/module-types";
import NewMessageModuleLinker from "./newMessageModuleLinker";
import NewUnimplementedModuleLinker from "./newUnimplementedModuleLinker";
import { NewModuleLinkerBase } from "./newModuleLinkerBase";

export default class NewModuleLinkerFactory {
  // eslint-disable-next-line complexity
  static create(moduleType: string): NewModuleLinkerBase {
    switch (moduleType) {
      case ModuleTypes.MESSAGE_MODULE:
        return new NewMessageModuleLinker();
      case ModuleTypes.FORM_MODULE:
      case ModuleTypes.COMPUTE_MODULE:
      case ModuleTypes.AI_MODULE:
      case ModuleTypes.MENU_MODULE:
      case ModuleTypes.BRANCH_MODULE:
        return new NewUnimplementedModuleLinker();
      default:
        throw new Error(
          `Attempt to create legacy section for unknown module type ${moduleType}`
        );
    }
  }
}
