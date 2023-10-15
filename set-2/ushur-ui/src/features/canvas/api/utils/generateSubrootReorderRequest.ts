import { Workflow, WorkflowStep } from "../../../../api";
import {
  findSectionByModuleIdOrFail,
  findStepOrFail,
  hasAtLeastOneModule,
  hasMoreThanOneSection,
  isFirstModuleInStep,
  isWelcomeStep,
  isLastModuleInStep,
  validateAndGetCommonWorkflowInfo,
  getModuleIdToLegacySectionId,
  findModuleIndexOrFail,
} from "../../data/utils";
import { assertSectionsExistOrFail } from "../../data/validation";
import {
  WorkflowUpdateContext,
  WorkflowUpdateContextType,
  WorkflowAddModuleChange,
  WorkflowConfigureModulesChange,
} from "../../interfaces/api";
import UpdateModuleSubRootRequestFactory from "./updateModuleSubRootRequestFactory";

const generateReorderModuleSubRootRequestForInboundSteps = (
  workflow: Workflow,
  inboundStepsToCell: WorkflowStep[],
  context: WorkflowUpdateContext
): object[] => {
  const { sections } = validateAndGetCommonWorkflowInfo(workflow);
  const { module } = context.change as WorkflowAddModuleChange;
  const updates: object[] = [];

  for (const inBoundStep of inboundStepsToCell) {
    const foundStep = findStepOrFail(inBoundStep.id, workflow);

    if (!hasAtLeastOneModule(foundStep.modules)) {
      // No modules in this inbound step, nothing to link
      continue;
    }

    if (isWelcomeStep(foundStep) && foundStep.modules.length === 1) {
      // the first module for the welcome step is part of the root json
      // so don't update any SubRoot json here since it is already done elsewhere
      continue;
    }

    // This should be the last module in that step
    const lastModuleIx = foundStep.modules.length - 1;
    const lastModule = foundStep.modules[lastModuleIx];

    const foundSection = findSectionByModuleIdOrFail(lastModule.id, sections);

    const updater = UpdateModuleSubRootRequestFactory.create(module.type);
    const update = updater.create(workflow, foundSection);
    updates.push(update);
  }

  return updates;
};

const generateReorderModuleSubRootRequestForOutboundSteps = (
  workflow: Workflow,
  outboundStepsToCell: WorkflowStep[],
  context: WorkflowUpdateContext
): object[] => {
  const { sections } = validateAndGetCommonWorkflowInfo(workflow);
  const { module } = context.change as WorkflowAddModuleChange;
  const updates: object[] = [];
  const outboundModules = [];
  for (const outBoundStep of outboundStepsToCell) {
    const foundStep = findStepOrFail(outBoundStep.id, workflow);

    if (!hasAtLeastOneModule(foundStep.modules)) {
      // No modules in this inbound step, nothing to link
      continue;
    }

    const firstModule = foundStep.modules[0];
    outboundModules.push(firstModule);
  }

  if (outboundModules.length) {
    const currentSection = findSectionByModuleIdOrFail(module.id, sections);
    const updater = UpdateModuleSubRootRequestFactory.create(module.type);
    const update = updater.create(workflow, currentSection);
    updates.push(update);
  } else {
    // Nothing outbound, update the current module to point to the end of the workflow
    const currentSection = findSectionByModuleIdOrFail(module.id, sections);
    const updater = UpdateModuleSubRootRequestFactory.create(module.type);
    const update = updater.create(workflow, currentSection);
    updates.push(update);
  }

  return updates;
};

const generateReorderModuleSubRootRequestForFirstOrLastModuleInStep = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const { step } = context.change as WorkflowAddModuleChange;
  const updates: object[] = [];

  // Find any other steps pointing to the current step.
  const { inboundStepsToCell, outboundStepsToCell } =
    context.diagrammingService?.getInboundAndOutboundStepsToCell(
      workflow,
      step
    ) ?? {
      inboundStepsToCell: [],
      outboundStepsToCell: [],
    };

  updates.push(
    ...generateReorderModuleSubRootRequestForInboundSteps(
      workflow,
      inboundStepsToCell,
      context
    )
  );

  updates.push(
    ...generateReorderModuleSubRootRequestForOutboundSteps(
      workflow,
      outboundStepsToCell,
      context
    )
  );

  return updates;
};

const generateReorderModuleSubRootRequest = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const workflowToUpdate = workflow;
  const { sections } = validateAndGetCommonWorkflowInfo(workflow);

  assertSectionsExistOrFail(sections);

  // linking SubRoot modules only makes sense if there are at least 2
  if (!hasMoreThanOneSection(sections)) {
    return [];
  }

  const { module, step } = context.change as WorkflowAddModuleChange;

  const updates: object[] = [];

  if (isFirstModuleInStep(step, module)) {
    return generateReorderModuleSubRootRequestForFirstOrLastModuleInStep(
      workflow,
      context
    );
  }
  if (isLastModuleInStep(step, module)) {
    updates.push(
      ...generateReorderModuleSubRootRequestForFirstOrLastModuleInStep(
        workflow,
        context
      )
    );
  }

  // At this point there should be at least 2 modules

  // if welcome step has a 2nd module - we need to update the root routine
  if (isWelcomeStep(step) && step.modules[1].id === module.id) {
    workflowToUpdate.routines.Ushur_Initial_Routine.params.menuId = `${
      workflowToUpdate.id
    }_child_${getModuleIdToLegacySectionId(module.id)}`;
  }
  // Find previous module
  const currentModuleIx = findModuleIndexOrFail(module.id, step.modules);

  const previousModule = step.modules[currentModuleIx - 1];

  const previousSection = findSectionByModuleIdOrFail(
    previousModule.id,
    sections
  );

  const updater = UpdateModuleSubRootRequestFactory.create(module.type);
  const update = updater.create(workflow, previousSection);
  updates.push(update);

  return updates;
};

const generateReorderModulesRequest = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const { modules, step } = context.change as WorkflowConfigureModulesChange;

  const { sections } = validateAndGetCommonWorkflowInfo(workflow);

  if (sections.length < 2) {
    throw new Error("Unexpected sections of length < 2");
  }

  const updates = [];

  for (const module of modules) {
    const updateContext: WorkflowUpdateContext = {
      type: WorkflowUpdateContextType.UPDATE_MODULE,
      diagrammingService: context.diagrammingService,
      change: {
        step,
        module,
      },
    };
    const updateInfo = generateReorderModuleSubRootRequest(
      workflow,
      updateContext
    );
    updates.push(...updateInfo);
  }

  return updates;
};

export default generateReorderModulesRequest;
