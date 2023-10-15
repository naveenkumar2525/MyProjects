import React, { useState, useEffect } from "react";
// @ts-ignore
import { Modal, Input } from "@ushurengg/uicomponents";
import { getIntegrationAPIById, integrationById } from "./integrationSlice";
import { Badge, CloseButton, Form, Row, Col } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { check } from "prettier";
import { CheckLg, InfoCircleFill, QuestionCircle } from "react-bootstrap-icons";
import "./int.css";
const IntegrationByIdModal = (props: any) => {
  const initialState = () => {
    let obj: any = {};
    for (let i = 0; i < props.integrationByIds.length; i++) {
      const element: any = props.integrationByIds[i];

      if (!obj[element.fieldId]) {
        obj[element.fieldId] = "";
      }
    }
    if (obj) {
      return obj;
    }
  };

  const initialStateBool = () => {
    let obj: any = {};
    for (let i = 0; i < props.integrationByIds.length; i++) {
      const element: any = props.integrationByIds[i];

      if (!obj[element.fieldId]) {
        obj[element.fieldId] = "start";
      }
    }
    if (obj) {
      return obj;
    }
  };
  const dispatch = useAppDispatch();
  const [validated, setValidated] = useState(false);
  const [newInt, setNewInt] = useState(initialState());
  const [intStateBool, setIntStateBool] = useState(initialStateBool());
  const [clientIdCheck, setClientIdCheck] = useState({ ...initialStateBool() });
  let shadownNewInt = JSON.parse(JSON.stringify(newInt));
  let shadownIntStateBool = initialStateBool();
  let shadownBool = JSON.parse(JSON.stringify(clientIdCheck));
  const [modalCheck, setModalCheck] = useState("displayNone" );

  useEffect(() => {
    dispatch(getIntegrationAPIById(props.getByID));
  }, [props.getByID]);

  useEffect(() => {
    setNewInt(initialState());
    setIntStateBool(initialStateBool());
    setClientIdCheck({ ...initialStateBool() });

    props.setShowModal(false);
  }, [props.integrationByIds]);

  const onPasteHandler = (e: any) => {
    setClientIdCheck((prevState: any) => {
      if (
        e.clipboardData.getData("Text") &&
        !e.clipboardData.getData("Text").includes(" ")
      ) {
        return { ...prevState, [e.target.name]: true };
      } else {
        setValidated(false);
        return { ...prevState, [e.target.name]: false };
      }
    });
    if (e.clipboardData.getData("Text")) {
      setNewInt((prevState: any) => {
        !e.clipboardData.getData("Text") && setValidated(false);
        return {
          ...prevState,
          [e.target.name]: e.clipboardData.getData("Text"),
        };
      });
    }
  };
  const onChangeHandler = (e: any) => {
    setClientIdCheck((prevState: any) => {
      if (e.target.value && !e.target.value.includes(" ")) {
        return { ...prevState, [e.target.name]: true };
      } else {
        setValidated(false);
        return { ...prevState, [e.target.name]: false };
      }
    });

    setNewInt((prevState: any) => {
      !e.target.value && setValidated(false);
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const onModalClose = () => {
    let obj: any = {};
    for (let i = 0; i < props.integrationByIds.length; i++) {
      const element: any = props.integrationByIds[i];

      if (!obj[element.fieldId]) {
        obj[element.fieldId] = "start";
      }
    }
    setClientIdCheck({ ...obj });
    setModalCheck("displayNone")
    props.handleModalClose();
  };

  const checkIfConnected = () => {
    for (let i = 0; i < props.filteredDisplayName().length; i++) {
      const element = props.filteredDisplayName()[i];

      if (element.integrationId === props.getByID) {
        if (element.connected === true) {
          return true;
        } else {
          return false;
        }
      }
    }
    return;
  };

  const handleDataMap = () => {
    if (!checkIfConnected()) {
      return (
        props.integrationByIds &&
        props.integrationByIds.map((int: any, i: any) => (
          <Row className="col-12" style={{ paddingRight: 0 }} key={i}>
            <Form.Group as={Col} style={{ marginBottom: "1.5rem" }}>
              <Form.Label
                className="ushur-label "
                style={{
                  display: " flex",
                  alignContent: "center",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  fontWeight: 400,
                }}
              >
                {" "}
                {int.fieldDisplay}{" "}
                <QuestionCircle
                  style={{
                    fontSize: ".7rem",
                    color: "rgb(13, 110, 253)",
                    backgroundColor: "white",
                    borderColor: "rgb(13, 110, 253)",
                    marginLeft: ".5rem",
                  }}
                />
                {!shadownBool[int.fieldId] && (
                  <i className="bi bi-exclamation-diamond-fill label-icon error-icon"></i>
                )}
              </Form.Label>
              <Form.Control
                style={{ width: "28.5rem" }}
                required
                type="text"
                onChange={onChangeHandler}
                onPaste={onPasteHandler}
                name={int.fieldId}
                className={
                  "ushur-input " + (!shadownBool[int.fieldId] && " error")
                }
              />
              {!shadownBool[int.fieldId] && (
                <span className="helper-text form-text">{`${int.fieldDisplay} cannot be blank`}</span>
              )}
            </Form.Group>
          </Row>
        ))
      );
    }
  };

  const handleBtn = (id: any) => {
    let obj2 = {
      onClick: (e: any) => {
        let checkObj: any = shadownBool;
        const form = e.currentTarget;

        for (const key in shadownBool) {
          if (shadownBool[key] === true) {
            shadownBool[key] = true;
          } else {
            shadownBool[key] = false;
          }
          setClientIdCheck({ ...shadownBool });
        }

        for (const key in shadownBool) {
          if (shadownBool[key] !== true) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(false);
            return;
          }
        }

        let payload: any = {
          id: id,
          obj: {
            ...newInt,
          },
        };

        setValidated(true);

        payload && props.handleSubmit(payload);

        onModalClose();

        return setValidated(false);
      },
      text: "Connect",
      type: "primary",
    };
    if (id) {
      return obj2;
    }
  };
const displayModal= ()=>{
return setTimeout(()=>setModalCheck(""),3000) 
}

  return (
    <Modal
      actions={[handleBtn(props.getByID)]}
      className={`edit-variable-modal integration-modal ${displayModal()} `}
      onHide={onModalClose}
      size="md"
      title={
        <div
          style={{
            height: "70px",
            textAlign: "center",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <img
            style={{ height: "100%" }}
            src={props.getLogo}
            alt={props.getIntName}
          />
        </div>
      }
      showModal={
        props.integrationByIds[0]?.watchEvent ? false : props.showModal
      }
    >
      <Form className="row " validated={validated}>
        <Form.Label
          style={{
            fontWeight: 600,
            fontSize: ".8rem",
            marginBottom: "1.5rem",
            letterSpacing: "-.5px",
          }}
        >
          Manage Integration
        </Form.Label>
        <>{handleDataMap()}</>
      </Form>
    </Modal>
  );
};

export default IntegrationByIdModal;
