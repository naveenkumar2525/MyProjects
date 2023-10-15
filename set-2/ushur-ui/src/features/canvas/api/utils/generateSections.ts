import { cloneDeep } from "lodash";
import {
  Workflow,
  LegacyWelcomeModuleSection,
  LegacyMessageModuleSection,
} from "../../../../api";
import {
  findSectionByModuleIdOrFail,
  getEndOfCampaignJump,
  getModuleIdToLegacySectionId,
} from "../../data/utils";
import {
  WorkflowAddModuleChange,
  WorkflowConfigureModulesChange,
  WorkflowDelModuleChange,
  WorkflowUpdateContext,
  WorkflowUpdateContextType,
  WorkflowUpdateModuleChange,
} from "../../interfaces/api";
import { generateSectionOnReturn } from "./generateRoutine";
import { generateUeTag } from "./generateTag";
import SectionGeneratorFactory from "./sectionGeneratorFactory";
import SectionModifierFactory from "./sectionModifierFactory";

export const generateWelcomeSection = (
  id: string,
  message: string
): LegacyWelcomeModuleSection => ({
  uid: getModuleIdToLegacySectionId(id),
  userTitle: "",
  note: "",
  UeTag: generateUeTag(),
  moduleIcon: "",
  position: {
    x: 546,
    y: 20,
  },
  sectionType: "welcome",
  onReturn: generateSectionOnReturn(generateUeTag()),
  message,
  jump: getEndOfCampaignJump(),
});

export const generateSectionsFromReorderedModules = (
  workflow: Workflow,
  context: WorkflowUpdateContext
) => {
  const workflowToUpdate = workflow;
  const { modules, source, destination } =
    context.change as WorkflowConfigureModulesChange;

  // Get source module and source section
  const sourceModule = modules[source];
  const sourceSection = findSectionByModuleIdOrFail(
    sourceModule.id,
    workflowToUpdate.ui.sections
  ) as LegacyMessageModuleSection;

  // Get dest module and dest section
  const destinationModule = modules[destination];
  const destinationSection = findSectionByModuleIdOrFail(
    destinationModule.id,
    workflowToUpdate.ui.sections
  ) as LegacyMessageModuleSection;

  // source section jump should be dest section jump
  const savedSourceSectionJump = cloneDeep(sourceSection.jump);
  sourceSection.jump = destinationSection.jump;

  // dest section jump should be source section jump
  destinationSection.jump = savedSourceSectionJump;

  // incoming sections should jump appropriately
  for (const section of workflowToUpdate.ui.sections) {
    const messageModuleSection = section as LegacyMessageModuleSection;
    if (messageModuleSection.jump.jump === sourceSection.uid) {
      messageModuleSection.jump.jump = destinationSection.uid;
    } else if (messageModuleSection.jump.jump === destinationSection.uid) {
      messageModuleSection.jump.jump = sourceSection.uid;
    }
  }

  return workflowToUpdate.ui.sections;
};

export const generateSectionsFromNewModule = (
  workflow: Workflow,
  context: WorkflowUpdateContext
) => {
  const { module } = context.change as WorkflowAddModuleChange;

  const sectionCreator = SectionGeneratorFactory.create(module.type);
  sectionCreator.create(workflow, context);
};

export const generateSectionsWithoutDeletedModule = (
  workflow: Workflow,
  context: WorkflowUpdateContext
) => {
  const { module } = context.change as WorkflowDelModuleChange;

  // Note: Support only for message modules at this point
  const sectionToDelete = findSectionByModuleIdOrFail(
    module.id,
    workflow.ui.sections
  );

  const newSections = workflow.ui.sections.filter(
    (section) => section.uid !== sectionToDelete.uid
  );

  // Any sections that jump to the deleted section need to be updated.
  const sectionToDeleteJump = (sectionToDelete as LegacyMessageModuleSection)
    .jump.jump;
  for (const section of newSections) {
    const messageModuleSection = section as LegacyMessageModuleSection;
    if (messageModuleSection.jump.jump === sectionToDelete.uid) {
      messageModuleSection.jump.jump = sectionToDeleteJump;
    }
  }

  return newSections;
};

export const modifySection = (
  workflow: Workflow,
  change: WorkflowUpdateModuleChange
) => {
  const { module } = change;
  const sectionModifier = SectionModifierFactory.create(module.type);
  sectionModifier.modify(workflow, change);
};

// TODO: The linter sees more switch cases as an increase in complexity
// Change switch cases to an object map
// eslint-disable-next-line complexity
export const generateSections = (
  workflow: Workflow,
  context: WorkflowUpdateContext
) => {
  switch (context.type) {
    case WorkflowUpdateContextType.UPDATE_PUBLISH:
      // updating workflow publish
      return workflow.ui.sections;
    case WorkflowUpdateContextType.ADD_CELLS: {
      // Nothing to generate for the SubRoot JSON. Only when modules are added in cells do we need to generate
      // sections.
      return workflow.ui.sections;
    }
    case WorkflowUpdateContextType.DEL_CELLS:
      // TODO: https://ushur.atlassian.net/browse/UQR-13131
      // Deleting cells should remove legacy sections.
      return workflow.ui.sections;
    case WorkflowUpdateContextType.UPDATE_CELL:
      // updating cell
      return workflow.ui.sections;
    case WorkflowUpdateContextType.UPDATE_MODULE: {
      const { change } = context;

      modifySection(workflow, change as WorkflowUpdateModuleChange);

      return workflow.ui.sections;
    }
    case WorkflowUpdateContextType.REORDER_MODULES: {
      generateSectionsFromReorderedModules(workflow, context);
      return workflow.ui.sections;
    }
    case WorkflowUpdateContextType.ADD_MODULE: {
      generateSectionsFromNewModule(workflow, context);

      return workflow.ui.sections;
    }
    case WorkflowUpdateContextType.DEL_MODULE: {
      return generateSectionsWithoutDeletedModule(workflow, context);
    }
    default:
      throw new Error(`Unknown context: ${context.type as string}`);
  }
};
