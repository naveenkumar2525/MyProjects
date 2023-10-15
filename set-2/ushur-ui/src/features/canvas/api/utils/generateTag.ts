import { LegacyMessageModuleSection } from "../../../../api";
import { LegacyModuleSection } from "../../interfaces/api";

export const generateUeTag = () => {
  const random = String(Math.random()).slice(2, 8);
  return `UeTag_${random}`;
};

export const generateWelcomeUeTagStructure = (
  workflowId: string,
  ueTag: string | undefined,
  message: string
) => ({
  result: [
    {
      UeTag: ueTag,
      message,
    },
  ],
  ushurId: workflowId,
  tagCount: 1,
});

export const generateUeTagStructure = (
  workflowId: string,
  sections: LegacyModuleSection[]
) => ({
  result: sections.map((section) => ({
    UeTag: section.UeTag,
    message: (section as LegacyMessageModuleSection).message,
  })),
  ushurId: workflowId,
  tagCount: sections.length,
});
