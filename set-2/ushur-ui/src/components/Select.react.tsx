import React from "react";
import "./Select.css";
import { Form, FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';

type Item = {
  label: string;
  id: string;
};

type SelectProps = {
  title: string;
  value: string;
  error?: boolean;
  tooltipText?: string;
  onChange: (value: string) => void;
  items: Item[];
  showBlankOption?:boolean
};

const Select = (props: SelectProps) => {
  const { title, value, items, showBlankOption=false, error=false, tooltipText = '', onChange } = props;
  let itemsClone:Item[]=items;
  if(showBlankOption){
    const blankOption:Item[] = [{label:"",id:""}];
    itemsClone = [ ...blankOption,...itemsClone ]
    
  }
  return (
    <div className="ushur-select">
      <Form.Label className="ushur-label" htmlFor="basic-url">
        {title}
        {tooltipText !== "" ? (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip className="tooltip" id={`tooltip-top`}>
                {tooltipText}
              </Tooltip>
            }
          >
            {error ? (
              <i className="bi bi-exclamation-diamond-fill label-icon error-icon"></i>
            ) : (
              <i className="bi bi-info-circle label-icon tooltip-icon"></i>
            )}
          </OverlayTrigger>
        ) : (
          <></>
        )}
        {error && !tooltipText && (
          <i className="bi bi-exclamation-diamond-fill label-icon error-icon"></i>
        )}
      </Form.Label>
      <div className="flex justify-space">
        <select
          value={value}
          onChange={(event: any) => onChange(event.target.value)}
          className={`ushur-text w-full p-1 border-solid border-1 ${
            error ? "border-[#FF4545]" : "border-light-gray-200"
          } rounded`}
        >
          {itemsClone.map((item: Item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
