import React, { useState, useEffect } from "react";
import "./ShortLinks.css";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
// @ts-ignore
import {
  Button,
  Input,
  Title,
  FieldButton,
  Dropdown,
  DataCard,
  // @ts-ignore
} from "@ushurengg/uicomponents";
// @ts-ignore
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import CreateModal from "./CreateModal.react";
import DataTable from "./DataTable.react";
import {
  setAutoRefreshOff,
  setAutoRefreshOn,
  setDataRefreshState,
  isAutoRefresh,
  dataRefreshState,
  getShortLinksList,
  shorlinksList,
  lastRecordId,
  setFilterText,
} from "./shortlinksSlice";
import ReactDOM from "react-dom";
import { Dropdown as RbDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/pro-regular-svg-icons";
import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";
import { useTrackPageLoad } from "../../utils/tracking";

const ShortLinksPage = () => {
  const { page } = useUrlSearchParams();
  const isRefresh = useAppSelector(isAutoRefresh);
  const refreshState = useAppSelector(dataRefreshState);
  const list = useAppSelector(shorlinksList);
  const lastRecordid = useAppSelector(lastRecordId);
  const dispatch = useAppDispatch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [datesValue, onChangeDates] = useState([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  ]);
  const [searchText, setSearchText] = useState("");

  useTrackPageLoad({ name: "Short Links Page" });

  useEffect(() => {
    if (isRefresh && refreshState === "refreshed") {
      dispatch(setDataRefreshState("idle"));
      setTimeout(
        () =>
          dispatch(
            getShortLinksList({
              startDate: datesValue[0].toISOString(),
              endDate: datesValue[1].toISOString(),
            })
          ),
        1000
      );
    }
  }, [isRefresh, refreshState]);

  const handleDateRangeSelection = (curRange: any) => {
    onChangeDates([new Date(curRange[0].toISOString()), new Date(curRange[1].toISOString())]);
    setSearchText(curRange);
    dispatch(
      getShortLinksList({
        startDate: curRange[0].toISOString(),
        endDate: curRange[1].toISOString(),
      })
    );
  };

  return (
    <div className="p-3 m-0">
      <div className="container-fluid variables-page p-3">
        <div className="row m-0 mb-3" >
          <div className="col-12 p-0">
            {!page && (
              <Title
                subText="View, edit and manage your short links"
                text="Short Links"
              />
            )}

          </div>
        </div>
        <div className="row m-0 mb-3" >
          <div className="col-12 p-0">
            <DataCard
              data={list?.length ?? 0}
              label="Total Short Links"
              onClick={() => { }}
            />
            {/* <div style={{ marginRight: 20 }}> </div>
        <DataCard
          data={list?.reduce((acc: any, curr: any) => acc + curr.visits, 0)}
          label="Total Visits"
          onClick={() => { }}
        /> */}

            <div className="bg-white m-0 mt-3 border-radius-5"
              style={{
                borderRadius: 5,
              }}
            >
              <DataTable
                dates={datesValue}
                setCreateDialogOpen={setCreateDialogOpen}
                handleDateRangeSelection={handleDateRangeSelection}
                autoRefreshComponent={
                  <Dropdown
                    style={{ color: !isRefresh && "#CF4022" }}
                    type="button"
                    title={
                      isRefresh ? (
                        <FontAwesomeIcon icon={faSyncAlt} />
                      ) : (
                        <FontAwesomeIcon icon={faPause} />
                      )
                    }
                    className={`refresh-data-dropdown ${isRefresh ? "refresh" : "pause"}`}
                    options={[
                      {
                        category: "TABLE DATA",
                        onClick: () => {
                          // dispatch(setAutoRefreshOff());
                          dispatch(setAutoRefreshOff())
                        },
                        text: "Pause auto-refresh",
                        value: "excel",
                      },
                      {
                        category: "TABLE DATA",
                        onClick: () => {
                          // dispatch(setAutoRefreshOn());
                          dispatch(setAutoRefreshOn())
                        },
                        text: "Enable auto-refresh",
                        value: "csv",
                      },
                      {
                        category: "TABLE DATA",
                        onClick: () => {
                          dispatch(
                            getShortLinksList({
                              startDate: datesValue[0].toISOString(),
                              endDate: datesValue[1].toISOString(),
                              lastRecordId: lastRecordid || '',
                              fetchNextBatch: true,
                            })
                          )
                        },
                        text: "Fetch Next Batch",
                        value: "allRecords",
                      },
                    ]}
                  />
                }
                handleAutoRefresh={() => {
                  isRefresh
                    ? dispatch(setAutoRefreshOff())
                    : dispatch(setAutoRefreshOn());
                }}
              />
              <CreateModal
                open={createDialogOpen}
                onClose={() => {
                  console.log("dialog close");
                  setCreateDialogOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortLinksPage;
