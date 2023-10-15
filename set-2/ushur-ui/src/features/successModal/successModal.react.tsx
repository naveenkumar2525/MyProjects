import React from "react";
// @ts-ignore
import { Modal } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

const SuccessModal = (props: any) => {
  const onModalClose = () => {
    props.handleModalClose();
  };

  return (
    <Modal
      className="success-modal"
      onHide={onModalClose}
      size="lg"
      title=""
      showModal={props.showSuccessModal}
      closeLabel="Close"
      actions={
        props.showCreateButton
          ? [
              {
                onClick: props.handleCreateAnother,
                text: props.createAnotherText,
                type: "primary",
              },
            ]
          : []
      }
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
          fontSize: 40,
          color: "green",
        }}
      >
        <FontAwesomeIcon icon={faCheckCircle} color="green" size={"lg"} />
        <div>{props.successMessage}</div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
