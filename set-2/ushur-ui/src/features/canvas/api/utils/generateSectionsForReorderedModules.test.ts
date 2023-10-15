/* eslint-disable max-lines-per-function */
import { cloneDeep } from "lodash";
import {
  WorkflowUpdateContext,
  WorkflowUpdateContextType,
} from "../../interfaces/api";
import { generateSectionsFromReorderedModules } from "./generateSections";
import { createMockWorkflowWithLinkedSteps } from "./mocks";

describe("generateSectionsFromReorderedModules", () => {
  test("regenerate sections", () => {
    // Arrange
    const { workflow, step1, modules1, sections } =
      createMockWorkflowWithLinkedSteps(3);

    const origSections = cloneDeep(sections);

    const context: WorkflowUpdateContext = {
      type: WorkflowUpdateContextType.ADD_MODULE,
      diagrammingService: undefined,
      change: {
        step: step1,
        modules: modules1,
        source: 1,
        destination: 2,
      },
    };

    // Act
    const result = generateSectionsFromReorderedModules(
      cloneDeep(workflow),
      context
    );

    // Assert

    // The sections should be reordered
    const expectedReordering = [
      {
        ...origSections[0],
        jump: {
          jump: origSections[2].uid,
          jumpText: "End of workflow",
        },
      },
      {
        ...origSections[1],
        jump: {
          jump: origSections[3].uid,
          jumpText: "End of workflow",
        },
      },
      {
        ...origSections[2],
        jump: {
          jump: origSections[1].uid,
          jumpText: "End of workflow",
        },
      },
      origSections[3],
      origSections[4],
      origSections[5],
    ];

    expect(result[0]).toEqual(expectedReordering[0]);
    expect(result[1]).toEqual(expectedReordering[1]);
    expect(result[2]).toEqual(expectedReordering[2]);
    expect(result[3]).toEqual(expectedReordering[3]);
    expect(result[4]).toEqual(expectedReordering[4]);
    expect(result[5]).toEqual(expectedReordering[5]);
  });
});
