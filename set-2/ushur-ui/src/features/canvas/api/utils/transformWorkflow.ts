import { isEmpty } from "lodash";
import {
  LegacyWorkflow,
  Workflow,
  WorkflowStep,
  CreateWorkflowLegacyRequest,
  MessageModule,
  SubRootModuleActionBaseParams,
  SubRootModuleActionBase,
  SubRootModuleDataBaseRoutines,
  SubRootModuleBase,
  LegacySubRootModule,
  FormModule,
  SubRootModuleActionBaseParamsData,
  FormElement,
  IAppProps,
  PassString,
  LegacySubModuleFormInput,
  SubRootModuleDataBase,
} from "../../../../api";

import {
  getTokenId,
  getUserEmailId,
  getDefaultVirtualNo,
} from "../../../../utils/api.utils";
import { Module } from "../../interfaces/api";
import ModuleTypes from "../../interfaces/module-types";
import {
  generateOnReturnRoutine,
  generateInitialRoutine,
} from "./generateRoutine";
import { generateWelcomeSection } from "./generateSections";
import { generateWelcomeUeTagStructure } from "./generateTag";

/**
 * Convert a legacy workflow to the new workflow format.
 *
 * @param legacyWorkflow The legacy workflow.
 * @returns The new workflow.
 */
export const transformLegacyWorkflowToNewWorkflow = (
  legacyWorkflow: LegacyWorkflow
) => {
  if (isEmpty(legacyWorkflow)) {
    return null;
  }
  const workflow: Workflow = {
    id: legacyWorkflow.id,
    AppContext: legacyWorkflow.AppContext,
    name: legacyWorkflow.id,
    author: legacyWorkflow.author,
    languages: legacyWorkflow.Languages as Record<string, unknown>,
    isEmptyUshur: false,
    version: legacyWorkflow.version,
    prompt: legacyWorkflow.prompt,
    skipMenu: legacyWorkflow.skipMenu,
    visuallyUshur: legacyWorkflow.visuallyUshur,
    routines: legacyWorkflow.routines,
    virtualPhoneNumber: legacyWorkflow.virtualPhoneNumber,
    callbackNumber: legacyWorkflow.callbackNumber,
    lastEdited: legacyWorkflow.lastEdited,
    UshurDescriptions: {},
    lang: legacyWorkflow.lang,
    active: legacyWorkflow.ui.active,
    ui: {
      campaignId: legacyWorkflow.id,
      active: legacyWorkflow.ui.active,
      UeTagStructure: legacyWorkflow.ui.UeTagStructure,
      version: legacyWorkflow.ui.version,
      welcome: legacyWorkflow.ui.welcome,
      sections: legacyWorkflow.ui.sections, // Mainly used for the Welcome module which has no Sub-root JSON.
      // TODO: In the future we could potentially convert a legacy workflow's sections field to Canvas 2.0 cells.
      // There is no such requirement to do so in the Canvas 2.0 project.
      // However, the initial iteration of Canvas 2.0 can be configured to use the legacy APIs to create workflows.
      // During the creation we provide the 'cells' field that the backend stores and we simply extract it here so that we can show
      // the Canvas 2.0 UI.
      cells: legacyWorkflow.ui?.cells ?? [],
    },
    ia: {},
  };

  return workflow;
};

const getWelcomeMessage = (workflow: Workflow) => {
  // The first cell is the Welcome step.
  const welcomeStep = workflow.ui.cells[0] as WorkflowStep;
  const welcomeStepModules = welcomeStep.modules;
  let message = "Welcome to your workflow!";
  if (welcomeStepModules?.length) {
    const { text } = welcomeStepModules[0] as MessageModule;
    message = text;
  }
  return message;
};

/**
 * Transform a workflow creation request into a legacy workflow creation request.
 *
 * @param workflow The workflow.
 * @param description The description of the workflow.
 * @returns A legacy create workflow request.
 */
export const transformWorkflowToLegacyCreateWorkflowRequest = (
  workflow: Workflow,
  description: string
) => {
  const workflowId = workflow.id;
  if (!workflowId) {
    return undefined;
  }
  const welcomeMessage = getWelcomeMessage(workflow);

  const welcomeStep = workflow.ui.cells[0] as WorkflowStep;
  const welcomeStepModules = welcomeStep.modules;
  if (!welcomeStepModules?.length) {
    return undefined;
  }
  const welcomeModule = welcomeStepModules[0];

  const { id } = welcomeModule;
  const legacyWelcomeSection = generateWelcomeSection(id, welcomeMessage);
  const onReturnRoutine = generateOnReturnRoutine(
    workflowId,
    legacyWelcomeSection.onReturn?.UeTag
  );

  const legacyWorkflow: CreateWorkflowLegacyRequest = {
    id: workflow.id,
    tokenId: getTokenId() as string,
    cmd: "addCampaign",
    campaignId: workflow.id,
    Languages: {},
    campaignData: {
      version: "2.0",
      name: workflow.id,
      author: getUserEmailId() as string,
      id: workflow.id,
      ...(description && { description }),
      virtualPhoneNumber: getDefaultVirtualNo() ?? "",
      visuallyUshur: false,
      AppContext: workflow.AppContext,
      prompt: "",
      skipMenu: true,
      lastEdited: workflow.lastEdited,
      lang: "en",
      isEmptyUshur: false,
      options: {},
      expiry: {
        days: 0,
        hours: 0,
        minutes: 0,
        message: "Session has expired!",
      },
      routines: {
        Ushur_Initial_Routine: generateInitialRoutine(workflowId),
        On_Return: onReturnRoutine,
      },
      ui: {
        UeTagStructure: generateWelcomeUeTagStructure(
          workflowId,
          legacyWelcomeSection.UeTag,
          welcomeMessage
        ),
        welcome: legacyWelcomeSection.message,
        status: "regular",
        active: false,
        campaignId: workflow.id,
        ...workflow.ui, // Ensure that we include the new Canvas 2.0 steps field
        sections: [legacyWelcomeSection],
      },
      visualData: {},
    },
    apiVer: "2.1",
    actionContext: "createCampaign",
  };

  return legacyWorkflow;
};

/**
 * Given a root module, this method transforms the module to sub root module.
 *
 * @param workflow Pass the Workflow object.
 * @param module The added to root module from UI.
 * @param cmd Command to be ran Add Module / Update Module.
 * @returns The module that is added to root UI is transformed to the format of sub root json. Right now covers Form Module only.
 */
export const transformModuleSubJSON = (
  workflow: Workflow,
  module: Module | null,
  cmd: SubRootModuleBase.CmdEnum = SubRootModuleBase.CmdEnum.AddModule
) => {
  let subRootModule: LegacySubRootModule = {};
  if (!module) return subRootModule;
  let index = 1;
  const userResponseParagraph = false;
  const userResponseSingleLine = true;
  const fieldValue = "";
  const validation = "";
  const validationErrorTxt = "";
  const autoComplete = "";
  const helpInfo = "";
  const locSearchLabel = "Home Location";
  const enableHTML = "No";
  const id = `${workflow.id}_child_section_${module?.id}`;
  let text = "";
  switch (module.type) {
    case ModuleTypes.FORM_MODULE: {
      const moduleName = "formmodule";
      const moduleClone = module as FormModule;
      const paramsDataArray: SubRootModuleActionBaseParamsData[] = [];
      moduleClone.fields.forEach((field: FormElement) => {
        text = field.data?.fieldValue || "";
        const passStringIAppProps: IAppProps = {
          centerAlign: false,
          hideResponse: false,
          toggleResponse: false,
          optionalResponse: false,
          typePassword: false,
          multiSelectOptions: false,
          locSearchLabel,
          enableHTML,
        };
        const passString: PassString = {
          module: moduleName,
          userResponseParagraph,
          userResponseSingleLine,
          fieldValue,
          validation,
          validationErrorTxt,
          autoComplete,
          helpInfo,
          iAppProps: passStringIAppProps,
        };
        const paramsData: SubRootModuleActionBaseParamsData = {
          index,
          type: module.type,
          passString,
          text,
        };
        paramsDataArray.push(paramsData);
        index += 1;
      });
      const formModule: LegacySubModuleFormInput = {
        campaignId: id,
        cmd,
        campaignData: {
          UeTag: module.uetag,
          _private: "",
          id,
          module: moduleName,
          passString: "",
          routines: {
            Ushur_Initial_Routine: {
              action: "",
              params: {
                data: paramsDataArray,
              } as SubRootModuleActionBaseParams,
            } as SubRootModuleActionBase,
          } as SubRootModuleDataBaseRoutines,
        } as SubRootModuleDataBase,
      };
      subRootModule = formModule;
      break;
    }
    default: {
      break;
    }
  }
  return subRootModule;
};
