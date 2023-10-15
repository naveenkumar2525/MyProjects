import { Draft } from "@reduxjs/toolkit";
import {
  LegacyWorkflowUiUeTagStructure,
  LegacyWorkflowUiUeTagStructureResult,
  MessageModule,
  FormModule,
  Workflow,
  WorkflowStep,
  MenuModule,
} from "../../../../api";
import { LegacyModuleSection, Module } from "../../interfaces/api";
import { DiagramCellId } from "../../interfaces/diagramming-service";
import ModuleTypes from "../../interfaces/module-types";

export const getModuleIdToLegacySectionId = (moduleId: string) =>
  `section_${moduleId}`;

/**
 * Given a step ID for a workflow, find a workflow step.
 *
 * @param stepId The step ID.
 * @param workflow The workflow.
 * @returns The workflow step or undefined.
 */
export const findStep = (
  stepId: DiagramCellId | null,
  workflow: Draft<Workflow> | null
): Draft<WorkflowStep | undefined> => {
  if (!stepId) {
    return undefined;
  }
  const step = workflow?.ui?.cells.find((cell) => {
    if (cell.type === "app.Step" && cell.id === stepId) {
      return true;
    }
    return false;
  });

  return step as Draft<WorkflowStep>;
};

export const getModules = (
  cellId: DiagramCellId | null,
  details: Workflow | null
) => {
  if (!cellId) {
    return [];
  }
  const step = findStep(cellId, details);

  if (!step) {
    return [];
  }
  return step.modules ?? [];
};

export const isFirstModuleInStep = (step: WorkflowStep, module: Module) => {
  if (!step.modules?.length) {
    return false;
  }
  if (step.modules[0].id === module.id) {
    return true;
  }
  return false;
};

export const isLastModuleInStep = (step: WorkflowStep, module: Module) => {
  if (!step.modules?.length) {
    return false;
  }
  if (step.modules[step.modules.length - 1].id === module.id) {
    return true;
  }
  return false;
};

/**
 * Given a module ID and a list of workflow modules, find a workflow module.
 *
 * @param moduleId The workflow module ID.
 * @param modules The workflow modules.
 * @returns A workflow module or null.
 */
export const findModule = (
  moduleId: string,
  modules: Draft<Module[]> | undefined
) =>
  modules?.find((m: { id: string }) => {
    if (m.id === moduleId) {
      return true;
    }
    return false;
  });

/**
 * Given a workflow module ID and modules, create or update an existing workflow module ID.
 *
 * @param moduleId The workflow module ID.
 * @param modules The workflow modules.
 * @param newModule The new module information to create or update with.
 */
export const insertOrUpdateModule = (
  moduleId: string,
  modules: Draft<Module[]> | undefined,
  newModule: Module
) => {
  const foundModule = modules?.find((m: { id: string }) => {
    if (m.id === moduleId) {
      return true;
    }
    return false;
  });

  if (foundModule) {
    switch (foundModule.type) {
      case ModuleTypes.MESSAGE_MODULE: {
        (foundModule as MessageModule).text = (newModule as MessageModule).text;
        break;
      }

      case ModuleTypes.FORM_MODULE: {
        (foundModule as FormModule).fields = (newModule as FormModule).fields;
        break;
      }

      default: {
        break;
      }
    }

    foundModule.title = newModule.title;
  } else {
    modules?.push(newModule);
  }
};

export const addModule = (
  newModule: Module,
  modules: Draft<Module[]> | undefined
) => {
  modules?.push(newModule);
};

export const delModule = (moduleToDelete: Module, modules: Draft<Module[]>) => {
  const moduleToDeleteIndex = modules.findIndex(
    (module) => module.id === moduleToDelete.id
  );

  if (moduleToDeleteIndex === -1) {
    throw new Error("Could not find module to delete");
  }

  modules.splice(moduleToDeleteIndex, 1);
};

/**
 * Given a workflow module and modules, update an existing module.
 *
 * @param module The module to be updated.
 * @param modules The workflow modules.
 */
export const updateModule = (
  module: Module,
  modules: Draft<Module[]> | undefined
) => {
  const foundModule = modules?.find((m: { id: string }) => {
    if (m.id === module.id) {
      return true;
    }
    return false;
  });

  if (foundModule) {
    switch (foundModule.type) {
      case ModuleTypes.MESSAGE_MODULE: {
        const foundMessageModule = foundModule as MessageModule;
        const messageModule = module as MessageModule;
        foundMessageModule.text = messageModule.text;
        foundMessageModule.title = messageModule.title;
        break;
      }
      case ModuleTypes.MENU_MODULE: {
        const foundMenuModule = foundModule as MenuModule;
        const menuModule = module as MenuModule;
        foundMenuModule.text = menuModule.text;
        foundMenuModule.title = menuModule.title;
        foundMenuModule.menuOptions = [...menuModule.menuOptions];
        foundMenuModule.menuUserSelection = menuModule.menuUserSelection;
        foundMenuModule.errorLimitValue = menuModule.errorLimitValue;
        foundMenuModule.errorBranchTo = menuModule.errorBranchTo;
        break;
      }
      case ModuleTypes.FORM_MODULE: {
        const originalModule = foundModule as FormModule;
        const updatedModule = module as FormModule;
        originalModule.fields = updatedModule.fields;
        originalModule.title = updatedModule.title;
        break;
      }

      default: {
        break;
      }
    }
  }
};

/**
 * Find a legacy section given a section type and workflow.
 *
 * @param sectionType The type of section.
 * @param workflow The workflow.
 * @returns A section or undefined.
 */
export const findLegacySection = (
  sectionType: string,
  workflow: Draft<Workflow> | null
): Draft<LegacyModuleSection> | undefined => {
  const foundSection = workflow?.ui?.sections?.find((section) => {
    if (section.sectionType === sectionType) {
      return true;
    }
    return false;
  });

  return foundSection as Draft<LegacyModuleSection>;
};

/**
 * Determine if a step is a welcome step.
 *
 * @param step A step.
 * @returns True if it is a welcome step, false otherwise.
 */
export const isWelcomeStep = (step: Draft<WorkflowStep>) =>
  step.attrs?.label?.text === "Welcome!"; // TODO: Need a better way to detect the Welcome step.

/**
 * Find a legacy UE tag.
 *
 * @param ueTagStructure A legacy UE tag structure.
 * @param ueTag A UE tag.
 * @returns The tag structure or undefined.
 */
export const findLegacyUeTag = (
  ueTagStructure: LegacyWorkflowUiUeTagStructure | undefined,
  ueTag: string | undefined
): Draft<LegacyWorkflowUiUeTagStructureResult> | undefined => {
  if (!ueTag) {
    return undefined;
  }
  if (!ueTagStructure) {
    return undefined;
  }
  if (!ueTagStructure.result) {
    return undefined;
  }
  if (!ueTagStructure.result.length) {
    return undefined;
  }
  const foundTagObject = ueTagStructure.result.find((tagObj) => {
    if (tagObj.UeTag === ueTag) {
      return true;
    }
    return false;
  });

  return foundTagObject as Draft<LegacyWorkflowUiUeTagStructureResult>;
};

export const findSectionByModuleId = (
  id: string,
  sections: LegacyModuleSection[]
) => {
  const foundSection = sections.find(
    (section) => section.uid === getModuleIdToLegacySectionId(id)
  );

  return foundSection;
};

export const findModuleIndexOrFail = (moduleId: string, modules: Module[]) => {
  const moduleIx = modules.findIndex((m) => m.id === moduleId);
  if (moduleIx === -1) {
    throw new Error("Can't find current module index");
  }
  return moduleIx;
};

export const findSectionByModuleIdOrFail = (
  id: string,
  sections: LegacyModuleSection[]
) => {
  const foundSection = findSectionByModuleId(id, sections);
  if (!foundSection) {
    throw new Error("Could not find section");
  }
  return foundSection;
};

export const isWelcomeSection = (
  id: string,
  sections: LegacyModuleSection[]
) => {
  if (
    sections.length === 1 ||
    sections[0].uid === getModuleIdToLegacySectionId(id)
  ) {
    return true;
  }
  return false;
};

export const hasAtLeastOneModule = (modules: Module[]) => {
  if (modules.length > 0) {
    return true;
  }
  return false;
};

export const hasMoreThanOneSection = (sections: LegacyModuleSection[]) => {
  if (sections.length <= 1) {
    return false;
  }
  return true;
};

export const findStepOrFail = (
  stepId: DiagramCellId,
  workflow: Workflow
): WorkflowStep => {
  const step = workflow.ui.cells.find((cell) => {
    if (cell.type === "app.Step" && cell.id === stepId) {
      return true;
    }
    return false;
  });
  if (step) {
    return step as WorkflowStep;
  }
  throw new Error("Could not find the step");
};

export const validateAndGetCommonWorkflowInfo = (
  workflow: Workflow
): {
  workflowId: string;
  sections: LegacyModuleSection[];
} => {
  const workflowId = workflow.id;

  if (!workflowId) {
    throw new Error("Expecting a workflow id");
  }
  const { sections } = workflow.ui;
  if (!sections || !sections.length) {
    throw new Error("Expecting sections to have a length");
  }

  return {
    workflowId,
    sections,
  };
};

export const getEndOfCampaignJump = () => ({
  jump: "**ENDCAMPAIGN**",
  jumpText: "End of workflow",
});
