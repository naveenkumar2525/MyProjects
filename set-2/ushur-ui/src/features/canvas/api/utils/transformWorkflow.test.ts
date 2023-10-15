import {
  CreateWorkflowLegacyRequest,
  SubRootModuleBase,
  Workflow,
  WorkflowStep,
  LegacySubRootModule,
  FormModule,
} from "../../../../api";
import { Module } from "../../interfaces/api";
import canvasFactory from "../../../../mocks/factories/canvas";
import canvasSectionFactory from "../../../../mocks/factories/canvasSection";
import formModuleFactory from "../../../../mocks/factories/formModule";
import legacyWorkflowFactory from "../../../../mocks/factories/legacyWorkflow";
import messageModuleFactory from "../../../../mocks/factories/messageModule";
import {
  getEndOfCampaignJump,
  getModuleIdToLegacySectionId,
} from "../../data/utils";
import {
  transformLegacyWorkflowToNewWorkflow,
  transformWorkflowToLegacyCreateWorkflowRequest,
  transformModuleSubJSON,
} from "./transformWorkflow";

test("transformLegacyWorkflowToNewWorkflow", () => {
  // Arrange
  // create a legacy workflow with legacy sections and a Canvas 2.0 cells section
  // We should be able to support both in the legacy API
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const legacyWorkflow = legacyWorkflowFactory.build();
  const sections = canvasSectionFactory.buildList(1);
  legacyWorkflow.ui = {
    ...legacyWorkflow.ui,
    sections,
    cells: canvasWorkflow.ui.cells,
  };

  // Act
  const result = transformLegacyWorkflowToNewWorkflow(legacyWorkflow);

  // Assert
  const expected: Workflow = {
    id: legacyWorkflow.id,
    AppContext: "Some AppContext",
    name: legacyWorkflow.id,
    prompt: undefined,
    routines: {
      Ushur_Initial_Routine: {
        action: "goToMenu",
        params: {
          menuId: "{{DEFAULTNEXT}}",
          stayInCampaign: true,
        },
      },
    },
    skipMenu: undefined,
    languages: {},
    isEmptyUshur: false,
    visuallyUshur: false,
    author: "some author",
    virtualPhoneNumber: "40123811234",
    callbackNumber: "80123811234",
    lastEdited: "function Date() { [native code] }",
    UshurDescriptions: {},
    lang: "en",
    active: false,
    ui: {
      UeTagStructure: undefined,
      active: false,
      campaignId: legacyWorkflow.id,
      sections: legacyWorkflow.ui.sections,
      cells: legacyWorkflow.ui.cells ?? [],
    },
    ia: {},
  };

  expect(result).toEqual(expected);
});

test("transformWorkflowToLegacyCreateWorkflowRequest", () => {
  // Arrange
  // create a workflow with legacy sections and Canvas 2.0 cells section
  // We should be able to support both in the new API
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const sections = canvasSectionFactory.buildList(1);
  canvasWorkflow.ui.sections = sections;
  const newModule = messageModuleFactory.build();
  const workflowStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
  workflowStep.modules?.push(newModule);

  const result = transformWorkflowToLegacyCreateWorkflowRequest(
    canvasWorkflow,
    "Some workflow"
  );

  const expected: CreateWorkflowLegacyRequest = {
    id: canvasWorkflow.id,
    tokenId: "",
    cmd: "addCampaign",
    campaignId: canvasWorkflow.id,
    Languages: {},
    campaignData: {
      version: "2.0",
      name: canvasWorkflow.id,
      author: "",
      id: canvasWorkflow.id,
      description: "Some workflow",
      virtualPhoneNumber: "",
      visuallyUshur: false,
      AppContext: "Some AppContext",
      prompt: "",
      skipMenu: true,
      lastEdited: canvasWorkflow.lastEdited,
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
        Ushur_Initial_Routine: {
          action: "goToMenu",
          params: {
            menuId:
              result?.campaignData?.routines?.Ushur_Initial_Routine?.params
                ?.menuId,
            stayInCampaign: true,
          },
        },
        On_Return: {
          UeTag: result?.campaignData?.routines?.On_Return?.UeTag,
          action: "goToMenu",
          params: {
            menuId: result?.campaignData?.routines?.On_Return?.params?.menuId,
            stayInCampaign: true,
          },
        },
      },
      ui: {
        UeTagStructure: canvasWorkflow.ui.UeTagStructure,
        status: "regular",
        active: false,
        campaignId: canvasWorkflow.id,
        cells: canvasWorkflow.ui.cells,
        sections: [
          {
            uid: getModuleIdToLegacySectionId(newModule.id),
            userTitle: "",
            note: "",
            UeTag: expect.any(String) as string,
            moduleIcon: "",
            position: {
              x: 546,
              y: 20,
            },
            sectionType: "welcome",
            onReturn: {
              UeTag: expect.any(String) as string,
              ...getEndOfCampaignJump(),
            },
            message: newModule.text,
            jump: getEndOfCampaignJump(),
          },
        ],
        welcome: newModule.text,
      },
      visualData: {},
    },
    apiVer: "2.1",
    actionContext: "createCampaign",
  };

  expect(result).toEqual(expected);
});

test("transformModuleSubJSONAddFormModule", () => {
  const workflow: Workflow = canvasFactory.transient({ numSteps: 1 }).build();
  const module: Module = formModuleFactory.build();
  const cmd: SubRootModuleBase.CmdEnum = SubRootModuleBase.CmdEnum.AddModule;
  const result: LegacySubRootModule = transformModuleSubJSON(
    workflow,
    module,
    cmd
  );
  const expectedId = `${workflow.id}_child_section_${module?.id}`;
  const expected = {
    campaignId: expectedId,
    cmd: "addModule",
    campaignData: {
      _private: "",
      id: expectedId,
      module: "formmodule",
      passString: "",
      routines: {
        Ushur_Initial_Routine: {
          action: "",
          params: {
            data: [],
          },
        },
      },
    },
  };
  expect(result).toEqual(expected);
});

test("transformModuleSubJSONUpdateFormModule", () => {
  const workflow: Workflow = canvasFactory.transient({ numSteps: 1 }).build();
  const module: FormModule = formModuleFactory.build();
  const cmd: SubRootModuleBase.CmdEnum = SubRootModuleBase.CmdEnum.UpdateModule;
  module.fields = [
    {
      data: {
        fieldValue: "textbox1",
      },
    },
  ];
  const result: LegacySubRootModule = transformModuleSubJSON(
    workflow,
    module,
    cmd
  );
  const expectedId = `${workflow.id}_child_section_${module?.id}`;
  const expected = {
    campaignId: expectedId,
    cmd: "updateModule",
    campaignData: {
      _private: "",
      id: expectedId,
      module: "formmodule",
      passString: "",
      routines: {
        Ushur_Initial_Routine: {
          action: "",
          params: {
            data: [
              {
                index: 1,
                type: "form-module",
                passString: {
                  module: "formmodule",
                  userResponseParagraph: false,
                  userResponseSingleLine: true,
                  fieldValue: "",
                  validation: "",
                  validationErrorTxt: "",
                  autoComplete: "",
                  helpInfo: "",
                  iAppProps: {
                    centerAlign: false,
                    hideResponse: false,
                    toggleResponse: false,
                    optionalResponse: false,
                    typePassword: false,
                    multiSelectOptions: false,
                    locSearchLabel: "Home Location",
                    enableHTML: "No",
                  },
                },
                text: "textbox1",
              },
            ],
          },
        },
      },
    },
  };
  expect(result).toEqual(expected);
});
