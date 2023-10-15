import { Provider } from "react-redux";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { ReactChild, ReactFragment, ReactPortal, useEffect } from "react";
import { withQuery } from "@storybook/addon-queryparams";
import { createStore } from "../../utils/test.utils";
import CanvasPage from "./CanvasPage.react";
import defaultHandlers from "../../mocks/handlers/defaultHandlers";
import emptyResponseHandlers from "../../mocks/handlers/emptyHandlers";
import massHandlers from "../../mocks/handlers/massHandler";

export default {
  title: "Features/Canvas/Page",
  component: CanvasPage,
  decorators: [
    withQuery,
    (
      story: () =>
        | boolean
        | ReactChild
        | ReactFragment
        | ReactPortal
        | null
        | undefined
    ) => (
      <Provider store={createStore()}>
        <MemoryRouter>{story()}</MemoryRouter>
      </Provider>
    ),
  ],
  parameters: {
    query: {
      workflowId: "someWorkflow",
    },
  },
} as ComponentMeta<typeof CanvasPage>;

interface Props {
  shouldShowPerformanceStats: boolean;
}
const CanvasWrapper = ({ shouldShowPerformanceStats }: Props) => {
  // By default Storybook doesn't focus on the canvas :-(.
  // There are keyboard defaults in Storybook's menu. One of them is to
  // focus the canvas with the shortcut key '2'.
  // However, that is not convenient to have to press it each time the story loads.
  // Therefore, this wrapper exists to auto-focus the canvas instead.
  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    const frameEl: HTMLIFrameElement = frameElement as HTMLIFrameElement;
    if (frameEl) {
      frameEl?.contentWindow?.focus();
    }
  }, []);
  return (
    <div>
      <CanvasPage
        debug
        shouldShowPerformanceStats={shouldShowPerformanceStats}
      />
    </div>
  );
};

const Template: (
  shouldShowPerformanceStats: boolean
) => ComponentStory<typeof CanvasPage> =
  (shouldShowPerformanceStats: boolean) => () =>
    <CanvasWrapper shouldShowPerformanceStats={shouldShowPerformanceStats} />;

export const EmptyWorkflow = Template(false);

EmptyWorkflow.parameters = {
  layout: "fullscreen",
  msw: {
    handlers: emptyResponseHandlers,
  },
};

export const BasicWorkflow = Template(false);

BasicWorkflow.parameters = {
  layout: "fullscreen",
  msw: {
    handlers: defaultHandlers,
  },
};

export const MassWorkflow = Template(true);

MassWorkflow.parameters = {
  layout: "fullscreen",
  msw: {
    handlers: massHandlers,
  },
};
