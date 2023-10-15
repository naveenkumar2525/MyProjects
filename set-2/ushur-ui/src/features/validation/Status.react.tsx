import React from "react";
import "./Status.css";

type StatusProps = {
  text: string;
};

const Status = (props: StatusProps) => {
  const { text = "" } = props;

  return <div className={`pill val-status-${text}`}>{text}</div>;
};

export default Status;
