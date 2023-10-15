import React, { useEffect, useState } from "react";
// @ts-ignore
import { Modal, Button, Table, Link, Dropdown} from "@ushurengg/uicomponents";
import { Form, ProgressBar, Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dataUploaded, isAPILoading, uploadDataAPI } from "./metadataSlice";
import exportFromJSON from "export-from-json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-regular-svg-icons";
import { faArrowToBottom } from "@fortawesome/pro-regular-svg-icons";

const BulkUploadModal = (props: any) => {
  const dispatch = useAppDispatch();
  const dataUploadedResponse = useAppSelector(dataUploaded);
  const isAPICalling = useAppSelector(isAPILoading);
  const [curFile, setCurFile] = useState<any>({});
  const [fileHistory, setFileHistory] = useState<any>([]);
  const [apiStatus, setAPIStatus] = useState<any>(isAPICalling);
  const [curSampleData, setCurSampleData] = useState<any>([{}]);
  const [errorColor,setErrorColr]=useState<any>({});
  // const [uploadError,setUploadError]= useState<any>({});

  const onModalClose = () => {
    localStorage.removeItem("filesUploaded");
    setFileHistory([]);
    props.handleModalClose();
  };

  useEffect(() => {
    // let curHist: any = localStorage.getItem("filesUploaded");
    // let curHistArr: any = JSON.parse(curHist) || [];
    // setFileHistory(curHistArr);
    setFileHistory([]);
  }, []);

  useEffect(() => {
    if (props.sampleData) {
      setCurSampleData(props.sampleData);
    }
  }, [props]);

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
      localStorage.setItem("filesUploaded", JSON.stringify(curHistArr));
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
          uploadData(file);
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
    let content = curFile;
    let fileObj = {
      name: curFile.name,
      size: curFile.size,
      uploaded: false,
    };
    let validfileTypes = ['xml', 'csv', 'json'];
    let fileType= curFile.name.split('.').pop();
    if(validfileTypes.includes(fileType)){
    let curHist: any = localStorage.getItem("filesUploaded");
    let curHistArr: any = JSON.parse(curHist) || [];
    setErrorColr({}) 
    if (curHistArr) curHistArr.push({ ...curFile, uploaded: false });
    setFileHistory(curHistArr);
    setCurFile(fileObj);
    dispatch(uploadDataAPI({ content }));
    console.log('Valid File');
  }
  else {
    setErrorColr({
      borderColor:'red',
      color:'red'
    }) 
  }
  };

  const downloadSampleDoc = (type: string) => {
    const sampleData: any = curSampleData;
    const exportType: any = type;
    //EXAMPLE JSON FILE DOWNLOAD
    if (exportType === "json") {
      var arr: any = Object.keys(sampleData);
      const res = arr.reduce(
        (acc: any, curr: any) => ((acc[curr] = ""), acc),
        {}
      );
      const data: any = [res];
      const fileName: any = "JSON-Metadata-Template";
      exportFromJSON({ data, fileName, exportType });
    }
    //EXAMPLE CSV FILE DOWNLOAD
    else if (exportType === "csv") {
      const data: any = [sampleData];
      const fileName: any = "CSV-Metadata-Template";
      exportFromJSON({ data, fileName, exportType });
    }
    //EXAMPLE XML FILE DOWNLOAD
    else if (exportType === "xml") {
      let dataxml: any = sampleData;
      var item1 = "<item>\n";
      var item2 = "  <item>\n";
      var keys = Object.keys(dataxml);
      keys.forEach(function (item, index) {
        item1 +=
          "    <" + item + ">sample " + item + " goes here</" + item + ">\n";
        item2 +=
          "    <" + item + ">sample " + item + " 2 goes here</" + item + ">\n";
      });
      item1 += "  </item>\n";
      item2 += "  </item>\n";
      var xmltext = "<data>\n  " + item1 + item2 + "</data>";
      var filename = "XML-Metadata-Template.xml";
      var pom = document.createElement("a");
      var bb = new Blob([xmltext], { type: "text/plain" });

      pom.setAttribute("href", window.URL.createObjectURL(bb));
      pom.setAttribute("download", filename);

      pom.dataset.downloadurl = ["text/plain", pom.download, pom.href].join(
        ":"
      );
      pom.draggable = true;
      pom.classList.add("dragout");

      pom.click();
    }
  };

  return (
    <Modal
      className="confrimation-modal"
      onHide={onModalClose}
      size="lg"
      title={"Bulk Upload"}
      showModal={props.showBulkUploadModal}
      closeLabel={"Close"}
      footerText={
        "You can close this window at any time. Your files will upload in the background."
      }
    >
      <div className="container">
        <div className="row">
          <div className="col-12" style={{ textAlign: "right" }}>
            <Dropdown
            className="download-dropdown"
              options={[
                {
                  category: 'DOWNLOAD BY TYPE',
                  onClick: () => { downloadSampleDoc('csv')},
                  text: 'CSV',
                  value: 'CSV'
                },
                {
                  category: 'DOWNLOAD BY TYPE',
                  onClick: () => { downloadSampleDoc('json')},
                  text: 'JSON',
                  value: 'JSON'
                },
                {
                  category: 'DOWNLOAD BY TYPE',
                  onClick: () => { downloadSampleDoc('xml')},
                  text: 'XML',
                  value: 'XML'
                },
              ]}
              title="Download Sample Doc"
            />
            {/* <Link
              href=""
              label={
                <span>
                  <FontAwesomeIcon icon={faFileExcel} /> Download Sample Doc
                </span>
              }
              onClick={downloadSampleDoc}
              style={{ display: "inline", fontSize: "12px" }}
            /> */}
          </div>
          <div className="col-12 ">
            <Form.Group
              controlId="formFileLg"
              className="mb-2 upload-wrap"
              onDrop={onDropHandler}
              onDragOver={onDragOver}
              style={errorColor}
            >
              <Form.Control
                type="file"
                size="lg"
                className="file-upload-input"
                onChange={(ev: any) => {
                  uploadData(ev.target.files?.[0]);
                }}
                accept=".csv,.json,.xml"
              />
              <div className="upload-text">
                <FontAwesomeIcon icon={faArrowToBottom} />
                <Form.Label>Browse or Drag and drop files here</Form.Label>
              </div>
            </Form.Group>
            <p className="warning-msg" style={errorColor} >
              supported formats: .csv, .json, .xml max size: 20MB max files: 100{" "}
            </p>
          </div>
          <div className="col-12">
            <p style={{ fontSize: "12px", marginBottom: 0, padding: "8px 0" }}>
              The status of your uploaded files will appear below.
            </p>
            {apiStatus === "loading" && <ProgressBar now={60} />}
          </div>
        </div>
        {fileHistory && fileHistory.length > 0 && (
          <>
            <div className="row upload-history-wrap">
              <div className="col-3">STATUS</div>
              <div className="col-4">FILENAME</div>
              <div className="col-2">SIZE</div>
              <div className="col-3">ACTIONS</div>
            </div>
            {fileHistory.map((eachFile: any, index: any) => {
              return (
                <div className="row each-upload-row" key={index}>
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
      </div>
    </Modal>
  );
};

export default BulkUploadModal;
