import { Factory } from "fishery";
import { v4 as uuidv4 } from "uuid";
import { MessageModule, WorkflowStep } from "../../api";

export type StepTransientParams = {
  label: string;
  description: string;
  icon: string;
  x: number;
  y: number;
  modules: MessageModule[];
};

const configureModules = (transientParams: Partial<StepTransientParams>) =>
  transientParams.modules ?? [];

const canvasStepFactory = Factory.define<WorkflowStep, StepTransientParams>(
  ({ sequence, transientParams }) => ({
    id: uuidv4(),
    type: "app.Step",
    ports: {
      items: [
        {
          id: uuidv4(),
          group: "in",
        },
        {
          id: uuidv4(),
          group: "out",
        },
      ],
    },
    modules: configureModules(transientParams),
    position: {
      x: transientParams.x ?? sequence * 100,
      y: transientParams.y ?? sequence * 120,
    },
    z: 1,
    attrs: {
      label: {
        text: transientParams.label ?? "Welcome!",
      },
      description: {
        text:
          transientParams.description ??
          "Please enter in a description for this step",
      },
      icon: {
        text: transientParams.icon ?? "",
      },
    },
  })
);

export default canvasStepFactory;
