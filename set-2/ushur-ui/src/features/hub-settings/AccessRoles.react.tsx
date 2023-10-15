import React, { useState, useEffect, useRef } from "react";
import "./AccessRoles.css";
// @ts-ignore
import {
  Button,
  Checkbox,
  DataCard,
  Modal
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  deleteChanges,
  getHubWorkflowsAsync,
  hubsList,
  hubWorkflows,
  saveAccessRolesResp,
  updateChanges,
  updateAccessRolesAsync,
  accessRoles,
  accessRoleGroupChanges,
  getAccessRolesAsync
} from "../hub-settings/hubSettingsSlice";
import OneAccessRoleConfig from "./OneAccessRoleConfig.react";
import { uuid } from "../../utils/helpers.utils";
import SaveChangesRibbon from "./SaveChangesRibbon.react";
import AccessRolesAlert from "./AccessRolesAlert.react";
import ConfirmMultiChanges from "../../components/modals/confirmMultiChangesModal.react";

type ManageWorkflowsProps = {};

const defaults = {
  maxWorkflowsAllowed: 9,
  internalAccessRolesCount: 0,
  externalAccessRolesCount: 0
};

const newAccessRole = {
  roleId: uuid(),
  roleType: "",
  roleName: "",
  status: "inActive",
  disabled: false,
  deleted: false,
  emptyName: false
}

const CONFIRM_CHANGE_LABELS = {
  delete: "Access role(s) will be permanently deleted from this Portal.",
};

const MESSAGES = {
  delteModalTitle: "Are you sure you want to delete this role ?",
  deleteModalMessage: "Deleting this role will remove it from the roles list permanently."
}

interface accessRoleTypes {
  roleId: string,
  roleType: string,
  roleName: string,
  status: string,
  disabled: boolean,
  deleted: boolean,
  emptyName: boolean
}

const AccessRoles = (props: ManageWorkflowsProps) => {
  const dispatch = useAppDispatch();
  const workflowsData = useAppSelector(hubWorkflows);
  const hubs = useAppSelector(hubsList);
  const accessRolesData = useAppSelector(accessRoles);
  const arChanges = useAppSelector(accessRoleGroupChanges);
  const saveResp = useAppSelector(saveAccessRolesResp);
  const [changes, setChanges] = useState(new Set<string>());
  const [newAccessRoleData, setNewAccessRoleData] = useState(newAccessRole);
  const [selectedAccessRoles, setSelectedAccessRoles] = useState<accessRoleTypes[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmChanges, setConfirmChanges] = useState<Array<string>>([]);
  const [internalAccessRolesCount, setInternalAccessRolesCount] = useState<number>(defaults.internalAccessRolesCount);
  const [externalAccessRolesCount, setExternalAccessRolesCount] = useState<number>(defaults.externalAccessRolesCount);

  const [deletingAccessRoleId, setDeletingAccessRoleId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const latestData = accessRolesData
      .map((item: accessRoleTypes) => ({
        ...item,
        disabled: true,
        deleted: false,
        emptyName: false
    }));
    setSelectedAccessRoles(latestData);
  }, [accessRolesData, workflowsData]);

  useEffect(() => {
    setInternalAccessRolesCount(selectedAccessRoles.filter(item => (item.roleType === "Enterprise-internal")).length);
    setExternalAccessRolesCount(selectedAccessRoles.filter(item => (item.roleType === "Enduser-external")).length);
  }, [selectedAccessRoles])

  useEffect(() => {
    const id = hubs?.[0]?.id;
    if (id) {
      dispatch(getAccessRolesAsync({ id }));
      dispatch(getHubWorkflowsAsync({ id }));
    }
  }, [hubs]);

  useEffect(() => {
    if (saveResp?.some((item: any) => item?.status === "success")) {
      setChanges(new Set());
      const id = hubs?.[0]?.id;
      if (id) {
        dispatch(getAccessRolesAsync({ id }));
      }
    }
  }, [saveResp]);

  const onCancelChanges = () => {
    setSelectedAccessRoles(
      selectedAccessRoles.map((role: any) => ({
        ...role,
        disabled: true
      }))
    );
    setChanges(new Set());
    const id = hubs?.[0]?.id;
    if (id) {
      dispatch(getAccessRolesAsync({ id }));
    }
    setNewAccessRoleData({
      roleId: uuid(),
      roleType: "",
      roleName: "",
      status: "inActive",
      disabled: false,
      deleted: false,
      emptyName: false
    });
  };

  const onSaveChanges = async () => {
    const id = hubs?.[0]?.id ?? "";
    const accessRoles = selectedAccessRoles
      .map((role: any) => {
        const { ...changes } = arChanges?.[role.roleId] ?? {};
        return {
          ...role,
          ...changes,
        };
      })
      .filter((role: any) => role.roleName);

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
        accessRoles,
      };
      dispatch(updateAccessRolesAsync(payload));
    }
  };
  const forceSaveChanges = async ()=>{
    setShowConfirmModal(false);
    const id = hubs?.[0]?.id ?? "";
    const accessRoles = selectedAccessRoles
      .map((role: any) => {
        const { ...changes } = arChanges?.[role.roleId] ?? {};
        return {
          ...role,
          ...changes,
        };
      })
      .filter((role: any) => role.roleName);
      
    const payload = {
      id,
      accessRoles,
    };
    dispatch(updateAccessRolesAsync(payload));
  }

  const updateAccessRoleChanges = (
    id: string,
    fieldName: string,
    value: any,
    nestedFieldName = ""
  ) => {
    setChanges(changes.add(`${id}--${fieldName}${nestedFieldName}`));
    dispatch(updateChanges({ id, fieldName, value }));
  };

  const addAccessRole = (roleName: string, roleType: string) => {
    setSelectedAccessRoles(
      selectedAccessRoles
        .map((item) => ({ ...item }))
        .concat({
          roleId: uuid(),
          roleType: roleType,
          roleName: roleName,
          status: "Active",
          disabled: true,
          deleted: false,
          emptyName: false,
        })
    );
  };

  const editAccessRole = (id: string, disable: boolean) => {
    setSelectedAccessRoles(
      selectedAccessRoles.map((role: any) => ({
        ...role,
        disabled: role.roleId === id ? disable : true,
      }))
    );
  }

  const updateAccessRole = (id: string, roleName: string, roleType: string, status: string) => {
    const latestData = selectedAccessRoles
      .map((role: any) => ({
        ...role,
        disabled: true,
        roleName: role.roleId === id ? roleName : role.roleName,
        roleType: role.roleId === id ? roleType : role.roleType,
        status: role.roleId === id ? status : role.status
    }));
    setSelectedAccessRoles(latestData);
  }

  const updateStatus = (id: string, status: string) => {
    const latestData = selectedAccessRoles
      .map((role: any) => ({
        ...role,
        disabled: true,
        status: role.roleId === id ? status : role.status
    }));
    setSelectedAccessRoles(latestData);
  }

  const onDeleteAccessRole = (id: string) => {
    setDeletingAccessRoleId(id);
    setShowDeleteModal(true);
  };

  const deleteAccessRole = (id: string) => {
    const latestData = selectedAccessRoles
    .filter((role: any) => {
      if(role.roleId === id && role.roleId.length == 6){
        return false;
      } else {
        return true;
      }
    }) // delete unsaved roles and don't send in request payload
    .map((role: any) => ({
      ...role,
      deleted: role.roleId === id ? true : role.deleted,
    }));
    setSelectedAccessRoles(latestData);
    if(id.length > 6) {
      setChanges(changes.add(`${id}--deleted`));
      dispatch(deleteChanges({ id }));
    }
  }

  const onDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <Modal
        className="edit-column-modal"
        onHide={onDeleteModalClose}
        size="lg"
        title={MESSAGES.delteModalTitle}
        showModal={showDeleteModal}
        closeLabel="Cancel"
        actions={[
          {
            onClick: () => {
              deleteAccessRole(deletingAccessRoleId);
              setShowDeleteModal(false);
            },
            text: "Yes, Delete",
            type: "primary"
          },
        ]}
      >
        {MESSAGES.deleteModalMessage}
      </Modal>
      

      <div>
        <AccessRolesAlert />
        <div className="mt-3 py-4 px-2 grid">
          <div>
            <p className="text-lg pl-2 font-semibold form-header">Manage Invisible Portal roles</p>
            <p className="text-sm pl-2">
            Create and edit roles for Invisible Portal.
            </p>
            <section role="section" className="flex">
              <DataCard
                data={externalAccessRolesCount}
                label="External role"
                className="each-data-card"
                style={{ marginRight: "16px" }}
              />
              <DataCard
                data={internalAccessRolesCount}
                label="Internal role"
                className="each-data-card"
                style={{ marginRight: "16px" }}
              />
            </section>
            
            <div className="bg-white mt-3 py-2 px-2 rounded-lg">
              <p className="font-semibold workflow-type mt-2">Roles</p>
              {selectedAccessRoles
              .filter(({ deleted }) => !deleted)
              .map((role: any, index: number) => {
                return (
                  <OneAccessRoleConfig
                    key={role.roleId}
                    index={index}
                    workflows={workflowsData}
                    data={role}
                    setChanges = {setChanges}
                    roles={selectedAccessRoles}
                    onAdd={addAccessRole}
                    onEdit={editAccessRole}
                    onUpdate={updateAccessRole}
                    onStatusUpdate={updateStatus}
                    onDelete={onDeleteAccessRole}
                    onChange={updateAccessRoleChanges}
                  />
                );
              })}

              <OneAccessRoleConfig
                key={newAccessRoleData.roleId}
                index={-1}
                data={newAccessRoleData}
                setChanges = {setChanges}
                roles={selectedAccessRoles}
                workflows={workflowsData}
                onAdd={addAccessRole}
                onEdit={editAccessRole}
                onUpdate={updateAccessRole}
                onStatusUpdate={updateStatus}
                onDelete={onDeleteAccessRole}
                onChange={updateAccessRoleChanges}
              />
            </div>
          </div>
        </div>
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
    </>

    
  );
};

export default AccessRoles;
