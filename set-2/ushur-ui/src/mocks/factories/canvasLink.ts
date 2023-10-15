import { Factory } from "fishery";
import { v4 as uuidv4 } from "uuid";
import { WorkflowLink } from "../../api";

const canvasLinkFactory = Factory.define<WorkflowLink>(({ sequence }) => ({
  id: `${sequence + 1}`,
  type: "app.Link",
  labels: [
    {
      id: uuidv4(),
      attrs: {
        labelText: {
          text: "",
        },
      },
      position: {
        distance: 0.25,
        offset: 0,
        angle: 0,
      },
    },
  ],
  source: {
    id: `${sequence + 2}`,
    magnet: "portBody",
    port: "",
  },
  target: {
    id: `${sequence + 3}`,
    magnet: "portBody",
    port: "",
  },
  z: 7,
  attrs: {},
}));

export default canvasLinkFactory;
