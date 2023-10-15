import React, { useState } from "react";
import Select from "./Select.react";

// @ts-ignore
import {
  Input,
  // @ts-ignore
} from "@ushurengg/uicomponents";
type Item = {
  label: string;
  id: string;
};
type InputProps = {
  label: string;
  helperText: string;
  value: string;
  handleInputChange: (ev: any) => void;
};
type ListProps = {
  list_params: any[];
  onChange: (value: string) => void;
};
type DictProps = {
  dict_params: any[];
  onChange: (value: string) => void;
};
type SelectProps = {
  title: string;
  value: string;
  // onChange: (value: string) => void;
  items: Item[];
  showBlankOption?: boolean;
};
type GenericInputProps = {
  selectProps: SelectProps;
  inputProps?: InputProps;
  listProps?: ListProps;
  dictProps?: DictProps;
  type: string;
  onChange: (id: string, name: string, value: string) => void;
};
const ListInput = (listProps: any) => {
  let listpropObj: any = {};

  return (
    <>
      {Object.keys(listProps.listProps).map((key: string, index: number) => {
        listpropObj = listProps.listProps[key];
        return listpropObj.list_params.map((param: any) => {
          return (
            <Input
              {...param}
              handleInputChange={(ev: any) => {
                const name = ev.target.ariaLabel;
                const id = ev.target.id;
                listProps.onChange(id, name, ev.target.value);
              }}
            />
          );
        });
      })}
    </>
  );
};
const DictInput = (dictProps: any) => {
  return (
    <>
      {dictProps.dictProps.dict_params.map((param: any) => {
        return (
          <Input
            key={param.id}
            {...param}
            handleInputChange={(ev: any) => {
              const name = ev.target.ariaLabel;
              const id = ev.target.id;
              dictProps.onChange(id, name, ev.target.value);
            }}
          />
        );
      })}
    </>
  );
};
const GenericInput = (props: GenericInputProps) => {
  const { selectProps, inputProps, listProps, dictProps, type, onChange } =
    props;

  const [controlValue, setControlValue] = useState("");

  return (
    <>
      {type === "select" ? (
        <Select
          {...selectProps}
          onChange={(value: string) => {
            const name = "";
            const id = "";
            onChange(id, name, value);
          }}
        />
      ) : type === "text" ? (
        <Input
          {...inputProps}
          handleInputChange={(ev: any) => {
            const name = ev.target.ariaLabel;
            const id = ev.target.id;
            onChange(id, name, ev.target.value);
          }}
        />
      ) : type === "list" ? (
        <ListInput listProps={listProps} onChange={onChange} />
      ) : type === "dict" ? (
        <DictInput dictProps={dictProps} onChange={onChange} />
      ) : (
        <></>
      )}
    </>
  );
};

export default GenericInput;
