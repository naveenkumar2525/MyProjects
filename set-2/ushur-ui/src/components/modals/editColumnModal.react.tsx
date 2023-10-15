import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// @ts-ignore
import { Modal, Table, Checkbox } from "@ushurengg/uicomponents";
import { Badge, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { findIndex } from "lodash";

const EditColumnModal = (props: any) => {
  const [currentData, setCurrentData] = useState<any>([]);
  const [currentSelection, setCurrentSelection] = useState<any>([]);
  const [currentColumnData, setCurrentColumnData] = useState<any>([]);
  const [hoverHighlightIndex, setHoverHighlightIndex] = useState(-1);

  const onModalClose = () => {
    props.setShowEditColumnModal(false);
    resetToDefaults();
  };

  const checkMarkCell = (cell: any) => {
    return (
      <i
        className="bi bi-check"
        style={{ color: "#332E20", fontSize: "20px" }}
      ></i>
    );
  };

  const [columns, setColumns] = useState<any>([
    {
      dataField: "timestamp",
      sort: true,
      text: "ON/OFF",
      formatter: checkMarkCell,
      headerStyle: (cell: any) => {
        return { width: "75px" };
      },
      style: (cell: any) => {
        return { width: "75px" };
      },
    },
    {
      dataField: "text",
      sort: true,
      text: "COLUMN NAME",
      headerStyle: (cell: any) => {
        return { width: "200px" };
      },
      style: (cell: any) => {
        return { width: "200px" };
      },
    },
  ]);

  useEffect(() => {
    if (props.data && props.data.length > 0) {
      setCurrentSelection(props.data);
      setCurrentData(props.data);
      setCurrentColumnData(props.data);
    }
  }, [props.data]);

  const handleCheckboxSelection = (curItem: any) => {
    let curItemIndex = findIndex(currentColumnData, (o: any) => {
      return o.text === curItem.text;
    });

    const tempSelections = currentSelection?.map((ele: any) =>
      ele.text == curItem.text ? { ...ele, hidden: !curItem.hidden } : ele)

    setCurrentSelection(tempSelections);

    if (curItemIndex > -1) {
      let changedItem = {
        ...curItem,
        hidden: !curItem.hidden,
      };

      let currentItems: any = [
        ...currentColumnData.slice(0, curItemIndex),
        ...currentColumnData.slice(curItemIndex + 1),
        Object.assign({}, currentColumnData[curItemIndex], changedItem),
      ];

      setCurrentColumnData(currentItems);
    }
  };

  const resetToDefaults = () => {
    setCurrentSelection(props.resetData);
    setCurrentColumnData(props.resetData);
  };

  const handleSaveChanges = () => {
    props.handleSaveColumns(currentColumnData);
  };

  return (
    <Modal
      className="edit-column-modal"
      onHide={onModalClose}
      size="lg"
      title="Edit Table Columns"
      showModal={props.showEditColumnModal}
      closeLabel="Cancel"
      actions={[
        {
          onClick: () => {
            resetToDefaults();
          },
          text: "Reset to defaults",
          type: "secondary",
        },
        {
          onClick: () => {
            handleSaveChanges();
          },
          text: "Save changes",
          type: "primary",
          disabled:currentColumnData?.filter((item: any) => {
            return !item.hidden;
          }).length === 0
        },
      ]}
    >
      <div className="container">
        <div className="row">
          <div className="col">
            <p className="section-title">
              Set the order in which columns appear in the table.
            </p>
          </div>
        </div>

        <div className="row badges-wrap">
          {currentColumnData?.filter((item: any) => {
              return !item.hidden;
            }).map((item: any, i: any) => {
              return (
                <div
                  key={item.text}
                  className="each-column-badge-wrapper"
                  style={{
                    borderLeft:
                      hoverHighlightIndex === i ? "2px solid #2F80ED" : "none"
                  }}
                  draggable={true}
                  onDragStart={(event: any) => {
                    event.dataTransfer.setData(
                      "text/plain",
                      JSON.stringify(item)
                    );
                  }}
                  onDragOver={(event: any) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDragEnter={(event: any) => {
                    if (hoverHighlightIndex !== i) {
                      setHoverHighlightIndex(i);
                    }
                  }}
                  onDrop={(event: any) => {
                    event.preventDefault();
                    const draggedItem = JSON.parse(
                      event.dataTransfer.getData("text/plain")
                    );
                    const newData = [...currentColumnData].filter((i: any) => !i.hidden);
                    let curItemIndex = findIndex(

                      newData,
                      (o: any) => {
                        return o.text === draggedItem.text;
                      }
                    );
                    const item = newData.splice(curItemIndex, 1);
                    newData.splice(i, 0, item?.[0]);
                    const hiddenElementsArr = [...currentColumnData].filter((i: any) => i.hidden);
                    setCurrentColumnData(newData.concat(hiddenElementsArr));
                    setHoverHighlightIndex(-1);
                  }}
                >
                  <Badge
                    key={item.text}
                    bg="light"
                    text="dark"
                    className="each-column-badge"
                  >
                    <span className="position">{i + 1}</span>
                    <span className="text">{item.text}</span>
                    <i className="bi bi-grip-vertical icon"></i>
                  </Badge>
                </div>
              );
            })}
        </div>
      </div>

       <div className="container">
        <div className="row  header-row">
          <div className="col-2" style={{ textAlign: "center" }}>
            ON/OFF
          </div>
          <div className={props.showDescription ? "col-4" : "col-10"}>
            COLUMN NAME
          </div>
          {props.showDescription && <div className="col-6">DESCRIPTION</div>}
        </div>
        {currentSelection?.map((eachItem: any) => {
          return (
            <div className="row body-row">
              <div className="col-2" style={{ textAlign: "center" }}>
                <Checkbox
                  checked={!eachItem.hidden}
                  handleOnChange={() => {
                    handleCheckboxSelection(eachItem);
                  }}
                  label=""
                />
              </div>
              <div className={props.showDescription ? "col-4" : "col-10"}>
                {eachItem.text}
              </div>
              {props.showDescription && (
                <div className="col-6">{eachItem.description}</div>
              )}
            </div>
          );
        })}
      </div>
      {currentColumnData?.filter((item: any) => {
            return !item.hidden;
          }).length === 0 && (<p className="columns-error-msg">Select atleast one column to appear in the table</p>)}
    </Modal>
  );
};

export default EditColumnModal;

EditColumnModal.propTypes = {
  /**
   * Callback for Toggling Modal
   */
  setShowEditColumnModal: PropTypes.func,
  /*
    Flag for showing the modal
  */
  showEditColumnModal: PropTypes.bool,
  /**
   * Data to be displayed. (Parent Column Data)
   */
  data: PropTypes.array,
  /**
   * Data to be reset. 
   */
  resetData: PropTypes.array,
  /**
   * Callback to save the column changges
   */
  handleSaveColumns: PropTypes.func,
  /**
   * Parent Page Name - used to save columns in sesssion
   */
  page: PropTypes.string,
  /**
   * Flag to show Description column
   */
  showDescription: PropTypes.bool,
};