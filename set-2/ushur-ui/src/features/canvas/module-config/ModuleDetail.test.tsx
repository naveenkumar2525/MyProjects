import { stateFactory } from "../../../mocks/factories/test/state";
import { render, screen } from "../../../utils/test.utils";
import ModuleDetail from "./ModuleDetail";
import { MessageModule, MenuModule } from "../../../api/api";
import ModuleTypes from "../interfaces/module-types";

test("should show that no module is selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: undefined,
    },
  });

  render(<ModuleDetail />, {
    preloadedState,
  });
  const moduleHeaderElement = screen.getByText("Loading");
  expect(moduleHeaderElement).toBeInTheDocument();
});

test("should show the message module as selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: {
        id: ModuleTypes.MESSAGE_MODULE,
        type: ModuleTypes.MESSAGE_MODULE,
        title: "Message Header",
        text: "Message to display",
      } as MessageModule,
    },
  });

  render(<ModuleDetail />, {
    preloadedState,
  });
  const moduleHeaderElement = screen.getByText("Message Header Module");
  expect(moduleHeaderElement).toBeInTheDocument();
  const moduleContentElement = screen.getByText("Message Header to display");
  expect(moduleContentElement).toBeInTheDocument();
});

test("should show the menu module as selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: {
        id: ModuleTypes.MENU_MODULE,
        type: ModuleTypes.MENU_MODULE,
        title: "Menu Information",
        text: "<h2>Main Menu</h2>",
        menuOptions: [],
        menuUserSelection: "",
        errorLimitValue: "Test 3",
        errorBranchTo: "Branch Module Test 1",
      } as MenuModule,
    },
  });

  render(<ModuleDetail />, {
    preloadedState,
  });
  const moduleHeaderElement = screen.getByText("Menu Information Module");
  expect(moduleHeaderElement).toBeInTheDocument();
  const moduleContentElement = screen.getByText("Menu Information heading");
  expect(moduleContentElement).toBeInTheDocument();
});
