import {
  createMockWorkflowWithLinkedSteps,
  createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule,
} from "../../../api/utils/mocks";
import JointJsDiagrammingService from "./jointjs-diagramming-service";

describe("getInboundStepsToCell", () => {
  let diagrammingService: JointJsDiagrammingService;
  beforeEach(() => {
    jest.spyOn(global.document, "querySelector").mockResolvedValue([] as never);
    diagrammingService = new JointJsDiagrammingService({
      canvas: ".canvas",
      toolbar: ".toolbar-container",
      paper: ".paper-container",
    });
  });

  test("when there are no inbound or outbound steps", () => {
    jest.spyOn(diagrammingService, "getElementById").mockReturnValue(null);
    const { workflow, step2 } =
      createMockWorkflowWithTwoStepsWithAnUnlinkedMessageModule();

    const result = diagrammingService.getInboundAndOutboundStepsToCell(
      workflow,
      step2
    );
    expect(result).toEqual({ inboundStepsToCell: [], outboundStepsToCell: [] });
  });

  test("a step that is inbound to another step", () => {
    const { workflow, step1, step2 } = createMockWorkflowWithLinkedSteps();

    const result = diagrammingService.getInboundAndOutboundStepsToCell(
      workflow,
      step2
    );

    expect(result).toEqual({
      inboundStepsToCell: [step1],
      outboundStepsToCell: [],
    });
  });

  test("a step that is outbound to another step", () => {
    const { workflow, step1, step2 } = createMockWorkflowWithLinkedSteps();

    const result = diagrammingService.getInboundAndOutboundStepsToCell(
      workflow,
      step1
    );

    expect(result).toEqual({
      inboundStepsToCell: [],
      outboundStepsToCell: [step2],
    });
  });
});
