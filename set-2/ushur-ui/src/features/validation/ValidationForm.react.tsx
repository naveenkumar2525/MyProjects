import React, { useState, useEffect, useRef } from "react";
import { getValidationsDetails, validationDetails, validationsList, pinned, setPinned } from "./ValidationSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./Validation.css";
import {
  Button,
  Input,
  Dropdown,
  FieldButton
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faChevronLeft, faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { getGroupType } from "./ValidationUtils";

type InputType = typeof Input;

type ValidationFormProps = {
  campaignId: string;
  sessionId: string;
  searchText: string;
  searchedFrom: string;
  fieldsArray: any[];
  onMouseEnter: (ev: any, value: string, span_information: any, type: string, valueObj: any) => void;
  handleRowClick: (
    ev: any,
    row: any,
    index: any,
    showRecordDetails: boolean,
    pinned: boolean,
    showHeader: boolean
  ) => void;
  updateSessionId: (sessionId: string) => void;
  isRowClicked: boolean;
};

const ValidationForm = (props: ValidationFormProps) => {
  const { campaignId, sessionId, onMouseEnter, handleRowClick, fieldsArray, isRowClicked } = props;
  const details = useAppSelector(validationDetails);
  const dispatch = useAppDispatch();
  const myRefs = useRef([]);
  const valList = useAppSelector(validationsList);
  const pinnedState = useAppSelector(pinned);
  const [sessionID, setSessionID] = useState(props.sessionId);
  const [selectedValidationText, setSelectedValidationText] = useState("");
  const [previousEnabled, setPreviousEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [hideText, setHideText] = useState(false);
  const [filteredFields, setFilteredFields] = useState<any>([]);
  const lengthLimit = 3;
  useEffect(() => {
    if (sessionId && sessionId !== "") {
      setSessionID(sessionId);
      let selectedValText = valList?.find((item: any) => item.sessionId == sessionId)?.text;
      setSelectedValidationText(selectedValText);
      checkSessionId({ sessionId: sessionId });
      dispatch(
        getValidationsDetails({ campaignId: campaignId, sessionId: sessionId })
      );
    }
  }, [campaignId, sessionId]);

  const extracted_data = details && details.length > 0 ? details[0]?.extracted_data ?? [] : [];
  useEffect(() => {
    if (filteredFields?.length < 1 || isRowClicked) //This is used for populating the filtered fields array initially only
      setFilteredFields(fieldsArray);
  }, [fieldsArray]);
  const refs = useRef<InputType>(
    Array.from({ length: extracted_data.length }, (a) =>
      React.createRef<InputType>()
    )
  );
  const sortNulls = (() => {
    return function (a: any, b: any) {
      // equal items sort equally
      if (a.value === b.value) {
        return 0;
      }
      // nulls sort after anything else
      else if (a.value === null || a.value === "") {
        return 1;
      } else if (b.value === null || b.value === "") {
        return -1;
      }
      return 0;
    };
  })
  const checkSessionId = ((obj: any) => {
    const index = valList?.findIndex((a: any) => a.sessionId == obj.sessionId);
    setPreviousEnabled((index != 0));
    setNextEnabled((index < (valList?.length - 1)));

  });
  const movePreviousNext = ((index: number) => {
    const sessID = valList[index].sessionId;
    props.updateSessionId(sessID);
    setFilteredFields([]);
    let selectedValText = valList?.find((item: any) => item.sessionId == sessID).text;
    setSelectedValidationText(selectedValText);
    checkSessionId({ sessionId: sessID });
    dispatch(
      getValidationsDetails({ campaignId: campaignId, sessionId: sessID })
    );
  });
  const HeaderSection = (() => {
    return (<>
      {!pinnedState &&
        <>
          <div className="dt-header-row">
            <div className="row-icon">
              <FontAwesomeIcon
                icon={faArrowLeft as IconProp}
                size={"1x"}
                color="#ABB5BE"
                onClick={function showGrid() {
                  handleRowClick(null, null, null, false, pinnedState, true);
                }}
              />
            </div>
            <Dropdown
              data-testid="validation-text-dropdown"
              title={<>
                      <FontAwesomeIcon icon={faUser as IconProp} 
                        size={"1x"} color="rgba(65, 65, 65, 1)" /> &nbsp;
                      {selectedValidationText}
                      </> || <>&nbsp;</>}
              options={valList.map((item: any) => ({
                text: item.text,
                value: item.value,
                category: '',
                onClick: () => {
                  props.updateSessionId(item.value);
                  setFilteredFields([]);
                  setSelectedValidationText(item.text);
                  checkSessionId(item);
                  dispatch(
                    getValidationsDetails({ campaignId: campaignId, sessionId: sessionID })
                  );
                },
              }))}
              className="variable-type-dropdown"
              name="type"
            />
            <div className="row-button-compact">
              <Button
                startIcon={<FontAwesomeIcon
                  icon={faChevronLeft as IconProp}
                  size={"1x"}

                />}
                className="no-right-corner"
                onClick={function clickPrevious() {
                  const index = valList.findIndex((a: any) => a.sessionId == sessionID);
                  movePreviousNext(index - 1);
                }}
                type="secondary"
                disabled={!previousEnabled}
              />

              <Button
                endIcon={<FontAwesomeIcon
                  icon={faChevronRight as IconProp}
                  size={"1x"}

                />}
                className="no-left-corner"
                onClick={function clickNext() {
                  const index = valList?.findIndex((a: any) => a.sessionId == sessionID);
                  movePreviousNext(index + 1);
                }}
                type="secondary"
                disabled={!nextEnabled}
              />
            </div>
          </div>
          {/* <div className="dt-header-row">
            <div className="dt-header-row-first">
              <div className="row-icon">
                <FontAwesomeIcon
                  icon={faArrowLeft as IconProp}
                  size={"1x"}
                  color="#ABB5BE"
                  onClick={function showGrid() {
                    handleRowClick(null, null, null, false, pinnedState, true);
                  }}
                />
              </div>
              <div className="row-icon-dark">
                <FontAwesomeIcon
                  icon={faUsers as IconProp}
                  size={"1x"}
                  color="#609DF0"
                  onClick={(e: any) => {
                    handleRowClick(null, null, null, false, true, false)
                    dispatch(setPinned(true))
                  }}
                />
              </div>
            </div>
            <div className="row-button">
              <Button
                startIcon={<FontAwesomeIcon
                  icon={faArrowLeft as IconProp}
                  size={"1x"}

                />}
                label="Previous"
                className="no-right-corner"
                onClick={function clickPrevious() {
                  const index = valList.findIndex((a: any) => a.sessionId == sessionID);

                  movePreviousNext(index - 1);

                }}
                type="secondary"
                disabled={!previousEnabled}
              />

              <Button
                endIcon={<FontAwesomeIcon
                  icon={faArrowRight as IconProp}
                  size={"1x"}

                />}
                label="Next"
                onClick={function clickNext() {
                  const index = valList?.findIndex((a: any) => a.sessionId == sessionID);
                  movePreviousNext(index + 1);

                }}
                className="no-left-corner"
                type="secondary"
                disabled={!nextEnabled}
              />
            </div>
          </div> */}
        </>
      }
    </>
    )
  })
  return (
    <div className="validation-form-text">
      <HeaderSection />
      <div className="form-search-section">
        <FieldButton
          buttonClick={() => {
            setHideText(true);
          }}
          handleClearSearch={(e: any) => {
            setHideText(false);
            e.target.blur(); // To make sure if the text is removed, the focus should go off to make sure the textbox to enter search text hides
          }}
          handleInputChange={(e: any) => {
            const value = e.target.value;
            let filteredFieldsArray = [];
            if (value.length >= lengthLimit) {
              filteredFieldsArray = [...fieldsArray].filter((obj) => { return obj?.label.toString().includes(value.toString()) || obj?.value?.value.toString().includes(value.toString()) });
              setFilteredFields(filteredFieldsArray);
            } else {
              setFilteredFields([...fieldsArray]);
            }

          }}
          buttonIcon={<i className="bi bi-search" />}
          tooltipText="Search All"
          type="search"
          hideInput={true}
        />
        <div className={`text-display ${hideText ? "display-none" : ""}`}>
          <span style={{ fontWeight: "bold" }}>{filteredFields.length} fields</span> were extracted from this engagement.
        </div>
      </div>
      <div className="form-variables pr-2">
        {
          filteredFields.sort(sortNulls).map((field: any, index: number) => {
            if ((props.searchText.toString() === field?.value?.value?.toString() 
                  && field?.type === 'DATA EXTRACTION' && !field?.value?.file_name) || 
              (props.searchText.toString() === field?.value?.value?.toString() 
                  && field?.type === 'DISA' && field?.value?.file_name === props.searchedFrom.toString())) {
              refs.current[index].scrollIntoView({ behavior: "smooth", inline: "nearest" });
              refs.current[index]?.classList.add('hover-triggered');
            } else {
              refs.current[index]?.classList?.remove('hover-triggered');
            }
            return (
              <div className="pb-3"
                onClick={(ev: any) => {
                  let spanValue = (filteredFields[index].type === 'DISA' ? filteredFields[index].value.span :
                    filteredFields[index].value.span_information) ?? '';
                  onMouseEnter(
                    ev,
                    filteredFields[index].value.value,
                    spanValue,
                    filteredFields[index].type,
                    filteredFields[index].value
                  );
                }}
              >
                <Input
                  innerRef={(el: any) => {
                    refs.current[index] = el;
                  }}
                  id={index}
                  label={<span className={getGroupType(field?.value?.value)}>
                    {field.label}
                    <FontAwesomeIcon icon={faBookmark as IconProp} size={"1x"} />
                  </span>}
                  value={field.value.value}
                  disabled
                />
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default ValidationForm;
