import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Button,
  Input,
  Title,
  DataCard,
  Table as UshurTable,
  Checkbox,
  Link,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CreateVariable from "./createVariable.react";
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
  getSettingsAPI,
  globalSettings,
  getDataSecurityRuleAPI,
  dataSecurityRule,
} from "./variablesSlice";
import SuccessModal from "../successModal/successModal.react";
import { isEqual, findIndex, cloneDeep } from "lodash";
import ConfirmationModal from "./confirmationModal.react";
import EditVariableModal from "./editVariable.react";
import ErrorModal from "../errorModal/errorModal.react";
import EditColumnModal from "../../components/modals/editColumnModal.react";
import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";
import { getRolesDataAsync, variableRoles } from "../roles/rolesSlice";
import { isAdminAccess, isNonAdminUser,getAppContext } from "../../utils/api.utils";
import { useTrackPageLoad } from "../../utils/tracking";
import AppContextDropdown from "../../components/AppContextDropdown.react";

const VariablesPage = () => {
  const { page } = useUrlSearchParams();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(globalSettings);
  const currentDataSecurityRule = useAppSelector(dataSecurityRule);
  const list = useAppSelector(variablesList);
  const roles = useAppSelector(variableRoles);
  const [allowMultipleKeys, setAllowMultipleKeys] = useState(true);
  const [showDataEncrypt, setShowDataEncrypt] = useState(true);

  const [originalList, setOriginalList] = useState<any>({});
  const variableTypesList = useAppSelector(variableTypes);
  const variableCreated = useAppSelector(createResponse);
  const listOfKeys = useAppSelector(keysList);
  const [showCreateVariableModal, setShowCreateVariableModal] = useState(false);
  const [showEditVariableModal, setShowEditVariableModal] = useState(false);
  const [currentVariablesList, setCurrentVariablesList] = useState<any>([]);
  const [currentVariableTypesList, setCurrentVariableTypesList] = useState<any>(
    []
  );
  const [currentKeysList, setCurrentKeysList] = useState<any>([]);

  const [editTable, setEditTable] = useState<any>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<any>(false);
  const [showErrorModal, setShowErrorModal] = useState<any>(false);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [editVariablesList, setEditVariablesList] = useState<any>({});
  let variablesEdited = useAppSelector(editResponse);
  const [pendingChangesMsg, setPendingChangesMsg] = useState<any>("");
  const [showVariableConfirmation, setShowVariableConfirmation] =
    useState<any>(false);
  const [listOfChanges, setListOfChanges] = useState<any>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEditColumnModal, setShowEditColumnModal] = useState<any>(false);
  const [primaryKey, setPrimaryKey] = useState<any>([]);
  const [currentEditVariable, setCurrentEditVariable] = useState<any>({
    desc: "Test Variable",
    id: "Test",
    key: "yes",
    sec: "yes",
    type: "uid_string",
    variableName: "Test Variable",
  });
  const [confirmationObj, setConfirmationObj] = useState({
    title: "Save changes ?",
    message: "",
    delete: false,
    singleEdit: false,
  });

  const [currentColumns, setCurrentColumns] = useState<any>([
    {
      dataField: "variableName",
      sort: true,
      text: "VARIABLE NAME",
      editable: false,
    },
  ]);

  const [defaultSorted, setDefaultSorted] = useState<any>([
    {
      dataField: "variableName",
      order: "asc",
    },
  ]);

  const [curAppContext, setCurAppContext] = useState<any>("");
  const [count, setCount] = useState<any>(0);

  useTrackPageLoad({ name: "Variables Page" });

  useEffect(() => {
    dispatch(
      getRolesDataAsync({
        isNonAdminUser: isNonAdminUser(),
        isAdminAccess: isAdminAccess(),
      })
    );
    window.addEventListener("message", (event) => {
      if (event.data && event.data.appContext)
        setCurAppContext(event.data.appContext);
    });
  }, []);

  useEffect(() => {
    loadPageData();
  }, [curAppContext]);

  useEffect(() => {
    localStorage.setItem('appContext', getAppContext());
    dispatch(getKeysListAPI());
    dispatch(getSettingsAPI());
    dispatch(getDataSecurityRuleAPI());
    dispatch(getVariableTypes());
    dispatch(getVariablesList());

    let colArr = [
      {
        dataField: "variableName",
        sort: true,
        text: "VARIABLE NAME",
        editable: false,
        hidden: false,
      },
      {
        dataField: "type",
        sort: true,
        text: "VARIABLE TYPE",
        editable: false,
        hidden: false,
      },
      {
        dataField: "desc",
        text: "DESCRIPTION",
        sort: true,
        hidden: false,
        style: function callback(
          cell: any,
          row: any,
          rowIndex: any,
          colIndex: any
        ) {
          let curVar = "e_" + row.variableName;
          if (list && list.content && list.content.length > 0) {
            if (cell !== list?.content[0][curVar]?.desc)
              return { backgroundColor: "#EBF3FE", borderRadius: "4px" };
            else {
              return { backgroundColor: "#fff" };
            }
          } else {
            return { backgroundColor: "#fff" };
          }
        },
      },
      {
        dataField: "id",
        sort: true,
        text: "CUSTOM METADATA NAME",
        editable: false,
        hidden: false,
      },
      {
        dataField: "key",
        text: "KEY",
        hidden: false,
        formatter: checkMarkCell,
        style: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          let curVar = "e_" + row.variableName;
          let currentKeysListNames = currentKeysList.map(
            (eachKey: any) => eachKey.uvar
          );
          let isDefaultKey = currentKeysListNames.includes(curVar)
            ? "yes"
            : "no";

          if (cell !== isDefaultKey) {
            //return { backgroundColor: '#EBF3FE', borderRadius: '4px', textAlign: 'center', width: '75px' }
            return { textAlign: "center", width: "75px" };
          } else {
            return { textAlign: "center", width: "75px" };
          }
        },
        headerStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
        editorStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
        type: "checkbox",
      },
      {
        dataField: "sec",
        text: "ENCRYPT",
        hidden: !showDataEncrypt,
        type: "checkbox",
        formatter: checkMarkCell,
        style: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          let curVar = "e_" + row.variableName;
          if (list && list.content && list.content.length > 0) {
            if (cell !== list?.content[0][curVar]?.desc) {
              //return { backgroundColor: '#EBF3FE', borderRadius: '4px' }
              return { textAlign: "center", width: "75px" };
            } else {
              return { backgroundColor: "#fff" };
            }
          } else {
            return { backgroundColor: "#fff" };
          }
        },
        editorStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
        headerStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
      },
    ];

    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = JSON.parse(savedCols);
    if (!tempObj) {
      tempObj = {};
    }
    let preferredColumnOrder = colArr;

    if (savedCols) {
      if (tempObj && tempObj["variables"] && tempObj["variables"].length > 0) {
        preferredColumnOrder = tempObj["variables"];
      }
    }

    tempObj["variables"] = preferredColumnOrder;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));

    preferredColumnOrder.filter(preferredColumn => {if(preferredColumn.dataField === "type"){
      preferredColumn.dataField = "text"
    }})

    preferredColumnOrder.forEach((eachCol: any) => {
      if (eachCol.dataField === "key") {
        eachCol["formatter"] = checkMarkCell;
      }
      if (eachCol.dataField === "sec") {
        eachCol["formatter"] = checkMarkCell;
      }
    });
    setCurrentColumns(preferredColumnOrder);
  }, []);

  useEffect(() => {
    if (
      settings &&
      settings.respCode === 200 &&
      settings.data &&
      settings.data.allowMultiSelectKeys
    ) {
      if (settings.data.allowMultiSelectKeys === "Yes") {
        setAllowMultipleKeys(true);
      } else {
        setAllowMultipleKeys(false);
      }
    } else {
      setAllowMultipleKeys(false);
    }
  }, [settings]);

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
      currentColumns.length === 6
    ) {
      currentColumns.pop();
    }
  }, [currentDataSecurityRule]);

  useEffect(() => {
    let tempArr: any = [];
    if (list && list.content && list.content.length > 0) {
      for (let key in list.content[0]) {
        if (key !== "_id") {
          let tempObj = {};
          let curVarNameArr: any = key.split("_");
          let curVarName = "";
          if (curVarNameArr && curVarNameArr.length > 0) {
            curVarNameArr.shift();
            curVarName = curVarNameArr.join("_");
          }
          tempObj = {
            variableName: curVarName,
            ...list.content[0][key],
          };
          tempArr.push(tempObj);
        }
      }

      setEditVariablesList(list.content[0]);

      updateCurrentVariablesWithKeys(currentKeysList, tempArr);
      //setCurrentVariablesList(tempArr);
    } else {
      setEditVariablesList({});
      setCurrentVariablesList([]);
    }
  }, [list, currentKeysList]);

  useEffect(() => {
    if (
      listOfKeys &&
      listOfKeys.content &&
      listOfKeys.content.length > 0 &&
      listOfKeys.content[0].OR &&
      listOfKeys.content[0].OR.length > 0
    ) {
      setCurrentKeysList(listOfKeys.content[0].OR);
    } else {
      setCurrentKeysList([]);
    }
  }, [listOfKeys]);

  // useEffect(() => {
  //   if (currentVariablesList.length > 0) {
  //     updateCurrentVariablesWithKeys(currentKeysList);
  //   }
  // }, [currentKeysList]);

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
      variableCreated &&
      variableCreated.hasOwnProperty("respCode") &&
      variableCreated.respCode === 200
    ) {
      getLatestVariablesAndKeys();
    }
  }, [variableCreated]);

  useEffect(() => {
    if (
      variablesEdited &&
      variablesEdited.hasOwnProperty("respCode") &&
      variablesEdited.respCode === 200 &&
      (editTable || showVariableConfirmation || showEditVariableModal)
    ) {
      setEditTable(false);
      // setShowSuccessModal(true);
      getLatestVariablesAndKeys();
      setListOfChanges([]);
      setShowEditVariableModal(false);
      setShowVariableConfirmation(false);

      if (editTable) {
        setSuccessMessage(
          `${listOfChanges.length > 0 ? listOfChanges.length : ""
          } Variables updated`
        );
      } else if (showEditVariableModal) {
        setSuccessMessage(`1 Variable updated`);
      } else if (showVariableConfirmation) {
        setSuccessMessage(`1 Variable deleted`);
      }
    } else if (
      variablesEdited &&
      variablesEdited.hasOwnProperty("respCode") &&
      variablesEdited.respCode === 20108
    ) {
      setShowErrorModal(true);
      setErrorMessage(
        variablesEdited.respText || "Primary Key deletion failed"
      );
      resetEditVariablesList();
    }
  }, [variablesEdited]);

  useEffect(() => {
    if (!isEqual(originalList, editVariablesList)) {
      setPendingChangesMsg(
        `You have ${listOfChanges.length > 0 ? listOfChanges.length : ""
        } unsaved changes`
      );
    } else {
      setPendingChangesMsg("");
    }
  }, [originalList, editVariablesList]);

  const getLatestVariablesAndKeys = () => {
    clearCurrentColumnsOrder();
    dispatch(getVariablesList());
    dispatch(getKeysListAPI());
  };

  const clearCurrentColumnsOrder = () => {
    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = {};
    if (savedCols) {
      tempObj = JSON.parse(savedCols);
    }
    tempObj["metadata"] = {};
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));
  };

  const loadPageData = () => {
    // sessionStorage.setItem("columnsOrder", '');
    dispatch(getKeysListAPI());
    dispatch(getSettingsAPI());
    dispatch(getDataSecurityRuleAPI());
    dispatch(getVariableTypes());
    dispatch(getVariablesList());

    let colArr = [
      {
        dataField: "variableName",
        sort: true,
        text: "VARIABLE NAME",
        editable: false,
        hidden: false,
      },
      {
        dataField: "type",
        sort: true,
        text: "VARIABLE TYPE",
        editable: false,
        hidden: false,
      },
      {
        dataField: "desc",
        text: "DESCRIPTION",
        sort: true,
        hidden: false,
        style: function callback(
          cell: any,
          row: any,
          rowIndex: any,
          colIndex: any
        ) {
          let curVar = "e_" + row.variableName;
          if (list && list.content && list.content.length > 0) {
            if (cell !== list?.content[0][curVar]?.desc)
              return { backgroundColor: "#EBF3FE", borderRadius: "4px" };
            else {
              return { backgroundColor: "#fff" };
            }
          } else {
            return { backgroundColor: "#fff" };
          }
        },
      },
      {
        dataField: "id",
        sort: true,
        text: "CUSTOM METADATA NAME",
        editable: false,
        hidden: false,
      },
      {
        dataField: "key",
        text: "KEY",
        hidden: false,
        formatter: checkMarkCell,
        style: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          let curVar = "e_" + row.variableName;
          let currentKeysListNames = currentKeysList.map(
            (eachKey: any) => eachKey.uvar
          );
          let isDefaultKey = currentKeysListNames.includes(curVar)
            ? "yes"
            : "no";

          if (cell !== isDefaultKey) {
            //return { backgroundColor: '#EBF3FE', borderRadius: '4px', textAlign: 'center', width: '75px' }
            return { textAlign: "center", width: "75px" };
          } else {
            return { textAlign: "center", width: "75px" };
          }
        },
        headerStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
        editorStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
        type: "checkbox",
      },
      {
        dataField: "sec",
        text: "ENCRYPT",
        hidden: !showDataEncrypt,
        type: "checkbox",
        formatter: checkMarkCell,
        style: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          let curVar = "e_" + row.variableName;
          if (list && list.content && list.content.length > 0) {
            if (cell !== list?.content[0][curVar]?.desc) {
              //return { backgroundColor: '#EBF3FE', borderRadius: '4px' }
              return { textAlign: "center", width: "75px" };
            } else {
              return { backgroundColor: "#fff" };
            }
          } else {
            return { backgroundColor: "#fff" };
          }
        },
        editorStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
        headerStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
          return { textAlign: "center", width: "75px" };
        },
      },
    ];

    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = JSON.parse(savedCols);
    if (!tempObj) {
      tempObj = {};
    }
    let preferredColumnOrder = colArr;

    if (savedCols) {
      if (tempObj && tempObj["variables"] && tempObj["variables"].length > 0) {
        preferredColumnOrder = tempObj["variables"];
      }
    }

    tempObj["variables"] = preferredColumnOrder;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));

    preferredColumnOrder.filter(preferredColumn => {if(preferredColumn.dataField === "type"){
      preferredColumn.dataField = "text"
    }})
    
    preferredColumnOrder.forEach((eachCol: any) => {
      if (eachCol.dataField === "key") {
        eachCol["formatter"] = checkMarkCell;
      }
      if (eachCol.dataField === "sec") {
        eachCol["formatter"] = checkMarkCell;
      }
    });
    setCurrentColumns(preferredColumnOrder);
  };

  const resetEditVariablesList = () => {
    let curVar = "e_" + currentEditVariable.variableName;

    setEditVariablesList({
      ...editVariablesList,
      [curVar]: currentEditVariable,
    });
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
        text : eachVariable.text,
        sec: eachVariable.sec ? eachVariable.sec : "no",
      };
    });

    dispatch(saveVariableAPI({ content }));
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

  const checkMarkCell = (cell: any, row: any) => {
    return cell === "yes" ? (
      <i
        className="bi bi-check"
        style={{ color: "#332E20", fontSize: "20px" }}
      ></i>
    ) : (
      <></>
    );
    // <Checkbox
    //   checked={cell === 'yes' ? true : false}
    //   label=""
    //   name={row.id}
    //   handleOnChange={(event: any) => {

    //   }}
    //   disabled
    // />
  };

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
    const content = variableTypesList.content || [];
    content.forEach((type: any) => {
      if (!type.triggerFeature) {
        dataTypes.push(type);
      }
    });
    allVars.forEach((dataSet: any) => {  
      dataTypes.forEach((type: DataType) => {
        if(type.type == dataSet.type) {
          dataSet.text = type.title
        }
      })
    });
    
    setCurrentVariablesList(allVars);

    if (list && list.content && list.content.length > 0) {
      let tempObj = JSON.parse(JSON.stringify(list.content[0]));
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

    setDefaultSorted([
      {
        dataField: "id",
        order: "asc",
      },
    ]);
  };

  const handleEdit = () => {
    setEditTable(!editTable);
  };

  const handleEditCancel = () => {
    setEditTable(false);
    setListOfChanges([]);
    getLatestVariablesAndKeys();
  };

  const saveEditChanges = () => {
    setShowVariableConfirmation(true);
  };

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

  const handleSingleVariableEdit = (currentVariable: any) => {
    let curVar = "e_" + currentVariable.variableName;
    let currentPrimaryKeys: any = [];

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
          currentPrimaryKeys = [];
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

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const closeConfirmationModal = () => {
    setShowVariableConfirmation(false);
    variablesEdited = {};
  };

  const handleCellSave = (row: any, column: any) => {
    let curRow = cloneDeep(row);
    delete curRow.variableName;
    let curVar = "e_" + row.variableName;
    let tempObj = {
      id: row.id,
      desc: row.desc,
      prefix: row.prefix,
      suffix: row.suffix,
      type: row.type,
      sec: row.sec ? row.sec : "no",
      key: row.key ? row.key : "no",
    };

    if (row.key === "yes") {
      let curRowIndex = findIndex(primaryKey, (o: any) => {
        return o.id === row.id;
      });
      if (curRowIndex > -1) {
        if (allowMultipleKeys)
          setPrimaryKey([
            ...primaryKey.slice(0, curRowIndex),
            Object.assign({}, primaryKey[curRowIndex], row),
            ...primaryKey.slice(curRowIndex + 1),
          ]);
        else {
          setPrimaryKey([row]);
        }
      } else {
        if (allowMultipleKeys) {
          let tempArr = cloneDeep(primaryKey);
          tempArr.push(row);
          setPrimaryKey(tempArr);
        } else {
          setPrimaryKey([row]);
        }
      }
    } else {
      let tempArr = primaryKey.filter((item: any) => {
        return item.id !== row.id;
      });
      if (allowMultipleKeys) setPrimaryKey(tempArr);
      else setPrimaryKey([]);
    }

    let curRowIndex = findIndex(listOfChanges, (o: any) => {
      return o.id === row.id;
    });
    let changes: any = [];

    if (curRowIndex > -1) {
      changes = listOfChanges[curRowIndex].changes;
    }

    if (row.sec !== list.content[0][curVar].sec) {
      changes.push(row.sec);
    }

    let currentKeysListNames = currentKeysList.map(
      (eachKey: any) => eachKey.uvar
    );
    let isDefaultKey = currentKeysListNames.includes(curVar) ? "yes" : "no";

    if (row.key !== isDefaultKey) {
      changes.push(row.key);
    } else {
      let prevKey = row.key === "yes" ? "no" : "yes";
      let curindex = changes.indexOf(prevKey);
      if (curindex !== -1) {
        changes.splice(curindex, 1);
      }
    }

    if (row.desc !== list.content[0][curVar].desc) {
      changes.push(row.desc);
    }

    if (changes.length > 0) {
      let changeObj = {
        id: row.id,
        type: row.type,
        changes: changes,
        variableName: row.variableName,
      };

      if (curRowIndex > -1) {
        setListOfChanges([
          ...listOfChanges.slice(0, curRowIndex),
          Object.assign({}, listOfChanges[curRowIndex], changeObj),
          ...listOfChanges.slice(curRowIndex + 1),
        ]);
      } else {
        let curList = listOfChanges;
        curList.push(changeObj);
        setListOfChanges(curList);
      }
    }

    if (isEqual(curRow, originalList[curVar])) {
      let currentChanges = listOfChanges.filter(
        (eachChange: any) => eachChange.id !== curRow.id
      );
      setListOfChanges(currentChanges);
    }

    setEditVariablesList({
      ...editVariablesList,
      [curVar]: tempObj,
    });
  };

  const handleRowSelection = (row: any, isSelected: any) => {
    let curVar = "e_" + row.variableName;
    let tempObj = {
      id: row.id,
      desc: row.desc,
      prefix: row.prefix,
      suffix: row.suffix,
      type: row.type,
      sec: row.sec ? row.sec : "no",
    };

    let curRowIndex = findIndex(listOfChanges, (o: any) => {
      return o.id === row.id;
    });
    let changes: any = [];

    if (curRowIndex > -1) {
      changes = listOfChanges[curRowIndex].changes;
    }

    if (isSelected) {
      let curList = JSON.parse(JSON.stringify(editVariablesList));
      // delete curList[curVar];
      // setEditVariablesList(curList);
      changes.push("delete");
    } else {
      // setEditVariablesList({
      //   ...editVariablesList,
      //   [curVar]: tempObj
      // });
      changes.pop();
    }

    setEditVariablesList({
      ...editVariablesList,
      [curVar]: tempObj,
    });
    let changeObj = {
      id: row.id,
      type: row.type,
      changes: changes,
      variableName: row.variableName,
    };

    if (curRowIndex > -1) {
      setListOfChanges([
        ...listOfChanges.slice(0, curRowIndex),
        Object.assign({}, listOfChanges[curRowIndex], changeObj),
        ...listOfChanges.slice(curRowIndex + 1),
      ]);
    } else {
      let curList = listOfChanges;
      curList.push(changeObj);
      setListOfChanges(curList);
    }
  };

  const handleRowClick = (e: any, row: any) => {
    setCurrentEditVariable(row);
    setShowEditVariableModal(true);
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

  const handleEditVariableModalClose = () => {
    setShowEditVariableModal(false);
    setCurrentEditVariable({});
  };

  const handleEditColumns = () => {
    setShowEditColumnModal(true);
  };

  const handleSaveColumns = (editedColumns: any) => {
    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = {};
    if (savedCols) {
      tempObj = JSON.parse(savedCols);
    }
    tempObj["variables"] = editedColumns;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));

    editedColumns.forEach((eachCol: any) => {
      if (eachCol.dataField === "key") {
        eachCol["formatter"] = checkMarkCell;
      }

      if (eachCol.dataField === "sec") {
        eachCol["formatter"] = checkMarkCell;
      }
    });
    setCurrentColumns(cloneDeep(editedColumns));
    setShowEditColumnModal(false);
  };

  const handleConfirmClick = (confirmationType: string, isSingleEdit: any) => {
    if (confirmationType === "edit") {
      saveEditChangesAPI();
    } else if (confirmationType === "delete") {
      // let content = [currentEditData];
      // dispatch(deleteMetaDataAPI({ content }));

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

  const handleProjectChange = (selectedProject: any) => {
    localStorage.setItem('appContext', selectedProject);
    setCount((count: any) => count + 1);
    setCurAppContext(selectedProject);
  }

  return (
    <div className="p-3 m-0">
      <div className="container-fluid variables-page p-3">
        {!page && (
          <div className="row m-0 mb-3" >
            <div className="col-12 p-0">
              <Title
                subText="View, edit and manage your enterprise level variables"
                text="Enterprise Variables"
              />
            </div>
          </div>
        )}
        <div className="row m-0 mb-3">
          <div className="col-12 p-0" style={{ display: "flex" }}>
            <AppContextDropdown handleProjectChange={handleProjectChange} containerWidth ={320} />
            <DataCard
              data={currentVariablesList.length}
              label="Total variables"
              className="each-data-card"
              style={{ marginRight: "16px" }}
            />

            <DataCard
              data={currentKeysList.length}
              label="Keys"
              className="each-data-card"
              style={{ marginRight: "16px" }}
            />

            {/* <DataCard
          data="6"
          label="Variables not in use"
          className="each-data-card"
        /> */}
          </div>
        </div>

        <div className="row m-0 mb-3">
          <div className="col-12 p-0">
            <div className="card" style={{ width: "100%", border: 0 }}>
              <div className="card-body">
                {roles?.showTable ? (
                  <UshurTable
                    className="mt-3"
                    count={count}
                    keyField="variableName"
                    columns={currentColumns.filter((o: any) => {
                      return !o.hidden;
                    })}
                    data={currentVariablesList}
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
                        value: currentVariablesList.length,
                      },
                    ]}
                    showHeader={true}
                    headerComponent={
                      roles?.allowAdd ? (
                        <Button
                          label="Create Variable"
                          onClick={() => {
                            setShowCreateVariableModal(true);
                          }}
                          type="secondary"
                          style={{ marginRight: "8px" }}
                        />
                      ) : null
                    }
                    showEdit={false}
                    showSearch={true}
                    editTable={editTable}
                    editClickHandler={handleEdit}
                    handleEditCancel={handleEditCancel}
                    saveChanges={saveEditChanges}
                    handleCellSave={handleCellSave}
                    handleRowSelection={handleRowSelection}
                    unsavedChangesAlert={pendingChangesMsg}
                    handleRowClick={roles?.allowEdit && handleRowClick}
                    handleEditColumns={handleEditColumns}
                    defaultSorted={defaultSorted}
                    noDataComponent={
                      <p className="no-data-text">
                        You do not have any variables.
                        <Link
                          //href="https://ushur.com/"
                          inline
                          label="Click here"
                          onClick={() => {
                            setShowCreateVariableModal(true);
                          }}
                        />{" "}
                        to create one.
                      </p>
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <CreateVariable
          showCreateVariableModal={showCreateVariableModal}
          setShowCreateVariableModal={setShowCreateVariableModal}
          variableTypesList={currentVariableTypesList}
          totalVariables={currentVariablesList}
          saveVariable={saveVariable}
          primaryKey={primaryKey}
          setPrimaryKey={setPrimaryKey}
        />

        <ConfirmationModal
          showVariableConfirmation={showVariableConfirmation}
          handleModalClose={closeConfirmationModal}
          listOfChanges={listOfChanges}
          saveEditChangesAPI={saveEditChangesAPI}
          confirmationObj={confirmationObj}
          handleConfirmClick={handleConfirmClick}
        />

        <SuccessModal
          showSuccessModal={showSuccessModal}
          handleModalClose={handleSuccessModalClose}
          successMessage={successMessage}
        />

        <ErrorModal
          showErrorModal={showErrorModal}
          handleModalClose={handleErrorModalClose}
          errorMessage={errorMessage}
        />

        <EditVariableModal
          showEditVariableModal={showEditVariableModal}
          currentEditVariable={currentEditVariable}
          setCurrentEditVariable={setCurrentEditVariable}
          editVariablesList={editVariablesList}
          setEditVariablesList={setEditVariablesList}
          handleSingleVariableEdit={handleSingleVariableEdit}
          handleDeleteVariable={handleDeleteVariable}
          handleEditVariableModalClose={handleEditVariableModalClose}
        />

        <EditColumnModal
          setShowEditColumnModal={setShowEditColumnModal}
          showEditColumnModal={showEditColumnModal}
          data={
            showDataEncrypt
              ? currentColumns
              : currentColumns.filter((o: any) => {
                return o.dataField !== "sec";
              })
          }
          handleSaveColumns={handleSaveColumns}
          showDescription={false}
        />
      </div>
    </div>
  );
};

export default VariablesPage;
