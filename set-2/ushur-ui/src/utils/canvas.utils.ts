import { dia } from "@clientio/rappid";
import {
  Group,
  AllSteps,
  Shapes,
  DiagramCell,
} from "../features/canvas/interfaces/diagramming-service";
import {
  WorkflowStep,
  WorkflowStepPorts,
  WorkflowStepPortsItems,
  WorkflowLink,
  WorkflowLinkSource,
} from "../api";
export const portIdfromCell = (cell: dia.Cell, group: Group) => {
  if (cell.attributes.ports) {
    const Port = cell.attributes?.ports?.items?.find(
      (item: any) => item.group === group
    );
    if (Port) return Port.id;
    return null;
  }
  return null;
};

export const getOffset = (zoomLevel: any) => {
  // this function is a trick to help popup box to fit to exact position of button
  switch (zoomLevel.toFixed(1)) {
    case "0.8":
      return {
        offsetX: 15,
        offsetY: 5,
      };
    case "1.0":
      return {
        offsetX: 16,
        offsetY: 3,
      };
    case "1.2":
      return {
        offsetX: 15,
        offsetY: 2,
      };
    case "1.4":
      return {
        offsetX: 15,
        offsetY: 0,
      };
    case "1.6":
      return {
        offsetX: 15,
        offsetY: 0,
      };
    case "1.8":
      return {
        offsetX: 15,
        offsetY: 0,
      };
    default:
      return {
        offsetX: 15,
        offsetY: 0,
      };
  }
};

export const getAllSteps = (cells: dia.Cell[]): AllSteps => {
  const steps = cells.filter((cell) => cell.attributes.type === "app.Step");
  const links = cells.filter((cell) => cell.attributes.type === "app.Link");
  const linkSourceIds = links.map((link) => link.attributes.source.id);
  const childlessSteps = steps.filter(
    (step) => !linkSourceIds.includes(step.id)
  );
  const childfulSteps = steps.filter((step) => linkSourceIds.includes(step.id));
  return { childfulSteps, childlessSteps };
};

export const getLinesAndAddStepShapes = (cells: dia.Cell[]): dia.Cell.ID[] => {
  const lines = cells.filter((cell) => cell.attributes.type === Shapes.LINE);
  const addStepShapes = cells.filter(
    (cell) => cell.attributes.type === Shapes.ADDSTEP
  );
  const lineIds = lines.map((line) => line.id);
  const addStepShapesIds = addStepShapes.map((addStepShape) => addStepShape.id);
  return [...lineIds, ...addStepShapesIds];
};

export const paintPrimaryColorToPath = (
  diagramCell: DiagramCell,
  path: string
) => {
  diagramCell.setValue(`${path}/type`, "linearGradient");
  diagramCell.setValue(`${path}/stops`, [
    { offset: "0%", color: "#2F80ED" },
    { offset: "100%", color: "#8A69FF" },
  ]);
  diagramCell.setValue(`${path}/attrs`, {
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%",
  });
};

export const translateJointJsCellToWorkflowStep = (
  attributes: dia.Cell.Attributes
): WorkflowStep => {
  const newPortItems: WorkflowStepPorts = attributes.ports.items.map(
    (item: any) => {
      const newPortItem: WorkflowStepPortsItems = {
        id: item.id,
        group: item.group,
      };
      return newPortItem;
    }
  );
  const newWorkflowStep: WorkflowStep = {
    id: attributes.id,
    type: Shapes.STEP,
    ports: newPortItems,
    labels: [],
    modules: [],
    attrs: attributes.attrs,
    position: attributes.position,
  };
  return newWorkflowStep;
};

export const translateJointJsCellToWorkflowLink = (
  attributes: dia.Cell.Attributes
): WorkflowLink => {
  const workflowLinkSource: WorkflowLinkSource = {
    id: attributes.source.id,
    port: attributes.source.port,
  };
  const workflowLinkTarget: WorkflowLinkSource = {
    id: attributes.target.id,
    port: attributes.target.port,
  };
  const newWorkflowLink: WorkflowLink = {
    id: attributes.id,
    type: Shapes.LINK,
    labels: [],
    attrs: attributes.attrs,
    source: workflowLinkSource,
    target: workflowLinkTarget,
    z: attributes.z,
  };
  return newWorkflowLink;
};
