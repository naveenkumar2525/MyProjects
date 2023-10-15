import canvasReducer from "./canvasSlice";
import { CanvasState } from "../interfaces/data/canvasState";

describe("Canvas reducers", () => {
  const state: CanvasState = {
    workflowDetails: null,
    moduleDetails: null,
    selectedCellId: null,
    isInspectorOpened: false,
    diagrammingService: undefined,
    selectedModule: null,
    isPublished: false,
    workflowVariables: null,
    initUshurResponse: null,
    continueUshurResponse: null,
    ueTagVariables: null,
    tagTypesResponse: null,
    tagsResponse: null,
    datatableTagsResponse: null,
    isAddStepModalOpened: false,
    selectedMenuOption: null,
    addStepModalPosition: {
      x: 0,
      y: 0,
    },
  };
  test("should handle initial state", () => {
    // Arrange
    const initialState = { ...state };

    const action = { type: "unknown" };

    // Act
    const result = canvasReducer(initialState, action);

    // Assert
    const expectedState = initialState;
    expect(result).toEqual(expectedState);
  });
});
