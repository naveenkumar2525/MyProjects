import { Provider } from "react-redux";
import { screen, userEvent, within } from "@storybook/testing-library";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "../../utils/test.utils";
import UshursList from "./UshursList.react";
import defaultHandlers from "../../mocks/handlers/defaultHandlers";
import emptyResponseHandlers from "../../mocks/handlers/emptyHandlers";

export default {
  title: "Features/Ushurs/UshursList",
  component: UshursList,
  decorators: [
    (story) => (
      <Provider store={createStore()}>
        <MemoryRouter>{story()}</MemoryRouter>
      </Provider>
    ),
  ],
} as ComponentMeta<typeof UshursList>;

const Template: ComponentStory<typeof UshursList> = (args: any) => (
  <UshursList {...args} />
);

export const EmptyUshursList = Template.bind({});

EmptyUshursList.parameters = {
  msw: {
    handlers: emptyResponseHandlers,
  },
};

export const DefaultUshursList = Template.bind({});

DefaultUshursList.parameters = {
  msw: {
    handlers: defaultHandlers,
  },
};

export const SortedByNameDescendingUshursList = Template.bind({});
SortedByNameDescendingUshursList.parameters = {
  msw: {
    handlers: defaultHandlers,
  },
};

SortedByNameDescendingUshursList.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getByRole("heading", { name: "Projects" });
  const createWorkflowButton = canvas.getByRole("button", {
    name: "Sort by Recent",
  });
  userEvent.click(createWorkflowButton);
  const select = screen.getByText(/(descending)/);
  userEvent.click(select);
};
