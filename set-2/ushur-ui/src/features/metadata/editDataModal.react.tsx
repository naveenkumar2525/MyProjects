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
import { variablesList } from "../variables/variablesSlice";

const EditDataModal = (props: any) => {
  let key:any;
  const dispatch = useAppDispatch();
  const list = useAppSelector(variablesList);
  const [createFields, setCreateFields] = useState<any>({});
  const [hiddenFields, setHiddenFields] = useState<any>({});
  const [currentActions, setCurrentActions] = useState<any>([]);
  const [showError, setShowError] = useState(false);
  const obj = list.content?.[0];
  const reqArr:any = [];
  for (key in obj) {
	if (obj[key].sec === "yes") {
  	reqArr.push(obj[key].id);
  }
  }  
  useEffect(() => {
    setCurrentActions([
      {
        onClick: () => {
          handleDeleteVariable();
        },
        text: "",
        type: "toggle",
        actionType: "destructive",
        startIcon: <i className="bi bi-trash"></i>,
      },
      {
        onClick: () => {
          validateFields();
        },
        text: "Save",
        type: "primary",
      },
    ]);
  }, [props.createData]);
  useEffect(() => {
    if (
      props.currentFields &&
      props.currentFields.length > 0 &&
      props.currentEditData
    ) {
      let tempObj: any = {};
      props.currentFields
        .filter((o: any) => {
          return !o.hidden;
        })
        .forEach((eachField: any) => {
          tempObj[eachField.dataField] = props.currentEditData[
            eachField.dataField
          ]
            ? props.currentEditData[eachField.dataField]
            : "";
        });

      setCreateFields(tempObj);

      let hiddenTempObj: any = {};

      props.currentFields
        .filter((o: any) => {
          return o.hidden;
        })
        .forEach((eachField: any) => {
          hiddenTempObj[eachField.dataField] = props.currentEditData[
            eachField.dataField
          ]
            ? props.currentEditData[eachField.dataField]
            : "";
        });

      setHiddenFields(hiddenTempObj);
    }
  }, [props.currentFields, props.currentEditData]);

  // useEffect(() => {
  //     setCreateFields(props.currentEditData);
  // }, [props.currentEditData])

  const resetFields = () => {
    setCreateFields({});
    setHiddenFields({});
  };

  const validateFields = () => {
    let formValid = true;

    for (var key in createFields) {
      if (createFields.hasOwnProperty(key)) {
        if (props.currentKeys.includes(key) && createFields[key] === "") {
          formValid = false;
          setShowError(true);
        }
      }
    }

    for (var key in hiddenFields) {
      if (hiddenFields.hasOwnProperty(key)) {
        if (props.currentKeys.includes(key) && hiddenFields[key] === "") {
          formValid = false;
          setShowError(true);
        }
      }
    }

    if (formValid) {
      props.handleSingleDataSave(createFields, hiddenFields);
    }
  };

  const handleInputChange = (event: any, field: string) => {
    setCreateFields({
      ...createFields,
      [field]: event.target.value,
    });

    if (props.currentKeys.includes(field)) {
      if (event.target.value === "") {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }

    // if (props.currentKeys.includes(field) && event.target.value !== '') {
    //     setShowError(false);
    // } else {
    //     setShowError(true)
    // }
  };

  const handleHiddenInputChange = (event: any, field: string) => {
    setHiddenFields({
      ...hiddenFields,
      [field]: event.target.value,
    });

    if (props.currentKeys.includes(field)) {
      if (event.target.value === "") {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }
  };

  const onModalClose = () => {
    resetFields();
    setShowError(false);
    props.handleEditDataModalClose();
  };

  const handleDeleteVariable = () => {
    props.handleDeleteData();
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
          className: "delete-metadata-btn",
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
      title="Edit Meta Data"
      showModal={props.showEditDataModal}
    >
      <div className="container">
        <div className="row">
          {Object.keys(createFields).map((eachField: any, index: any) => {
            if (eachField !== "ushurRecordId") {
              return (
                <div className="col-12" key={eachField}>
                  <Input
                    key={eachField}
                    label={eachField}
                    disabled={reqArr.includes(eachField)}
                    name={eachField}
                    handleInputChange={(event: any) => {
                      handleInputChange(event, eachField);
                    }}
                    value={createFields[eachField]}
                    error={
                      props.currentKeys.includes(eachField) &&
                      createFields[eachField] === "" &&
                      showError
                    }
                    helperText={
                      props.currentKeys.includes(eachField) &&
                      createFields[eachField] === "" &&
                      showError
                        ? `${eachField} cannot be blank`
                        : ""
                    }
                  />
                </div>
              );
            } else {
              return <></>;
            }
          })}

          {Object.keys(hiddenFields) && Object.keys(hiddenFields).length > 0 && (
            <Accordion
              items={[
                {
                  body: (
                    <>
                      {Object.keys(hiddenFields).map(
                        (eachField: any, index: any) => {
                          if (eachField !== "ushurRecordId") {
                            return (
                              <div className="col-12" key={eachField}>
                                <Input
                                  key={eachField}
                                  label={eachField}
                                  name={eachField}
                                  disabled={reqArr.includes(eachField)}
                                  handleInputChange={(event: any) => {
                                    handleHiddenInputChange(event, eachField);
                                  }}
                                  value={hiddenFields[eachField]}
                                  error={
                                    props.currentKeys.includes(eachField) &&
                                    hiddenFields[eachField] === "" &&
                                    showError
                                  }
                                  helperText={
                                    props.currentKeys.includes(eachField) &&
                                    hiddenFields[eachField] === "" &&
                                    showError
                                      ? `${eachField} cannot be blank`
                                      : ""
                                  }
                                />
                              </div>
                            );
                          } else {
                            return <></>;
                          }
                        }
                      )}
                    </>
                  ),
                  closedLabel: "Show hidden columns",
                  openLabel: "Close hidden columns",
                },
              ]}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditDataModal;
