import React, { useState, useEffect } from "react";
// @ts-ignore
import {
  Title,
  Tabs,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import ReadyLaunch from "./ReadyLaunch.react";
import LaunchTable from "./LaunchpadTable.react";
import { useTrackPageLoad } from "../../utils/tracking";
import {useLocation} from "react-router-dom";

const LaunchTabHeading = () => (
  <>
    <Title text="Launch Engagement" />
    <div className="sub-title">
      <span>
        Manually launch an engagement to a selected group of contacts. Build a
        list of recipients using the panel on the left.
      </span>
      <div>
        When your table contains all of your target recipients, click the Launch
        Engagement button to send it.
      </div>
    </div>
  </>
);

const LaunchPad = (props:any) => {
  useTrackPageLoad({ name: "Launchpad Page" });
  let location:any = useLocation();
  let defaultval:any = location?.state?.value?? ""
  return (
    <div className="container-fluid launchpad p-0">
      <div className="row m-0">
        <div className="bg-white p-3 pt-3">
          <div className="p-3">
            <Title text="Launchpad" />
          </div>
        </div>

        <Tabs 
        className="pb-0 pt-0" style={{padding:"2rem"}}
          tabs={[
            {
              eventKey: "launch",
              title: "Launch",
              component: (
                <div className="container-fluid p-4">
                  <LaunchTabHeading />
                  <div className="flex pt-3">
                    <div>
                      <ReadyLaunch  defaultValue={defaultval} />
                    </div>
                    <div className="pl-4 pr-2 pb-4">
                      <LaunchTable />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
          defaultActiveKey="launch"
        />

      </div>
    </div>
  );
};

export default LaunchPad;
