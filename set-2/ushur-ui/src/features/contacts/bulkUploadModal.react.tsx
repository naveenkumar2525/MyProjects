import React, { useEffect, useState } from "react";
// @ts-ignore
import { Modal, Button, Table } from "@ushurengg/uicomponents";
import { Form, ProgressBar, Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  dataUploaded,
  isAPILoading,
  uploadDataAPI,
  getContactList,
} from "./contactsSlice";
import { setTimeout } from "timers";

function isFileTypeSupported(type: string) {
  return ["text/csv", "text/xml", "application/json"].includes(type);
}

const BulkUploadModal = (props: any) => {
  const dispatch = useAppDispatch();
  const dataUploadedResponse = useAppSelector(dataUploaded);
  const isAPICalling = useAppSelector(isAPILoading);
  const [curFile, setCurFile] = useState<any>({});
  const [fileHistory, setFileHistory] = useState<any>([]);
  const [apiStatus, setAPIStatus] = useState<any>(isAPICalling);
  const [showFilter, setShowFilter] = useState<any>(false);
  const [showSelect, setShowSelect] = useState<any>(true);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (props.showBulkUploadModal) {
      if (props.currentGroup === "All groups") {
        return props.setCurrentGroup("Enterprise");
      }
    }
  }, [props.showBulkUploadModal]);

  const onModalClose = () => {
    props.handleModalClose();
    setFileHistory([]);
    setShowError(false);
  };

  useEffect(() => {
    let curHist: any = localStorage.getItem("filesUploaded");
    let curHistArr: any = JSON.parse(curHist) || [];
    setFileHistory(curHistArr);
  }, []);

  useEffect(() => {
    if (isAPICalling === "loading") {
    }
    setAPIStatus(isAPICalling);
  }, [isAPICalling]);

  useEffect(() => {
    if (dataUploadedResponse) {
      let curHist: any = localStorage.getItem("filesUploaded");
      let curHistArr: any = JSON.parse(curHist) || [];

      if (curHistArr) curHistArr.push({ ...curFile, uploaded: true });
      setFileHistory(curHistArr);
      localStorage.setItem("contactFilesUploaded", JSON.stringify(curHistArr));
    }
  }, [dataUploadedResponse]);

  const onDropHandler = (ev: any) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)

      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          var file = ev.dataTransfer.items[i].getAsFile();
          if(file.type === "text/csv" || file.type === "text/xml" || file.type === "application/json"){
            uploadData(file);
          }else{
            setShowError(true);
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)

      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        uploadData(file);
      }
    }
  };

  const onDragOver = (ev: any) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  const uploadData = (curFile: any) => {
    setShowError(false);
    let content = curFile;
   
    let fileObj = {
      name: curFile.name,
      size: curFile.size,
      uploaded: false,
    };
    let curHist: any = localStorage.getItem("contactFilesUploaded");
    let curHistArr: any = JSON.parse(curHist) || [];

    if (curHistArr) curHistArr.push({ ...curFile, uploaded: false });
    setFileHistory(curHistArr);
    setCurFile(fileObj);
    dispatch(uploadDataAPI({ file: content, groupId: props.currentGroup=="Enterprise(Default)" ? "" : props.currentGroup}));
    setTimeout(() => props.getAllLatestContacts(), 1650);
    setTimeout(() => dispatch(getContactList(props.currentGroup)), 1100);
  };

  return (
    <Modal
      className="confrimation-modal"
      onHide={onModalClose}
      size="lg"
      title={"Bulk Upload"}
      showModal={props.showBulkUploadModal}
    >
      <div className="container">
        <div className="row">
          <div className="col-12"></div>
          <div className="col-12 ">
            <Form.Label className="ushur-label">Group </Form.Label>
            <div className="ushur-field-btn undefined">
              <div className="  ">
                <div
                  onBlur={() => setShowSelect(true)}
                  className="variable-type-dropdown"
                >
                  <div aria-label="" className="ushur-dropdown     dropdown">
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      aria-expanded="false"
                      type="button"
                      className="dropdown-toggle btn btn-outline-secondary btn-sm"
                    >
                      {props.currentGroup === "null"
                        ? "Enterprise"
                        : props.currentGroup}
                    </button>
                    {showFilter && (
                      <div
                        x-placement="bottom-start"
                        aria-labelledby=""
                        className="dropdown-menu show"
                        data-popper-reference-hidden="false"
                        data-popper-escaped="false"
                        data-popper-placement="bottom-start"
                        style={{
                          position: "absolute",
                          inset: " 0px auto auto 0px",
                          transform: "translate3d(0px, 34px, 0px)",
                          zIndex: 9999999999,
                        }}
                      >
                        <button
                          onClick={(e: any) => {
                            props.setCurrentGroup(e.target.value);
                            setShowFilter(false);
                          }}
                          data-rr-ui-dropdown-item=""
                          className="each-option  dropdown-item"
                          key={"Enterprise(Default)"}
                          value={"Enterprise(Default)"}
                        >
                          {"Enterprise(Default)"}
                        </button>
                        {props.listGroup &&
                          props.listGroup.map(
                            (item: any) =>
                              item !== "null" &&
                              item !== "" &&
                              item !== "All" &&
                              item !== "Enterprise(Default)" && (
                                <button
                                  onClick={(e: any) => {
                                    props.setCurrentGroup(e.target.value);
                                    setShowFilter(false);
                                  }}
                                  data-rr-ui-dropdown-item=""
                                  className="each-option  dropdown-item"
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </button>
                              )
                          )}
                      </div>
                    )}
                  </div>
                  <span className="helper-text form-text"></span>
                </div>
              </div>
            </div>
            <Form.Group
              controlId="formFileLg"
              className="mb-2 upload-wrap"
              onDrop={onDropHandler}
              onDragOver={onDragOver}
            >
              <Form.Control
                type="file"
                size="lg"
                className="file-upload-input"
                onChange={(ev: any) => {
                  const file = ev.target.files?.[0];
                  if (isFileTypeSupported(file?.type ?? "")) {
                    uploadData(file);
                  } else {
                    setShowError(true);
                  }
                }}
                accept=".csv,.json,.xml"
              />
              <div className="upload-text">
                <i className="bi bi-upload"></i>
                <Form.Label>Browse or Drag and drop files here</Form.Label>
              </div>
            </Form.Group>
            <p className="edit-confirmation-alert">
              supported formats: .csv, .json, .xml max size: 20MB max files: 100{" "}
            </p>
            {showError ? (
              <p className="edit-confirmation-alert unsupported-file">
                File type not supported{" "}
              </p>
            ) : null}
          </div>
          <div className="col-12">
            <p>The status of your uploaded files will appear below.</p>
            {apiStatus === "loading" && <ProgressBar now={60} />}
          </div>
        </div>
        {fileHistory && fileHistory.length > 0 && (
          <>
            <div
              className="row"
              style={{
                color: "#828282",
                fontSize: "12px",
                backgroundColor: "#F3F3F3",
                borderRadius: "8px",
                padding: "4px",
                marginTop: "8px",
                marginBottom: "8px",
              }}
            >
              <div className="col-3">STATUS</div>
              <div className="col-4">FILENAME</div>
              <div className="col-2">SIZE</div>
              <div className="col-3">ACTIONS</div>
            </div>
            {fileHistory.map((eachFile: any, index: any) => {
              return (
                <div
                  className="row"
                  style={{
                    fontSize: "12px",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}
                  key={index}
                >
                  <div className="col-3">
                    <Badge
                      pill
                      className={
                        eachFile.uploaded
                          ? "ushur-badge-success"
                          : "ushur-badge-secondary"
                      }
                      style={{ color: "#414141" }}
                    >
                      {eachFile.uploaded ? "Successful" : "Uploading"}
                    </Badge>
                  </div>
                  <div className="col-4">{eachFile.name}</div>
                  <div className="col-2">{eachFile.size} KB</div>
                  <div className="col-3"></div>
                </div>
              );
            })}
          </>
        )}

        <div className="row">
          <div className="col-12">
            <p className="warning-msg">
              You can close this window at any time. Your files will upload in
              the background.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BulkUploadModal;
