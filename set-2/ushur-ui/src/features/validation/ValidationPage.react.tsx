import { useState, useEffect, useRef } from "react";
import "./Validation.css";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import ValidationDataTable from "./ValidationDataTable.react";
import ValidationForm from "./ValidationForm.react";
import ValidationPhrase from "./ValidationPhrase.react";
import WorkflowSelect from "../../components/WorkflowSelect.react";
// @ts-ignore
import { Title, Tabs } from "@ushurengg/uicomponents";
import { ushursList, getUshursAsync } from "../ushurs/ushursSlice";
import {
  getValidationsDetails,
  validationDetails,
  searchText,
  setPinned,
  validationsList,
  searchedFrom,
} from "./ValidationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faExternalLink,
  faEnvelope,
  faFilePdf,
} from "@fortawesome/pro-solid-svg-icons";
import PdfViewer from "./PdfViewer.react";
import { getTokenId, getUrl } from "../../utils/api.utils";
import { getGroupColor, getGroupType } from "./ValidationUtils";

const ValidationPage = () => {
  const list = useAppSelector(ushursList);
  const [gridWidth, setGridWidth] = useState("100%");
  const [displayGrid, setDisplayGrid] = useState("block");
  const [sectionWidth, setSectionWidth] = useState("0%");
  const [showDetails, setShowDetails] = useState("none");
  const [campaignId, setcampaignId] = useState("");
  const searchedText = useAppSelector(searchText);
  const searchedFile = useAppSelector(searchedFrom);
  const [sessionId, setSessionId] = useState("");
  const [searchWords, setSearchWords] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const dispatch = useAppDispatch();
  const [selectedEmail, setSelectedEmail] = useState("");
  const [fieldsDataArray, setFieldsArray] = useState([]);
  const [tabsDataSet, setTabsDataSet] = useState([]);
  const [pdfInformation, setPdfInformation]: any[] = useState([]);
  const [tabEventKey, setTabEventKey] = useState("email");
  const [leftSpan, setLeftSpan] = useState("");
  const [rightSpan, setRightSpan] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [isRowClicked, setIsRowClicked] = useState(false);
  const [activateDropdown, setActivateDropdown] = useState(false);
  const valList = useAppSelector(validationsList);
  const details = useAppSelector(validationDetails);
  const searchWordsInitialValue: string[] = [];
  const validationPhraseRef = useRef<HTMLDivElement>(null);
  const [searchEmailWordsArrInfo, setSearchEmailWordsArrInfo] = useState(
    searchWordsInitialValue
  );
  const [searchPDFWordsArrInfo, setSearchPDFWordsArrInfo] = useState([
    {
      id: "",
      span: "",
      keyword: "",
      keyword_type: "",
      highlightKeyword: "",
      matchCase: false,
      typeColor: "",
      pageIndex: 0,
      file_name: "",
    },
  ]);
  useEffect(() => {
    dispatch(getUshursAsync());
    if (campaignId && campaignId !== "" && sessionId && sessionId !== "") {
      dispatch(
        getValidationsDetails({ campaignId: campaignId, sessionId: sessionId })
      );
    }
  }, []);
  let fieldsArray: any = [];
  let tabsData: any = [];
  let fileInformation: any[] = [];

  const setActiveTab = (eventKey: string) => {
    setTabEventKey(eventKey);
  };

  const updateSessionId = (sessionId: string) => {
    setSessionId(sessionId);
    setSelectedEmail(
      valList?.find((item: any) => item.sessionId == sessionId)?.emailId
    );
    if (campaignId && campaignId !== "" && sessionId && sessionId !== "") {
      dispatch(
        getValidationsDetails({ campaignId: campaignId, sessionId: sessionId })
      );
    }
    setTabEventKey("email");
    if (document.getElementById("email")) {
      document.getElementById("email")?.click();
      triggerDocDropdown();
    }
  };

  const TabText = (props: any) => {
    let icon = faEnvelope as IconProp;
    if (props.type !== "email") icon = faFilePdf as IconProp;
    return (
      <div
        className="validationtabs"
        tabIndex={props.key}
        onClick={() => {
          setActiveTab(props.key);
        }}
      >
        <FontAwesomeIcon icon={icon} size={"1x"} color="#2F80ED" />
        <div
          className="validationtabstext"
          id={props.type !== "email" ? props.text : "email"}
          title={props.text}
        >
          {props.text}
        </div>
      </div>
    );
  };

  const hideDropdownShow = () => {
    setTimeout(() => {
      const docInput = document.querySelector("[data-testid='doc']");
      const dropdownInput =
        docInput?.getElementsByClassName("dropdown-menu show");
      if (dropdownInput && dropdownInput.length > 0) {
        dropdownInput[0].classList.remove("show");
      }
    }, 100);
  };

  const triggerDocDropdown = () => {
    setTimeout(() => {
      if (document.getElementById("Documents")) {
        document.getElementById("Documents")?.click();
        hideDropdownShow();
      }
    }, 500);
  };

  useEffect(() => {
    if (activateDropdown) {
      triggerDocDropdown();
      setActivateDropdown(false);
    }
  }, [activateDropdown]);

  const processValidationDetails = (validationDetailsInput: any) => {
    let emailSearchWords: any[] = [],
      pdfSearchWords: any[] = [];
    validationDetailsInput.forEach((currDetail: any) => {
      currDetail?.extracted_data.forEach((extracted_item: any) => {
        //Array item extracted_data
        Object.keys(extracted_item).forEach((extracted_item_attribute: any) => {
          //dataEx_rfp_ontology
          extracted_item[extracted_item_attribute].forEach(
            (extracted_item_attribute_item: any) => {
              //Array Item of dataEx_rfp_ontology
              Object.keys(extracted_item_attribute_item).forEach(
                (extracted_item_attribute_item_attribute: any) => {
                  //Group
                  let extracted_item_attribute_item_attribute_item =
                    extracted_item_attribute_item[
                      extracted_item_attribute_item_attribute
                    ];
                  Object.keys(
                    extracted_item_attribute_item_attribute_item
                  ).forEach(
                    (
                      extracted_item_attribute_item_attribute_item_attribute: any
                    ) => {
                      //group_city
                      let key =
                        extracted_item_attribute_item_attribute_item_attribute;
                      extracted_item_attribute_item_attribute_item[
                        extracted_item_attribute_item_attribute_item_attribute
                      ].forEach((finalObj: any) => {
                        if (finalObj.value !== "") {
                          let fieldItem: any = {
                            label: key,
                            value: finalObj,
                            type: currDetail.type,
                          };
                          fieldsArray.push(fieldItem);
                          if (currDetail?.type === "DATA EXTRACTION") {
                            emailSearchWords.push(finalObj?.value);
                          } else if (currDetail?.type === "DISA") {
                            let spanArr = finalObj?.span.toString().split("\n");
                            let keyword_to_search = spanArr.find(
                              (span: any) => {
                                return span.includes(finalObj?.value);
                              }
                            );
                            // if (!pdfSearchWords.filter((pdfWord: any) => pdfWord?.file_name.toString() === finalObj?.file_name?.toString() &&
                            //   pdfWord?.highlightKeyword.toString() === finalObj?.value.toString()).length) {
                            pdfSearchWords.push({
                              highlightKeyword: finalObj?.value.toString(),
                              span: finalObj?.span.toString(),
                              keyword: finalObj?.value.toString(),
                              matchCase: false,
                              typeColor: getGroupColor(
                                finalObj?.value.toString(),
                                false
                              ),
                              pageIndex: finalObj?.page_no,
                              file_name: finalObj?.file_name,
                              keyword_type: getGroupType(
                                finalObj?.value.toString()
                              ),
                              id: "",
                            });
                            // }
                          }
                        }
                      });
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
    setSearchEmailWordsArrInfo(emailSearchWords);
    setSearchPDFWordsArrInfo(pdfSearchWords);
    setFieldsArray(fieldsArray);
    setIsRowClicked(true);
    setActivateDropdown(true);
  };

  useEffect(() => {
    if (details && details.length > 0) {
      fieldsArray = [];
      processValidationDetails(details);
    } else {
      setSearchEmailWordsArrInfo([]);
      setSearchPDFWordsArrInfo([]);
      setFieldsArray([]);
      setIsRowClicked(true);
    }
  }, [details]);

  const processPdfArrayInfo = (file: any) => {
    let pdfFileUrl =
      getUrl("downloadAsset") + file?.asset_id + "?token=" + getTokenId();
    let currFileSearchWords: any[] = [];
    searchPDFWordsArrInfo.forEach((searchWords, index) => {
      if (searchWords.file_name === file.name) {
        searchWords.id = "highlight-" + searchWords?.file_name + "-" + index;
        currFileSearchWords.push(searchWords);
      }
    });
    return {
      pdfFileUrl: pdfFileUrl,
      currFileSearchWords: currFileSearchWords,
    };
  };

  useEffect(() => {
    if (fieldsDataArray && fieldsDataArray.length > 0) {
      tabsData = [];
      setTabsDataSet(tabsData);
      tabsData.push({
        component: (
          <ValidationPhrase
            campaignId={campaignId}
            sessionId={sessionId}
            searchWords={searchWords}
            fieldsArray={fieldsDataArray}
            overallSearchWords={searchEmailWordsArrInfo}
            leftSpan={leftSpan}
            rightSpan={rightSpan}
          ></ValidationPhrase>
        ),
        eventKey: "email",
        title: (
          <TabText
            type="email"
            key="email"
            title={selectedEmail}
            text={selectedEmail}
          />
        ),
      });
      fieldsDataArray
        .filter((field: any) => field.type === "DISA")
        .forEach((fieldData: any) => {
          if (
            fileInformation.filter(
              (file: any) => file.name === fieldData.value.file_name
            ).length === 0
          ) {
            fileInformation.push({
              asset_id: fieldData.value.asset_id,
              name: fieldData.value.file_name,
            });
          }
        });
      setPdfInformation(fileInformation);
      let clientWidth =
        validationPhraseRef.current?.getBoundingClientRect().width ?? 0;
      let tabsShowCount = Math.floor(clientWidth / 200);
      // Let's subtract the email and get the tab count.
      let tabDropdownCount = fileInformation.length + 1 - (tabsShowCount - 1);
      let dropdownData =
        tabDropdownCount > 0 ? fileInformation.slice(-tabDropdownCount) : [];
      let fileTabCount =
        tabDropdownCount > 0
          ? fileInformation.length - tabDropdownCount
          : fileInformation.length;
      for (let index = 0; index < fileTabCount; index++) {
        const file = fileInformation[index];
        const pdfTabsInfo = processPdfArrayInfo(file);
        tabsData.push({
          title: <TabText type="pdf" text={file.name} key={"doc" + index} />,
          eventKey: "doc" + index,
          component: (
            <PdfViewer
              searchText={pdfTabsInfo.currFileSearchWords}
              hoveredSearchText={searchWords}
              fileUrl={pdfTabsInfo.pdfFileUrl}
              initialPage={currentPageIndex - 1}
            />
          ),
        });
      }
      if (dropdownData.length > 0) {
        tabsData.push({
          eventKey: "doc",
          title: <TabText type="pdf" text="Documents" />,
          type: "dropdown",
          items: dropdownData.map((file, index) => {
            const pdfInfo = processPdfArrayInfo(file);
            return {
              title: <TabText type="pdf" text={file.name} />,
              eventKey: "doc" + (fileTabCount + index),
              component: (
                <PdfViewer
                  searchText={pdfInfo.currFileSearchWords}
                  hoveredSearchText={searchWords}
                  fileUrl={pdfInfo.pdfFileUrl}
                  initialPage={currentPageIndex - 1}
                />
              ),
            };
          }),
        });
      }
      setTabsDataSet(tabsData);
    } else {
      setTabsDataSet([]);
    }
  }, [
    searchEmailWordsArrInfo,
    searchPDFWordsArrInfo,
    fieldsDataArray,
    searchWords,
    leftSpan,
    rightSpan,
  ]);

  const handleRowClick = (
    ev: any,
    row: any,
    index: any,
    showRecordDetails: boolean,
    pinned: boolean,
    headerShow: boolean
  ) => {
    if (pinned) {
      setGridWidth("20%");
      setSectionWidth("80%");
      setShowDetails("flex");
      if (row && row.sessionId) {
        setSelectedEmail(
          valList?.find((item: any) => item.sessionId == row.sessionId)?.emailId
        );
        setSessionId(row.sessionId);
      }
      setDisplayGrid("block");

      /*This code is a temporary fix and should be removed and the styling shpuld behandled in Datatable: start*/
      let element = document.querySelector(".react-bootstrap-table-pagination");
      element?.classList.add("pinned");
      element = document.querySelector(
        ".react-bootstrap-table-pagination > div:first-child"
      );
      element?.classList.add("pinned");
      /*This code is a temporary fix and should be removed and the styling shpuld behandled in Datatable: end*/

      return;
    } else {
      /*This code is a temporary fix and should be removed and the styling shpuld behandled in Datatable: start*/
      let element = document.querySelector(".react-bootstrap-table-pagination");
      element?.classList.remove("pinned");
      element = document.querySelector(
        ".react-bootstrap-table-pagination > div:first-child"
      );
      element?.classList.remove("pinned");
      /*This code is a temporary fix and should be removed and the styling shpuld behandled in Datatable: end*/
    }
    if (showRecordDetails) {
      setGridWidth("0%");
      setSectionWidth("100%");
      setShowDetails("flex");
      if (row && row.sessionId) {
        setSelectedEmail(
          valList?.find((item: any) => item.sessionId == row.sessionId)?.emailId
        );
        setSessionId(row.sessionId);
      }
      setDisplayGrid("none");
      dispatch(setPinned(false));
    } else {
      setGridWidth("100%");
      setSectionWidth("0");
      setShowDetails("none");
      setDisplayGrid("block");
    }
    setShowHeader(headerShow.valueOf());
  };
  const onMouseEnter = (
    ev: any,
    value: string,
    span_information: any,
    type: string,
    valueObj: any
  ) => {
    setLeftSpan(span_information?.left_span);
    setRightSpan(span_information?.right_span);
    setSearchWords("");
    setTimeout(() => {
      setSearchWords(value);
    }, 10);
    let fileIndex = pdfInformation.findIndex(
      (file: any) => file.asset_id === valueObj?.asset_id
    );
    if (type === "DISA") {
      setTabEventKey("doc" + fileIndex);
      setCurrentPageIndex(valueObj?.page_no);
      if (document.getElementById(valueObj?.file_name)) {
        triggerDocDropdown();
        document.getElementById("doc")?.click();
        document.getElementById(valueObj?.file_name)?.click();
      }
    } else {
      setTabEventKey("email");
      if (document.getElementById("email")) {
        document.getElementById("email")?.click();
      }
    }
  };
  const onMouseLeave = (ev: any) => {
    setSearchWords("");
    setLeftSpan("");
    setRightSpan("");
  };

  let tempArr: any = [];
  list.map((eachItem: any) => {
    let tempObj = {
      text: eachItem.campaignId,
      description: eachItem.campaignId,
      value: eachItem.campaignId,
      onClick: (ev: any, val: string) => {
        setcampaignId(ev.currentTarget.innerText);
      },
    };

    tempArr.push(tempObj);
  });
  return (
    <div style={{ padding: 20 }} className="validations-page">
      <Title
        subText="View, analyze, and download workflow activities and customer responses."
        text="Validation Queue"
      />
      <div className="validation-header">
        <div className="validation-edit-dc">
          <WorkflowSelect
            onSelect={(campaignId) => {
              dispatch(setPinned(false));
              setcampaignId(campaignId);
              handleRowClick(null, null, null, false, false, true);
            }}
          />
          <div
            data-testid="campaign-link"
            className="campaign-link-box"
            style={{ cursor: campaignId ? "pointer" : "not-allowed" }}
            onClick={() => {
              if (campaignId) {
                window.open("/mob3.0/mobGraph/#" + campaignId, "_blank");
              }
            }}
          >
            <FontAwesomeIcon
              icon={faExternalLink as IconProp}
              size={"1x"}
              color="#609DF0"
            />
          </div>
        </div>
        <div style={{ width: "75%" }}>
          <div className="validation-edit-dc phrase-type">
            <div className="key-phrase">{"KEY"}</div>
            <div className="validation-highlighter-text display-phrase">
              {"Text"}
            </div>
            <div className="validation-highlighter-acronym display-phrase">
              {"Acronym"}
            </div>
            <div className="validation-highlighter-number display-phrase">
              {"Has Number"}
            </div>
            <div className="validation-highlighter-special-character display-phrase">
              {"$, #, %"}
            </div>
          </div>
        </div>
      </div>
      <div className="validation-body">
        <div
          style={{
            backgroundColor: "white",
            margin: "12px 0px",
            borderRadius: 5,
            width: gridWidth,
            display: displayGrid,
          }}
        >
          <ValidationDataTable
            handleRowClick={handleRowClick}
            headerShow={showHeader}
            campaignId={campaignId}
          />
        </div>

        <div
          className="validation-section"
          style={{
            width: sectionWidth,
            display: showDetails,
          }}
        >
          <div className="validation-form-section">
            <ValidationForm
              campaignId={campaignId}
              sessionId={sessionId}
              onMouseEnter={onMouseEnter}
              searchText={searchedText.toString()}
              searchedFrom={searchedFile.toString()}
              handleRowClick={handleRowClick}
              updateSessionId={updateSessionId}
              fieldsArray={fieldsDataArray}
              isRowClicked={isRowClicked}
            ></ValidationForm>
          </div>
          <div className="validation-section-divider"></div>
          <div
            className="validation-phrase-section pt-3 pr-4"
            ref={validationPhraseRef}
          >
            <Tabs
              //@ts-ignore
              fixed="top"
              onChange={setActiveTab}
              className="Dark validation-tab-content"
              activeKey={tabEventKey}
              defaultActiveKey="email"
              dropdown={true}
              tabs={tabsDataSet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPage;
