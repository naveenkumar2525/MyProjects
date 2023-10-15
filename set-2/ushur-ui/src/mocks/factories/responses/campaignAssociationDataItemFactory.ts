import { Factory } from "fishery";
import CampaignAssociationDataItem from "../../../types/campaignAssociationsDataItem";

const campaignAssociationDataItemFactory =
  Factory.define<CampaignAssociationDataItem>(({ sequence }) => ({
    callbackNum: "+14088052692",
    regCmd: `UshurDefault_Hello_${sequence}`,
    campaignDesc: "",
    campaignId: `Hello ${sequence}`,
    active: "Y",
  }));

export default campaignAssociationDataItemFactory;
