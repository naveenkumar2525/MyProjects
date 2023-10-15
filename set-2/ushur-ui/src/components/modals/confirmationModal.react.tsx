import React from "react";
// @ts-ignore
import { Modal } from "@ushurengg/uicomponents";

const ConfirmationModal = (props: any) => {
  const onModalClose = () => {
    props.handleModalClose();
  };

  return (
    <Modal
      className="confrimation-modal"
      onHide={onModalClose}
      size="sm"
      title={props.confirmationObj.title}
      showModal={props.showConfirmationModal}
      actions={[
        {
          onClick: () => {
            let confirmationType = props.confirmationObj.delete
              ? "delete"
              : "edit";
            props.handleConfirmClick(
              confirmationType,
              props.confirmationObj.singleEdit
            );
          },
          text: props.confirmationObj.delete
            ? "Yes, Delete entry"
            : "Yes, save changes",
          type: props.confirmationObj.delete ? "delete" : "primary",
        },
      ]}
    >
      <div>
        <p className="edit-confirmation-alert">
          {props.confirmationObj.message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
