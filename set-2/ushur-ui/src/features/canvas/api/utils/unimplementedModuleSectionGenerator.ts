import { MessageModule, Workflow } from "../../../../api";
import {
  getEndOfCampaignJump,
  getModuleIdToLegacySectionId,
} from "../../data/utils";
import {
  WorkflowUpdateContext,
  WorkflowUpdateModuleChange,
} from "../../interfaces/api";
import { generateUeTag } from "./generateTag";
import { SectionGeneratorBase } from "./sectionGeneratorBase";

export default class UnimplementedModuleSectionGenerator
  implements SectionGeneratorBase
{
  // eslint-disable-next-line class-methods-use-this
  create(workflow: Workflow, context: WorkflowUpdateContext) {
    const { module } = context.change as WorkflowUpdateModuleChange;

    const workflowToUpdate = workflow;
    const { sections } = workflowToUpdate.ui;
    const { text, id } = module as MessageModule;

    sections.push({
      uid: getModuleIdToLegacySectionId(id),
      UeTag: module.uetag ?? generateUeTag(),
      sectionType: module.type,
      jump: getEndOfCampaignJump(),
      userTitle: "",
      isFormEntry: false,
      onReturn: {
        UeTag: workflowToUpdate.routines?.On_Return?.UeTag ?? "",
        ...getEndOfCampaignJump(),
      },
      message: text,
      additionalDetails: {
        activated: false,
        details: [
          {
            order: "0",
            title: "",
            content: "",
            image: "",
            link: "",
          },
        ],
      },
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
      UshurDescriptions: {},
      note: "",
      moduleIcon: "",
      attachment: "",
      hasManualPhrases: false,
      uliTopics: [],
      position: {
        x: 609.5,
        y: 20,
      },
    });
  }
}
