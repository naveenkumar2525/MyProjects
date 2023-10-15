import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Button,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { debounce } from "lodash";

type Props = {
  onClick: () => any;
  disabled?: boolean;
};

const LaunchEngagement = (props: Props) => {
  const { onClick, disabled = false } = props;

  return (
    <Button
      label="Launch Engagement"
      className="w-full mt-2 flex justify-center"
      onClick={debounce(onClick, 300)}
      disabled={disabled}
      startIcon={<i className="bi bi-send" />}
    />
  );
};

export default LaunchEngagement;
