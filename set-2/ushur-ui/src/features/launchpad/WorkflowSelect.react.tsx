import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Dropdown,
  // @ts-ignore
} from "@ushurengg/uicomponents";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { activeUshurs, getActiveUshurs } from "../ushurs/ushursSlice";

type Props = {
  value: string;
  onSelect: (val: any) => any;
  selectDefault:any;
};

const WorkflowSelect = (props: Props) => {
  const { value, onSelect,selectDefault } = props;
  const dispatch = useAppDispatch();
  const activeUshursList = useAppSelector(activeUshurs);


  useEffect(() => {
    let valCheck = activeUshursList?.some(
      (val: { [x: string]: any }) => val["text"] === selectDefault
    );
    if (valCheck) {
      onSelect(selectDefault);
    }
    dispatch(getActiveUshurs());

  }, []);

  return (
    <div className="w-full mt-2">
      <Dropdown
        label="Workflow"
        title={value || <>&nbsp;</>}
        noDataText="No published workflows"
        options={activeUshursList.map((item: any) => ({
          ...item,
          onClick: () => {
            onSelect(item.value);
          },
        }))}
        className="variable-type-dropdown"
        name="type"
        maxWidth="218px"
      />
    </div>
  );
};

export default WorkflowSelect;
