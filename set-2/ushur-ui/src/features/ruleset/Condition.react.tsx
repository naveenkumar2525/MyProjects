import React, { useDebugValue, useEffect, useState } from "react";
import "./Condition.css";

import Select from "../../components/Select.react";
import GenericInput from "../../components/GenericInput.react";

type ConditionProps = {
  id: string;
  index: number;
  conditions: any;
  types: any[];
  operators: any[];
  andOrList: any[];
  condtype: string;
  condobj: any;
  condandOr: string;
  onDelete: (id: string) => void;
  onChangeOperator: (id: string) => void;
  onChangeAttribute: (id: string, name: string, value: string) => void;
  onChangeAndOr: (id: string) => void;
};

const Condition = (props: ConditionProps) => {
  const {
    types = [],
    operators = [],
    andOrList = [],
    onDelete,
    onChangeOperator,
    onChangeAttribute,
    onChangeAndOr,
    id,
    index,
    conditions,
    condtype,
    condobj,
    condandOr,
  } = props;

  const [type, setType] = useState("");
  const [operator, setOperator] = useState("");
  const [defaultParams, setDefaultParams] = useState<any>([]);
  const [params, setParams] = useState<any>([]);

  const [andOr, setAndOr] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);
  let defaultParamsArr: any[] = [];
  let typesOptions = {
    title: "",
    value: type,
    showBlankOption: true,
    items: types,
  };
  let operatorsOptions = {
    title: "",
    value: operator,
    showBlankOption: true,
    items: operators,
  };
  const [typeOptions, setTypeOptions] = useState(typesOptions);
  const [operatorOptions, setOperatorOptions] = useState(operatorsOptions);
  const assignValueToParams = (params: any[], condparams: any) => {
    let paramsClone: any = [];

    params.map((param: any) => {
      const colName = param.id;
      let paramClone = { ...param };
      if (paramClone.inputProps !== {}) {
        paramClone.inputProps = {
          ...paramClone.inputProps,
          ...{ value: condparams[colName] },
        };
      }
      if (paramClone.selectProps) {
        paramClone.selectProps = {
          ...paramClone.selectProps,
          ...{ value: condparams[colName] },
        };
      }
      paramsClone.push(paramClone);
    });
    params = [...paramsClone];
    return params;
  };
  const changeType = (value: string, condparams?: any) => {
    setType(value);
    let filteredOperators = operators.filter(
      (operator) => operator.type == value
    );
    let filteredOperatorsOptions = { ...operatorOptions };
    filteredOperatorsOptions.items = filteredOperators;
    console.log("Filtered Operators:", filteredOperatorsOptions);
    setOperatorOptions(filteredOperatorsOptions);
    let selectedType = types.find((item: any) => item.id === value);
    let selectTypeDefaultParams =
      selectedType && selectedType.defaultParams
        ? selectedType.defaultParams
        : [];

    if (condparams) {
      selectTypeDefaultParams = [
        ...assignValueToParams([...selectTypeDefaultParams], condparams),
      ];
    }
    defaultParamsArr = selectTypeDefaultParams;
    setDefaultParams(selectTypeDefaultParams);
    let typeOptionsClone = { ...typeOptions };
    typeOptionsClone.value = value;
    setTypeOptions(typeOptionsClone);
  };

  const changeOperator = (value: string, condparams?: any) => {
    let selectedOperator = operators.find((item: any) => item.id === value);
    let operatorOptionsClone = { ...operatorOptions };
    operatorOptionsClone.value = value;
    setOperatorOptions(operatorOptionsClone);
    setOperator(value);
    if (selectedOperator && selectedOperator.params) {
      defaultParamsArr = [...defaultParamsArr, ...defaultParams];
      let nonDefaultParams = selectedOperator.params.filter(
        (defParam: any) =>
          !defaultParamsArr.some(
            (nonDefParam: any) => defParam.id === nonDefParam.id
          )
      );
      if (condparams) {
        nonDefaultParams = [
          ...assignValueToParams([...nonDefaultParams], condparams),
        ];
      }
      setParams(nonDefaultParams);
    }
  };

  useEffect(() => {
    if (initialLoad) {
      if (condtype && condobj && condobj.params) {
        changeType(condtype, condobj.params);
        changeOperator(condobj.name, condobj.params);
      }
      if (condandOr) {
        setAndOr(condandOr);
      }
    }
  }, [condtype, condobj]);
  return (
    <div className="px-3 rounded-lg">
      {
        <>
          <div className="grid grid-cols-5 gap-x-5 mt-1 condition-row">
            <span>
              <GenericInput
                selectProps={typeOptions}
                type="select"
                onChange={(id: string, name: string, value: string) => {
                  changeType(value);
                }}
              />
            </span>
            <span>
              {defaultParams.map((param: any, index: Number) => {
                return (
                  <span key={index.toString()}>
                    <GenericInput
                      selectProps={param.selectProps}
                      inputProps={param.inputProps}
                      type={param.type}
                      onChange={onChangeAttribute}
                    />
                  </span>
                );
              })}
            </span>
            <span>
              <GenericInput
                selectProps={operatorOptions}
                type="select"
                onChange={(id: string, name: string, value: string) => {
                  changeOperator(value);
                  onChangeOperator(value);
                }}
              />
            </span>
            <span>
              {params.map((param: any, index: Number) => {
                return (
                  <span key={index.toString()}>
                    <GenericInput
                      selectProps={param.selectProps}
                      inputProps={param.inputProps}
                      type={param.type}
                      onChange={onChangeAttribute}
                    />
                  </span>
                );
              })}
            </span>

            {/* {(!!params && params.length > 1) ? ( // if params length > 1 show the second text box
              
              <Input
                label=""
                helperText="Value"
                value={condition}
                handleInputChange={(ev: any) =>{
                    setCondition(ev.target.value);
                    onChangeValue(ev.target.value);
                  }
                }
              
              />):""} */}

            {index < conditions.length - 1 ? ( //Dont show the last And/Or Dropdown
              <Select
                items={andOrList}
                value={andOr}
                showBlankOption={true}
                onChange={(value: string) => {
                  onChangeAndOr(value);
                  setAndOr(value);
                }}
                title=""
              />
            ) : (
              ""
            )}
          </div>
          {/* </div> */}
        </>
      }
    </div>
  );
};

export default Condition;
