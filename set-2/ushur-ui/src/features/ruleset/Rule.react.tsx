import React, { useState, useEffect } from "react";
// // @ts-ignore
// import {
//   Button,
//   // @ts-ignore
// } from "@ushurengg/uicomponents";
import Action from "./Action.react";
import Condition from "./Condition.react";
import { uuid, checkEmptyObject } from "../../utils/helpers.utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
type RuleProps = {
  onChangeConditionOperator: (value: string, index: number) => void;
  onChangeConditionAttribute: (
    id: string,
    name: string,
    value: string,
    index: number
  ) => void;
  onChangeConditionAndOr: (value: string, index: number) => void;

  onChangeActionType: (
    value: string,
    index: number,
    actionType: string
  ) => void;
  onChangeActionAttribute: (
    id: string,
    name: string,
    value: string,
    index: number,
    actionType: string
  ) => void;
  ruleJson?: any[];
};
import {
  getMetaInfo,
  conditionsList,
  actionsList,
  typesList,
} from "./rulesetSlice";

const Rule = (props: RuleProps) => {
  const {
    onChangeConditionOperator,
    onChangeConditionAttribute,
    onChangeConditionAndOr,
    onChangeActionType,
    onChangeActionAttribute,
    ruleJson,
  } = props;
  const dispatch = useAppDispatch();
  let typeslist = useAppSelector(typesList);
  let conditionslist = useAppSelector(conditionsList);
  const actionslist = useAppSelector(actionsList);
  const types = useAppSelector(typesList);
  useEffect(() => {
    dispatch(getMetaInfo({}));
    return () => {
      // setSelectedConditions([]);
      // setSelectedActions([]);
      // console.log("Rule unmounts");
    };
  }, []);
  const [selectedConditions, setSelectedConditions] = useState<any>([
    { id: uuid(), type: "", condition: "", andOr: 2 },
    { id: uuid(), type: "", condition: "", andOr: 1 },
  ]);
  const [selectedActions, setSelectedActions] = useState([
    {
      id: uuid(),
      action: "",
      object: "",
      column: "",
      value: "",
      positive: true,
    },
    {
      id: uuid(),
      action: "",
      object: "",
      column: "",
      value: "",
      positive: false,
    },
  ]);
  const andOrList = [
    { label: "And", id: "and" },
    { label: "Or", id: "or" },
  ];
  const getTypeForParam = (list: any[], param: string) => {
    const conditionObj = list.find((item: any) => item.id === param);
    const type = conditionObj && conditionObj.type ? conditionObj.type : "";
    return type;
  };
  useEffect(() => {
    if (ruleJson && !checkEmptyObject(ruleJson)) {
      let selectedConditionsObj: any[] = [];
      let selectedActionsObj: any[] = [];
      if (ruleJson && ruleJson.length > 0 && ruleJson[0].rule) {
        if (
          ruleJson[0].rule.conditions &&
          ruleJson[0].rule.conditions.length > 0 &&
          ruleJson[0].rule.conditions[0].group &&
          ruleJson[0].rule.conditions[0].group.conditions
        ) {
          ruleJson[0].rule.conditions[0].group.conditions.map(
            (conditionitem: any, index: number) => {
              const id =
                selectedConditions &&
                selectedConditions[index] &&
                selectedConditions[index].id
                  ? selectedConditions[index].id
                  : uuid();
              let selectedconditionitem: any = {
                id: id,
                type: getTypeForParam(conditionslist, conditionitem.name),
                condition: conditionitem,
              };
              if (index === 0) {
                if (ruleJson[0].rule.conditions[0].group.type) {
                  selectedconditionitem.andOr =
                    ruleJson[0].rule.conditions[0].group.type;
                }
              }
              selectedConditionsObj.push(selectedconditionitem);
            }
          );
          setSelectedConditions(selectedConditionsObj);
        }

        if (ruleJson[0].rule.action) {
          const actionName = ruleJson[0].rule.action.name;
          const params = ruleJson[0].rule.action.params;
          let actionObj = selectedActions.find((action: any) => {
            return action.positive === true;
          });
          const id = actionObj && actionObj.id ? actionObj.id : uuid();
          let selectedactionitem: any = {
            id: id,
            action: actionName,
            object: "",
            params: params,
            positive: true,
          };
          selectedActionsObj.push(selectedactionitem);
        }
        if (ruleJson[0].rule.other_action) {
          const actionName = ruleJson[0].rule.other_action.name;
          const params = ruleJson[0].rule.other_action.params;
          let otherActionObj = selectedActions.find((action: any) => {
            return action.positive === false;
          });
          const id =
            otherActionObj && otherActionObj.id ? otherActionObj.id : uuid();
          let selectedactionitem: any = {
            id: id,
            action: actionName,
            object: "",
            params: params,
            positive: false,
          };
          selectedActionsObj.push(selectedactionitem);
        }
        setSelectedActions(selectedActionsObj);
      }
    }
  }, [ruleJson]);

  return (
    <div className="mt-3 px-2 grid grid-cols">
      <div>
        <p className="text-lg font-semibold">Condition</p>
        <p className="text-sm">
          Construct your conditional using the fields below. Based on the shape
          of your conditional, you will have If, ElseIf, and Else outcomes
          available for triggering actions.
        </p>
        <div className="conditional-section">
          <div className="c-header">Conditional</div>
          <div className="c-body">
            {selectedConditions.map((condition: any, index: number) => {
              return (
                <Condition
                  types={typeslist}
                  operators={conditionslist}
                  andOrList={andOrList}
                  condandOr={condition.andOr}
                  condtype={condition.type}
                  condobj={condition.condition}
                  key={condition.id}
                  id={condition.id}
                  index={index}
                  conditions={selectedConditions}
                  onChangeOperator={(value: string) => {
                    onChangeConditionOperator(value, index);
                  }}
                  onChangeAttribute={(
                    id: string,
                    name: string,
                    value: string
                  ) => {
                    onChangeConditionAttribute(id, name, value, index);
                  }}
                  onChangeAndOr={(value: string) => {
                    onChangeConditionAndOr(value, index);
                  }}
                  onDelete={(id: string) =>
                    setSelectedConditions(
                      selectedConditions.filter(
                        (condition: any) => condition.id !== id
                      )
                    )
                  }
                />
              );
            })}
          </div>
        </div>
        <p className="text-lg font-semibold mt-4">Actions</p>
        <p className="text-sm">
          Define what actions to perform based on the conditional outcomes
          below.
        </p>
        <div className="conditional-section true-section">
          <div className="c-header">If true...</div>
          <div className="c-body">
            {selectedActions
              .filter((action: any) => action.positive === true)
              .map((action: any, index: number) => {
                return (
                  <Action
                    actions={actionslist}
                    action={action.action}
                    object={action.object}
                    actionparams={action.params}
                    key={action.id}
                    id={action.id}
                    index={index}
                    onDelete={(id: string) =>
                      setSelectedActions(
                        selectedActions.filter(
                          (action: any) =>
                            action.id !== id && action.positive === true
                        )
                      )
                    }
                    onChangeType={(value: string) => {
                      onChangeActionType(value, index, "action");
                    }}
                    onChangeAttribute={(
                      id: string,
                      name: string,
                      value: string
                    ) => {
                      onChangeActionAttribute(id, name, value, index, "action");
                    }}
                  />
                );
              })}
          </div>
        </div>
        <div className="conditional-section false-section mt-4">
          <div className="c-header">If false...</div>
          <div className="c-body">
            {selectedActions
              .filter((action: any) => action.positive === false)
              .map((action: any, index: number) => {
                return (
                  <Action
                    actions={actionslist}
                    action={action.action}
                    object={action.object}
                    actionparams={action.params}
                    key={action.id}
                    id={action.id}
                    index={index}
                    onDelete={(id: string) =>
                      setSelectedActions(
                        selectedActions.filter(
                          (action: any) =>
                            action.id !== id && action.positive === false
                        )
                      )
                    }
                    onChangeType={(value: string) => {
                      onChangeActionType(value, index, "other_action");
                    }}
                    onChangeAttribute={(
                      id: string,
                      name: string,
                      value: string
                    ) => {
                      onChangeActionAttribute(
                        id,
                        name,
                        value,
                        index,
                        "other_action"
                      );
                    }}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rule;
