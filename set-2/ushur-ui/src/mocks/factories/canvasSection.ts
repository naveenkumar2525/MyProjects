import { Factory } from "fishery";
import { v4 as uuidv4 } from "uuid";
import { generateUeTag } from "../../features/canvas/api/utils/generateTag";
import { LegacyModuleSection } from "../../features/canvas/interfaces/api";

const canvasSectionFactory = Factory.define<LegacyModuleSection>(
  ({ sequence }) => ({
    currentStep: "",
    uid: uuidv4(),
    userTitle: "",
    message: "",
    UeTag: generateUeTag(),
    position: {
      x: sequence * 100,
      y: sequence * 120,
    },
    onReturn: {
      UeTag: "UeTag_458433",
      jumpText: "End of workflow",
      jump: "**ENDCAMPAIGN**",
    },
    sectionType: "message-module",
    jump: {
      jumpText: "End of workflow",
      jump: "**ENDCAMPAIGN**",
    },
  })
);

export default canvasSectionFactory;
