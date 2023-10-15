import { Factory } from "fishery";
import CampaignAssociation from "../../../types/campaignAssociations";
import campaignAssociationDataItemFactory from "./campaignAssociationDataItemFactory";

const getAllCampaignAssociationsFactory = Factory.define<CampaignAssociation>(
  () => ({
    status: "success",
    respCode: 200,
    data: campaignAssociationDataItemFactory.buildList(2),
    infoText: "Json data retrieved successfully.",
  })
);

export default getAllCampaignAssociationsFactory;
