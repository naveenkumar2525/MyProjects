import React, { useState, useEffect } from "react";
// import { Link,useParams, BrowserRouter as Router } from "react-router-dom";
import { useParams, useHistory } from "react-router-dom";
import "./Ruleset.css";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
// @ts-ignore
import {
  Button,
  Input,
  Title,
  FieldButton,
  DataCard,
  Modal,
  Link,
  // @ts-ignore
} from "@ushurengg/uicomponents";
// @ts-ignore
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import CreateConditionModal from "./CreateConditionModal.react";
import ConditionsDataTable from "./ConditionsDataTable.react";
import {
  setAutoRefreshOff,
  setAutoRefreshOn,
  setDataRefreshState,
  isAutoRefresh,
  dataRefreshState,
  getRulesList,
  name,
  description,
  setName,
  setDescription,
  createRuleset,
  updateRuleset,
  deleteRuleset,
  setSearchText,
} from "./rulesetSlice";
import CreateRulesetModal from "./CreateRulesetModal.react";

import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";

import ReactDOM from "react-dom";
import { Dropdown as RbDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
type RulesetProps = {
  rulesetid?: string;
};
const RulesetPage = (props: RulesetProps) => {
  const { rulesetid } = useUrlSearchParams();
  //const { id } = useParams<{id?: string}>(); // Might require later when moving to React completely
  const id = rulesetid;
  const isRefresh = useAppSelector(isAutoRefresh);
  const refreshState = useAppSelector(dataRefreshState);
  const ruleSetNameState = useAppSelector(name);
  const ruleSetDescriptionState = useAppSelector(description);
  const dispatch = useAppDispatch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [ruleSetName, setRuleSetName] = useState("");
  const [ruleSetDescription, setRuleSetDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("Add Ruleset");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [datesValue, onChangeDates] = useState([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(),
  ]);
  const [initialLoad, setInitialLoad] = useState(true);
  const history = useHistory();

  const onConfirmDelete = () => {
    setShowDeleteConfirmation(true);
    dispatch(deleteRuleset(id)).then((result: any) => {
      location.href = "?page=rules_manager";
      //history.push("/rules_manager",{from: "RulesetPage"})
    });
  };
  const Confirm = () => {
    return (
      <Modal
        className="delete-confirmation-modal"
        onHide={() => setShowDeleteConfirmation(false)}
        size="lg"
        title="Delete Ruleset?"
        showModal={showDeleteConfirmation}
        actions={[
          {
            onClick: onConfirmDelete,
            text: "Delete",
            type: "primary",
            actionType: "destructive",
          },
        ]}
      >
        <div className="row">
          <div className="col-12">
            <p className="edit-confirmation-alert">
              Are you sure you want to delete this Ruleset? <br />
              This might impact some of your existing modules.
            </p>
          </div>
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    if (!id) {
      if (initialLoad) {
        setRuleSetName("");
        setRuleSetDescription("");
        setInitialLoad(false);
      }
    } else {
      setTitle("Edit Ruleset");
      //setEditMode(false);
    }
    //setEditMode(false);
  });
  useEffect(() => {
    setRuleSetName(ruleSetNameState);
    setRuleSetDescription(ruleSetDescriptionState);
  }, [ruleSetNameState, ruleSetDescriptionState]);
  useEffect(() => {
    if (isRefresh && refreshState === "refreshed") {
      dispatch(setDataRefreshState("idle"));

      setTimeout(() => {
        if (id) dispatch(getRulesList({ id: id }));
      }, 1000);
    }
  }, [isRefresh, refreshState]);
  const TitleHeader = () => {
    return (
      <>
        <Link
          className="title title-h1"
          href="?page=rules_manager"
          to="?page=rules_manager"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Rulesets /{" "}
        </Link>{" "}
        Rules
      </>
    );
  };
  return (
    <div style={{ padding: 20 }}>
      {/* <Link href="?page=rules_manager" to="?page=rules_manager" >Go Back</Link> */}
      <Title
        subText="Construct a ruleset by adding conditions and their corresponding actions. Edit existing conditions and actions by selecting a row. When you’re satisfied, run a test to verify that your ruleset is complete."
        text={<TitleHeader />}
      />
      <div className="ruleset-header">
        <div className="ruleset-edit-dc">
          <CreateRulesetModal
            open={editMode}
            onClose={(e?: string) => {
              if (e == "Success") {
                dispatch(getRulesList({ id: id }));
              }
              setEditMode(false);
            }}
            rulesetid={id}
            rulesetname={ruleSetName}
            rulesetdescription={ruleSetDescription}
          />

          <>
            <div className="rulesetmetadata">
              <DataCard
                data={ruleSetName}
                label={ruleSetDescription}
                onClick={() => {}}
              />
            </div>
            <div className="rulesetmetabutton">
              <Button
                className="bi bi-pencil-square"
                type="secondary"
                label=""
                onClick={() => {
                  setEditMode(true);
                }}
              />
              <Button
                className="bi bi-trash"
                type="secondary"
                label=""
                onClick={() => {
                  setShowDeleteConfirmation(true);
                }}
              />
              <Confirm />
            </div>
          </>
        </div>
        <div style={{ display: "none", width: "50%" }}>
          <div
            style={{
              margin: 20,
              display: "flex",
              flexWrap: "wrap",
              height: 130,
              alignContent: "space-between",
            }}
          >
            <DataCard
              data={492}
              label="Documents processed"
              onClick={() => {}}
            />
            <DataCard
              data={3}
              label="Workflows using ruleset"
              onClick={() => {}}
            />
            {/* <DataCard data="###" label="..." onClick={() => {}} />
            <DataCard data="###" label="..." onClick={() => {}} /> */}
            <DataCard
              data={8732}
              label="Data points extracted"
              onClick={() => {}}
            />
            <DataCard data="Good" label="Accuracy" onClick={() => {}} />
            {/* <DataCard data="###" label="..." onClick={() => {}} />
            <DataCard data="###" label="..." onClick={() => {}} /> */}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: 12,
          }}
        >
          <div className="sl-actions" style={{ display: "flex", padding: 12 }}>
            <Button
              type="secondary"
              label="Add Rule"
              onClick={() => setCreateDialogOpen(true)}
            />
            <span style={{ marginLeft: 10 }} />
            <CreateConditionModal
              rulesetid={id}
              open={createDialogOpen}
              onClose={(e?: string) => {
                if (e === "Success") dispatch(getRulesList({ id }));
                console.log("dialog close");
                setCreateDialogOpen(false);
              }}
            />
          </div>
        </div>
        <ConditionsDataTable id={id} />
      </div>
    </div>
  );
};

export default RulesetPage;
