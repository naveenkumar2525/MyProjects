import React, { useState, useEffect } from "react";
// @ts-ignore
import {
    Dropdown
    // @ts-ignore
} from "@ushurengg/uicomponents";
import {
    selectedGroup,
    setSelectedGroup,
    groupList
} from "../contacts/contactsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const contactGroup = () => {
    const dispatch = useAppDispatch();
    const groupListRes = useAppSelector(groupList);
    const [groupsAvailable, setGroupsAvailable] = useState<any>([]);
    const group = useAppSelector(selectedGroup);

    useEffect(() => {
        if (groupListRes?.length > 0) {
            let groups = groupListRes ?? [];
            if (!groups.includes("Enterprise(Default)")) {
                groups = ["Enterprise(Default)"].concat(groups);
            }
            const groupsListing = groups.map((text: any) => ({
                text,
                value: text,
                category: "",
            }));
            setGroupsAvailable(groupsListing);
        }
    }, [groupListRes]);
    return (
        <div className="flex">
            <Dropdown
                title={group || 'Enterprise(Default)'}
                noDataText="No user groups"
                options={groupsAvailable.map((item: any) => ({
                    ...item,
                    onClick: () => {
                        if (group !== item.text) {
                            dispatch(setSelectedGroup(item.text));
                        }
                    },
                }))} //to implement group list fetch
                className="variable-type-dropdown contactGroup flex-1"
                name="type"
            />
        </div>
    );
};

export default contactGroup;
