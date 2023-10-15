/* eslint max-lines: ["error", 371] */
import { Workflow } from "../../../../api";
import {
  findSectionByModuleIdOrFail,
  findStepOrFail,
  hasAtLeastOneModule,
  hasMoreThanOneSection,
  isFirstModuleInStep,
  isWelcomeSection,
  isWelcomeStep,
  isLastModuleInStep,
  validateAndGetCommonWorkflowInfo,
} from "../../data/utils";
import { assertSectionsExistOrFail } from "../../data/validation";
import {
  WorkflowUpdateContext,
  WorkflowUpdateModuleChange,
  WorkflowUpdateContextType,
  WorkflowAddModuleChange,
} from "../../interfaces/api";
import AddModuleSubRootRequestFactory from "./addModuleSubRootRequestFactory";
import generateDelModuleSubRootRequest from "./generateSubrootDeleteRequest";
import generateReorderModulesRequest from "./generateSubrootReorderRequest";
import UpdateModuleSubRootRequestFactory from "./updateModuleSubRootRequestFactory";

const generateUpdateModuleSubRootRequest = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const { sections } = validateAndGetCommonWorkflowInfo(workflow);
  const { module } = context.change as WorkflowUpdateModuleChange;

  // Ignore the Welcome module since it is only updated in the root JSON
  if (isWelcomeSection(module.id, sections)) {
    return [];
  }

  const sectionToUpdate = findSectionByModuleIdOrFail(module.id, sections);

  const updater = UpdateModuleSubRootRequestFactory.create(module.type);
  const update = updater.create(workflow, sectionToUpdate, module);
  return [update];
};

// eslint-disable-next-line complexity
const generateAddModuleSubRootRequestForFirstOrLastModuleInStep = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const { sections } = validateAndGetCommonWorkflowInfo(workflow);
  const { module, step } = context.change as WorkflowAddModuleChange;
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
    const update = updater.create(workflow, foundSection, module);
    updates.push(update);
  }

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

  // Now find and generate the new section
  const currentSection = findSectionByModuleIdOrFail(module.id, sections);
  const addModuleGenerator = AddModuleSubRootRequestFactory.create(module.type);
  const addInfo = addModuleGenerator.create(
    workflow,
    currentSection,
    {
      nextModules: outboundModules,
    },
    module
  );
  updates.push(addInfo);

  return updates;
};

const generateAddModuleSubRootRequest = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const { sections } = validateAndGetCommonWorkflowInfo(workflow);

  assertSectionsExistOrFail(sections);

  // linking SubRoot modules only makes sense if there are at least 2
  if (!hasMoreThanOneSection(sections)) {
    return [];
  }

  const { module, step } = context.change as WorkflowAddModuleChange;

  const updates: object[] = [];

  if (isFirstModuleInStep(step, module)) {
    return generateAddModuleSubRootRequestForFirstOrLastModuleInStep(
      workflow,
      context
    );
  }
  if (isLastModuleInStep(step, module)) {
    updates.push(
      ...generateAddModuleSubRootRequestForFirstOrLastModuleInStep(
        workflow,
        context
      )
    );
  }

  // At this point there should be at least 2 modules

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

  // Create a Sub-Root request to with an updated previous section.
  const updater = UpdateModuleSubRootRequestFactory.create(previousModule.type);
  const update = updater.create(workflow, previousSection, previousModule);
  updates.push(update);

  return updates;
};

const generateSubRootModulesRequest = (
  workflow: Workflow,
  context: WorkflowUpdateContext
): object[] => {
  const subRootRequestMap = {
    // This only affects the root SubJson, so nothing to do
    [WorkflowUpdateContextType.ADD_CELLS]: () => [],
    // TODO: https://ushur.atlassian.net/browse/UQR-13131
    [WorkflowUpdateContextType.DEL_CELLS]: () => [],
    [WorkflowUpdateContextType.UPDATE_CELL]: () => [],
    [WorkflowUpdateContextType.UPDATE_PUBLISH]: () => [],
    [WorkflowUpdateContextType.UPDATE_MODULE]: () =>
      generateUpdateModuleSubRootRequest(workflow, context),
    [WorkflowUpdateContextType.REORDER_MODULES]: () =>
      generateReorderModulesRequest(workflow, context),
    [WorkflowUpdateContextType.ADD_MODULE]: () =>
      generateAddModuleSubRootRequest(workflow, context),
    [WorkflowUpdateContextType.DEL_MODULE]: () =>
      generateDelModuleSubRootRequest(workflow, context),
  };

  if (subRootRequestMap[context.type]) {
    return subRootRequestMap[context.type]();
  }

  throw new Error(`Unknown operation: ${context.type}`);
};

export default generateSubRootModulesRequest;
