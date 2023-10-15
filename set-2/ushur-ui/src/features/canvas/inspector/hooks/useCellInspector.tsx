import { useCallback, useEffect, useState } from "react";
import { DiagramCell } from "../../interfaces/diagramming-service";

interface Props {
  cell: DiagramCell;
  assignFormFields: () => void;
}

const useCellInspector = (
  props: Props
): ((path: (string | number)[], value: string) => void) => {
  const { cell, assignFormFields } = props;

  const [context] = useState({ id: cell.getId() });

  const addCellListener = useCallback((): void => {
    cell.on(
      "change",
      () => {
        assignFormFields();
      },
      context
    );
  }, [cell, assignFormFields, context]);

  const removeCellListener = useCallback((): void => {
    cell.off(null, () => {}, context);
  }, [cell, context]);

  const changeCellProp = (path: (string | number)[], value: string): void => {
    cell.setValue(path, value);
  };

  useEffect(() => {
    addCellListener();
    assignFormFields();
    return () => {
      removeCellListener();
    };
  }, [assignFormFields, addCellListener, removeCellListener]);

  return changeCellProp;
};

export default useCellInspector;
