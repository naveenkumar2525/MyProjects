import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./ConditionsDatatable.css";
import {
  createResponse,
  getMetaInfo,
  getRulesList,
  searchText,
  rulesList,
  conditionsList,
  actionsList,
} from "./rulesetSlice";
// @ts-ignore
import {
  Table,
  Link,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import CreateConditionModal from "./CreateConditionModal.react";
import { AnyArray } from "immer/dist/internal";
import { isArray, isEmpty } from "lodash";

let metaConditionsList: any[] = [];
let metaActionsList: any[] = [];

type ConditionsDatatableProps = {
  id?: string;
};
const DataTable = (props: ConditionsDatatableProps) => {
  const { id } = props;
  const list = useAppSelector(rulesList);
  metaConditionsList = useAppSelector(conditionsList);
  metaActionsList = useAppSelector(actionsList);
  const createResp = useAppSelector(createResponse);
  const text = useAppSelector(searchText);
  const dispatch = useAppDispatch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogJson, setCreateDialogJson] = useState([{}]);
  const [ruleId, setRuleId] = useState("");
  const flatten = (action:any,obj: any, prefix: AnyArray = [], current: any = {}) => {
    let isRecur:boolean = (isEmpty(action))
    if (typeof obj === "object" && !isArray(obj) && obj !== null) {
      for (const key of Object.keys(obj)) {
        if(key !== "id" && (key !== "type" || !isRecur) && (obj.type != "list" || key != "name")) //No need to show id, type for all types and name for list type fields
          flatten(null,obj[key], prefix.concat(key), current);
      }
    } else if (isArray(obj)){
      
      let objClone:any = {...obj[0]};
      delete objClone.type;
      delete objClone.id;
      current[prefix[prefix.length-1]] = objClone;
    }else{
      current[prefix[prefix.length-1]] = obj;
    }
    return current;
  };
  const handleRowClick = (e: any, row: any, index: any) => {
    let arrayRow: any[] = [];
    arrayRow.push(row);
    setRuleId(row.rule.ruleid);
    setCreateDialogJson(arrayRow);
    setCreateDialogOpen(true);
  };
  const actionFormatter = (
    cell: any,
    row: any,
    rowIndex: Number,
    formatExtraData: AnyArray
  ) => {
    let action = cell.action ? cell.action : {};
    let other_action = cell.other_action ? cell.other_action : {};
    let actionString = "";
    let conditionTrueString = "";
    let conditionFalseString = "";
    if (action.name && action.name.toLowerCase() != "none") {
      conditionTrueString += "<div>";
      conditionTrueString += `<span class="actionhighlighter green">if True:</span> `;
      let actionObj = metaActionsList.find((metaAction: any) => {
        return metaAction.id == action.name;
      });
      let actionName = actionObj != null ? actionObj.label : "";
      conditionTrueString += "Action: " + actionName;
      conditionTrueString +=
        " Params: " + JSON.stringify(flatten(action,action.params));
      conditionTrueString += "</div>";
    }

    if (other_action.name && other_action.name.toLowerCase() != "none") {
      conditionTrueString += "<div>";
      conditionFalseString += `<span class="actionhighlighter red">if False:</span> `;
      let otherActionObj = metaActionsList.find((metaAction: any) => {
        return metaAction.id == other_action.name;
      });
      let actionName = otherActionObj != null ? otherActionObj.label : "";
      conditionFalseString += "Action: " + actionName;
      conditionFalseString +=
        " Params: " + JSON.stringify(flatten(other_action,other_action.params));
      conditionTrueString += "</div>";
    }
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: conditionTrueString + "<br/> " + conditionFalseString,
        }}
      ></div>
    );
  };
  const conditionFormatter = (
    cell: any,
    row: any,
    rowIndex: Number,
    formatExtraData: AnyArray
  ) => {
    let condition = cell[0];
    let conditionsString = "";

    let group = condition.group;
    let grouptype = group && group.type ? group.type : "";
    let groupconditions = group && group.conditions ? group.conditions : [];
    conditionsString = "";

    groupconditions
      .filter((cond: any) => cond.name !== "")
      .map((groupcondition: any, index: Number) => {
        //if(groupcondition.name == "")
        let column = "",
          value = "";
        let params = groupcondition.params ? groupcondition.params : {};
        for (let i = 0; i < Object.keys(params).length; i++) {
          let key = Object.keys(params)[i];
          if (i == 0) {
            column = params[key] != null ? params[key] : "";
          } else if (i == 1) {
            value = params[key] != null ? params[key] : "";
          }
        }

        let conditionObj = metaConditionsList.find((condition: any) => {
          return condition.id == groupcondition.name;
        });
        let conditionName = conditionObj != null ? conditionObj.label : "";
        conditionsString += "if " + column + " " + conditionName + " " + value;

        if (index == 0) {
          conditionsString += " " + grouptype + " ";
        }
      });
    return conditionsString;
  };
  const columns = [
    {
      dataField: "rule.conditions",
      sort: false,
      text: "Condition",
      formatter: conditionFormatter,
    },
    {
      dataField: "rule",
      sort: true,
      text: "Actions",
      formatter: actionFormatter,
    },
  ];

  useEffect(() => {
    dispatch(getMetaInfo({}));
  }, []);

  useEffect(() => {
    if (id) dispatch(getRulesList({ id }));
  }, []);

  useEffect(() => {
    if (createResp) {
      dispatch(getRulesList({ id }));
    }
  }, [createResp]);
  let allListPageSize: number = list?.length ?? 50;
  let pageSizes = [
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    }
  ]
  if(allListPageSize > 0){
    pageSizes.push({
      text: "All",
      value: allListPageSize,
    })
  }
  return (
    <div style={{ padding: 20 }} className="rule-sets">
      <CreateConditionModal
        ruleid={ruleId}
        rulesetid={id}
        ruleJsonProp={createDialogJson}
        open={createDialogOpen}
        onClose={(e?: string) => {
          //if(e === "Success")
          dispatch(getRulesList({ id }));
          setCreateDialogOpen(false);
        }}
      />
      <Table
        keyField="id"
        columns={columns}
        data={
          text
            ? list.filter((item: any) => JSON.stringify(item).includes(text))
            : list
        }
        pageSizes={pageSizes}
        noDataComponent={() => (
          <div className="nodata">
            No rules exist,{" "}
            <Link
              href="#"
              onClick={() => {
                setCreateDialogJson([]);
                setCreateDialogOpen(true);
              }}
            >
              add a rule
            </Link>{" "}
            to get started
          </div>
        )}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default DataTable;
