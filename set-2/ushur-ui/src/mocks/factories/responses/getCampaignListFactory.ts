import { Factory } from "fishery";
import CampaignList from "../../../types/campaignList";
import campaignFactory from "./campaignFactory";

const getCampaignListFactory = Factory.define<CampaignList>(() => ({
  campaignList: campaignFactory.buildList(6),
}));

export default getCampaignListFactory;
