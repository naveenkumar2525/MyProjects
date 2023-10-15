import { Factory } from "fishery";
import { v4 as uuidv4 } from "uuid";
import { LegacyWorkflow } from "../../api";

const legacyWorkflowFactory: Factory<LegacyWorkflow> =
  Factory.define<LegacyWorkflow>(() => {
    const id = uuidv4();
    return {
      id,
      AppContext: "Some AppContext",
      name: id,
      author: "some author",
      Languages: {},
      virtualPhoneNumber: "40123811234",
      callbackNumber: "80123811234",
      lastEdited: Date.toString(),
      UshurDescriptions: {},
      active: false,
      lang: "en",
      visuallyUshur: false,
      welcome: undefined,
      routines: {
        Ushur_Initial_Routine: {
          action: "goToMenu",
          params: {
            menuId: "{{DEFAULTNEXT}}",
            stayInCampaign: true,
          },
        },
      },
      ui: {
        active: false,
        cells: [],
        sections: [],
      },
      ia: {},
    };
  });

export default legacyWorkflowFactory;
