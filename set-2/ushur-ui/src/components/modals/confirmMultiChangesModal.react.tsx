import React from "react";
// @ts-ignore
import { Modal } from "@ushurengg/uicomponents";

type Props = {
  handleModalClose: () => void;
  handleConfirmClick: () => void;
  title: string;
  showModal: boolean;
  changes: string[];
};

const ConfirmMultiChanges = (props: Props) => {
  const { handleModalClose, handleConfirmClick, title, showModal, changes } =
    props;
  const onModalClose = () => {
    handleModalClose();
  };

  return (
    <Modal
      className="confrimation-modal"
      onHide={onModalClose}
      size="lg"
      title={title}
      closeLabel="Close"
      showModal={showModal}
      actions={[
        {
          onClick: () => {
            handleConfirmClick();
          },
          text: "Yes, Continue",
          type: "primary",
        },
      ]}
    >
      <div>
        {changes.map((change) => (
          <p className="edit-confirmation-alert" key={change}>
            {change}
          </p>
        ))}
      </div>
    </Modal>
  );
};

export default ConfirmMultiChanges;
