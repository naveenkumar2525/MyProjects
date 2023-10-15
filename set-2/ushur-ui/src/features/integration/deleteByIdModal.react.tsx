import React, { useEffect } from "react";
// @ts-ignore
import { Modal, Button, Table } from "@ushurengg/uicomponents";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getIntegrationAPI } from "./integrationSlice";

const ConfirmationModal = (props: any) => {
  const dispatch = useAppDispatch();

  const onModalClose = () => {
    props.onModalClose();
  };

  return (
    <Modal
      className="confrimation-modal"
      onHide={onModalClose}
      size="md"
      title="Disconnect ?"
      showModal={props.showDelete}
      actions={[
        {
          onClick: () => {
            setTimeout(() => dispatch(getIntegrationAPI()), 8000);
            return props.handleDelete(props.getByID);
          },
          text: "Yes, Disconnect",
          type: "delete",
        },
      ]}
    >
      <div>
        <p className="edit-confirmation-alert">
          Are you sure you want to disconnect the {props.getIntName}{" "}
          integration.
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
