/* eslint-disable max-depth */
/* eslint-disable complexity */
import { Workflow } from "../../../../api";
import {
  isFirstModuleInStep,
  getModuleIdToLegacySectionId,
  isWelcomeStep,
  hasMoreThanOneSection,
  findSectionByModuleIdOrFail,
  hasAtLeastOneModule,
  findStepOrFail,
  isLastModuleInStep,
} from "../../data/utils";
import { assertSectionsExistOrFail } from "../../data/validation";
import {
  WorkflowAddModuleChange,
  WorkflowUpdateContext,
} from "../../interfaces/api";
import NewModuleLinkerFactory from "./newModuleLinkerFactory";

export interface SectionGeneratorBase {
  create(workflow: Workflow, context: WorkflowUpdateContext): void;
}

const linkNewModuleFirstOrLastInStep = (
  workflow: Workflow,
  context: WorkflowUpdateContext
) => {
  const workflowToUpdate = workflow;
  const { step, module } = context.change as WorkflowAddModuleChange;
  const { id } = module;
  const { sections } = workflowToUpdate.ui;

  const { inboundStepsToCell, outboundStepsToCell } =
    context.diagrammingService?.getInboundAndOutboundStepsToCell(
      workflow,
      step
    ) ?? {
      inboundStepsToCell: [],
      outboundStepsToCell: [],
    };

  if (isFirstModuleInStep(step, module)) {
    for (const inBoundStep of inboundStepsToCell) {
      const foundStep = findStepOrFail(inBoundStep.id, workflow);

      if (!hasAtLeastOneModule(foundStep.modules)) {
        // No modules in this inbound step, nothing to link
        continue;
      }

      const lastModuleIx = foundStep.modules.length - 1;
      const lastModule = foundStep.modules[lastModuleIx];

      const foundSection = findSectionByModuleIdOrFail(lastModule.id, sections);

      const linkNewModuleGenerator = NewModuleLinkerFactory.create(module.type);
      linkNewModuleGenerator.create(workflowToUpdate, foundSection, {
        nextModule: module,
      });

      // if we are updating the first module in the welcome step, we need to update the routine
      if (isWelcomeStep(foundStep) && foundStep.modules.length === 1) {
        const workflowId = workflowToUpdate.id;
        workflowToUpdate.routines.Ushur_Initial_Routine.params.menuId = `${workflowId}_child_${getModuleIdToLegacySectionId(
          id
        )}`;
      }
    }
  }

  if (isLastModuleInStep(step, module)) {
    for (const outBoundStep of outboundStepsToCell) {
      const foundStep = findStepOrFail(outBoundStep.id, workflow);

      if (!hasAtLeastOneModule(foundStep.modules)) {
        // No modules in this inbound step, nothing to link
        continue;
      }

      const firstModule = foundStep.modules[0];

      const foundSection = findSectionByModuleIdOrFail(module.id, sections);

      const linkNewModuleGenerator = NewModuleLinkerFactory.create(module.type);
      linkNewModuleGenerator.create(workflowToUpdate, foundSection, {
        nextModule: firstModule,
      });
    }
  }
};

export const linkNewModule = (
  workflow: Workflow,
  context: WorkflowUpdateContext
) => {
  const workflowToUpdate = workflow;
  const { step, module } = context.change as WorkflowAddModuleChange;
  const { id } = module;
  const { sections } = workflowToUpdate.ui;

  assertSectionsExistOrFail(sections);

  // linking sections only makes sense if there are at least 2
  if (!hasMoreThanOneSection(sections)) {
    return;
  }

  if (isFirstModuleInStep(step, module)) {
    linkNewModuleFirstOrLastInStep(workflow, context);
    return;
  }
  if (isLastModuleInStep(step, module)) {
    linkNewModuleFirstOrLastInStep(workflow, context);
  }

  // Return if only one module, nothing else to link
  if (step.modules.length < 1) {
    return;
  }
  findSectionByModuleIdOrFail(module.id, sections);

  // Find previous module
  const currentModuleIx = step.modules.findIndex((m) => m.id === module.id);
  if (currentModuleIx === -1) {
    throw new Error("Can't find current module ix");
  }

  const previousModule = step.modules[currentModuleIx - 1];

  const previousSection = findSectionByModuleIdOrFail(
    previousModule.id,
    sections
  );

  const linkNewModuleGenerator = NewModuleLinkerFactory.create(module.type);
  linkNewModuleGenerator.create(workflow, previousSection, {
    nextModule: module,
  });

  // if welcome step has a 2nd module - we need to update the root routine
  if (isWelcomeStep(step) && step.modules[1].id === module.id) {
    const workflowId = workflowToUpdate.id;
    workflowToUpdate.routines.Ushur_Initial_Routine.params.menuId = `${workflowId}_child_${getModuleIdToLegacySectionId(
      id
    )}`;
  }
};
