import React, { useEffect, useState, useRef } from "react";
import Select from "../../components/Select.react";
import { updateChanges } from "../hub-settings/hubSettingsSlice";
import { useAppDispatch } from "../../app/hooks";
// @ts-ignore
import {
   Input,
   Button,
   Checkbox,
   // @ts-ignore
} from "@ushurengg/uicomponents";
import { getUshurVariables } from "../ushurs/ushursAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Multiselect from 'multiselect-react-dropdown';
import { faPenToSquare } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const maxRecordsDropdown = [
   { id: "15", label: "15" },
   { id: "30", label: "30" },
   { id: "60", label: "60" },
   { id: "120", label: "120" },
];

const defaults = {
   ushurName: "",
   userRoles: "",
   isActive: true,
   order: 0,
   isExpanded: true,
   isUsingVariables: false,
   friendlyName: "",
   variables: [],
   varName: "",
   cfName: "",
   userRole: [],
   maxRecords: maxRecordsDropdown[0].id,
   secondaryWorkflow: {},
   variablesDropdownItems: [],
   roleLimit: 5
};

interface variableTypes {
   varName: string;
   authRoles: string[];
   varFriendlyName: string;
   order?: number;
   editing?: boolean;
}

function SecondaryWorkflow(props: any) {

   const dispatch = useAppDispatch();
   const { data, onChange, workflows, roles, setChanges } = props;

   const firstRender = useRef<boolean>(true);

   const [secondaryWorkflow, setSecondaryWorkflow] = useState<any>(
      data?.secondary ?? defaults.secondaryWorkflow
   );
   const [ushurName, setUshurName] = useState(
      data?.secondary?.ushurName ?? defaults.ushurName
   );
   const [filteredRoles, setFilteredRoles] = useState<any[]>(roles);
   const [isActive, setIsActive] = useState<boolean>(defaults.isActive);
   const [isExpanded, setIsExpanded] = useState<boolean>(defaults.isExpanded);
   const [isUsingVariables, setIsUsingVariables] = useState<boolean>(
      data?.secondary?.useVariables ?? defaults.isUsingVariables
   );
   const [friendlyName, setFriendlyName] = useState<string>(
      data?.secondary?.friendlyName ?? defaults.friendlyName
   );
   const [variables, setVariables] = useState<variableTypes[]>(
      data?.secondary?.variables ?? defaults.variables
   );

   const [variablesDropdownItems, setVariablesDropdownItems] = useState<any>(
      defaults.variablesDropdownItems
   );
   const [maxRecords, setMaxRecords] = useState<string>(
      data?.secondary?.numRecords ?? defaults.maxRecords
   );

   const [dragId, setDragId] = useState<string>();

   const handleDrag = (ev: React.ChangeEvent<HTMLDivElement>) => {
      setDragId(ev.currentTarget.id);
   };

   const handleDrop = (ev: React.ChangeEvent<HTMLDivElement>) => {
      const dragBox = variables.find((item) => item.varName === dragId);
      const dropBox = variables.find(
         (item) => item.varName === ev.currentTarget.id
      );

      const i = variables.indexOf(dragBox!);
      const j = variables.indexOf(dropBox!);

      const newVariableState = variables.map((item) => item);
      [newVariableState[i], newVariableState[j]] = [
         newVariableState[j],
         newVariableState[i],
      ];

      setVariables(newVariableState);
      setChanges((prev: any) =>
        prev.add(`${data.id}--${"secondary"}${"-variables"}`)
      );
   };

   const updateVariablesList = async (wfId: any) => {
      if (isUsingVariables) {
         let arr: any = [];
         let prefix = 'c_uVar_';
         const vars = await getUshurVariables(wfId);

         vars?.forEach((item: any) => {

            //trimming prefix c_uVar_
            let val = item.variable.slice(prefix.length);
            arr.push({ id: val, label: val });
         });

         setVariablesDropdownItems(arr);
      }
   };

   const updateSecondaryWorkflow = (
     id: string,
     fieldName: string,
     value: any
   ) => {
     dispatch(updateChanges({ id, fieldName, value }));
   }; 

   useEffect(() => {
     updateSecondaryWorkflow(data.id, "secondary", secondaryWorkflow);
   }, [secondaryWorkflow]);

   useEffect(() => {
      if (!isActive) setIsExpanded(false);
      else setIsExpanded(true);
   }, [isActive]);

   useEffect(() => {

      let newObj;
      if (
         isActive === defaults.isActive &&
         ushurName === defaults.ushurName &&
         isUsingVariables === defaults.isUsingVariables &&
         friendlyName === defaults.friendlyName &&
         maxRecords.toString() === defaults.maxRecords &&
         variables.length === defaults.variables.length
      ) {
         newObj = defaults.secondaryWorkflow;
      } else {
         newObj = {
            isEnabled: true,
            ushurName: ushurName,
            friendlyName: friendlyName,
            numRecords: maxRecords,
            useVariables: isUsingVariables,
            variables: variables,
         };
      }

      setSecondaryWorkflow(newObj);
   }, [isActive, isUsingVariables, friendlyName, maxRecords, variables, ushurName]);

   useEffect(() => {
     if (firstRender.current) {
       firstRender.current = false;
       return;
     }
     if (ushurName !== "" && isUsingVariables) updateVariablesList(ushurName);

     setChanges((prev: any) =>
       prev.add(`${data.id}--${"secondary"}${"-isUsingVariable"}`)
     );
   }, [isUsingVariables]);

   useEffect(() => {
      if (ushurName !== "" && isUsingVariables) updateVariablesList(ushurName);
   }, []);

  useEffect(() => {
    setFilteredRoles(roles);
  }, [roles]); 
   

   return (
      <div>
         <div className="flex justify-between mb-2">
            <div className="flex justify-center items-center">
               <p className="font-semibold workflow-type text-[#64676C] mb-0 mr-[16px]">
                  Secondary Workflow
               </p>
               <div className="grid place-content-center">
                  <Switch
                     toggle={isActive}
                     onChange={(disabled: boolean) => {
                        if (!disabled) setIsActive((prev) => !prev);
                     }}
                     disabled={true}
                  />
               </div>
            </div>
            <div>
               {isActive ? (
                  <FontAwesomeIcon
                     className="hover:cursor-pointer"
                     icon={isExpanded ? faChevronUp : faChevronDown}
                     color="#2F80ED"
                     onClick={() => setIsExpanded((prev) => !prev)}
                  />
               ) : null}
            </div>
         </div>
         <div>
            <p className="ushur-text">
               Secondary workflow should be linked to the data table Ushur
            </p>
         </div>

         {isActive && isExpanded ? (
            <div>
               <div className="grid grid-cols-2 gap-x-4">
                  <div>
                     <Select
                        items={[{ id: "", label: "Select workflow" }].concat(
                           workflows.filter(
                              (item: { id: string; label: string }) => {
                                 if (
                                    item.label.startsWith("Default-") &&
                                    item.label.endsWith("-01")
                                 )
                                    return false;
                                 else return true;
                              }
                           )
                        )}
                        value={ushurName}
                        onChange={(wfId) => {
                           setUshurName(wfId);
                           updateVariablesList(wfId);
                           setChanges((prev: any) =>
                             prev.add(
                               `${data.id}--${"secondary"}${"-ushurName"}`
                             )
                           );
                        }}
                        title="Linked Ushur workflow"
                     />
                     <div className="mb-3"></div>
                     <p className="ushur-label form-label mt-10">Variables</p>
                     <Checkbox
                        disabled={false}
                        checked={isUsingVariables}
                        label="Use variables from workflow"
                        handleOnChange={() => {
                           setIsUsingVariables((prev) => !prev);
                        }}
                     />
                  </div>

                  <div>
                     <Input
                        label="Customer facing workflow name"
                        value={friendlyName}
                        placeholder={"Add friendly name"}
                        handleInputChange={(
                           ev: React.ChangeEvent<HTMLInputElement>
                        ) => {
                           setFriendlyName(ev.target.value);
                           setChanges((prev: any) =>
                             prev.add(
                               `${data.id}--${"secondary"}${"-friendlyName"}`
                             )
                           );
                        }}
                     />
                     <Select
                        items={maxRecordsDropdown}
                        value={maxRecords}
                        onChange={(val) => {
                           setMaxRecords(val);
                           setChanges((prev: any) =>
                             prev.add(
                               `${data.id}--${"secondary"}${"-maxRecords"}`
                             )
                           );       
                        }}
                        title="Maximum records to display"
                     />
                  </div>
               </div>

               <div className="mb-4"></div>

               {isUsingVariables && (
                  <div>
                     <VariablesList
                        variables={variables}
                        setVariables={setVariables}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        variablesDropdownItems={variablesDropdownItems}
                        roles={filteredRoles}
                        setChanges = {setChanges}
                        data={data}
                     />
                     <AddVariablesSection
                        variables={variables}
                        setVariables={setVariables}
                        secondaryWorkflow={secondaryWorkflow}
                        setSecondaryWorkflow={setSecondaryWorkflow}
                        variablesDropdownItems={variablesDropdownItems}
                        roles={filteredRoles}
                        onChange={onChange}
                        data={data}
                        setChanges = {setChanges}
                     />
                  </div>
               )}
            </div>
         ) : null}
      </div>
   );
}

type variableListProps = {
   variables: variableTypes[];
   index?: number;
   setVariables: (arr: variableTypes[]) => void;
   handleDrag?: (ev: any) => void;
   handleDrop?: (ev: any) => void;
   roles: any[],
   setChanges: (set: any) => void;
   data: any,
   variablesDropdownItems: any;
};

const VariablesList = (props: variableListProps) => {
   const {
      variables,
      setVariables,
      handleDrag,
      handleDrop,
      setChanges,
      roles,
      data,
      variablesDropdownItems
   } = props;

   const [variableList, setVariableList] = useState<variableTypes[]>([]);
   const [filteredRoles, setFilteredRoles] = useState<any[]>(roles);
   const [addBtnEnabled, setAddBtnEnabled] = useState<boolean>(true);
   const [disableUpdateVariableButton, setDisableUpdateVariableButton] = useState(true);
   const [editingIndex, setEditingIndex] = useState<number>(-1);
   const [isLimitError, setIsLimitError] = useState<boolean>(false);
   const [maxLimitRoles, setMaxLimitRoles] = useState<any[]>([]);
   const [varName, setVarName] = useState<string>(defaults.varName);
   const [accessRoles, setAccessRoles] = useState<string[]>([]);
   const [cfName, setCfName] = useState<string>(defaults.cfName);
   
   const multiselectRef = useRef<any>({});

   useEffect(() => {
    const list = variables.map((variable: any) => ({
      ...variable,
      editing: false
    }));

    setVariableList(list);
  }, [variables]);

  useEffect(() => {
    setFilteredRoles(roles);
  }, [roles]);

  const rolesMatch = (a: string[], b: string[]) => {
    if(a.length !== b.length && b.length !== 0){
      return false;
    } else if (b.length === 0) {
      return true;
    }
    return a.every(a1 => b.includes(a1));
  }

  useEffect(() => {
    const editVariable = variableList.filter(v => v.editing);
    if(editVariable.length > 0) {
      if((editVariable[0].varName !== varName || editVariable[0].varFriendlyName !== cfName || !rolesMatch(editVariable[0].authRoles, accessRoles)
        )){
        setDisableUpdateVariableButton(false);
      } else {
        setDisableUpdateVariableButton(true);
      }

      if (isMaxLinkedVariableLimitReached())
          setIsLimitError(true);
      else setIsLimitError(false);
    }
 }, [varName, cfName, accessRoles, isLimitError]);

  const isMaxLinkedVariableLimitReached = () => {
    const count = accessRoles.map((role) => ({
      id: role,
      count: variables.filter((v: variableTypes, index: number) => index !== editingIndex && v.authRoles.includes(role)).length
    }));
    let status = false;
    const errorRoles: any[] = [];
    count.map((c) => {
      if(c.count >= defaults.roleLimit){
        errorRoles.push(c.id);
        status = true;
      }
    });
    if(status){
      setMaxLimitRoles(errorRoles);
    } else {
      setMaxLimitRoles([]);
    }

    return status;
  };

   const deleteCard = (item: variableTypes, index: number) => {
      let newArr = variables.filter(
         (item: variableTypes, i: number) => i !== index
      );

      setVariables(newArr);
      setChanges((prev: any) =>
        prev.add(`${data.id}--${"secondary"}${"-variables"}`)
      );
   };

   const editCard = (item: variableTypes, index: number) => {
      const list = variableList.map((variable: any, i: number) => ({
        ...variable,
        editing: i === index ? true : false
      }));

      setEditingIndex(index);
      setVarName(item.varName);
      setAccessRoles(item.authRoles);
      setCfName(item.varFriendlyName);

      setVariableList(list);
   }

    const updateCard = (item: variableTypes, index: number) => {
      const list = variableList.map((variable: any, i: number) => ({
        ...variable,
        varName:          i === index ? varName : variable.varName,
        varFriendlyName:  i === index ? cfName : variable.varFriendlyName,
        authRoles:        i === index ? accessRoles : variable.authRoles,
        editing:          false
      }));

      setVariables(list);

      setVarName("");
      setAccessRoles([]);
      setCfName("");
      setEditingIndex(-1);

      setChanges((prev: any) => 
        prev.add(`${data.id}--${"secondary"}${"-variables"}`)
      );
    }

    const cancelCardUpdate = (item: variableTypes, index: number) => {
      const list = variableList.map((variable: any, i: number) => ({
        ...variable,
        varName:          variable.varName,
        varFriendlyName:  variable.varFriendlyName,
        authRoles:        variable.authRoles,
        editing:          false
      }));

      setVariables(list);

      setVarName("");
      setAccessRoles([]);
      setCfName("");
      setEditingIndex(-1);
    }

   const onSelect = (selectedList: any, selectedItem: any) => {
    setAccessRoles(
      selectedList.map((role:any) => role.id )
    );
  }

  const onRemove = (selectedList: any, removedItem: any) => {
    setAccessRoles(
      selectedList.map((role:any) => role.id)
    );
  }

  const convertInMultiSelectFormat = (roles: any[]) => {
    return filteredRoles
      .filter(r => roles.includes(r.id))
      .map(r => ({
        id: r.id,
        name: r.name,
        cat: r.cat
      }));
  }

   return (
      <div>
         {!!variableList.length &&
            variableList.map((item: variableTypes, index: number) => {
               return (
                  <>
                    {item.editing ? (
                      <div 
                        className="bg-[#F4F5F7] rounded p-3 mb-4 workflow-variable-section" 
                        key={index} 
                        id={item.varName}
                        >
                        <div className="grid grid-cols-2 gap-x-4">
                          <div>
                            <Select
                              items={[
                                { id: "", label: "Select variable" },
                                ...variablesDropdownItems,
                              ]}
                              value={varName}
                              onChange={(vname) => {
                                setVarName(vname);
                              }}
                              title="Variable"
                            />
                            <label className="ushur-label form-label mt-10">Roles</label>
                            <Multiselect
                              showArrow={true}
                              customArrow={true}
                              placeholder="Select roles"
                              options={filteredRoles}
                              selectedValues={convertInMultiSelectFormat(accessRoles)}
                              onSelect={onSelect}
                              onRemove={onRemove}
                              displayValue="name"
                              groupBy="cat"
                              showCheckbox={true}
                              emptyRecordMsg="No roles available"
                              ref={multiselectRef}
                              customCloseIcon={<></>}
                            />
                          </div>
                          <div>
                            <Input
                              label="Customer facing name"
                              value={cfName}
                              placeholder={"Add friendly name"}
                              handleInputChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                setCfName(ev.target.value.trim());
                              }}
                            />
                            <div className="mb-4"></div>
                            <div className="text-right">
                              <Button
                                label="Cancel"
                                onClick={() => cancelCardUpdate(item, index)}
                                type="cancel"
                              />
                              <Button
                                label="Update variable"
                                disabled={disableUpdateVariableButton || !varName || !cfName || !accessRoles || isLimitError}
                                onClick={() => updateCard(item, index)}
                                type="secondary"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mb-3"></div>
                          <p className="ushur-text mb-0">
                            Maximum Linked Variable Allowed for each access role: {defaults.roleLimit}
                          </p>
                          {isLimitError && (
                            <p className="ushur-text mb-0 error-msg">
                              Maximum limit reached for { 
                                                  JSON.stringify(roles
                                                    .filter(r => maxLimitRoles.includes(r.id))
                                                    .map(r => r.name)
                                                  )
                                                  } user role(s).
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="bg-[#F4F5F7] rounded p-3 mb-4"
                        key={index}
                        draggable={true}
                        id={item.varName}
                        onDragOver={(ev) => ev.preventDefault()}
                        onDragStart={handleDrag}
                        onDrop={handleDrop}
                      >
                        
                        <div className="flex justify-between">
                          <div className="flex flex-grow">
                            <p className="ushur-text mb-3">{index + 1}</p>
                          </div>
                          <div className="grid place-content-center cursor-pointer  grid-cols-2 gap-3">
                            <FontAwesomeIcon
                              className="hover:cursor-pointer"
                              icon={faPenToSquare as IconProp}
                              onClick={() => editCard(item, index)}
                              color="#2F80ED"
                            />
                            <FontAwesomeIcon
                              className="hover:cursor-pointer"
                              icon={faTrashAlt}
                              onClick={() => deleteCard(item, index)}
                              color="#2F80ED"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 ">
                            <div>
                              <div>
                                  <p className="ushur-label form-label">Variable</p>
                                  <p className="ushur-text border-2 border-gray-400 rounded px-2 py-1">
                                    {item.varName}
                                  </p>
                              </div>

                              <div>
                                  <p className="ushur-label form-label">
                                    Roles
                                  </p>
                                  <p className="ushur-text mb-0 border-2 border-gray-400 rounded px-2 py-1 variable-role-section">
                                    {roles.filter(r => item.authRoles.includes(r.id))
                                        .map((r) => {
                                        return (
                                          <span className="chip">{r.name}</span>
                                        )
                                      })
                                    }
                                  </p>
                              </div>
                            </div>

                            <div>
                              <p className="ushur-label form-label">
                                  Customer Facing Name
                              </p>
                              <p className="ushur-text border-2 border-gray-400 rounded px-2 py-1">
                                  {item.varFriendlyName}
                              </p>
                            </div>
                        </div>
                      </div>
                    )}
                  
                  </>
               );
            })}
      </div>
   );
};

type variableProps = {
   index?: number;
   variables: variableTypes[];
   secondaryWorkflow: any;
   setSecondaryWorkflow: any;
   setVariables: (arr: variableTypes[]) => void;
   variablesDropdownItems: any;
   onChange: (
      id: string,
      fieldName: string,
      value: any,
      nestedFieldName: string
   ) => void;
   data: any;
   roles: any[],
   setChanges: (set: any) => void;
};

const AddVariablesSection = (props: variableProps) => {

   const {
      setVariables,
      variables,
      onChange,
      data,
      roles,
      secondaryWorkflow,
      setSecondaryWorkflow,
      variablesDropdownItems,
      setChanges
   } = props;

   const [varName, setVarName] = useState<string>(defaults.varName);
   const [accessRoles, setAccessRoles] = useState<[]>([]);
   const [cfName, setCfName] = useState<string>(defaults.cfName);
   const [addBtnEnabled, setAddBtnEnabled] = useState<boolean>(false);
   const [isLimitError, setIsLimitError] = useState<boolean>(false);
   const [filteredRoles, setFilteredRoles] = useState<any[]>(roles);
   const [maxLimitRoles, setMaxLimitRoles] = useState<any[]>([]);
   const multiselectRef = useRef<any>({});

   const addVariableEntry = () => {
      const newEntry = {
         varName: varName,
         authRoles: accessRoles,
         varFriendlyName: cfName,
      };

      setVariables([...variables, newEntry]);
      setVarName(defaults.varName);
      setCfName(defaults.cfName);
      multiselectRef.current.resetSelectedValues();
      setAccessRoles([]);
      setIsLimitError(false);
      setChanges((prev: any) =>
        prev.add(`${data.id}--${"secondary"}${"-variables"}`)
      );
   };

   const onSelect = (selectedList: any, selectedItem: any) => {
    setAccessRoles(
      selectedList.map((role:any) => role.id )
    );
  }

  const onRemove = (selectedList: any, removedItem: any) => {
    setAccessRoles(
      selectedList.map((role:any) => role.id)
    );
  }

   useEffect(() => {
      const valid = varName && cfName && accessRoles.length>0 && !isLimitError;
      if (valid) setAddBtnEnabled(true);
      else setAddBtnEnabled(false);

      if (isMaxLinkedVariableLimitReached())
          setIsLimitError(true);
      else setIsLimitError(false);
   }, [varName, cfName, accessRoles, isLimitError]);

   const isMaxLinkedVariableLimitReached = () => {
    const count = accessRoles.map((role) => ({
      id: role,
      count: variables.filter(v => v.authRoles.includes(role)).length
    }));
    let status = false;
    const errorRoles: any[] = [];
    count.map((c) => {
      if(c.count >= defaults.roleLimit){
        errorRoles.push(c.id);
        status = true;
      }
    });
    if(status){
      setMaxLimitRoles(errorRoles);
    } else {
      setMaxLimitRoles([]);
    }

    return status;
   };

    useEffect(() => {
      setFilteredRoles(roles);
    }, [roles]);

   return (
     <div className="bg-[#F4F5F7] rounded p-3 mb-4 add-variable-section">
       <div className="grid grid-cols-2 gap-x-4">
         <div>
           <Select
             items={[
               { id: "", label: "Select variable" },
               ...variablesDropdownItems,
             ]}
             value={varName}
             onChange={(vname) => {
               setVarName(vname);
             }}
             title="Variable"
           />
           <label className="ushur-label form-label mt-10">Roles</label>
           <Multiselect
              showArrow={true}
              customArrow={true}
              placeholder="Select roles"
              options={filteredRoles}
              selectedValues={[]}
              onSelect={onSelect}
              onRemove={onRemove}
              displayValue="name"
              groupBy="cat"
              showCheckbox={true}
              emptyRecordMsg="No roles available"
              ref={multiselectRef}
              customCloseIcon={<></>}
            />
         </div>
         <div>
           <Input
             label="Customer facing name"
             value={cfName}
             placeholder={"Add friendly name"}
             handleInputChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
               setCfName(ev.target.value);
             }}
           />
           <div className="mb-4"></div>
           <div>
             <Button
               label="Add variable"
               disabled={!addBtnEnabled}
               onClick={addVariableEntry}
               type="secondary"
             />
           </div>
         </div>
       </div>
       <div>
         <div className="mb-3"></div>
         <p className="ushur-text mb-0">
           Maximum Linked Variable Allowed for each access role: {defaults.roleLimit}
         </p>
         {isLimitError && (
           <p className="ushur-text mb-0 error-msg">
             Maximum limit reached for { 
                                  JSON.stringify(roles
                                    .filter(r => maxLimitRoles.includes(r.id))
                                    .map(r => r.name)
                                  )
                                 } user role(s).
           </p>
         )}
       </div>
     </div>
   );
};

type SwitchProps = {
   toggle: boolean;
   onChange: (disabled: boolean) => void;
   disabled: boolean;
};

const Switch = (props: SwitchProps) => {
   const { toggle, onChange, disabled } = props;

   let str = `w-[32px] h-[16px] ${
      toggle ? (disabled ? "bg-[#99D2B1]" : "bg-green-500") : "bg-gray-300"
   } rounded-[44px] p-[2px] hover:cursor-pointer relative`;

   return (
      <div>
         <div className={str} onClick={() => onChange(disabled)}>
            <div
               className={`w-[12px] h-[12px] rounded-[100%] bg-white absolute ${
                  toggle ? "right-[2px]" : "left-[2px]"
               }`}
            ></div>
         </div>
      </div>
   );
};

export default SecondaryWorkflow;
