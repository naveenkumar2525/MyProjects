import { LegacyMessageModuleSection, Workflow } from "../../../../api";
import { findSectionByModuleIdOrFail } from "../../data/utils";
import { LegacyModuleSection } from "../../interfaces/api";
import {
  AddMessageModuleSubRootRequestGeneratorOptions,
  AddModuleSubRootRequestGeneratorBase,
} from "./addModuleSubRootRequestGeneratorBase";

export default class AddMessageModuleSubRootRequestGenerator
  implements AddModuleSubRootRequestGeneratorBase
{
  // eslint-disable-next-line class-methods-use-this
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    options: AddMessageModuleSubRootRequestGeneratorOptions
  ) {
    const workflowId = workflow.id;
    const messageModuleSection = section as LegacyMessageModuleSection;

    const legacyUid = messageModuleSection.uid;
    const legacyUeTag = messageModuleSection.UeTag;

    let nextSectionChildId = `${workflowId}_child_**ENDCAMPAIGN**`;
    const nextModule = options.nextModules?.[0]; // Only one branch for message module
    if (nextModule) {
      const nextSection = findSectionByModuleIdOrFail(
        nextModule.id,
        workflow.ui.sections
      );
      nextSectionChildId = `${workflowId}_child_${nextSection.uid}`;
    }

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
    const newModuleUpdate = {
      cmd: "addModule",
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
              menuId: nextSectionChildId,
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

    return newModuleUpdate;
  }
}
