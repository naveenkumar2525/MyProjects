import React, { useState } from "react";
import "./Status.css";

type StatusProps = {
  text: string;
};

const Status = (props: StatusProps) => {
  const { text = "" } = props;

  return <div className={`pill ${text}`}>{text}</div>;
};

export default Status;
