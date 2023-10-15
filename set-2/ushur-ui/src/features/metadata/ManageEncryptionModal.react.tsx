import React, { useEffect, useState } from "react";

// @ts-ignore
import { Modal, Checkbox } from "@ushurengg/uicomponents";
import { capitalize } from "lodash";
import { setUpdatedEncryptionData, getMetaDataAPI, getDecryptedMetaData } from "./metadataSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";


const ManageEncryptionModal = (props: any) => {
  const dispatch = useAppDispatch();
  const {handleModalClose, showModal, columnData, handleCheckboxSelection, encryptionOptions, resetEncryptionOptions} = props;

  const saveChanges = () => { 
    dispatch(setUpdatedEncryptionData(encryptionOptions));
    handleModalClose();
  }
  
  return (
  <Modal
    className="edit-column-modal"
    onHide={handleModalClose}
    size="lg"
    title="Manage Encryption"
    showModal={showModal}
    actions={[
      {
        onClick: resetEncryptionOptions,
        text: "Reset to defaults",
        type: "secondary",
      },
      {
        onClick: saveChanges,
        text: "Save changes",
        type: "primary",
      },
    ]}
  >
    <div className="container">
      <div className="row header-row">
        <div className="col-3" style={{textAlign: "center"}}>
          ENCRYPT VALUES
        </div>
        <div className="col-3">
          COLUMN NAME
        </div>
        <div className="col-6">DESCRIPTION</div>
      </div>
      {columnData.map((column: any) => {
        return (
          <div className="row body-row">
            <div className="col-3" style={{ display: "flex", justifyContent: "center"}}>
              <Checkbox
                checked={encryptionOptions[column.text] === 'yes' ? true : false}
                handleOnChange={() => {
                  handleCheckboxSelection(column.text);
                }}
              />
            </div>
            <div className="col-3">
              {capitalize(column.text)}
            </div>
            <div className="col-6">{capitalize(column.description)}</div>
          </div>
        );
      })}
    </div>
  </Modal>
  );
}

export default ManageEncryptionModal;
