import { ReactElement } from "react";
import StepInspector from "./StepInspector";
import { useAppSelector } from "../../../app/hooks";
import { diagrammingService, selectedCellId } from "../data/canvasSlice";
import { Shapes } from "../interfaces/diagramming-service";

import "./Inspector.css";

const Inspector = (): ReactElement => {
  const selection = useAppSelector(selectedCellId);
  const diagrammingSvc = useAppSelector(diagrammingService);
  if (!selection) return <></>;
  const cell = diagrammingSvc?.getCellById(selection);
  if (!cell) return <></>;
  if (cell.getType() === Shapes.LINK) {
    return <></>;
  }
  return (
    <div className="canvas-inspector">
      <StepInspector cell={cell} />
    </div>
  );
};

export default Inspector;
