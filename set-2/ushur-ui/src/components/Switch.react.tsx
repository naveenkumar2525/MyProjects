import React, { useState } from "react";
import "./Switch.css";

type SwitchProps = {
  toggle: boolean;
  onChange: (toggle: boolean) => void;
  disabled: boolean;
  activeLabel?: string,
  inactiveLabel?: string
};

const Switch = (props: SwitchProps) => {
  const { toggle, onChange, disabled, activeLabel = "Active", inactiveLabel = "Inactive" } = props;

  const handleSwitch = () => {
    if(!disabled)
      onChange(!toggle);
  }

  return (
    <div>
      <div
        className={`switch_container swc_${toggle ? "right" : "left"}${disabled ? "_disabled" : ""}`}
        onClick={handleSwitch}
      >
        {toggle ? activeLabel : inactiveLabel}
        <div className={`switch_button swb_${toggle ? "right" : "left"}`}></div>
      </div>
    </div>
  );
};

export default Switch;
