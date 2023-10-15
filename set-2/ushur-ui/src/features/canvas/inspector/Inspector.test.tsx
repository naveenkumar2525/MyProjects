import {
  diagrammingCellFactory,
  diagrammingServiceFactory,
  stateFactory,
} from "../../../mocks/factories/test/state";
import { render, screen } from "../../../utils/test.utils";
import { Shapes } from "../interfaces/diagramming-service";
import Inspector from "./Inspector";
import { validateModuleConfigurationView } from "./StepInspector.test";

test("should not show the inspector when no step is selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: undefined,
    },
  });

  render(<Inspector />, {
    preloadedState,
  });

  const element = screen.queryByText("Some title");
  expect(element).not.toBeInTheDocument();
});

test("should not show the inspector when a step is selected the corresponding cell cannot be found", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      diagrammingService: diagrammingServiceFactory.build({
        // Ensure a cell lookup fails
        getCellById: jest.fn().mockImplementation(() => undefined),
      }),
    },
  });

  render(<Inspector />, {
    preloadedState,
  });

  const element = screen.queryByText("Some title");
  expect(element).not.toBeInTheDocument();
});

test("should not show the inspector when the cell type is a LINK", () => {
  // Create a diagram cell that is a LINK
  const diagramCell = diagrammingCellFactory.build()();
  jest.spyOn(diagramCell, "getType").mockImplementation(() => Shapes.LINK);

  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
      diagrammingService: diagrammingServiceFactory.build({
        getCellById: jest.fn().mockReturnValue(diagramCell),
      }),
    },
  });
  render(<Inspector />, {
    preloadedState,
  });

  const element = screen.queryByText("Some title");
  expect(element).not.toBeInTheDocument();
});

test("should show the inspector when a step is selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
    },
  });

  render(<Inspector />, {
    preloadedState,
  });

  validateModuleConfigurationView();
});
