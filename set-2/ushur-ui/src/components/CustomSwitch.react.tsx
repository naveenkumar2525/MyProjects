import React, { useState } from "react";
import "./CustomSwitch.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type SwitchProps = {
  toggle: boolean;
  onChange: (toggle: boolean) => void;
  activeColor: string;
  inactiveColor: string;
  activeText: string;
  inactiveText: string;
  tooltipText?: string;
  style: object;
};

const CustomSwitch = (props: SwitchProps) => {
  const { toggle, onChange, activeColor, inactiveColor, activeText, inactiveText, style,tooltipText } = props;
  return (
    <div>
      <OverlayTrigger
        trigger="hover"
        placement="bottom"
        overlay={ <span className="tooltiptext">{tooltipText}</span>}
      >
      <div
        className={`switch_container swc_${toggle ? "right" : "left"}`}
        style={{ background: toggle ? activeColor : inactiveColor, ...style }}
        onClick={() => onChange(!toggle)}
      >
       <span style={{marginLeft:'-5px',whiteSpace:'nowrap'}}>{toggle ? activeText : inactiveText}</span> 
        <div className={`switch_button swb_${toggle ? "right" : "left"}`}></div>
      </div>
      </OverlayTrigger>
    </div>
  );
};

export default CustomSwitch;