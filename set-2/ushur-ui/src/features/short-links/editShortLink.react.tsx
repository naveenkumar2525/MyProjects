import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Modal,
  Input,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const EditShortLinkModal = (props: any) => {
  const dispatch = useAppDispatch();
  const { data } = props;
  const tags = data?.tags?.split(",")?.filter((x: any) => x) ?? [];

  const onModalClose = () => {
    props.handleClose();
  };

  const handleDelete = () => {
    props.handleDelete();
  };

  const actionButtons =
    data?.type === "file"
      ? [
          {
            onClick: () => {
              handleDelete();
            },
            text: "",
            type: "toggle",
            actionType: "destructive",
            startIcon: <i className="bi bi-trash"></i>,
            className: "delete-variable-btn",
          },
        ]
      : [];

  return (
    <Modal
      actions={[
        ...actionButtons,
        // {
        //   onClick: () => {
        //     // TODO
        //   },
        //   text: "Save",
        //   type: "primary",
        // },
      ]}
      className="edit-variable-modal"
      onHide={onModalClose}
      size="lg"
      title="Edit Short Link"
      showModal={props.showModal}
    >
      <>
        <div className="col-12">
          <Input
            label="Long URL / File Name"
            name="variableName"
            value={data?.urlOrFile ?? ""}
            disabled
          />
        </div>

        <div className="col-12">
          <Input
            label="Short URL"
            name="type"
            value={data?.surl ?? ""}
            disabled
          />
        </div>

        <div className="col-12">
          <label className="ushur-label form-label">Tags</label>
          <div className="mb-2 sl-tag-container">
            {tags.map((tag: any) => (
              <span className="sl-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </>
    </Modal>
  );
};

export default EditShortLinkModal;
