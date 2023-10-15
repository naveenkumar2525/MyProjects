import React, { useState, useEffect } from "react";
import "./CreateModal.css";
//@ts-ignore
import { Modal, Checkbox, notifyToast} from "@ushurengg/uicomponents";
import {
  Dropdown,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { Form } from "react-bootstrap";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createContactList,
  getGroupList,
  addContactResponse,
} from "./contactsSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHexagonExclamation, faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ContactGroup from "./contactGroup.react";
import { selectedGroup } from "./contactsSlice";


type CreateModalProps = {
  open: boolean;
  onClose: any;
  currentGroup: any;
  setCurrentGroup: any;
  setShowSelect: any;
  listGroup: any;
  currentGroupNull: any;
  setShowFilter: any;
  showFilter: any;
  getAllLatestContacts: any;
  createDialogOpen: any;
  list: any;
  refreshContactsList: () => void;
};

const regexName = /^[ A-Za-z0-9+]*$/

const regexEmail =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

const CreateModal = (props: CreateModalProps) => {
  const dispatch = useAppDispatch();
  const responseObj = useAppSelector(addContactResponse);
  const group = useAppSelector(selectedGroup);
  const { open, onClose, refreshContactsList } = props;
  const [newContact, setNewContact] = useState({
    userName: "",
    userEmail: "",
    userPhoneNo: "",
    address: "",
    blockListed: false
  });
  const [validated, setValidated] = useState(false);
  const [newContactCheck, setNewContactCheck] = useState<any>({
    userName: "start",
    userPhoneNo: "start",
  });
  let shadownBool: any =
    newContactCheck && JSON.parse(JSON.stringify(newContactCheck));
  const [showFilter, setShowFilter] = useState<any>(false);
  const [showSelect, setShowSelect] = useState<any>(true);
  const [isSuccess, setSuccess] = useState(false);
  const [checkEmail, setCheckEmail] = useState<any>("start");
  const [errors, setErrors] = useState<any>({
    userName: "",
    userPhoneNo: "",
    userEmail: ""
  });
  const [checkDuplicates, setCheckDuplicates] = useState(false);
  const [nameEmptyText, setNameEmptyText] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mandatoryFields, setMandatoryFields] = useState<Boolean>(false);
  const setDefaultErrors = () => setErrors({
    userName: "",
    userPhoneNo: "",
    userEmail: ""
  })

  useEffect(() => {
    if (props.createDialogOpen) {
      if (props.currentGroup === "All groups") {
        return props.setCurrentGroup("Enterprise(Default)");
      }
    }
  }, [props.createDialogOpen]);


  useEffect(() => {
    if (newContact?.userName === "" || newContact?.userEmail === "" || newContact?.userPhoneNo === "") {
      setMandatoryFields(true)
    }
    else if (newContact?.userName === "" && newContact?.blockListed) {
      setErrors({
        ...errors,
        userName: ''
      });
    }
    else {
      setMandatoryFields(false)
    }
  }, [newContact]);

  useEffect(() => {
    if (nameEmptyText && newContact?.blockListed && newContact.userEmail !== "" && newContact.userPhoneNo) {
      setMandatoryFields(false)
    }
    if (mandatoryFields) {
      setErrors({
        ...errors,
        userName: ''
      });
    }
  }, [nameEmptyText])

  useEffect(() => {
    if (responseObj.error) {
      setErrorMessage("Contact already exists !")
    } else if (responseObj.error === false) {
      notifyToast({ variant: "success", text: 'Success', subText: 'Contact added successfully', animation: true });
      dispatch(createContactList({}));
      onCancel();
    }

  }, [responseObj]);

  const checkValidations = (name: any, value: any) => {
    if (name === 'userName') {
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
    if (name === 'userEmail') {
      if(!value){
        setErrors({
          ...errors,
          userEmail: ''
        });
      }
      else
      setErrors({
        ...errors,
        userEmail: !value.match(regexEmail) ? 'Enter valid email' : ''
      });
      
    }

    if (newContact.blockListed && !value) {
      if (name === "userName") {
        setErrors({
          ...errors, userName: ""
        })
        setNameEmptyText(true);
      } else if (name === "userEmail") {
        setErrors({
          ...errors, userEmail: ""
        })
      }
    }
  }

  const onChangeHandler = (e: any) => {

    const value = e.target.value;
    const name = e.target.name;
    setErrorMessage("")
    checkValidations(name, value);
   
    setNewContact((prevState) => {
      return { ...prevState, [name]: value };
    });
    ;
  };
 const updateEmail = (e: any)=> {
  setErrors({
    ...errors,
    userEmail: ''
  });
 }
 const updateUserName = (e: any)=> {
  setErrors({
    ...errors,
    userName: ''
  });
 }
  const onPhoneHandler = (val: any, data: any, e: any) => {
    setErrorMessage("")
    setNewContact((prevState) => {
      return { ...prevState, userPhoneNo: e.target.value };
    });
    setPhoneNumber({
      number: e.target.value,
      countryCode: data
    })
    setErrors({
      ...errors,
      userPhoneNo: ''
    });
  };
  const validatePhone = () => {
    if (phoneNumber?.number === "+") {
      setErrors({
        ...errors,
        userPhoneNo: "",
      });
    } else {
      let phoneNumberErr = "";
      if (phoneNumber?.number) {
        if (
          phoneNumber?.number?.length <
            phoneNumber.countryCode.dialCode?.length ||
          !isValidPhonenumber(phoneNumber?.number) ||
          phoneNumber?.number?.length < phoneNumber?.countryCode?.format?.length
        ) {
          phoneNumberErr = "Enter valid phone no";
          setErrors({
            ...errors,
            userPhoneNo: phoneNumberErr,
          });
        }
      } else {
        phoneNumberErr = "Enter phone no";
      }
    }
  };


  const onPasteHandler = (e: any) => {

    setNewContactCheck((prevState: any) => {
      if (
        e.clipboardData.getData("Text").match(regexEmail) ||
        e.clipboardData.getData("Text").length === 0
      ) {
        return { ...prevState, [e.target.name]: true };
      } else {
        setValidated(false);
        return { ...prevState, [e.target.name]: false };
      }
    });
    if (e.clipboardData.getData("Text")) {
      setNewContact((prevState: any) => {
        !e.clipboardData.getData("Text").match(regexEmail) ||
          (e.clipboardData.getData("Text").length > 0 && setValidated(false));
        return {
          ...prevState,
          [e.target.name]: e.clipboardData.getData("Text"),
        };
      });
    }
  };


  const onPasteEmailHandler = (e: any) => {
    setNewContact((prevState) => {
      return { ...prevState, userEmail: e.clipboardData.getData("Text") };
    });
  };

  const isValidPhonenumber = (value: any) => {
    if (value) {
      return /^\d{7,}$/?.test(value?.replace(/[\s()+\-\.]|ext/gi, ""));
    }
  };

  const onSubmit = (e: any) => {
    setCheckDuplicates(false);
    if (isSuccess) {
      setNewContact({
        userName: "",
        userEmail: "",
        userPhoneNo: "",
        address: "",
        blockListed: false,
      });
      setNameEmptyText(false);
      setCheckEmail("start");
      setNewContactCheck({
        userName: "start",
        userPhoneNo: "start",
      });
      return setSuccess(false);
    } else {
      const errorObj = {
        userName: "",
        userEmail: "",
        userPhoneNo: ""
      }

      if ((newContact.userName === "" || !newContact.userName.match(regexName))) {
        errorObj.userName = "Enter valid name";

      }
      if (newContact.userPhoneNo === "" || !isValidPhonenumber(newContact.userPhoneNo)) {
        errorObj.userPhoneNo = "Enter valid phone no";
      }
      if (newContact.blockListed) {
        errorObj.userName = "";
        errorObj.userEmail = "";
      }
      setErrors(errorObj);

      if (!Object.values(errorObj)?.some((error: any) => error)) {
        const payloadOne = {
          groupId: group === "Enterprise(Default)" ? "" : group,
          userPhoneNo: newContact.userPhoneNo,
          userName: newContact.userName,
          userEmail: newContact.userEmail,
          address: newContact.address,
          doBlock: newContact.blockListed,
          userInitiated: false
        };

        dispatch(createContactList(payloadOne));
        setTimeout(() => props.getAllLatestContacts(), 1000);
        refreshContactsList();
      }
    }

  };

  const onCancel = () => {
    setDefaultErrors();
    onClose();
    setErrorMessage("");
    setShowFilter(false);
    setNewContactCheck({
      userName: "start",
      userPhoneNo: "start",
    });

    setCheckEmail("start");
    setCheckDuplicates(false);
    setNewContact({
      userName: "",
      userEmail: "",
      userPhoneNo: "",
      address: "",
      blockListed: false
    });
    setNameEmptyText(false);
    return setSuccess(false);
  };

  return (
    <>
     
      <Modal
        actions={[
          {
            onClick: onSubmit,
            text: "Save",
            type: "primary",
            disabled: Object.values(errors)?.some((error: any) => error) || (!newContact.userName && !newContact.blockListed) || !newContact.userPhoneNo
          },
        ]}
        className="new-modal add-contact-modal"
        onHide={onCancel}
        title="Add contact"
        subTitle="Add new contact using a unique phone number."
        showModal={open}
      >
        <>
        
          <Form.Label className="ushur-label mt-3">
            Name{" "}
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
                >Enter a valid name</span>
              </>
            )}
            {
              nameEmptyText &&
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
                >Name will be auto-generated when left blank.</span>
              </>
            }
          </Form.Label>
          <Form.Control
            onBlur={onChangeHandler}
            onChange={updateUserName}
            onPaste={onPasteHandler}
            name="userName"
            className={
              "ushur-input contact-input " +
              (errors.userName && " error")
            }
            type="text"
          />

          <Form.Label className="ushur-label mt-3 flex">
            Phone number {""}
            {errors.userPhoneNo && (
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
                >Enter a valid Phone number</span>
              </>
            )}
            {errorMessage &&
              <>
                <FontAwesomeIcon
                  icon={faHexagonExclamation as IconProp}
                  color="inhereit"
                  className="label-icon error-icon mr-1"
                />
                <span
                  style={{
                    color: "#ff4545",
                    fontSize: "0.625rem",
                    marginLeft: ".15rem",
                  }}
                >{errorMessage}</span>
              </>
            }
          </Form.Label>

          <PhoneInput
            country={"us"}
            onBlur={validatePhone}
            onChange={onPhoneHandler}
            searchClass={` ushur-input contact-width contact-input  ${errors.userPhoneNo ? "error" : ""
              } ${checkDuplicates ? "error" : ""}`}
            inputClass={` ushur-input contact-input contact-width  ${errors.userPhoneNo ? "error" : ""
              } ${checkDuplicates ? "error" : ""}
              `}
            inputProps={{
              name: "userPhoneNo",
              required: true,
              autoFocus: true,
            }}
            placeholder={""}
            isValid={(value: any, country: any) => {
              if (value.match(/12345/)) {
                shadownBool.userPhoneNo = false;
                return "Invalid value: " + value + ", " + country.name;
              } else if (value.match(/1234/)) {
                return false;
              } else {
                return true;
              }
            }}
          />
          <Checkbox handleOnChange={(e: any) => {
            if (e.target.checked) {
              if (newContact.userName === "") {
                setNameEmptyText(true);
                setErrors({
                  ...errors, userName: ""
                });
              }
            } else {
              setNameEmptyText(false);
            }
            setNewContact({
              ...newContact,
              blockListed: e.target.checked
            })
          }} checked={newContact.blockListed} label="Add to SMS blocklist" className="mt-2"></Checkbox>
          <Form.Label className="ushur-label mt-3 flex">
            Email{" "}
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
            onPaste={onPasteEmailHandler}
            onBlur={onChangeHandler}
            onChange={updateEmail}
            name="userEmail"
            className={`ushur-input ${errors.userEmail && "error"}`}
            type="email"
          />

          <Form.Label className="ushur-label mt-3">Address (optional)</Form.Label>
          <Form.Control
            onPaste={onPasteHandler}
            onChange={onChangeHandler}
            name="address"
            className="ushur-input"
            type="address"
          />
          <Form.Label className="ushur-label mt-3">Add to a group</Form.Label>
            <ContactGroup />
        </>

        <div className="mt-3" />
       
      </Modal>
    
    </>
  );
};

export default CreateModal;
