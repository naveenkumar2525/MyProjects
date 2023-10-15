import { useState, useEffect } from "react";
// @ts-ignore
import {
  Title,
  Table as IATable,
  Button,
  Dropdown as UshurDropdown,
  DataCard,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import CampaignDropdown from "./CampaignDropdown.react";
import {
  getUshurActivitiesDetails,
  ushurActivitiesDetails,
  currentLastRecordId,
  previousLastRecordId,
  getPaginationCounts,
  totalActivitiesCount,
  ushurActivitiesStats,
  getUshurActivitiesStats,
  getUshurViewJSONDetails,
  list,
} from "../ushurs/ushursSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./InitiatedActivitiesList.css";
import moment from "moment";
import EditColumnModal from "../../components/modals/editColumnModal.react";
import PaginationWithPrevNext from "../../components/PaginationWithPrevNext.react";
import { cloneDeep } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Pill from "../../components/Pill";
import ActivitySummaryModal from "./ActivitySummaryModal.react";
import { IA_STATUS_LABELS } from '../../utils/helpers.utils';
import { getSettingsAPI, globalSettings } from '../variables/variablesSlice';
import { useLocalStorage } from "../../custom-hooks/useLocalStorage";

const pageSizes = [
  {
    text: "10",
    value: 10,
    category: "",
  },
  {
    text: "25",
    value: 25,
    category: "",
  },
  {
    text: "50",
    value: 50,
    category: "",
  },
  {
    text: "100",
    value: 100,
    category: "",
  },
  {
    text: "200",
    value: 200,
    category: "",
  },
];

const metrics = [
  { label: "Initiated", desc: "Total activities that have been launched." },
  {
    label: "Egressed",
    desc: "Total count of activities where initial message has been sent out.",
  },
  {
    label: "Engaged",
    desc: "Total count of activities where we have delivery receipts for the initial message.",
  },
  {
    label: "Completed",
    desc: "Total count of activities that are completed and ended.",
  },
  {
    label: "Expired",
    desc: "Total count of activities that have exceeded time limit and expired before completion.",
  },
];

const EmptyStateComponent = ({ hasWorkflow }: any) => {
  const searchKeyWord = (document.getElementsByClassName('ushur-input')[0] as HTMLInputElement)?.value;
  if (searchKeyWord) {
    return (
      <div className="no-data-text">
        No data found.
      </div>
    );
  }
  if (!hasWorkflow) {
    return (
      <div className="no-data-text">
        You need to select a workflow to view this data.
      </div>
    );
  }
  return (
    <div className="no-data-text">
      You need to launch selected workflow atleast once to view this data.
    </div>
  );
};

const InitiatedActivitiesList = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(globalSettings);
  const ushurActivityDetails = useAppSelector(ushurActivitiesDetails);
  const campaignStats: any = useAppSelector(ushurActivitiesStats);
  // uui_ca_workflow is the key name for local storage workflow value which we use for data persistance in the UI
  const [currentWorkflow, setCurrentWorkflow] = useLocalStorage("uui_ca_workflow", "");
  const [showEditColumnModal, setShowEditColumnModal] = useState<any>(false);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [activityModalOpen, setActivityModalOpen] = useState<boolean>(false);
  const totalRecords = useAppSelector(totalActivitiesCount);
  const [campaignDetails, setCampaignDetails] = useState([]);
  const [pageSize, setPageSize] = useState<any>(10);
  const [pageAction, setPageAction] = useState<string>("none");
  const currentLastRecordId1 = useAppSelector(currentLastRecordId);
  const previousLastRecordId1 = useAppSelector(previousLastRecordId);
  const campaignsList = useAppSelector(list);
  const [EngagementDetails, setEngagementDetails] = useState<any>({});

  const handleWorkflowChange = (workflow: any) => setCurrentWorkflow(workflow);
  const offsetFrom = (currentPage - 1) * pageSize + 1;
  const offsetTo =
    currentPage * pageSize > totalRecords
      ? totalRecords
      : currentPage * pageSize;
  const location: any = useLocation();
  const defaultVal: any = location?.state?.value ?? "";

  useEffect(() => {
    if (defaultVal) {
      handleWorkflowChange(defaultVal);
    }
    dispatch(getSettingsAPI());
  }, []);

  useEffect(() => {
    if (!currentWorkflow) {
      const [recentlyEditedWorkflow] = campaignsList
        ?.filter((ushur: any) => ushur.FAQ !== "true")
        .map((workflow: any) => ({
          ...workflow,
          timestamp: Date.parse(workflow.lastEdited),
        }))
        ?.sort((a: any, b: any) => (a.timestamp > b.timestamp ? -1 : 1));
      if (recentlyEditedWorkflow?.campaignId) {
        setCurrentWorkflow(recentlyEditedWorkflow.campaignId);
      }
    }
  }, [campaignsList]);

  const statusPill = (cell: any, row: any) => {
    const status = row.status;
    return (
      <Pill
        text={row.statusNew}
        className={`ia-status-${status}`}
      />
    );
  };

  const lastFiveActivities = (cell: any) => {
    const reqStatuses = [];
    const columnWidth =
      (document.querySelector('th#latestActivities') as HTMLElement)?.offsetWidth;
    const divEle: any = document.querySelector('#list');
    divEle.innerHTML = "";
    for (let i = 0; i < cell.length; i++) {
      divEle.innerHTML += `<div class="custom-pill rounded-pill">${cell[i]}</div>`;
      // if available space for pills is greater than divEle pills then push the pill
      // 61 indicates n More... ellipses pill width (static value)
      if ((columnWidth - 61) >= divEle.offsetWidth) {
        reqStatuses.push(cell[i]);
      } else if (i === cell.length - 1 && columnWidth >= divEle.offsetWidth) {
        reqStatuses.push(cell[i]);
      } else {
        break;
      }
    }
    return (
      <div className="whitespace-nowrap latest-statuses-wrapper">
        {reqStatuses.map((item: any, index: number) => <Pill text={item} key={index} />)}
        {
          (cell.length - reqStatuses.length > 0) && <Pill showTooltip={true} tooltipText={cell.slice(reqStatuses.length).join(", ")} text={`${cell.length - reqStatuses.length} More...`} />
        }
      </div>
    );
  }

  //Table Columns
  const Columns = [
    {
      dataField: "userName",
      sort: false,
      text: "Name",
      editable: false,
      hidden: false,
      headerStyle: () => {
        return { width: "11%" };
      },
    },
    {
      dataField: "userPhoneNo",
      sort: false,
      text: "Phone",
      hidden: false,
      headerStyle: () => {
        return { width: "11%" };
      },
    },
    {
      dataField: "userEmail",
      sort: false,
      text: "Email",
      hidden: false,
      headerStyle: () => {
        return { width: "15%" };
      },
    },
    {
      dataField: "createdOn",
      sort: false,
      text: "Launch Time",
      hidden: false,
      headerStyle: () => {
        return { width: "15%" };
      },
    },
    {
      dataField: "updatedOn",
      sort: false,
      text: "Last Response",
      hidden: false,
      headerStyle: () => {
        return { width: "11%" };
      },
    },
    {
      dataField: "statusNew",
      sort: false,
      text: "Status",
      hidden: false,
      formatter: statusPill,
      headerStyle: () => {
        return { width: "10%" };
      },
    },
    {
      dataField: "latestActivities",
      sort: false,
      text: "Latest 5 Activities",
      hidden: false,
      formatter: lastFiveActivities,
      headerAttrs: {
        id: 'latestActivities'
      }
    },
    {
      dataField: "requestId",
      sort: false,
      text: "RequestId",
      hidden: true,
      headerStyle: () => {
        return { width: "10%" };
      },
    },
  ];

  const [currentColumns, setCurrentColumns] = useState<any>(Columns);

  const getStats = () => {
    if (currentWorkflow) {
      dispatch(
        getUshurActivitiesStats({
          campaignId: currentWorkflow,
        })
      );
    }
  };

  const getInitiatedActivitiesList = (refesh = false) => {
    let action = pageAction;
    if (refesh) {
      action = "none";
    }
    dispatch(
      getUshurActivitiesDetails({
        campaignId: currentWorkflow,
        lastRecordId:
          action === "next"
            ? currentLastRecordId1
            : action === "prev"
              ? previousLastRecordId1
              : "",
        pageSize,
        pageAction: action,
      })
    );
  };
  //
  useEffect(() => {
    if (currentWorkflow) {
      getStats();
      dispatch(
        getUshurViewJSONDetails({
          campaignId: currentWorkflow,
        })
      );
      dispatch(
        getUshurActivitiesDetails({
          campaignId: currentWorkflow,
          pageSize,
        })
      );
      setCurrentPage(1);
      setPageAction("none");
    }
  }, [currentWorkflow]);

  //Update the table with Initiated activity details
  useEffect(() => {
    if (currentWorkflow) {
      setCampaignDetails(ushurActivityDetails);
      dispatch(
        getPaginationCounts({
          campaignId: currentWorkflow,
          initialRecordId: ushurActivityDetails?.results?.[0]?._id || "",
        })
      );
    }
  }, [ushurActivityDetails]);

  const handleEditColumns = () => {
    setShowEditColumnModal(true);
  };
  const handleSaveColumns = (editedColumns: any) => {
    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = JSON.parse(savedCols);
    if (!tempObj) {
      tempObj = {};
    }
    tempObj["ia"] = editedColumns;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));
    editedColumns.forEach((eachCol: any) => {
      if (eachCol.dataField === "status") {
        eachCol["formatter"] = statusPill;
      }
    });
    setCurrentColumns(cloneDeep(editedColumns));
    // Below two lines are to reset and set data which is required to display activity pills data correctly  wrt to add / remove table columns 
    setCampaignDetails([]);
    setTimeout(() => {
      setCampaignDetails(ushurActivityDetails);
    }, 0);
    setShowEditColumnModal(false);
  };
  const handlePageChange = (page: any, action: string) => {
    setCurrentPage(page);
    setPageAction(page === 1 ? "none" : action);
  };

  useEffect(() => {
    if (currentWorkflow) {
      getInitiatedActivitiesList();
    }
  }, [pageSize, currentPage]);
  const handleRefresh = () => {
    if (currentWorkflow) {
      setPageAction("none");
      setCurrentPage(1);
      getInitiatedActivitiesList(true);
      getUpdatedData();
    }
  };
  const getUpdatedData = () => {
    if (currentWorkflow) {
      getInitiatedActivitiesList(true);
      getStats();
      dispatch(
        getUshurViewJSONDetails({
          campaignId: currentWorkflow,
        })
      );
    }
  };
  const handleRowClick = (e: any, row: any) => {
    getInitiatedActivitiesList(true);
    setEngagementDetails(row);
    setActivityModalOpen(true);
  };
  return (
    <div className="p-3 initiated-activities-list">
      <div className="container-fluid p-3">
        <div className="row m-0 mb-3">
          <div className="col-12 p-0">
            <Title
              subText="View details around specific campaigns"
              text="Campaign Analytics"
            />
          </div>
        </div>
        <div className="row m-0 mb-3">
          <div className="col-12 p-0 flex">
            <CampaignDropdown
              handleWorkflowChange={handleWorkflowChange}
              currentWorkflow={currentWorkflow}
            />
            {currentWorkflow &&
              metrics.map((metric: any) => {
                const statsKey = metric.label;
                return (
                  <OverlayTrigger
                    placement="bottom"
                    trigger="hover"
                    overlay={
                      <Tooltip id="tooltip-top" className="ia-stats-tooltip">
                        {metric.desc}
                      </Tooltip>
                    }
                  >
                    <div className='each-data-card'>
                      <DataCard
                        data={currentWorkflow ? campaignStats[statsKey] : "-"}
                        label={IA_STATUS_LABELS[statsKey]}
                        className={`data-card ${statsKey}`}
                      />
                    </div>
                  </OverlayTrigger>
                );
              })}
          </div>
        </div>
        <div className="row m-0 mb-3">
          <div className="col-12 p-0">
            <div className="card" style={{ width: "100%", border: 0 }}>
              <div className="card-body ">
                <IATable
                  className="campaign-table"
                  showSearch={true}
                  showAutoRefresh={true}
                  handleRowClick={handleRowClick}
                  autoRefreshComponent={
                    <span className="ushur-dropdown button">
                      <Button
                        type="secondary"
                        label={<FontAwesomeIcon icon={faSyncAlt} />}
                        tooltipText="Refresh"
                        onClick={handleRefresh}
                        style={{
                          background: "#F5F5F5",
                          fontSize: "12px",
                        }}
                        className="dropdown-toggle"
                      />
                    </span>
                  }
                  columns={currentColumns
                    .filter((o: any) => {
                      return !o.hidden;
                    })
                    .map((obj: any) => ({ ...obj, sort: false }))}
                  showExportOptions={false}
                  keyField="id"
                  data={campaignDetails}
                  noDataComponent={
                    <EmptyStateComponent hasWorkflow={currentWorkflow} />
                  }
                  showHeader={true}
                  handleEditColumns={handleEditColumns}
                  paginationSize={pageSize}
                ></IATable>
                <div id="list" className="temp-div-statuses"></div>
                {totalRecords > 0 && (
                  <div className="custom-pagination">
                    <span className="show-entries">
                      Showing entries {offsetFrom}-{offsetTo} of {totalRecords}
                    </span>
                    <PaginationWithPrevNext
                      currentPage={currentPage}
                      totalRecords={totalRecords}
                      onPageChange={handlePageChange}
                      offsetTo={offsetTo}
                    />
                    <div className="page-sizes-wrap">
                      <span>Show</span>
                      <UshurDropdown
                        title={pageSize}
                        options={pageSizes.map((item: any) => ({
                          ...item,
                          onClick: () => {
                            if (currentPage * item.value > totalRecords) {
                              setCurrentPage(1);
                              setPageAction("none");
                            }
                            setPageSize(item.value);
                          },
                        }))}
                        className="variable-type-dropdown"
                        name="page-size"
                      />
                      <span>entries</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <EditColumnModal
          setShowEditColumnModal={setShowEditColumnModal}
          showEditColumnModal={showEditColumnModal}
          data={currentColumns}
          resetData={Columns}
          handleSaveColumns={handleSaveColumns}
          page="contact"
          showDescription={true}
        />
        <ActivitySummaryModal
          engagementDetails={EngagementDetails}
          isOpen={activityModalOpen}
          handleModalClose={setActivityModalOpen}
          engagementHistoryView={settings.data?.engagementHistoryView}
          handleModalRefresh={getUpdatedData}
        />
      </div>
    </div>
  );
};
export default InitiatedActivitiesList;
