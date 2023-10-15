import React, { useState, useEffect } from "react";
import {  SimpleSearch,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getUshursAsync, list } from "../../features/ushurs/ushursSlice";
import "./CampaignDropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes as cubesSolid,
  faFolderOpen as folderOpenSolid,
} from "@fortawesome/pro-solid-svg-icons";
import { faCubes } from "@fortawesome/pro-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { groupBy } from 'lodash';


type DropdownProps = {
  handleWorkflowChange: (workflow: string) => void;
  currentWorkflow: string;
}

const CampaignDropdown = (props: DropdownProps) => {
  const { handleWorkflowChange, currentWorkflow } = props;
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector(list);
  const [workflows, setWorkflows] = useState<any>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>({
    label: currentWorkflow,
    value: currentWorkflow,
  }); 

  useEffect(() => {
    if (campaigns.length > 0) {
      const workflowList = campaigns.filter((workflow: any) => workflow.campaignId).map((workflow: any) => ({
        label: workflow.campaignId,
        value: workflow.campaignId,
        categoryTitle: workflow.AppContext,
      }))
      const currentOptions = groupBy(workflowList, eachOption => eachOption.categoryTitle);
      var allOptions:any = []
      for (const property in currentOptions) {
        allOptions.push({"label":property,"options":currentOptions[property]})
      }
      setWorkflows(allOptions);
    }
  }, [campaigns]);

const handleTypeSelect = (e: any) => {
  setSelectedWorkflow({
    label: e.label,
    value: e.value,
    isCategoryTitle: false,
  });
  handleWorkflowChange(e.value);
};

const customStyle = {
  control: (base: any) => ({
    ...base,
    "&:hover": {
      cursor: "pointer",
    },
    width: 320,
    fontSize: "0.875rem",
  }),
  option: (base: any, {isFocused, isSelected}:any) => ({
    ...base,
    cursor: "pointer",
    paddingTop: 3,
    paddingBottom: 2,
    paddingRight: 4,
    paddingLeft: 6,
    fontSize: "0.815rem",
    display: "inline-block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    background: isFocused ? '#e3e3e3' : '#FFFFFF',
    color: isSelected ? '#2F80ED' : '#332E20',
  }),
  valueContainer: (provided:any) => ({
    ...provided,
    marginTop: -2,
    padding: 1,
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999999,
    marginTop: 1,
    width: 320,
  }),
  menuPortal: (provider: any) => ({
    ...provider,
    zIndex: 9999999,
  }),
  menuList: (base:any) => ({
    ...base,
    paddingBottom: 2,
    paddingTop: 0,
    overflowX:"hidden",
    flexWrap: 'nowrap',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    zIndex: 999
  }),
  dropdownIndicator: (provided:any) => ({
    ...provided,
    padding: 5,
  }),
  group: (base:any) => ({
    ...base,
    paddingTop: 2,
    paddingBottom: 2,
  }),
};

  useEffect(() => {
    dispatch(getUshursAsync());
  }, []);

  return (
    <div className="card-wrap workflow-dropdown each-data-card p-3">
      <div className="card-body w-full">
        {
          campaigns.length === 0 ?
            <div className="text-md">No workflows available.</div> :
            <SimpleSearch
              options={workflows ? workflows : []}
              optionHeadingText={"Select a project or workflow to change page context"}
              customSearchLable= { "Page context"}
              selectedCustomTitle= {"Selected workflow"}
              style={customStyle}
              isSideText= {true}
              enableOptionsIcon= {true}
              setDropDownValue={selectedWorkflow ? selectedWorkflow : {}}

              placeholder="Type to search or click to select"
              optionsMenuIcon= {<FontAwesomeIcon icon={faCubes as IconProp} className={`searchable-optionsMenuIcon`}/>}
              selectedOptMenuIcon={<FontAwesomeIcon icon={cubesSolid as IconProp} className={`searchable-selectedOptMenuIcon`} />}
              selectedSubcategoryIcon={ (
                <FontAwesomeIcon
                  icon={cubesSolid as IconProp}
                  className={`searchable-selectedSubcategoryIcon`}
                />
              )}
              handleSelectedData={(e: any) => handleTypeSelect(e)}
            />
        }
      </div>
    </div>
  );
}

export default CampaignDropdown;