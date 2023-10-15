import React, { useState, useEffect, Dispatch } from "react";
// @ts-ignore
import {
  Table as UshurTable,
  Dropdown as UshurDropdown,
  Modal,
  Link,
  FieldButton,
  Button,
  notifyToast,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import HtmlFormatCell from "../../components/HtmlFormat.react";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import exportFromJSON from 'export-from-json';
import {
  getVariablesList,
  getVariableTypes,
  variablesList,
  variableTypes,
  saveVariableAPI,
  createResponse,
  getKeysListAPI,
  keysList,
  editResponse,
  editVariableAPI,
  updateKeyAPI,
  getDataSecurityRuleAPI,
  dataSecurityRule,
  getSettingsAPI,
  globalSettings
} from "./dataPropertiesSlice";
import ManageEncryptionModal from "./ManageEncryptionModal.react";
import SuccessModal from "../successModal/successModal.react";
import LogHistoryModal from "./loghistorymodal.react";
import EditColumnModal from "../../components/modals/editColumnModal.react";
import {
  getMetaDataAPI,
  listOfMetaData,
  addMetaDataAPI,
  dataUpdated,
  deleteMetaDataAPI,
  dataUploaded,
  getDecryptedMetaData,
  getMetaDataCountAPI,
} from "./metadataSlice";
import { cloneDeep, findIndex, isEqual } from "lodash";
import ConfirmationModal from "./confirmationModal.react";
import EditDataModal from "./editDataModal.react";
import BulkUploadModal from "./bulkUploadModa.react";
import CreateDataModal from "./createDataModal.react";
import ErrorModal from "../errorModal/errorModal.react";
import { getRolesDataAsync, metaDataRoles } from "../roles/rolesSlice";
import { isAdminAccess, isNonAdminUser, getAppContext } from "../../utils/api.utils";
import { useTrackPageLoad } from "../../utils/tracking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faBoxArchive,
  faCloudArrowUp,
  faTableColumns,
  faTableRows,
  faArrowToBottom,
  faDatabase,
  faTable,
} from "fontawesome-pro-regular-svg-icons";
import {
  faKeySkeleton,
  faShieldCheck,
} from "fontawesome-pro-regular-svg-icons";
import { downloadAsset } from './metadataAPI';
import useUrlSearchParams from '../../custom-hooks/useUrlSearchParams';
import ViewSelector from './ViewSelector.react';
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import CreateDataProperty from "./createDataProperty.react";
import "./metadata.css";
import EditDataPropertyModal from "./editDataProperty.react";
import PropertyConfirmationModal from "./propertyConfirmationModal.react";
import AddMenuDropdown from "./addMenuDropdown";
import { useLocalStorage } from "../../custom-hooks/useLocalStorage";


type metadataProps = {
  refreshPaginationCount: number;
  curAppContext: string;
  setCurAppContext: Dispatch<any>;
};

const MetaDataPage = (props: metadataProps) => {
  const { refreshPaginationCount, curAppContext, setCurAppContext } = props;
  const dispatch = useAppDispatch();
  const listOfVariables = useAppSelector(variablesList);
  const dataList = useAppSelector(listOfMetaData);
  const metaDataUploaded = useAppSelector(dataUploaded);
  let metaDataUpdated = useAppSelector(dataUpdated);
  const roles = useAppSelector(metaDataRoles);
  const [originalList, setOriginalList] = useState<any>([]);
  const [editList, setEditList] = useState<any>([]);
  const [createData, setCreateData] = useState<any>(false);
  const [disableEdit, setdisableEdit] = useState<any>(false);
  const listOfKeys = useAppSelector(keysList);
  const [delDataArr, setDelDataArr] = useState<any>([]);
  const [sampleData, setSampleData] = useState<any>([]);
  const [editMode, setEditMode] = useState<any>(false);
  const [confirmationObj, setConfirmationObj] = useState({
    title: "Save changes ?",
    message:
      "You are editing 20 metadata table entries. Are you sure you want to commit these changes? This might impact some of your existing modules.",
    delete: false,
    singleEdit: false,
  });

  const [currentColumns, setCurrentColumns] = useState<any>([
    {
      dataField: "ushurRecordId",
      sort: true,
      text: "RecordId",
      hidden: false,
    },
  ]);
  const { view } = useUrlSearchParams();
  const [showEncryptionModal, setShowEncryptionModal] = useState<any>(false);
  const currentDataSecurityRule = useAppSelector(dataSecurityRule);
  const settings = useAppSelector(globalSettings);
  const availableVariableTypes = useAppSelector(variableTypes);
  const [currentVariablesList, setCurrentVariablesList] = useState<any>([]);
  const [currentKeysList, setCurrentKeysList] = useState<any>([]);
  const [currentKeys, setCurrentKeys] = useState<any>([]);
  const [currentEditData, setCurrentEditData] = useState<any>({});
  const [editTable, setEditTable] = useState<any>(false);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [showSuccessModal, setShowSuccessModal] = useState<any>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<any>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<any>(false);
  const [showEditColumnModal, setShowEditColumnModal] = useState<any>(false);
  const [showEditDataModal, setShowEditDataModal] = useState<any>(false);
  const [showCreateDataModal, setShowCreateDataModal] = useState<any>(false);
  const [showErrorModal, setShowErrorModal] = useState<any>(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState<any>(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingChangesMsg, setPendingChangesMsg] = useState<any>("");
  const [listOfChanges, setListOfChanges] = useState<any>([]);
  const [showCreateButton, setShowCreateButton] = useState<any>(false);
  const variableCreated = useAppSelector(createResponse);
  const [encryptionOptions, setEncryptionOptions] = useState<any>({});
  const [errModalOpen, setErrModalOpen] = useState(false);
  const [localActiveView, setLocalActiveView] = useLocalStorage("uui_activeView_table", "")
  const [activeView, setActiveView] = useState(view || localActiveView || "data");
  const [tableData, setTableData] = useState<any>(editList);
  const [sampleTableData, setSampleTableData] = useState<any>(editList);
  const [tableColumns, setTableColumns] = useState<any>(currentColumns);
  const [resetDataColumns, setResetDataColumns] = useState<any>([]);
  const [showDataEncrypt, setShowDataEncrypt] = useState(true);
  const [editVariablesList, setEditVariablesList] = useState<any>({});
  const [currentVariableTypesList, setCurrentVariableTypesList] = useState<any>(
    []
  );
  const [showCreateVariableModal, setShowCreateVariableModal] = useState(false);
  const [primaryKey, setPrimaryKey] = useState<any>([]);
  const [showEditVariableModal, setShowEditVariableModal] = useState(false);
  const [showVariableConfirmation, setShowVariableConfirmation] = useState<any>(false);
  let variablesEdited = useAppSelector(editResponse);
  const [allowMultipleKeys, setAllowMultipleKeys] = useState(false);
  const [currentEditVariable, setCurrentEditVariable] = useState<any>({
    desc: "Test Variable",
    id: "Test",
    key: "yes",
    sec: "yes",
    type: "uid_string",
    variableName: "Test Variable",
  });
  const variableTypesList = useAppSelector(variableTypes);
  const [statusConfirmationType, setStatusConfirmationType] = useState("")

  const isMandatoryKey = (field: any) => {
    return currentKeys.includes(field);
  };

  const isEncrypted = (field: any) => {
    return currentColumns?.filter((item: any) => item.sec === "yes").map((item: any) => item.dataField).includes(field);
  };

  const getSortedVariables = () => {
    const primaryKeys: any = [];
    const encryptedkeys: any = [];
    const primaryEncrypted: any = [];
    const remaining: any = [];
    currentColumns.forEach((eachField: any) => {
      const variable = eachField.dataField;
      if (isMandatoryKey(variable)) {
        if (isEncrypted(variable)) {
          primaryEncrypted.push(eachField);
        } else {
          primaryKeys.push(eachField);
        }
      } else if (isEncrypted(variable)) {
        encryptedkeys.push(eachField);
      } else {
        remaining.push(eachField);
      }
    });
    return [
      ...primaryKeys,
      ...primaryEncrypted,
      ...encryptedkeys,
      ...remaining,
    ];
  };

  const saveVariable = (newVariable: any) => {
    let content: any = {};
    let totalVariablesList = [...currentVariablesList, newVariable];

    totalVariablesList.forEach(function (eachVariable: any) {
      let currentVariable = "e_" + eachVariable.variableName;
      content[currentVariable] = {
        id: eachVariable.id,
        desc: eachVariable.desc,
        prefix: eachVariable.prefix,
        suffix: eachVariable.suffix,
        type: eachVariable.type,
        text: eachVariable.text,
        sec: eachVariable.sec ? eachVariable.sec : "no",
      };
    });

    dispatch(saveVariableAPI({ content }));
    if (!allowMultipleKeys) {
      if (newVariable.isPrimary) {
        setPrimaryKey([newVariable]);
      }
    }
    sessionStorage.setItem(
      "newData",
      JSON.stringify({
        dataField: newVariable.variableName,
        text: newVariable.variableName,
        sort: true,
        description: newVariable.desc,
        hidden: false,
      })
    );
  };


  useEffect(() => {
    setLocalActiveView(activeView);
  }, [activeView]);


  const saveEditChangesAPI = () => {
    let content: any = cloneDeep(editVariablesList);
    let deletedVars = listOfChanges
      .filter((eachChange: any) => {
        return eachChange.changes.includes("delete");
      })
      .map((eachChange: any) => {
        return eachChange.variableName;
      });

    deletedVars.forEach((eachVar: any) => {
      let varName = "e_" + eachVar;
      delete content[varName];
    });

    setEditVariablesList(content);
    dispatch(editVariableAPI({ content }));
    updatePrimaryKey(primaryKey);
    setShowVariableConfirmation(false);
    setShowVariableConfirmation(false);
  };

  const handleEditVariableModalClose = () => {
    setShowEditVariableModal(false);
    setCurrentEditVariable({});
  };

  const handleSingleVariableEdit = (currentVariable: any) => {
    let curVar = "e_" + currentVariable.variableName;
    let currentPrimaryKeys: any = primaryKey;
    setEditVariablesList({
      ...editVariablesList,
      [curVar]: currentVariable,
    });
    if (currentVariable.key === "yes") {
      let curRowIndex = findIndex(primaryKey, (curKey: any) => {
        return curKey.id == currentVariable.id;
      });

      if (curRowIndex > -1) {
        currentPrimaryKeys = [currentVariable];
        if (allowMultipleKeys) {
          currentPrimaryKeys = [...primaryKey];
        }
      } else {
        let tempArr = cloneDeep(primaryKey);
        tempArr.push(currentVariable);

        if (allowMultipleKeys) {
          currentPrimaryKeys = tempArr;
        } else {
          currentPrimaryKeys = [currentVariable];
        }
      }
    } else {
      let curRowIndex = findIndex(primaryKey, (curKey: any) => {
        return curKey.id === currentVariable.id;
      });
      if (curRowIndex > -1) {
        if (allowMultipleKeys) {
          currentPrimaryKeys = [
            ...primaryKey.slice(0, curRowIndex),
            // Object.assign({}, primaryKey[curRowIndex], primaryKey),
            ...primaryKey.slice(curRowIndex + 1),
          ];
        } else {
          currentPrimaryKeys = [];
        }
      } else {
        if (allowMultipleKeys) {
          currentPrimaryKeys = primaryKey;
        } else {
          currentPrimaryKeys = primaryKey;
        }
      }
    }

    let content: any = {
      ...editVariablesList,
      [curVar]: currentVariable,
    };
    dispatch(editVariableAPI({ content }));
    setEditVariablesList(content);
    updatePrimaryKey(currentPrimaryKeys);
    setPrimaryKey(currentPrimaryKeys);
  };

  const updatePrimaryKey = (currentPrimaryKeys: any) => {
    let primaryKeysArr: any = [];

    if (currentPrimaryKeys && currentPrimaryKeys.length > 0) {
      currentPrimaryKeys.forEach((eachPrimryKey: any) => {
        let tempObj: any = {
          var: eachPrimryKey.id,
          uvar: "e_" + eachPrimryKey.variableName,
        };
        primaryKeysArr.push(tempObj);
      });

      let content: any = {
        OR: primaryKeysArr,
      };

      dispatch(updateKeyAPI({ content }));
    } else {
      let content: any = { OR: [] };
      dispatch(updateKeyAPI({ content }));
    }
  };

  const handleDeleteVariable = () => {
    setConfirmationObj({
      title: "Delete entry ?",
      message:
        "Are you sure you want to delete the entry? This might impact some of your existing modules.",
      delete: true,
      singleEdit: true,
    });

    setShowEditVariableModal(false);
    setShowVariableConfirmation(true);
  };

  const closeConfirmationModal = () => {
    setShowVariableConfirmation(false);
    variablesEdited = {};
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const statusCell = (cell: any, row: any) => {
    if (row.triggered) {
      let curText = cell === "" ? "Scheduled" : "Initiated";
      return (
        <Badge pill bg="secondary">
          {curText}
        </Badge>
      );
    } else {
      return <></>;
    }
  };

  const handleDownloadAsset = async (e: any, assetId: any) => {
    e.stopPropagation();
    // Make API call to dowload asset data
    const res = await downloadAsset(assetId);
    if (res) {
      setErrModalOpen(true);
    }
  }

  const primaryKeyCell = (cell: any) => {
    return cell === "yes" ? (
      <OverlayTrigger
        placement={"top"}
        overlay={
          <Tooltip className="tooltip" id={`tooltip-top`}>
            Unique Key
          </Tooltip>
        }
      >
        <span>
          <FontAwesomeIcon
            icon={faKeySkeleton as IconProp}
            color="#d3d3d3"
            size={"lg"}
          />
        </span>
      </OverlayTrigger>
    ) : null
  };

  const encryptCell = (cell: any) => {
    return cell === "yes" ? (
      <OverlayTrigger
        placement={"top"}
        overlay={
          <Tooltip className="tooltip" id={`tooltip-top`}>
            Encrypted
          </Tooltip>
        }
      >
        <span>
          <FontAwesomeIcon
            icon={faShieldCheck as IconProp}
            color="#d3d3d3"
            size={"lg"}
          />
        </span>
      </OverlayTrigger>
    ) : null
  };

  const propertiesColumns = [
    {
      dataField: "variableName",
      sort: true,
      text: "VARIABLE NAME",
      editable: false,
      hidden: false,
    },
    {
      dataField: "text",
      sort: true,
      text: "TYPE",
      editable: false,
      hidden: false,
    },
    {
      dataField: "desc",
      text: "DESCRIPTION",
      sort: true,
      hidden: false,
    },
    {
      dataField: "id",
      sort: true,
      text: "ALIAS",
      editable: false,
      hidden: false,
    },
    {
      dataField: "key",
      text: "KEY",
      hidden: false,
      formatter: primaryKeyCell,
      style: (cell: any, row: any, rowIndex: any, colIndex: any) => {
        return { textAlign: "center", width: "75px" };
      },
      headerStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
        return { textAlign: "center", width: "75px" };
      },
      type: "checkbox",
    },
    {
      dataField: "sec",
      text: "ENCRYPT",
      hidden: !showDataEncrypt,
      type: "checkbox",
      formatter: encryptCell,
      style: (cell: any, row: any, rowIndex: any, colIndex: any) => {
        return { textAlign: "center", width: "75px" };
      },
      headerStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
        return { textAlign: "center", width: "75px" };
      },
    },
  ];

  const assetDataCell = (cell: any) => {
    return (
      cell ?
        cell.split(",").length === 1 ?
          <div className="assetData">
            {cell}
            <div className="info-icon" onClick={(e: any) => handleDownloadAsset(e, cell)}>
              <FontAwesomeIcon
                icon={faCircleInfo as IconProp}
                color="#d3d3d3"
                size={"lg"}
                className="ml-1"
              />
              <span className="custom-tooltip">Click to view the image/file</span>
            </div>
          </div> : <div>{cell}</div>
        : null
    )
  };

  const getTableDataColumns = async () => {
    await setTableColumns([{}]);
    let columns = [];
    let data = [];
    if (activeView === 'data') {
      columns = getSortedVariables()
        .filter((o: any) => {
          return !o.hidden;
        })
        .map((item: any) => ({
          ...item,
          text: <ColumnName variable={item} />,
        }));
      data = editList;
    } else {
      columns = propertiesColumns
        .filter((o: any) => {
          return !o.hidden;
        });
      data = currentVariablesList;
    }
    await setTableColumns(columns);
    setTableData(data);
    setSampleTableData(data)
  }

  const resetEditVariablesList = () => {
    let curVar = "e_" + currentEditVariable.variableName;

    setEditVariablesList({
      ...editVariablesList,
      [curVar]: currentEditVariable,
    });
  };

  useTrackPageLoad({ name: "Data Table Page" });

  useEffect(() => {
    if (
      variablesEdited &&
      variablesEdited.hasOwnProperty("respCode") &&
      variablesEdited.respCode === 200 &&
      (editTable || showVariableConfirmation || showEditVariableModal)
    ) {
      setEditTable(false);
      // setShowSuccessModal(true);
      dispatch(getVariablesList());
      dispatch(getKeysListAPI());
      setListOfChanges([]);
      setShowEditVariableModal(false);
      setShowVariableConfirmation(false);

      if (editTable || showEditVariableModal) {
        notifyToast({ variant: "success", text: 'Updated', subText: 'Datatable Property Updated', animation: true });
      } else if (showVariableConfirmation) {
        notifyToast({
          variant: "success", text: 'Deleted', CustomMessageComponent: (
            <span>
              Datatable property <span className="font-bold">{currentEditVariable.variableName}</span> Deleted Successfully.
            </span>
          ),
          animation: true 
        });
      }
      // To clear variablesEdited response from store doing this dispatch call here
      dispatch(editVariableAPI({}));
    } else if (
      variablesEdited &&
      variablesEdited.hasOwnProperty("respCode") &&
      variablesEdited.respCode === 20108
    ) {
      closeConfirmationModal();
      notifyToast({ variant: "error", text: 'Error while deleting', subText: variablesEdited.respText || "Primary Key deletion failed", animation: true });
      resetEditVariablesList();
      // To clear variablesEdited response from store doing this dispatch call here
      dispatch(editVariableAPI({}));
    }
  }, [variablesEdited]);

  useEffect(() => {
    if (
      variableTypesList &&
      variableTypesList.content &&
      variableTypesList.content.length > 0
    ) {
      setCurrentVariableTypesList(variableTypesList.content);
    }
  }, [variableTypesList]);

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
    if (
      currentDataSecurityRule?.data?.GlobalDataSecurity === "No" &&
      propertiesColumns.length === 6
    ) {
      propertiesColumns.pop();
    }
  }, [currentDataSecurityRule]);

  useEffect(() => {
    setAllowMultipleKeys(settings?.respCode === 200 && settings.data?.allowMultiSelectKeys === "Yes")
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('appContext', getAppContext());
    dispatch(
      getRolesDataAsync({
        isNonAdminUser: isNonAdminUser(),
        isAdminAccess: isAdminAccess(),
      })
    );
    dispatch(getDataSecurityRuleAPI());
    dispatch(getSettingsAPI());
  }, []);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data && event.data.appContext)
        setCurAppContext(event.data.appContext);
    });
  }, []);

  useEffect(() => {
    loadPageData();
    let value: any = document.getElementsByClassName('ushur-input') ?? ""
    if (value.length > 0) {
      value[0].value ? value[0].value = "" : null
    }
  }, [curAppContext]);

  useEffect(() => {
    getTableDataColumns();
  }, [curAppContext, activeView, currentVariablesList, editList, currentColumns, encryptionOptions]); //786

  useEffect(() => {
    if (
      variableCreated &&
      variableCreated.hasOwnProperty("respCode") &&
      variableCreated.respCode === 200
    ) {
      dispatch(getVariablesList());
      setActiveView('properties');
      notifyToast({ variant: "success", text: 'Created', subText: 'Datatable Property created', animation: true });
      // To clear variableCreated response from store doing dispatch here
      dispatch(saveVariableAPI({}));
    }
  }, [variableCreated]);

  useEffect(() => {
    if (currentColumns && currentColumns.length > 0) {
      const variablesArray = Object.values(listOfVariables?.content?.[0] || {});
      const requiredData = currentColumns.map((column: any) => {
        const reqObj: any = variablesArray?.find(
          (item: any) => item.id === column.dataField
        );
        if (reqObj) {
          const reqVariableType: any = availableVariableTypes?.content?.find(
            (varType: any) => varType.type === reqObj.type
          );
          if (reqVariableType?.desc === undefined) {
            return;
          } else return reqVariableType.desc;
        }
        return;
      });
      let tempObj: any = {};
      let columns: any = [];
      currentColumns.forEach((eachCol: any) => {
        columns.push(eachCol["dataField"]);
      });
      for (let i = 0; i < columns.length; i++) {
        tempObj[columns[i]] = requiredData[i];
      }
      setSampleData(tempObj);
    }
    if (
      currentColumns?.[0]?.["dataField"] === "ushurRecordId" &&
      currentColumns.length > 0
    ) {
      setCurrentColumns([{}]);
    }
  }, [currentColumns]);

  useEffect(() => {
    if (metaDataUpdated && metaDataUpdated.success) {
      if (statusConfirmationType === "delete") {
        notifyToast({ variant: "success", text: 'Deleted', subText: `Datatable Data Deleted Successfully`, animation: true });
      }
      setStatusConfirmationType("")
      dispatch(getVariablesList());
      dispatch(getKeysListAPI());
      dispatch(getMetaDataAPI([{}]));
      setListOfChanges([]);
      setEditTable(false);
      setShowConfirmationModal(false);
      setShowEditDataModal(false);
      setShowCreateDataModal(false);
      dispatch(getDecryptedMetaData([{}]));
      dispatch(getMetaDataCountAPI());
      setShowErrorModal(false);
      //setSuccessMessage('New dataset added');
      // setShowSuccessModal(true);
    }
  }, [metaDataUpdated]);

  useEffect(() => {
    if (!isEqual(originalList, editList) || delDataArr.length > 0) {
      setPendingChangesMsg(
        `You have ${listOfChanges.length + delDataArr.length > 0
          ? listOfChanges.length + delDataArr.length
          : ""
        } unsaved changes`
      );
    } else {
      setPendingChangesMsg("");
    }
  }, [originalList, editList, delDataArr]);

  useEffect(() => {
    let tempArr: any = [];
    if (listOfVariables && listOfVariables.content && listOfVariables.content.length > 0) {
      for (let key in listOfVariables.content[0]) {
        if (key !== "_id") {
          let tempObj = {};
          let curVarNameArr: string[] = key.split("_");
          let curVarName = "";
          if (curVarNameArr && curVarNameArr.length > 0) {
            curVarNameArr.shift();
            curVarName = curVarNameArr.join("_");
          }
          tempObj = {
            variableName: curVarName,
            ...listOfVariables.content[0][key],
          };
          tempArr.push(tempObj);
        }
      }

      setEditVariablesList(listOfVariables.content[0]);

      updateCurrentVariablesWithKeys(currentKeysList, tempArr);
    } else {
      setEditVariablesList({});
      setCurrentVariablesList([]);
    }
  }, [listOfVariables, currentKeysList]);

  const updateCurrentVariablesWithKeys = (curKeys: any, variablesList: any) => {
    let curKeyNamesArr = curKeys.map((eachKey: any) => {
      return eachKey.uvar;
    });

    let allVars = variablesList;
    let primaryKeysArr: any = [];
    allVars.forEach((eachVar: any) => {
      if (curKeyNamesArr.indexOf("e_" + eachVar.variableName) > -1) {
        eachVar.key = "yes";
        primaryKeysArr.push(eachVar);
      } else {
        eachVar.key = "no";
      }
    });

    setPrimaryKey(primaryKeysArr);

    type DataType = { type: string, title: string };
    const dataTypes: DataType[] = [];
    const content = availableVariableTypes.content || [];
    content.forEach((type: any) => {
      dataTypes.push(type);
    });
    allVars.forEach((dataSet: any) => {
      dataTypes.forEach((type: DataType) => {
        if (type.type == dataSet.type) {
          dataSet.text = type.title ?? type.type;
        }
      })
      // Set variable type
      // const type = dataSet.type || "uid_string";
      // const reqObj = content.find((obj: any) => type === obj.type);
      // dataSet.type = reqObj ? (reqObj.title || reqObj.type) : '';
    });

    setCurrentVariablesList(allVars);

    if (listOfVariables && listOfVariables.content && listOfVariables.content.length > 0) {
      let tempObj = JSON.parse(JSON.stringify(listOfVariables.content[0]));
      for (let key in tempObj) {
        if (curKeyNamesArr.indexOf(key) > -1) {
          tempObj[key].key = "yes";
        } else {
          tempObj[key].key = "no";
        }
      }

      setOriginalList(tempObj);
      setEditVariablesList(tempObj);
    }
  };

  useEffect(() => {
    let colArr: any = [];
    if (
      listOfVariables &&
      listOfVariables.content &&
      listOfVariables.content.length > 0
    ) {
      for (let key in listOfVariables.content[0]) {
        if (key !== "_id") {
          let tempObj = {};
          tempObj = {
            variableName: key.split("_")[1],
            ...listOfVariables.content[0][key],
            key: "no",
          };
          let columnObj = {
            dataField: listOfVariables.content[0][key].id,
            sort: true,
            text: listOfVariables.content[0][key].text,
            description: listOfVariables.content[0][key].desc,
            hidden: false,
            sec: listOfVariables.content[0][key].sec,
            dataType: listOfVariables.content[0][key].type,
            primaryKey: currentKeys?.includes(listOfVariables.content[0][key].id),
            encrypted: listOfVariables.content[0][key].sec === 'yes',
            headerStyle: () => {
              return { textAlign: "left", width: "15.625rem" };
            },
            headerClasses: isMandatoryKey(listOfVariables.content[0][key].id) && listOfVariables.content[0][key].sec === "yes" ? "primaryEncryptedColumn" : isMandatoryKey(listOfVariables.content[0][key].id) ? "primaryColumn" : listOfVariables.content[0][key].sec === "yes" ? "encryptedColumn" : ''
          };
          colArr.push(columnObj);
        }
      }

      let savedCols: any = sessionStorage.getItem("columnsOrder");
      let preferredColumnOrder = colArr;
      let tempObj: any = JSON.parse(savedCols);
      if (!tempObj) {
        tempObj = {};
      }

      preferredColumnOrder.forEach((eachCol: any) => {
        if (eachCol.dataType === "uid_assetId") {
          eachCol["formatter"] = assetDataCell;
        }
        else if (eachCol.dataField === "status") {
          eachCol["formatter"] = statusCell;
        } else {
          eachCol["formatter"] = HtmlFormatCell;
        }
      });
      if (preferredColumnOrder.length) {
        setCurrentColumns(preferredColumnOrder);
      } else {
        setCurrentColumns([{}]);
      }

      tempObj["metadata"] = preferredColumnOrder;
      sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));
      const newEncryptionRules: any = {};
      preferredColumnOrder
        ?.filter((item: any) => item.sec === "yes")
        .map(
          (column: any) => (newEncryptionRules[column["dataField"]] = "yes")
        );
      setEncryptionOptions(newEncryptionRules);
    } else {
      setCurrentColumns([{}]);
    }
  }, [listOfVariables, currentKeys]);

  useEffect(() => {
    dispatch(getKeysListAPI());
  }, [listOfVariables]);

  useEffect(() => {
    if (dataList && dataList.length > 0) {
      let tempList = cloneDeep(dataList);
      let tempObj: any = {};
      currentColumns.forEach((eachCol: any) => {
        tempObj[eachCol.dataField] = "";
      });

      let tempArr: any = [];
      tempList.forEach((eachData: any) => {
        if (Object.keys(eachData).length === 1 && eachData.hasOwnProperty('ushurRecordId')) {
          return;
        }
        for (const key in tempObj) {
          if (!eachData.hasOwnProperty(key)) {
            eachData[key] = "";
          }
        }
        tempArr.push(eachData);
      });

      setEditList(cloneDeep(tempArr));
      setOriginalList(tempArr);
    } else {
      setEditList([]);
      setOriginalList([]);
    }
  }, [dataList]);

  useEffect(() => {
    if (
      listOfKeys &&
      listOfKeys.content &&
      listOfKeys.content.length > 0 &&
      listOfKeys.content[0].OR &&
      listOfKeys.content[0].OR.length > 0
    ) {
      setCurrentKeysList(listOfKeys.content[0].OR);
      let keysList = listOfKeys.content[0].OR.map((o: any) => {
        return o.var;
      });
      setCurrentKeys(keysList);
    } else {
      setCurrentKeys([]);
      setCurrentKeysList([]);
      setdisableEdit(true);
    }
  }, [listOfKeys]);

  useEffect(() => {
    if (metaDataUploaded) {
      // setSuccessMessage('File Uploaded Successfully')
      // setShowSuccessModal(true);
      dispatch(getVariablesList());
      dispatch(getKeysListAPI());
      dispatch(getMetaDataAPI([{}]));
    }
  }, [metaDataUploaded]);

  const loadPageData = () => {
    dispatch(getVariablesList());
    dispatch(getKeysListAPI());
    dispatch(getMetaDataAPI([{}]));
    dispatch(getMetaDataCountAPI());
    dispatch(getVariableTypes());
    dispatch(getDecryptedMetaData([{}]));
  };

  const handleEdit = () => {
    setEditTable(true);
  };

  const handleEditCancel = () => {
    setEditTable(false);
    setListOfChanges([]);
    setDelDataArr([]);
    fetchLatestResults();
  };

  const saveEditChanges = () => {
    setConfirmationObj({
      title: "Save changes ?",
      message: `You are editing  ${listOfChanges.length + delDataArr.length > 0
        ? listOfChanges.length + delDataArr.length
        : ""
        }  metadata table entries. Are you sure you want to commit these changes? This might impact some of your existing modules.`,
      delete: false,
      singleEdit: false,
    });
    setShowEditDataModal(false);
    setShowConfirmationModal(true);
  };

  const handleDeleteData = () => {
    setConfirmationObj({
      title: "Delete entry ?",
      message:
        "Are you sure you want to delete the entry? This might impact some of your existing modules.",
      delete: true,
      singleEdit: true,
    });

    setShowCreateDataModal(false);
    setShowEditDataModal(false);
    setShowConfirmationModal(true);
  };


  const handleConfimrationModalClose = () => {
    setShowConfirmationModal(false);
    metaDataUpdated = {};
    fetchLatestResults();
    handleEditCancel();
    if (!confirmationObj.singleEdit) {
      setEditTable(false);
    }
  };

  const handlePropertyConfirmClick = (confirmationType: string, isSingleEdit: any) => {
    if (confirmationType === "edit") {
      saveEditChangesAPI();
    }
    else if (confirmationType === "delete") {
      let curVar = "e_" + currentEditVariable.variableName;
      let curList = JSON.parse(JSON.stringify(editVariablesList));
      delete curList[curVar];
      setEditVariablesList(curList);
      let content: any = {
        ...curList,
      };
      dispatch(editVariableAPI({ content }));
    }
  };

  const handleConfirmClick = (confirmationType: string, isSingleEdit: any) => {
    setStatusConfirmationType(confirmationType)
    if (confirmationType === "edit") {
      if (isSingleEdit) {
        let content = [currentEditData];
        dispatch(addMetaDataAPI({ content }));
        setSuccessMessage("1 Metadata Updated");
      } else {
        let content = editList;
        dispatch(addMetaDataAPI({ content }));
        setSuccessMessage(
          `${listOfChanges.length + delDataArr.length > 0
            ? listOfChanges.length + delDataArr.length
            : ""
          } Metadata Updated`
        );
        if (delDataArr.length > 0) {
          let content = delDataArr;
          dispatch(deleteMetaDataAPI({ content }));
        }
      }
    } else if (confirmationType === "delete") {
      let content = [currentEditData];
      dispatch(deleteMetaDataAPI({ content }));
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setShowCreateButton(false);
  };

  const handleCellSave = (row: any, column: any) => {
    let curRowIndex = findIndex(editList, (o: any) => {
      return o.ushurRecordId === row.ushurRecordId;
    });

    let originalRowIndex = findIndex(originalList, (o: any) => {
      return o.ushurRecordId === row.ushurRecordId;
    });

    if (!isEqual(originalList[originalRowIndex], row)) {
      let changesIndex = findIndex(listOfChanges, (o: any) => {
        return o.ushurRecordId === row.ushurRecordId;
      });

      if (changesIndex > -1) {
        setListOfChanges([
          ...listOfChanges.slice(0, changesIndex),
          Object.assign({}, editList[changesIndex], row),
          ...listOfChanges.slice(changesIndex + 1),
        ]);
      } else {
        let tempArr: any = cloneDeep(listOfChanges);
        tempArr.push(row);
        setListOfChanges(tempArr);
      }
    } else {
      let changesIndex = findIndex(listOfChanges, (o: any) => {
        return o.ushurRecordId === row.ushurRecordId;
      });

      if (changesIndex > -1) {
        let tempArr = listOfChanges.filter((o: any) => {
          return o.ushurRecordId !== row.ushurRecordId;
        });
        setListOfChanges(tempArr);
      }
    }

    if (curRowIndex > -1) {
      setEditList([
        ...editList.slice(0, curRowIndex),
        Object.assign({}, editList[curRowIndex], row),
        ...editList.slice(curRowIndex + 1),
      ]);
    } else {
      let tempArr = cloneDeep(editList);
      tempArr.push(row);
      setEditList(tempArr);
    }
  };

  const handleEditColumns = () => {
    setActiveView('data')
    setShowEditColumnModal(true);
  };

  const handleRowSelection = (row: any, isSelected: any) => {
    let curRowIndex = findIndex(delDataArr, (o: any) => {
      return o.ushurRecordId === row.ushurRecordId;
    });
    if (isSelected) {
      if (curRowIndex > -1) {
      } else {
        // let tempArr = delDataArr;
        // tempArr.push(row);
        setDelDataArr([...delDataArr, row]);
      }
    } else {
      if (curRowIndex > -1) {
        let tempArr = delDataArr.filter((o: any) => {
          return o.ushurRecordId !== row.ushurRecordId;
        });
        setDelDataArr(tempArr);
      } else {
        // let tempArr = delDataArr;
        // tempArr.push(row);
        // setDelDataArr([...delDataArr, row]);
      }
    }
  };

  const handleRowClick = (e: any, row: any) => {
    if (activeView === 'properties') { //propertty row
      setCurrentEditVariable(row);
      setShowEditVariableModal(true);
    }
    if (activeView === 'data') { //datarow
      if (
        listOfKeys.content?.[0]?.["OR"].length === 0 ||
        listOfKeys["content"].length === 0
      ) {
        showNoKeysEditToast();

      } else {
        setCurrentEditData(row);
        setCreateData(false);
        setEditMode(true)
        setShowCreateDataModal(true);
      }
    }

  };

  const handleEditDataModalClose = () => {
    setShowEditDataModal(false);
    setCurrentEditData({});
  };

  const handleCreateDataModalClose = () => {
    setShowCreateDataModal(false);
    setCurrentEditData({});
  };

  const handleCreateAnotherDataset = () => {
    openCreateDataModal();
    handleSuccessModalClose();
  };

  const fetchLatestResults = () => {
    dispatch(getVariablesList());
    dispatch(getKeysListAPI());
    dispatch(getMetaDataAPI([{}]));
  };


  const handleCreateData = (row: any) => {
    let content = [row];
    dispatch(addMetaDataAPI({ content }));
    setSuccessMessage("New dataset added");
    setShowCreateButton(true);
  };

  const handleSingleDataSave = (row: any, hiddenCols: any) => {
    let curRowIndex = findIndex(editList, (o: any) => {
      return o.ushurRecordId === row.ushurRecordId;
    });

    let curItem: any = {
      ...row,
      ...hiddenCols,
    };

    if (curRowIndex > -1) {
      setCurrentEditData(curItem);
      setEditList([
        ...editList.slice(0, curRowIndex),
        Object.assign({}, editList[curRowIndex], curItem),
        ...editList.slice(curRowIndex + 1),
      ]);
    } else {
      let tempArr = cloneDeep(editList);
      tempArr.push(curItem);
      setCurrentEditData(curItem);
      setEditList(tempArr);
    }
    setConfirmationObj({
      title: "Save changes ?",
      message:
        "Are you sure you want to commit these changes? This might impact some of your existing modules.",
      delete: false,
      singleEdit: true,
    });

    setShowEditDataModal(false);
    setShowConfirmationModal(true);
  };

  const openCreateDataModal = () => {
    setCreateData(true);
    //setCurrentEditData({});
    setShowCreateDataModal(true);
  };

  const handleBulkUploadModalClose = () => {
    setShowBulkUploadModal(false);
  };

  const handleSaveColumns = (editedColumns: any) => {
    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = JSON.parse(savedCols);
    if (!tempObj) {
      tempObj = {};
    }
    tempObj["metadata"] = editedColumns;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));
    editedColumns.forEach((eachCol: any) => {
      if (eachCol.dataField === "status") {
        eachCol["formatter"] = statusCell;
      }
    });
    setCurrentColumns(cloneDeep(editedColumns));
    setShowEditColumnModal(false);
  };

  const handleCheckboxSelection = (column: any) => {
    setEncryptionOptions({
      ...encryptionOptions,
      [column]: encryptionOptions[column] === "yes" ? "no" : "yes",
    });
  };

  const handleResetEncryptionOptions = () => {
    const existingOptions = { ...encryptionOptions };
    for (var column in existingOptions) {
      existingOptions[column] = "yes";
    }
    setEncryptionOptions(existingOptions);
  };

  const handleClickViewSelector = () => {
    setActiveView((view: string) => (view === "data" ? "properties" : "data"));
    let value: any = document.getElementsByClassName('ushur-input') ?? ""
    if (value.length > 0) {
      value[0].value ? value[0].value = "" : null
    }
  }
  const handleSearch = (event: any) => {
    let search = event?.target?.value.toLowerCase();
    if (search === '') {
      setTableData(sampleTableData)
      return
    }
    if (search.length > 1 && sampleTableData) {
      const res = sampleTableData.filter((eachRow: any) => {
        return Object.values(eachRow).some((col: any) => {
          if (typeof col === 'string') {
            return col.toLocaleLowerCase().includes(search)
          }
          else if (Array.isArray(col)) {
            for (let index = 0; index < col.length; index++) {
              if (col[index].toLocaleLowerCase().includes(search)) {
                return true
              }
            }
            return false;
          }
          else {
            return false;
          }
        })
      });
      setTableData(res)
    }
  };

  const ColumnName = ({ variable }: any) => {
    return (
      <>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip className="tooltip" id="tooltip-top">
              {variable.dataField}
            </Tooltip>
          }
        >
          <span>{variable.dataField}</span>
        </OverlayTrigger>
        {
          variable.primaryKey &&
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip className="tooltip" id={`tooltip-top`}>
                Unique Key
              </Tooltip>
            }
          >
            <span className="ml-1">
              <FontAwesomeIcon
                icon={faKeySkeleton as IconProp}
                color="#d3d3d3"
                size={"lg"}
              />
            </span>
          </OverlayTrigger>
        }
        {
          variable.encrypted && currentDataSecurityRule?.data?.GlobalDataSecurity === "Yes" &&
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip className="tooltip" id={`tooltip-top`}>
                Encrypted
              </Tooltip>
            }
          >
            <span className="ml-1">
              <FontAwesomeIcon
                icon={faShieldCheck as IconProp}
                color="#d3d3d3"
                size={"lg"}
              />
            </span>
          </OverlayTrigger>
        }
      </>
    );
  }


  const GetNoDataText = () => {
    return (
      <p className="no-data-text">
        {
          currentVariablesList.length > 0 ? (
            !editList.length && (
              <>
                This datatable has no data, <Link
                  inline
                  label="click here"
                  onClick={() => {
                    if (!currentKeys.length) {
                      showNoKeysToast();
                    } else {
                      setShowCreateDataModal(true);
                    }
                  }}
                /> to add a new record.
              </>
            )
          ) : (
            <>
              This datatable has no properties, <Link
                inline
                label="click here"
                onClick={() => {
                  setActiveView("properties");
                  setShowCreateVariableModal(true);
                }}
              /> to add a property.
            </>
          )
        }
      </p>
    );
  }

  const showNoKeysToast = () => {
    return notifyToast({ variant: "warning", text: 'Unable to add data', subText: 'At least one property in the Datatable must be assigned as a private key before you can add additional records', animation: true });
  }
  const showNoKeysEditToast = () => {
    return notifyToast({ variant: "warning", text: 'Unable to Edit data', subText: 'At least one property in the Datatable must be assigned as a private key before you can edit records', animation: true });
  }
  const handleDataTableExport = (isTable: boolean) => {
    const column = isTable ? currentColumns : propertiesColumns;
    const dataArr = isTable ? editList : currentVariablesList;
    return dataArr.map((item: any) => {
      const obj: any = {};
      column.forEach((column: any) => {
        if ((!column.hidden && column.export !== false) || column.export) {
          obj[column.text] = item[column.dataField];
        }
      })
      return obj;
    });
  };

  const handleCsvFileDownload = (isTable: boolean) => {
    const fileName = isTable ? "DataTable" : "PropertiesTable"
    const exportData = handleDataTableExport(isTable);
    const exportProps = { data: exportData, fileName, exportType: "csv" } as const
    if (exportData.length === 0 || !exportData) {
      notifyToast({
        variant: "error",
        text: "Error!",
        subText: <>{fileName} file cannot be downloaded because data is empty</>,
        animation: true,
      });
    } else {
      notifyToast({
        variant: "success",
        text: "Success!",
        subText: <>{fileName} file downloaded</>,
        animation: true,
      });
      exportFromJSON(exportProps);
    }
  }

  const handleRefresh = () => {
    loadPageData()
    const searchField: any = document.getElementsByClassName('ushur-input')?.[0];
    if (searchField) {
      searchField.value = '';
    }
  }

  const DataTableDropdown = () => {
    return (
      <div className="ushur-datatable-download-dropdown">
        <UshurDropdown
          type="button"
          title={<FontAwesomeIcon icon={faArrowToBottom as IconProp} />}
          tooltipText="Download Data"
          options={[
            {
              category: 'DOWNLOAD .CSV',
              onClick: () => { handleCsvFileDownload(true) },
              text: <span className="download-data-icons"><FontAwesomeIcon icon={faDatabase as IconProp} />Data</span>,
              value: 'csv',
            },
            {
              category: 'DOWNLOAD .CSV',
              onClick: () => { handleCsvFileDownload(false) },
              text: <span className="download-data-icons"><FontAwesomeIcon icon={faTable as IconProp} />Properties</span>,
              value: 'csv',
            }
          ]}
        />
      </div>
    )
  };

  return (
    <>
      <div className="row m-0 mb-3" style={{ width: "82vw" }}>
        <div className="col-12 p-0">
          <div className="card" style={{ width: "100%", border: 0 }}>
            <div className="card-body">
              {/* <Header /> */}
              {roles?.showTable ? (
                <UshurTable
                  className={`${activeView === "data" ? "metadata-table" : "properties-table"} mt-1`}
                  count={refreshPaginationCount}
                  keyField={"ushurRecordId"}
                  exportFileName="MetaData"
                  columns={
                    tableColumns
                  }
                  exportColumns={activeView === "properties" ? tableColumns : currentColumns
                    .filter((o: any) => {
                      return !o.hidden;
                    })}
                  data={tableData}
                  dataTable={editList}
                  propertyTable={currentVariablesList}
                  dataTableColumn={currentColumns}
                  propertyTableColumn={propertiesColumns}
                  pageSizes={[
                    {
                      text: "25",
                      value: 25,
                    },
                    {
                      text: "50",
                      value: 50,
                    },
                    {
                      text: "100",
                      value: 100,
                    },
                    {
                      text: "All",
                      value: tableData.length,
                    },
                  ]}
                  showHeader={true}
                  headerComponent={
                    <>
                      <AddMenuDropdown menuItems={[
                        { text: 'Properties', type: 'header', icon: '', action: '' },
                        {
                          text: 'Add Datatable Property', type: 'normal', icon: faTableColumns, action: () => {
                            setShowCreateVariableModal(true);
                            setActiveView("properties");
                          }
                        },
                        { text: 'Data', type: 'header', icon: '', action: '' },
                        {
                          text: 'Create record', type: 'normal', icon: faTableRows, action: () => {
                            if (!currentKeys.length) {
                              showNoKeysToast();
                            } else {
                              setActiveView("data")
                              setEditMode(false);
                              setShowCreateDataModal(true)
                            }
                          }
                        },
                        {
                          text: 'Bulk upload records', type: 'normal', icon: faCloudArrowUp, action: () => {
                            if (!currentKeys.length) {
                              showNoKeysToast();
                            } else {
                              setActiveView("data");
                              setShowBulkUploadModal(true);
                            }
                          }
                        }, //actions have to be added later
                        {
                          text: 'Upload history', type: 'normal', icon: faBoxArchive, action: () => {
                            if (!currentKeys.length) {
                              notifyToast({ variant: "warning", text: 'Unable to view history', subText: 'At least one property in the Datatable must be assigned as a unique key to view the history', animation: true });
                            } else {
                              setActiveView("data");
                              setShowHistoryModal(true)
                            }
                          }
                        },

                      ]} />
                      <div style={{ backgroundColor: "rgb(240, 240, 240)", width: "1px", height: "32px", marginRight: "8px" }}></div>
                      <FieldButton
                        className="sl-search"
                        buttonIcon={<FontAwesomeIcon icon={faSearch} />}
                        hideInput
                        tooltipText="Search all records"
                        handleInputChange={(event: any) => {
                          handleSearch(event);
                        }}
                        handleClearSearch={(e: any) => {
                          e.target.blur(); // To make sure if the text is removed, the focus should go off to make sure the textbox to enter search text hides
                        }}
                      />
                      <ViewSelector handleClickViewSelector={handleClickViewSelector} activeView={activeView} />
                      <DataTableDropdown />
                    </>
                  }
                  showManageEncryption={showDataEncrypt}
                  handleManageEncryption={() => setShowEncryptionModal(true)}
                  showEdit={false}
                  showSearch={false}
                  showAutoRefresh={true}
                  autoRefreshComponent={
                    <span className="ushur-dropdown button">
                      <Button
                        type="secondary"
                        label={<FontAwesomeIcon icon={faSyncAlt} />}
                        tooltipText="Refresh"
                        onClick={handleRefresh}
                        className="dropdown-toggle"
                      />
                    </span>
                  }
                  editTable={roles?.allowEdit && editTable}
                  editClickHandler={handleEdit}
                  handleEditCancel={handleEditCancel}
                  saveChanges={saveEditChanges}
                  unsavedChangesAlert={pendingChangesMsg}
                  handleCellSave={handleCellSave}
                  handleEditColumns={handleEditColumns}
                  handleRowSelection={handleRowSelection}
                  handleRowClick={roles?.allowEdit && handleRowClick}
                  noDataComponent={<GetNoDataText />}
                  showExportOptions={false}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Modal
        onHide={() => setErrModalOpen(false)}
        size="md"
        title="Error"
        closeLabel="Close"
        showModal={errModalOpen}
        actions={[
          {
            onClick: () => setErrModalOpen(false),
            text: "OK",
            type: "primary",
          },
        ]}
        backdrop
      >
        <p>Something went wrong while downloading asset. Please try again later.</p>
      </Modal>

      <CreateDataProperty
        showCreateVariableModal={showCreateVariableModal}
        setShowCreateVariableModal={setShowCreateVariableModal}
        variableTypesList={currentVariableTypesList}
        totalVariables={currentVariablesList}
        saveVariable={saveVariable}
        primaryKey={primaryKey}
        setPrimaryKey={setPrimaryKey}
      />

      <EditDataPropertyModal
        showEditVariableModal={showEditVariableModal}
        currentEditVariable={currentEditVariable}
        setCurrentEditVariable={setCurrentEditVariable}
        editVariablesList={editVariablesList}
        setEditVariablesList={setEditVariablesList}
        handleSingleVariableEdit={handleSingleVariableEdit}
        handleDeleteVariable={handleDeleteVariable}
        handleEditVariableModalClose={handleEditVariableModalClose}
      />

      <ConfirmationModal
        showConfirmationModal={showConfirmationModal}
        handleModalClose={handleConfimrationModalClose}
        handleConfirmClick={handleConfirmClick}
        confirmationObj={confirmationObj}
        delDataArr={delDataArr}
        listOfChanges={listOfChanges}
      />

      <PropertyConfirmationModal
        showVariableConfirmation={showVariableConfirmation}
        handleModalClose={closeConfirmationModal}
        listOfChanges={listOfChanges}
        saveEditChangesAPI={saveEditChangesAPI}
        confirmationObj={confirmationObj}
        handleConfirmClick={handlePropertyConfirmClick}
      />

      <CreateDataModal
        showCreateDataModal={showCreateDataModal}
        handleCreateDataModalClose={handleCreateDataModalClose}
        currentFields={currentColumns}
        currentEditData={currentEditData}
        handleDeleteData={handleDeleteData}
        handleSingleDataSave={handleSingleDataSave}
        createData={createData}
        handleCreateData={handleCreateData}
        encryptionOptions={encryptionOptions}
        editMode={editMode}
        isMandatoryKey={isMandatoryKey}
        isEncrypted={isEncrypted}
        orderedVariables={getSortedVariables()}
      />
      <EditDataModal
        showEditDataModal={showEditDataModal}
        handleEditDataModalClose={handleEditDataModalClose}
        currentFields={currentColumns}
        currentEditData={currentEditData}
        handleDeleteData={handleDeleteData}
        handleSingleDataSave={handleSingleDataSave}
        createData={createData}
        currentKeys={currentKeys}
        disableEdit={disableEdit}
      />

      <LogHistoryModal
        setShowHistoryModal={setShowHistoryModal}
        showHistoryModal={showHistoryModal}
      />
      <EditColumnModal
        setShowEditColumnModal={setShowEditColumnModal}
        showEditColumnModal={showEditColumnModal}
        data={getSortedVariables().map((variable: any) => ({ ...variable, text: variable.dataField })) || []}
        //@ts-ignore
        resetData={
          () => {
            if (resetDataColumns.length > 0) return resetDataColumns;
            else {
              setResetDataColumns(currentColumns);
              return currentColumns;
            }
          }
        }
        handleSaveColumns={handleSaveColumns}
        page="metadata"
        showDescription={true}
      />

      <ErrorModal
        title={"No Primary Key"}
        showErrorModal={showErrorModal}
        handleModalClose={handleErrorModalClose}
        errorMessage={errorMessage}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        handleModalClose={handleSuccessModalClose}
        successMessage={successMessage}
        showCreateButton={showCreateButton}
        createAnotherText="Add another dataset"
        handleCreateAnother={handleCreateAnotherDataset}
      />
      <BulkUploadModal
        showBulkUploadModal={showBulkUploadModal}
        handleModalClose={handleBulkUploadModalClose}
        sampleData={sampleData}
      />
      <ManageEncryptionModal
        showModal={showEncryptionModal}
        handleModalClose={() => setShowEncryptionModal(false)}
        columnData={currentColumns?.filter((item: any) => item.sec === "yes")}
        handleCheckboxSelection={handleCheckboxSelection}
        encryptionOptions={encryptionOptions}
        resetEncryptionOptions={handleResetEncryptionOptions}
      />
    </>
  )
};

export default MetaDataPage;
