import { StatusCodes } from "http-status-codes";
import { isArray } from "lodash";
import { ResponseComposition, RestContext, RestRequest } from "msw";
import {
  GetWorkflowLegacyRequest,
  LegacyRootModule,
  LegacyWorkflow,
  UpdateWorkflowLegacyRequest,
} from "../../api";
import {
  InfoQueryRequest,
  InfoQueryResponse,
} from "../../features/canvas/interfaces/api";
import WorkflowService from "../services/workflow.service";

interface CommandMap extends Record<string, () => InfoQueryResponse> {
  getConfig: () => object;
  getCampaign: () => InfoQueryResponse;
  getCampaignList: () => object;
  manageCampaign: () => InfoQueryResponse;
  addCampaign: () => object;
  listGroups: () => object;
  getSurl: () => object;
  getSurlList: () => object;
  getUserInfo: () => object;
  addAllContents: () => object;
  getAllContents: () => object | undefined;
}

export default class InfoQueryController {
  workflowService: WorkflowService;

  constructor(workflowService: WorkflowService) {
    this.workflowService = workflowService;
  }

  handleCommand = (
    req: RestRequest<InfoQueryRequest>,
    res: ResponseComposition<InfoQueryResponse>,
    ctx: RestContext
  ) => {
    const { cmd } = req.body;
    const cmdMap: CommandMap = {
      getConfig: () => this.handleGetConfigCommand(),
      getCampaign: () => {
        const { campaignId } = req.body as GetWorkflowLegacyRequest;
        return this.handleGetCampaignCommand(campaignId);
      },
      getCampaignList: () =>
        this.workflowService.getAllLegacyWorkflows() as object,
      manageCampaign: () => {
        const request = req.body as UpdateWorkflowLegacyRequest;
        return this.handleManageCampaignCommand(request);
      },
      addCampaign: () => ({}),
      listGroups: () => ({
        success: true,
        respText: "Group List",
        groups: ["ushurgroup1", "ushurgroup2", "ushurgroup3"],
      }),
      getSurl: () => ({
        surl: "https://iareact2-ui.ushur.dev/u/Hrt6cE",
        existingSurl: "false",
      }),
      getSurlList: () => ({
        batchCount: 1,
        totalCount: 1,
        lastRecordId: "615f46bc9099ab0d070e2abf",
        result: [
          {
            surl: "https://ianightingale420.ushur.dev/u/Dg3K8A",
            longUrl:
              "google.com/abcbljkdfdijkjldfdkjjiejkpackbyxbodefineladndkefde",
            createdTimestamp: "Thu Oct 07 19:13:00 UTC 2021",
            tags: ["be", "fullstack", "fe"],
          },
          {
            assetName: "IMG_20190707_103958.jpg",
            isAssetUrl: true,
            surl: "https://ianightingale420.ushur.dev/u/Ab5f3",
            longUrl: "ushur.com",
            createdTimestamp: "Thu Oct 07 19:13:00 UTC 2021",
            tags: [],
          },
        ],
      }),
      getUserInfo: () => ({
        users: [
          {
            userName: "Ushur1",
            userPhoneNo: "12341000001",
            Method: "api",
            id: "622d2136db1f8d3ed21c7fb3",
          },
        ],
      }),
      addAllContents: () => ({
        status: "success",
        respCode: 200,
        respText: "Uneda content update successful",
      }),
      getAllContents: () => {
        const { id } = req.body as { id: string | undefined };
        return this.handleGetAllContentsCommand(id);
      },
      getVariables: () => this.handleGetVariablesCommand(),
    };

    if (!cmd) {
      if (isArray(req.body)) {
        const data = this.handleGetSubRootCommand(req.body);
        return res(ctx.json(data));
      }
      return res(ctx.status(StatusCodes.BAD_REQUEST));
    }
    if (cmdMap[cmd]) {
      const data = ctx.json(cmdMap[cmd]());
      if (data) {
        return res(data);
      }
      return res(ctx.status(StatusCodes.NOT_FOUND));
    }
    return res(ctx.status(StatusCodes.BAD_REQUEST));
  };

  handleGetConfigCommand = () => ({});

  handleGetCampaignCommand = (campaignId: string | undefined) => {
    if (!campaignId) {
      return undefined;
    }
    return this.workflowService.findLegacyWorkflowById(campaignId);
  };

  handleGetSubRootCommand = (subRoots: object[]) =>
    this.workflowService.getLegacyWorkflowSubRootModules(subRoots);

  handleManageCampaignCommand = (
    request: UpdateWorkflowLegacyRequest | undefined
  ) => {
    if (!request) {
      return {
        status: "failure",
        respText: "The request is not defined",
      };
    }

    const { actionContext, modules } = request;
    const { campaignData } = modules[0] as LegacyRootModule;

    switch (actionContext) {
      case "updateCampaign": {
        // Perform some basic validation.
        const legacyWorkflow = this.workflowService.findLegacyWorkflowById(
          campaignData?.id as string
        );

        if (!legacyWorkflow) {
          return {
            status: "failure",
            respText: "The workflow could not be found",
          };
        }

        // If we're not adding/updating/deleting any modules then the existing
        // workflow sections should be the same length as the root JSON.
        // The real backend does not update the workflow if that is the case.
        if (
          modules.length <= 1 &&
          campaignData?.ui.sections.length !== legacyWorkflow.ui.sections.length
        ) {
          return undefined;
        }

        this.workflowService.updateLegacyWorkflow(
          campaignData as LegacyWorkflow
        );
        this.workflowService.updateLegacyWorkflowSubRootModules(modules);
        return {
          status: "success",
          respText: "Partial updates were successful",
        };
      }
      default:
        return {
          status: "failure",
          respText: "Unknown action context",
        };
    }
  };

  handleGetAllContentsCommand = (id: string | undefined) => {
    if (!id) {
      return undefined;
    }

    let getAllContentsResponse;

    if (id === "CVarMap") {
      getAllContentsResponse = {
        id: "CVarMap",
        content: [
          {
            _id: { $oid: "637528d52368c76ec13e28f4" },
            vars: [
              {
                c_uVar_uid_name: "uid_numeric_string",
                desc: "name",
                variable: "c_uVar_uid_name",
                type: "uid_numeric_string",
                private: "no",
              },
            ],
            campaignId: "Default-Main-01",
          },
        ],
      };
    } else if (id === "UshurDataTypeMap") {
      getAllContentsResponse = {
        id: "UshurDataTypeMap",
        content: [
          {
            _id: {
              $oid: "63513d63a1d48b4a5169535d",
            },
            type: "uid_string",
            title: "Text",
            desc: "Accept any text",
            computeOperations: "add",
            errorTxt: "Please enter the value again.",
          },
          {
            _id: {
              $oid: "63513d63a1d48b4a5169535f",
            },
            type: "uid_phoneNo",
            title: "Phone Number",
            desc: "Accept phone number",
            computeOperations: "add",
            errorTxt: "Please enter a valid Telephone number.",
          },
          {
            _id: {
              $oid: "63513d63a1d48b4a5169536a",
            },
            type: "uid_email",
            title: "Email",
            desc: "Accept email addresses",
            computeOperations: "add",
            errorTxt:
              "Please enter the email in the form of username@domain.xxx",
          },
        ],
      };
    } else if (id === "EVarMap") {
      getAllContentsResponse = {
        id: "EVarMap",
        content: [
          {
            _id: {
              $oid: "634faae16247d55826c9e65b",
            },
            e_EmailAddress: {
              prefix: "",
              id: "EmailAddress",
              suffix: "",
              type: "uid_email",
              desc: "EmailAddress",
            },
          },
        ],
      };
    } else {
      getAllContentsResponse = { id: "EVarMap", content: [] };
    }
    return getAllContentsResponse;
  };

  handleGetVariablesCommand = () => ({
    result: [
      {
        lastEngagementTime: "2022-12-01T07:19:01.568Z",
        requestId: "requestId",
        variables: {
          Choice: "1",
        },
        ueTag: "UeTag_216796",
      },
      {
        lastEngagementTime: "2022-11-30T08:48:47.572Z",
        requestId: "requestId",
        variables: {
          Name: "Football",
        },
        ueTag: "UeTag_506786",
      },
    ],
  });
}
