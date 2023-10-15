import React, { useState, useEffect } from "react";
// @ts-ignore
import { Modal, Input, Checkbox, notifyToast} from "@ushurengg/uicomponents";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { editContactResponse, editContactAPI } from "./contactsSlice";
import { Form } from "react-bootstrap";
import { getTokenId } from "../../utils/api.utils";
import ConfirmationModal from "./confirmationModal.react";
import { setTimeout } from "timers";
import {
  faHexagonExclamation,
  faExclamationTriangle,
} from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import moment from "moment";
import ErrorModal from "../errorModal/errorModal.react";


const regexName = /^[ A-Za-z0-9+]*$/
const regexEmail =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const EditContactModal = (props: any) => {
  const [createFields, setCreateFields] = useState<any>({
    id: "",
    userName: "",
    userEmail: "",
    userPhoneNo: "",
    address: "",
    blockListed: false,
    blockListedInfo: null,
  });
  const [existContactDetails,setExistEditContact]=useState({})
  const dispatch = useAppDispatch();
  const editResponseObj = useAppSelector(editContactResponse);
  const [descError, setDescError] = useState(false);
  const [showFilter, setShowFilter] = useState<any>(false);
  const [showSelect, setShowSelect] = useState<any>(true);
  const [checkEmail, setCheckEmail] = useState<any>("start");
  const [checkUserName, setCheckUserName] = useState<any>("start");
  const [showError, setShowError] = useState<any>(false);
  const [showDelete, setshowDelete] = useState<any>(false);

  const [errors, setErrors] = useState<any>({
    userName: "",
    userPhoneNo: "",
    userEmail: "",
  });
  const [nameEmptyText, setNameEmptyText] = useState(false);

  useEffect(() => {
    setExistEditContact(props.currentEditContact);
    setCreateFields(props.currentEditContact);
  }, [props.currentEditContact]);

  useEffect(() => {
    if (props.showEditContactModal) {
      if (props.currentGroup === "All groups") {
        return props.setCurrentGroup(props.currentEditContact.groupId);
      }
    }
  }, [props.showEditContactModal]);

  useEffect(() => {

    if (editResponseObj.error) {
      setShowError(true);
    } else if (editResponseObj.error === false) {
      notifyToast({
        variant: "success",
        text: "Contact Updated!",
        subText: "Contact updated successfully",
        animation: true,
      });
      setNameEmptyText(false);
      dispatch(editContactAPI({}));
    }
  }, [editResponseObj]);

  const checkValidations = (name: any, value: any) => {
    if (name === "userName") {
      if(!value){
        setErrors({
          ...errors,
          userName: ''
        });
      }
      if(value.match(regexName)){
        if(value.includes("+")){
          if (value.split('+').length === 2 && value.split('+')[0] === "user"){
          setErrors({
              ...errors,
              userName: ''
            });
          }
          else {
            setErrors({
              ...errors,
              userName:  'Enter valid name' 
              });
          }
        }
      } 
      else if(value.match(regexName) && !value.includes("+")){
          setErrors({
          ...errors,
          userName:'' 
          });
      }
      else{
        setErrors({
          ...errors,
          userName:  'Enter valid name' 
        });
      }
      if (value) {
        setNameEmptyText(false);
      }
    }
    if (name === "userEmail") {
      setErrors({
        ...errors,
        userEmail: !value.match(regexEmail) ? "Enter valid email" : "",
      });
    }
    if (createFields.blockListed && !value) {
      if (name === "userName") {
        setErrors({
          ...errors,
          userName: "",
        });
        setNameEmptyText(true);
      } else if (name === "userEmail") {
        setErrors({
          ...errors,
          userEmail: "",
        });
      }
    }
  };

  const onChangeHandler = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    if(name === "userName"){
      setErrors({
        ...errors,
        userName: ""
      });
    }
    if(name === "userEmail"){
      setErrors({
        ...errors,
        userEmail: ""
      });
    }

    setCreateFields((prevState: any) => {
      return { ...prevState, [name]: value };
    });
  };

  const updateField = (e: any) => {
    // debugger
    const value = e.target.value;
    const name = e.target.name;
    checkValidations(name, value);
  };
  const ui = () => {
    checkValidations("userEmail", createFields?.userEmail);
  };

  const setDefaultErrors = () =>
    setErrors({
      userName: "",
      userPhoneNo: "",
      userEmail: "",
    });

  const resetFields = () => {
    setCreateFields({
      userName: "",
      userEmail: "",
      address: "",
      userPhoneNo: "",
    });
    setDefaultErrors();
    setDescError(false);
  };

  const validateFields = (e: any) => {
    let obj;
    if (props.currentGroup !== "Enterprise(Default)" && props.currentGroup !== "null") {
      obj = {
        address: createFields.address,
        userEmail: createFields.userEmail,
        userName: createFields.userName,
        userPhoneNo: createFields.userPhoneNo,
        doBlock: createFields.blockListed,
        groupId:
          props.currentGroup === "All"
            ? props.currentEditContact.groupId
            : props.currentGroup,
      };
    } else {
      obj = {
        groupId: props.currentGroup == "Enterprise(Default)" ?  "" : props.currentGroup,
        address: createFields.address,
        userEmail: createFields.userEmail,
        userName: createFields.userName,
        userPhoneNo: createFields.userPhoneNo,
        doBlock: createFields.blockListed,
      };
    }
    props.handleSingleContactEdit(obj);
    props.handleEditContactModalClose();
    setCheckUserName("start");
    setCheckEmail("start");
    if (props.currentGroup === "All groups") {
      props.getAllLatestContacts();
    }
    props.refreshContactsList();
  };

  const handleInputChange = (event: any, field: string) => {
    setCreateFields({
      ...createFields,
      [field]: event.target.value,
    });
  };

  const onModalClose = () => {
    resetFields();
    props.handleEditContactModalClose();
    setShowFilter(false);
    setshowDelete(false);
    setNameEmptyText(false);
  };


  const handleDeleteContact = () => {
    let obj;

    if (props.currentGroup !== "Enterprise(Default)" && props.currentGroup !== "null") {
      obj = {
        campaignId: null,
        cmd: "deleteUser",
        id: props.currentEditContact.id,
        tokenId: getTokenId(),
        userName: props.currentEditContact.userName,
        userPhoneNo: props.currentEditContact.userPhoneNo,
        groupId:
          props.currentGroup === "All groups"
            ? props.currentEditContact.groupId
            : props.currentGroup,
      };
    } else {
      obj = {
        groupId: props.currentGroup == "Enterprise(Default)" ?  "" : props.currentGroup,
        campaignId: null,
        cmd: "deleteUser",
        id: props.currentEditContact.id,
        tokenId: getTokenId(),
        userName: props.currentEditContact.userName,
        userPhoneNo: props.currentEditContact.userPhoneNo,
      };
    }

    props.handleDeleteContact(obj);

    props.handleEditContactModalClose();
    if (props.currentGroup === "All groups") {
      props.getAllLatestContacts();
    }
    props.refreshContactsList(true);
    localStorage.setItem("delId", props.currentEditContact.id);
    setshowDelete(false);
  };

  return showDelete ? (
    <ConfirmationModal
      onModalClose={onModalClose}
      showDelete={showDelete}
      currentEditContact={props.currentEditContact}
      handleDeleteContact={handleDeleteContact}
    />
  ) : !createFields ? (
    <h1>loading</h1>
  ) : showError ? (
    <ErrorModal
      title="Update unsuccessful"
      showErrorModal={showError}
      handleModalClose={() => setShowError(false)}
      errorMessage={editResponseObj.status || "Something went wrong"}
    />
  ) : (
    <>
    
      <Modal
        actions={[
          {
            onClick: () => {
              setshowDelete(true);
            },
            text: "",
            type: "toggle",
            actionType: "destructive",
            startIcon: <i className="bi bi-trash-fill"></i>,
          },
          {
            onClick: (e: any) => {
              validateFields(e);
            },
            text: "Save",
            type: "primary",
            disabled:
              Object.values(errors)?.some((error: any) => error) ||
              (!createFields.userName && !createFields.blockListed) ||
              JSON.stringify(createFields) === JSON.stringify(existContactDetails) 
          },
        ]}
        className="edit-variable-modal add-contact-modal"
        onHide={onModalClose}
        size="lg"
        title="Edit Contact"
        showModal={props.showEditContactModal}
      >
        <div className="row">
          <>
            <div className="col-12 mt-2">
              <Form.Label className="ushur-label">
                Name
                {errors.userName && (
                  <>
                    <FontAwesomeIcon
                      icon={faHexagonExclamation as IconProp}
                      color="inhereit"
                      size={"sm"}
                      className="label-icon error-icon"
                    />
                    <span
                      style={{
                        color: "#ff4545",
                        fontSize: "0.625rem",
                        marginLeft: ".15rem",
                      }}
                    >
                      Enter a valid name
                    </span>
                  </>
                )}
                {nameEmptyText && (
                  <>
                    <FontAwesomeIcon
                      icon={faExclamationTriangle as IconProp}
                      color="#D6A100"
                      size={"sm"}
                      className="label-icon"
                    />
                    <span
                      style={{
                        color: "#D6A100",
                        fontSize: ".8rem",
                        marginLeft: "4px",
                      }}
                    >
                      Name will be auto-generated when left blank.
                    </span>
                  </>
                )}
              </Form.Label>
              <Form.Control
                onChange={onChangeHandler}
                onBlur={updateField}
                value={createFields.userName}
                name="userName"
                className={
                  "ushur-input contact-input " + (errors.userName && " error")
                }
                type="text"
                placeholder="name"
              />
            </div>

            <div className="col-12 mt-3">
              <Form.Label className="ushur-label">Phone number </Form.Label>
              <PhoneInput
                searchClass={` ushur-input contact-width contact-input `}
                inputClass={` ushur-input contact-input contact-width 
            `}
                onChange={(value: any, name: any, e: any) => {
                  handleInputChange(e, "id");
                }}
                inputProps={{
                  name: "userPhoneNo",
                  required: true,
                  autoFocus: true,
                }}
                value={createFields.userPhoneNo}
                disabled
              />
              <Checkbox
                handleOnChange={(e: any) => {
                  if (e.target.checked) {
                    if (createFields.userName === "") {
                      setNameEmptyText(true);
                      setErrors({
                        ...errors,
                        userName: "",
                      });
                    }
                  } else {
                    setNameEmptyText(false);
                  }
                  setCreateFields({
                    ...createFields,
                    blockListed: e.target.checked,
                  });
                }}
                checked={createFields.blockListed}
                label="Add to SMS blocklist"
                className="mt-2"
              ></Checkbox>
            </div>
            {props.currentEditContact.blockListed && (
              <span className="blockListInfo ml-6">
                {createFields?.updateTimestamp && (
                  <span>
                    Updated on{" "}
                    {moment(new Date(createFields?.updateTimestamp)).format(
                      "MM/DD/YYYY hh:mm:ss A"
                    )}
                  </span>
                )}
                {createFields?.isUserInitiated === "Yes" &&
                  " , initiated by end-user"}
              </span>
            )}
            <div className="col-12">
              <Form.Label className="ushur-label mt-3 flex">
                Email
                {errors.userEmail && (
                  <div>
                    <FontAwesomeIcon
                      icon={faHexagonExclamation as IconProp}
                      color="inhereit"
                      size={"sm"}
                      className="label-icon error-icon"
                    />
                    <span
                      style={{
                        color: "#ff4545",
                        fontSize: "0.625rem",
                        marginLeft: ".15rem",
                      }}
                    >
                      {" "}
                      Enter a valid email{" "}
                    </span>
                  </div>
                )}
              </Form.Label>
              <Form.Control
                onChange={onChangeHandler}
                onBlur={ui}
                name="userEmail"
                className={`ushur-input ${errors.userEmail && "error"}`}
                type="email"
                placeholder="name@example.com"
                value={createFields.userEmail}
              />
            </div>

            <div className="col-12 mt-3">
              <Input
                label="Address (optional)"
                name="address"
                handleInputChange={(event: any) => {
                  handleInputChange(event, "address");
                }}
                value={createFields.address}
              />
            </div>
            <div className="col-12">
              <Form.Label className="ushur-label mt-3">
                Add to a group
              </Form.Label>
              <div className="ushur-field-btn undefined">
                <div className="  ">
                  <div
                    onBlur={() => setShowSelect(true)}
                    className="variable-type-dropdown"
                  >
                    <div aria-label="" className="ushur-dropdown dropdown">
                      <button
                        onClick={() => setShowFilter(!showFilter)}
                        aria-expanded="false"
                        type="button"
                        disabled
                        className="dropdown-toggle btn btn-outline-secondary btn-sm"
                        style={{background:'#f0f0f0'}}
                      >
                        {props.currentGroup === "null"
                          ? "Enterprise(Default)"
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
            </div>
            <div className="mt-3" />
          </>
        </div>
      </Modal>
    </>
  );
};

export default EditContactModal;
