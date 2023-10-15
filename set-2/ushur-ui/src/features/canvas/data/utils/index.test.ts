import {
  findLegacySection,
  findLegacyUeTag,
  findModule,
  findStep,
  getModuleIdToLegacySectionId,
  insertOrUpdateModule,
  isWelcomeStep,
} from ".";
import {
  MessageModule,
  WorkflowAttributesLabel,
  WorkflowStep,
} from "../../../../api";
import canvasFactory from "../../../../mocks/factories/canvas";
import canvasSectionFactory from "../../../../mocks/factories/canvasSection";
import messageModuleFactory from "../../../../mocks/factories/messageModule";
import ModuleTypes from "../../interfaces/module-types";

describe("findStep", () => {
  test("should not find a non-existent step", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.build();

    // Act
    const step = findStep(999999, canvasWorkflow);

    // Assert
    expect(step).not.toBeDefined();
  });

  test("should find an existing step", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const stepId = canvasWorkflow.ui.cells[0].id;

    // Act
    const step = findStep(stepId, canvasWorkflow);

    // Assert
    expect(step).toBeDefined();
  });

  test("should not find an existing link", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const stepId = canvasWorkflow.ui.cells[0].id;
    // Change the cell to a link.
    canvasWorkflow.ui.cells[0].type = "app.Link";

    // Act
    const step = findStep(stepId, canvasWorkflow);

    // Assert
    expect(step).not.toBeDefined();
  });
});

describe("findModule", () => {
  test("should not find a non-existent module", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const canvasStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
    canvasStep.modules?.push(messageModuleFactory.build());

    // Act
    const module = findModule("someModule", canvasStep.modules);

    // Assert
    expect(module).not.toBeDefined();
  });

  test("should find an existing module", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const canvasStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
    canvasStep.modules?.push(messageModuleFactory.build());
    const module = canvasStep.modules?.[0];

    // Act
    const foundModule = findModule(module.id, canvasStep.modules);

    // Assert
    expect(foundModule).toBeDefined();
  });
});

describe("insertOrUpdateModule", () => {
  test("should add a new module when it doesn't exist", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const canvasStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
    canvasStep.modules?.push(messageModuleFactory.build());
    const { modules } = canvasStep;
    const newModule: MessageModule = {
      id: "someId",
      type: ModuleTypes.MESSAGE_MODULE,
      title: "someTitle",
      text: "someText",
    };

    // Act
    insertOrUpdateModule("someModule", canvasStep.modules, newModule);

    // Assert
    expect(canvasStep.modules).toHaveLength(2);
    expect(canvasStep.modules).toEqual([modules[0], newModule]);
  });

  test("should update an existing module if it exists", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const canvasStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
    const module = messageModuleFactory.build();
    canvasStep.modules?.push(module);
    const newModule: MessageModule = {
      id: module.id,
      type: ModuleTypes.MESSAGE_MODULE,
      title: "someTitle",
      text: "modified title",
    };

    // Act
    insertOrUpdateModule(module.id, canvasStep.modules, newModule);

    // Assert
    expect(canvasStep.modules).toHaveLength(1);
    expect(canvasStep.modules).toEqual([
      {
        id: module.id,
        text: newModule.text,
        title: newModule.title,
        type: ModuleTypes.MESSAGE_MODULE,
      },
    ]);
  });
});

describe("findLegacySection", () => {
  test("should return undefined for a non-existent legacy section", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    canvasWorkflow.ui.sections = canvasSectionFactory.buildList(1);

    // Act
    const module = findLegacySection("someModule", canvasWorkflow);

    // Assert
    expect(module).not.toBeDefined();
  });

  test("should find an existing legacy section", () => {
    // Arrange

    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    canvasWorkflow.ui.sections = canvasSectionFactory.buildList(1);
    const sectionType = canvasWorkflow.ui.sections[0].sectionType as string;

    // Act
    const section = findLegacySection(sectionType, canvasWorkflow);

    // Assert
    expect(section).toBeDefined();
  });
});

describe("isWelcomeStep  ", () => {
  test("should be false when it is not a welcome step", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const canvasStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
    const canvasLabel = canvasStep.attrs?.label as WorkflowAttributesLabel;
    canvasLabel.text = "something else";

    // Act
    const module = isWelcomeStep(canvasStep);

    // Assert
    expect(module).toBeDefined();
  });

  test("should be true when it is a welcome step", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const canvasStep = canvasWorkflow.ui.cells[0] as WorkflowStep;

    // Act
    const module = isWelcomeStep(canvasStep);

    // Assert
    expect(module).toBeDefined();
  });
});

describe("findLegacyUeTag", () => {
  test("should not find the UeTag structure for a non-existent tag structure", () => {
    // Arrange
    let module = findLegacyUeTag(undefined, "foo");
    expect(module).not.toBeDefined();

    // Act
    module = findLegacyUeTag({}, "foo");
    // Assert
    expect(module).not.toBeDefined();

    // Act
    module = findLegacyUeTag({ result: [] }, "foo");
    // Assert
    expect(module).not.toBeDefined();
  });

  test("should not find the UeTag structure for a non-existent tag", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();

    // Act
    const module = findLegacyUeTag(canvasWorkflow.ui.UeTagStructure, "foo");

    // Assert
    expect(module).not.toBeDefined();
  });

  test("should find the UeTag structure for a an-existent tag", () => {
    // Arrange
    const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
    const ueTag = canvasWorkflow.ui.UeTagStructure?.result?.[0].UeTag;

    // Act
    const module = findLegacyUeTag(canvasWorkflow.ui.UeTagStructure, ueTag);

    // Assert
    expect(module).toBeDefined();
  });
});

test("getModuleIdToLegacySectionId", () => {
  // Arrange
  const moduleId = "someModuleId";

  // Act
  const result = getModuleIdToLegacySectionId(moduleId);

  // Assert
  expect(result).toBe("section_someModuleId");
});
