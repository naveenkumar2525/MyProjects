import { ModuleData } from "../interfaces/module-details";
import { CanvasState } from "../interfaces/data/canvasState";

export const initialState: CanvasState = {
  workflowDetails: null,
  moduleDetails: null,
  selectedCellId: null,
  isInspectorOpened: false,
  diagrammingService: undefined,
  isPublished: false,
  selectedModule: null,
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

export const menuModuleInitialData: ModuleData = {
  menuListOptions: [
    {
      id: "1",
      value: "First Menu Option",
      branchStepValue: "",
      isHovered: false,
      isEditable: false,
    },
  ],
  menuBranchTo: "Branch 1",
  branchOptions: [
    { id: "1", text: "Branch 1" },
    { id: "2", text: "Branch 2" },
  ],
  menuUserSelection: "",
  errorLimitValue: "3",
  errorBranchTo: "",
  errorBranchOptions: [
    { id: "1", text: "Branch Test 1" },
    { id: "2", text: "Branch Test 2" },
  ],
};

export const menuModuleDefaultData: ModuleData = {
  menuListOptions: [],
  branchOptions: [],
  errorBranchOptions: [],
  errorBranchTo: "",
  errorLimitValue: "",
  menuBranchTo: "",
  menuUserSelection: "",
};
