import { Factory } from "fishery";
import Campaign from "../../../types/campaign";

const campaignFactory = Factory.define<Campaign>(({ sequence }) => ({
  campaignId: `Campaign ${sequence.toString()}`,
  templateId: null,
  lastEdited: new Date("2022-06-19").toString(),
  author: "TEST_ADMIN@USHURDUMMY.ME",
  AppContext: "Main",
  Languages: "{ }",
  IsInvisible: "Y",
  description: "Some description",
}));

export default campaignFactory;
