import React, { useState, useEffect } from "react";
import "./CreateConditionModal.css";
import { getParamIdObj } from "../../utils/helpers.utils";
//@ts-ignore
import { Modal } from "@ushurengg/uicomponents";

import {
  updateRuleset,
  rulesList,
  setRulesList,
  conditionsList,
  actionsList,
} from "./rulesetSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Rule from "./Rule.react";
import { checkEmptyObject, cloneDeep } from "../../utils/helpers.utils";
import { actions, ruleJsonReducer } from "./ruleJsonReducer";
type CreateModalProps = {
  open: boolean;
  onClose: any;
  rulesetid?: string;
  ruleJsonProp?: any[];
  ruleid?: string;
};

const CreateConditionModal = (props: CreateModalProps) => {
  const dispatch = useAppDispatch();
  let list = useAppSelector(rulesList);
  const conditionslist = useAppSelector(conditionsList);
  const actionslist = useAppSelector(actionsList);
  const { open, onClose, rulesetid, ruleJsonProp, ruleid } = props;
  const [ruleJson, setRuleJson] = useState<any>([]);
  const [isSuccess, setSuccess] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  useEffect(() => {
    if (ruleJsonProp) setRuleJson(ruleJsonProp);
  }, ruleJsonProp);

  const onConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    if (ruleid != null) {
      let listClone: any[] = [];
      listClone = list.filter((item: any) => item.rule.ruleid != ruleid);

      dispatch(setRulesList(listClone));
      onClose();
      dispatch(
        updateRuleset({ rulesetId: rulesetid, ruleJson: listClone })
      ).then(() => {
        setRuleJson([]);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose("Success");
        }, 2000);
      });
    }
  };

  const Confirm = () => {
    return (
      <Modal
        className="delete-confirmation-modal"
        onHide={() => setShowDeleteConfirmation(false)}
        size="lg"
        title="Delete Rule?"
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
              Are you sure you want to delete this Rule?{" "}
            </p>
          </div>
        </div>
      </Modal>
    );
  };
  const getConditionParamId = (paramname: string) => {
    let paramid = "";
    conditionslist.map((condition: any) => {
      condition.params.map((param: any) => {
        if (param.name == paramname) {
          paramid = param.id;
          return false;
        }
      });
      if (paramid !== "") return false;
    });
    return paramid;
  };
  const onChangeCondition = (
    id: string,
    name: string,
    value: any,
    index: number
  ) => {
    let ruleJsonObj = cloneDeep(ruleJson);
    let reducerAction = {
      type: actions.updateCondition,
      payload: {
        param: {},
        name: "", // Name of Condition
        type: "", // andOr
        index: index,
      },
    };
    if (name == "andor") {
      reducerAction.payload.type = value;
    } else {
      if (name == "name") {
        reducerAction.payload.name = value;
      } else {
        let paramid: string = getConditionParamId(name);
        let param: any = {};
        param[paramid] = value;
        reducerAction.payload.param = param;
      }
    }
    ruleJsonObj = ruleJsonReducer(ruleJsonObj, reducerAction);
    setRuleJson(ruleJsonObj);
  };

  // const getActionParamType = ((actionId:string, paramId:string)=>{
  //   const actionslist = useAppSelector(actionsList);
  //   let actionObject = actionslist.find((action:any)=>action.id==actionId);
  //   let paramObject = actionObject.find((param:any)=>param.id==paramId);
  //   return paramObject.type;
  // })

  //To get paramid from name
  const getActionParamDetails = (id: string) => {
    const paramIdObj = getParamIdObj(id);

    const paramparentid = paramIdObj.parentparamid;
    const paramid = paramIdObj.paramid;

    let paramType: string = "";
    let retObj = {};
    for (const action of actionslist) {
      for (const param of action.params) {
        paramType = param.type;
        if (param.type === "list") {
          if (param.id == paramparentid) {
            for (const listparam of param.list_params) {
              if (listparam.id === paramid) {
                retObj = {
                  paramType: paramType,
                };
                return retObj;
              }
            }
          }
        } else if (param.type === "dict") {
          if (param.id == paramparentid) {
            for (const dictparam of param.dict_params) {
              if (dictparam.id === paramid) {
                retObj = {
                  paramType: paramType,
                };
                return retObj;
              }
            }
          }
        } else {
          if (param.id == paramid) {
            retObj = {
              paramType: paramType,
            };
            return retObj;
          }
        }
      }
    }
    return retObj;
  };
  const onChangeAction = (
    id: string,
    name: string,
    value: string,
    index: number,
    actionType: string
  ) => {
    let ruleJsonObj = cloneDeep(ruleJson);
    let reducerAction = {
      type: actions.updateAction,
      payload: {
        param: {},
        name: "", // Name of Action
        type: actionType,
      },
    };
    if (name == "name") {
      reducerAction.payload.name = value;
    } else {
      const paramObj: any = getActionParamDetails(id);

      const paramIdObj = getParamIdObj(id);

      const paramparentid = paramIdObj.parentparamid;
      const paramid = paramIdObj.paramid;
      const paramtype = paramObj.paramType;

      let param: any = {};
      //Create the correct object for list/dict type params
      if (paramtype === "list") {
        let valueObj = {
          type: paramtype,
          list_params: [
            {
              value: value,
            },
          ],
        };
        param[paramparentid] = { ...valueObj };
      } else if (paramtype === "dict") {
        let paramObj: any = {};
        let paramChildObj: any = {};
        paramChildObj[paramid] = value;
        paramObj[paramparentid] = paramChildObj;
        // paramObj.type = paramtype;
        // let valueObj = {
        //   type:paramtype,
        //   agg_dict:[
        //     paramObj
        //   ]
        // }

        param = { ...paramObj };
      } else param[paramid] = value;
      reducerAction.payload.param = param;
    }
    ruleJsonObj = ruleJsonReducer(ruleJsonObj, reducerAction);
    setRuleJson(ruleJsonObj);
  };
  const cleanUpActionParams = (action: any) => {
    if (!action.name || action.name == "") return action;
    let actionname = action.name;

    Object.keys(action.params).map((actionparamkey: any) => {
      let actionObj = actionslist.find((action: any) => {
        return action.id == actionname;
      });

      let actionParamObj: any = actionObj.params.find((actionParam: any) => {
        return actionParam.id == actionparamkey;
      });

      if (actionParamObj == null) {
        // if action not found in catalog
        delete action.params[actionparamkey];
      }
    });
    return action;
  };
  const cleanUpParams = (ruleJson: any) => {
    let rule = cloneDeep(ruleJson.rule);
    if (!rule || checkEmptyObject(rule)) {
      return ruleJson;
    }
    //Clean up Conditions
    let conditions = rule.conditions;
    conditions.map((condition: any) => {
      let group = condition.group;
      group.conditions.map((condition2: any) => {
        let name = condition2.name;
        let conditionObj = conditionslist.find((conditionLookupObj: any) => {
          return name == conditionLookupObj.id;
        });
        Object.keys(condition2.params).map((key: string) => {
          let matchingparam = conditionObj.params.find((paramlookup: any) => {
            return paramlookup.id == key;
          });
          if (matchingparam == null) {
            //param not found in the catalog
            delete condition2.params[key];
          }
        });
      });
    });
    //Clean up Actions
    let action = rule.action;
    action = cleanUpActionParams(action);
    rule.action = action;

    let other_action = rule.other_action;
    other_action = cleanUpActionParams(other_action);
    rule.other_action = other_action;

    ruleJson.rule = rule;
    return ruleJson;
  };
  const onSubmit = () => {
    if (ruleid != null && ruleid != "") {
      let listClone: any[] = [];
      // let listCloneItem:any = listClone.find((rule:any)=>rule.id===ruleid);
      list
        //.filter((rule:any) => rule.ruleid == ruleid)
        .map((rule: any) => {
          if (rule && rule.rule && rule.rule.ruleid == ruleid) {
            rule = cloneDeep(ruleJson[0]);
            //Remove all the non-required params. Say, if the user changes condition operator from == to exists. the second operand should be removed
            rule = cleanUpParams(rule);
          }
          listClone.push(rule);
        });
      // listCloneItem = cloneDeep(ruleJson[0]);
      // listClone = [...listClone,...[listCloneItem]];
      dispatch(setRulesList(listClone));
      dispatch(
        updateRuleset({ rulesetId: rulesetid, ruleJson: listClone })
      ).then(() => {
        setSuccess(true);
        setRuleJson([]);
        setTimeout(() => {
          setSuccess(false);
          onClose("Success");
        }, 2000);
      });
    } else {
      list = [...list, ...ruleJson];
      console.log("Updated Rules List: ", list);
      dispatch(setRulesList(list));
      dispatch(updateRuleset({ rulesetId: rulesetid, ruleJson: list })).then(
        () => {
          setSuccess(true);
          setRuleJson([]);
          setTimeout(() => {
            setSuccess(false);
            onClose("Success");
          }, 2000);
        }
      );
    }

    setSuccess(true);
    onClose();
  };
  const onCancel = () => {
    setRuleJson([]);
    onClose();
  };
  const onDelete = () => {
    setShowDeleteConfirmation(true);
  };
  let modalActions: any[] = [];
  if (ruleid) {
    modalActions.push({
      onClick: () => {
        onDelete();
      },
      text: "",
      type: "toggle",
      actionType: "destructive",
      startIcon: <i className="bi bi-trash"></i>,
      className: "delete-variable-btn",
    });
  }
  modalActions.push({
    onClick: onSubmit,
    text: "Save Changes",
    type: "primary",
  });
  return (
    <>
      <Modal
        actions={modalActions}
        className="new-modal"
        onHide={onCancel}
        title="Create Condition"
        showModal={open}
      >
        <Confirm />
        <Rule
          ruleJson={ruleJson}
          onChangeConditionOperator={(value, index) => {
            onChangeCondition("", "name", value, index);
          }}
          onChangeConditionAttribute={(id, name, value, index) => {
            onChangeCondition(id, name, value, index);
          }}
          onChangeConditionAndOr={(value, index) => {
            onChangeCondition("", "andor", value, index);
          }}
          onChangeActionType={(value, index, actionType) => {
            onChangeAction("", "name", value, index, actionType);
          }}
          onChangeActionAttribute={(id, name, value, index, actionType) => {
            onChangeAction(id, name, value, index, actionType);
          }}
        />

        <div style={{ marginTop: 20 }} />
      </Modal>
    </>
  );
};

export default CreateConditionModal;
