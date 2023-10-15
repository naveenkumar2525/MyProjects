import { rest } from "msw";
import createEmptyWorkflow from "../../features/canvas/emptyWorkflow";
import InfoQueryController from "../controllers/infoQueryController";
import getAllCampaignAssociationsFactory from "../factories/responses/getAllCampaignAssociationsFactory";
import generateData from "../generate/massCanvasTest";
import LegacyWorkflowRepository from "../repository/workflowRepository";
import WorkflowService from "../services/workflow.service";

export const getAllCampaignAssociationsEmptyResponse =
  getAllCampaignAssociationsFactory.build({
    data: [],
  });

const bigWorkflow = createEmptyWorkflow("someWorkflow");
bigWorkflow.ui.cells = generateData(500);

const workflowService = new WorkflowService(
  new LegacyWorkflowRepository([bigWorkflow])
);
const infoQueryController = new InfoQueryController(workflowService);

const massHandlers = [
  rest.post(/\/infoQuery/, infoQueryController.handleCommand),
  rest.post(/\/getAllCampaignAssociations/, (_req, res, ctx) =>
    res(ctx.json(getAllCampaignAssociationsEmptyResponse))
  ),
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

export default massHandlers;
