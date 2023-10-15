import React, { useEffect } from "react";
// @ts-ignore
import { Modal, Table } from "@ushurengg/uicomponents";

const PropertyConfirmationModal = (props: any) => {
  const onModalClose = () => {
    props.handleModalClose();
  };

  useEffect(() => { }, []);

  const changesCell = (cell: any, row: any) => {
    return <span>{cell.join(",")}</span>;
  };

  return (
    <Modal
      className="confrimation-modal"
      onHide={onModalClose}
      size="md"
      title="Save Changes?"
      showModal={props.showVariableConfirmation}
      actions={[
        {
          onClick: () => {
            const confirmationType = props.confirmationObj.delete
              ? "delete"
              : "edit";
            props.handleConfirmClick(
              confirmationType,
              props.confirmationObj.singleEdit
            );
          },
          text: props.confirmationObj.delete
            ? "Yes, Delete Property"
            : "Yes, Save Changes",
          type: props.confirmationObj.delete ? "delete" : "primary",
        },
      ]}
    >
      <div>
        <p className="edit-confirmation-alert">
          {props.confirmationObj.message}
        </p>
      </div>
      {props.confirmationObj && !props.confirmationObj.singleEdit && (
        <div className="row">
          <div className="col-12">
            <p className="edit-confirmation-alert">
              You are editing {props.listOfChanges.length} properties. Are you
              sure you want to commit these changes? <br />
              This might impact some of your existing modules.
            </p>
          </div>

          <Table
            keyField="id"
            columns={[
              {
                dataField: "variableName",
                text: "PROPERTY NAME",
              },
              {
                dataField: "changes",
                text: "CHANGES",
                formatter: changesCell,
              },
            ]}
            data={props.listOfChanges}
          />
        </div>
      )}
    </Modal>
  );
};

export default PropertyConfirmationModal;
