import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import "./contact.css";
// @ts-ignore
import CreateImportModal from "./bulkUploadModal.react";
import CreateGroupModal from "./createGroupModal.react";
import CreateModal from "./CreateModal.react";
import EditContactsModal from "./editContacts.react";
import LogHistoryModal from "./logHistoryModal.react";
import EditColumnModal from "../../components/modals/editColumnModal.react";
import TablePagination from "../../components/TablePagination.react";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import {
  getContactList,
  getAllContactList,
  AllcontactList,
  contactList,
  createResponse,
  editResponse,
  editContactAPI,
  deleteContactAPI,
  groupList,
  createNewGroups,
  newGroupList,
  getNewGroupList,
  deleteResponse,
  setSelectedGroup,
  resetDeleteResponse
} from "./contactsSlice";
import { isEqual, findIndex, cloneDeep } from "lodash";
import {
  Title,
  FieldButton,
  DataCard,
  Table,
  Button,
  Dropdown as UshurDropdown,
  Modal,
  notifyToast
  // @ts-ignore
} from "@ushurengg/uicomponents";
import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";
import { useTrackPageLoad } from "../../utils/tracking";
import BlockedContact from './BlockedContact.react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowToBottom } from '@fortawesome/pro-regular-svg-icons';
import { exportContacts } from './contactsApi';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorage } from "../../custom-hooks/useLocalStorage";

const statusCell = (cell: any) => {
  return (
    <span
      style={{
        color: "#332E20",
        fontWeight: 400,
        padding: "0.2rem 0.5rem",
        borderRadius: "16px",
        fontSize: "12px",
        background: "#F3F3F3",
      }}
    >
      {cell}
    </span>
  );
};

const pageSizes = [
  {
    text: "25",
    value: 25,
    category: ''
  },
  {
    text: "50",
    value: 50,
    category: ''
  },
  {
    text: "100",
    value: 100,
    category: ''
  },
];

const ContactList = () => {
  const { page } = useUrlSearchParams();
  const dispatch = useAppDispatch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createImportOpen, setCreateImportOpen] = useState(false);
  const [sampleData, setSampleData] = useState<any>([]);
  const list = useAppSelector(contactList);
  const allList = useAppSelector(AllcontactList);
  const listGroup = useSelector(groupList);
  const createNewGroup = useSelector(createNewGroups);
  const deleteResponseData = useSelector(deleteResponse);
  const newlistGroup = useSelector(newGroupList);
  const [groupwiseContacts ,setgroupwiseContacts] = useState(0)
  const contactsCreated = useAppSelector(createResponse);

  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [currentContactsList, setCurrentContactsList] = useState<any>([]);
  const [editTable, setEditTable] = useState<any>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageStart, setPageStart] = useState<any>(1);


  const [showEditColumnModal, setShowEditColumnModal] = useState<any>(false);
  const [showFilter, setShowFilter] = useState<any>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<any>(false);
  const [editContactsList, setEditContactsList] = useState<any>({});
  let variablesEdited = useAppSelector(editResponse);
  const [pendingChangesMsg, setPendingChangesMsg] = useState<any>("");
  const [showContactsConfirmation, setShowcontactsConfirmation] =
    useState<any>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<any>(false);
  const [showSelect, setShowSelect] = useState<any>(false);
  const [listOfChanges, setListOfChanges] = useState<any>([]);
  const [successMessage, setSuccessMessage] = useState("");
  let currentGroupNull: any = null;
  const [currentGroup, setCurrentGroup] = useLocalStorage("uui_contacts_group", "Enterprise(Default)");
  const [currentEditContact, setCurrentEditContact] = useState<any>({});
  const [showHover, setHover] = useState<any>(false);
  const isInputPreviouslyBlurred = React.useRef(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [deletedContact, setDeletedContact] = useState({ userName: "" });
  const totalRecords = list.totalRecords;
  const totalPages = list.totalPages;
  const offsetFrom = (currentPage - 1) * pageSize + 1;
  const offsetTo = currentPage * pageSize > totalRecords ? totalRecords : currentPage * pageSize;
  let data = [
    {
      dataField: "userName",
      sort: true,
      text: "NAME",
      hidden: false,
    },
    {
      dataField: "userPhoneNo",
      sort: true,
      text: "PHONE",
      editable: false,
      hidden: false,
      headerStyle: () => {
        return { width: "18%" };
      },
    },
    {
      dataField: "userEmail",
      sort: true,
      text: "EMAIL",
      hidden: false,
    },
    {
      dataField: "address",
      sort: true,
      text: "ADDRESS",
      hidden: false,
    },
    {
      dataField: "groupId",
      sort: true,
      text: "GROUPS",
      formatter: statusCell,
      headerStyle: () => {
        return { width: "16%" };
      },
    },
    {
      dataField: "blocklisted",
      text: "LISTS",
      formatter: (cell: any, row: any) => cell === 'Yes' ? <BlockedContact user={row} /> : null,
      export: false,
    },
    {
      dataField: "blocklisted",
      text: "Blocklisted",
      export: true,
      hidden: true
    },
  ]
  const [currentColumns, setCurrentColumns] = useState<any>(data);
  const [resetColumns, setResetColumns] = useState<any>(data);
  const [exportData, setExportData] = useState<any>([]);
  const prevGroupRef = useRef();
  const [exportError, setExportError] = useState<any>(false);

  useEffect(() => {
    setExportData(allList);
  }, [allList]);

  const getSelectedGroupCount = () => {
    let selectedItemCount = 0;
    if (currentGroup === "Enterprise(Default)") {
      const filtered1 = newlistGroup?.filter((item: any) => {
        return item.IsEnterprise === true;
      });
      selectedItemCount = filtered1?.[0]?.count || 0;
    } else {
      const filtered2 = newlistGroup?.filter((item: any) => {
        return item.groupName === currentGroup && item.IsEnterprise === false;
      });
      selectedItemCount = filtered2?.[0]?.count || 0;
    }
    setgroupwiseContacts(selectedItemCount);
  };


  useEffect(() => {
    dispatch(getAllContactList(currentGroup));
    getAllLatestContacts()
  }, [currentGroup]);

  useEffect(() => {
    dispatch(getContactList({ group: currentGroup, pageNum: currentPage, pageSize, searchParameter: searchTerm }));
  }, [currentGroup, currentPage, pageSize]);

  const refreshContactsList = (isDeleteRequest = false) => {
    let newPageNum = currentPage;
    if (list.users?.length === 1 && isDeleteRequest) {
      setCurrentPage(currentPage - 1);
      newPageNum = currentPage - 1;
    }
    setTimeout(() => dispatch(getContactList({ group: currentGroup, pageNum: newPageNum, pageSize, searchParameter: searchTerm })), 1000);
  }

  useEffect(() => {
    //assign the ref's current value to the count Hook
    prevGroupRef.current = currentGroup;
  }, [currentGroup]);

  const searchContacts = (e: any) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      setPageStart(1);
      dispatch(getContactList({ group: currentGroup, pageNum: 1, pageSize, searchParameter: e.target?.value }));
    }
  }

  const onInputBlur = (e: any) => {
    isInputPreviouslyBlurred.current = true;
    setTimeout(() => {
      setShowSelect(false);
      setShowFilter(false);
    }, 500);
  };
  const getAllLatestContacts = () => {
    dispatch(getNewGroupList());
    getSelectedGroupCount()
  };

useTrackPageLoad({ name: "Contacts Page" });


useEffect(() => {
  getAllLatestContacts();
}, [createNewGroup]);


useEffect(() => {
  if (deleteResponseData === "done") {
    notifyToast({
      variant: "success",
      text: "Contact Deleted!",
      CustomMessageComponent: (
        <span>
          Contact{" "}
          <span className="font-bold">{deletedContact.userName ?? ""}</span>{" "}
          deleted successfully.
        </span>
      ),
      animation: true,
    });
  } else if (deleteResponseData === "creating error") {
    notifyToast({
      variant: "warning",
      text: "Cant delete a contact",
      subText: "Error occur on deleting a contact, Please try again later.",
      animation: true,
    });
  }
  dispatch(resetDeleteResponse());
}, [deleteResponseData]);

  useTrackPageLoad({ name: "Contacts Page" });

  useEffect(() => {
    dispatch(getNewGroupList());
    dispatch(getAllContactList(currentGroup));
  }, []);

  useEffect(() => {
    if (listGroup) {
    getSelectedGroupCount()
    }
  }, [listGroup,newlistGroup]);


  useEffect(() => {
    if (currentColumns && currentColumns.length > 0) {
      let tempObj: any = {};
      currentColumns.forEach((eachCol: any) => {
        tempObj[eachCol["dataField"]] = "";
      });

      setSampleData(tempObj);
    }
  }, [currentColumns]);

  useEffect(() => {
    if (list) {
      let shadowList = JSON.parse(JSON.stringify(list));
      setEditContactsList(e_ContactId());
      setCurrentContactsList(shadowList.users);
    }
  }, [list]);

  useEffect(() => {
    if (
      contactsCreated &&
      contactsCreated.hasOwnProperty("respCode") &&
      contactsCreated.respCode === 200
    ) {
      getLatestContacts();
    }
  }, [contactsCreated]);

  useEffect(() => {
    if (editTable) {
      setShowSuccessModal(true);
      getLatestContacts();

      setShowEditContactModal(false);

      if (editTable) {
        setSuccessMessage(
          `${listOfChanges.length > 0 ? listOfChanges.length : ""
          } Contacts updated`
        );
      } else if (showEditContactModal) {
        setSuccessMessage(`1 Contact updated`);
      }
    }
  }, [variablesEdited]);

  useEffect(() => {
    if (list && list.content && list.content.length > 0) {
      if (!isEqual(list.content[0], editContactsList)) {
        setPendingChangesMsg(
          `You have ${listOfChanges.length > 0 ? listOfChanges.length : ""
          } unsaved changes`
        );
      } else {
        setPendingChangesMsg("");
      }
    }
  }, [list, editContactsList]);

  const getLatestContacts = () => {
    dispatch(getContactList({ group: currentGroup, pageNum: currentPage, pageSize, searchParameter: searchTerm }));
    getAllLatestContacts()
  };

  const e_ContactId = () => {
    let content: any = {};

    let totalContactsList = currentContactsList;

    if (totalContactsList && currentContactsList)
      for (let i = 0; i < totalContactsList.length; i++) {
        const element = totalContactsList[i];
        let currentVariable = "e_" + element.id;

        content[currentVariable] = {
          id: element.id,
          userName: element.userName,
          userPhoneNo: element.userPhoneNo,
          address: element.address,
          userEmail: element.userEmail,
        };
      }

    return content;
    // dispatch(saveVariableAPI({ content }));
  };

  const handleEdit = () => {
    setEditTable(true);
  };
  const handleBulkUploadModalClose = () => {
    setCreateImportOpen(false);
  };
  const handleEditCancel = () => {
    setEditTable(false);
  };

  const saveEditChanges = () => {
    setShowcontactsConfirmation(true);
  };

  const handleSingleContactEdit = (content: any) => {
    dispatch(editContactAPI(content));
  };

  const handleEditColumns = () => {
    setShowEditColumnModal(true);
  };
  const handleCellSave = (row: any, column: any) => {
    let curVar = "e_" + row.id;
    let tempObj = {
      id: row.id,
      userEmail: row.userEmail,
      userPhoneNo: row.PhoneNo,
      userName: row.userName,
      address: row.address,
    };

    let curRowIndex = findIndex(listOfChanges, (o: any) => {
      return o.id === row.id;
    });
    let changes: any = [];

    if (curRowIndex > -1) {
      changes = listOfChanges[curRowIndex].changes;
    }
    if (editContactsList[curVar]) {
      if (row.userName !== editContactsList[curVar].userName) {
        changes.push(row.userName);
      }

      if (row.userEmail !== editContactsList[curVar].userEmail) {
        changes.push(row.userEmail);
      }

      if (row.address !== editContactsList[curVar].address) {
        changes.push(row.address);
      }
    }
    let changeObj = {
      id: row.id,
      changes: changes,
      userEmail: row.userEmail,
      address: row.address,
      userName: row.userName,
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

    setEditContactsList({
      ...editContactsList,
      [curVar]: tempObj,
    });
  };

  const handleRowSelection = (row: any, isSelected: any) => {
    let curVar = "e_" + row.id;
    let tempObj = {
      id: row.id,
      userEmail: row.userEmail,
      userPhoneNo: row.PhoneNo,
      userName: row.userName,
      address: row.address,
      blockListed: row.blocklisted === "Yes",
    };

    let curRowIndex = findIndex(listOfChanges, (o: any) => {
      return o.id === row.id;
    });
    let changes: any = [];

    if (curRowIndex > -1) {
      changes = listOfChanges[curRowIndex].changes;
    }

    if (isSelected) {
      let curList = JSON.parse(JSON.stringify(editContactsList));
      delete curList[curVar];
      setEditContactsList(curList);
      changes.push("delete");
    } else {
      setEditContactsList({
        ...editContactsList,
        [curVar]: tempObj,
      });
      changes.pop();
    }

    let changeObj = {
      id: row.id,
      changes: changes,
      userEmail: row.userEmail,
      address: row.address,
      userName: row.userName,
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
    setCurrentEditContact({ ...row, blockListed: row.blocklisted === 'Yes' });
    setShowEditContactModal(true);
  };

  const handleDeleteContact = (payload: any) => {
    dispatch(deleteContactAPI(payload));
    setDeletedContact(payload||{})
    localStorage.setItem("delId", payload.id);
    setTimeout(() => {
      getAllLatestContacts();
    }, 1000);
  };

  const handleEditContactModalClose = () => {
    setShowEditContactModal(false);
    setCurrentEditContact({});
  };

  const handleSaveColumns = (editedColumns: any) => {
    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = JSON.parse(savedCols);
    if (!tempObj) {
      tempObj = {};
    }
    tempObj["contact"] = editedColumns;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));
    editedColumns.forEach((eachCol: any) => {
      if (eachCol.dataField === "status") {
        eachCol["formatter"] = statusCell;
      }
    });
    setCurrentColumns(cloneDeep(editedColumns));
    setShowEditColumnModal(false);
  };


  const handleRefresh = ()=>{
    setCurrentPage(1);
    setSearchTerm('');
    dispatch(getContactList({ group: currentGroup, pageNum: 1, pageSize}));
    const searchField: any = document.getElementsByClassName('ushur-input')?.[0];
    if (searchField) {
      searchField.value = '';
    }
  }

  const handleChangePage = useCallback((pages) => {
    setCurrentPage(pages);
  }, []);

  const handleExportData = async () => {
    // To-do Remove this code when API updated as returning csv file
    const res: any = await exportContacts(currentGroup);
    if (!res?.error) {
      const csvUrl = window.URL.createObjectURL(res);
      const filename = 'contacts-list.csv';
      const link = document.createElement("a");
      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.setAttribute('download', filename);
      link.setAttribute('href', csvUrl)
      link.click();
      document.body.removeChild(link);
    } else {
      setExportError(true);
    }
  }

  return (
    <div className="p-3 m-0">
      <div className="container-fluid variables-page contacts-page p-3">
        <div className="row m-0 mb-3">
          <div className="col-12 p-0">
            {!page && (
              <Title
                subText="View, edit and manage your Contacts"
                text="Contacts"
              />
            )}
          </div>
        </div>
        <div className="row m-0 mb-3">
          <div className="col-12 p-0">
            <div className="flex">
              <DataCard
                data={groupwiseContacts}
                label="Total Contacts"
                onClick={() => {}}
              />
              <div style={{ marginRight: 20 }}> </div>
              <DataCard
                data={newlistGroup?.length || 1}
                label="Groups"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            margin: "12px 0px",
            borderRadius: 5,
          }}
        >
          <div style={{ padding: 20, paddingTop: "18px" }}>
            <Table
              className="contacts-table"
              exportFileName="ContactsData"
              keyField="id"
              columns={currentColumns}
              data={list?.users || []}
              exportData={allList || []}
              showHeader={true}
              paginationSize={pageSize}
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
              headerComponent={
                <>
                  <UshurDropdown
                    title={
                      <>
                        + <i className="bi bi-people"></i>
                      </>
                    }
                    className="add-data-dropdown"
                    options={[
                      {
                        category: "",
                        onClick: () => {
                          setCreateDialogOpen(true);
                          dispatch(setSelectedGroup(currentGroup));
                        },
                        text: "Add New Contact",
                        value: "addNewContact",
                      },
                      {
                        category: "",
                        onClick: () => {
                          setCreateGroupOpen(true);
                        },
                        text: "Add New Group",
                        value: "addNewGroup",
                      },
                      {
                        category: "",
                        onClick: () => {
                          setCreateImportOpen(true);
                        },
                        text: "Import Contacts",
                        value: "importContacts",
                      },
                      {
                        category: "",
                        onClick: () => {
                          setShowHistoryModal(true);
                        },
                        text: "Upload History",
                        value: "uploadHistory",
                      },
                    ]}
                  />
                  <div className="flex" onBlur={onInputBlur}>
                    <div
                      className="ushur-select"
                      style={{ marginRight: ".5rem" }}
                    ></div>{" "}
                    <div
                      style={{
                        backgroundColor: "rgb(240, 240, 240)",
                        width: "1px",
                        height: "32px",
                        marginRight: ".5rem",
                      }}
                    ></div>
                    <div className="ushur-field-btn undefined">
                      <div>
                        {!showSelect ? (
                          <div
                            className="variable-type-dropdown"
                            aria-describedby="tooltip-top"
                            onMouseOut={() => setHover(false)}
                          >
                            <div
                              onMouseOver={() => setHover(true)}
                              aria-label="house"
                              className={`ushur-dropdown  ${
                                showHover
                                  ? "contact-border"
                                  : "contact-border-ushur"
                              }   dropdown`}
                              style={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: " center",
                                alignItems: "center",
                                flexDirection: "row",
                              }}
                            >
                              <button
                                onClick={() => setShowFilter(true)}
                                value={currentGroup}
                                aria-expanded="false"
                                type="button"
                                className="dropdown-toggle contactsblue    btn-sm"
                                style={{
                                  padding: "1rem",
                                  border: "none !important",
                                }}
                              >
                                {currentGroup === "null"
                                  ? "Enterprise(Default)"
                                  : currentGroup}
                              </button>
                              <span
                                className="end-icon"
                                style={{
                                  background: "#FFFFFF",
                                  border: "none !important",
                                  boxSizing: "border-box",
                                  borderRadius: "0 4px 4px 0",
                                  padding: " 0.56rem",
                                  borderLeft: "none",
                                }}
                              >
                                <i
                                  className="bi bi-funnel"
                                  style={{ color: "#CCCCCC" }}
                                ></i>
                              </span>
                              {showFilter && (
                                <div
                                  x-placement="bottom-start"
                                  aria-labelledby=""
                                  className="dropdown-menu show"
                                  data-popper-reference-hidden="false"
                                  data-popper-escaped="false"
                                  data-popper-placement="bottom-start"
                                  style={{
                                    position: "absolute",
                                    inset: " 0px auto auto 0px",
                                    transform: "translate3d(0px, 34px, 0px)",
                                  }}
                                >
                               {newlistGroup.length < 1 && <button
                                    onClick={(e: any) => {
                                      setCurrentGroup("Enterprise(Default)");
                                      setCurrentPage(1);
                                      setPageStart(1);
                                      setShowFilter(false);
                                      setShowSelect(false);
                                    }}
                                    data-rr-ui-dropdown-item=""
                                    className="each-option  dropdown-item"
                                    key={"Enterprise(Default)"}
                                    value={"Enterprise(Default)"}
                                  >
                                    {`Enterprise(Default) (${
                                      groupwiseContacts ?? 0
                                    })`}
                                  </button>}

                                  {newlistGroup &&
                                    newlistGroup.map(
                                      (item: any, i: any) =>
                                        item !== "null" &&
                                        item !== "" &&
                                        item !== "All groups" &&
                                        item !== "Enterprise" && (
                                          <button
                                            onClick={(e: any) => {
                                              setCurrentGroup(e.target.value);
                                              setCurrentPage(1);
                                              setPageStart(1);
                                            }}
                                            data-rr-ui-dropdown-item=""
                                            className="each-option  dropdown-item"
                                            key={item + i}
                                            value={item.IsEnterprise? item.groupName+"(Default)" : item.groupName }
                                          >
                                            {`${item.IsEnterprise? item.groupName+"(Default)" : item.groupName } (${
                                              item.count ?? 0
                                            })`}
                                          </button>
                                        )
                                    )}
                                </div>
                              )}
                            </div>
                            <span className="helper-text form-text"></span>
                          </div>
                        ) : (
                          <div className="ushur-dropdown button">
                            <button
                              onClick={() => setShowSelect(false)}
                              aria-label=""
                              type="button"
                              className="dropdown-contacts ushur-btn ushur-secondary-btn medium-btn btn btn-outline-primary btn-lg"
                              style={{
                                height: "32px",
                                background: " #F4F5F7",
                                border: "none",
                              }}
                            >
                              <span className="end-icon">
                                <i className="bi bi-funnel"></i>
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <FieldButton
                    buttonIcon={<FontAwesomeIcon icon={faSearch} />}
                    className="ml-2"
                    handleInputChange={(e: any) =>
                      setSearchTerm(e.target.value)
                    }
                    tooltipText="Search all entries"
                    handleKeyUp={searchContacts}
                    hideInput
                  />
                  <UshurDropdown
                    type="button"
                    className="contacts-export-btn"
                    title={<FontAwesomeIcon icon={faArrowToBottom} />}
                    tooltipText="Download Data"
                    options={[
                      {
                        category: "DOWNLOAD DATA",
                        onClick: handleExportData,
                        text: "CSV (.csv)",
                        value: "csv",
                      },
                    ]}
                  />
                </>
              }
              showEdit={false}
              showExportOptions={false}
              showSearch={false}
              editTable={editTable}
              editClickHandler={handleEdit}
              handleEditCancel={handleEditCancel}
              saveChanges={saveEditChanges}
              handleCellSave={handleCellSave}
              handleRowSelection={handleRowSelection}
              handleRowClick={handleRowClick}
              handleEditColumns={handleEditColumns}
              noDataComponent={
                <p className="no-data-text">
                  There are no contacts created for this project. Create
                  contacts first to start adding data records.
                </p>
              }
            />
            {totalRecords > 0 && (
              <div className="custom-pagination">
                <span className="show-entries">Showing entries {offsetFrom}-{offsetTo} of {totalRecords}</span>
                <TablePagination onChangePage={handleChangePage} currentPage={currentPage} totalPages={totalPages} pageStartNum={pageStart} setpageStartNum={setPageStart} />
                <div className="page-sizes-wrap">
                  <span>Show</span>
                  <UshurDropdown
                    title={pageSize}
                    options={pageSizes.map((item: any) => ({
                      ...item,
                      onClick: () => {
                        if (currentPage * item.value > totalRecords) {
                          setCurrentPage(1);
                          setPageStart(1);
                        }
                        setPageSize(item.value);
                      },
                    }))}
                    className="variable-type-dropdown"
                    name="page-size"
                  />
                  <span>entries</span>
                </div>
              </div>
            )}
            <div></div>
          </div>
        </div>
        <CreateModal
          getAllLatestContacts={getAllLatestContacts}
          currentGroup={currentGroup}
          setCurrentGroup={setCurrentGroup}
          setShowSelect={setShowSelect}
          open={createDialogOpen}
          listGroup={listGroup}
          currentGroupNull={currentGroupNull}
          setShowFilter={setShowFilter}
          showFilter={showFilter}
          createDialogOpen={createDialogOpen}
          list={list && list.users}
          onClose={() => {
            setCreateDialogOpen(false);
          }}
          refreshContactsList={refreshContactsList}
        />
        <CreateGroupModal
          open={createGroupOpen}
          listGroup={listGroup}
          onClose={() => {
            setCreateGroupOpen(false);
          }}
        />
        <EditColumnModal
          setShowEditColumnModal={setShowEditColumnModal}
          showEditColumnModal={showEditColumnModal}
          data={currentColumns}
          resetData={resetColumns}
          handleSaveColumns={handleSaveColumns}
          page="contact"
          showDescription={true}
        />
        <CreateImportModal
          showBulkUploadModal={createImportOpen}
          handleModalClose={handleBulkUploadModalClose}
          groupId={currentGroup}
          currentGroup={currentGroup}
          listGroup={listGroup}
          setCurrentGroup={setCurrentGroup}
          getAllLatestContacts={getAllLatestContacts}
        />

        <LogHistoryModal
          setShowHistoryModal={setShowHistoryModal}
          showHistoryModal={showHistoryModal}
        />
        {currentEditContact && (
          <EditContactsModal
            allList={allList}
            getAllLatestContacts={getAllLatestContacts}
            showEditContactModal={showEditContactModal}
            currentEditContact={currentEditContact}
            setCurrentEditContact={setCurrentEditContact}
            editContactsList={editContactsList}
            setEditContactsList={setEditContactsList}
            handleSingleContactEdit={handleSingleContactEdit}
            handleDeleteContact={handleDeleteContact}
            handleEditContactModalClose={handleEditContactModalClose}
            currentGroup={currentGroup}
            setCurrentGroup={setCurrentGroup}
            setShowSelect={setShowSelect}
            listGroup={listGroup}
            currentGroupNull={currentGroupNull}
            setShowFilter={setShowFilter}
            showFilter={showFilter}
            refreshContactsList={refreshContactsList}
          />
        )}
        <Modal
          onHide={() => setExportError(false)}
          size="md"
          title="Error"
          closeLabel="Close"
          showModal={exportError}
          actions={[
            {
              onClick: () => setExportError(false),
              text: "OK",
              type: "primary",
            },
          ]}
          backdrop
        >
          <p>Something went wrong while downloading file. Please try again later.</p>
        </Modal>
      </div>
    </div>

  );
};

export default ContactList;
