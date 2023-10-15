import CanvasPage from "./CanvasPage.react";
import { screen, render, RenderResult } from "../../utils/test.utils";
import JointJsDiagrammingService, {
  JointJsDiagrammingSelectors,
} from "./diagramming/jointjs/services/jointjs-diagramming-service";
import { server } from "../../mocks/server";
import { DiagrammingEventListeners } from "./interfaces/diagramming-service";
import { diagrammingCellFactory } from "../../mocks/factories/test/state";
import { validateModuleConfigurationView } from "./inspector/StepInspector.test";
import { Workflow } from "../../api";
import emptyResponseHandlers from "../../mocks/handlers/emptyHandlers";

// Mock the JointJs diagramming service since it heavily uses SVG and
// the jsdom library that React testing library uses doesn't support SVG well
// Note that many of the JointJs specific tests are covered by BDD Playwright tests in
// the root tests directory.
jest.mock("./diagramming/jointjs/services/jointjs-diagramming-service");

jest.mock("../../custom-hooks/useUrlSearchParams", () => ({
  __esModule: true,
  default: () => ({
    workflowId: "someWorkflow",
  }),
}));

// Mock the import of a workflow.
// Simply add all workflow steps as buttons in the DOM
const mockImportWorkflow =
  (container: RenderResult) => (workflow: Workflow) => {
    for (const step of workflow.ui?.cells ?? []) {
      if (step.type !== "app.Step") {
        continue;
      }
      const btn = document.createElement("button");
      btn.classList.add("joint-cell");
      btn.innerHTML = step?.attrs?.label?.text ?? "";
      container.container.appendChild(btn);
    }
  };

test("empty workflow", async () => {
  // Configure API requests to return empty data
  server.use(...emptyResponseHandlers);

  const container = render(
    <CanvasPage debug={false} shouldShowPerformanceStats={false} />
  );

  // Override the import of workflows
  jest
    .spyOn(JointJsDiagrammingService.prototype, "import")
    .mockImplementation(mockImportWorkflow(container));

  // Ensure a core button exists on the canvas
  let element = screen.getByRole("button", {
    name: "Test Workflow",
  });
  expect(element).toBeInTheDocument();

  // Ensure the welcome step exists
  element = await screen.findByText("Welcome!");
  expect(element).toBeInTheDocument();

  // Other steps from the default workflow should not exist
  const elementShouldNotExist = screen.queryByText("Send IA");
  expect(elementShouldNotExist).not.toBeInTheDocument();
});

test("inspect a step", async () => {
  const container = render(
    <CanvasPage debug={false} shouldShowPerformanceStats={false} />
  );

  // Override the import of workflows
  jest
    .spyOn(JointJsDiagrammingService.prototype, "import")
    .mockImplementation(mockImportWorkflow(container));

  // Wait for an expected step to appear
  const element = await screen.findByText("Send IA");
  expect(element).toBeInTheDocument();

  // Get access to the diagramming service event listeners
  // that were passed in the constructor
  const diagrammingServiceMock = JointJsDiagrammingService as jest.Mock;
  const diagramingServiceCtorCall = diagrammingServiceMock.mock.calls as [
    [JointJsDiagrammingSelectors, DiagrammingEventListeners, boolean]
  ];
  const diagrammingEventListeners = diagramingServiceCtorCall[0][1];

  // When we open the inspector, ensure any cell lookup uses a mocked cell
  const diagramCell = diagrammingCellFactory.build();
  jest
    .spyOn(JointJsDiagrammingService.prototype, "getCellById")
    .mockImplementation(diagramCell);

  // Now trigger a cell pointer click event
  diagrammingEventListeners["element:pointerdown"]({
    selectedCellId: "test cell",
  });

  // Check that the inspector actually opened by finding expected text
  expect(await screen.findByText("Some title")).toBeVisible();

  // Validate the view after inspector is opened
  validateModuleConfigurationView();

  // Now trigger clicking on a blank part of the canvas
  diagrammingEventListeners["blank:pointerdown"]();

  expect(await screen.findByText("Some title")).not.toBeVisible();
});

test("default workflow", async () => {
  const container = render(
    <CanvasPage debug={false} shouldShowPerformanceStats={false} />
  );

  // Override the import of workflows
  jest
    .spyOn(JointJsDiagrammingService.prototype, "import")
    .mockImplementation(mockImportWorkflow(container));

  // Ensure a core button exists on the canvas
  let element = screen.getByRole("button", {
    name: "Test Workflow",
  });
  expect(element).toBeInTheDocument();

  // Ensure all expected steps exist
  element = await screen.findByText("Welcome!");
  expect(element).toBeInTheDocument();

  element = await screen.findByText("Send IA");
  expect(element).toBeInTheDocument();

  element = await screen.findByText("Create New Member");
  expect(element).toBeInTheDocument();

  element = await screen.findByText("Main Menu");
  expect(element).toBeInTheDocument();

  element = await screen.findByText("Schedule Appointment");
  expect(element).toBeInTheDocument();

  element = await screen.findByText("Send Appointment");
  expect(element).toBeInTheDocument();

  element = await screen.findByText("Select PCP");
  expect(element).toBeInTheDocument();

  element = await screen.findByText("Thank you");
  expect(element).toBeInTheDocument();
});

test("test workflow", async () => {
  // Configure API requests to return empty data
  const container = render(
    <CanvasPage debug={false} shouldShowPerformanceStats={false} />
  );

  // Override the import of workflows
  jest
    .spyOn(JointJsDiagrammingService.prototype, "import")
    .mockImplementation(mockImportWorkflow(container));

  // Ensure an expected step exists
  let element = await screen.findByText("Welcome!");
  expect(element).toBeInTheDocument();

  // Ensure a core button exists on the canvas
  element = screen.getByRole("button", {
    name: "Test Workflow",
  });
  expect(element).toBeInTheDocument();

  // Clicking should put the canvas into read only mode
  element.click();
  // TODO: Validate read only mode

  // Clicking again should put the canvas into write mode
  element.click();
  // TODO: Validate write mode
});

test("add step context menu", async () => {
  // Configure API requests to return empty data
  const container = render(
    <>
      <div id="add-step-menu-wrapper" />
      <CanvasPage debug={false} shouldShowPerformanceStats={false} />
    </>
  );

  // Override the import of workflows
  jest
    .spyOn(JointJsDiagrammingService.prototype, "import")
    .mockImplementation(mockImportWorkflow(container));

  // Wait for an expected step to appear
  let element = await screen.findByText("Send IA");
  expect(element).toBeInTheDocument();

  // Get access to the diagramming service event listeners
  // that were passed in the constructor
  const diagrammingServiceMock = JointJsDiagrammingService as jest.Mock;
  const diagramingServiceCtorCall = diagrammingServiceMock.mock.calls as [
    [JointJsDiagrammingSelectors, DiagrammingEventListeners, boolean]
  ];
  const diagrammingEventListeners = diagramingServiceCtorCall[0][1];

  // When we open the inspector, ensure any cell lookup uses a mocked cell
  const diagramCell = diagrammingCellFactory.build();
  jest
    .spyOn(JointJsDiagrammingService.prototype, "getCellById")
    .mockImplementation(diagramCell);

  // Trigger the add step context menu
  diagrammingEventListeners.onClickAddStepBtnInBranch();

  // Detect that the add step menu has been opened
  element = await screen.findByText("ADD STEP");
  expect(element).toBeInTheDocument();
  const addStepInBranchElement = await screen.findByText("In this branch");
  expect(addStepInBranchElement).toBeInTheDocument();
  element = await screen.findByText("On new branch");
  expect(element).toBeInTheDocument();
  element = await screen.findByText("Delete branch");
  expect(element).toBeInTheDocument();

  // Ensure we can attempt to add a step
  const onClickAddStepPopupMenuSpy = jest.spyOn(
    JointJsDiagrammingService.prototype,
    "onClickAddStepPopupMenu"
  );
  addStepInBranchElement.click();
  expect(onClickAddStepPopupMenuSpy).toBeCalledTimes(1);
});
