import { MessageModule, MenuModule, FormModule } from "../../../../api";
import { Module } from "../../interfaces/api";
import ModuleTypes from "../../interfaces/module-types";

export const getModuleTitle = (id: string) => {
  const moduleTitleMap: Record<string, string> = {
    [ModuleTypes.MESSAGE_MODULE]: "Message",
    [ModuleTypes.MENU_MODULE]: "Menu",
    [ModuleTypes.FORM_MODULE]: "Form",
    [ModuleTypes.COMPUTE_MODULE]: "Compute",
    [ModuleTypes.BRANCH_MODULE]: "Branch",
    [ModuleTypes.AI_MODULE]: "AI/ML",
  };

  return moduleTitleMap[id] ?? {};
};

export const engagementModules: Module[] = [
  {
    id: ModuleTypes.MESSAGE_MODULE,
    type: ModuleTypes.MESSAGE_MODULE,
    title: "Message",
    text: "",
  } as MessageModule,
  {
    id: ModuleTypes.MENU_MODULE,
    type: ModuleTypes.MENU_MODULE,
    title: "Menu",
    text: '<h2 class="mb-0">Main Menu</h2><span>Select an option from the menu below.</span>',
  } as MenuModule,
  {
    id: ModuleTypes.FORM_MODULE,
    type: ModuleTypes.FORM_MODULE,
    title: "Form",
    fields: [],
  } as FormModule,
];

export const utilityModules: Module[] = [
  {
    id: ModuleTypes.BRANCH_MODULE,
    type: ModuleTypes.BRANCH_MODULE,
    title: "Branch",
  },
  {
    id: ModuleTypes.COMPUTE_MODULE,
    type: ModuleTypes.COMPUTE_MODULE,
    title: "Compute",
  },
  {
    id: ModuleTypes.AI_MODULE,
    type: ModuleTypes.AI_MODULE,
    title: "AI/ML",
  },
];
