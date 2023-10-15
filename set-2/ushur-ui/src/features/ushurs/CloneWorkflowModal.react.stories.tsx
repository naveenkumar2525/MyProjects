import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { rest } from "msw";
import {
  within,
} from "@storybook/testing-library";
import {store} from '../../app/store';
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CloneWorkflowModal, { CloneWorkflowModalProps } from "./CloneWorkflowModal.react";

export default {
  title: "Features/Ushurs/CloneWorkflowModal",
  component: CloneWorkflowModal,
  decorators: [(story) => <Provider store={store}><MemoryRouter>{story()}</MemoryRouter></Provider>],
} as ComponentMeta<typeof CloneWorkflowModal>;

const Template: ComponentStory<typeof CloneWorkflowModal> = (args: CloneWorkflowModalProps) => (
  <CloneWorkflowModal {...args} />
);

export const CloneWorkflowModalDefault = Template.bind({});

CloneWorkflowModalDefault.args = {
  handleModalClose: () => {}, 
  showModal: true,
  currentWorkflow:  'currentworkflow',
};

