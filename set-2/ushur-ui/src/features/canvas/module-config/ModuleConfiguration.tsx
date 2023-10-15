/* eslint-disable max-lines */
import { ReactElement } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import ModuleItem from "./ModuleItem";
import "./ModuleConfiguration.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getModules } from "../data/utils";
import {
  workflowDetails,
  selectedCellId,
  setModuleDetails,
} from "../data/canvasSlice";
import { DiagramCellId } from "../interfaces/diagramming-service";
import { MessageModule, MenuModule, FormModule, Workflow } from "../../../api";
import {
  setModulesAsync,
  addModuleAsync,
  reorderModulesAsync,
} from "../data/canvasAsyncRequests";
import { Module } from "../interfaces/api";
import ModuleTypes from "../interfaces/module-types";

import { AppDispatch } from "../../../app/store";
import { areModulesSwappable } from "../data/validation";

export const getModuleTitle = (id: string) => {
  const moduleTitleMap: Record<string, string> = {
    [ModuleTypes.MESSAGE_MODULE]: "Message",
    [ModuleTypes.MENU_MODULE]: "Menu",
    [ModuleTypes.FORM_MODULE]: "Form",
    [ModuleTypes.COMPUTE_MODULE]: "Compute",
    [ModuleTypes.BRANCH_MODULE]: "Branch",
    [ModuleTypes.AI_MODULE]: "AI/ML",
  };

  return moduleTitleMap[id] ?? {};
};
const engagementModules: Module[] = [
  {
    id: ModuleTypes.MESSAGE_MODULE,
    type: ModuleTypes.MESSAGE_MODULE,
    title: "Message",
    text: "",
  } as MessageModule,
  {
    id: ModuleTypes.MENU_MODULE,
    type: ModuleTypes.MENU_MODULE,
    title: "Menu",
    text: '<h2 class="mb-0">Main Menu</h2><span>Select an option from the menu below.</span>',
  } as MenuModule,
  {
    id: ModuleTypes.FORM_MODULE,
    type: ModuleTypes.FORM_MODULE,
    title: "Form",
    fields: [],
  } as FormModule,
];
const utilityModules: Module[] = [
  {
    id: ModuleTypes.BRANCH_MODULE,
    type: ModuleTypes.BRANCH_MODULE,
    title: "Branch",
  },
  {
    id: ModuleTypes.COMPUTE_MODULE,
    type: ModuleTypes.COMPUTE_MODULE,
    title: "Compute",
  },
  {
    id: ModuleTypes.AI_MODULE,
    type: ModuleTypes.AI_MODULE,
    title: "AI/ML",
  },
];

const swapModules = (modules: Module[], srcIndex: number, dstIndex: number) => {
  const newConfiguredModules = [...modules];
  const movingItem = newConfiguredModules[srcIndex];
  newConfiguredModules[srcIndex] = newConfiguredModules[dstIndex];
  newConfiguredModules[dstIndex] = movingItem;
  return newConfiguredModules;
};

export const getModuleType = (moduleId: string) => {
  let moduleType = "";
  moduleType =
    engagementModules.find((moduleObj: Module) => moduleObj.id === moduleId)
      ?.type ?? "";
  if (moduleType === "")
    moduleType =
      utilityModules.find((moduleObj: Module) => moduleObj.id === moduleId)
        ?.type ?? "";
  return moduleType;
};

const getModuleText = (moduleId: string) => {
  let module = engagementModules.find(
    (moduleObj: Module) => moduleObj.id === moduleId
  );

  if (!module) {
    module = utilityModules.find(
      (moduleObj: Module) => moduleObj.id === moduleId
    );
  }

  switch (module?.type) {
    case ModuleTypes.MESSAGE_MODULE: {
      return (module as MessageModule).text || "";
    }

    case ModuleTypes.MENU_MODULE: {
      return (module as MenuModule).text || "";
    }

    default: {
      return "";
    }
  }
};

const createNewModule = (moduleId: string, draggableId: string) => {
  const type = getModuleType(draggableId);

  const payload = {
    id: moduleId,
    title: getModuleTitle(draggableId),
    type,
  };

  switch (type) {
    case ModuleTypes.MESSAGE_MODULE: {
      (payload as MessageModule).text = getModuleText(moduleId);
      break;
    }

    case ModuleTypes.MENU_MODULE: {
      (payload as MenuModule).text = getModuleText(moduleId);
      (payload as MenuModule).menuOptions = [];
      (payload as MenuModule).menuUserSelection = "";
      (payload as MenuModule).errorLimitValue = "";
      (payload as MenuModule).errorBranchTo = "";
      break;
    }
    case ModuleTypes.FORM_MODULE: {
      (payload as FormModule).fields = [];
      break;
    }

    default: {
      break;
    }
  }

  return payload;
};
/* eslint max-lines: ["error", 350] max-lines-per-function: ["error", 180] */

const processReorderedModules = (options: {
  dispatch: AppDispatch;
  currentSelectedCellId: DiagramCellId | null;
  workflow: Workflow | null;
  modules: Module[];
  source: number;
  destination: number;
}): Module[] | undefined => {
  const {
    dispatch,
    currentSelectedCellId,
    workflow,
    modules,
    source,
    destination,
  } = options;
  if (
    !areModulesSwappable(currentSelectedCellId, workflow, {
      source,
      destination,
    })
  ) {
    return undefined;
  }

  // swap two items in configured list
  const reorderedModules = swapModules(modules, source, destination);

  dispatch(
    reorderModulesAsync({
      workflow: workflow as Workflow,
      stepId: currentSelectedCellId as string,
      modules: reorderedModules,
      source: destination,
      destination: source,
    })
  )
    .unwrap()
    .catch(() => {
      throw new Error("Unable to configure modules");
    });

  return reorderedModules;
};

const ModuleConfiguration = (): ReactElement => {
  const currentWorkflowDetails = useAppSelector(workflowDetails);
  const currentSelectedCellId = useAppSelector(selectedCellId);
  const dispatch = useAppDispatch();
  // lookup currently configured modules
  const modules = getModules(currentSelectedCellId, currentWorkflowDetails);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      const newConfiguredModules = processReorderedModules({
        dispatch,
        currentSelectedCellId,
        workflow: currentWorkflowDetails,
        modules,
        source: source.index,
        destination: destination.index,
      });

      dispatch(
        setModulesAsync({
          workflow: currentWorkflowDetails as Workflow,
          stepId: currentSelectedCellId as string,
          modules: newConfiguredModules ?? [],
        })
      ).catch(() => {
        throw new Error("Unable to configure modules");
      });
    } else if (destination.droppableId === ModuleTypes.CONFIGURED_MODULE) {
      // add new module after dragging and dropping a module
      const moduleId = uuidv4();
      const newModule = createNewModule(moduleId, draggableId);
      if (draggableId === ModuleTypes.MENU_MODULE) {
        dispatch(
          setModuleDetails({
            id: draggableId,
            data: null,
          })
        );
      }

      dispatch(
        addModuleAsync({
          workflow: currentWorkflowDetails as Workflow,
          stepId: currentSelectedCellId as string,
          module: newModule,
        })
      )
        .unwrap()
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e);
          throw new Error("Unable to add a module");
        });
    }
  };
  return (
    <div>
      <h4 className="pl-3 font-proxima-light text-2xl mb-0">Step Logic</h4>
      <p className="pl-3 font-proxima-light not-italic text-sm mb-3">
        Assemble the flow for this step using the modules below.
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={ModuleTypes.CONFIGURED_MODULE}>
          {(provided) => (
            <div
              // eslint-disable-next-line max-len
              className="configured-modules-container items-center bg-gray-100 border-t border-l-0 border-r-0 border-b border-dashed border-primary-gray grow p-2"
              ref={provided.innerRef}
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...provided.droppableProps}
            >
              {modules.map((module, index) => (
                <ModuleItem
                  key={module.id}
                  content={module}
                  index={index}
                  isConfigured
                />
              ))}
              <p className="mt-3 mb-2 text-xs text-center text-gray-700 font-proxima-light">
                Click or drag and drop your modules here.
              </p>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <h4 className="pl-3 font-proxima-light text-2xl mt-3 mb-0">Modules</h4>
        <p className="pl-3 font-proxima-light text-sm mb-0">
          The basic building blocks of your workflow.
        </p>
        <Droppable droppableId="configurable-view-module" isDropDisabled>
          {(provided) => (
            <>
              <p className="pl-3 non-italic uppercase text-sm text-primary-gray font-proxima-bold mt-3 mr-1 mb-0">
                Engagement modules
              </p>
              <div
                className="pl-2 flex flex-wrap"
                ref={provided.innerRef}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...provided.droppableProps}
              >
                {engagementModules.map((module, index) => (
                  <ModuleItem
                    key={module.id}
                    content={module}
                    index={index}
                    isConfigured={false}
                  />
                ))}
                {provided.placeholder}
              </div>
            </>
          )}
        </Droppable>
        <Droppable droppableId="configurable-data-module" isDropDisabled>
          {(provided) => (
            <>
              <p className="pl-3 non-italic uppercase text-sm text-primary-gray font-proxima-bold mt-3 mr-1 mb-0">
                Utility modules
              </p>
              <div
                className="pl-2 flex flex-wrap"
                ref={provided.innerRef}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...provided.droppableProps}
              >
                {utilityModules.map((module, index) => (
                  <ModuleItem
                    key={module.id}
                    content={module}
                    index={index}
                    isConfigured={false}
                  />
                ))}
                {provided.placeholder}
              </div>
            </>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ModuleConfiguration;
