import React, { useState, useEffect, ReactElement } from "react";
import {
  SimpleSearch,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import "./AppContextDropdown.css";
import useUrlSearchParams from "../custom-hooks/useUrlSearchParams";
import { getUshursAsync } from "../features/ushurs/ushursSlice";
import { uniqueSortedProjects } from '../utils/helpers.utils';
import { getAppContext } from "../utils/api.utils";
import { faFolder } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes as cubesSolid,
  faFolderOpen as folderOpenSolid,
} from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';


type Props = {
  handleProjectChange: (project: string) => void;
  containerWidth: number;
}

const AppContextDropdown = (props: Props) => {
  const dispatch = useAppDispatch();
  const { project } = useUrlSearchParams();
  const { handleProjectChange , containerWidth } = props;
  const campaignList = useAppSelector(state => state.ushurs.list);
  const [selectedProject, setSelectedProject] = useState<any>({
    label: project ? project : getAppContext() ? getAppContext() : "Main",
    value: project ? project : getAppContext() ? getAppContext() : "Main",
    projectName: project ? project : getAppContext() ? getAppContext() : "Main",
    isCategoryTitle: true,
  });
  const [projects, setProjects] = useState<any>([]);

  useEffect(() => {
    dispatch(getUshursAsync());
  }, []);

  useEffect(() => {
    if (campaignList.length > 0) {
      const sortedProjectsList = uniqueSortedProjects(campaignList);
      let alignProjectList = sortedProjectsList.map((project: any) => ({
        label: project,
        value: project,
      }))
      setProjects(alignProjectList);
    }
  }, [campaignList]);

  const handleTypeSelect = (e: any) => {
    setSelectedProject({
      label: e.label,
      value: e.value,
      projectName: e.value,
      isCategoryTitle: true,
    });
    handleProjectChange(e.value);
  };

  const customStyle = {
    control: (base: any) => ({
      ...base,
      "&:hover": {
        cursor: "pointer",
      },
      width: containerWidth ? containerWidth : "320",
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
      width: containerWidth ? containerWidth : "320",
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

  return (
    <div className="card-wrap each-data-card card project-card p-3">
      <div className="card-body w-full">
        {projects.length === 0 ? (
          <div className="text-md">No projects available.</div>
        ) : (
          <SimpleSearch
            options={projects ? projects : []}
            style={customStyle}
            optionHeadingText={"Select a project or workflow to change page context"}
            customSearchLable= { "Page context"}
            selectedCustomTitle= {"Selected workflow"}
            isSideText= {true}
            enableOptionsIcon= {true}
            setDropDownValue={selectedProject ? selectedProject : {}}
            placeholder="Type to search or click to select"
            optionsMenuIcon= {<FontAwesomeIcon icon={folderOpenSolid as IconProp} className={`searchable-optionsMenuIcon`}/>}
            selectedOptMenuIcon={<FontAwesomeIcon icon={ faFolder as IconProp} className={`searchable-selectedOptMenuIcon`} />}
            selectedSubcategoryIcon={(
              <FontAwesomeIcon
                icon={folderOpenSolid as IconProp}
                className={`searchable-selectedSubcategoryIcon`}
              />
            )}
            handleSelectedData={(e: any) => handleTypeSelect(e)}
          />
        )}
      </div>
    </div>
  );
}

export default AppContextDropdown;
