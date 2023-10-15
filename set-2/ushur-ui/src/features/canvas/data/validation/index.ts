import { notifyToast } from "@ushurengg/uicomponents";
import { Workflow, WorkflowStep } from "../../../../api";
import { LegacyModuleSection } from "../../interfaces/api";
import { DiagramCellId } from "../../interfaces/diagramming-service";
import ModuleTypes from "../../interfaces/module-types";
import { findStep, isWelcomeStep } from "../utils";

export const notifyFunctionalityComingSoon = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  notifyToast({
    variant: "warning",
    text: "Note",
    subText: "Coming soon: This functionality is under construction.",
    animation: true,
  });
};

export const stepHasOnlyMessageModules = (step: WorkflowStep) => {
  if (!step) {
    throw new Error("Expecting a step");
  }
  const { modules } = step;
  for (const module of modules) {
    if (module.type !== ModuleTypes.MESSAGE_MODULE) {
      return false;
    }
  }
  return true;
};

export const workflowHasOnlyMessageModules = (workflow: Workflow | null) => {
  if (!workflow) {
    throw new Error("Expecting a workflow");
  }
  const { cells } = workflow.ui;
  for (const cell of cells) {
    if (cell.type !== "app.Step") {
      continue;
    }
    const step = cell as WorkflowStep;
    if (!stepHasOnlyMessageModules(step)) {
      return false;
    }
  }
  return true;
};

export const assertSectionsExistOrFail = (sections: LegacyModuleSection[]) => {
  if (sections.length === 0) {
    throw new Error("Unexpected sections of length 0");
  }
};

export const attemptingToSwapFirstWelcomeStepModule = (
  step: WorkflowStep | undefined,
  moduleIndexes: {
    source: number;
    destination: number;
  }
) => {
  if (!step) {
    throw new Error("Expecting step to exist");
  }
  if (
    step &&
    isWelcomeStep(step) &&
    (moduleIndexes.source === 0 || moduleIndexes.destination === 0)
  ) {
    return true;
  }
  return false;
};

export const areModulesSwappable = (
  currentSelectedCellId: DiagramCellId | null,
  workflow: Workflow | null,
  moduleIndexes: {
    source: number;
    destination: number;
  }
) => {
  if (moduleIndexes.destination === moduleIndexes.source) return false;
  const step = findStep(currentSelectedCellId, workflow);

  if (attemptingToSwapFirstWelcomeStepModule(step, moduleIndexes)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    notifyToast({
      variant: "warning",
      text: "Note",
      subText: "The first Welcome step module cannot be reordered.",
      animation: true,
    });
    return false;
  }
  if (!workflowHasOnlyMessageModules(workflow)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    notifyToast({
      variant: "warning",
      text: "Note",
      subText:
        // eslint-disable-next-line max-len
        "Coming Soon: The current workflow has modules other than message modules. Support for reordering different types of modules is coming in the near future.",
      animation: true,
    });
    return false;
  }

  return true;
};

export const toastNotify = (subText: string): unknown =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  notifyToast({
    variant: "warning",
    text: "Note",
    subText: `${subText}`,
    animation: true,
  });
