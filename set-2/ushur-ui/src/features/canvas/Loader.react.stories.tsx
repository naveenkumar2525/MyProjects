import { ComponentStory, ComponentMeta } from "@storybook/react";
import SimulatorLoader from "../../components/SimulatorLoader.react";

export default {
  title: "Component/SimulatorLoader",
  component: SimulatorLoader,
} as ComponentMeta<typeof SimulatorLoader>;

const Template: ComponentStory<typeof SimulatorLoader> = () => (
  <SimulatorLoader />
);

export const DefaultSimulatorLoader = Template.bind({});
