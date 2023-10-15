import { cloneDeep } from "lodash";
import { LegacyMessageModuleSection, WorkflowStep } from "../../../../api";
import { getEndOfCampaignJump } from "../../data/utils";
import JointJsDiagrammingService from "../../diagramming/jointjs/services/jointjs-diagramming-service";
import {
  WorkflowUpdateContext,
  WorkflowUpdateContextType,
} from "../../interfaces/api";
import ModuleTypes from "../../interfaces/module-types";
import { generateSections, generateWelcomeSection } from "./generateSections";
import {
  createMockWorkflowWithOneStepAndTwoUnlinkedMessageModules,
  createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule,
  createMockWorkflowWithWelcomeStepSingleModule,
} from "./mocks";
import NewModuleLinkerFactory from "./newModuleLinkerFactory";
import { linkNewModule } from "./sectionGeneratorBase";

test("NewModuleLinkerFactory", () => {
  // Arrange
  const moduleType = ModuleTypes.MESSAGE_MODULE;
  const { workflow, modules, sections } =
    createMockWorkflowWithOneStepAndTwoUnlinkedMessageModules();

  const clonedWorkflow = cloneDeep(workflow);

  // Act
  const legacyLinker = NewModuleLinkerFactory.create(moduleType);

  legacyLinker.create(clonedWorkflow, sections[0], {
    nextModule: modules[1],
  });

  // Assert

  // the first section should link to the 2nd section
  const expectedWorkflow = cloneDeep(workflow);
  const firstSection = expectedWorkflow.ui
    .sections[0] as LegacyMessageModuleSection;
  const secondSection = expectedWorkflow.ui
    .sections[1] as LegacyMessageModuleSection;
  firstSection.jump = cloneDeep(secondSection.jump);

  expect(clonedWorkflow).toEqual(expectedWorkflow);
});

test("NewUnimplementedModuleLinker", () => {
  // Arrange
  // Attempt to link the AI_MODULE which is not yet implemented
  const moduleType = ModuleTypes.AI_MODULE;
  const { workflow, modules, sections } =
    createMockWorkflowWithOneStepAndTwoUnlinkedMessageModules();

  const clonedWorkflow = cloneDeep(workflow);

  // Act

  const legacyLinker = NewModuleLinkerFactory.create(moduleType);

  legacyLinker.create(clonedWorkflow, sections[0], {
    nextModule: modules[1],
  });

  // Assert

  // There should be no change
  expect(clonedWorkflow).toEqual(workflow);
});

test("link a new module in the same step", () => {
  // Arrange
  const { workflow, modules } =
    createMockWorkflowWithOneStepAndTwoUnlinkedMessageModules();

  const clonedWorkflow = cloneDeep(workflow);

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService: undefined,
    change: {
      step: clonedWorkflow.ui.cells[0] as WorkflowStep,
      module: modules[1],
    },
  };

  // Act
  linkNewModule(clonedWorkflow, context);

  // Assert

  const expectedWorkflow = cloneDeep(workflow);
  // the first section should link to the 2nd section
  const firstSection = expectedWorkflow.ui
    .sections[0] as LegacyMessageModuleSection;
  const secondSection = expectedWorkflow.ui
    .sections[1] as LegacyMessageModuleSection;
  firstSection.jump.jump = secondSection.uid;
  firstSection.jump.jumpText = "";

  // The welcome module routine should link to the 2nd module
  const menuId = `${expectedWorkflow.id}_child_${secondSection.uid}`;
  expectedWorkflow.routines.Ushur_Initial_Routine.params.menuId = menuId;

  expect(clonedWorkflow).toEqual(expectedWorkflow);
});

test("link a new module between two steps", () => {
  // Arrange
  // create a linker for a module not yet implemented.
  const { workflow, step2, modules2 } =
    createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule();

  const clonedWorkflow = cloneDeep(workflow);

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService: undefined,
    change: {
      step: step2,
      module: modules2[0],
    },
  };

  // Act
  linkNewModule(clonedWorkflow, context);

  // Assert

  const expectedWorkflow = cloneDeep(workflow);

  expect(clonedWorkflow).toEqual(expectedWorkflow);
});

test("link a module with no inbound steps", () => {
  // Arrange
  // create a linker for a module not yet implemented.
  const { workflow, step2, modules2 } =
    createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule();

  const clonedWorkflow = cloneDeep(workflow);

  jest.spyOn(global.document, "querySelector").mockResolvedValue([] as never);

  const diagrammingService = new JointJsDiagrammingService({
    canvas: ".canvas",
    toolbar: ".toolbar-container",
    paper: ".paper-container",
  });

  jest
    .spyOn(diagrammingService, "getInboundAndOutboundStepsToCell")
    .mockReturnValue({ inboundStepsToCell: [], outboundStepsToCell: [] });

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService,
    change: {
      step: step2,
      module: modules2[0],
    },
  };

  // Act
  linkNewModule(clonedWorkflow, context);

  // Assert

  const expectedWorkflow = cloneDeep(workflow);

  expect(clonedWorkflow).toEqual(expectedWorkflow);
});

test("link a module with inbound steps", () => {
  // Arrange
  // create a linker for a module not yet implemented.
  const { workflow, step1, step2, modules2, sections } =
    createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule();

  const clonedWorkflow = cloneDeep(workflow);

  jest.spyOn(global.document, "querySelector").mockResolvedValue([] as never);

  const diagrammingService = new JointJsDiagrammingService({
    canvas: ".canvas",
    toolbar: ".toolbar-container",
    paper: ".paper-container",
  });

  jest
    .spyOn(diagrammingService, "getInboundAndOutboundStepsToCell")
    .mockReturnValue({ inboundStepsToCell: [step1], outboundStepsToCell: [] });

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService,
    change: {
      step: step2,
      module: modules2[0],
    },
  };

  // Act
  linkNewModule(clonedWorkflow, context);

  // Assert

  const expectedWorkflow = cloneDeep(workflow);
  // Previous message module section should be linked to the new one
  const previousMessageModuleSection = expectedWorkflow.ui
    .sections[1] as LegacyMessageModuleSection;
  const newSection = sections[sections.length - 1];
  previousMessageModuleSection.jump.jump = newSection.uid;
  previousMessageModuleSection.jump.jumpText = "";

  expect(clonedWorkflow).toEqual(expectedWorkflow);
});

test("link a module with outbound steps", () => {
  // Arrange
  // create a linker for a module not yet implemented.
  const { workflow, step1, step2, modules2 } =
    createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule();

  const clonedWorkflow = cloneDeep(workflow);

  jest.spyOn(global.document, "querySelector").mockResolvedValue([] as never);

  const diagrammingService = new JointJsDiagrammingService({
    canvas: ".canvas",
    toolbar: ".toolbar-container",
    paper: ".paper-container",
  });

  jest
    .spyOn(diagrammingService, "getInboundAndOutboundStepsToCell")
    .mockReturnValue({ inboundStepsToCell: [], outboundStepsToCell: [step1] });

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService,
    change: {
      step: step2,
      module: modules2[0],
    },
  };

  // Act
  linkNewModule(clonedWorkflow, context);

  // Assert

  const expectedWorkflow = cloneDeep(workflow);
  // New section should link to the outbound section
  const newSection = expectedWorkflow.ui
    .sections[2] as LegacyMessageModuleSection;
  const nextSection = expectedWorkflow.ui
    .sections[0] as LegacyMessageModuleSection;
  newSection.jump.jump = nextSection.uid;
  newSection.jump.jumpText = "";

  expect(clonedWorkflow).toEqual(expectedWorkflow);
});

test("generateWelcomeSection", () => {
  // Act
  const welcomeSection = generateWelcomeSection("someId", "some message");

  // Assert
  expect(welcomeSection).toEqual({
    uid: expect.any(String) as string,
    userTitle: "",
    note: "",
    UeTag: expect.any(String) as string,
    moduleIcon: "",
    position: { x: 546, y: 20 },
    sectionType: "welcome",
    onReturn: {
      UeTag: expect.any(String) as string,
      ...getEndOfCampaignJump(),
    },
    message: "some message",
    jump: getEndOfCampaignJump(),
  });
});

describe("generate sections for a new module", () => {
  test("adding a new module to the Welcome step", () => {
    // Arrange
    const { workflow, step, module } =
      createMockWorkflowWithWelcomeStepSingleModule();

    const context: WorkflowUpdateContext = {
      type: WorkflowUpdateContextType.ADD_MODULE,
      diagrammingService: undefined,
      change: {
        step,
        module,
      },
    };

    // Act
    const sections = generateSections(workflow, context);

    // Assert
    const expected = [
      {
        currentStep: "",
        uid: expect.any(String) as string,
        UeTag: expect.any(String) as string,
        userTitle: "",
        message: "",
        position: { x: 1900, y: 2280 },
        onReturn: {
          UeTag: expect.any(String) as string,
          jumpText: "End of workflow",
          jump: "**ENDCAMPAIGN**",
        },
        sectionType: "welcome",
        jump: { jumpText: "End of workflow", jump: "**ENDCAMPAIGN**" },
      },
      {
        uid: expect.any(String) as string,
        UeTag: expect.any(String) as string,
        sectionType: "message-module",
        jump: { jump: "**ENDCAMPAIGN**", jumpText: "End of workflow" },
        userTitle: "",
        isFormEntry: false,
        onReturn: {
          UeTag: "",
          jump: "**ENDCAMPAIGN**",
          jumpText: "End of workflow",
        },
        message: "some text",
        additionalDetails: {
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
        },
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
        UshurDescriptions: {},
        note: "",
        moduleIcon: "",
        attachment: "",
        hasManualPhrases: false,
        uliTopics: [],
        position: { x: 609.5, y: 20 },
      },
    ];

    expect(sections).toEqual(expected);
  });
});
