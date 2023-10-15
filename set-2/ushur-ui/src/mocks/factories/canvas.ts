import { Factory } from "fishery";
import { v4 as uuidv4 } from "uuid";
import { Workflow } from "../../api";
import canvasStepFactory from "./canvasStep";

interface CanvasTransientParams {
  numSteps: number;
}

const canvasFactory: Factory<Workflow, CanvasTransientParams, Workflow> =
  Factory.define<Workflow, CanvasTransientParams>(({ transientParams }) => {
    const id = uuidv4();
    return {
      id,
      AppContext: "Some AppContext",
      name: id,
      author: "some author",
      languages: {},
      virtualPhoneNumber: "40123811234",
      callbackNumber: "80123811234",
      lastEdited: new Date().toISOString(),
      UshurDescriptions: {},
      lang: "en",
      active: false,
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
        campaignId: id,
        active: false,
        UeTagStructure: {
          ushurId: id,
          result: [
            {
              message: "This is a message",
              UeTag: "UeTag_458433",
            },
          ],
          tagCount: 1,
        },
        cells: canvasStepFactory.buildList(transientParams.numSteps ?? 0),
        sections: [],
      },
      ia: {},
    };
  });

export default canvasFactory;
