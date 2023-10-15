import { getEndOfCampaignJump } from "../../data/utils";
import { OnReturnRoutine, SectionOnReturn } from "../../interfaces/api";

export const generateOnReturnRoutine = (
  workflowId: string,
  ueTag: string | undefined
): OnReturnRoutine => ({
  UeTag: ueTag,
  action: "goToMenu",
  params: {
    menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
    stayInCampaign: true,
  },
});

export const generateSectionOnReturn = (ueTag: string): SectionOnReturn => ({
  UeTag: ueTag,
  ...getEndOfCampaignJump(),
});

export const generateInitialRoutine = (workflowId: string) => ({
  action: "goToMenu",
  params: {
    menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
    stayInCampaign: true,
  },
});
