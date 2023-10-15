import React, { useState, useEffect } from "react";
// @ts-ignore
import { Modal, Input, Accordion } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faKeySkeleton,
  faShieldCheck,
} from "fontawesome-pro-regular-svg-icons";
import "./createDataModal.css";
import { isEqual } from 'lodash'
import { variablesValidations } from '../../utils/helpers.utils';
import { useAppSelector } from "../../app/hooks";
import { dataSecurityRule } from "./dataPropertiesSlice";

const CreateDataModal = (props: any) => {
  const [createFields, setCreateFields] = useState<any>({});
  const [hiddenFields, setHiddenFields] = useState<any>({});
  const [validationFields, setValidationFields] = useState<any>([]);
  const [visibleVariables, setVisibleVariables] = useState<any>([]);
  const [hiddenVariables, setHiddenVariables] = useState<any>([]);
  const [savedData, setSavedData] = useState<any>(props.currentEditData);
  const [savedHiddenData, setSavedHiddenData] = useState<any>(props.currentEditData);
  const currentDataSecurityRule = useAppSelector(dataSecurityRule);
  let editMode = props.editMode;
  const { isMandatoryKey, isEncrypted } = props;

  const getVariableIcons = (variable: any) => {
    const icons = [];
    if (isMandatoryKey(variable)) {
      icons.push({ icon: <FontAwesomeIcon icon={faKeySkeleton as IconProp} className="ml-1" />, tooltipText: "Unique Key" });
    }
    if (isEncrypted(variable) && currentDataSecurityRule?.data?.GlobalDataSecurity === "Yes") {
      icons.push({
        icon: <FontAwesomeIcon icon={faShieldCheck as IconProp} className="ml-1" />
        , tooltipText: "Encrypted"
      });
    }
    return icons;
  };

  const EditEncrypted = (field: any) => {
    return props.encryptionOptions[field] !== "no";
  }

  useEffect(() => {
    if (props.currentFields?.length > 0 && props.showCreateDataModal) {
      const visibleVariables: any = [];
      const hiddenVariables: any = [];
      const createFieldsObj: any = {};
      const hiddenFieldsObj: any = {};

      props.orderedVariables.forEach((variable: any) => {
        if (variable.hidden && !isMandatoryKey(variable.dataField) && !isEncrypted(variable.dataField)) {
          hiddenVariables.push(variable.dataField);
          {
            props.editMode ? hiddenFieldsObj[variable.dataField] = props.currentEditData[
              variable.dataField
            ] :
              hiddenFieldsObj[variable.dataField] = "";
          }
        } else {
          visibleVariables.push(variable.dataField);
          props.editMode ? createFieldsObj[variable.dataField] = props.currentEditData[
            variable.dataField
          ] :
            createFieldsObj[variable.dataField] = "";
        }
      });
      setVisibleVariables(visibleVariables);
      setHiddenVariables(hiddenVariables);
      setCreateFields(createFieldsObj);
      setHiddenFields(hiddenFieldsObj);
      setSavedData(createFieldsObj);
      setSavedHiddenData(hiddenFieldsObj);
    }
  }, [props.currentFields, props.showCreateDataModal, props.currentEditData, editMode]);

  const resetFields = () => {
    setCreateFields({});
    setHiddenFields({});
    setValidationFields([]);
  };
  const removeEmpty = (obj: any) => {
    Object.entries(obj).forEach(([key, val]) =>
      (val && typeof val === 'object') && removeEmpty(val) ||
      (val === null || val === "") && delete obj[key]
    );
    return obj;
  };

  const validateFields = () => {
    let formValid = true;
    const dataObj = {
      ...createFields,
      ...hiddenFields
    }
    let validationsArr = [...validationFields];
    if (validationsArr.length === 0) {
      validationsArr = initializeValidationsObj();
    }
    for (let key in dataObj) {
      const reqObj = props.currentFields.find(
        (ele: any) => ele.dataField === key
      );
      if (reqObj) {
        if (editMode && isEncrypted(key) && EditEncrypted(key)) return;
        const validationObj = variablesValidations[reqObj.dataType];
        if (
          (isMandatoryKey(key) && dataObj[key] === "") ||
          (dataObj[key] &&
            validationObj?.regex &&
            !dataObj[key].match(validationObj.regex))
        ) {
          const reqValidationObj = validationsArr.find(
            (v: any) => v.dataField === key
          );
          formValid = false;
          if (reqValidationObj) {
            reqValidationObj.error = true;
            reqValidationObj.errorMsg = dataObj[key]
              ? validationObj.errorMsg
              : "This value cannot be left blank";
          }
        }
      }
    }
    setValidationFields(validationsArr);

    if (formValid) {
      setCreateFields(removeEmpty(createFields));
      setHiddenFields(removeEmpty(hiddenFields));
      let editCreateFields = createFields
      let editHiddenFields = hiddenFields;
      for (let key in editCreateFields) {
        if (isEncrypted(key) && editMode && EditEncrypted(key)) {
          let a = key;
          delete editCreateFields[a];
        }
      }
      setCreateFields(editCreateFields);
      for (let key in editHiddenFields) {
        if (isEncrypted(key) && editMode && EditEncrypted(key)) {
          let a = key;
          delete editHiddenFields[a];
        }
      }
      setHiddenFields(editHiddenFields);
      props.handleCreateData({ ...createFields, ...hiddenFields });
    }
  };

  const handleInputChange = (event: any, field: string, type: string) => {
    const value = event.target.value;

    // Set values
    type === "visible"
      ? setCreateFields({
        ...createFields,
        [field]: value,
      })
      : setHiddenFields({
        ...hiddenFields,
        [field]: value,
      });

    // Set validations
    const validationsArr = [...validationFields];
    const reqObj = validationsArr.find((v: any) => v.dataField === field);
    if (reqObj) {
      reqObj.error = false;
      reqObj.errorMsg = "";
      setValidationFields(validationsArr);
    }
  };

  const onModalClose = () => {
    resetFields();
    props.handleCreateDataModalClose();
  };

  const initializeValidationsObj = () => {
    return props.currentFields.map((field: any) => {
      return {
        ...field,
        error: false,
        errorMsg: "",
      };
    });
  };

  const handleOnBlur = async (field: string) => {
    const value = createFields[field] || hiddenFields[field] || "";
    let reqData = [...validationFields];
    if (reqData.length === 0) {
      reqData = initializeValidationsObj();
    }
    const reqobj = reqData.find((item: any) => item.dataField === field);
    if (reqobj) {
      const validationObj = variablesValidations[reqobj.dataType];
      reqobj.errorMsg = "";
      if (isMandatoryKey(field) && !value) {
        reqobj.error = true;
        reqobj.errorMsg = "This value cannot be left blank.";
      }

      if (value && validationObj?.regex && !value.match(validationObj.regex)) {
        reqobj.error = true;
        reqobj.errorMsg = validationObj.errorMsg;
      }
      setValidationFields(reqData);
    }
  };

  const handleDeleteVariable = () => {
    props.handleDeleteData();
  };

  let editTableButtonActions = [
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
      onClick: validateFields,
      text: "Save",
      type: "primary",
      disabled: validationFields.some((field: any) => field.error) || (isEqual(savedData, createFields) && isEqual(savedHiddenData, hiddenFields))
    },
  ]

  let saveTableButtonActions = [
    {
      onClick: validateFields,
      text: "Save",
      type: "primary",
      disabled: validationFields.some((field: any) => field.error) || (isEqual(savedData, createFields) && isEqual(savedHiddenData, hiddenFields))
    },
  ]


  const getInputField = (eachField: any, type: string) => {
    return (
      <Input
        disabled={editMode && isEncrypted(eachField) && EditEncrypted(eachField)}
        icons={getVariableIcons(eachField)}
        label={`${eachField} ${isMandatoryKey(eachField) ? "(mandatory)" : ""}`}
        handleInputChange={(event: any) =>
          handleInputChange(event, eachField, type)
        }
        onBlur={() => handleOnBlur(eachField)}
        value={(editMode && isEncrypted(eachField) && EditEncrypted(eachField)) ? "" : (createFields[eachField] || hiddenFields[eachField])}
        error={
          validationFields.find((v: any) => v.dataField === eachField)?.error
        }
        helperText={
          validationFields.find((v: any) => v.dataField === eachField)
            ?.errorMsg || ""
        }
      />
    );
  };

  return (
    <Modal
      actions={editMode ? editTableButtonActions : saveTableButtonActions}
      className="edit-variable-modal create-data-modal"
      onHide={onModalClose}
      size="md"
      title={editMode ? "Edit Datatable Record" : "Add Datatable Record"}
      showModal={props.showCreateDataModal}
    >
      <div className="container">
        <div>
          {visibleVariables.map((eachField: any) => {
            if (eachField !== "ushurRecordId") {
              return (
                <>
                  <div className="col-12" key={eachField}>
                    {getInputField(eachField, "visible")}
                  </div>
                </>
              );
            }
          })}
          {hiddenVariables?.length > 0 && (
            <Accordion
              items={[
                {
                  body: (
                    <>
                      {Object.keys(hiddenFields).map((eachField: any) => {
                        if (eachField !== "ushurRecordId") {
                          return (
                            <div className="col-12" key={eachField}>
                              {getInputField(eachField, "hidden")}
                            </div>
                          );
                        }
                      })}
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
export default CreateDataModal;
