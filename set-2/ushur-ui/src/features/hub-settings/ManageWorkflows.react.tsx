import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import {
  Button,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { ushursList, getUshursAsync } from "../ushurs/ushursSlice";
import {
  deleteChanges,
  getHubWorkflowsAsync,
  getJsonConfigForPortalAsync,
  hubsList,
  hubWorkflows,
  jsonConfigForPortal,
  saveWorkflowsResp,
  updateAllChanges,
  updateChanges,
  updateHubWorkflowsAsync,
  workflowGroupChanges,
  accessRoles,
  getAccessRolesAsync,
} from "../hub-settings/hubSettingsSlice";
import OneWorkflowConfig from "./OneWorkflowConfig.react";
import { base64StringForImage, uuid } from "../../utils/helpers.utils";
import RearrangeItems from "./RearrangeItems.react";
import SaveChangesRibbon from "./SaveChangesRibbon.react";
import ManageWorkflowsAlert from "./ManageWorkflowsAlert.react";
import { Toast } from "react-bootstrap";
import ConfirmMultiChanges from "../../components/modals/confirmMultiChangesModal.react";

type ManageWorkflowsProps = {};

const defaults = {
  maxWorkflowsAllowed: 9,
};

const defaultWorkflow = {
  friendlyName: "",
  description: "",
  logoFile: "",
  showDescription: false,
  showAccountHistory: false,
  customWorkflow: false,
  secondary: {},
};

const CONFIRM_CHANGE_LABELS = {
  delete:
    "By deleting workflow(s), the workflow linking, name, description and icon for will be permanently deleted from this Portal.",
  friendlyName: "Missing Friendly names for workflow(s), Please enter name.",
  ushurName: "Missing Workflow to link, Please select workflow to link",
};

interface workflowTypes {
  id: string;
  expand: boolean;
  deleted: boolean;
  emptyName: boolean;
  emptyLink: boolean;
}

const ManageWorkflows = (props: ManageWorkflowsProps) => {
  const dispatch = useAppDispatch();
  const list = useAppSelector(ushursList);
  const hubs = useAppSelector(hubsList);
  const roles = useAppSelector(accessRoles);
  const workflowsData = useAppSelector(hubWorkflows);
  const wgChanges = useAppSelector(workflowGroupChanges);
  const saveResp = useAppSelector(saveWorkflowsResp);
  const jsonConfig = useAppSelector(jsonConfigForPortal);
  const [changes, setChanges] = useState(new Set<string>());
  const [selectedWorkflows, setSelectedWorkflows] = useState<workflowTypes[]>(
    []
  );
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmChanges, setConfirmChanges] = useState<Array<string>>([]);
  const [noOfWorkflows, setNoOfWorkflows] = useState<number>(0);
  const [isAddBtnDisabled, setIsAddBtnDisabled] = useState<boolean>(false);
  const scrollToRef = useRef<any>({});

  useEffect(() => {
    dispatch(getUshursAsync());
    dispatch(getJsonConfigForPortalAsync());
  }, []);

  useEffect(() => {
    const latestData = workflowsData.map((item: any) => ({
      ...item,
      id: uuid(),
      expand: false,
      deleted: false,
      emptyLink: false,
      emptyName: false,
    }));
    setNoOfWorkflows(latestData.length);
    setSelectedWorkflows(latestData);
    dispatch(updateAllChanges(latestData));
  }, [workflowsData]);

  useEffect(() => {
    const id = hubs?.[0]?.id;
    if (id) {
      dispatch(getHubWorkflowsAsync({ id }));
      dispatch(getAccessRolesAsync({ id }));
    }
  }, [hubs]);

  useEffect(() => {
    if (saveResp?.some((item: any) => item?.status === "success")) {
      setChanges(new Set());
      const id = hubs?.[0]?.id;
      if (id) {
        dispatch(getHubWorkflowsAsync({ id }));
      }
    }
  }, [saveResp]);

  useEffect(() => {
    if (noOfWorkflows >= defaults.maxWorkflowsAllowed)
      setIsAddBtnDisabled(true);
    else if (noOfWorkflows < defaults.maxWorkflowsAllowed)
      setIsAddBtnDisabled(false);
  }, [noOfWorkflows]);

  const onCancelChanges = () => {
    setChanges(new Set());
  };

  const onSaveChanges = async () => {
    //check if workflows contain empty friendly name or ushur link
    let isDataEmpty = false;
    const workflows = selectedWorkflows.map((wf: any) => ({ ...wf })); //cloning the state

    workflows.forEach((wf: any) => {
      if (wgChanges?.[wf.id] && !wgChanges?.[wf.id]?.deleted) {
        if (!wgChanges?.[wf.id]?.friendlyName) {
          wf.expand = true;
          wf.emptyName = true;
          if (!isDataEmpty) isDataEmpty = true;
        }
        if (!wgChanges?.[wf.id]?.ushurName) {
          wf.expand = true;
          wf.emptyLink = true;
          if (!isDataEmpty) isDataEmpty = true;
        }
      }
    });

    if (isDataEmpty) {
      setSelectedWorkflows(workflows);
      //scroll the first workflow with missing name or link into view
      workflows.some((wf: any) => {
        if (wgChanges?.[wf.id] && !wgChanges?.[wf.id]?.deleted) {
          if (
            !wgChanges?.[wf.id]?.friendlyName ||
            !wgChanges?.[wf.id]?.ushurName
          ) {
            const scrollItem = scrollToRef.current[wf.id];
            scrollItem.scrollIntoView();
            return true;
          }
        }
      });
    } else {
      const id = hubs?.[0]?.id ?? "";
      const workflows = selectedWorkflows
        .map((wf: any) => {
          const { logo_file, ...changes } = wgChanges?.[wf.id] ?? {};
          return {
            ...defaultWorkflow,
            ...wf,
            ...changes,
          };
        })
        .filter((wf: any) => wf.friendlyName);

      //if any workflow got deleted
      const changeList: string[] = [];
      if (Array.from(changes).some((change) => change.includes("deleted"))) {
        changeList.push(CONFIRM_CHANGE_LABELS.delete);
      }
      if (changeList.length > 0) {
        setConfirmChanges(changeList);
        setShowConfirmModal(true);

        //finally save changes
      } else {
        const payload = {
          id,
          workflows,
        };
        dispatch(updateHubWorkflowsAsync(payload));
      }
    }
  };
  const forceSaveChanges = async () => {
    setShowConfirmModal(false);
    const id = hubs?.[0]?.id ?? "";
    const workflows = selectedWorkflows
      .map((wf: any) => {
        const { logo_file, ...changes } = wgChanges?.[wf.id] ?? {};
        return {
          ...defaultWorkflow,
          ...wf,
          ...changes,
        };
      })
      .filter((wf: any) => wf.friendlyName);

    const payload = {
      id,
      workflows,
    };
    dispatch(updateHubWorkflowsAsync(payload));
  };

  const updateWorkflowChanges = (
    id: string,
    fieldName: string,
    value: any,
    nestedFieldName = ""
  ) => {
    setChanges(changes.add(`${id}--${fieldName}${nestedFieldName}`));
    dispatch(updateChanges({ id, fieldName, value }));
  };

  const addWorkflow = () => {
    setNoOfWorkflows((prev) => prev + 1);
    setSelectedWorkflows(
      selectedWorkflows
        .map((item) => ({ ...item, expand: false }))
        .concat({
          id: uuid(),
          expand: true,
          deleted: false,
          emptyLink: false,
          emptyName: false,
        })
    );
  };

  const deleteWorkflow = (id: string) => {
    let isEmptyWorkflow = false;
    setSelectedWorkflows(
      selectedWorkflows.map((wf: any) => {
        if (
          wf.id === id &&
          !wgChanges?.[wf.id] &&
          (!wf?.friendlyName || !wf?.secondary || !wf?.description || !wf?.logo)
        )
          isEmptyWorkflow = true;

        return {
          ...wf,
          deleted: wf.id === id ? true : wf.deleted,
        };
      })
    );
    if (!isEmptyWorkflow) {
      setChanges(changes.add(`${id}--deleted`));
      dispatch(deleteChanges({ id }));
    }
    setNoOfWorkflows((prev) => prev - 1);
  };

  const setEmptyNameError = (id: string, emptyName: boolean) => {
    setSelectedWorkflows(
      selectedWorkflows.map((wf: any) => ({
        ...wf,
        emptyName: wf.id === id ? emptyName : wf.emptyName,
      }))
    );
  };

  const setEmptyLinkError = (id: string, emptyLink: boolean) => {
    setSelectedWorkflows(
      selectedWorkflows.map((wf: any) => ({
        ...wf,
        emptyLink: wf.id === id ? emptyLink : wf.emptyLink,
      }))
    );
  };

  const setShowExpand = (id: string, expand: boolean) => {
    setSelectedWorkflows(
      selectedWorkflows.map((wf: any) => ({
        ...wf,
        expand: wf.id === id ? expand : wf.expand,
      }))
    );
  };

  const workflows = list.map((item: any) => ({
    id: item.campaignId,
    label: item.campaignId,
  }));

  return (
    <div>
      <ManageWorkflowsAlert />
      <div className="mt-3 py-4 px-2 grid grid-cols-2 gap-x-4">
        <div>
          <p className="text-lg pl-2 font-semibold">Add and Remove Workflows</p>
          <p className="text-sm pl-2">
            Add and remove workflows from the Invisible portal. New workflows
            will naturally flow one after the other.
          </p>
          <div className="mt-11"></div>
          {selectedWorkflows
            .filter(({ deleted }) => !deleted)
            .map((wf: any, index: number) => {
              return (
                <OneWorkflowConfig
                  key={wf.id}
                  index={index}
                  ref={scrollToRef}
                  workflows={workflows}
                  roles={roles}
                  data={{
                    ...wf,
                    hubId: hubs?.[0]?.id ?? "",
                    hostName: jsonConfig?.InvisiblePortalHostname ?? "",
                  }}
                  setChanges={setChanges}
                  setEmptyNameError={setEmptyNameError}
                  setEmptyLinkError={setEmptyLinkError}
                  setShowExpand={setShowExpand}
                  onDelete={deleteWorkflow}
                  onChange={updateWorkflowChanges}
                />
              );
            })}

          <div className="grid place-items-center mt-2">
            <Button
              startIcon={<i className="bi bi-plus" />}
              disabled={isAddBtnDisabled}
              tooltipText={isAddBtnDisabled ? "Maximum amount is Reached!" : ""}
              label="Add workflow"
              onClick={addWorkflow}
              type="secondary"
            />
          </div>
        </div>
        <div>
          <p className="text-lg pl-2 font-semibold">Invisible Portal layout</p>
          <p className="text-sm pl-2">
            Construct a layout using the grid below. Each added workflow will
            appear as a tile. Drag and drop tiles to re-arrange them.
          </p>
          <RearrangeItems />
        </div>
      </div>
      {/* <Toast onClose={() => setShowSuccessToast(false)} show={showSuccessToast} delay={3000} autohide>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
      </Toast> */}
      <SaveChangesRibbon
        onSave={onSaveChanges}
        onCancel={onCancelChanges}
        changesCount={changes?.size}
      />
      <ConfirmMultiChanges
        handleModalClose={() => setShowConfirmModal(false)}
        handleConfirmClick={forceSaveChanges}
        title="Are you sure you want to continue ?"
        showModal={showConfirmModal}
        changes={confirmChanges}
      />
    </div>
  );
};

export default ManageWorkflows;
