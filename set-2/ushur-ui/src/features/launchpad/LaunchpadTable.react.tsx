import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Button,
  Table as UshurTable,
  PillBadgeWithIcon as Badge,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import "./launchpad.css";
import { useModal } from "../../custom-hooks/useModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faHexagonExclamation } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  contactList,
  currentGroup,
  setCurrentGroup,
  setContacts,
  setSelectedGroup,
  setFinalReciepents,
} from "./launchpadSlice";
import ConfirmRemoveRecipient from "./modals/ConfirmRemoveRecipient";

const maxRecipients = 500;
const paginationSize = 15;

const CustomCheck = ({ row }: any) => {
  const list = useAppSelector(contactList);
  const dispatch = useAppDispatch();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const item = list?.users?.find((item: any) => item.id === row.id);
    if (item) {
      setChecked(item.checked);
    }
  }, [row.id, list]);

  const handleCheckboxClick = (id: string, checked: boolean) => {
    dispatch(
      setContacts({
        ...list,
        users: list.users.map((item: any) => ({
          ...item,
          checked: item.id === id ? checked : item.checked,
        })),
      })
    );
  };

  return (
    <input
      type="checkbox"
      id={row.id}
      onChange={(event: any) =>
        handleCheckboxClick(row.id, event.target.checked)
      }
      checked={checked}
    ></input>
  );
};

const checkMarkCell = (cell: any, row: any) => <CustomCheck row={row} />;

const contactInfo = (cell: any, row: any) => {
  return !row.userPhoneNo ? (
    <><FontAwesomeIcon icon={faExclamationTriangle} color="#FFCD00" size={"sm"} />
      <span className="text-xs" style={{ color: '#FFCD00', marginLeft: '4px' }}>missing</span>
    </>
  ) :
    row.userPhoneNo
};


const currentColumns = [
  {
    dataField: "userName",
    sort: false,
    text: "NAME",
    hidden: false,
  },
  {
    dataField: "userPhoneNo",
    sort: false,
    text: "NUMBER",
    editable: false,
    hidden: false,
    formatter: contactInfo,
  },
  {
    dataField: "userEmail",
    sort: false,
    text: "EMAIL",
    hidden: false,
  },
  {
    dataField: "address",
    sort: false,
    text: "ADDRESS",
    hidden: false,
  },
  {
    dataField: "groupId",
    sort: false,
    text: "GROUP",
    hidden: false,
  },
  {
    dataField: "deleted",
    text: <FontAwesomeIcon icon={faUserSlash} />,
    hidden: false,
    formatter: checkMarkCell,
    style: (cell: any, row: any, rowIndex: any, colIndex: any) => {
      return { textAlign: "center", width: "35px" };
    },
    headerStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
      return { textAlign: "center", width: "35px" };
    },
    editorStyle: (cell: any, row: any, rowIndex: any, colIndex: any) => {
      return { textAlign: "center", width: "35px" };
    },
    // type: "checkbox",
  },
];

const LaunchTable = () => {
  const list = useAppSelector(contactList);
  const dispatch = useAppDispatch();
  const activeGroup = useAppSelector(currentGroup);
  const [confirmModal, toggleModal] = useModal();
  const handleGroupDelete = () => {
    dispatch(setSelectedGroup(""));
    dispatch(setCurrentGroup(""));
    dispatch(setContacts([]));
  };

  const handleCancelAll = () => {
    dispatch(
      setContacts({
        ...list,
        users: list.users.map((item: any) => ({
          ...item,
          checked: false,
        })),
      })
    );
  };

  const handleRemoveRecipients = () => {
    dispatch(setFinalReciepents({}));
    toggleModal();
  };
  const checkedUsers = list?.users?.filter((i: any) => i.checked);
  const finalUsers = list?.users?.filter((i: any) => !i.deleted);
  const exceededRecipients = finalUsers?.length - maxRecipients;

  return (
    <>
      <div
        className="card"
        style={{
          border: "none",
          borderRadius: "8px",
        }}
      >
        <div className={`card-body ${checkedUsers?.length > 0 ? 'contacts-checked' : ''}`}>
          <div className="flex items-center">
            <div className="col-4 mb-2">
              {activeGroup && (
                <div className="flex items-center pillbadge">
                  <div className="font-bold pr-3">Group added :</div>
                  <span className="badge-group-outer bg-white">
                    <span className="badge-title-inner">{activeGroup}</span>
                    <span className="badge-btn-inner"><button onClick={handleGroupDelete} ><i className="bi bi-x"></i></button></span>
                  </span>
                </div>
              )}
            </div>
            {finalUsers?.length > 0 &&
              <div className="col-8 text-right">
                <p className="copy-text text-sm">
                  Your engagement will be launched to the following
                  <span className={`launch-contacts-total m-1 ${exceededRecipients > 0 && 'error-msg cursor-pointer'}`}>
                    {exceededRecipients > 0 &&
                      <>
                        <span className="custom-tooltip launch-error-tooltip">Remove {exceededRecipients} recipients to be able to launch this workflow.</span>
                        <FontAwesomeIcon icon={faHexagonExclamation as IconProp} className="mr-1" />
                      </>
                    }
                    <span>{finalUsers?.length}</span>
                  </span>
                  recipients.
                </p>
              </div>
            }
          </div>
          <UshurTable
            columns={currentColumns}
            data={finalUsers}
            // data={list?.users ?? []}
            editClickHandler={function noRefCheck() { }}
            keyField="id"
            pageSizes={[
              {
                text: "15",
                value: 15,
              },
              {
                text: "30",
                value: 30,
              },
              {
                text: "45",
                value: 45,
              },
              {
                text: "All",
                value: finalUsers?.length,
              },
            ]}
            paginationSize={paginationSize}
            noDataComponent={
              <div className="empty-data-wrapper text-sm">
                Added contact groups or individual recipients from the left
                will appear here.
              </div>
            }
          ></UshurTable>
          {checkedUsers?.length > 0 && (
            <div className="edit-footer-actions">
              <Button
                label="Cancel"
                onClick={handleCancelAll}
                type="toolbar"
              />
              <Button
                label={`Remove recipient${checkedUsers?.length > 1 ? 's' : ''}`}
                onClick={() => {
                  toggleModal();
                }}
                type="secondary"
              />
            </div>
          )}
          <ConfirmRemoveRecipient
            handleModalClose={toggleModal}
            handleConfirmClick={handleRemoveRecipients}
            showModal={confirmModal}
            count={checkedUsers?.length}
          />
        </div>
      </div>
    </>
  );
};

export default LaunchTable;
