import { cloneDeep } from "lodash";
import {
  WorkflowUpdateContext,
  WorkflowUpdateContextType,
} from "../../interfaces/api";
import { generateSections } from "./generateSections";
import { createMockWorkflowWithLinkedSteps } from "./mocks";

describe("generate sections for a deleted module", () => {
  test("delete a module with links to/from other modules", () => {
    // Arrange
    const { workflow, step1, modules1, sections } =
      createMockWorkflowWithLinkedSteps();

    const originalSections = cloneDeep(sections);

    const context: WorkflowUpdateContext = {
      type: WorkflowUpdateContextType.DEL_MODULE,
      diagrammingService: undefined,
      change: {
        step: step1,
        module: modules1[1],
      },
    };

    // Act
    const updatedSections = generateSections(workflow, context);

    // Assert

    // sections should be re-linked
    const expected = [
      {
        ...originalSections[0],
        jump: {
          ...originalSections[0].jump,
          jump: originalSections[2].uid,
        },
      },
      {
        ...originalSections[2],
        jump: {
          ...originalSections[2].jump,
          jump: originalSections[3].uid,
        },
      },
      originalSections[3],
    ];

    expect(updatedSections).toEqual(expected);
  });
});
