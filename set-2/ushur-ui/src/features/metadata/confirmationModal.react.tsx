import React, { useEffect } from "react";
// @ts-ignore
import { Modal, Button, Table } from "@ushurengg/uicomponents";

const ConfirmationModal = (props: any) => {
  const onModalClose = () => {
    props.handleModalClose();
  };

  useEffect(() => {}, []);

  const changesCell = (cell: any, row: any) => {
    return <span>{cell.join(",")}</span>;
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
        {!props.confirmationObj.singleEdit && (
          <p className="list-of-changes">
            {props.listOfChanges.length > 0 && (
              <span>
                {" "}
                {props.listOfChanges.length}{" "}
                {props.listOfChanges.length > 1 ? "Entries" : "Entry"} changed
              </span>
            )}

            {props.listOfChanges.length > 0 &&
              !props.confirmationObj.singleEdit &&
              props.delDataArr.length > 0 && <>,</>}

            {props.delDataArr.length > 0 && (
              <span>
                {props.delDataArr.length}{" "}
                {props.delDataArr.length > 1 ? "Entries" : "Entry"} to be
                deleted
              </span>
            )}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
