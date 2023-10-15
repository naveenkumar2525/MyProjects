import { LegacyMessageModuleSection, Workflow } from "../../../../api";
import { LegacyModuleSection } from "../../interfaces/api";
import { UpdateModuleSubRootRequestGeneratorBase } from "./updateModuleSubRootRequestGeneratorBase";

export default class UpdateMessageModuleSubRootRequestGenerator
  implements UpdateModuleSubRootRequestGeneratorBase
{
  // eslint-disable-next-line class-methods-use-this
  create(workflow: Workflow, section: LegacyModuleSection): object {
    const workflowId = workflow.id;
    const messageModuleSection = section as LegacyMessageModuleSection;

    const legacyUid = messageModuleSection.uid;
    const legacyUeTag = messageModuleSection.UeTag;

    const passString = {
      module: "promptmessage",
      iAppProps: {
        centerAlign: false,
        hideResponse: false,
        toggleResponse: false,
        optionalResponse: false,
        typePassword: false,
        multiSelectOptions: false,
        locSearchLabel: "Home Location",
        enableHTML: "No",
      },
    };
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
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: messageModuleSection.message,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_${messageModuleSection.jump.jump}`,
              stayInCampaign: true,
            },
          },
        },
        passString: JSON.stringify(passString),
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    };

    return update;
  }
}
