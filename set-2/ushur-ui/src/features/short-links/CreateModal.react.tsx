import React, { useState, useEffect } from "react";
import "./CreateModal.css";
//@ts-ignore
import { Modal, Input } from "@ushurengg/uicomponents";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { Badge, CloseButton, Form } from "react-bootstrap";
import { createShortLink } from "./shortlinksSlice";
import {createResponse} from "./shortlinksSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

type CreateModalProps = {
  open: boolean;
  onClose: any;
};

const defaults = {
  url: "",
  tags: [],
  currentTag: "",
  choosenFile: "",
  droppedFile: "",
  genlink:true,
  existing:true,
  isSuccess: false,
  urlError:false 
};

const CreateModal = (props: CreateModalProps) => {
  const dispatch = useAppDispatch();
  const urlresponse = useAppSelector(createResponse);
  const { open, onClose } = props;
  const [url, setUrl] = useState(defaults.url);
  const [genlink,setGenLink]=useState(defaults.genlink);
  const [tags, setTags]: any = useState(defaults.tags);
  const [existing, setExisting]: any = useState(defaults.existing);
  const [currentTag, setCurrentTag] = useState(defaults.currentTag);
  const [choosenFile, setChoosenFile]: any = useState(defaults.choosenFile);
  const [droppedFile, setDroppedFile]: any = useState(defaults.droppedFile);
  const [isSuccess, setSuccess] = useState(defaults.isSuccess);
  const [urlError, setUrlError] = useState(false);

  const urlPattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/;

  useEffect(() => {
    if(choosenFile?.name){
      setUrl(choosenFile.name)
      setUrlError(false);
    }
    if(droppedFile?.name){
      setUrl(droppedFile.name)
      setUrlError(false);
    }
    
  }, [choosenFile,droppedFile]);
  useEffect(() => {
    if(url?.length>0){
     setGenLink(false);
    }
    else
    setGenLink(true);
  }, [url]);
 

  const resetFields = () => {
    setUrl(defaults.url);
    setTags(defaults.tags);
    setGenLink(defaults.genlink);
    setCurrentTag(defaults.currentTag);
    setExisting(defaults.existing);
    setChoosenFile(defaults.choosenFile);
    setDroppedFile(defaults.droppedFile);
    setSuccess(defaults.isSuccess);
    setUrlError(defaults.urlError);
  };

  useEffect(() => {
   
    if(urlresponse?.surl !== "" && urlresponse?.existingSurl=="true"){
        setExisting(false);
      
      }
      else {
        if(urlresponse !== null && urlresponse?.surl !== "" && !urlresponse?.existingSurl){
        setSuccess(true);
        }
      }
  }, [urlresponse?.surl]);

  const onSubmit = () => {
    if (urlresponse.surl && isSuccess) {
      resetFields();
      return;
    }
    if (url && !urlPattern.test(url) && !choosenFile?.name && !droppedFile?.name ) {
      setUrlError(true);
      return;
    } 
    if (url ||choosenFile?.name || droppedFile?.name ){
      dispatch(createShortLink({ url, file: droppedFile || choosenFile, tags,existing}));
      console.log(urlresponse);
      console.log(existing);
    }
  };
  const onCancel = () => {
    resetFields();
    onClose();
  };

  const onDropHandler = (ev: any) => {
    console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          var file = ev.dataTransfer.items[i].getAsFile();
          console.log("1... file[" + i + "].name = " + file.name);
          setDroppedFile(file);
          setChoosenFile("");
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log(
          "2... file[" + i + "].name = " + ev.dataTransfer.files[i].name
        );
        setDroppedFile(file);
        setChoosenFile("");
      }
    }
  };

  const onDragOver = (ev: any) => {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  };

  return (
    <>
    {console.log(isSuccess,existing)}
      <Modal
        actions={[
          {
            onClick: onSubmit,
            text: isSuccess ? "Add another url" : !existing? "Generate new Short Link" :"Generate Short Link",
            type: "primary",
            disabled:genlink
          },
        ]}
        className="new-modal"
        onHide={onCancel}
        title={existing?"Add url":"Short Link already exists"}
        showModal={open}
        closeLabel={isSuccess ? "Close" : "Cancel"}
      >
        {isSuccess ? (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              fontSize: 40,
              color: "green",
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} color="green" size={"lg"} />
            <div>Short Link generated</div>
          </div>
        ) : (
      
          <>
            {" "}
           {!existing ? (<>
            <div>You can copy the below existing short link {urlresponse?.['surl']} Or you can generate a new short link</div>
           </>
           ) :( 
            <>
            <Input
            label="Enter Long URL"
            value={url}
            disabled={choosenFile || droppedFile}
            handleInputChange={
            (ev: any) => {
            setUrl(ev.target.value)
            }}
            error={urlError}
            helperText={
              urlError
                ? "Enter correct url"
                : ""
            }
            />
            <label className="ushur-label form-label mt-10">
            File Upload{" "}
            {(choosenFile?.name || droppedFile?.name) && (
              <span className="text-blue-500 font-semibold m-2">
                {choosenFile?.name || droppedFile?.name || ""}
              </span>
            )}
            </label>
            <div className="col-12 ">
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
                  setChoosenFile(ev.target.files?.[0]);
                  setDroppedFile("");
                  setGenLink(false)
                }}
                accept=".doc, .docx, .odt, .pdf, .xls, .xlsx, .ods, .ppt, .pptx, .txt, .jpg, .png, .gif"
                disabled={!!url}
              />
              <div className="upload-text">
                <i className="bi bi-upload"></i>
                <Form.Label>Browse or Drag and drop files here</Form.Label>
              </div>
            </Form.Group>
            {/* <p className="warning-msg">max file size: 20MB</p> */}
            </div>
            {/* <div id="drop_zone" onDrop={onDropHandler} onDragOver={onDragOver}>
            <div>Drag and drop a file here</div>
            <div> or </div>
            <label
              htmlFor={"file_picker"}
              className="px-2 py-1 border-solid border-1 border-light-gray-200 rounded cursor-pointer"
            >
              Select file
            </label>
            <input
              id="file_picker"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(ev: any) => {
                setChoosenFile(ev.target.files?.[0]);
                setDroppedFile("");
              }}
              className="hidden"
            ></input>
            <div className="text-green-400 font-semibold m-2">
              {choosenFile?.name || droppedFile?.name || ""}
            </div>
            </div> */}
            <label className="ushur-label form-label mt-10">Add Tags</label>
            <div className="sl-tags-wrap">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="sl-tag"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {tag}
                <CloseButton
                  style={{
                    width: 5,
                    height: 5,
                    marginLeft: 6,
                    verticalAlign: "middle",
                  }}
                  onClick={() =>
                    setTags(tags.filter((curr: string) => curr !== tag))
                  }
                />
              </span>
              // <span style={{ marginRight: 10 }}>
              //   <Badge bg="secondary" key={tag}>
              //     {tag}
              //     <CloseButton
              //       style={{ width: 5, height: 5, marginLeft: 6 }}
              //       onClick={() =>
              //         setTags(tags.filter((curr: string) => curr !== tag))
              //       }
              //     />
              //   </Badge>
              // </span>
            ))}
            <input
              type="text"
              className="ushur-input form-control"
              onKeyUp={(ev) => {
                if (
                  ev.keyCode === 13 &&
                  currentTag &&
                  !tags.includes(currentTag)
                ) {
                  setTags([...tags, currentTag]);
                  setCurrentTag("");
                }
              }}
              onBlur={(ev) => {
                if (ev.target.value !== '') {
                  setTags([...tags, currentTag]);
                  setCurrentTag("");
                }
              }}
              value={currentTag}
              style={{
                height: "100%",
                flexGrow: 1,
                outline: "none",
                paddingLeft: 2,
              }}
              onChange={(ev) => setCurrentTag(ev.target.value)}
            />
            </div>
            </>
            )}
            <div style={{ marginTop: 20 }} />
           </>

           )}
           
      </Modal>
    </>
  );
};

export default CreateModal;
