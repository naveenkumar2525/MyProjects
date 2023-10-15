import { Factory } from "fishery";
import { WorkflowVariables } from "../../api";

const canvasVariablesFactory = Factory.define<WorkflowVariables>(() => ({
  id: "CVarMap",
  content: [
    {
      id: { oid: "637528d52368c76ec13e28f4" },
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
}));

export default canvasVariablesFactory;
