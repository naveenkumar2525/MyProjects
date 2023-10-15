import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import moment from "moment";
import { useParams } from "react-router-dom";
import { cloneDeep } from "../../utils/helpers.utils";
import { RootState, AppThunk } from "../../app/store";
import {
  //   createShortLinkForFileRequest,
  createRulesetRequest,
  updateRulesetRequest,
  deleteRulesetRequest,
  getRulesetsListRequest,
  getRulesListRequest,
  getMetaInfoRequest,
} from "./rulesetAPI";
import { actions, ruleJsonReducer } from "./ruleJsonReducer";
import { uuid } from "../../utils/helpers.utils";
import { isArray } from "lodash";
export interface RulesetState {
  list: any;
  name: string;
  description: string;
  visited_data: any;
  searchText: string;
  createResponse: any;
  updateResponse: any;
  deleteResponse: any;
  status: "idle" | "loading" | "failed";
  isAutoRefresh: boolean;
  dataRefreshState: "idle" | "refreshed" | "loading" | "failed";
  conditionsList: any;
  actionsList: any;
  typesList: any;
}

const initialState: RulesetState = {
  list: [],
  name: "",
  description: "",
  visited_data: [],
  createResponse: null,
  updateResponse: null,
  deleteResponse: null,
  searchText: "",
  status: "idle",
  isAutoRefresh: false,
  dataRefreshState: "idle",
  conditionsList: [],
  actionsList: [],
  typesList: [],
};

const SLICE_NAME = "Ruleset";

export const getRulesetsList = createAsyncThunk(
  `${SLICE_NAME}/getRulesetsList`,
  async (payload: any) => {
    const response = await getRulesetsListRequest();
    const results = response?.ruleSetList ?? [];

    return results;
  }
);

export const getRulesList = createAsyncThunk(
  `${SLICE_NAME}/getRulesList`,
  async (payload: any) => {
    const { id } = payload;
    const response = await getRulesListRequest(id);
    const results = response?.ruleset ?? [];

    console.log("RESULTS: ", results);
    return results;
  }
);

export const getMetaInfo = createAsyncThunk(
  `${SLICE_NAME}/getMetaInfo`,
  async (payload: any) => {
    const response = await getMetaInfoRequest();
    //Create object to be sent to the UI
    const results = response ? response : {};

    return results;
  }
);

export const createRuleset = createAsyncThunk(
  `${SLICE_NAME}/createRuleset`,
  async (payload: any) => {
    const ruleset = payload;
    const response = await createRulesetRequest(ruleset);
    return response;
  }
);

export const deleteRuleset = createAsyncThunk(
  `${SLICE_NAME}/deleteRuleset`,
  async (payload: any) => {
    const rulesetid = payload;
    const response = await deleteRulesetRequest(rulesetid);
    return response;
  }
);
const transformActionJson = (action: any) => {
  Object.keys(action.params).map((paramname: string) => {
    // get param type on the basis of action and paramid
    let param = action.params[paramname];
    let paramType = param.type;
    if (paramType == "list") {
      //If the paramtype is a list, split it by ','
      let arrvalue = param.list_params[0].value.split(","); // this is temp. Once we get into multipe textboxes for list type, we will have to use looping instead of index 0
      action.params[paramname] = arrvalue;
    }
    if (!isArray(param) && paramname.endsWith("_dict")) {
      const arrVal = [param]; //Convert to Array while saving to API
      action.params[paramname] = arrVal;
    }
  });
  return action;
};
export const updateRuleset = createAsyncThunk(
  `${SLICE_NAME}/updateRuleset`,
  async (payload: any) => {
    //TODO: transform actions for save
    //let ruleset = {...payload};

    let ruleset = cloneDeep(payload);
    if (ruleset.ruleJson) {
      ruleset.ruleJson.map((ruleItem: any) => {
        let ruleObj = ruleItem.rule;
        if (ruleObj.ruleid) delete ruleObj.ruleid;
        ruleObj.conditions.map((condition: any) => {
          let conditionClone = condition.group.conditions.filter(
            (condition2: any) => {
              return condition2.name != "";
            }
          );
          condition.group.conditions = conditionClone;
        });

        if (
          ruleObj.action.name === "" ||
          ruleObj.action.name.toLowerCase() === "none"
        ) {
          delete ruleObj.action;
        } else {
          let actionObject = cloneDeep(ruleObj.action);
          actionObject = transformActionJson(actionObject);
          ruleObj.action = actionObject;
          // Object.keys(ruleObj.action.params).map((paramname: string) => {
          //   // get param type on the basis of action and paramid
          //   let param = ruleObj.action.params[paramname];
          //   let paramType = param.type;
          //   if (paramType == "list") {
          //     //If the paramtype is a list, split it by ','
          //     let arrvalue = param.list_params[0].value.split(","); // this is temp. Once we get into multipe textboxes for list type, we will have to use looping instead of index 0
          //     ruleObj.action.params[paramname] = arrvalue;
          //   }
          //   if (paramname.endsWith("_dict")) {
          //     const arrVal=[param];//Convert to Array while saving to API
          //     ruleObj.action.params[paramname] = arrVal;
          //   }
          // });
        }
        if (
          ruleObj.other_action.name === "" ||
          ruleObj.other_action.name.toLowerCase() === "none"
        ) {
          delete ruleObj.other_action;
        } else {
          let otherActionObject = cloneDeep(ruleObj.other_action);
          otherActionObject = transformActionJson(otherActionObject);
          ruleObj.other_action = otherActionObject;
        }
      });
    }

    // if(ruleset.ruleJson){
    //   ruleset.ruleJson.map((ruleItem:any)=>{
    //     try{
    //       let ruleItemClone:any={};
    //       ruleItemClone = {...ruleItemClone,...ruleItem};
    //       let actionparams = (ruleItem && ruleItem.rule && ruleItem.rule.action && ruleItem.rule.action.params) ? ruleItem.rule.action.params:{};
    //       if(actionparams && actionparams != {} && Object.keys(actionparams).length>0){
    //         console.log("PARAMS Before: ", actionparams);
    //         actionparams = actionTransformer(false,actionparams);
    //         console.log("PARAMS After: ", actionparams);
    //         //ruleItemClone={rule:{action:{}}};
    //         // ruleItemClone.rule.action.params=actionparams;
    //         ruleItemClone.rule.action={...ruleItemClone.rule.action,...{params:actionparams}};
    //       }

    //       let otheractionparams = (ruleItem && ruleItem.rule && ruleItem.rule.other_action && ruleItem.rule.other_action.params) ? ruleItem.rule.other_action.params:{};
    //       if(otheractionparams && otheractionparams != {} && Object.keys(otheractionparams).length>0){
    //         console.log("Other PARAMS Before: ", otheractionparams);
    //         otheractionparams = actionTransformer(false,otheractionparams);
    //         console.log("Other PARAMS After: ", otheractionparams);
    //         //ruleItemClone={rule:{other_action:{}}};
    //         ruleItemClone.rule.other_action={...ruleItemClone.rule.other_action,...{params:otheractionparams}};
    //       }
    //       ruleItem={...ruleItem,...ruleItemClone};
    //     }catch(e:any){
    //       debugger
    //     }

    //   });
    // }
    const response = await updateRulesetRequest(ruleset);
    return response;
  }
);

// const actionTransformer = (isGet:Boolean,actionJson:any) => {
//   let output:any = {};
//   let key:string,value:string="";
//   if(isGet){
//     key = Object.keys(actionJson)[0];
//     value = actionJson[key];
//     output.column = key;
//     output.value = value;
//   }else{
//     key = actionJson.column;
//     value = actionJson.value;
//     output[key]=value;
//   }
//   return output;
// }

export const RulesetSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAutoRefreshOn: (state) => {
      state.isAutoRefresh = true;
    },
    setAutoRefreshOff: (state) => {
      state.isAutoRefresh = false;
    },
    setDataRefreshState: (state, action) => {
      state.dataRefreshState = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setRulesList: (state, action) => {
      state.list = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRulesList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRulesList.fulfilled, (state, action) => {
        state.status = "idle";
        state.dataRefreshState = "refreshed";
        //state.list = action.payload.ruleJson ?? [];
        state.name = action.payload.rulesetName ?? "";
        state.description = action.payload.description ?? "";
        let listClone = action.payload.ruleJson ?? [];
        let listArr: any[] = [];
        // let actionslist1 = state.actionsList;
        //const actionslist = (state: RootState) => state.ruleset.actionsList;

        // const actionslist2 = createSelector(actionslist1, (lis) => {
        //   console.log({ lis });
        //   return lis;
        //   // return lis.map((item: any) => ({
        //   //   ...item
        //   // }));
        // });

        // console.log("ActionsList: ", actionslist);
        // console.log("ActionsList1: ", actionslist1);
        // console.log("ActionsList2: ", actionslist2);
        listClone.map((rule: any) => {
          let reducerAction = {
            type: actions.loadRuleJson,
            payload: {},
          };
          let ruleObj = cloneDeep(ruleJsonReducer(rule, reducerAction));
          ruleObj.rule.ruleid = uuid();
          listArr.push(ruleObj);
          //rule = cloneDeep(ruleObj);
        });
        state.list = listArr ?? [];
        console.log("state.list: ", state.list);
      });
    builder
      .addCase(getRulesetsList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRulesetsList.fulfilled, (state, action) => {
        state.status = "idle";
        state.dataRefreshState = "refreshed";
        state.list = action.payload ?? [];
      });
    builder
      .addCase(getMetaInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMetaInfo.fulfilled, (state, action) => {
        state.status = "idle";
        state.dataRefreshState = "refreshed";
        state.conditionsList = action.payload.conditions ?? [];
        state.actionsList = action.payload.actions ?? [];
        state.typesList = action.payload.types ?? [];

        let typesList = [...state.typesList];
        typesList.map((type) => {
          let defaultParams = type.defaultParams ? type.defaultParams : [];
          defaultParams.map((defaultParam: any) => {
            if (defaultParam.type == "text") {
              let inputProps = {
                label: defaultParam.name,
                id: defaultParam.id,
                // helperText:defaultParam.name
              };
              defaultParam.inputProps = inputProps;
              defaultParam.selectProps = {};
            } else if (defaultParam.type == "select") {
              let selectProps = {
                title: defaultParam.name,
                value: "",
                items: [], //TODO:This would require a dynamic value
                showBlankOption: true,
              };
              defaultParam.selectProps = selectProps;
              defaultParam.inputProps = {};
            }
          });
        });

        let conditionsList = [...state.conditionsList];
        conditionsList.map((condition: any) => {
          condition.params.map((param: any) => {
            if (param.type == "text") {
              let inputProps = {
                label: param.name,
                id: param.id,
                // helperText:param.name,
                // value:"",
              };
              param.inputProps = inputProps;
              param.selectProps = {};
            } else if (param.type == "select") {
              let selectProps = {
                title: param.name,
                value: "",
                items: [], //TODO:This would require a dynamic value
                showBlankOption: true,
              };
              param.selectProps = selectProps;
              param.inputProps = {};
            }
          });
        });
        //console.log(conditionsList[0].params[0]);
        state.conditionsList = conditionsList;

        let actionsList = [...state.actionsList];
        actionsList.map((action: any) => {
          action.params.map((param: any) => {
            //if(param.type == "dict") param.type="text";
            if (param.type == "text") {
              let inputProps = {
                label: param.name,
                id: param.id,
                // helperText:param.name,
                // value:"",
              };
              param.inputProps = inputProps;
              param.selectProps = {};
            } else if (param.type == "select") {
              let selectProps = {
                title: param.name,
                id: param.id,
                value: "",
                items: [], //TODO:This would require a dynamic value
                showBlankOption: true,
              };
              param.selectProps = selectProps;
              param.inputProps = {};
            } else if (param.type == "list") {
              let listParams: any[] = [];
              param.list_params.map((listparam: any) => {
                let prop = {
                  label: listparam.name,
                  id: param.id + "." + listparam.id,
                  // helperText:listparam.name
                };
                listParams.push(prop);
              });

              param.selectProps = {};
              param.inputProps = {};
              param.listProps = {};
              param.listProps[param.id] = {};
              param.listProps[param.id].list_params = listParams;
            } else if (param.type == "dict") {
              let dictParams: any[] = [];
              param.dict_params.map((dictparam: any) => {
                let prop = {
                  label: dictparam.name,
                  id: param.id + "." + dictparam.id,
                  // helperText:dictparam.name
                };
                dictParams.push(prop);
              });

              param.selectProps = {};
              param.inputProps = {};
              param.listProps = {};
              param.dictProps = {};
              param.dictProps.dict_params = dictParams;
            }
          });
        });
        state.actionsList = actionsList;
      });

    builder
      .addCase(createRuleset.pending, (state) => {
        state.createResponse = null;
        state.status = "loading";
      })
      .addCase(createRuleset.fulfilled, (state, action) => {
        state.status = "idle";
        state.createResponse = action.payload ?? {};
      });

    builder
      .addCase(updateRuleset.pending, (state) => {
        state.updateResponse = null;
        state.status = "loading";
      })
      .addCase(updateRuleset.fulfilled, (state, action) => {
        state.status = "idle";
        state.updateResponse = action.payload ?? {};
      });

    builder
      .addCase(deleteRuleset.pending, (state) => {
        state.deleteResponse = null;
        state.status = "loading";
      })
      .addCase(deleteRuleset.fulfilled, (state, action) => {
        state.status = "idle";
        state.deleteResponse = action.payload ?? {};
      });
  },
});

export const {
  setAutoRefreshOff,
  setAutoRefreshOn,
  setDataRefreshState,
  setSearchText,
  setRulesList,
  setName,
  setDescription,
} = RulesetSlice.actions;

export const rulesList = (state: RootState) =>
  state.ruleset.list.map((item: any) => ({
    ...item,
    // urlOrFile: item.isAssetUrl ? item.assetName : item.longUrl,
    // tags: item?.tags?.join(", ") ?? "",
    // createdTimestamp: moment(new Date(item.createdTimestamp)).format("LL"),
    // visitedTimestamp: moment(new Date(item.visitedTimestamp)).format("LL"),
  }));
export const name = (state: RootState) => state.ruleset.name;
export const description = (state: RootState) => state.ruleset.description;
// export const conditionsList = (state: RootState) =>
// state.ruleset.conditions.map((item: any) => ({
//   ...item
// }));

// export const actionsList = (state: RootState) =>
// state.ruleset.actions.map((item: any) => ({
//   ...item
// }));
// export const addRuleToList = (state: RootState) => {
//   state.ruleset.list
// }
export const conditionsList = (state: RootState) =>
  state.ruleset.conditionsList;
export const actionsList = (state: RootState) => state.ruleset.actionsList;
export const typesList = (state: RootState) => state.ruleset.typesList;
export const isAutoRefresh = (state: RootState) => state.ruleset.isAutoRefresh;
export const dataRefreshState = (state: RootState) =>
  state.ruleset.dataRefreshState;
export const searchText = (state: RootState) => state.ruleset.searchText;
export const createResponse = (state: RootState) =>
  state.ruleset.createResponse;

export default RulesetSlice.reducer;
