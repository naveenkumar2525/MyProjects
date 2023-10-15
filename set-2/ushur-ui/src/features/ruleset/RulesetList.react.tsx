import React, { useState, useEffect } from "react";
// import { Link, BrowserRouter as Router } from "react-router-dom";
import "./Ruleset.css";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
// @ts-ignore
import {
  Button,
  Input,
  Title,
  FieldButton,
  DataCard,
  Link,
  // @ts-ignore
} from "@ushurengg/uicomponents";
// @ts-ignore
import CreateRulesetModal from "./CreateRulesetModal.react";
import DataTable from "./DataTable.react";

import {
  setDataRefreshState,
  isAutoRefresh,
  dataRefreshState,
  getRulesetsList,
  rulesList,
} from "./rulesetSlice";
import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";

const RulesetListPage = () => {
  const isRefresh = useAppSelector(isAutoRefresh);
  const refreshState = useAppSelector(dataRefreshState);
  const list = useAppSelector(rulesList);
  const dispatch = useAppDispatch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [datesValue, onChangeDates] = useState([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(),
  ]);

  useEffect(() => {
    if (isRefresh && refreshState === "refreshed") {
      dispatch(setDataRefreshState("idle"));
      setTimeout(() => dispatch(getRulesetsList({})), 1000);
    }
  }, [isRefresh, refreshState]);
  const DisplayTitle = () => {
    //Do not show the Title header if it is loaded with querystring parameter
    const { page } = useUrlSearchParams();
    return page ? (
      <></>
    ) : (
      <Title
        subText="View, edit and manage your ruleset"
        text="Rules Manager"
      />
    );
  };
  return (
    <div style={{ padding: 20 }}>
      <DisplayTitle />

      <div style={{ marginTop: 20, display: "none" }}>
        <DataCard
          data={list?.length ?? 0}
          label="Documents Processed"
          onClick={() => {}}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: 12,
          }}
        />
        <DataCard
          data={list?.length ?? 0}
          label="Published Rulesets"
          onClick={() => {}}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: 12,
          }}
        />
        <DataCard
          data={list?.length ?? 0}
          label="Average Accuracy"
          onClick={() => {}}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: 12,
          }}
        />
        <DataCard
          data={list?.length ?? 0}
          label="Average STP"
          onClick={() => {}}
        />
      </div>
      <div
        style={{
          backgroundColor: "white",
          margin: "12px 0px",
          borderRadius: 5,
        }}
      >
        <DataTable />
      </div>
    </div>
  );
};

export default RulesetListPage;
