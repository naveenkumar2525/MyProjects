import {
  LegacyMessageModuleSection,
  MessageModule,
  Workflow,
} from "../../../../api";
import { findLegacyUeTag, findSectionByModuleIdOrFail } from "../../data/utils";
import { WorkflowUpdateModuleChange } from "../../interfaces/api";
import { SectionModifierBase } from "./sectionModifierBase";

export default class MessageModuleSectionModifier
  implements SectionModifierBase
{
  // eslint-disable-next-line class-methods-use-this
  modify(workflow: Workflow, change: WorkflowUpdateModuleChange) {
    const workflowToUpdate = workflow;

    const { module } = change;

    const messageModule = module as MessageModule;

    const { sections } = workflowToUpdate.ui;

    // Find an existing section based on module id.
    const foundSection = findSectionByModuleIdOrFail(module.id, sections);

    // If this is the first module for the welcome step
    if (foundSection.uid === sections[0].uid) {
      workflowToUpdate.ui.welcome = messageModule.text;
      const ueTagStructure = workflowToUpdate.ui.UeTagStructure;

      const uiTagObject = findLegacyUeTag(ueTagStructure, foundSection.UeTag);
      if (uiTagObject) {
        uiTagObject.message = messageModule.text;
      }
    }

    const foundMessageModuleSection =
      foundSection as LegacyMessageModuleSection;
    foundMessageModuleSection.message = messageModule.text;
  }
}
