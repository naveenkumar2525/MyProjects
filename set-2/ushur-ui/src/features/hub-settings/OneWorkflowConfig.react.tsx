import React, { useState, useEffect } from "react";
import "./OneWorkflowConfig.css";
// @ts-ignore
import {
  Input,
  Checkbox,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Select from "../../components/Select.react";
import DropFile from "../../components/DropFile.react";
import TextArea from "../../components/TextArea.react";
import { base64StringForImage } from "../../utils/helpers.utils";
import UrlCopy from "./UrlCopy.react";
import { getHostName } from "../../utils/api.utils";
import SecondaryWorkflow from "./SecondaryWorkflow.react";
import Multiselect from 'multiselect-react-dropdown';

type OneWorkflowConfigProps = {
  index: number;
  workflows: any[];
  roles: any[];
  data: any;
  setShowExpand: (id: string, expand: boolean) => void;
  setEmptyNameError: (id: string, emptyName: boolean) => void;
  setEmptyLinkError: (id: string, emptyLink: boolean) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, fieldName: string, value: any) => void;
  setChanges: (set: any) => void;
};

const defaults = {
  ushurName: "",
  friendlyName: "",
  description: "",
  assetId: "",
  logoFile: "",
  authRoles: [],
  showDescription: false,
  showActiveHistory: false,
  descCharCount: 280,
};

function getWorkflowUrl(hostName: string, hubId: string, workflowId: string) {
  return `${hostName}/ip/${hubId ?? ""}?workflow=${workflowId ?? ""}`;
}

const OneWorkflowConfig = React.forwardRef((props: OneWorkflowConfigProps, ref:any) => {
  const {
    workflows = [],
    roles = [],
    data,
    setShowExpand,
    setEmptyNameError,
    setEmptyLinkError,
    onDelete,
    index,
    onChange,
    setChanges
  } = props;
  const [ushurName, setUshurName] = useState(
    data?.ushurName ?? defaults.ushurName
  );
  const [friendlyName, setFriendlyName] = useState(
    data?.friendlyName ?? defaults.friendlyName
  );
  const [description, setDescription] = useState(
    data?.description ?? defaults.description
  );
  const [logoFile, setLogoFile] = useState(defaults.logoFile);
  /* always show description and active history in MVP1 */
  // const [showDescription, setShowDescription] = useState(
  //   data?.showDescription ?? defaults.showDescription
  // );
  // const [showActiveHistory, setShowActiveHistory] = useState(
  //   data?.showActiveHistory ?? defaults.showActiveHistory
  // );
  const [showDescription, setShowDescription] = useState(true);
  const [showActiveHistory, setShowActiveHistory] = useState(true);
  const [descCharCount, setDescCharCount] = useState<number>(defaults.descCharCount);
  const [secondaryWorkflowRoles, setSecondaryWorkflowRoles] = useState<any[]>([]);
  const [authRoles, setAuthRoles] = useState(
    data?.authRoles ?? defaults.authRoles
  );

  useEffect(() => {       //updating characters count as we type portal description.
    setDescCharCount(defaults.descCharCount - description.length);
  }, [description]);

  const onChangeShowDescription = () => {
    onChange(data.id, "showDescription", !showDescription);
    setShowDescription(!showDescription);
  };

  const onChangeShowActiveHistory = () => {
    onChange(data.id, "showActiveHistory", !showActiveHistory);
    setShowActiveHistory(!showActiveHistory);
  };

  const allRoles = roles
  .filter(role => role.status === "Active")
  .map((role: any) => ({
    id: role.roleId,
    name: role.roleName,
    cat: role.roleType === "Enterprise-internal" ? "INTERNAL" : "EXTERNAL" 
  }));

  useEffect(() => {
    const rolesOptions = convertInMultiSelectFormat(authRoles);
    setSecondaryWorkflowRoles(rolesOptions);
  }, []);
  
  const convertInMultiSelectFormat = (roles: any[]) => {
    return allRoles
      .filter(r => roles.includes(r.id))
      .map(r => ({
        id: r.id,
        name: r.name,
        cat: r.cat
      }));
  }

  const onSelect = (selectedList: any, selectedItem: any) => {
    const newList = [...selectedList];
    onChange(data.id, "authRoles", newList.map(l => l.id));
    setAuthRoles(newList.map(l => l.id));
    setSecondaryWorkflowRoles(newList);
  }

  const onRemove = (selectedList: any, removedItem: any) => {
    const newList = [...selectedList];
    onChange(data.id, "authRoles", newList.map(l => l.id));
    setAuthRoles(newList.map(l => l.id));
    setSecondaryWorkflowRoles(newList);
  }


  return (
    <div className="bg-white px-4 py-2 rounded-lg mt-4">
      <div className="flex justify-between">
        <div className="flex flex-grow one-workflow ">
          <div
            className="grid place-content-center cursor-pointer"
            onClick={() => setShowExpand(data.id, !data.expand)}
          >
            {data.expand ? (
              <FontAwesomeIcon icon={faChevronDown} color="#332E20" />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} color="#332E20" />
            )}
          </div>
          <div
            className="grid place-content-center ml-4 text-gray-300"
            ref={(el) => (ref.current[data.id] = el)}
          >
            {index + 1}
          </div>
          <Input
            label={null}
            value={friendlyName}
            style={{
              display: "grid",
              flexGrow: 1,
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
            handleInputChange={(ev: any) => {
              setFriendlyName(ev.target.value);
              onChange(data.id, "friendlyName", ev.target.value);
            }}
          />
        </div>
        <div
          className="grid place-content-center cursor-pointer"
          onClick={() => onDelete(data.id)}
        >
          <FontAwesomeIcon icon={faTrashAlt} color="#2F80ED" />
        </div>
      </div>
      {data.expand && (
        <>
          <p className="mt-2 font-semibold workflow-type text-[#64676C]">
            Primary Workflow
          </p>
          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <Select
                items={[{ id: "", label: "Select workflow" }].concat(
                  workflows.filter((item) => {
                    if (
                      item.label.startsWith("Default-") &&
                      item.label.endsWith("-01")
                    )
                      return false;
                    else return true;
                  })
                )}
                value={ushurName}
                error={data.emptyLink}
                tooltipText={
                  data.emptyLink ? "Missing link workflow to Ushur" : ""
                }
                onChange={(wfId) => {
                  setUshurName(wfId);
                  setEmptyLinkError(data.id, false);
                  onChange(
                    data.id,
                    "ushurName",
                    workflows?.find((wf) => wf.id === wfId)?.label ?? ""
                  );
                }}
                title="Linked Ushur workflow"
              />
              <div className="mb-2"></div>
              <Input
                label="Customer facing workflow name"
                helperText="This is the name your customers see."
                placeholder={"Enter name"}
                value={friendlyName}
                error={data.emptyName}
                tooltipText={
                  data.emptyName ? "Missing workflow friendly name" : ""
                }
                handleInputChange={(ev: any) => {
                  setFriendlyName(ev.target.value);
                  setEmptyNameError(data.id, false);
                  onChange(data.id, "friendlyName", ev.target.value);
                }}
              />
            </div>
            <DropFile
              id={data.id}
              label="Workflow icon"
              infoText="Drop or Select icon File"
              supportedText="supported formats: .img, .jpg, .gif, .png"
              onChange={async (file: any) => {
                setLogoFile(file);
                // onChange(data.id, "logo_file", file);
                onChange(
                  data.id,
                  "base64Logo",
                  await base64StringForImage(file)
                );
              }}
            />
          </div>
          {/* <p className="ushur-label form-label mt-10">
            Toggle sidebar features
          </p> */}
          <div className="grid grid-cols-2">
            {/* <div>
              <Checkbox
                disabled={true}
                checked={showDescription}
                label="Workflow description"
                handleOnChange={onChangeShowDescription}
                onClick={onChangeShowDescription}
              />
            </div> */}
            {/* <div>
              <Checkbox
                disabled={true}
                checked={showActiveHistory}
                label="Account History"
                handleOnChange={onChangeShowActiveHistory}
                onClick={onChangeShowActiveHistory}
              />
            </div> */}
          </div>
          {showDescription && (
            <div>
              <Input
                type="textarea"
                textAreaRows={5}
                label="Workflow description"
                maxLength={defaults.descCharCount}
                value={description}
                handleInputChange={(ev: any) => {
                  setDescription(ev.target.value);
                  onChange(data.id, "description", ev.target.value);
                }}
              />
              <p className="ushur-text text-gray-400">
                {descCharCount} characters remaining
              </p>
            </div>
          )}
          <div className="grid grid-cols-2">
            <div><label className="ushur-label form-label mt-10">Roles</label>
            <Multiselect
              showArrow={true}
              customArrow={true}
              placeholder="Select roles"
              options={allRoles}
              selectedValues={convertInMultiSelectFormat(authRoles)}
              onSelect={onSelect}
              onRemove={onRemove}
              displayValue="name"
              groupBy="cat"
              showCheckbox={true}
              emptyRecordMsg="No roles available"
              customCloseIcon={<></>}
            />
            </div>
            <div></div>
          </div>
          <div className="mb-4"></div>
          <UrlCopy
            label="Workflow URL"
            url={getWorkflowUrl(data.hostName, data.hubId, data.workflowId)}
            active={data.workflowId}
          />
          <div className=" mt-4 mb-4 w-full border-t border-[#F3F3F3]"></div>

          <SecondaryWorkflow
            data={data}
            roles={secondaryWorkflowRoles}
            onChange={onChange}
            setChanges = {setChanges}
            workflows={workflows}
          />
        </>
      )}
    </div>
  );
});

export default OneWorkflowConfig;

// await fetch(
//   "https://kuyil.ushur.dev/rest/asset/v2/sfdownload/f0356d29-0985-46c9-a8bd-c4a99049483a",
//   {
//     headers: {
//       token: JSON.parse(localStorage.getItem("user")).tokenId,
//     },
//     body: null,
//     method: "GET",
//   }
// )
//   .then((response) => response.blob())
//   .then(
//     (blob) =>
//       new Promise((callback) => {
//         let reader = new FileReader();
//         reader.onload = function () {
//           callback(this.result);
//         };
//         reader.readAsDataURL(blob);
//       })
//   );
