import LegacyWorkflowRepository from "./workflowRepository";

import campaignFactory from "../factories/responses/campaignFactory";
import getCampaignListFactory from "../factories/responses/getCampaignListFactory";
import ModuleTypes from "../../features/canvas/interfaces/module-types";

const mainCampaigns = campaignFactory.buildList(2, { AppContext: "Main" });
const testAutomationCampaigns = campaignFactory.buildList(4, {
  AppContext: "TestAutomation",
});

export const getCampaignListDefaultResponse = getCampaignListFactory.build({
  campaignList: [...mainCampaigns, ...testAutomationCampaigns],
});

const defaultWorkflow = new LegacyWorkflowRepository(
  [
    {
      id: "someWorkflow",
      visuallyUshur: false,
      virtualPhoneNumber: "",
      newCampaign: false,
      callbackNumber: "",
      skipMenu: false,
      author: "joe@joe.com",
      AppContext: "Main",
      helpTrigger: "?",
      Languages: {},
      lang: "en",
      lastEdited: "",
      version: "2.0",
      visualData: {},
      name: "someWorkflow",
      routines: {
        Ushur_Initial_Routine: {
          action: "alertToCurrentUser",
          params: {
            menuId: "",
            stayInCampaign: false,
          },
        },
      },
      ui: {
        cells: [
          {
            id: "31537de0-e9ed-433a-93f4-ed2508da155a",
            type: "app.Step",
            attrs: {
              label: {
                text: "Welcome!",
              },
              description: {
                text: "This is your first step in the workflow.",
              },
              icon: {
                text: "",
              },
            },
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
              x: -88,
              y: -192,
            },
            z: 0,
            ports: {
              items: [
                {
                  id: "fc419d8a-de7a-4eb6-8cf4-c00c87192201",
                  group: "in",
                },
                {
                  id: "4b5a044e-98bb-4104-a28c-8acf27a1a9ef",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [
              {
                id: "9aac5cc0-8a9d-4583-995f-47bc8780c593",
                type: ModuleTypes.MESSAGE_MODULE,
                text: "Welcome to your workflow!",
                title: "Message",
              },
            ],
          },
          {
            id: "4a2ff85d-d617-4da9-8723-d6e6f727ba42",
            type: "app.Step",
            attrs: {
              label: {
                text: "Send IA",
              },
              description: {
                text: "Send invisible app",
              },
              icon: {
                text: "",
              },
            },
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
              x: -48,
              y: -48,
            },
            z: 0,
            ports: {
              items: [
                {
                  id: "c048e1ce-4a8b-42a5-ae63-cad3f2eb561b",
                  group: "in",
                },
                {
                  id: "0ccf0f68-081e-46f2-b48c-4ecceaa78186",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [],
          },
          {
            id: "58143993-4bd9-4a35-a709-89f31fb8b238",
            type: "app.Step",
            attrs: {
              label: {
                text: "Create New Member",
              },
              description: {
                text: "Create new member if contact does not exist",
              },
              icon: {
                text: "",
              },
            },
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
              x: -8,
              y: 96,
            },
            z: 0,
            ports: {
              items: [
                {
                  id: "6430988a-83bd-4ea2-bc61-823bf9d9f410",
                  group: "in",
                },
                {
                  id: "3b62812e-88e4-4c5a-aaed-73d6f8c054be",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [],
          },
          {
            id: "4efdbd91-61f0-49da-8943-abb2f2604dfc",
            type: "app.Step",
            attrs: {
              label: {
                text: "Main Menu",
              },
              description: {
                text: "Allow user to choose their own adventure",
              },
              icon: {
                text: "",
              },
            },
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
              x: 32,
              y: 240,
            },
            z: 0,
            ports: {
              items: [
                {
                  id: "b3f95f86-ae8a-48df-a9d8-e8eb89397280",
                  group: "in",
                },
                {
                  id: "242cac82-8551-420d-a4ff-197ca2e4b00c",
                  group: "out",
                },
                {
                  id: "1068361c-12c3-4fd0-ad6f-9a3f849464aa",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [],
          },
          {
            id: "d43d89da-5781-4472-9ae4-602b0da3db08",
            type: "app.Step",
            attrs: {
              label: {
                text: "Schedule Appointment",
              },
              description: {
                text: "Schedule appointment with doctor",
              },
              icon: {
                text: "",
              },
            },
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
              x: 72,
              y: 392,
            },
            z: 0,
            ports: {
              items: [
                {
                  id: "7f007fe6-0904-43bf-a792-361c35c77bdd",
                  group: "in",
                },
                {
                  id: "95dad9eb-92b8-4f7f-a00a-9ba785f968fc",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [],
          },
          {
            id: "4b63a48d-6e50-487f-ae1a-c573ef2863ad",
            type: "app.Step",
            attrs: {
              label: {
                text: "Send Appointment",
              },
              description: {
                text: "Send the scheduled appointment to the user",
              },
              icon: {
                text: "",
              },
            },
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
              x: 448,
              y: 88,
            },
            z: 0,
            // eslint-disable-next-line max-lines
            ports: {
              items: [
                {
                  id: "88591f5e-f730-437c-ba26-81aa1bbe41aa",
                  group: "in",
                },
                {
                  id: "3679cebe-52fd-4034-a23d-84c95289c44d",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [],
          },
          {
            id: "d7a470fb-4429-427b-9531-45977c6a007f",
            type: "app.Step",
            attrs: {
              label: {
                text: "Select PCP",
              },
              description: {
                text: "Allow user to select Primary Care Physician",
              },
              icon: {
                text: "",
              },
            },
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
              x: 488,
              y: 240,
            },
            z: 0,
            ports: {
              items: [
                {
                  id: "90b7011d-a6e8-433c-95ef-787a333e6dee",
                  group: "in",
                },
                {
                  id: "fdca0048-649e-4069-824f-06c83c6bbac9",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [],
          },
          {
            id: "3d9f6553-55ae-4646-a31d-0dd3951ed6fa",
            type: "app.Step",
            attrs: {
              label: {
                text: "Thank you",
              },
              description: {
                text: "Thank the user and end the session",
              },
              icon: {
                text: "",
              },
            },
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
              x: 528,
              y: 384,
            },
            z: 0,
            ports: {
              items: [
                {
                  id: "de9e18dc-5eb1-4063-a3e7-933fa5edd791",
                  group: "in",
                },
                {
                  id: "532f6e12-2fbc-49f8-bbc0-ed6c6e2fcff9",
                  group: "out",
                },
              ],
            },
            labels: [],
            modules: [],
          },
          {
            id: "bada1b72-c41f-44af-a657-08d4a507b61b",
            type: "app.Link",
            attrs: {
              label: {
                text: "",
              },
              description: {
                text: "",
              },
              icon: {
                text: "",
              },
            },
            source: {
              id: "31537de0-e9ed-433a-93f4-ed2508da155a",
              magnet: "portBody",
              port: "4b5a044e-98bb-4104-a28c-8acf27a1a9ef",
            },
            target: {
              id: "4a2ff85d-d617-4da9-8723-d6e6f727ba42",
              magnet: "portBody",
              port: "c048e1ce-4a8b-42a5-ae63-cad3f2eb561b",
            },
            position: {
              x: 0,
              y: 0,
            },
            z: 7,
            ports: {
              items: [],
            },
            labels: [
              {
                id: "ae19a7b2-c23c-428f-9e68-6399d2320f46",
                attrs: {
                  labelText: {
                    text: "",
                  },
                },
              },
            ],
            modules: [],
          },
          {
            id: "dfb104c7-c487-4d3d-9f4d-04995c79c499",
            type: "app.Link",
            attrs: {
              label: {
                text: "",
              },
              description: {
                text: "",
              },
              icon: {
                text: "",
              },
            },
            source: {
              id: "4a2ff85d-d617-4da9-8723-d6e6f727ba42",
              magnet: "portBody",
              port: "0ccf0f68-081e-46f2-b48c-4ecceaa78186",
            },
            target: {
              id: "58143993-4bd9-4a35-a709-89f31fb8b238",
              magnet: "portBody",
              port: "6430988a-83bd-4ea2-bc61-823bf9d9f410",
            },
            position: {
              x: 0,
              y: 0,
            },
            z: 7,
            ports: {
              items: [],
            },
            labels: [
              {
                id: "0da3f8e5-fc6e-4c72-a912-95bbb1928ac0",
                attrs: {
                  labelText: {
                    text: "",
                  },
                },
              },
            ],
            modules: [],
          },
          {
            id: "0aa9d87f-3eb3-4bb1-8fe5-9e45ac8de985",
            type: "app.Link",
            attrs: {
              label: {
                text: "",
              },
              description: {
                text: "",
              },
              icon: {
                text: "",
              },
            },
            source: {
              id: "4efdbd91-61f0-49da-8943-abb2f2604dfc",
              magnet: "portBody",
              port: "242cac82-8551-420d-a4ff-197ca2e4b00c",
            },
            target: {
              id: "d43d89da-5781-4472-9ae4-602b0da3db08",
              magnet: "portBody",
              port: "7f007fe6-0904-43bf-a792-361c35c77bdd",
            },
            position: {
              x: 0,
              y: 0,
            },
            z: 7,
            ports: {
              items: [],
            },
            labels: [
              {
                id: "7fae22be-5904-4297-9dae-d4f98ddc8ff6",
                attrs: {
                  labelText: {
                    text: "",
                  },
                },
              },
            ],
            modules: [],
          },
          {
            id: "3f3c4ee1-d3df-4d23-9456-2af0985342f7",
            type: "app.Link",
            attrs: {
              label: {
                text: "",
              },
              description: {
                text: "",
              },
              icon: {
                text: "",
              },
            },
            source: {
              id: "4efdbd91-61f0-49da-8943-abb2f2604dfc",
              magnet: "portBody",
              port: "1068361c-12c3-4fd0-ad6f-9a3f849464aa",
            },
            target: {
              id: "4b63a48d-6e50-487f-ae1a-c573ef2863ad",
              magnet: "portBody",
              port: "3679cebe-52fd-4034-a23d-84c95289c44d",
            },
            position: {
              x: 0,
              y: 0,
            },
            z: 7,
            ports: {
              items: [],
            },
            labels: [
              {
                id: "3efdfe19-e9b8-4d35-ab65-900cfccef00f",
                attrs: {
                  labelText: {
                    text: "",
                  },
                },
              },
            ],
            modules: [],
          },
          {
            id: "b1b2fc3e-4221-4924-98a6-1944a8dc5c1e",
            type: "app.Link",
            attrs: {
              label: {
                text: "",
              },
              description: {
                text: "",
              },
              icon: {
                text: "",
              },
            },
            source: {
              id: "4b63a48d-6e50-487f-ae1a-c573ef2863ad",
              magnet: "portBody",
              port: "3679cebe-52fd-4034-a23d-84c95289c44d",
            },
            target: {
              id: "d7a470fb-4429-427b-9531-45977c6a007f",
              magnet: "portBody",
              port: "90b7011d-a6e8-433c-95ef-787a333e6dee",
            },
            position: {
              x: 0,
              y: 0,
            },
            z: 7,
            ports: {
              items: [],
            },
            labels: [
              {
                id: "5fa31e71-1cb6-4960-8559-3d2deac7105a",
                attrs: {
                  labelText: {
                    text: "",
                  },
                },
              },
            ],
            modules: [],
          },
          {
            id: "99816b5f-6cd8-453b-98d5-e0f7a228495c",
            type: "app.Link",
            attrs: {
              label: {
                text: "",
              },
              description: {
                text: "",
              },
              icon: {
                text: "",
              },
            },
            source: {
              id: "d7a470fb-4429-427b-9531-45977c6a007f",
              magnet: "portBody",
              port: "fdca0048-649e-4069-824f-06c83c6bbac9",
            },
            target: {
              id: "3d9f6553-55ae-4646-a31d-0dd3951ed6fa",
              magnet: "portBody",
              port: "de9e18dc-5eb1-4063-a3e7-933fa5edd791",
            },
            position: {
              x: 0,
              y: 0,
            },
            z: 7,
            ports: {
              items: [],
            },
            labels: [
              {
                id: "bc187feb-a8d5-49c6-9574-4ae94eec51b2",
                attrs: {
                  labelText: {
                    text: "",
                  },
                },
              },
            ],
            modules: [],
          },
        ],
        sections: [
          {
            uid: "section_9aac5cc0-8a9d-4583-995f-47bc8780c593",
            userTitle: "",
            note: "",
            UeTag: "UeTag_381511",
            moduleIcon: "",
            position: {
              x: 546,
              y: 20,
            },
            sectionType: "welcome",
            onReturn: {
              UeTag: "UeTag_934713",
              jumpText: "End of workflow",
              jump: "**ENDCAMPAIGN**",
            },
            message: "Welcome to your workflow!",
            isFormEntry: false,
            jump: {
              jumpText: "End of workflow",
              jump: "**ENDCAMPAIGN**",
            },
          },
        ],
      },
    },
  ],
  getCampaignListDefaultResponse
);

export default defaultWorkflow;
