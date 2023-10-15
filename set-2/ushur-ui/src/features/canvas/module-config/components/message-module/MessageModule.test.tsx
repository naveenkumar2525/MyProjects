import { stateFactory } from "../../../../../mocks/factories/test/state";
import { render, screen } from "../../../../../utils/test.utils";
import MessageModule from "./MessageModule";
import { MessageModule as MessageModuleType } from "../../../../../api/api";
import ModuleTypes from "../../../interfaces/module-types";

test("should show the message module as selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      selectedModule: {
        id: ModuleTypes.MESSAGE_MODULE,
        type: ModuleTypes.MESSAGE_MODULE,
        title: "Message Header",
        text: "Message to display",
      } as MessageModuleType,
    },
  });

  render(<MessageModule />, {
    preloadedState,
  });
  const moduleContentElement = screen.getByText("Message Header to display");
  expect(moduleContentElement).toBeInTheDocument();
});
