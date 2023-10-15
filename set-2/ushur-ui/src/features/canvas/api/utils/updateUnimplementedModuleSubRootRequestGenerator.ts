import { Workflow } from "../../../../api";
import { LegacyModuleSection } from "../../interfaces/api";
import { UpdateModuleSubRootRequestGeneratorBase } from "./updateModuleSubRootRequestGeneratorBase";

export default class UpdateUnimplementedModuleRequestGenerator
  implements UpdateModuleSubRootRequestGeneratorBase
{
  // eslint-disable-next-line class-methods-use-this
  create(workflow: Workflow, section: LegacyModuleSection): object {
    const workflowId = workflow.id;

    const legacyUid = section.uid;
    const legacyUeTag = section.UeTag;

    const update = {
      cmd: "updateModule",
      campaignId: `${workflowId}_child_${legacyUid}`,
      campaignData: {
        id: `${workflowId}_child_${legacyUid}`,
        UeTag: legacyUeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "unimplemented",
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    };

    return update;
  }
}
