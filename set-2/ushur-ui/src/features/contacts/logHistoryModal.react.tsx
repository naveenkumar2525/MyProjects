import React, { useState, useEffect } from "react";
// @ts-ignore
import { Button, Modal, Table, Dropdown } from "@ushurengg/uicomponents";
import { Badge, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  dataRefreshState,
  getLogsHistoryAPI,
  getLogsHistoryData,
  isAutoRefresh,
  setAutoRefreshOff,
  setAutoRefreshOn,
  setDataRefreshState,
} from "./contactsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faCalendarAlt,
  // faPause,
} from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/pro-regular-svg-icons";

import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";

const LogHistoryModal = (props: any) => {
  //const autoRefresh = useAppSelector(isAutoRefresh);
  const refreshState = useAppSelector(dataRefreshState);
  const [dateRange, setDateRange] = useState([
    moment().subtract(29, "days"),
    moment(),
  ]);
  const [lastRecordId, setLastRecordId] = useState<any>(null);
  const [logsRequest, setLogsRequest] = useState<any>({
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    lastRecordId: null,
    nRecords: "50",
  });
  const [totalRecords, setTotalRecords] = useState<any>(50);
  const [autoRefresh, setAutoRefresh] = useState<any>(false);

  const onModalClose = () => {
    setLogsRequest({
      ...logsRequest,
      lastRecordId: null,
    });
    props.setShowHistoryModal(false);
  };

  const timeStampCell = (cell: any) => {
    if (cell && cell["$date"]) {
      let curDate: any = new Date(cell["$date"]);
      return <span>{curDate.toLocaleString()}</span>;
    } else return <></>;
  };

  const statusCell = (cell: any) => {
    let currentBadge = "ushur-badge-";

    switch (cell) {
      case "successful":
        currentBadge += "success";
        break;
      case "failed":
        currentBadge += "danger";
        break;
      case "error":
        currentBadge += "danger";
        break;
      case "extracting":
        currentBadge += "secondary";
        break;
      case "warning":
        currentBadge += "warning";
        break;
    }

    return (
      <Badge pill className={currentBadge} style={{ color: "#414141" }}>
        {cell}
      </Badge>
    );
  };

  const dispatch = useAppDispatch();
  const logsDataFromAPI = useAppSelector(getLogsHistoryData);
  const [columns, setColumns] = useState<any>([
    {
      dataField: "timestamp",
      sort: true,
      text: "TIMESTAMP",
      formatter: timeStampCell,
      headerStyle: (cell: any) => {
        return { width: "175px" };
      },
      style: (cell: any) => {
        return { width: "175px" };
      },
    },
    {
      dataField: "result",
      sort: true,
      text: "STATUS",
      formatter: statusCell,
      headerStyle: (cell: any) => {
        return { width: "120px" };
      },
      style: (cell: any) => {
        return { width: "120px" };
      },
    },
    {
      dataField: "message",
      sort: true,
      text: "MESSAGE",
    },
  ]);

  const [logsData, setLogsData] = useState<any>([]);


  useEffect(() => {
    if (props.showHistoryModal) {
      dispatch(
        getLogsHistoryAPI({
          ...logsRequest,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        })
      );
    }
  }, [props.showHistoryModal]);

  useEffect(() => {
    if (autoRefresh && refreshState === "refreshed") {
      dispatch(setDataRefreshState("idle"));
      setTimeout(
        () =>
          dispatch(
            getLogsHistoryAPI({
              ...logsRequest,
              startDate: dateRange[0].toISOString(),
              endDate: dateRange[1].toISOString(),
            })
          ),
        10000
      );
    }
  }, [autoRefresh, refreshState]);

  useEffect(() => {
    if (
      logsDataFromAPI &&
      logsDataFromAPI.data &&
      logsDataFromAPI.data.length > 0
    ) {
      let curData = [...logsDataFromAPI.data].reverse();
      setLogsData(curData);
      setLogsRequest({
        ...logsRequest,
        lastRecordId: logsDataFromAPI.lastRecordId,
      });
      setTotalRecords(logsDataFromAPI.totalRecords);
    } else {
      setLogsData([]);
      setLogsRequest({
        ...logsRequest,
        lastRecordId: null,
      });
      setTotalRecords(0);
    }
  }, [logsDataFromAPI]);

  const handleDateChangeEvent = (event: any, picker: any) => {
    // console.log('Handle event')
    // console.log(picker.startDate);
  };

  const handleDateCallback = (start: any, end: any, label: any) => {
    let startDate = new Date(start).toISOString();
    let endDate = new Date(end).toISOString();

    setDateRange([start, end]);
    setLogsRequest({
      ...logsRequest,
      startDate: startDate,
      endDate: endDate,
      lastRecordId: null,
    });
    dispatch(
      getLogsHistoryAPI({
        ...logsRequest,
        startDate: startDate,
        endDate: endDate,
        lastRecordId: null,
      })
    );
  };

  return (
    <Modal
      className="log-history-modal"
      onHide={onModalClose}
      size="lg"
      title="Upload History"
      subTitle="Log history of the files uploaded to Contacts"
      showModal={props.showHistoryModal}
      closeLabel="Close"
    >
      <DateRangePicker
        initialSettings={{
          // timePicker: true,
          startDate: moment(dateRange[0]),
          endDate: moment(dateRange[1]),
          ranges: {
            Today: [moment(), moment()],
            Yesterday: [
              moment().subtract(1, "days"),
              moment().subtract(1, "days"),
            ],
            "Last 7 Days": [moment().subtract(6, "days"), moment()],
            "Last 30 Days": [moment().subtract(29, "days"), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment().subtract(1, "month").startOf("month"),
              moment().subtract(1, "month").endOf("month"),
            ],
          },
        }}
        onEvent={handleDateChangeEvent}
        onCallback={handleDateCallback}
      >
        {/* <button
          type="button"
          className="ushur-btn ushur-toolbar-btn medium-btn btn btn-outline-primary btn-lg"
          style={{ position: "absolute" }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} />
        </button> */}
        {/* <div className="input-group mb-3">
          <input type="text" className="form-control ushur-input search" />
          <div className="input-group-append">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
        </div> */}

        <div className="ushur-field-btn logs-date-range-input date-range-input">
          <div className="input-group">
            <input
              placeholder=""
              aria-label=""
              type="text"
              className="form-control ushur-input search"
              value={`${dateRange[0].format(
                "MM/DD/YY"
              )} - ${dateRange[1].format("MM/DD/YY")}`}
            />
            <div>
              <button
                aria-label=""
                type="button"
                className="  ushur-btn ushur-secondary-btn medium-btn btn btn-outline-primary btn-lg"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
              </button>
            </div>
          </div>
        </div>

        {/* <input type="text" className="form-control" /> */}
      </DateRangePicker>

      <Table
        keyField="timestamp"
        columns={columns}
        data={logsData}
        pageSizes={[
          {
            text: "25",
            value: 25,
          },
          {
            text: "50",
            value: 50,
          },
          {
            text: "100",
            value: 100,
          },
          {
            text: "All",
            value: logsData.length,
          },
        ]}
        showHeader={true}
        headerComponent={
          <div className="row">
            <div className="col-1">
              <i className="far fa-calendar-alt"></i>
            </div>
          </div>
        }
        showEdit={false}
        showSearch={false}
        showSettings={false}
        showAutoRefresh={true}
        autoRefreshComponent={
          <Dropdown
            style={{ color: !autoRefresh && "#CF4022" }}
            type="button"
            title={
              autoRefresh ? (
                <FontAwesomeIcon icon={faSyncAlt} />
              ) : (
                <FontAwesomeIcon icon={faPause} />
              )
            }
            className={`refresh-data-dropdown ${
              autoRefresh ? "refresh" : "pause"
            }`}
            {...props.csvProps}
            options={[
              {
                category: "TABLE DATA",
                onClick: () => {
                  // dispatch(setAutoRefreshOff());
                  setAutoRefresh(false);
                },
                text: "Pause auto-refresh",
                value: "excel",
              },
              {
                category: "TABLE DATA",
                onClick: () => {
                  // dispatch(setAutoRefreshOn());
                  setAutoRefresh(true);
                },
                text: "Enable auto-refresh",
                value: "csv",
              },
              {
                category: "TABLE DATA",
                onClick: () => {
                  //dispatch(setAutoRefreshOff());
                  setAutoRefresh(false);
                  dispatch(
                    getLogsHistoryAPI({
                      ...logsRequest,
                      nRecords: totalRecords,
                    })
                  );
                },
                text: "Fetch All Records",
                value: "allRecords",
              },
            ]}
          />
        }
        noDataComponent={
          <p className="no-data-text">
            You do not have any logs in the selected date range.
          </p>
        }
      />
    </Modal>
  );
};

export default LogHistoryModal;
