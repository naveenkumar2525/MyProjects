import React, { useState, useEffect } from "react";
import "./HubSettings.css";

// @ts-ignore
import {
  Title,
  DataCard,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import ManageWorkflows from "./ManageWorkflows.react";
import Tabs from "../../components/Tabs.react";
import GeneralSettings from "./GeneralSettings.react";
import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getHubsListAsync, hubsList } from "./hubSettingsSlice";
import AccessRoles from "./AccessRoles.react";

const DataCards = () => (
  <div className="flex mt-3">
    <DataCard data={0} label="Total Ushurs" onClick={() => {}} />
    <div style={{ marginRight: 20 }}> </div>
    <DataCard data={0} label="Total Visits" onClick={() => {}} />
  </div>
);

const TAB_NAMES = ["General", "Workflows", "Roles & Access"];

const HubSettings = () => {
  const { page } = useUrlSearchParams();
  const dispatch = useAppDispatch();
  const hubs = useAppSelector(hubsList);
  const [activeTab, setActiveTab] = useState(TAB_NAMES[0]);

  useEffect(() => {
    dispatch(getHubsListAsync());
  }, []);

  console.log("HUBS...", hubs);

  return (
    <div style={{ padding: 20 }}>
      {!page && (
        <Title
          subText="View, edit and manage Hub properties."
          text="Hub Settings"
        />
      )}
      {/* <DataCards /> */}
      <Tabs items={TAB_NAMES} active={activeTab} onChange={setActiveTab} />
      {activeTab === TAB_NAMES[0] && <GeneralSettings />}
      {activeTab === TAB_NAMES[1] && <ManageWorkflows />}
      {activeTab === TAB_NAMES[2] && <AccessRoles />}
    </div>
  );
};

export default HubSettings;
