/* eslint-disable max-lines */
import { rest } from "msw";

import WorkflowService from "../services/workflow.service";
import defaultWorkflow from "../repository/defaultWorkflow";
import getAllCampaignAssociationsFactory from "../factories/responses/getAllCampaignAssociationsFactory";
import InfoQueryController from "../controllers/infoQueryController";

export const getAllCampaignAssociationsDefaultResponse =
  getAllCampaignAssociationsFactory.build();

const workflowService = new WorkflowService(defaultWorkflow);
const infoQueryController = new InfoQueryController(workflowService);

const defaultHandlers = [
  rest.post(/\/infoQuery/, infoQueryController.handleCommand),
  rest.post(/\/getAllCampaignAssociations/, (_req, res, ctx) =>
    res(ctx.json(getAllCampaignAssociationsDefaultResponse))
  ),
  rest.get(/\/uintgw\/integrations/, (_req, res, ctx) => {
    const integrationsResponse = [
      {
        integrationId: "78c54553-0b2c-4a25-83a4-e8a56f578784",
        displayName: "Salesforce",
        description:
          // eslint-disable-next-line max-len
          "Salesforce CRM is a cloud-based software that helps organizations to effectively streamline their sales and marketing operations",
        showAdditionalFields: true,
        logo: "https://react2-ui.ushur.dev/uintgw/static/salesforce.svg",
        connected: false,
      },
      {
        integrationId: "a86a2549-7d0d-4e71-8790-27704c23a309",
        displayName: "ServiceNow",
        description:
          "Service now specializes in IT services management (ITSM), IT operations management (ITOM) and IT business management (ITBM)",
        showAdditionalFields: false,
        logo: "https://react2-ui.ushur.dev/uintgw/static/servicenow.svg",
        connected: false,
      },
    ];
    return res(ctx.json(integrationsResponse));
  }),
  rest.get(/\/uintgw\/integrations\/state/, (_req, res, ctx) =>
    res(ctx.json({}))
  ),
  rest.post(/\/uintgw\/integrations\/state/, (_req, res, ctx) =>
    res(ctx.json({}))
  ),
  rest.post(/\/uneda\/data\/get/, (_req, res, ctx) => {
    const metadata = [
      {
        EmailVariable: "susannewalker@zillatide.com",
        firstName: "Nicholson",
        lastName: "Weiss",
        phonenumber: 5539492623,
        address: "729 Gatling Place, Oley, Idaho, 3777",
        ushurRecordId: "619b16729bf303cb703bdb2c",
      },
    ];
    return res(ctx.json(metadata));
  }),
  rest.get(/\/ushur\/ruleset/, (_req, res, ctx) => {
    const ruleSetResponse = {
      ruleSetList: [
        {
          rulesetId: "ee3af6b2-8ffc-44d1-bd5a-d501fd985ce4",
          description: "Data rules set",
          rulesetName: "Data rules",
        },
        {
          rulesetId: "8a5e6f49-e84a-4f0f-b667-bacc9bd35c08",
          description: "Sample data set ",
          rulesetName: "Sample data set",
        },
        {
          rulesetId: "b39420aa-4463-4688-8dce-f1647211a11b",
          description: "ILCB Rule",
          rulesetName: "ILCB Rule",
        },
        {
          rulesetId: "d550f516-7492-497f-b46c-14ce363fc815",
          description: "Test",
          rulesetName: "Test-Santosh",
        },
      ],
      respCode: "200",
      status: "success",
    };

    return res(ctx.json(ruleSetResponse));
  }),
  rest.post(/\/ushur\/ruleset/, (_req, res, ctx) => res(ctx.json({}))),
  rest.get(/\/apps\/hub/, (_req, res, ctx) => {
    const hubsResponse = {
      status: "success",
      respCode: 200,
      data: [
        {
          id: "62205d07db1f8d3c349dac0c",
          name: "main",
          description: "main portal",
        },
        {
          id: "62222e22db1f8d3c349dac34",
          name: "main",
          description: "main portal",
        },
        {
          id: "626c0c83db1f8d6ad0e9eefb",
          name: "main",
          description: "main portal",
        },
      ],
      infoText: "Hub portals retrieved successfully.",
    };
    return res(ctx.json(hubsResponse));
  }),
  rest.get("/apps/hub/:hubId/settings", (_req, res, ctx) => {
    const hubSettingsResponse = {
      status: "success",
      respCode: 200,
      data: {
        isActive: true,
        hubUrl: "http://foo.com/ip/62205d07db1f8d3c349dac0c",
        offlineMessage:
          "The Hub is currently down for maintenance. Please come back later",
        enableHubHome: false,
        requireMFA: false,
        base64Logo: 'data:image/jpeg;base64,"',
        logo: "7a3784ba-4b8c-4c8f-bb4a-855df58f8314",
        logoUrl:
          "https://react2-ui.ushur.dev/rest/asset/v2/sfdownload/7a3784ba-4b8c-4c8f-bb4a-855df58f8314",
        brandColors: ["#F38F3F5", "#2F80E1"],
        backgroundStyle: "lg-top-bottom",
        displayPortalName: false,
        displayPortalDescription: false,
        portalName: "main",
        portalDescription: "main portal",
      },
      infoText: "Retrived hub portal settings successfully.",
    };
    return res(ctx.json(hubSettingsResponse));
  }),
  rest.get("/apps/hub/:hubId/workflow", (_req, res, ctx) => {
    const hubWorkflowResponse = {
      status: "success",
      respCode: 200,
      data: [],
      infoText: "Hub portal workflows retrieved successfully.",
    };
    return res(ctx.json(hubWorkflowResponse));
  }),
  rest.post("/apps/hub/:hubId/workflows", (_req, res, ctx) => {
    const hubWorkflowByIdResponse = [
      {
        status: "success",
        respCode: 200,
        data: { workflowId: "62acb812db1f8d36bfdc439c" },
        infoText: "Added/Updated/deleted hub portal workflow successfully.",
      },
      {
        status: "success",
        respCode: 200,
        data: { workflowId: "62acb812db1f8d36bfdc439b" },
        infoText: "Added/Updated/deleted hub portal workflow successfully.",
      },
    ];
    return res(ctx.json(hubWorkflowByIdResponse));
  }),
  rest.put("/apps/hub/:hubId/settings", (_req, res, ctx) => {
    const hubSettingsResponse = {
      status: "success",
      respCode: 200,
      data: null,
      infoText: "Updated hub portal settings successfully.",
    };
    return res(ctx.json(hubSettingsResponse));
  }),
  rest.put("/rest/access/globalRoleTemplates", (_req, res, ctx) => {
    const globalRoleTemplatesResponse = {
      "uum-convo": "write",
      "uum-edit-language": "write",
      "uum-settings": "write",
      "uum-app-context": "write",
      "uum-app-context-new": "write",
      "uum-keys": "write",
      "uum-add-variable": "write",
      "uum-variable-table": "write",
      "uum-variable-operations": "write",
      "uum-meta-data": "write",
      "uum-meta-data-bulk-upload": "write",
      "uum-meta-data-table": "write",
      "uum-meta-data-add": "write",
      "uum-meta-data-operations": "write",
      "uum-routing": "write",
      "uum-stats": "off",
      "uum-templates": "write",
      "uum-tag-info": "write",
      "uum-user-admin": "write",
      "uum-user-admin-add": "write",
      "uum-user-admin-edit": "write",
      "uum-user-admin-roles": "write",
      "uum-user-admin-roles-buttons": "write",
      "uum-api-access": "on",
      "uum-activities": "write",
      "uum-faq-tab": "write",
      "uum-faq-tab-edit": "write",
      "uum-social-tab": "write",
      "uum-social-pages-edit": "write",
      "uum-social-ushur-edit": "write",
      "uum-create-new-ushur": "allow",
      "uum-clone-ushur": "allow",
      "uum-delete-ushur": "allow",
      "uum-change-ushur-structure": "allow",
      "uum-edit-ushur-module-contents": "allow",
      "uum-ushur-activation": "allow",
      "uum-ushur-list": "all",
      "uum-settings-basics-tab": "write",
      "uum-settings-availability-tab": "write",
      "uum-settings-appearance-tab": "write",
      "uum-settings-privacy-tab": "write",
      "uum-settings-links-tab": "write",
      "uum-settings-billing-tab": "write",
      "uum-settings-contacts-tab": "write",
      "uum-settings-languages-tab": "write",
      "uum-settings-access-control-tab": "write",
      "uum-responses-tab": "write",
      "uum-responses-content": "write",
      "uum-li-freeze": "write",
      "uum-meta-data-filter-as-is": "allow",
      "uum-dnd-exception": "write",
    };
    return res(ctx.json(globalRoleTemplatesResponse));
  }),
  rest.post(/\/rest\/export/, async (_req, res, ctx) =>
    res(
      ctx.set("Content-Length", "0"),
      ctx.set("Content-Type", "application/octet-stream")
    )
  ),
  rest.get(/\/static\/config_no_token.json/, async (_req, res, ctx) => {
    const resp = {
      pushChannels: {
        name: "pushChannels",
        options: {
          text: {
            display: true,
            displayText: "Text (SMS)",
            default: true,
          },
          voice: {
            display: false,
            displayText: "Voice",
            default: false,
          },
          whatsapp: {
            display: false,
            displayText: "WhatsApp",
            default: false,
          },
        },
        category: "push",
        description:
          "Options displayed in the channel dropdown in the Push tab",
      },
    };
    return res(ctx.json(resp));
  }),
  rest.post(/\/rest\/account\/jsondata\/get/, (_req, res, ctx) => {
    const resp = {
      status: "success",
      respCode: 200,
      data: {
        additionalPushChannels: "slack,voice,whatsapp",
        ShowEnterpriseStats: "Yes",
        GlobalDataSecurity: "Yes",
        BiCharts:
          "https://bi.ushur.me/app/main#/dashboards/610b129c3a93190037ca4b03?embed=true",
        fetchLimit: "50",
      },
      infoText: "Json data retrieved successfully.",
    };
    return res(ctx.json(resp));
  }),
  rest.post(/\/rest\/upnTable\/v2\/setCampaignActivation/, (_req, res, ctx) => {
    const resp = {
      status: "success",
      respCode: 200,
      data: null,
      infoText: "Campaign activated successfully.",
    };
    return res(ctx.json(resp));
  }),
  rest.post(/\/api\/v1\/ushur\/init/, (_req, res, ctx) => {
    const resp = {
      accumulatedData: [
        {
          sid: "4ed9af50-89b1-4717-bfc2-a1b1d5dc02f1-uxidxyz-fe41be76-652e-4fcd-8560-69b8e455e126",
          engagementStatus: "WAITING_FOR_INPUT",
          module: "multiplechoice",
          uetag: "UeTag_216796",
          choiceOptions: ["San Francisco", "New York", "Washington"],
          promptText:
            "Choose your favorite city\nPlease respond with a number.\n1) San Francisco\n2) New York\n3) Washington",
          properties: {
            passSendWelcomeMsgToUser: "no",
            RelMemOnOpenResponse: "yes",
          },
          horizontalBars: true,
        },
      ],
    };
    return res(ctx.json(resp));
  }),
  rest.post(/\/api\/v1\/ushur\/continue/, (_req, res, ctx) => {
    const resp = {
      accumulatedData: [
        {
          sid: "4ed9af50-89b1-4717-bfc2-a1b1d5dc02f1-uxidxyz-fe41be76-652e-4fcd-8560-69b8e455e126",
          engagementStatus: "WAITING_FOR_INPUT",
          module: "freeresponse",
          uetag: "UeTag_506786",
          promptText: "What's your favorite sport?",
          properties: {
            passSendWelcomeMsgToUser: "no",
            RelMemOnOpenResponse: "yes",
          },
          inputType: "uid_string",
        },
      ],
    };
    return res(ctx.json(resp));
  }),
];

export default defaultHandlers;
