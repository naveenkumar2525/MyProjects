import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createResponse,
  deleteAndGet,
  getSettingsAndShortLinksList,
  getShortLinksList,
  getSurlVisitCount,
  searchText,
  setFilterText,
  shorlinksList,
} from "./shortlinksSlice";
// @ts-ignore
import {
  Table,
  Button,
  Dropdown,
  FieldButton,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import EditColumnModal from "../../components/modals/editColumnModal.react";
import { cloneDeep } from "lodash";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import EditShortLinkModal from "./editShortLink.react";
import SuccessModal from "../successModal/successModal.react";
import ErrorModal from "../errorModal/errorModal.react";
import ConfirmationModal from "../../components/modals/confirmationModal.react";
import { faCopy, faSyncAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { copyToClipboard } from "../../utils/helpers.utils";
import { AnyTxtRecord } from "dns";

const UrlCopy = ({ text }: any) => {
  const [onHover, setOnHover] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      {text}
      {onHover && (
        <span
          className="absolute"
          style={{ right: 0, top: 0 }}
          onClick={(event: any) => {
            event.preventDefault();
            event.stopPropagation();

            copyToClipboard(text);
          }}
        >
          <FontAwesomeIcon color="#2F80ED" icon={faCopy} />
        </span>
      )}
    </div>
  );
};

type DataTableProps = {
  dates: any;
  setCreateDialogOpen: any;
  handleDateRangeSelection: any;
  handleAutoRefresh: any;
  autoRefreshComponent: any;
};

const DataTable = (props: DataTableProps) => {
  const { dates } = props;
  const list = useAppSelector(shorlinksList);
  const createResp = useAppSelector(createResponse);
  const text = useAppSelector(searchText);
  const dispatch = useAppDispatch();

  const tagsCell = (content: any) => {
    const tags = content?.split(",")?.filter((x: any) => x) ?? [];
    return (
      <div className="tags-wrap">
        {tags?.map((tag: any) => (
          <span className="sl-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const urlCell = (text: any) => <UrlCopy text={text} />;
  const urlCopyCell = (text: any) => <UrlCopy text={text} />;
  const visitsCell = (visits: number, row: any) => <Visits row={row} />;

  const columns = [
    {
      dataField: "tags",
      sort: true,
      text: "TAGS",
      formatter: tagsCell,
      hidden: false,
    },
    {
      dataField: "surl",
      sort: true,
      text: "SHORT LINK",
      style: () => ({ overflow: "hidden" }),
      formatter: urlCell,
      hidden: false,
    },
    {
      dataField: "urlOrFile",
      sort: true,
      text: "LONG LINK / FILE NAME",
      style: () => ({ overflow: "hidden" }),
      formatter: urlCopyCell,
      hidden: false,
    },
    {
      dataField: "visits",
      sort: true,
      text: "VISITS",
      headerStyle: () => ({ width: 80 }),
      style: () => ({ textAlign: "center" }),
      formatter: visitsCell,
      hidden: false,
    },
    {
      dataField: "createdTimestamp",
      text: "CREATED",
      headerStyle: () => ({ width: 140 }),
      hidden: false,
    },
    {
      dataField: "visitedTimestamp",
      text: "LAST VISITED",
      headerStyle: () => ({ width: 140 }),
      hidden: false,
    },
  ];

  const Visits = ({ row }: any) => {
    const [onHover, setOnHover] = useState(false);
    const dispatch = useAppDispatch();
    const getLatestVisitsCount = async () => {
      dispatch(
        getSurlVisitCount({
          startDate: dates[0].toISOString(),
          endDate: dates[1].toISOString(),
          surl: row.surl,
        })
      );
    };
    return (
      <div
        className="relative"
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        {row.visits !== null ? (
          row.visits
        ) : (
          <Button
            label="View"
            onClick={(event: any) => {
              event.preventDefault();
              event.stopPropagation();
              getLatestVisitsCount();
            }}
            size="sm"
            type="secondary"
          />
        )}
        {onHover && row.visits !== null && (
          <span
            className="absolute"
            style={{ right: 0, top: 0 }}
            onClick={(event: any) => {
              event.preventDefault();
              event.stopPropagation();
              getLatestVisitsCount();
              // console.log("refresh visits");
            }}
          >
            <FontAwesomeIcon color="#2F80ED" icon={faSyncAlt} />
          </span>
        )}
      </div>
    );
  };
  const [currentColumns, setCurrentColumns] = useState<any>(columns);
  const [showEditColumnModal, setShowEditColumnModal] = useState<any>(false);
  const [curDateRange, setCurDateRange] = useState<any>([
    moment().subtract(29, "days"),
    moment(),
  ]);
  const [showSuccessModal, setShowSuccessModal] = useState<any>(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState<any>(false);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentEditData, setCurrentEditData] = useState<any>({});
  const [confirmationObj, setConfirmationObj] = useState({
    title: "Save changes ?",
    message: "",
    delete: false,
    singleEdit: false,
  });

  const [data, setData] = useState<any>([]);
  const [originalData, setOriginalData] = useState<any>([]);

  useEffect(() => {
    if (list) {
      let curLst = list.sort((a: any, b: any) => b.createdTime - a.createdTime);

      setData(curLst);
      setOriginalData(curLst);
      // setLogsRequest({
      //   ...logsRequest,
      //   lastRecordId: logsDataFromAPI.lastRecordId,
      // });

      let savedCols: any = sessionStorage.getItem("columnsOrder");
      let preferredColumnOrder = columns;
      let tempObj: any = JSON.parse(savedCols);
      if (!tempObj) {
        tempObj = {};
      }
      if (savedCols) {
        if (
          tempObj &&
          tempObj["short_links"] &&
          tempObj["short_links"].length > 0
        ) {
          preferredColumnOrder = tempObj["short_links"];
        }
      }
      preferredColumnOrder.forEach((eachCol: any) => {
        if (eachCol.dataField === "tags") {
          eachCol["formatter"] = tagsCell;
        }

        if (eachCol.dataField === "surl") {
          eachCol["formatter"] = urlCell;
        }

        if (eachCol.dataField === "urlOrFile") {
          eachCol["formatter"] = urlCopyCell;
        }

        if (eachCol.dataField === "visits") {
          eachCol["formatter"] = visitsCell;
        }
      });

      setCurrentColumns(preferredColumnOrder);
      tempObj["short_links"] = preferredColumnOrder;

      sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));
    }
  }, [list]);

  useEffect(() => {
    dispatch(
      getSettingsAndShortLinksList({
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString(),
      })
    );
  }, []);

  useEffect(() => {
    if (createResp) {
      dispatch(
        getShortLinksList({
          startDate: dates[0].toISOString(),
          endDate: dates[1].toISOString(),
        })
      );
    }
  }, [createResp]);

  const handleSaveColumns = (editedColumns: any) => {
    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = {};
    if (savedCols) {
      tempObj = JSON.parse(savedCols);
    }
    tempObj["short_links"] = editedColumns;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));

    editedColumns?.forEach((eachCol: any) => {
      if (eachCol.dataField === "tags") {
        eachCol["formatter"] = tagsCell;
      }

      if (eachCol.dataField === "surl") {
        eachCol["formatter"] = urlCell;
      }

      if (eachCol.dataField === "urlOrFile") {
        eachCol["formatter"] = urlCopyCell;
      }

      if (eachCol.dataField === "visits") {
        eachCol["formatter"] = visitsCell;
      }
    });

    setCurrentColumns(cloneDeep(editedColumns));
    setShowEditColumnModal(false);
  };

  // const data = (
  //   text
  //     ? list.filter((item: any) => JSON.stringify(item).includes(text))
  //     : list
  // ).sort((a: any, b: any) => b.createdTime - a.createdTime);

  const handleDateChangeEvent = (event: any, picker: any) => {
    // console.log('Handle event')
    // console.log(picker.startDate);
  };

  const handleRowClick = (e: any, row: any) => {
    setCurrentEditData(row);
    setShowEditModal(true);
  };

  const handleDeleteShortLink = () => {
    setConfirmationObj({
      title: "Delete entry ?",
      message:
        "Are you sure you want to delete the entry? This might impact some of your existing modules.",
      delete: true,
      singleEdit: true,
    });

    setShowEditModal(false);
    setShowConfirmation(true);
  };

  const handleEditShortLinkModalClose = () => {
    setShowEditModal(false);
    setCurrentEditData({});
  };

  const handleDateCallback = (start: any, end: any, label: any) => {
    let startDate = new Date(start);
    let endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    startDate.setHours(0, 0, 0, 0);
    console.log(
      new Date(startDate).toISOString(),
      new Date(endDate).toISOString()
    );
    setCurDateRange([start, end]);
    props.handleDateRangeSelection([startDate, endDate]);
  };

  const handleSearch = (event: any) => {
    let search = event?.target?.value.toLowerCase();
    dispatch(setFilterText(search));
  };

  useEffect(() => {
    dispatch(
      getShortLinksList({
        startDate: dates[0].toISOString(),
        endDate: dates[1].toISOString(),
      })
    );
  }, [text]);

  return (
    <div style={{ padding: 20 }} className="short-links">
      <Table
        columns={currentColumns?.filter((o: any) => {
          return !o.hidden;
        })}
        keyField="short_links"
        data={data}
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
            value: list?.length ?? 25,
          },
        ]}
        showAutoRefresh={true}
        autoRefreshComponent={props.autoRefreshComponent}
        handleEditColumns={() => setShowEditColumnModal(true)}
        showEdit={false}
        showSearch={false}
        noDataComponent={
          <p className="no-data-text">You do not have any short links.</p>
        }
        showHeader={true}
        handleRowClick={handleRowClick}
        headerComponent={
          <>
            <Button
              label="Add url"
              onClick={() => {
                props.setCreateDialogOpen(true);
              }}
              type="secondary"
              style={{ marginRight: "8px" }}
            />
            <DateRangePicker
              initialSettings={{
                timePicker: true,
                startDate: moment().subtract(29, "days"),
                endDate: moment(),
                ranges: {
                  Today: [moment(), moment()],
                  Yesterday: [
                    moment().subtract(1, "days"),
                    moment().subtract(1, "days"),
                  ],
                  "Last 7 Days": [moment().subtract(6, "days"), moment()],
                  "Last 30 Days": [moment().subtract(29, "days"), moment()],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                  "Last Month": [
                    moment().subtract(1, "month").startOf("month"),
                    moment().subtract(1, "month").endOf("month"),
                  ],
                },
              }}
              onEvent={handleDateChangeEvent}
              onCallback={handleDateCallback}
            >
              <div className="ushur-field-btn date-range-input">
                <div className="input-group">
                  <input
                    placeholder=""
                    aria-label=""
                    type="text"
                    className="form-control ushur-input search"
                    value={`${curDateRange[0].format(
                      "MM/DD/YY"
                    )} - ${curDateRange[1].format("MM/DD/YY")}`}
                  />
                  <div>
                    <button
                      aria-label=""
                      type="button"
                      className="ushur-btn ushur-secondary-btn medium-btn btn btn-outline-primary btn-lg"
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </button>
                  </div>
                </div>
              </div>
            </DateRangePicker>
            <FieldButton
              className="sl-search"
              buttonIcon={<FontAwesomeIcon icon={faSearch} />}
              hideInput
              tooltipText="Search all records"
              handleInputChange={(event: any) => {
                handleSearch(event);
              }}
            />
          </>
        }
      />

      <ConfirmationModal
        showConfirmationModal={showConfirmation}
        handleModalClose={() => {
          setShowConfirmation(false);
        }}
        confirmationObj={confirmationObj}
        handleConfirmClick={() => {
          dispatch(
            deleteAndGet({
              startDate: dates[0].toISOString(),
              endDate: dates[1].toISOString(),
              surl: currentEditData?.surl,
            })
          );
          setShowConfirmation(false);
        }}
      />

      <SuccessModal
        showSuccessModal={showSuccessModal}
        handleModalClose={() => setShowSuccessModal(false)}
        successMessage={successMessage}
      />

      <ErrorModal
        showErrorModal={showErrorModal}
        handleModalClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />

      <EditShortLinkModal
        showModal={showEditModal}
        data={currentEditData}
        handleDelete={handleDeleteShortLink}
        handleClose={handleEditShortLinkModalClose}
      />

      <EditColumnModal
        setShowEditColumnModal={setShowEditColumnModal}
        showEditColumnModal={showEditColumnModal}
        data={currentColumns}
        handleSaveColumns={handleSaveColumns}
        showDescription={false}
      />
    </div>
  );
};

export default DataTable;
