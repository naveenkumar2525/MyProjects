import React, { useState, useEffect } from "react";
// @ts-ignore
import { Modal, Input } from "@ushurengg/uicomponents";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import "./CloneWorkflowModal.css";
import { getMobGraphUrl } from "../../utils/url.utils";

export type CloneWorkflowModalProps = {
  currentWorkflow: string;
  handleModalClose: () => void;
  showModal: boolean;
};

const CloneWorkflowModal = (props: CloneWorkflowModalProps) => {
  const { handleModalClose, showModal, currentWorkflow } = props;
  const dispatch = useAppDispatch();
  const [newWorkflow, setNewWorkflow] = useState<any>("");

  const onSubmitCloneWorkflow = async () => {
    window.open(getMobGraphUrl(currentWorkflow));
    console.log("on submit clone workflow");
  };

  return (
    <Modal
      className="clone-workflow-modal"
      onHide={handleModalClose}
      title="Clone Workflow"
      closeLabel="Cancel"
      showModal={showModal}
      actions={[
        {
          onClick: onSubmitCloneWorkflow,
          text: "Clone Workflow",
          type: "primary",
          disabled: !newWorkflow,
        },
      ].filter(({ text }) => text)}
      backdrop
    >
      <div
        className="text-xs"
        style={{
          background: "#F4F5F7",
          borderRadius: 4,
          padding: 8,
          marginBottom: 10,
        }}
      >
        <b>You are cloning workflow:&nbsp;</b> {currentWorkflow}
      </div>
      <Input
        label="New workflow name"
        value={newWorkflow}
        handleInputChange={(ev: any) => {
          setNewWorkflow(ev.target.value);
        }}
        helperText="Provide a name for your new workflow."
      />
    </Modal>
  );
};

export default CloneWorkflowModal;
