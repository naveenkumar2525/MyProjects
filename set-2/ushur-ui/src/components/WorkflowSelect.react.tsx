import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Dropdown,
  // @ts-ignore
} from "@ushurengg/uicomponents";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { activeUshurs, getActiveUshurs } from "../features/ushurs/ushursSlice";

type Props = {
  onSelect: (val: any) => any;
};

const WorkflowSelect = (props: Props) => {
  const { onSelect } = props;
  const dispatch = useAppDispatch();
  const activeUshursList = useAppSelector(activeUshurs);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");

  useEffect(() => {
    dispatch(getActiveUshurs());
  }, []);

  return (
    <div className="w-full mt-2">
      <Dropdown
        subLabel="Workflow"
        title={selectedWorkflow || <>&nbsp;</>}
        options={activeUshursList.map((item: any) => ({
          ...item,
          onClick: () => {
            setSelectedWorkflow(item.value);
            onSelect(item.value);
          },
        }))}
        className="variable-type-dropdown"
        name="type"
      />
    </div>
  );
};

export default WorkflowSelect;
