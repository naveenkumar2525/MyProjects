import { Workflow, LegacyMessageModuleSection } from "../../../../api";
import { LegacyModuleSection } from "../../interfaces/api";
import {
  AddModuleSubRootRequestGeneratorBase,
  AddSubRootRequestGeneratorRequestOptions,
} from "./addModuleSubRootRequestGeneratorBase";

export default class AddUnimplementedModuleSubRootRequestGenerator
  implements AddModuleSubRootRequestGeneratorBase
{
  // eslint-disable-next-line class-methods-use-this
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    _options: AddSubRootRequestGeneratorRequestOptions
  ) {
    const workflowId = workflow.id;
    const messageModuleSection = section as LegacyMessageModuleSection;

    const legacyUid = messageModuleSection.uid;
    const legacyUeTag = messageModuleSection.UeTag;

    const newModuleUpdate = {
      cmd: "addModule",
      campaignId: `${workflowId}_child_${legacyUid}`,
      campaignData: {
        id: `${workflowId}_child_${legacyUid}`,
        UeTag: legacyUeTag,
        module: "unimplemented",
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    };

    return newModuleUpdate;
  }
}
