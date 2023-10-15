import React, { useEffect, useState } from "react";
import "./Condition.css";
// // @ts-ignore
// import {
//   Input
//   // @ts-ignore
// } from "@ushurengg/uicomponents";
import GenericInput from "../../components/GenericInput.react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
// import {
//   faChevronRight,
//   faChevronDown,
// } from "@fortawesome/free-solid-svg-icons";
import Select from "../../components/Select.react";
import { useAppSelector } from "../../app/hooks";
// import DropFile from "../../components/DropFile.react";
// import TextArea from "../../components/TextArea.react";
import { cloneDeep, checkEmptyObject } from "../../utils/helpers.utils";
type ActionProps = {
  id: string;
  index: number;
  actions: any[];
  action: string;
  object: string;
  actionparams: any;
  onDelete: (id: string) => void;
  onChangeType: (id: string) => void;
  onChangeAttribute: (id: string, name: string, value: string) => void;
};
import { actionsList } from "./rulesetSlice";
import { isParameterPropertyDeclaration } from "typescript";
const Action = (props: ActionProps) => {
  const {
    actions = [],
    onDelete,
    onChangeType,
    onChangeAttribute,

    id,
    index,
    action,
    object,
    actionparams,
  } = props;

  const [actionState, setActionState] = useState("");
  const [params, setParams] = useState<any>([]);
  const actionslist = useAppSelector(actionsList);
  useEffect(() => {
    if (action && action != "") {
      changeType(action, actionparams);
    }
  }, [action, actionparams]);
  const getTypeForActionParam = (list: any[], paramid: string) => {
    let paramtype = "";
    list.map((item: any) => {
      let itemparams = item.params ? item.params : [];

      itemparams.map((itemparam: any) => {
        if (itemparam.id === paramid) {
          paramtype = itemparam.type;
          return false;
        }
      });
      if (paramtype != "") return false;
    });
    return paramtype;
  };
  const changeType = (actionString: string, actionparams?: any) => {
    setActionState(actionString);
    console.log("actionString ", actionString);
    console.log("OnChangeType: Params: ", params);
    let selectedAction = actions.find((item: any) => {
      return item.id == actionString;
    });
    let paramsArr =
      selectedAction && selectedAction.params ? [...selectedAction.params] : [];
    let paramsStateClone = cloneDeep(params);
    if (actionparams && !checkEmptyObject(actionparams)) {
      let paramsClone: any[] = [];
      paramsArr.map((param: any) => {
        let paramClone = cloneDeep(param);
        let actionParamType = getTypeForActionParam(actionslist, paramClone.id);
        Object.keys(actionparams).map((key: string) => {
          if (actionParamType === "list") {
            if (param.id.toLowerCase() == key) {
              paramClone?.listProps?.[key]?.list_params.map(
                (listparam: any, index: number) => {
                  listparam.value = actionparams[key].list_params[index].value;
                }
              );
            }
          } else if (actionParamType === "dict") {
            if (param.id.toLowerCase() == key) {
              //paramClone.dictProps.dict_params = [...paramClone.dictProps.dict_params,...paramClone.dict_params];
              let paramStateClone = paramsStateClone.find(
                (paramStateClon: any) => {
                  return paramStateClon.id == key;
                }
              );
              let dictParamsClone: any[];
              if (paramStateClone) {
                //Check if the local state is populated, use it
                dictParamsClone = cloneDeep(
                  paramStateClone.dictProps.dict_params
                );
              } else {
                //else build it
                dictParamsClone = cloneDeep(paramClone.dictProps.dict_params);
              }

              dictParamsClone.map((dictparam: any) => {
                let dictParam = paramClone.dict_params.find((param: any) => {
                  return param.name == dictparam.label;
                });
                //dictparam.id = dictParam.id;
                dictparam.type = dictParam.type;
                const dictParamid = dictParam.id;
                if (
                  actionparams[key] &&
                  typeof actionparams[key][dictParamid] !== "undefined"
                )
                  // if(dictparam.id === Object.keys(actionparams[key])[0])
                  dictparam.value = actionparams[key][dictParamid];
              });
              paramClone.dictProps.dict_params = cloneDeep(dictParamsClone);
            }
          } else {
            if (param.id.toLowerCase() == key) {
              paramClone.inputProps = {
                ...paramClone.inputProps,
                ...{ value: actionparams[key] },
              };
            }
          }
        });
        // param = {...param,...paramClone};
        paramsClone.push(paramClone);
      });
      paramsArr = [...paramsClone];
    }
    setParams(paramsArr);
  };
  return (
    <div className="px-4 rounded-lg">
      {
        <>
          <div className="grid grid-cols-4 gap-x-4 mt-1 action-row">
            {/* <div> */}
            <Select
              items={actions}
              value={actionState}
              showBlankOption={true}
              onChange={(value) => {
                changeType(value);
                onChangeType(value);
              }}
              title="Action"
            />

            {params.map((param: any, index: Number) => {
              return (
                <span key={index.toString()}>
                  <GenericInput
                    selectProps={param.selectProps}
                    inputProps={param.inputProps}
                    listProps={param.listProps}
                    dictProps={param.dictProps}
                    type={param.type}
                    onChange={onChangeAttribute}
                  />
                </span>
              );
            })}
          </div>
        </>
      }
    </div>
  );
};

export default Action;
