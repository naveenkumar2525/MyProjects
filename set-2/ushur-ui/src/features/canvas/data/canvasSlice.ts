/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  DiagramCellId,
  DiagrammingService,
  Shapes,
} from "../interfaces/diagramming-service";

import {
  getWorkflowAsync,
  activateWorkAsync,
  deactivateWorkAsync,
  addCellsToWorkflowAsync,
  deleteCellFromWorkflowAsync,
  addModuleAsync,
  reorderModulesAsync,
  updateModuleAsync,
  variablesWorkAsync,
  initUshurAsync,
  continueUshurAsync,
  getVariablesByUeTagAsync,
  getTagTypesAsync,
  getTagsAsync,
  getDatatableTagsAsync,
  delModuleAsync,
} from "./canvasAsyncRequests";
import { Position, SLICE_NAME } from "../interfaces/data/canvasState";
import { initialState, menuModuleInitialData } from "./initialState";
import { RootState } from "../../../app/store";
import { ModulePayload } from "../interfaces/module-details";
import { findStep } from "./utils";
import {
  ContinueUshurResponse,
  InitUshurResponse,
  GetVariablesByUeTagResponse,
  GetTagTypesResponse,
  GetTagsResponse,
  GetDatatableTagsResponse,
  MenuOption,
} from "../../../api";
import { Module } from "../interfaces/api";

export const canvasSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setSelectedCell: (state, action) => {
      state.selectedCellId = action.payload as DiagramCellId | null;
    },
    setInspectorOpened: (state, action) => {
      state.isInspectorOpened = action.payload as boolean;
    },
    setIsPublished: (state, action: PayloadAction<false | true>) => {
      state.isPublished = action.payload;
    },
    reorderModules: (
      state,
      action: PayloadAction<{
        stepId: DiagramCellId;
        modules: Module[];
      }>
    ) => {
      const step = findStep(action.payload.stepId, state.workflowDetails);
      if (step) {
        step.modules = action.payload.modules;
      }
    },

    setSelectedModule: (state, action: PayloadAction<Module | null>) => {
      state.selectedModule = action.payload;
    },
    setModuleDetails: (state, action: PayloadAction<ModulePayload | null>) => {
      const moduleInfo = action.payload;
      if (moduleInfo) {
        const moduleData =
          moduleInfo.data && moduleInfo.data.menuBranchTo
            ? moduleInfo.data
            : menuModuleInitialData;
        const data = {
          [moduleInfo.id]: moduleData,
        };
        state.moduleDetails = data;
      }
    },
    setDiagrammingService: (state, action) => {
      state.diagrammingService = action.payload as
        | DiagrammingService
        | undefined;
    },
    startBatch: (state, action) => {
      state.diagrammingService?.startBatch(action.payload as string);
    },
    stopBatch: (state, action) => {
      state.diagrammingService?.stopBatch(action.payload as string);
    },
    setInitUshurResponse: (
      state,
      action: PayloadAction<InitUshurResponse | null>
    ) => {
      state.initUshurResponse = action.payload;
    },
    setContinueUshurResponse: (
      state,
      action: PayloadAction<ContinueUshurResponse | null>
    ) => {
      state.continueUshurResponse = action.payload;
    },
    setVariableTypesResponse: (
      state,
      action: PayloadAction<GetTagTypesResponse | null>
    ) => {
      state.tagTypesResponse = action.payload;
    },
    setIsAddStepModalOpened: (state, action) => {
      state.isAddStepModalOpened = action.payload as boolean;
    },
    setAddStepModalPosition: (state, action) => {
      state.addStepModalPosition = action.payload as Position;
    },
    setSelectedMenuOption: (state, action) => {
      state.selectedMenuOption = action.payload as MenuOption | null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkflowAsync.pending, (state) => {
        state.workflowDetails = null;
      })
      .addCase(getWorkflowAsync.fulfilled, (state, action) => {
        state.workflowDetails = action.payload;
      });
    builder
      .addCase(activateWorkAsync.pending, (state) => {
        state.isPublished = false;
      })
      .addCase(activateWorkAsync.fulfilled, (state) => {
        state.isPublished = true;
      });
    builder
      .addCase(deactivateWorkAsync.pending, (state) => {
        state.isPublished = true;
      })
      .addCase(deactivateWorkAsync.fulfilled, (state) => {
        state.isPublished = false;
      })
      .addCase(addCellsToWorkflowAsync.fulfilled, (state, action) => {
        if (state.workflowDetails) {
          const newCells = state.workflowDetails?.ui.cells.concat(
            action.meta.arg.cells
          );
          state.workflowDetails.ui.cells = newCells;
        }
      })
      .addCase(deleteCellFromWorkflowAsync.fulfilled, (state, action) => {
        if (state.workflowDetails) {
          const newCells = state.workflowDetails?.ui.cells.filter(
            (cell) => cell.id !== action.payload.id
          );
          state.workflowDetails.ui.cells = newCells;
        }
      })
      .addCase(addModuleAsync.fulfilled, (state, action) => {
        state.workflowDetails = action.payload;
      })
      .addCase(delModuleAsync.fulfilled, (state, action) => {
        state.workflowDetails = action.payload;
      })
      .addCase(reorderModulesAsync.fulfilled, (state, action) => {
        state.workflowDetails = action.payload;
      })
      .addCase(updateModuleAsync.fulfilled, (state, action) => {
        if (!state.workflowDetails) {
          return;
        }
        state.workflowDetails = action.payload;
      });
    builder
      .addCase(variablesWorkAsync.pending, (state) => {
        state.workflowVariables = null;
      })
      .addCase(variablesWorkAsync.fulfilled, (state, action) => {
        state.workflowVariables = action.payload;
      });
    builder
      .addCase(initUshurAsync.pending, (state) => {
        state.initUshurResponse = null;
      })
      .addCase(initUshurAsync.fulfilled, (state, action) => {
        const result = action.payload as InitUshurResponse | null;
        state.initUshurResponse = result;
      });
    builder
      .addCase(continueUshurAsync.pending, (state) => {
        state.continueUshurResponse = null;
      })
      .addCase(continueUshurAsync.fulfilled, (state, action) => {
        const result = action.payload as ContinueUshurResponse | null;
        state.continueUshurResponse = result;
      });
    builder
      .addCase(getVariablesByUeTagAsync.pending, (state) => {
        state.ueTagVariables = null;
      })
      .addCase(
        getVariablesByUeTagAsync.fulfilled,
        (state, action: PayloadAction<GetVariablesByUeTagResponse | null>) => {
          state.ueTagVariables = action.payload || null;
        }
      );
    builder
      .addCase(getTagTypesAsync.pending, (state) => {
        state.tagTypesResponse = null;
      })
      .addCase(
        getTagTypesAsync.fulfilled,
        (state, action: PayloadAction<GetTagTypesResponse | null>) => {
          state.tagTypesResponse = action.payload;
        }
      );
    builder
      .addCase(getTagsAsync.pending, (state) => {
        state.tagsResponse = null;
      })
      .addCase(
        getTagsAsync.fulfilled,
        (state, action: PayloadAction<GetTagsResponse | null>) => {
          state.tagsResponse = action.payload;
        }
      );
    builder
      .addCase(getDatatableTagsAsync.pending, (state) => {
        state.datatableTagsResponse = null;
      })
      .addCase(
        getDatatableTagsAsync.fulfilled,
        (state, action: PayloadAction<GetDatatableTagsResponse | null>) => {
          state.datatableTagsResponse = action.payload;
        }
      );
  },
});

export const {
  setDiagrammingService,
  setSelectedModule,
  setModuleDetails,
  reorderModules,
  setSelectedCell,
  setInspectorOpened,
  startBatch,
  stopBatch,
  setIsPublished,
  setInitUshurResponse,
  setContinueUshurResponse,
  setIsAddStepModalOpened,
  setAddStepModalPosition,
  setSelectedMenuOption,
} = canvasSlice.actions;
export const workflowDetails = (state: RootState) =>
  state.canvas.workflowDetails;

export const initUshurResult = (state: RootState) =>
  state.canvas.initUshurResponse;

export const continueUshurResult = (state: RootState) =>
  state.canvas.continueUshurResponse;

export const tagTypesResponse = (state: RootState) =>
  state.canvas.tagTypesResponse;

export const tagsResponse = (state: RootState) => state.canvas.tagsResponse;

export const datatableTagsResponse = (state: RootState) =>
  state.canvas.datatableTagsResponse;

export const diagrammingService = (state: RootState) =>
  state.canvas.diagrammingService;
export const isPublished = (state: RootState) => state.canvas.isPublished;
export const selectedCellId = (state: RootState) => state.canvas.selectedCellId;
export const isInspectorOpened = (state: RootState) =>
  state.canvas.isInspectorOpened;
export const selectedModule = (state: RootState) => state.canvas.selectedModule;
export const moduleDetails = (state: RootState) => state.canvas.moduleDetails;
export const workflowVariables = (state: RootState) =>
  state.canvas.workflowVariables;
export const getSteps = (state: RootState) =>
  state.canvas.workflowDetails?.ui?.cells?.filter(
    (c) => c.type === Shapes.STEP
  );
export const getStepFromId = (stepId: string) => (state: RootState) =>
  state.canvas.workflowDetails?.ui?.cells?.find((c) => c.id === stepId);
export const isAddStepModalOpened = (state: RootState) =>
  state.canvas.isAddStepModalOpened;
export const addStepModalPosition = (state: RootState) =>
  state.canvas.addStepModalPosition;
export const selectedMenuOption = (state: RootState) =>
  state.canvas.selectedMenuOption;
export default canvasSlice.reducer;

export const ueTagVariables = (state: RootState) => state.canvas.ueTagVariables;
