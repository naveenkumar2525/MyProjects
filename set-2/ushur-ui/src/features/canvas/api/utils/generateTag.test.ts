import canvasFactory from "../../../../mocks/factories/canvas";
import canvasSectionFactory from "../../../../mocks/factories/canvasSection";
import {
  generateUeTag,
  generateUeTagStructure,
  generateWelcomeUeTagStructure,
} from "./generateTag";

test("generateUeTag", () => {
  // Act
  const ueTag = generateUeTag();

  // Assert
  expect(ueTag).toHaveLength(12);
  const match = ueTag.match(/UeTag_\d\d\d\d\d\d$/);
  expect(match).toHaveLength(1);
  expect(match?.[0]).toBe(ueTag);
});

test("generateWelcomeUeTagStructure", () => {
  // Arrange
  const workflowId = "someWorkflowId";
  const ueTag = "someUeTag";
  const message = "someMessage";

  // Act
  const ueTagStructure = generateWelcomeUeTagStructure(
    workflowId,
    ueTag,
    message
  );

  // Assert
  expect(ueTagStructure).toEqual({
    result: [{ UeTag: ueTag, message }],
    ushurId: workflowId,
    tagCount: 1,
  });
});

test("generateUeTagStructure", () => {
  // Arrange
  // create a workflow with 1 step and section
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const workflowId = canvasWorkflow.id;
  canvasWorkflow.ui.sections = canvasSectionFactory.buildList(1);

  // Act
  const ueTagStructure = generateUeTagStructure(
    workflowId,
    canvasWorkflow.ui.sections
  );

  // Assert
  expect(ueTagStructure).toEqual({
    result: [{ UeTag: canvasWorkflow.ui.sections[0].UeTag, message: "" }],
    ushurId: canvasWorkflow.id,
    tagCount: canvasWorkflow.ui.cells.length,
  });
});
