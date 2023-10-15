import React, { useState, useEffect } from "react";
import "./OneAccessRoleConfig.css";
// @ts-ignore
import {
  Input,
  Checkbox,
  Radios,
  Button,
  Modal
  // @ts-ignore
} from "@ushurengg/uicomponents";
import Switch from "../../components/Switch.react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type OneAccessRoleConfigProps = {
  index: number;
  workflows: any[];
  data: any;
  roles: any[];
  onDelete: (id: string) => void;
  onAdd: (roleName: string, roleType: string) => void;
  onUpdate: (id: string, roleName: string, roleType: string, status: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onEdit: (id: string, edit: boolean) => void;
  onChange: (id: string, fieldName: string, value: any) => void;
  setChanges: (set: any) => void;
};

const defaults = {
  roleType: "",
  roleName: "",
  nameCharCount: 16,
  status: "inActive",
  statusDisabled: false
};

const MESSAGES = {
  statusChangeModalTitle: "Are you sure you want to make this role inactive?",
  statusChangeModalMessage: "By makng this role inactive, every user assigned under this role will lose access to the workflows linked to this role.",
  statusTooltip: "When role is disbaled, every user assigned under this role  will lose access to the workflows linked to this role.",
  roleBeingUsedTooltip: "Roles that are in linked to a workflow in the workflows page can not be deleted. You can instead disabled their access."
}

const OneAccessRoleConfig = (props: OneAccessRoleConfigProps) => {
  const {
    workflows,
    data,
    roles,
    onDelete,
    onAdd,
    onEdit,
    onUpdate,
    onStatusUpdate,
    index,
    onChange,
    setChanges
  } = props;
  const [roleType, setRoleType] = useState(
    data?.roleType ?? defaults.roleType
  );
  const [roleName, setRoleName] = useState(
    data?.roleName ?? defaults.roleName
  );
  const [status, setStatus] = useState(
    data?.status ?? defaults.status
  );
  const [statusDisabled, setStatusDisabled] = useState(
    data?.statusDisabled ?? defaults.statusDisabled
  );
  
  const [nameCharCount, setNameCharCount] = useState<number>(defaults.nameCharCount);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [toggleUpdateRoleButton, setToggleUpdateRoleButton] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showValidationErrorMessage, setShowValidationErrorMessage] = useState("");
  let roleLinkedToWorkflow = false;

  const setValidationError = (roleId: string, roleName: string) => {
    const roleFound = data.disabled ? roles.filter(role => role.roleName === roleName).length > 0 : roles.filter(role => role.roleId !== roleId && role.roleName === roleName).length > 0;
    const specialCharFound = roleName && roleName.match(/^[0-9A-Za-z]+$/) === null;
    if(roleFound || specialCharFound) {
      setShowValidationError(true);
      if(roleFound){
        setShowValidationErrorMessage("Please enter a unique role name.");
      } else if (specialCharFound) {
        setShowValidationErrorMessage("Special characters are not allowed in role name.");
      }
    } else {
      setShowValidationError(false);
      setShowValidationErrorMessage("");
    }
  }

  useEffect(() => {       //updating characters count as we type Role Name.
    setNameCharCount(defaults.nameCharCount - roleName.length);
  }, [roleName]);

  useEffect(() => {
    if((data.roleName !== roleName || data.roleType !== roleType) 
      || (isAddTemplate() || (index > 0 && !data.disabled))){
      setToggleUpdateRoleButton(true);
    } else {
      setToggleUpdateRoleButton(false);
    }
  }, [roleName, roleType]);

  const getHeaderLabel = () => {
    return isAddTemplate() ? "Add a new role" : `Role ${index + 1}`;
  }

  const isAddTemplate=()=>{
    return index < 0;
  }

  const roleIsBeingUsedInWorkflow = () => {
    workflows.map((workflow: any) => {
      if(workflow.authRoles?.includes(data.roleId)){
        roleLinkedToWorkflow = true;
      }

      workflow.secondary?.variables?.map((va: any) => {
        if(va.authRoles.includes(data.roleId)){
          roleLinkedToWorkflow = true;
        }
      })
    });
    return roleLinkedToWorkflow;
  }

  const onActiveModalClose = () => {
    setShowActiveModal(false);
  };

  const onCancel = (roleId: string) => {
    setRoleType(data.roleType);
    setRoleName(data.roleName);
    setStatus(data.status);
    onEdit(roleId, true);
  }

  return (
    <>
      <Modal
        className="edit-column-modal"
        onHide={onActiveModalClose}
        size="lg"
        title={MESSAGES.statusChangeModalTitle}
        showModal={showActiveModal}
        closeLabel="Cancel"
        actions={[
          {
            onClick: () => {
              setStatus("inActive");
              onStatusUpdate(data.roleId, "inActive");
              onChange(data.roleId, "status", "inActive");
              setShowActiveModal(false);
            },
            text: "Make Inactive",
            type: "delete"
          },
        ]}
      >
        {MESSAGES.statusChangeModalMessage}
      </Modal>

      <div className={'access-role-card px-4 py-2 rounded-lg mt-4 ' + ((!data.disabled && !isAddTemplate()) ? 'access-role-editing' : '') + (isAddTemplate() ? ' access-role-new' : '')}>
      <div className="flex justify-between">
        <div className="flex flex-grow  ">
          <div className="text-xs grid place-content-center mb-2">
            {getHeaderLabel()}
          </div>
        </div>
        {!isAddTemplate() && (
          <div className="grid place-content-center cursor-pointer  grid-cols-2 gap-3">
          {roleIsBeingUsedInWorkflow() ? (
            <>
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip className="tooltip ar-tooltip" id={`tooltip-top`}>
                  {MESSAGES.roleBeingUsedTooltip}
                </Tooltip>
              }
            >
              <span><FontAwesomeIcon icon={faTrashAlt} color="#2F80ED" className="fa-disabled" /></span>
            </OverlayTrigger>
            </>
          ) : (
            <FontAwesomeIcon icon={faTrashAlt} color="#2F80ED" onClick={() => onDelete(data.roleId)}  />
          )}
          <FontAwesomeIcon icon={faPenToSquare as IconProp} color="#2F80ED" onClick={() => onEdit(data.roleId, false)} className={((isAddTemplate() || !data.disabled) ? 'fa-disabled' : '')} />
        </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-x-4">
        <div>
          <p className="text-xs font-semibold workflow-type">Role Type</p>
            <Radios
              disabled={data.disabled}
              value="Enterprise-internal"
              checked={roleType === "Enterprise-internal"}
              handleOnChange={(ev: any) => {
                setRoleType(ev.target.value);
                onChange(data.roleId, "roleType", ev.target.value);
              }}
              label="Enterprise - Internal"
              className="mb-32"
            />
            <Radios
              disabled={data.disabled}
              value="Enduser-external"
              checked={roleType === "Enduser-external"}
              handleOnChange={(ev: any) => {
                setRoleType(ev.target.value);
                onChange(data.roleId, "roleType", ev.target.value);
              }}
              label="End-user - External"
              className="mb-3"
            />
        </div>
        <div>
          <p className="text-xs font-semibold workflow-type">Role Name <span className="font-normal">(Customer facing)</span></p>
          <Input
            className="input-container"
            disabled={data.disabled}
            label={null}
            value={roleName}
            maxLength={defaults.nameCharCount}
            style={{
              display: "grid",
              flexGrow: 1              
            }}
            placeholder={"Add name"}
            error={showValidationError}
            tooltipText={showValidationError ? showValidationErrorMessage : ""}
            handleInputChange={(ev: any) => {
              setRoleName(ev.target.value.trim());
              setValidationError(data.roleId, ev.target.value.trim());
              onChange(data.roleId, "roleName", ev.target.value.trim());
            }}
          />
          <p className="ushur-text text-gray-400">
            Max character limit: {nameCharCount}
          </p>
        </div>
        <div className="grid justify-center">
          <p className="text-xs font-semibold workflow-status">Role Access
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip className="tooltip ar-tooltip" id={`tooltip-top`}>
                  {MESSAGES.statusTooltip}
                </Tooltip>
              }
            >
              <span><FontAwesomeIcon className="ml-2" icon={faInfoCircle} color="#2F80ED" /></span>
            </OverlayTrigger>
          </p>
          
          <Switch
            toggle={isAddTemplate() ? false : (status === "Active" ? true : false)}
            activeLabel="Enabled"
            inactiveLabel="Disabled"
            disabled={isAddTemplate() ? true : statusDisabled}
            onChange={(ev: any) => {
              if(roleLinkedToWorkflow && status === "Active"){
                setShowActiveModal(true);
              } else if(status === "Active") {
                setStatus("inActive");
                onStatusUpdate(data.roleId, "inActive");
                onChange(data.roleId, "status", "inActive");
              } else if(status === "inActive") {
                setStatus("Active");
                onStatusUpdate(data.roleId, "Active");
                onChange(data.roleId, "status", "Active");                
              }
            }}
          /><p>&nbsp;</p>
        </div>
        <div className="flex items-center role-actions">
          {!data.disabled && !isAddTemplate() &&
            (
              <Button
                label="Cancel"
                onClick={() => onCancel(data.roleId)}
                type="cancel"
              />
            )
          }
          {!data.disabled && 
          (
            <Button
              disabled={!roleType || !roleName || showValidationError || !toggleUpdateRoleButton}
              label={isAddTemplate() ? "Add Role" : "Update Role"}
              onClick={() => {
                if(isAddTemplate()){ 
                  onAdd(roleName, roleType);
                  setRoleType("");
                  setRoleName("");
                } else {
                  onUpdate(data.roleId, roleName, roleType, status);
                }
                setToggleUpdateRoleButton(false);
              }}
              type="secondary"
            />
          )
          }
        </div>
      </div>
    </div>
    
    </>
    
  );
};

export default OneAccessRoleConfig;