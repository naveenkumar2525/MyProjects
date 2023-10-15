import React, { useState, useEffect } from "react";
// @ts-ignore
import { CounterLabel } from "@ushurengg/uicomponents/dist/components/CounterLabel/CounterLabel";
import { useDelayUnmount } from "../../custom-hooks/useDelayUnmount";
import { contactList } from "./launchpadSlice";
import { useAppSelector } from "../../app/hooks";

type Props = {
  goodCount: number;
  errorCount: number;
};

const EngagementSummary = (props: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const shouldRenderChild = useDelayUnmount(isMounted, 300);
  const mountedStyle = { animation: "inAnimation 300ms ease-in" };
  const unmountedStyle = { animation: "outAnimation 300ms ease-in" };
  const { goodCount, errorCount } = props;
  const list = useAppSelector(contactList);
  const usersLength = list?.users?.filter((i: any) => !i.deleted).length;

  useEffect(() => {
    if (usersLength > 0) {
      setIsMounted(true);
    } else setIsMounted(false);
  }, [list?.users]);

  return shouldRenderChild ? (
    <div style={isMounted ? mountedStyle : unmountedStyle}>
      <div className="mt-4 mb-4">
        <div>Launch this engagement to:</div>
        <div className="flex ml-2">
          <div className="grid place-content-center pr-2">
            <CounterLabel color="green" counterVal={`${goodCount}`} />
          </div>
          <div>{`recipient${goodCount > 1 ? "s" : ""}`}</div>
        </div>
        {errorCount > 0 && (
          <div className="flex ml-2">
            <div className="grid place-content-center pr-2">
              <CounterLabel color="orange" counterVal={`${errorCount}`} />
            </div>
            <div>cannot send</div>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default EngagementSummary;
