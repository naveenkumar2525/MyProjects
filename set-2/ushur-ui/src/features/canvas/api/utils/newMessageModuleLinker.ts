import { Workflow, LegacyMessageModuleSection } from "../../../../api";
import { getModuleIdToLegacySectionId } from "../../data/utils";
import { LegacyModuleSection } from "../../interfaces/api";
import {
  NewModuleLinkerBase,
  LegacyLinkRequestOptions,
} from "./newModuleLinkerBase";

export default class NewMessageModuleLinker implements NewModuleLinkerBase {
  // eslint-disable-next-line class-methods-use-this
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    options: LegacyLinkRequestOptions
  ) {
    const messageModuleSection = section as LegacyMessageModuleSection;
    const { nextModule } = options;

    const nextSection = workflow.ui.sections.find(
      (s) => s.uid === getModuleIdToLegacySectionId(nextModule.id)
    );

    if (!nextSection) {
      throw new Error("Could not find section");
    }

    messageModuleSection.jump.jump = nextSection.uid;
    messageModuleSection.jump.jumpText = nextSection.userTitle ?? "";
  }
}
