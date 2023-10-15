import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { cloneDeep } from "lodash";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setAutoRefreshOff,
  setAutoRefreshOn,
  getValidationsList,
  validationsList,
  searchText,
  isAutoRefresh,
  dataRefreshState,
  setDataRefreshState,
  pinned,
  setPinned
} from "./ValidationSlice";
// @ts-ignore
import {
  Button,
  Link,
  Modal,
  Dropdown,
  Table as UshurTable,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import "./ValidationDataTable.css";
import Status from "./Status.react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faExpandArrows, faChevronLeft,faChevronRight, faArrowLeft } from "@fortawesome/pro-solid-svg-icons";
import EditColumnModal from "../../components/modals/editColumnModal.react";
import { faSyncAlt, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/pro-regular-svg-icons";


const statusCell = (cell: any, row: any) => {
  return <Status text={cell} />;
};

export const columns = [
  {
    dataField: "status",
    sort: true,
    text: "STATUS",
    formatter: statusCell,
    classes: "name-cell",
    headerStyle: { width: "100px" },
  },
  {
    dataField: "emailId",
    sort: true,
    text: "EMAIL",
    classes: "name-cell",
    headerStyle: { width: "200px" },
  },
  {
    dataField: "processed",
    sort: true,
    text: "DATE PROCESSED",
    classes: "name-cell",
    headerStyle: { width: "200px" },
  }
];
  const exportFields:any = {};
  columns.map((column:any)=>{
    exportFields[column.dataField] = column.text
  })
type ValidationDatatableProps = {
  campaignId: string;
  headerShow: Boolean;
  handleRowClick: (
    ev: any,
    row: any,
    index: any,
    showRecordDetails: boolean,
    pinned:boolean,
    headerShow:boolean
  ) => void;
};
const ValidationDatatable = (props: ValidationDatatableProps) => {
  const validationsRef = React.useRef<HTMLInputElement>(null);
  const { campaignId, handleRowClick, headerShow } = props;
  const isRefresh = useAppSelector(isAutoRefresh);
  const refreshState = useAppSelector(dataRefreshState);
  const list = useAppSelector(validationsList);
  const text = useAppSelector(searchText);
  const dispatch = useAppDispatch();
  const [currentColumns, setCurrentColumns] = useState<any>(columns);
  const [showEditColumnModal, setShowEditColumnModal] = useState<any>(false);
  const pinnedState = useAppSelector(pinned);
  const [selectedIndex,setSelectedIndex] = useState(0);
  const rowSelected = (e: any, row: any, index: any) => {
    let currIndex = list.findIndex((data: any) => data.emailId === row.emailId && data.date === row.date);
    setSelectedIndex(currIndex);
    handleRowClick(e, row, currIndex, true,pinnedState,false);
  };
  const expand = (e: any) => {
    handleRowClick(null, null, null, false,false,true);
  };
  const CollapseTable = () => {
    return (
      <div className="table-expand">
        <FontAwesomeIcon
          icon={faExpandArrows as IconProp}
          size={"sm"}
          color="#609DF0"
          onClick={expand}
        />
      </div>
    );
  };
  const [editTable, setEditTable] = useState<any>(false);
  const setPageSizes = (list:any[]) => {
    const allListPageSize = list?.length ?? 50;
    const pageSizes = [
      {
        text: "50",
        value: 50,
      },
      {
        text: "100",
        value: 100,
      }
    ];
    if(allListPageSize > 0){
      pageSizes.push({
        text: "All",
        value: allListPageSize,
      })
    }

    return pageSizes;
  }
   let pageSizes:any[]=[];

  useEffect(() => {
    if (isRefresh && refreshState === "refreshed") {
      dispatch(setDataRefreshState("idle"));
      setTimeout(
        () =>
          dispatch(
            getValidationsList({
              campaignId: campaignId,
            })
          ),
        1000
      );
    }
  }, [isRefresh, refreshState]);

  useEffect(() => {
    if (campaignId !== "")
      dispatch(getValidationsList({ campaignId: campaignId })).then((campaignList:any)=>{
        pageSizes = setPageSizes(campaignList?.payload);
      });
  }, [campaignId]);

  const reArrangeHeaderWrap = (setColumns: boolean) => {
    // Workaround to get the settings icon to the table header.
    if (validationsRef && validationsRef.current) {
      let tableHeader = validationsRef.current.querySelectorAll('tr.table-header');
      const settingsHeaderWrap = validationsRef.current.querySelectorAll('.header-wrap');

      if (pinnedState) {
        if (settingsHeaderWrap && settingsHeaderWrap[0] && tableHeader && tableHeader[0]) {
          tableHeader[0].classList.add('pinned-header');
          if (tableHeader[0].querySelectorAll('.header-wrap') && tableHeader[0].querySelectorAll('.header-wrap')[0])
            tableHeader[0].removeChild(settingsHeaderWrap[0]);
          tableHeader[0].appendChild(settingsHeaderWrap[0]);
        }
        if (setColumns)
          setCurrentColumns(currentColumns.map((column: any) => {
            if (column.dataField == "emailId") {
              column.hidden = false;
            } else {
              column.hidden = true;
            }
            return column;
          }));
      } else {
        let tableHeaderWrapper = validationsRef.current.querySelectorAll('.ushur-table-wrap');
        const settingsWrapper = tableHeader[0].querySelectorAll('.header-wrap');
        if (tableHeaderWrapper && tableHeaderWrapper[0]
          && tableHeader && tableHeader[0]
          && settingsWrapper && settingsWrapper[0]) {
          if (tableHeader[0].classList.contains('pinned-header'))
            tableHeader[0].classList.remove('pinned-header');
          tableHeaderWrapper[0].prepend(settingsWrapper[0]);
        }
        if (setColumns)
          setCurrentColumns(currentColumns.map((column: any) => {
            column.hidden = false;
            return column;
          }));
      }
    }
  }

  useEffect(() => {
    reArrangeHeaderWrap(true);
  }, [pinnedState]);
  const handleSaveColumns = (editedColumns: any) => {
    let savedCols: any = sessionStorage.getItem("columnsOrder");
    let tempObj: any = {};
    if (savedCols) {
      tempObj = JSON.parse(savedCols);
    }
    tempObj["validation"] = editedColumns;
    sessionStorage.setItem("columnsOrder", JSON.stringify(tempObj));

    setCurrentColumns(cloneDeep(editedColumns));
    setTimeout(() => {
      reArrangeHeaderWrap(false);
    }, 100);
    setShowEditColumnModal(false);
  };
  const HeaderSection = (() => {
    return (<>
      {pinnedState &&
        <>
        <div className="dt-header-row">
        <div className="dt-header-row-first">
          <div className="row-icon">
            <FontAwesomeIcon
              icon={faArrowLeft as IconProp}
              size={"1x"}
              color="#ABB5BE"
              onClick={function showGrid(){
                dispatch(setPinned(false));
                handleRowClick(null,null,null,false,false,true);
              }}
            />
          </div>
          {/* <div className="row-icon-blue">
            <FontAwesomeIcon
              icon={faUsers as IconProp}
              size={"1x"}
              color="#FFF"
              onClick={(e:any)=>{
                dispatch(setPinned(false));
                handleRowClick(null,null,null,true,false,false);
              }}
            />
            </div> */}
            </div>
            <div className="row-button-compact">
          <Button
            startIcon={<FontAwesomeIcon
              icon={faChevronLeft as IconProp}
              size={"1x"}

            />}
            className="no-right-corner"
            onClick={function clickPrevious(){
              const index = selectedIndex-1;
              setSelectedIndex(index)
              handleRowClick(null, list[index], index, true,pinnedState,false);
             }}
            type="secondary"
            disabled={(selectedIndex === 0)}
          />

          <Button
            endIcon={<FontAwesomeIcon
              icon={faChevronRight as IconProp}
              size={"1x"}

            />}
            className="no-left-corner"
            onClick={function clickNext(){
              const index = selectedIndex + 1;
              setSelectedIndex(index);
              handleRowClick(null, list[index], index, true,pinnedState,false);
            }}
            type="secondary"
            disabled={(selectedIndex>=list.length-1)}
          />
          </div>
        </div>
        </>
      }
    </>
    )
  })
  pageSizes = setPageSizes(list);

  return (
    <div className="p-5 validations" ref={validationsRef}>
      <HeaderSection />
      <UshurTable
        keyField="id"
        columns={currentColumns.filter((o: any) => {
          return !o.hidden;
        })}
        data={
          text
            ? list.filter((item: any) => JSON.stringify(item).includes(text))
            : list
        }
        pageSizes={pageSizes}
        showHeader={true}
        showSettings={pinnedState || headerShow}
        showExportOptions={headerShow}
        exportFields={exportFields}
        showEdit={false}
        showSearch={!pinned}
        editTable={editTable}
        showAutoRefresh={headerShow}
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
            className={`refresh-data-dropdown ${
              isRefresh ? "refresh" : "pause"
            }`}
            options={[
              {
                category: "TABLE DATA",
                onClick: () => {
                  // dispatch(setAutoRefreshOff());
                  dispatch(setAutoRefreshOff());
                },
                text: "Pause auto-refresh",
                value: "excel",
              },
              {
                category: "TABLE DATA",
                onClick: () => {
                  // dispatch(setAutoRefreshOn());
                  dispatch(setAutoRefreshOn());
                },
                text: "Enable auto-refresh",
                value: "csv",
              },
              {
                category: "TABLE DATA",
                onClick: () => {
                  dispatch(
                    getValidationsList({
                      campaignId: campaignId,
                    })
                  );
                },
                text: "Fetch Next Batch",
                value: "allRecords",
              },
            ]}
          />
        }
        showCustomHeaderElement={(!headerShow && !pinned)}
        customHeaderElement={<CollapseTable></CollapseTable>}
        handleEditColumns={() => setShowEditColumnModal(true)}
        noDataComponent={() => (
          <div className="nodata">No extractions exist</div>
        )}
        handleRowClick={rowSelected}
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

export default ValidationDatatable;
