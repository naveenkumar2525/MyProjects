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
//@ts-ignore
// import  {Searchdropdown } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faKeySkeleton,
  faShieldCheck,
} from "fontawesome-pro-regular-svg-icons";
import "./createDataProperty.css"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createResponse,
  dataSecurityRule,
  updateKeyAPI,
  variablesList,
} from "./dataPropertiesSlice";
import { getSettingsAPI, globalSettings } from '../variables/variablesSlice';
import { cloneDeep } from "lodash";
import {
  SimpleSearch,
  // @ts-ignore
} from "@ushurengg/uicomponents";

const CreateDataProperty = (props: any) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(globalSettings);
  const currentDataSecurityRule = useAppSelector(dataSecurityRule);
  const listOfVariables = useAppSelector(variablesList);
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
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedType, setSelectedType] = useState<any>({
    text: "",
    category: "",
    type: "",
  });
  const [selectedPropertyType, setSelectedPropertyType] = useState<any>(
    { label: selectedType.text, value: selectedType.type, group: "" } || {}
  );
  const [currentPropertyType, setCurrentPropertyType] = useState<any>([]);

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
    // Get ent level settings
    dispatch(getSettingsAPI());
  }, []);

  useEffect(() => {
    if (props.variableTypesList && props.variableTypesList.length > 0) {
      let tempArr: any = [];
      props.variableTypesList.forEach(function (eachItem: any) {
        if (eachItem.triggerFeature && settings?.data?.triggerFeature !== "true") {
          return;
        }
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
      setCurrentPropertyType(
        tempArr.map((property: any) => ({
          label: property.text,
          value: property.text,
          category: property.type,
        }))
      );
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
      
        onModalClose();
      }
    }
  }, [variableCreated]);

  useEffect(() => {
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

  const validateName = (e: any, currentValue = "") => {
    let isValid = true;
    setNameError(false);
    setDuplicateVar(false);
    const variableName = e?.target?.value || currentValue;
    const variablePattern = /[-_a-zA-Z0-9]+$/y;
    if (!variableName || !variablePattern.test(variableName)) {
      setNameError(true);
      isValid = false;
    } else if (listOfVariables?.content?.length > 0) {
      if (`e_${variableName}` in listOfVariables?.content[0]) {
        setDuplicateVar(true);
        isValid = false;
      }
    }
    return isValid;
  };

  const validateDesc = (e: any, currentValue = "") => {
    let isValid = true;
    setDescError(false);
    const variableDesc = e?.target?.value || currentValue;
    if (!variableDesc) {
      setDescError(true);
      isValid = false;
    }
    return isValid;
  };

  const validateCustomName = (e: any, currentValue = "") => {
    let isValid = true;
    setDataNotationError(false);
    setDuplicateMetadata(false);
    const customName = e?.target?.value || currentValue;
    const MetavariablePattern = /[-_a-zA-Z0-9]+$/y;
    if (!MetavariablePattern.test(customName) || !customName) {
      setDataNotationError(true);
      isValid = false;
    }
    if (listOfVariables?.content?.length > 0 && customName) {
      let entriesObj = listOfVariables?.content[0];
      for (let objKey in entriesObj) {
        if (entriesObj[objKey]["id"] === customName) {
          setDuplicateMetadata(true);
          isValid = false;
        }
      }
    }
    return isValid;
  };

  const validateType = () => {
    let isValid = true;
    setTypeError(false);
    if (selectedType.type === "") {
      isValid = false;
      setTypeError(true);
    }
    return isValid;
  };

  const validateFields = () => {
    const nameValid = validateName(null, createFields.variableName);
    const customNameValid = validateCustomName(null, createFields.id);
    const variableTypeValid = validateType();
    if (nameValid && customNameValid && variableTypeValid) {
      props.saveVariable(createFields);
    }
  };

  useEffect(() =>{
    setSelectedPropertyType({label: selectedType.label, value: selectedType.value, group: ""})
  },[selectedType])

  const handleTypeSelection = (currentOption: any) => {
    setCreateFields({
      ...createFields,
      type: currentOption.category,
      text: currentOption.label,
    });
    setSelectedType(currentOption);
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
    setCurrentStep(2);
    resetFields();
    props.setShowCreateVariableModal(false);
  };

  const customStyle = {
    control: (base: any) => ({
      ...base,
      "&:hover": {
        cursor: "pointer",
      },
      width: "100%",
      fontSize: "0.825rem",
    }),
    option: (base: any,{isFocused, isSelected}:any) => ({
      ...base,
      cursor: "pointer",
      paddingTop: 3,
      paddingBottom: 2,
      paddingRight: 4,
      paddingLeft: 6,
      fontSize: "0.825rem",
      display: "inline-block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      background: isFocused ? '#e3e3e3' : '#FFFFFF',
      color: isSelected ? '#2F80ED' : '#332E20',
    }),
    valueContainer: (provided:any) => ({
      ...provided,
      marginTop: -2,
      padding: 1,
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999999,
      marginTop: 1,
    }),
    menuPortal: (provider: any) => ({
      ...provider,
      zIndex: 9999999,
    }),
  };

  return (
    <Modal
      actions={[
        {
          onClick: () => {
            validateFields();
          },
          text: "Save",
          type: "primary",
        },
      ]}
      className="create-variable overflow-show"
      onHide={onModalClose}
      size="md"
      title="Add New Datatable Property"
      showModal={props.showCreateVariableModal}
    >
      <div className="col-12">
        <Input
          label="Property name"
          name="variableName"
          handleInputChange={(event: any) => {
            validateName(event);
            handleInputChange(event, "variableName");
            validateCustomName(event);
          }}
          error={nameError || duplicateVar}
          helperText={
            nameError
              ? "Enter a valid property Name"
              : duplicateVar
              ? "Property already exists."
              : ""
          }
          value={createFields.variableName}
          maxLength="30"
          onBlur={validateName}
        />
      </div>
      <div className="col-12">    
        <SimpleSearch
          label={"Property type"}
          options={currentPropertyType ? currentPropertyType : []}
          style={customStyle}
          setDropDownValue={selectedPropertyType ? selectedPropertyType : {}}
          handleSelectedData={(e: any) => handleTypeSelection(e)}
          className="variable-type-dropdown"
        />
      </div>
     
      {typeError && (
        <div className="row">
          <span className="error-msg">Please select a Property Type</span>
        </div>
      )}

      <div className="col-12">
        <Input
          type="textarea"
          rows={3}
          label="Description (Optional)"
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
                    label="Alias for datatable"
                    name="id"
                    handleInputChange={(event: any) => {
                      validateCustomName(event);
                      handleInputChange(event, "id");
                    }}
                    value={createFields.id}
                    error={dataNotationError || duplicateMetadata}
                    helperText={
                      dataNotationError
                        ? "Enter a Valid Alias for datatable"
                        : duplicateMetadata
                        ? "Alias for datatable already exists"
                        : ""
                    }
                    onBlur={validateCustomName}
                  />
                </div>
                <Checkbox
                  checked={isPrimary}
                  label={
                    <>
                      Use as unique
                      <FontAwesomeIcon
                        icon={faKeySkeleton as IconProp}
                        className="ml-2"
                      />
                    </>
                  }
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
                    label={
                      <>
                        Encrypt Data
                        <FontAwesomeIcon
                          icon={faShieldCheck as IconProp}
                          className="ml-2"
                        />
                      </>
                    }
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
    </Modal>
  );
};

export default CreateDataProperty;
