import {
  cloneDeep,
  checkEmptyObject,
  checkEmptyArrayObj,
} from "../../utils/helpers.utils";
export const actions = {
  updateCondition: "updateCondition",
  updateAction: "updateaction",
  loadRuleJson: "loadRuleJson",
};
const initialState: any = [
  {
    rule: {
      action: {
        name: "",
        params: {},
      },
      other_action: {
        name: "",
        params: {},
      },
      conditions: [
        {
          group: {
            conditions: [
              {
                name: "",
                params: {},
              },
              {
                name: "",
                params: {},
              },
            ],
          },
        },
      ],
    },
  },
];
const listActionParam: any = {
  name: "Select based on group of columns",
  id: "group_cols",
  type: "list",
  list_params: [
    {
      name: "column list",
      id: "col",
      type: "text",
    },
  ],
};

export const ruleJsonReducer = (state = initialState, action: any) => {
  if (checkEmptyArrayObj(state)) state = initialState;
  let param: any = {};
  let type: string = "";
  let name: string = "";
  // const actionslist = useAppSelector(actionsList);
  switch (action.type) {
    case actions.updateCondition:
      param = action.payload.param || {};
      name = action.payload.name || "";
      type = action.payload.type || "";
      let index = action.payload.index;
      state.map((ruleItem: any) => {
        let rule = ruleItem.rule;
        if (rule && rule.conditions) {
          rule.conditions.map((condition: any) => {
            if (type != "") {
              condition.group = { ...condition.group, ...{ type: type } };
            }
            condition.group.conditions.map(
              (condition2: any, counter: number) => {
                if (counter === index) {
                  if (!checkEmptyObject(param)) {
                    condition2.params = { ...condition2.params, ...param };
                  }
                  if (name != "") {
                    condition2.name = name;
                  }
                }
              }
            );
          });
        }
      });
      return state;
    case actions.updateAction:
      param = action.payload.param || {};
      type = action.payload.type || "";
      name = action.payload.name || "";
      state.map((ruleItem: any) => {
        let rule = ruleItem.rule;
        if (rule) {
          let actionObj: any = {};
          if (type == "action") actionObj = rule.action;
          else if (type == "other_action") actionObj = rule.other_action;
          if (name != "") {
            actionObj.name = name;
          }
          if (!checkEmptyObject(param)) {
            //Need to work on Dict Rules here
            let dictParam = Object.keys(actionObj.params).find((key: string) =>
              key.endsWith("_dict")
            ); //check if there is a dictionary parameter
            if (dictParam && dictParam in param) {
              actionObj.params[dictParam] = {
                ...actionObj.params[dictParam],
                ...param[dictParam],
              };
            } else {
              actionObj.params = { ...actionObj.params, ...param };
            }
          }
        }
      });
      return state;
    case actions.loadRuleJson:
      let stateObj = cloneDeep(initialState);
      stateObj.map((rule: any) => {
        let ruleObj = rule.rule;
        if (state && state.rule && state.rule.action) {
          ruleObj.action = {
            ...ruleObj.action,
            ...state.rule.action,
          };
          let transformedAction: any = transformActionGet(ruleObj.action);
          ruleObj.action = { ...ruleObj.action, ...transformedAction };
        }
        if (state && state.rule && state.rule.other_action) {
          ruleObj.other_action = {
            ...ruleObj.other_action,
            ...state.rule.other_action,
          };
          let transformedOtherAction: any = transformActionGet(
            ruleObj.other_action
          );
          ruleObj.other_action = {
            ...ruleObj.other_action,
            ...transformedOtherAction,
          };
        }
        ruleObj.conditions.map((condition: any, index: number) => {
          let condObj = state.rule.conditions[index]; // condition object from API

          condition.group.type = condObj.group.type ?? "";
          condition.group.conditions.map((condition2: any, index2: number) => {
            let condObj2 = condObj.group.conditions[index2];
            if (!!condObj2 && !checkEmptyObject(condObj2)) {
              condition2.name = condObj2.name;
              condition2.params = { ...condition2.params, ...condObj2.params };
            }
          });
        });
      });
      return stateObj[0];
    default:
      return state;
  }
};

const getActionParamType = (param: any, paramname: string) => {
  if (paramname.endsWith("_dict")) return "dict";
  if (Object.prototype.toString.call(param) === "[object Array]") {
    return "list";
  }
  return "text";
  // const actionslist = useAppSelector(actionsList);
  // let actionObject = actionslist.find((action:any)=>action.id==actionId);
  // let paramObject = actionObject.find((param:any)=>param.id==paramId);
  // return paramObject.type;
};

const transformActionGet = (action: any) => {
  let actionOutput = cloneDeep(action);
  // let params = cloneDeep(action.params);
  // let resultObj:any[] = [];
  Object.keys(actionOutput.params).map((param: any) => {
    const paramType = getActionParamType(actionOutput.params[param], param);
    if (paramType == "list") {
      let value = actionOutput.params[param].join(",");
      let listActionParamClone = cloneDeep(listActionParam);
      //listActionParamClone.map((param:any) => {
      listActionParamClone.list_params.map((list_param: any) => {
        list_param.value = value;
      });
      //})
      // listActionParamClone.value=value;
      actionOutput.params[param] = listActionParamClone;
    } else if (paramType == "dict") {
      let value = actionOutput.params[param][0];
      actionOutput.params[param] = value;
    }
  });
  return actionOutput;
};
