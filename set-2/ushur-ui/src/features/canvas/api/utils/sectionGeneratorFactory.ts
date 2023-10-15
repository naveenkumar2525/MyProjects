import ModuleTypes from "../../interfaces/module-types";
import UnimplementedModuleSectionGenerator from "./unimplementedModuleSectionGenerator";
import MessageModuleSectionGenerator from "./messageModuleSectionGenerator";
import { SectionGeneratorBase } from "./sectionGeneratorBase";

export default class SectionGeneratorFactory {
  // eslint-disable-next-line complexity
  static create(moduleType: string): SectionGeneratorBase {
    switch (moduleType) {
      case ModuleTypes.MESSAGE_MODULE:
        return new MessageModuleSectionGenerator();
      case ModuleTypes.FORM_MODULE:
      case ModuleTypes.COMPUTE_MODULE:
      case ModuleTypes.AI_MODULE:
      case ModuleTypes.MENU_MODULE:
      case ModuleTypes.BRANCH_MODULE:
        return new UnimplementedModuleSectionGenerator();
      default:
        throw new Error(
          `Attempt to create legacy section for unknown module type ${moduleType}`
        );
    }
  }
}
