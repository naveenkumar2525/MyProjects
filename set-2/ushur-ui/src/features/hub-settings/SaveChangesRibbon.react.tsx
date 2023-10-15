import React from "react";
// @ts-ignore
import {
  Button,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import "./SaveChangesRibbon.css";

type Props = {
  onCancel: () => void;
  onSave: () => void;
  changesCount: number;
};



const SaveChangesRibbon = (props: Props) => {
  const { onCancel, onSave, changesCount } = props;
  return changesCount > 0 ? (
    <div className="flex justify-between bg-blue-500 p-3 mt-4 save-changes-ribbon">
      <Button label="Cancel" onClick={onCancel} type="toolbar" />

      <div className="flex">
        <span className="text-white mr-2">{`You have ${changesCount} unsaved change${
          changesCount > 1 ? "s" : ""
        }`}</span>
        <Button label="Save Changes" onClick={onSave} type="secondary" />
      </div>
    </div>
  ) : (
    <div className="p-3 mt-4 flex flex-row-reverse">
      <Button
        label="Save Changes"
        disabled
        style={{ backgroundColor: "grey" }}
        type="primary"
      />
    </div>
  );
};

export default SaveChangesRibbon;
