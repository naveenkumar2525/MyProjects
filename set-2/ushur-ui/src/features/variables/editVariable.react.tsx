import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Title,
  Modal,
  Input,
  Dropdown,
  Accordion,
  Checkbox,
  Table,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createResponse,
  dataSecurityRule,
  updateKeyAPI,
} from "./variablesSlice";

const EditVariableModal = (props: any) => {
  const dispatch = useAppDispatch();
  const currentDataSecurityRule = useAppSelector(dataSecurityRule);
  const [showDataEncrypt, setShowDataEncrypt] = useState(false);
  const [createFields, setCreateFields] = useState<any>({
    variableName: "",
    id: "",
    desc: "",
    type: "",
    sec: "",
    key: "",
  });

  const [descError, setDescError] = useState(false);

  useEffect(() => {
    setCreateFields(props.currentEditVariable);
  }, [props.currentEditVariable]);

  useEffect(() => {
    if (
      currentDataSecurityRule &&
      currentDataSecurityRule.respCode === 200 &&
      currentDataSecurityRule.data &&
      currentDataSecurityRule.data.GlobalDataSecurity
    ) {
      if (currentDataSecurityRule.data.GlobalDataSecurity === "Yes") {
        setShowDataEncrypt(true);
      } else {
        setShowDataEncrypt(false);
      }
    } else {
      setShowDataEncrypt(false);
    }
  }, [currentDataSecurityRule]);

  const resetFields = () => {
    setCreateFields({
      variableName: "",
      id: "",
      desc: "",
      type: "",
      sec: "",
      key: "",
    });

    setDescError(false);
  };

  const validateFields = () => {
    let formValid = true;

    if (createFields.desc === "") {
      setDescError(true);
      formValid = false;
    } else {
      setDescError(false);
    }

    if (formValid) {
      props.handleSingleVariableEdit(createFields);
    }
  };

  const handleInputChange = (event: any, field: string) => {
    if (field !== "primarykey" && field !== "encryptVariable") {
      if (field === "variableName") {
        setCreateFields({
          ...createFields,
          [field]: event.target.value,
          id: event.target.value,
        });
      } else {
        setCreateFields({
          ...createFields,
          [field]: event.target.value,
        });
      }
    }
  };

  const handleCheckboxChange = (curVal: any, field: string) => {
    if (field === "sec") {
      setCreateFields({
        ...createFields,
        sec: curVal === "yes" ? "no" : "yes",
      });
    } else if (field === "key") {
      setCreateFields({
        ...createFields,
        key: curVal === "yes" ? "no" : "yes",
      });
    }
  };

  const onModalClose = () => {
    resetFields();
    props.handleEditVariableModalClose();
  };

  const handleDeleteVariable = () => {
    props.handleDeleteVariable();
  };

  return (
    <Modal
      actions={[
        {
          onClick: () => {
            handleDeleteVariable();
          },
          text: "",
          type: "toggle",
          actionType: "destructive",
          startIcon: <i className="bi bi-trash"></i>,
          className: "delete-variable-btn",
        },
        {
          onClick: () => {
            validateFields();
          },
          text: "Save",
          type: "primary",
        },
      ]}
      className="edit-variable-modal"
      onHide={onModalClose}
      size="lg"
      title="Edit Variable"
      showModal={props.showEditVariableModal}
    >
      <>
        <div className="col-12">
          <Input
            label="Variable name"
            name="variableName"
            handleInputChange={(event: any) => {
              handleInputChange(event, "variableName");
            }}
            value={createFields.variableName}
            disabled
          />
        </div>

        <div className="col-12">
          <Input
            label="Variable type"
            name="type"
            handleInputChange={(event: any) => {
              handleInputChange(event, "type");
            }}
            value={createFields.type}
            disabled
          />
        </div>

        <div className="col-12">
          <Input
            type="textarea"
            rows={3}
            label="Description"
            name="desc"
            handleInputChange={(event: any) => {
              handleInputChange(event, "desc");
            }}
            error={descError}
            helperText={descError ? "Description cannot be blank" : ""}
            value={createFields.desc}
          />
        </div>

        <Accordion
          items={[
            {
              body: (
                <>
                  <div className="col-12">
                    <Input
                      label="Custom name for Metadata Table"
                      name="id"
                      handleInputChange={(event: any) => {
                        handleInputChange(event, "id");
                      }}
                      value={createFields.id}
                      disabled
                    />
                  </div>
                  <Checkbox
                    checked={createFields.key === "yes"}
                    label="Set as primary key"
                    name="key"
                    handleOnChange={(event: any) => {
                      handleCheckboxChange(createFields.key, "key");
                    }}
                  />
                  {showDataEncrypt && (
                    <Checkbox
                      checked={createFields.sec === "yes"}
                      label="Encrypt variable"
                      name="sec"
                      handleOnChange={(event: any) => {
                        handleCheckboxChange(createFields.sec, "sec");
                      }}
                    />
                  )}
                </>
              ),
              closedLabel: "Show Advanced Features",
              openLabel: "Hide Advanced Features",
            },
          ]}
        />

        {/* <div className="col-12">
                            <Dropdown
                                label="Variable type"
                                title={dropdownLabel}
                                options={currentVariableTypes}
                                className="variable-type-dropdown"
                                name="type"
                                handleInputChange={(event: any) => { handleInputChange(event, 'type') }}
                            />
                        </div> 

                        <div className="col-12">
                            <Input
                                label="Variable prefix"
                                placeholder="Variable prefix"
                                name="prefix"
                                handleInputChange={(event: any) => { handleInputChange(event, 'prefix') }}
                            />
                        </div>

                        <div className="col-12">
                            <Input
                                label="Variable suffix"
                                placeholder="Variable suffix"
                                name="suffix"
                                handleInputChange={(event: any) => { handleInputChange(event, 'suffix') }}
                            />
                        </div> */}
      </>
    </Modal>
  );
};

export default EditVariableModal;
