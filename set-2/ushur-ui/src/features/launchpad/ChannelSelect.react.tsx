import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Dropdown,
  // @ts-ignore
} from "@ushurengg/uicomponents";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { channels, getLaunchChannels } from "./launchpadSlice";

type Props = {
  value: string;
  onSelect: (val: any) => any;
};

const getSelectedValue = (list: any, value: any) => {
  if (!value || list?.length < 1) {
    return "";
  }
  const item = list.find(([key, item]: any) => key === value);
  return item?.[1].displayText ?? "";
};

const ChannelSelect = (props: Props) => {
  const { value, onSelect } = props;
  const dispatch = useAppDispatch();
  const channelsList = useAppSelector(channels);
  const selChannel = getSelectedValue(channelsList, value);

  useEffect(() => {
    dispatch(getLaunchChannels());
  }, []);

  return (
    <div className="w-full mt-2">
      <Dropdown
        label="Channel"
        title={selChannel || <>&nbsp;</>}
        noDataText="No active channels"
        options={
          channelsList
            ?.map(([key, value]: any) => ({
              text: value.displayText,
              value: key,
              category: "",
              onClick: () => {
                onSelect(key);
              },
            }))
            ?.filter(({ value }: any) => value === "text") ?? []
        }
        className="variable-type-dropdown"
        name="type"
      />
    </div>
  );
};

export default ChannelSelect;
