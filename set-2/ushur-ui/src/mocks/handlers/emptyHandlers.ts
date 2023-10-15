import { rest } from "msw";
import createEmptyWorkflow from "../../features/canvas/emptyWorkflow";
import InfoQueryController from "../controllers/infoQueryController";
import getAllCampaignAssociationsFactory from "../factories/responses/getAllCampaignAssociationsFactory";
import LegacyWorkflowRepository from "../repository/workflowRepository";
import WorkflowService from "../services/workflow.service";

export const getAllCampaignAssociationsEmptyResponse =
  getAllCampaignAssociationsFactory.build({
    data: [],
  });

const emptyWorkflow = createEmptyWorkflow("someWorkflow");

const workflowService = new WorkflowService(
  new LegacyWorkflowRepository([emptyWorkflow])
);
const infoQueryController = new InfoQueryController(workflowService);

const emptyResponseHandlers = [
  rest.post(/\/infoQuery/, infoQueryController.handleCommand),
  rest.post(/\/getAllCampaignAssociations/, (_req, res, ctx) =>
    res(ctx.json(getAllCampaignAssociationsEmptyResponse))
  ),
  rest.get(/\/workflow/, (_req, res, ctx) => {
    const workflowDetails = {
      status: "success",
      respCode: 200,
      infoText: "Retrieved workflow details successfully",
    };
    return res(ctx.json(workflowDetails));
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
];

export default emptyResponseHandlers;
