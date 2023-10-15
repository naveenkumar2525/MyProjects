import { LegacyMessageModuleSection, WorkflowStep } from "../../../../../api";
import canvasFactory from "../../../../../mocks/factories/canvas";
import canvasLinkFactory from "../../../../../mocks/factories/canvasLink";
import canvasSectionFactory from "../../../../../mocks/factories/canvasSection";
import messageModuleFactory from "../../../../../mocks/factories/messageModule";
import { getModuleIdToLegacySectionId } from "../../../data/utils";

export const mockMessageModulePassString = JSON.stringify({
  module: "promptmessage",
  iAppProps: {
    centerAlign: false,
    hideResponse: false,
    toggleResponse: false,
    optionalResponse: false,
    typePassword: false,
    multiSelectOptions: false,
    locSearchLabel: "Home Location",
    enableHTML: "No",
  },
});

export const createMockWorkflowWithWelcomeStepSingleModule = () => {
  const workflow = canvasFactory.transient({ numSteps: 1 }).build();
  const step = workflow.ui.cells[0] as WorkflowStep;
  const module = messageModuleFactory.build();
  const section = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(module.id),
    sectionType: "welcome",
  });
  workflow.ui.sections = [section];
  step.modules?.push(module);

  return {
    workflow,
    step,
    module,
    section,
  };
};

export const createMockWorkflowWithOneStepAndTwoUnlinkedMessageModules = () => {
  const workflow = canvasFactory.transient({ numSteps: 1 }).build();
  const step = workflow.ui.cells[0] as WorkflowStep;
  const modules = messageModuleFactory.buildList(2);
  const sections = canvasSectionFactory.buildList(2);
  sections[0].uid = getModuleIdToLegacySectionId(modules[0].id);
  sections[1].uid = getModuleIdToLegacySectionId(modules[1].id);
  workflow.ui.sections = sections;
  step.modules = modules;

  return {
    workflow,
    step,
    modules,
    sections: sections as LegacyMessageModuleSection[],
  };
};

export const createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule = () => {
  const workflow = canvasFactory.transient({ numSteps: 2 }).build();
  const step1 = workflow.ui.cells[0] as WorkflowStep;
  const step2 = workflow.ui.cells[1] as WorkflowStep;
  const modules1 = messageModuleFactory.buildList(2);
  const modules2 = messageModuleFactory.buildList(1);
  const sections = canvasSectionFactory.buildList(3);
  const step1MessageModuleSection1 = sections[0];
  const step1MessageModuleSection2 = sections[1];
  const step2MessageModuleSection1 = sections[2];
  step1MessageModuleSection1.uid = getModuleIdToLegacySectionId(modules1[0].id);
  step1MessageModuleSection2.uid = getModuleIdToLegacySectionId(modules1[1].id);
  step2MessageModuleSection1.uid = getModuleIdToLegacySectionId(modules2[0].id);
  workflow.ui.sections = sections;
  step1.modules = modules1;
  step2.modules = modules2;

  return {
    workflow,
    step1,
    step2,
    modules1,
    modules2,
    sections: sections as LegacyMessageModuleSection[],
  };
};

export const createMockWorkflowWithLinkedSteps = (numOfModules = 2) => {
  const workflow = canvasFactory.transient({ numSteps: 2 }).build();

  const step1 = workflow.ui.cells[0] as WorkflowStep;
  const step2 = workflow.ui.cells[1] as WorkflowStep;
  const link = canvasLinkFactory.build();
  link.source.id = step1.id;
  link.target.id = step2.id;
  workflow.ui.cells.push(link);
  const modules1 = messageModuleFactory.buildList(numOfModules);
  const modules2 = messageModuleFactory.buildList(numOfModules);
  const sections = canvasSectionFactory.buildList(numOfModules * 2);
  sections[0].sectionType = "welcome";
  for (let sectionIx = 0; sectionIx < modules1.length; sectionIx += 1) {
    const messageModuleSection = sections[
      sectionIx
    ] as LegacyMessageModuleSection;
    messageModuleSection.uid = getModuleIdToLegacySectionId(
      modules1[sectionIx].id
    );
    const text = `step1: ${modules1[sectionIx].text}-${sectionIx}`;
    modules1[sectionIx].text = text;
    messageModuleSection.message = text;
  }

  for (let sectionIx2 = 0; sectionIx2 < modules2.length; sectionIx2 += 1) {
    const messageModuleSection = sections[
      sectionIx2 + modules1.length
    ] as LegacyMessageModuleSection;
    messageModuleSection.uid = getModuleIdToLegacySectionId(
      modules2[sectionIx2].id
    );
    const text = `step2: ${modules2[sectionIx2].text}-${sectionIx2}`;
    modules2[sectionIx2].text = text;
    messageModuleSection.message = text;
  }
  // Link sections
  for (let sectionIx = 0; sectionIx < sections.length; sectionIx += 1) {
    const messageModuleSection = sections[
      sectionIx
    ] as LegacyMessageModuleSection;
    if (sectionIx !== sections.length - 1) {
      messageModuleSection.jump.jump = sections[sectionIx + 1].uid;
    }
  }
  workflow.ui.sections = sections;

  step1.modules = modules1;
  step2.modules = modules2;

  return {
    workflow,
    step1,
    step2,
    modules1,
    modules2,
    sections: sections as LegacyMessageModuleSection[],
  };
};

export const mockIAppProps = {
  centerAlign: false,
  hideResponse: false,
  toggleResponse: false,
  optionalResponse: false,
  typePassword: false,
  multiSelectOptions: false,
  locSearchLabel: "Home Location",
  enableHTML: "No",
};

export const mockAdditionalDetailsDefault = {
  activated: false,
  details: [
    {
      order: "0",
      title: "",
      content: "",
      image: "",
      link: "",
    },
  ],
};
