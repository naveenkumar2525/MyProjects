import { LegacyMessageModuleSection, Workflow } from "../../../../api";
import {
  findModuleIndexOrFail,
  findSectionByModuleIdOrFail,
  findStepOrFail,
  hasAtLeastOneModule,
  validateAndGetCommonWorkflowInfo,
} from "../../data/utils";
import { assertSectionsExistOrFail } from "../../data/validation";
import {
  WorkflowUpdateContext,
  WorkflowDelModuleChange,
} from "../../interfaces/api";
import UpdateModuleSubRootRequestFactory from "./updateModuleSubRootRequestFactory";

const generateDelModuleSubRootRequestForInBoundSteps = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const workflowToUpdate = workflow;
  const { module, step } = context.change as WorkflowDelModuleChange;
  const { sections } = validateAndGetCommonWorkflowInfo(workflowToUpdate);

  const updates: object[] = [];

  // Find any other steps pointing to the current step.
  const { inboundStepsToCell } =
    context.diagrammingService?.getInboundAndOutboundStepsToCell(
      workflowToUpdate,
      step
    ) ?? {
      inboundStepsToCell: [],
      outboundStepsToCell: [],
    };

  for (const inBoundStep of inboundStepsToCell) {
    const foundStep = findStepOrFail(inBoundStep.id, workflowToUpdate);

    if (!hasAtLeastOneModule(foundStep.modules)) {
      // No modules in this inbound step, nothing to do
      continue;
    }

    // This should be the last module in that step
    const lastModuleIx = foundStep.modules.length - 1;
    const lastModule = foundStep.modules[lastModuleIx];

    const foundSection = findSectionByModuleIdOrFail(lastModule.id, sections);

    const updater = UpdateModuleSubRootRequestFactory.create(module.type);
    const update = updater.create(workflowToUpdate, foundSection);
    updates.push(update);
  }

  return updates;
};

const generateDelModuleSubRootRequest = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const workflowToUpdate = workflow;

  const { sections } = validateAndGetCommonWorkflowInfo(workflowToUpdate);

  assertSectionsExistOrFail(sections);

  const { module, step, originalWorkflow } =
    context.change as WorkflowDelModuleChange;
  const updates: object[] = [];

  const sectionToDelete = findSectionByModuleIdOrFail(
    module.id,
    originalWorkflow.ui.sections
  );

  const inboundUpdates = generateDelModuleSubRootRequestForInBoundSteps(
    workflow,
    context
  );

  if (inboundUpdates.length) {
    updates.push(...inboundUpdates);
  }

  // If this is not the first module in the step, update the previous module in the step
  const originalStep = findStepOrFail(step.id, originalWorkflow);
  if (
    hasAtLeastOneModule(step.modules) &&
    originalStep.modules[0].id !== module.id
  ) {
    // Find the module index from original workflow step.
    const currentModuleIx = findModuleIndexOrFail(
      module.id,
      originalStep.modules
    );
    const previousModule = originalStep.modules[currentModuleIx - 1];
    const previousSection = findSectionByModuleIdOrFail(
      previousModule.id,
      sections
    );
    const updater = UpdateModuleSubRootRequestFactory.create(module.type);
    const update = updater.create(workflow, previousSection);
    updates.push(update);
  }

  if (
    `${workflowToUpdate.id}_child_${sectionToDelete.uid}` ===
    workflowToUpdate.routines.Ushur_Initial_Routine.params.menuId
  ) {
    // Ah deleting the root routine's child SubRoot
    // Jump to wherever the section to be deleted was jumping
    const legacyMessageModule = sectionToDelete as LegacyMessageModuleSection;
    const { jump } = legacyMessageModule.jump;

    workflowToUpdate.routines.Ushur_Initial_Routine.params.menuId = `${workflow.id}_child_${jump}`;
  }

  // Now create a delete request for the module
  const deleteModuleRequest = {
    cmd: "deleteModule",
    campaignId: `${workflowToUpdate.id}_child_section_${module.id}`,
  };

  updates.push(deleteModuleRequest);

  return updates;
};

export default generateDelModuleSubRootRequest;
