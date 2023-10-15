import React, { useState, useEffect } from "react";
// @ts-ignore
import {
    Dropdown,
    Button,
    // @ts-ignore
} from "@ushurengg/uicomponents";
import {
    getGroupListForDropdown,
    groupList,
    setCurrentGroup,
    getContactList,
    contactList,
    selectedGroup,
    setSelectedGroup,
    currentGroup,
    setContacts
} from "./launchpadSlice";

import "./readyLaunch.css";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ConfirmReplaceGroup from "./modals/ConfirmReplaceGroup.react";
import { useModal } from "../../custom-hooks/useModal";

const GroupSelect = () => {
    const dispatch = useAppDispatch();
    const groupListRes = useAppSelector(groupList);
    const contacts = useAppSelector(contactList);
    const [groupsAvailable, setGroupsAvailable] = useState<any>([]);
    const [confirmModalOpen, toggleConfirmModal] = useModal();
    const group = useAppSelector(selectedGroup);
    const activeGroup = useAppSelector(currentGroup);

    useEffect(() => {
        dispatch(getGroupListForDropdown());
        dispatch(setSelectedGroup(""));
        dispatch(setCurrentGroup(""));
        dispatch(setContacts([]));
    }, []);
    useEffect(() => {
      let groups = groupListRes?.groups ?? [];
      if (groups?.length > 0) {
        if (!groups.includes("Enterprise")) {
          groups = ["Enterprise"].concat(groups);
        }
      } else {
        groups = ["Enterprise"];
      }
      const groupsListing = groups.map((text: string) => ({
        text,
        value: text,
        category: "",
      }));
      setGroupsAvailable(groupsListing);
    }, [groupListRes]);

    const handleAddGroup = () => {
        if (activeGroup !== group) {
            dispatch(setCurrentGroup(group));
        }
        dispatch(getContactList(group));
    }

    const handleClick = () => {
        if (contacts?.users?.length > 0) {
            toggleConfirmModal();
            return;
        }
        handleAddGroup();
    }

    const handleReplaceGorup = () => {
        handleAddGroup();
        toggleConfirmModal();
    }

    return (
        <div className="flex mt-2">
            <Dropdown
                label="Group"
                title={group || 'Select'}
                noDataText="No user groups"
                options={groupsAvailable.map((item: any) => ({
                    ...item,
                    onClick: () => {
                        if (group !== item.text) {
                            dispatch(setSelectedGroup(item.text));
                        }
                    },
                }))} //to implement group list fetch
                className="variable-type-dropdown flex-1 mr-2"
                name="type"
                maxWidth="168px"
            />
            <Button
                className="group-btn"
                type="primary"
                size="md"
                label="Add"
                disabled={!group}
                onClick={handleClick}
            />
            {
                confirmModalOpen && (
                    <ConfirmReplaceGroup
                        showModal={confirmModalOpen}
                        handleModalClose={toggleConfirmModal}
                        handleConfirmClick={handleReplaceGorup}
                    />
                )
            }
        </div>
    );
};

export default GroupSelect;
