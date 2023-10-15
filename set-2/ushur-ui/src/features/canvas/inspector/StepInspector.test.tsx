import { userEvent } from "@storybook/testing-library";
import {
  stateFactory,
  diagrammingCellFactory,
} from "../../../mocks/factories/test/state";
import { render, screen, within } from "../../../utils/test.utils";
import StepInspector from "./StepInspector";
import { MessageModule } from "../../../api";
import ModuleTypes from "../interfaces/module-types";

// Validate the view when a user clicks on a step and
// sees a list of modules to configure.
// eslint-disable-next-line import/prefer-default-export
export const validateModuleConfigurationView = () => {
  const stepInspectorHeader = screen.getByTestId("step-inspector-header");
  const stepInspectorHeaderContainer = within(stepInspectorHeader);

  let element = stepInspectorHeaderContainer.getByTitle("Question Mark");
  expect(element).toBeInTheDocument();
  element = stepInspectorHeaderContainer.getByTitle("Dropdown Chevron");
  expect(element).toBeInTheDocument();
  element = stepInspectorHeaderContainer.getByTitle("Close Inspector");
  expect(element).toBeInTheDocument();

  element = stepInspectorHeaderContainer.getByText("Some title");
  expect(element).toBeInTheDocument();
  element = stepInspectorHeaderContainer.getByText("Some description");
  expect(element).toBeInTheDocument();

  const stepInspectorBody = screen.getByTestId("step-inspector-body");
  const stepInspectorBodyContainer = within(stepInspectorBody);

  element = stepInspectorBodyContainer.getByText("Engagement modules");
  expect(element).toBeInTheDocument();
  element = stepInspectorBodyContainer.getByText("Utility modules");
  expect(element).toBeInTheDocument();

  const modules = stepInspectorBodyContainer.getAllByRole("button");

  const expectedModules = [
    "Message",
    "Menu",
    "Form",
    "Branch",
    "Compute",
    "AI/ML",
  ];
  expect(modules).toHaveLength(expectedModules.length);

  for (let i = 0; i < modules.length; i += 1) {
    expect(modules[i]).toHaveTextContent(expectedModules[i]);
  }
};

// Validate the view when a user clicks on a module and
// sees details of that module.
const validateModuleDetailView = () => {
  let element = screen.getByTitle("Smile Icon");
  expect(element).toBeInTheDocument();
  element = screen.getByTitle("Dropdown Chevron");
  expect(element).toBeInTheDocument();
  element = screen.getByTitle("Close Inspector");
  expect(element).toBeInTheDocument();
  element = screen.getByTitle("Back to module list");
  expect(element).toBeInTheDocument();

  element = screen.getByText("Some title");
  expect(element).toBeInTheDocument();
  element = screen.getByText("Some description");
  expect(element).toBeInTheDocument();
};

test("should show the a list of configurable modules if no module is selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: undefined, // No module is selected.
    },
  });

  const diagramCell = diagrammingCellFactory.build()();

  render(<StepInspector cell={diagramCell} />, {
    preloadedState,
  });

  validateModuleConfigurationView();
});

test("should show details of a selected module", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: {
        text: "This is my module",
        id: "some module id",
        type: ModuleTypes.MESSAGE_MODULE,
        title: "My module",
      } as MessageModule,
    },
  });

  const diagramCell = diagrammingCellFactory.build()();

  render(<StepInspector cell={diagramCell} />, {
    preloadedState,
  });

  validateModuleDetailView();
});

test("should be able to invoke closing the inspector when viewing the module configuration", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
    },
  });

  const diagramCell = diagrammingCellFactory.build()();

  render(<StepInspector cell={diagramCell} />, {
    preloadedState,
  });

  const element = screen.getByTitle("Close Inspector");
  expect(element).toBeInTheDocument();

  // Simply validate that the close can be invoked
  // Closing the whole inspector is validated at a higher level component.
  userEvent.click(element);
});

test("should be able to invoke closing the inspector when viewing a module's details", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: {
        text: "This is my module",
        id: "some module id",
        type: ModuleTypes.MESSAGE_MODULE,
        title: "My module",
      } as MessageModule,
    },
  });

  const diagramCell = diagrammingCellFactory.build()();

  render(<StepInspector cell={diagramCell} />, {
    preloadedState,
  });

  const element = screen.getByTitle("Close Inspector");
  expect(element).toBeInTheDocument();

  // Simply validate that the close can be invoked
  // Closing the whole inspector is validated at a higher level component.
  userEvent.click(element);
});

test("should be able to navigate back to module configuration from module details", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: {
        text: "This is my module",
        id: "some module id",
        type: ModuleTypes.MESSAGE_MODULE,
        title: "My module",
      } as MessageModule,
    },
  });

  const diagramCell = diagrammingCellFactory.build()();
  render(<StepInspector cell={diagramCell} />, {
    preloadedState,
  });

  validateModuleDetailView();

  const element = screen.getByTitle("Back to module list");
  expect(element).toBeInTheDocument();

  userEvent.click(element);

  validateModuleConfigurationView();
});
