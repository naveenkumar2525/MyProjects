import { v4 as uuidv4 } from "uuid";
import { Workflow, MessageModule } from "../../api";
import { generateWelcomeSection } from "./api/utils/generateSections";
import ModuleTypes from "./interfaces/module-types";

function createEmptyWorkflow(id: string): Workflow {
  const welcomeMessage = "Welcome to your workflow!";
  const welcomeModule: MessageModule = {
    id: uuidv4(),
    title: "Message",
    type: ModuleTypes.MESSAGE_MODULE,
    text: "Welcome to your workflow!",
  };

  const legacyWelcomeSection = generateWelcomeSection(
    welcomeModule.id,
    welcomeMessage
  );
  return {
    id,
    AppContext: "todo",
    name: "todo",
    author: "todo",
    languages: {},
    virtualPhoneNumber: "todo",
    callbackNumber: "todo",
    lastEdited: new Date().toISOString(),
    UshurDescriptions: {},
    lang: "en",
    active: false,
    routines: {
      Ushur_Initial_Routine: {
        action: "goToMenu",
        params: {
          menuId: "{{DEFAULTNEXT}}",
          stayInCampaign: true,
        },
      },
    },
    version: "2.0",
    ui: {
      cells: [
        {
          id: uuidv4(),
          type: "app.Step",
          attrs: {
            label: {
              text: "Welcome!",
            },
            description: {
              text: "This is your first step in the workflow.",
            },
            icon: {
              text: "\ue1a7",
            },
          },
          modules: [welcomeModule],
          source: {
            id: "",
            magnet: "",
            port: "",
          },
          target: {
            id: "",
            magnet: "",
            port: "",
          },
          position: {
            x: 0,
            y: 0,
          },
          z: 1,
          ports: {
            items: [
              {
                id: uuidv4(),
                group: "in",
              },
              {
                id: uuidv4(),
                group: "out",
              },
            ],
          },
          labels: [],
        },
      ],
      sections: [legacyWelcomeSection],
    },
    ia: {
      centerAlign: false,
      locSearchLabel: "",
      multiSelectOptions: false,
      typePassword: false,
      hideResponse: false,
      optionalResponse: false,
      toggleResponse: false,
      enableHTML: undefined,
    },
  };
}

export default createEmptyWorkflow;
