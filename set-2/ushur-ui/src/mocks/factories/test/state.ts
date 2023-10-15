import { PreloadedState, EmptyObject } from "@reduxjs/toolkit";
import { Factory } from "fishery";
import { isEqual } from "lodash";
import { ReducerTypes } from "../../../app/store";
import { cellProps } from "../../../features/canvas/inspector/StepInspector";
import {
  DiagramCell,
  Shapes,
  DiagrammingService,
} from "../../../features/canvas/interfaces/diagramming-service";

export const diagrammingCellFactory: Factory<() => DiagramCell> =
  Factory.define<() => DiagramCell>(() => () => ({
    getId: jest.fn(),
    getType: jest.fn().mockImplementation(() => Shapes.STEP),
    getValue: jest.fn().mockImplementation((...args) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firstArgument = (args as any[])[0] as typeof cellProps;
      if (isEqual(firstArgument, cellProps.description)) {
        return "Some description";
      }
      if (isEqual(firstArgument, cellProps.label)) {
        return "Some title";
      }
      if (isEqual(firstArgument, cellProps.icon)) {
        return "Some icon";
      }
      return "";
    }),
    setValue: jest.fn(),
    remove: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }));

export const diagrammingServiceFactory: Factory<DiagrammingService> =
  Factory.define<DiagrammingService>(() => ({
    getCellById: diagrammingCellFactory.build(),
    start: jest.fn(),
    startBatch: jest.fn(),
    stopBatch: jest.fn(),
    destroy: jest.fn(),
    import: jest.fn(),
    getGraph: jest.fn(),
    getInboundAndOutboundStepsToCell: jest.fn(),
    onClickAddStepPopupMenu: jest.fn(),
    addNewStep: jest.fn(),
    linkTwoSteps: jest.fn(),
  }));

export const stateFactory: Factory<PreloadedState<ReducerTypes & EmptyObject>> =
  Factory.define<PreloadedState<ReducerTypes & EmptyObject>>(() => ({
    canvas: {
      isInspectorOpened: true,
      selectedCellId: null,
      workflowDetails: null,
      moduleDetails: null,
      diagrammingService: diagrammingServiceFactory.build(),
      selectedModule: null,
      isPublished: true,
      workflowVariables: null,
      initUshurResponse: null,
      continueUshurResponse: null,
      ueTagVariables: null,
      tagTypesResponse: null,
      tagsResponse: null,
      datatableTagsResponse: null,
      isAddStepModalOpened: false,
      selectedMenuOption: null,
      addStepModalPosition: { x: 0, y: 0 },
    },
  }));
