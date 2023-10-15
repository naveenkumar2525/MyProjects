import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  dataSecurityRule,
  getDataSecurityRuleAPI as getEnterpriseSettings,
} from "../variables/variablesSlice";
// @ts-ignore
import { Title } from "@ushurengg/uicomponents";

const Analytics = () => {
  const dispatch = useAppDispatch();
  const entSettings = useAppSelector(dataSecurityRule);

  useEffect(() => {
    dispatch(getEnterpriseSettings());
  }, []);

  if (!entSettings?.data?.ShowEnterpriseStats || !entSettings?.data?.BiCharts) {
    return (
      <div className="p-3 m-0">
        <div className="container-fluid variables-page p-3">
          <div className="row m-0 mb-3" >
            <div className="col-12 p-0">
              <Title subText="" text="Analytics" />
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  background: "white",
                  padding: 20,
                  borderRadius: 8,
                }}
              >
                Please make sure to enable the Analytics tab and have valid URL for BI
                Charts in Enterprise settings.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const url = entSettings.data.BiCharts.includes("bi.ushur.me")
    ? entSettings.data.BiCharts
    : `https://bi.ushur.com/${entSettings.data.BiCharts}`;

  return <iframe src={url} width={"100%"} style={{ height: "100vh" }} />;
};

export default Analytics;
