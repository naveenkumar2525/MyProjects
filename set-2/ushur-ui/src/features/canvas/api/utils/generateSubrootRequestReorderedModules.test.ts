import { cloneDeep } from "lodash";
import {
  WorkflowUpdateContext,
  WorkflowUpdateContextType,
} from "../../interfaces/api";
import generateSubRootModulesRequest from "./generateSubrootRequest";
import {
  createMockWorkflowWithLinkedSteps,
  mockMessageModulePassString,
} from "./mocks";

test("when attempting to reorder 2 modules in a step", () => {
  // Arrange
  // create a workflow with a step and a welcome section.
  const { workflow, step1, modules1, sections } =
    createMockWorkflowWithLinkedSteps();

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.REORDER_MODULES,
    diagrammingService: undefined,
    change: {
      step: step1,
      modules: [modules1[0], modules1[1]],
      source: 0,
      destination: 1, // Used for section generation but not SubRoot module generation
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    workflow,
    context
  );

  const expected = [
    {
      cmd: "updateModule",
      campaignId: `${workflow.id}_child_section_${modules1[0].id}`,
      campaignData: {
        id: `${workflow.id}_child_section_${modules1[0].id}`,
        UeTag: sections[0].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: modules1[0].text,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflow.id}_child_section_${modules1[1].id}`,
              stayInCampaign: true,
            },
          },
        },
        passString: mockMessageModulePassString,
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
    {
      cmd: "updateModule",
      campaignId: `${workflow.id}_child_section_${modules1[1].id}`,
      campaignData: {
        id: `${workflow.id}_child_section_${modules1[1].id}`,
        UeTag: sections[1].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: modules1[1].text,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflow.id}_child_${sections[2].uid}`,
              stayInCampaign: true,
            },
          },
        },
        passString: mockMessageModulePassString,
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
    {
      cmd: "updateModule",
      campaignId: `${workflow.id}_child_section_${modules1[0].id}`,
      campaignData: {
        id: `${workflow.id}_child_section_${modules1[0].id}`,
        UeTag: sections[0].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: modules1[0].text,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflow.id}_child_${sections[1].uid}`,
              stayInCampaign: true,
            },
          },
        },
        passString: mockMessageModulePassString,
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
  ];

  // Assert
  expect(subRootModulesRequest).toEqual(expected);
});

test("when attempting to reorder 3 modules in a step", () => {
  // Arrange
  // create a workflow with a step and a welcome section.
  const { workflow, step1, modules1, sections } =
    createMockWorkflowWithLinkedSteps(3);

  const originalSections = cloneDeep(sections);

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.REORDER_MODULES,
    diagrammingService: undefined,
    change: {
      step: step1,
      modules: [modules1[0], modules1[1], modules1[2]],
      source: 2,
      destination: 1, // Used for section generation but not SubRoot module generation
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    workflow,
    context
  );

  // Assert

  const getExpectedRoutine = (text: string, sectionId: string) => ({
    Ushur_Initial_Routine: {
      action: "alertToCurrentUser",
      params: {
        text,
      },
      next: {
        routine: "goToNextSection",
      },
    },
    goToNextSection: {
      action: "goToMenu",
      params: {
        menuId: `${workflow.id}_child_${sectionId}`,
        stayInCampaign: true,
      },
    },
  });

  const expected = [
    {
      cmd: "updateModule",
      campaignId: `${workflow.id}_child_section_${modules1[0].id}`,
      campaignData: {
        id: `${workflow.id}_child_section_${modules1[0].id}`,
        UeTag: originalSections[0].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: getExpectedRoutine(modules1[0].text, originalSections[1].uid),
        passString: mockMessageModulePassString,
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
    {
      cmd: "updateModule",
      campaignId: `${workflow.id}_child_section_${modules1[0].id}`,
      campaignData: {
        id: `${workflow.id}_child_section_${modules1[0].id}`,
        UeTag: originalSections[0].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: getExpectedRoutine(modules1[0].text, originalSections[1].uid),
        passString: mockMessageModulePassString,
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
    {
      cmd: "updateModule",
      campaignId: `${workflow.id}_child_section_${modules1[2].id}`,
      campaignData: {
        id: `${workflow.id}_child_section_${modules1[2].id}`,
        UeTag: originalSections[2].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: getExpectedRoutine(modules1[2].text, originalSections[3].uid),
        passString: mockMessageModulePassString,
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
    {
      cmd: "updateModule",
      campaignId: `${workflow.id}_child_section_${modules1[1].id}`,
      campaignData: {
        id: `${workflow.id}_child_section_${modules1[1].id}`,
        UeTag: originalSections[1].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: getExpectedRoutine(modules1[1].text, originalSections[2].uid),
        passString: mockMessageModulePassString,
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
  ];

  expect(subRootModulesRequest[3]).toEqual(expected[3]);
});
