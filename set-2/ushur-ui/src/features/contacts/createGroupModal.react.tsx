import React, { useState, useEffect } from "react";
import "./CreateModal.css";
//@ts-ignore
import { Modal, notifyToast } from "@ushurengg/uicomponents";
import { useSelector } from "react-redux";

import SuccessCheck from "../../components/SuccessCheck.react";

import { Badge, CloseButton, Form } from "react-bootstrap";

import { useAppDispatch } from "../../app/hooks";
import { createGroup } from "./contactsSlice";
import { getTokenId, getUrl } from "../../utils/api.utils";
import {
  createNewGroups,
  resetCreateGroupResponse
} from "./contactsSlice";

type CreateModalProps = {
  open: boolean;
  onClose: any;
  listGroup: any;
};

const CreateGroupModal = (props: CreateModalProps) => {
  const dispatch = useAppDispatch();
  const { open, onClose } = props;
  const [validated, setValidated] = useState(false);
  const createGroupResponseData = useSelector(createNewGroups);
  const [newGroup, setNewGroup] = useState({
    groupId: "",
  });
  const [groupCheck, setGroupCheck] = useState({
    groupId: "start",
  });
  const [newGroupName, setnewGroupName] = useState("");

  let shadownBool = JSON.parse(JSON.stringify(groupCheck));

  const [isSuccess, setSuccess] = useState(false);
  const [checkDuplicate, setCheckDuplicate] = useState(false);
  const onPasteHandler = (e: any) => {
    setGroupCheck((prevState: any) => {
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
      setNewGroup((prevState: any) => {
        !e.clipboardData.getData("Text") && setValidated(false);
        return {
          ...prevState,
          [e.target.name]: e.clipboardData.getData("Text"),
        };
      });
    }
  };

  const onChangeHandler = (e: any) => {
    setGroupCheck((prevState: any) => {
      if (e.target.value && !e.target.value.includes(" ")) {
        return { ...prevState, [e.target.name]: true };
      } else {
        setValidated(false);
        return { ...prevState, [e.target.name]: false };
      }
    });

    setNewGroup((prevState) => {
      !e.target.value && setValidated(false);
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const onSubmit = (e: any) => {
    const checkDuplicate =
      props.listGroup &&
      props.listGroup.findIndex((item: any) => item === newGroup.groupId);
    if (newGroup.groupId.toLowerCase() === "Enterprise".toLowerCase() || newGroup.groupId.toLowerCase() === "Enterprise(Default)".toLowerCase()) {
      shadownBool.groupId = false;
      setCheckDuplicate(true);
      setSuccess(false);
      e.preventDefault();
      e.stopPropagation();
      setValidated(false);
      return;
    } else if (checkDuplicate > -1) {
      shadownBool.groupId = false;
      setCheckDuplicate(true);
      setSuccess(false);
      e.preventDefault();
      e.stopPropagation();
      setValidated(false);
      return;
    } else {
      setCheckDuplicate(false);
      for (const key in shadownBool) {
        if (shadownBool[key] === true) {
          shadownBool[key] = true;
        } else {
          shadownBool[key] = false;
        }
        setGroupCheck({ ...shadownBool });
      }
      for (const key in shadownBool) {
        if (shadownBool[key] !== true) {
          setSuccess(false);
          e.preventDefault();
          e.stopPropagation();
          setValidated(false);
          return;
        }
      }

      const payload = {
        cmd: "addGroup",
        groupId: newGroup.groupId,
        tokenId: getTokenId(),
        apiVer: "2.2",
      };
      setnewGroupName(newGroup.groupId)
      dispatch(createGroup(payload));
      onCancel();
    }
  };

  useEffect(() => {
    if (createGroupResponseData === "done") {
      notifyToast({
        variant: "success",
        text: "New Group Created!",
        CustomMessageComponent: (
          <span>
            Group{" "}<span className="font-bold">{newGroupName ?? ""}</span>{" "}
            created successfully
          </span>
        ),
        animation: true,
      });
    } else if (createGroupResponseData === "creating error") {
      notifyToast({
        variant: "warning",
        text: "Cant create a group",
        subText: "Error occur on creating a group, Please try again later",
        animation: true,
      });
    }
    dispatch(resetCreateGroupResponse());
  }, [createGroupResponseData]);

  const onCancel = () => {
    setNewGroup({
      groupId: "",
    });
    setCheckDuplicate(false);
    setGroupCheck({ groupId: "start" });
    setSuccess(false);
    onClose();
  };

  return (
    <>
      <Modal
        actions={[
          {
            onClick: onSubmit,

            text: "Add Group",

            type: "primary",
          },
        ]}
        className="new-modal"
        onHide={onCancel}
        title="Add Group"
        showModal={open}
      >
        <>
          <Form.Label className="ushur-label">
            Group Name{" "}
            {!shadownBool.groupId && (
              <i className="bi bi-exclamation-diamond-fill label-icon error-icon"></i>
            )}
            {checkDuplicate && (
              <span
                style={{
                  color: "#ff4545",
                  fontSize: ".8rem",
                  marginLeft: ".5rem",
                }}
              >
                {" "}
                Entry already exist{" "}
              </span>
            )}
          </Form.Label>
          <Form.Control
            onChange={onChangeHandler}
            onPaste={onPasteHandler}
            name="groupId"
            className={"ushur-input " + (!shadownBool.groupId && " error")}
            type="text"
            placeholder="group name"
          />
        </>

        <div style={{ marginTop: 20 }} />
      </Modal>
    </>
  );
};

export default CreateGroupModal;
