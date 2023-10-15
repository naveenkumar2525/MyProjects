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
  variablesList,
} from "./variablesSlice";
import { cloneDeep } from "lodash";

const CreateVariable = (props: any) => {
  const dispatch = useAppDispatch();
  const currentDataSecurityRule = useAppSelector(dataSecurityRule);
  const listOfVariables = useAppSelector(variablesList);
  const [currentVariableTypes, setCurrentVariableTypes] = useState<any>([]);
  const [showDataEncrypt, setShowDataEncrypt] = useState(false);
  const [createFields, setCreateFields] = useState<any>({
    variableName: "",
    id: "",
    desc: "",
    type: "",
    sec: "no",
    isPrimary: "no",
  });

  const [modalActions, setModalActions] = useState<any>([
    {
      onClick: () => {
        setCurrentStep(2);
      },
      text: "Next",
      type: "Primary",
    },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<any>({
    text: "",
    description: "",
    type: "",
  });

  const [isPrimary, setIsPrimary] = useState(false);
  const [isEncrypt, setIsEncrypt] = useState(false);
  const variableCreated = useAppSelector(createResponse);
  const [typeError, setTypeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [dataNotationError, setDataNotationError] = useState(false);
  const [duplicateVar, setDuplicateVar] = useState(false);
  const [duplicateMetadata, setDuplicateMetadata] = useState(false);

  useEffect(() => {
    if (props.variableTypesList && props.variableTypesList.length > 0) {
      let tempArr: any = [];

      props.variableTypesList.forEach(function (eachItem: any) {
        let tempObj = {
          onClick: () =>
            handleTypeSelection({
              text: eachItem.title ? eachItem.title : eachItem.type,
              description: eachItem.desc,
              type: eachItem.type,
            }),
          text: eachItem.title ? eachItem.title : eachItem.type,
          description: eachItem.desc,
          type: eachItem.type,
          category: "",
          value: eachItem.title ? eachItem.title : eachItem.type,
        };

        tempArr.push(tempObj);
      });

      setCurrentVariableTypes(tempArr);
    }
  }, [props.variableTypesList, createFields]);

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

  useEffect(() => {
    if (props.showCreateVariableModal) {
      if (
        variableCreated &&
        variableCreated.hasOwnProperty("respCode") &&
        variableCreated.respCode === 200
      ) {
        if (isPrimary) {
          let tempArr: any = cloneDeep(props.primaryKey);
          tempArr.push(createFields);

          let keyArr = tempArr.map((eachKey: any) => {
            return {
              var: eachKey.id,
              uvar: "e_" + eachKey.variableName,
            };
          });

          let content: any = {
            OR: keyArr,
          };
          props.setPrimaryKey(tempArr);
          dispatch(updateKeyAPI({ content }));
        }
        //setCurrentStep(3);

        //close modal
        onModalClose();
      }
    }
  }, [variableCreated]);

  useEffect(() => {
    if (currentStep === 1) {
      setTypeError(false);
      setModalActions([
        {
          onClick: () => {
            setCurrentStep(2);
          },
          text: "Next",
          type: "primary",
        },
      ]);
    }

    if (currentStep === 2) {
      setModalActions([
        {
          onClick: () => {
            setCurrentStep(1);
          },
          text: "Back",
          type: "secondary",
        },
        {
          onClick: () => {
            validateFields();
          },
          text: "Save",
          type: "primary",
        },
      ]);
    }

    if (currentStep === 3) {
      setModalActions([
        {
          onClick: () => {
            resetFields();
            setCurrentStep(1);
          },
          text: "Create another variable",
          type: "primary",
        },
      ]);
    }
  }, [currentStep]);

  const resetFields = () => {
    setCreateFields({
      variableName: "",
      id: "",
      desc: "",
      type: "",
      sec: "no",
    });
    setIsEncrypt(false);
    setIsPrimary(false);
    setSelectedType({ text: "", description: "", type: "" });
    setNameError(false);
    setDescError(false);
    setTypeError(false);
    setDuplicateVar(false);
    setDataNotationError(false);
    setDuplicateMetadata(false);
  };

  const validateName = (e: any, currentValue="") => {
    let isValid = true;
    setNameError(false);
    setDuplicateVar(false);
    const variableName = e?.target?.value || currentValue;
    const variablePattern = /[-_a-zA-Z0-9]+$/y;
    if (
      !variableName ||
      !variablePattern.test(variableName)
    ) {
      setNameError(true);
      isValid = false;
    } else if (
      listOfVariables?.content?.length > 0
    ) {
      if (`e_${variableName}` in listOfVariables?.content[0]) {
        setDuplicateVar(true);
        isValid = false;
      }
    }
    return isValid;
  }

  const validateDesc = (e: any, currentValue="") => {
    let isValid = true;
    setDescError(false);
    const variableDesc = e?.target?.value || currentValue;
    if (!variableDesc) {
      setDescError(true);
      isValid = false;
    }
    return isValid;
  }

  const validateCustomName = (e: any, currentValue="") => {
    let isValid = true;
    setDataNotationError(false);
    setDuplicateMetadata(false);
    const customName = e?.target?.value || currentValue;
    const MetavariablePattern = /[-_a-zA-Z0-9]+$/y;
    if (!MetavariablePattern.test(customName) || !customName) {
      setDataNotationError(true);
      isValid = false;
    }
    if (
      listOfVariables?.content?.length > 0 && customName
    ) {
      let entriesObj = listOfVariables?.content[0];
      for (let objKey in entriesObj) {
        if (entriesObj[objKey]["id"] === customName) {
          setDuplicateMetadata(true);
          isValid = false;
        }
      }
    }
    return isValid;
  }

  const validateType = () => {
    let isValid = true;
    setTypeError(false);
    if (selectedType.type === "") {
      isValid = false;
      setTypeError(true);
    }
    return isValid;
  }

  const validateFields = () => {
    const nameValid = validateName(null, createFields.variableName);
    const descValid = validateDesc(null, createFields.desc);
    const customNameValid = validateCustomName(null, createFields.id);
    const variableTypeValid = validateType();
    if (nameValid && descValid && customNameValid && variableTypeValid) {
      props.saveVariable(createFields);
    }
  };

  const handleTypeSelection = (currentOption: any) => {
    if (currentOption.type === selectedType.type) {
      setSelectedType({
        text: "",
        description: "",
        type: "",
      });
      setCreateFields({
        ...createFields,
        type: "",
      });
    } else {
      setCreateFields({
        ...createFields,
        type: currentOption.type,
        text: currentOption.text
      });
      setSelectedType(currentOption);
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
        sec: !curVal ? "yes" : "no",
      });
    } else if (field === "isPrimary") {
      setCreateFields({
        ...createFields,
        isPrimary: !curVal ? "yes" : "no",
      });
    }
  };

  const onModalClose = () => {
    setCurrentStep(1);
    resetFields();
    props.setShowCreateVariableModal(false);
  };

  return (
    <Modal
      actions={
        currentStep === 1
          ? [
              {
                onClick: () => {
                  setCurrentStep(2);
                },
                text: "Next",
                type: "primary",
              },
            ]
          : currentStep === 2
          ? [
              {
                onClick: () => {
                  setCurrentStep(1);
                  setCreateFields({
                    ...createFields,
                    id: "",
                    desc: "",
                    sec: "no",
                    variableName: "",
                  });
                },
                text: "Back",
                type: "secondary",
              },
              {
                onClick: () => {
                  validateFields();
                },
                text: "Save",
                type: "primary",
              },
            ]
          : [
              {
                onClick: () => {
                  resetFields();
                  setCurrentStep(1);
                },
                text: "Create another variable",
                type: "primary",
              },
            ]
      }
      className="create-variable"
      onHide={onModalClose}
      size="lg"
      title="Create Variable"
      showModal={props.showCreateVariableModal}
    >
      {currentStep === 1 && (
        <div className="container">
          {typeError && (
            <div className="row">
              <span className="error-msg">Please select a Variable Type</span>
            </div>
          )}
          <div
            className="row each-variable-type-header"
            style={{ backgroundColor: "#7A7A7A" }}
          >
            <div className="col-4">VARIABLE TYPE</div>
            <div className="col-8">DESCRIPTION</div>
          </div>
          {currentVariableTypes.map((eachVariable: any) => (
            <div
              key={eachVariable.text}
              className={`row each-variable-type ${
                selectedType.type === eachVariable.type ? "selected" : ""
              }`}
              onClick={() => {
                handleTypeSelection(eachVariable);
              }}
            >
              <div className="col-4">{eachVariable.text}</div>
              <div className="col-8">{eachVariable.description}</div>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <>
          <div className="col-12">
            <Dropdown
              label="Variable type"
              title={selectedType.text}
              options={currentVariableTypes}
              className="variable-type-dropdown"
              name="type"
              onBlur={(e: any) => {
                if (!e.target?.innerText) {
                  setTypeError(true);
                } else {
                  setTypeError(false);
                }
              }}
            />

            {/* <Input
              label="Variable type"
              name="type"
              handleInputChange={(event: any) => {
                handleInputChange(event, "type");
              }}
              value={selectedType.text}
              disabled
            /> */}
          </div>
          {typeError && (
            <div className="row">
              <span className="error-msg">Please select a Variable Type</span>
            </div>
          )}
          <div className="col-12">
            <Input
              label="Variable name"
              name="variableName"
              handleInputChange={(event: any) => {
                validateName(event);
                handleInputChange(event, "variableName");
                validateCustomName(event);
              }}
              error={nameError || duplicateVar}
              helperText={
                nameError
                  ? "Enter a valid Variable Name"
                  : duplicateVar
                  ? "Variable already exists."
                  : ""
              }
              value={createFields.variableName}
              maxLength="30"
              onBlur={validateName}
            />
          </div>

          <div className="col-12">
            <Input
              type="textarea"
              rows={3}
              label="Description"
              name="desc"
              handleInputChange={(event: any) => {
                validateDesc(event);
                handleInputChange(event, "desc");
              }}
              error={descError}
              helperText={descError ? "Description cannot be blank" : ""}
              value={createFields.desc}
              onBlur={validateDesc}
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
                          validateCustomName(event);
                          handleInputChange(event, "id");
                        }}
                        value={createFields.id}
                        error={dataNotationError || duplicateMetadata}
                        helperText={
                          dataNotationError
                            ? "Enter a Valid Custom name for Metadata "
                            : duplicateMetadata
                            ? "Custom metadata name already exists"
                            : ""
                        }
                        onBlur={validateCustomName}
                      />
                    </div>
                    <Checkbox
                      checked={isPrimary}
                      label="Set as primary key"
                      name="isPrimary"
                      handleOnChange={(event: any) => {
                        handleCheckboxChange(isPrimary, "isPrimary");
                        setIsPrimary((prevState) => {
                          return !prevState;
                        });
                      }}
                    />

                    {showDataEncrypt && (
                      <Checkbox
                        checked={isEncrypt}
                        label="Encrypt variable"
                        name="sec"
                        handleOnChange={(event: any) => {
                          handleCheckboxChange(isEncrypt, "sec");
                          setIsEncrypt((prevState) => {
                            return !prevState;
                          });
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
      )}

      {currentStep === 3 && (
        <div
          style={{
            display: "grid",
            placeItems: "center",
            fontSize: 40,
            color: "green",
          }}
        >
          <FontAwesomeIcon icon={faCheckCircle} color="green" size={"lg"} />
          <div>Variable Created</div>
        </div>
      )}
    </Modal>
  );
};

export default CreateVariable;
