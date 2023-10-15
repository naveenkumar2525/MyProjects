import CampaignAssociationDataItem from "./campaignAssociationsDataItem";

export default class CampaignAssociation {
  status!: string;
  respCode!: number;
  data!: CampaignAssociationDataItem[];
  infoText!: string;
}