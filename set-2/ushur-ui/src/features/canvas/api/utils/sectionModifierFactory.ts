import ModuleTypes from "../../interfaces/module-types";
import MessageModuleSectionModifier from "./messageModuleSectionModifier";
import { SectionModifierBase } from "./sectionModifierBase";
import UnimplementedModuleSectionModifier from "./unimplementedModuleSectionModifier";

export default class SectionModifierFactory {
  // eslint-disable-next-line complexity
  static create(moduleType: string): SectionModifierBase {
    switch (moduleType) {
      case ModuleTypes.MESSAGE_MODULE:
        return new MessageModuleSectionModifier();
      case ModuleTypes.FORM_MODULE:
      case ModuleTypes.COMPUTE_MODULE:
      case ModuleTypes.AI_MODULE:
      case ModuleTypes.MENU_MODULE:
      case ModuleTypes.BRANCH_MODULE:
        return new UnimplementedModuleSectionModifier();
      default:
        throw new Error(
          `Attempt to modify legacy section for unknown module type ${moduleType}`
        );
    }
  }
}
