import React, { useEffect } from "react";
// @ts-ignore
import { Modal, Button, Table } from "@ushurengg/uicomponents";

const ConfirmationModal = (props: any) => {
  const onModalClose = () => {
    props.onModalClose();
  };

  return (
    <Modal
      className="confrimation-modal"
      onHide={onModalClose}
      size="lg"
      title="Delete contact ?"
      showModal={props.showDelete}
      actions={[
        {
          onClick: () => {
            props.handleDeleteContact();
          },
          text: "Yes, Delete contact",
          type: "delete",
        },
      ]}
    >
      <div>
        <p className="edit-confirmation-alert">
          Are you sure you want to delete the entry? This action cannot be
          reverted.
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
