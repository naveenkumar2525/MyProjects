import React from "react";
// @ts-ignore
import { Modal } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

const ErrorModal = (props: any) => {
  const onModalClose = () => {
    props.handleModalClose();
  };

  return (
    <Modal
      className="error-modal"
      onHide={onModalClose}
      size="md"
      title={props.title}
      showModal={props.showErrorModal}
    >
      <div className="row">
        <div
          style={{
            display: "grid",
            placeItems: "center",
            fontSize: 16,
            color: "#332E20",
            whiteSpace: "break-spaces"
          }}
        >
          {/* <FontAwesomeIcon icon={faCheckCircle} color="green" size={"lg"} /> */}
          <div>{props.errorMessage}</div>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
