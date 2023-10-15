/* eslint-disable max-lines */
import { LegacyMessageModuleSection, WorkflowStep } from "../../../../api";
import canvasFactory from "../../../../mocks/factories/canvas";
import canvasSectionFactory from "../../../../mocks/factories/canvasSection";
import formModuleFactory from "../../../../mocks/factories/formModule";
import messageModuleFactory from "../../../../mocks/factories/messageModule";
import { getModuleIdToLegacySectionId } from "../../data/utils";
import JointJsDiagrammingService from "../../diagramming/jointjs/services/jointjs-diagramming-service";
import {
  WorkflowUpdateContext,
  WorkflowUpdateContextType,
} from "../../interfaces/api";
import generateSubRootModulesRequest from "./generateSubrootRequest";
import { mockMessageModulePassString } from "./mocks";

test("when updating the very first message module in the welcome step", () => {
  // Arrange
  // create a workflow with a step and a welcome section.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const workflowStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
  canvasWorkflow.ui.sections = canvasSectionFactory.buildList(1);
  // adjust the section to be a welcome step
  canvasWorkflow.ui.sections[0].sectionType = "welcome";

  const newModule = messageModuleFactory.build();

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.UPDATE_MODULE,
    diagrammingService: undefined,
    change: {
      step: canvasWorkflow.ui.cells[0] as WorkflowStep,
      module: newModule,
    },
  };

  canvasWorkflow.ui.sections = canvasSectionFactory.buildList(1, {
    uid: getModuleIdToLegacySectionId(newModule.id),
  });

  workflowStep.modules?.push(newModule);

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  // No sub-root section is created for the welcome module
  expect(subRootModulesRequest).toEqual([]);
});

test("when updating a module that is not the first module in the welcome step", () => {
  // Arrange
  // create a workflow with a step and a section that isn't a welcome message.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const workflowId = canvasWorkflow.id;
  const workflowStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
  const messageModule1 = messageModuleFactory.build({
    text: "Welcome to your workflow!",
  });
  const welcomeSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule1.id),
    sectionType: "message",
    message: messageModule1.text,
  });
  const messageModule2 = messageModuleFactory.build({
    text: "Second message module",
  });
  const messageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule2.id),
    sectionType: "message",
    message: messageModule2.text,
  });
  canvasWorkflow.ui.sections = [welcomeSection, messageModuleSection];
  const addModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[1].uid}`;

  // Act
  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.UPDATE_MODULE,
    diagrammingService: undefined,
    change: {
      step: workflowStep,
      module: messageModule2,
    },
  };
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  expect(subRootModulesRequest).toEqual([
    {
      cmd: "updateModule",
      campaignId: addModuleId,
      campaignData: {
        id: addModuleId,
        UeTag: canvasWorkflow.ui.sections[1].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: messageModule2.text,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
              stayInCampaign: true,
            },
          },
        },
        passString: JSON.stringify({
          module: "promptmessage",
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
        }),
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
  ]);
});

test("when adding the the first module to the welcome step", () => {
  // Arrange
  // create a workflow with a welcome step and a module.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const workflowStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
  const newModule = messageModuleFactory.build();
  workflowStep.modules?.push(newModule);
  canvasWorkflow.ui.sections = canvasSectionFactory.buildList(1, {
    uid: getModuleIdToLegacySectionId(newModule.id),
    message: newModule.text,
  });
  // adjust the section to be a welcome step
  canvasWorkflow.ui.sections[0].sectionType = "welcome";

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService: undefined,
    change: {
      step: canvasWorkflow.ui.cells[0] as WorkflowStep,
      module: newModule,
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert

  // No sub-root updates are required since the welcome module info is in the UI root
  expect(subRootModulesRequest).toEqual([]);
});

test("when adding a module to the welcome step that is not the first module", () => {
  // Arrange
  // create a workflow with a step and a section that isn't a welcome message.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const workflowId = canvasWorkflow.id;
  const workflowStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
  const messageModule1 = messageModuleFactory.build({
    text: "Welcome to your workflow!",
  });
  const welcomeSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule1.id),
    sectionType: "message",
    message: messageModule1.text,
  }) as LegacyMessageModuleSection;
  const messageModule2 = messageModuleFactory.build({
    text: "Second message module",
  });
  const messageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule2.id),
    sectionType: "message",
    message: messageModule2.text,
  }) as LegacyMessageModuleSection;
  canvasWorkflow.ui.sections = [welcomeSection, messageModuleSection];
  workflowStep.modules.push(messageModule1, messageModule2);

  const addModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[1].uid}`;
  const updateModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[0].uid}`;

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService: undefined,
    change: {
      step: workflowStep,
      module: messageModule2,
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  const expected = [
    {
      cmd: "addModule",
      campaignId: addModuleId,
      campaignData: {
        id: addModuleId,
        UeTag: canvasWorkflow.ui.sections[1].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: messageModuleSection.message,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
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
      campaignId: updateModuleId,
      campaignData: {
        id: updateModuleId,
        UeTag: canvasWorkflow.ui.sections[0].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: welcomeSection.message,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
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

  expect(subRootModulesRequest).toEqual(expected);
});

test("when adding the first module to a non-Welcome step", () => {
  // Arrange
  // create a workflow with a step and a section that isn't a welcome message.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 2 }).build();
  const workflowId = canvasWorkflow.id;
  const workflowStep1 = canvasWorkflow.ui.cells[0] as WorkflowStep;
  const messageModule1 = messageModuleFactory.build({
    text: "Welcome to your workflow!",
  });
  const welcomeSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule1.id),
    sectionType: "message",
    message: messageModule1.text,
  });
  const messageModule2 = messageModuleFactory.build({
    text: "Second message module",
  });
  const messageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule2.id),
    sectionType: "message",
    message: messageModule2.text,
  }) as LegacyMessageModuleSection;

  canvasWorkflow.ui.sections = [welcomeSection, messageModuleSection];
  workflowStep1.modules.push(messageModule1, messageModule2);

  const workflowStep2 = canvasWorkflow.ui.cells[1] as WorkflowStep;
  const step2MessageModule1 = messageModuleFactory.build({
    text: "step 2 first module",
  });
  const step2MessageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(step2MessageModule1.id),
    sectionType: "message",
    message: step2MessageModule1.text,
  });
  canvasWorkflow.ui.sections.push(step2MessageModuleSection);
  workflowStep2.modules.push(step2MessageModule1);

  const addModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[2].uid}`;

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService: undefined,
    change: {
      step: workflowStep2,
      module: step2MessageModule1,
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  const expected = [
    {
      cmd: "addModule",
      campaignId: addModuleId,
      campaignData: {
        id: addModuleId,
        UeTag: canvasWorkflow.ui.sections[2].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: step2MessageModule1.text,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
              stayInCampaign: true,
            },
          },
        },
        passString:
          // eslint-disable-next-line max-len
          '{"module":"promptmessage","iAppProps":{"centerAlign":false,"hideResponse":false,"toggleResponse":false,"optionalResponse":false,"typePassword":false,"multiSelectOptions":false,"locSearchLabel":"Home Location","enableHTML":"No"}}',
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
  ];

  expect(subRootModulesRequest).toEqual(expected);
});

// eslint-disable-next-line max-lines-per-function
test("when adding the first module to a non-Welcome step2", () => {
  // Arrange
  // create a workflow with a step and a section that isn't a welcome message.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 2 }).build();
  const workflowId = canvasWorkflow.id;
  const workflowStep1 = canvasWorkflow.ui.cells[0] as WorkflowStep;
  const messageModule1 = messageModuleFactory.build({
    text: "Welcome to your workflow!",
  });
  const welcomeSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule1.id),
    sectionType: "message",
    message: messageModule1.text,
  });
  const messageModule2 = messageModuleFactory.build({
    text: "Second message module",
  });
  const step2MessageModule1 = messageModuleFactory.build({
    text: "step 2 first module",
  });
  const step2MessageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(step2MessageModule1.id),
    sectionType: "message",
    message: step2MessageModule1.text,
  });
  const messageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule2.id),
    sectionType: "message",
    message: messageModule2.text,
    jump: {
      jump: step2MessageModuleSection.uid,
      jumpText: "",
    },
  }) as LegacyMessageModuleSection;

  canvasWorkflow.ui.sections = [welcomeSection, messageModuleSection];
  workflowStep1.modules.push(messageModule1, messageModule2);

  const workflowStep2 = canvasWorkflow.ui.cells[1] as WorkflowStep;
  canvasWorkflow.ui.sections.push(step2MessageModuleSection);
  workflowStep2.modules.push(step2MessageModule1);

  const updateModuleId = `${workflowId}_child_${messageModuleSection.uid}`;
  const addModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[2].uid}`;

  jest.spyOn(document, "querySelector").mockResolvedValue([] as never);
  const diagrammingService = new JointJsDiagrammingService({
    canvas: ".canvas",
    toolbar: ".toolbar-container",
    paper: ".paper-container",
  });

  const mockElements = [
    {
      id: workflowStep1.id,
      getPorts: jest.fn().mockReturnValue([
        {
          id: "b27a2858-f9f7-4d9b-a7d4-20a3e63b1f89",
          group: "out",
        },
      ]),
    } as unknown as WorkflowStep,
  ] as unknown as WorkflowStep[];

  jest
    .spyOn(diagrammingService, "getInboundAndOutboundStepsToCell")
    .mockReturnValue({
      inboundStepsToCell: mockElements,
      outboundStepsToCell: [],
    });

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService,
    change: {
      step: workflowStep2,
      module: step2MessageModule1,
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  const expected = [
    {
      cmd: "updateModule",
      campaignId: updateModuleId,
      campaignData: {
        id: updateModuleId,
        UeTag: messageModuleSection.UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: messageModuleSection.message,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_${step2MessageModuleSection.uid}`,
              stayInCampaign: true,
            },
          },
        },
        passString:
          // eslint-disable-next-line max-len
          '{"module":"promptmessage","iAppProps":{"centerAlign":false,"hideResponse":false,"toggleResponse":false,"optionalResponse":false,"typePassword":false,"multiSelectOptions":false,"locSearchLabel":"Home Location","enableHTML":"No"}}',
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
    {
      cmd: "addModule",
      campaignId: addModuleId,
      campaignData: {
        id: addModuleId,
        UeTag: canvasWorkflow.ui.sections[2].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: step2MessageModule1.text,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
              stayInCampaign: true,
            },
          },
        },
        passString:
          // eslint-disable-next-line max-len
          '{"module":"promptmessage","iAppProps":{"centerAlign":false,"hideResponse":false,"toggleResponse":false,"optionalResponse":false,"typePassword":false,"multiSelectOptions":false,"locSearchLabel":"Home Location","enableHTML":"No"}}',
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
  ];

  expect(subRootModulesRequest).toEqual(expected);
});

// eslint-disable-next-line max-lines-per-function
test("when deleting a module", () => {
  // Arrange
  // create a workflow with a step and a section that isn't a welcome message.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 2 }).build();
  const workflowId = canvasWorkflow.id;
  const workflowStep1 = canvasWorkflow.ui.cells[0] as WorkflowStep;
  const messageModule1 = messageModuleFactory.build({
    text: "Welcome to your workflow!",
  });
  const welcomeSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule1.id),
    sectionType: "message",
    message: messageModule1.text,
  });
  const messageModule2 = messageModuleFactory.build({
    text: "Second message module",
  });
  const step2MessageModule1 = messageModuleFactory.build({
    text: "step 2 first module",
  });
  const step2MessageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(step2MessageModule1.id),
    sectionType: "message",
    message: step2MessageModule1.text,
  });
  const messageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule2.id),
    sectionType: "message",
    message: messageModule2.text,
    jump: {
      jump: step2MessageModuleSection.uid,
      jumpText: "",
    },
  }) as LegacyMessageModuleSection;

  canvasWorkflow.ui.sections = [welcomeSection, messageModuleSection];
  workflowStep1.modules.push(messageModule1, messageModule2);

  const workflowStep2 = canvasWorkflow.ui.cells[1] as WorkflowStep;
  canvasWorkflow.ui.sections.push(step2MessageModuleSection);
  workflowStep2.modules.push(step2MessageModule1);

  const updateModuleId = `${workflowId}_child_${messageModuleSection.uid}`;
  const addModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[2].uid}`;

  jest.spyOn(document, "querySelector").mockResolvedValue([] as never);
  const diagrammingService = new JointJsDiagrammingService({
    canvas: ".canvas",
    toolbar: ".toolbar-container",
    paper: ".paper-container",
  });

  const mockElements = [
    {
      id: workflowStep1.id,
      getPorts: jest.fn().mockReturnValue([
        {
          id: "b27a2858-f9f7-4d9b-a7d4-20a3e63b1f89",
          group: "out",
        },
      ]),
    } as unknown as WorkflowStep,
  ] as unknown as WorkflowStep[];

  jest
    .spyOn(diagrammingService, "getInboundAndOutboundStepsToCell")
    .mockReturnValue({
      inboundStepsToCell: mockElements,
      outboundStepsToCell: [],
    });

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService,
    change: {
      step: workflowStep2,
      module: step2MessageModule1,
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  const expected = [
    {
      cmd: "updateModule",
      campaignId: updateModuleId,
      campaignData: {
        id: updateModuleId,
        UeTag: messageModuleSection.UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: messageModuleSection.message,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_${step2MessageModuleSection.uid}`,
              stayInCampaign: true,
            },
          },
        },
        passString:
          // eslint-disable-next-line max-len
          '{"module":"promptmessage","iAppProps":{"centerAlign":false,"hideResponse":false,"toggleResponse":false,"optionalResponse":false,"typePassword":false,"multiSelectOptions":false,"locSearchLabel":"Home Location","enableHTML":"No"}}',
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
    {
      cmd: "addModule",
      campaignId: addModuleId,
      campaignData: {
        id: addModuleId,
        UeTag: canvasWorkflow.ui.sections[2].UeTag,
        prompt: "",
        skipMenu: true,
        option: {},
        isMenu: true,
        module: "promptmessage",
        routines: {
          Ushur_Initial_Routine: {
            action: "alertToCurrentUser",
            params: {
              text: step2MessageModule1.text,
            },
            next: {
              routine: "goToNextSection",
            },
          },
          goToNextSection: {
            action: "goToMenu",
            params: {
              menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
              stayInCampaign: true,
            },
          },
        },
        passString:
          // eslint-disable-next-line max-len
          '{"module":"promptmessage","iAppProps":{"centerAlign":false,"hideResponse":false,"toggleResponse":false,"optionalResponse":false,"typePassword":false,"multiSelectOptions":false,"locSearchLabel":"Home Location","enableHTML":"No"}}',
        version: "1.2",
      },
      ushurLi: false,
      train: false,
    },
  ];

  expect(subRootModulesRequest).toEqual(expected);
});

test("when adding the first form module to a non-Welcome step", () => {
  // Arrange
  // create a workflow with a step and a section that isn't a welcome message.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 2 }).build();
  const workflowId = canvasWorkflow.id;
  // Step 1
  const workflowStep1 = canvasWorkflow.ui.cells[0] as WorkflowStep;
  // Welcome Module in step 1
  const messageModule1 = messageModuleFactory.build({
    text: "Welcome to your workflow!", // Welcome module
  });
  const welcomeSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule1.id),
    sectionType: "message",
    message: messageModule1.text,
  });
  const formModule = formModuleFactory.build({
    title: "first form module",
  });
  const formModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(formModule.id),
    sectionType: "form",
    message: formModule.title,
  }) as LegacyMessageModuleSection;

  canvasWorkflow.ui.sections = [welcomeSection, formModuleSection];
  workflowStep1.modules.push(messageModule1, formModule);

  // Step 2
  const workflowStep2 = canvasWorkflow.ui.cells[1] as WorkflowStep;
  const step2FormModule1 = formModuleFactory.build({
    title: "step 2 first module",
  });
  const step2MessageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(step2FormModule1.id),
    sectionType: "form",
    message: step2FormModule1.title,
  });
  canvasWorkflow.ui.sections.push(step2MessageModuleSection);
  workflowStep2.modules.push(step2FormModule1);

  const addModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[2].uid}`;

  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.ADD_MODULE,
    diagrammingService: undefined,
    change: {
      step: workflowStep2,
      module: step2FormModule1,
    },
  };

  // Act
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  const expected = [
    {
      campaignId: addModuleId,
      cmd: "addModule",
      campaignData: {
        _private: "",
        id: addModuleId,
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
    },
  ];

  expect(subRootModulesRequest).toEqual(expected);
});

test("when updating a form module that is not the first module in the welcome step", () => {
  // Arrange
  // create a workflow with a step and a section that isn't a welcome message.
  const canvasWorkflow = canvasFactory.transient({ numSteps: 1 }).build();
  const workflowId = canvasWorkflow.id;
  const workflowStep = canvasWorkflow.ui.cells[0] as WorkflowStep;
  const messageModule1 = messageModuleFactory.build({
    text: "Welcome to your workflow!",
  });
  const welcomeSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(messageModule1.id),
    sectionType: "message",
    message: messageModule1.text,
  });
  const formModule = formModuleFactory.build({
    title: "Form Module",
  });
  const messageModuleSection = canvasSectionFactory.build({
    uid: getModuleIdToLegacySectionId(formModule.id),
    sectionType: "form",
    message: formModule.title,
  });
  canvasWorkflow.ui.sections = [welcomeSection, messageModuleSection];
  const addModuleId = `${workflowId}_child_${canvasWorkflow.ui.sections[1].uid}`;

  // Act
  const context: WorkflowUpdateContext = {
    type: WorkflowUpdateContextType.UPDATE_MODULE,
    diagrammingService: undefined,
    change: {
      step: workflowStep,
      module: formModule,
    },
  };
  const subRootModulesRequest = generateSubRootModulesRequest(
    canvasWorkflow,
    context
  );

  // Assert
  const expectation = [
    {
      campaignId: addModuleId,
      cmd: "updateModule",
      campaignData: {
        _private: "",
        id: addModuleId,
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
    },
  ];
  expect(expectation).toEqual(subRootModulesRequest);
});
