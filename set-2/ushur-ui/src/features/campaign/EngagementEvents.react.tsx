// @ts-ignore
import { useEffect, useState } from 'react';
import EngagementDescription from "./EngagementDescription.react";
import "./EngagementEvents.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { merge, trim, isPlainObject, isEmpty } from "lodash";
import moment from 'moment';
import { Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FieldButton,
} from "@ushurengg/uicomponents";
import {
  faArrowsRotate,
  faCircleArrowDownLeft,
  faCircleArrowUpRight,
  faRecycle,
  faBullhorn,
  faSquareCheck,
  faCopy,
  faMobileScreen,
  faUpload,
  faFloppyDisk, faClockNine, faRightToBracket, faListOl, faQuestion, faCodeFork
} from "@fortawesome/pro-solid-svg-icons";
import {
  faBarcode
} from "@fortawesome/pro-regular-svg-icons";
import { faCreditCard, faThumbsUp, faCommentDots, faPaperPlane, faIdBadge, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { faMapMarker, faPhone, faCheck, faExclamationTriangle, faDatabase, faShareSquare, faPuzzlePiece, faBalanceScale, faCloud, faSearch } from "@fortawesome/free-solid-svg-icons";
import { ChromeIcon, CodePen } from "./SvgIcons.react";
import SortActivitySelect from './SortActivitySelect.react';
import { getTokenId } from '../../utils/api.utils';
import { removeHTMLContent, stripHtml } from '../../utils/helpers.utils';

const reverseArr = (arr: []) => [...arr].reverse();

const icons: any = {
  "fa fa-chrome": <ChromeIcon />,
  "fa fa-check-square-o": (
    <FontAwesomeIcon
      icon={faSquareCheck as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-files-o": (
    <FontAwesomeIcon
      icon={faCopy as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-bullhorn": (
    <FontAwesomeIcon
      icon={faBullhorn as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-credit-card": (
    <FontAwesomeIcon
      icon={faCreditCard}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-thumbs-o-up": (
    <FontAwesomeIcon
      icon={faThumbsUp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-commenting-o": (
    <FontAwesomeIcon
      icon={faCommentDots}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-list-ol": (
    <FontAwesomeIcon
      icon={faListOl as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-question": (
    <FontAwesomeIcon
      icon={faQuestion as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-code-fork rot-90": (
    <FontAwesomeIcon
      icon={faCodeFork as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
      className="rotate-90"
    />
  ),
  "fa fa-paper-plane-o": (
    <FontAwesomeIcon
      icon={faPaperPlane}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-map-marker": (
    <FontAwesomeIcon
      icon={faMapMarker}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-phone": (
    <FontAwesomeIcon
      icon={faPhone}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-mobile": (
    <FontAwesomeIcon
      icon={faMobileScreen as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-id-badge": (
    <FontAwesomeIcon
      icon={faIdBadge}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-envelope-open-o": (
    <FontAwesomeIcon
      icon={faEnvelopeOpen}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-upload": (
    <FontAwesomeIcon
      icon={faUpload as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-floppy-o": (
    <FontAwesomeIcon
      icon={faFloppyDisk as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-check": (
    <FontAwesomeIcon
      icon={faCheck}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-exclamation-triangle": (
    <FontAwesomeIcon
      icon={faExclamationTriangle}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-database": (
    <FontAwesomeIcon
      icon={faDatabase}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-share-square-o": (
    <FontAwesomeIcon
      icon={faShareSquare}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-puzzle-piece": (
    <FontAwesomeIcon
      icon={faPuzzlePiece}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-barcode": (
    <FontAwesomeIcon
      icon={faBarcode as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-balance-scale": (
    <FontAwesomeIcon
      icon={faBalanceScale}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  // fa icon-outbound-webhook
  // fa icon-inbound-webhook
  "fa fa-clock-o": (
    <FontAwesomeIcon
      icon={faClockNine as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-codepen": (
    <CodePen />
  ),
  "fa fa-cloud": (
    <FontAwesomeIcon
      icon={faCloud}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-sign-in": (
    <FontAwesomeIcon
      icon={faRightToBracket as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  ),
  "fa fa-save": (
    <FontAwesomeIcon
      icon={faFloppyDisk as IconProp}
      width="14"
      height="14"
      color="#2F80ED"
    />
  )
};

type EventProps = {
  events: any;
  sections: any;
  engagementHistoryView: string;
  onRefresh: () => any;
}

const regexAssetId = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
const token = getTokenId();
const MODULE_REMOVED_MESSAGE = "Ushur is updated";

const formatDate = (timestamp: any) => {
  return moment(timestamp).format("MM/DD/YYYY");
};

const formatTime = (timestamp: any) => {
  return moment(timestamp).format("hh:mm:ss A");
};


const getModuleIcon = (moduleIcon: any) => {
  let imageUrl = "";
  if (moduleIcon) {
    if (regexAssetId.test(moduleIcon)) {
      imageUrl = window.location.origin + "/rest/asset/download-asset/" + moduleIcon + "?token=" + token;
    } else {
      imageUrl = stripHtml(moduleIcon);
    }
  }
  return imageUrl;
};

const getUobMessage = (content: any) => {
  let url = content.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  content = content.replace(url, "");
  content = content + " <a href='" + url + "' target='_blank'>" + url + "</a>"
  return content;
};

const getEmailDetails = (content: any, ushurModule: any) => {
  const emailDetails = {
    email: '', subject: '', body: '', cc: '', bcc: ''
  };
  emailDetails.email = ushurModule.email || "";
  emailDetails.subject = ushurModule.subject || "";
  emailDetails.body = ushurModule.htmlBody || ushurModule.body;
  emailDetails.cc = ushurModule.cc || "";
  emailDetails.bcc = ushurModule.bcc || "";
  try {
    let tmpContent = JSON.parse(content);
    emailDetails.body = tmpContent.emailBody;
    emailDetails.email = tmpContent.TO || tmpContent.emailAddress || "";
    emailDetails.subject = tmpContent.emailSubject || "";
    emailDetails.cc = tmpContent.CC || "";
    emailDetails.bcc = tmpContent.BCC || "";
  } catch (e) { }
  return emailDetails;
};

const getIncomingEmailContent = (response: any) => {
  let content = {
    emailAddress: "",
    emailSubject: "",
    emailBody: "",
    attachment: "",
  }
  try {
    content = merge(content, JSON.parse(response.content));
  } catch (e) { }
  return content;
}

const getDelayMessage = (delay: any) => {
  let str = "";
  if (delay.days && delay.days != "0") {
    str += delay.days + " day, ";
  }
  if (delay.hours && delay.hours != "0") {
    str += delay.hours + " hour, ";
  }
  if (delay.minutes && delay.minutes != "0") {
    str += delay.minutes + " minute, ";
  }
  if (delay.seconds && delay.seconds != "0") {
    str += delay.seconds + " second";
  }
  str = trim(str);
  if (str[str.length - 1] === ",") {
    str = str.substr(0, str.length - 1);
  }
  return str;
}

const getCustomSourceMessage = (event: any) => {
  return event.response.content;
}

const searchColumns = ['date', 'time', 'title', 'message', 'emailDetails', 'files'];

const EngagementEvents = (props: EventProps) => {
  const { events, sections, engagementHistoryView, onRefresh } = props;
  const [eventsArray, setEventsArray] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [dupEventsArray, setDupEventsArray] = useState<any>([]);
  const [sortType, setSortType] = useState("dsc");

  const createLabelMap = () => {
    let labelMap: any = {};
    sections.forEach(function (section: any) {
      labelMap[section.UeTag] = section.userTitle;
    });
    return labelMap;
  };

  const getUshurModule = (ueTag: string) => {
    return sections?.find(({ UeTag }: any) => UeTag === ueTag) ?? {};
  };

  const getBasicDetails = (event: any, ushurModule: any) => {
    const moduleType = event.response.moduleType;
    const date = formatDate(event.timestamp);
    const time = formatTime(event.timestamp);
    const title = createLabelMap()[event.response.UeTag] || event.response.dispStr;
    const moduleIcon = getModuleIcon(ushurModule.moduleIcon)
    return { moduleType, date, time, title, moduleIcon };
  }

  const getUploadedFiles = (response: any) => {
    let assetIds = [];
    if (response.assetId && response.contentType) {
      assetIds = [{ assetId: response.assetId, fileType: response.contentType }];
    }
    try {
      assetIds = JSON.parse(response.dispStr);
    } catch (e) { }
    assetIds.forEach(function (file: any) {
      file.fileUrl = window.location.origin + "/rest/asset/download-asset/" + file.assetId + "?token=" + token;
    });
    return assetIds;
  }

  const processEvents = () => {
    if (events.length > 0) {
      const eventsData: any = [];
      events.forEach((event: any, index: number) => {
        const response = event.response;
        let ushurModule = getUshurModule(event.response.UeTag);
        let { date, time, title, moduleIcon, moduleType } = getBasicDetails(event, ushurModule);
        if ((response.moduleType === "freeresponse" && response.type === "menu.prompt") || (response.moduleType === "freeresponse" && response.type === "menu.prompt" && response.Validation === "")) {
          // Outgoing - openResponse
          let validation = '', message = '', icon = '';
          let moduleIconTooltip = "Open Response";
          if (event.response.meta) {
            message = removeHTMLContent(event.response.meta.topic);
          }
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          } else {
            validation = event.response.Validation || "";
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            if (validation === "uid_creditcardinfo") {
              moduleIconTooltip = "Credit Card";
              icon = 'fa fa-credit-card';
            }
            else {
              icon = 'fa fa-question';
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          })
        } else if (response.moduleType === 'onbrowser' && response.type === 'menu.disabled.sent' && !response.channel) {
          // Outgoing - invisibleApp
          let icon = '', moduleIconTooltip = "On Browser";
          let message = getUobMessage(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = 'fa fa-chrome';
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          })
        } else if (response.moduleType === "thankyou" && response.type === "menu.disabled.sent") {
          // Outgoing - thankYou
          let message; let icon, moduleIconTooltip = "Thank you";
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            if (moduleType === "thankyou") {
              icon = "fa fa-thumbs-o-up";
            }
            if (moduleType === "promptmessage") {
              icon = "fa fa-commenting-o";
              moduleIconTooltip = "Notify";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          })
        } else if (response.moduleType === "multiplechoice" && response.type === "menu.sent") {
          // outgoing - multipleChoice
          let message = '', icon = '', moduleIconTooltip = 'Multiple Choice';
          message = removeHTMLContent(event.response.meta.topic);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = 'fa fa-list-ol';
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          })
        } else if (["freeresponse", "multiplechoice"].indexOf(response.moduleType) > -1 && response.responseType === undefined && response.reminderMsg === "yes") {
          // outgoing - reminder
          let message, icon, moduleIconTooltip = "Open Response";;
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            if (moduleType == "freeresponse") {
              icon = "fa fa-question";
            }
            if (moduleType == "multiplechoice") {
              icon = "fa fa-list-ol";
              moduleIconTooltip = "Multiple Choice";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          });
        } else if (response.moduleType === "promptmessage" && response.type === "menu.disabled.sent") {
          // outgoing - notify
          let message, icon, moduleIconTooltip = "Notify";
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            if (moduleType === "thankyou") {
              icon = 'fa fa-thumbs-o-up';
              moduleIconTooltip = "Thank you";
            }
            if (moduleType === "promptmessage") {
              icon = 'fa fa-commenting-o';
              moduleIconTooltip = "Notify";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          });
        } else if (response.moduleType === 'liClassifier' && response.type === 'liClassifier') {
          // Outgoing liClassifier
          let message, icon, moduleIconTooltip = "LI Node";
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = "fa fa-code-fork rot-90";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if (response.moduleType === "emailmessage" && response.type === "menu.disabled.sent") {
          // Outgoing email
          let emailDetails;
          let icon, moduleIconTooltip = "Email";
          emailDetails = getEmailDetails(event.response.content, ushurModule);
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-paper-plane-o";
          }
          eventsData.push({
            date, time, icon, title, moduleType, emailDetails, direction: "outgoing", moduleIconTooltip
          });
        } else if (response.moduleType === "location" && response.type === "menu.prompt") {
          // Outgoing - location
          let message, icon, moduleIconTooltip = 'Location';
          message = removeHTMLContent(event.response.meta.topic);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = "fa fa-map-marker";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          });
        } else if (response.moduleType === "voice" && response.type === "connectToUser") {
          // Outgoing - phoneCall
          let message, icon, moduleIconTooltip = "Voice";
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          } else {
            message = ushurModule.txtMsgToUser;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = "fa fa-phone";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          });
        } else if (response.moduleType === "texting" && response.type === "menu.disabled.sent") {
          // Outgoing - texting
          let message, icon, moduleIconTooltip = "Texting";
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = "fa fa-mobile";
          }
          eventsData.push({
            date, time, icon, title, message, moduleIconTooltip
          });
        } else if (response.moduleType === "captureimage" && response.type === "menu.disabled.sent") {
          // Outgoing - fileUpload
          let message, icon, moduleIconTooltip = 'File Upload';
          message = removeHTMLContent(event.response.dispStr);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = "fa fa-upload";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          });
        } else if (response.moduleType === "operator" && response.type === "operator") {
          // Outgoing - operator
          let message, icon, moduleIconTooltip = "Operator";
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = "fa fa-id-badge";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "outgoing", moduleIconTooltip
          });
        } else if (["freeresponse", "location"].indexOf(response.moduleType) > -1 && response.type === "routine.response") {
          // Incoming - openResponse
          let message, validation, icon, moduleIconTooltip = "Open Response";;
          message = event.response.dispStr;

          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          } else {
            validation = ushurModule.validation;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            if (moduleType === "freeresponse") {
              if (validation === "uid_creditcardinfo") {
                icon = "fa fa-credit-card";
                moduleIconTooltip = "Credit Card";
              } else {
                icon = "fa fa-question";
                moduleIconTooltip = "Open Response";
              }
            }
            if (moduleType === "location") {
              icon = "fa fa-map-marker";
              moduleIconTooltip = "Location";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "incoming", moduleIconTooltip
          })
        } else if (response.moduleType === "emailprocessing" && ["menu.disabled.sent", "emailprocessing"].indexOf(response.type) > -1) {
          // Incoming - email
          let emailDetails, icon, moduleIconTooltip = "Incoming Email Processing";
          emailDetails = getIncomingEmailContent(event.response);
          if (isEmpty(ushurModule)) {
            emailDetails = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-envelope-open-o";
          }
          eventsData.push({
            date, time, icon, title, moduleType, direction: "incoming", emailDetails, moduleIconTooltip
          })
        } else if (response.moduleType === 'captureimage' && response.type === "routine.response") {
          // Incoming - fileUpload
          let icon, moduleIconTooltip = "File Upload";
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-upload";
          }
          const message = event.response.dispStr;
          const files = getUploadedFiles(event.response);
          eventsData.push({
            date, time, icon, title, message, moduleType, files, direction: "incoming", moduleIconTooltip
          })
        } else if (response.moduleType === "operator" && response.type === "routine.response") {
          // Incoming - operator
          let icon, moduleIconTooltip = "Operator";
          const message = removeHTMLContent(event.response.dispStr);
          if (moduleIcon) {
            icon = moduleIcon;
          }
          if (!moduleIcon) {
            icon = "fa fa-id-badge";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "incoming", moduleIconTooltip
          });
        } else if (response.type === "storeVar" || response.type === "validate") {
          // process - stored && // Process - validated
          if(engagementHistoryView !== "detailed") return;
          let icon, message;
          const moduleIconTooltip = response.type === "storeVar" ? "Stored" : "Validated";
          message = removeHTMLContent(event.response.content);

          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            if (response.type === "storeVar") {
              icon = "fa fa-floppy-o";
            }
            if (response.type === "validate") {
              icon = "fa fa-check";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if (response.dispStr === "EndOfUshur" && response.type === "ushur.end") {
          // Process - endOfUshur
          let icon, message, moduleIconTooltip = "End Of Ushur";
          if (event.response.reason) {
            message = event.response.reason;
          } else {
            message = 'Normal Termination';
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-check-square-o";
          }
          eventsData.push({
            date, time, icon, title, message, moduleIconTooltip
          });
        } else if (["freeresponse", "multiplechoice"].indexOf(response.moduleType) > -1 && ["menu.error", "menu.disabled.sent"].indexOf(response.type) > -1) {
          // Process - reminderError
          if(engagementHistoryView !== "detailed") return;
          let icon, message, moduleIconTooltip = "Validation Error";
          if (event.response.type === "menu.disabled.sent") {
            message = event.response.content;
          } else {
            message = event.response.dispStr;
          }
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-exclamation-triangle";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if ((response.moduleType === 'lookupchoice' && response.type === "menu.routine" && response.dispStr === 'Ushur_Lookup') || (response.moduleType === "storedata" && response.type === "menu.routine" && response.dispStr === "Ushur_Store")) {
          if(engagementHistoryView !== "detailed") return;
          // Process - fetch
          // Process - store
          let icon, message;
          const moduleIconTooltip = moduleType === "lookupchoice" ? "Fetch Data" : "Store Data";
          message = event.response.content || event.response.dispStr || "";
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            if (moduleType === "lookupchoice") {
              icon = "fa fa-database"
            } if (moduleType === "storedata") {
              icon = "fa fa-save";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if (response.moduleType === 'dataExtractor' && ["menu.disabled.sent", "dataExtraction"].indexOf(response.type) > -1) {
          // Process - dataExtractor
          if (engagementHistoryView !== "detailed") return;
          let icon, message, moduleIconTooltip = "Data Extractor";
          if (isPlainObject(event.response.content)) {
            message = JSON.stringify(event.response.content) || "";
          } else {
            message = event.response.content || "";
          }
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-share-square-o";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if ((response.moduleType === "docProcessor" && response.type === "menu.disabled.sent") || (response.moduleType === "ocrView" && response.type === "menu.disabled.sent")) {
          // Process - docProcessor
          // Process - ocr
          if (engagementHistoryView !== "detailed") return;
          let icon, message;
          const moduleIconTooltip = moduleType === "docProcessor" ? "Doc Processor" : "OCR";
          message = event.response.dispStr;

          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            if (moduleType === "docProcessor") {
              icon = "fa fa-puzzle-piece";
            } if (moduleType === "ocrView") {
              icon = "fa fa-barcode";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if (response.moduleType === "calculations" && response.type === "compute") {
          // Process - compute
          if(engagementHistoryView !== "detailed") return;
          let icon, message, moduleIconTooltip = "Compute";
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            // Pending icon data
            icon = "x+y";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if (response.moduleType === "compare" && response.type === "menu.routine" && response.dispStr === "Ushur_Compare") {
          // Process - compare
          if(engagementHistoryView !== "detailed") return;
          let icon, message, moduleIconTooltip = 'Compare';
          message = event.response.dispStr || "";
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-balance-scale";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if ((response.moduleType === "webhook" && response.type === "webhook") || (response.moduleType === "inboundwebhook" && response.type === "inboundwebhook")) {
          // Process - webHook
          // Process - inboundwebhook
          if(engagementHistoryView !== "detailed") return;
          let icon, message;
          const moduleIconTooltip = moduleType === "webhook" ? "Outbound Webhook" : "Inbound Webhook";
          message = event.response.content || "";
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            if (response.type === "webhook") {
              icon = "fa icon-outbound-webhook";
            }
            if (response.type === "inboundwebhook") {
              icon = "fa icon-inbound-webhook";
            }
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        } else if (response.moduleType === "delay") {
          // Process - delay
          if(engagementHistoryView !== "detailed") return;
          let icon, message, moduleIconTooltip = "Delay";
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          } else {
            message = getDelayMessage(ushurModule.delay);
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-clock-o";
          }
          eventsData.push({
            date, time, icon, title, message, moduleIconTooltip
          });
        } else if (response.moduleType === "fileCreation" && response.type === "fileCreation") {
          // Process - fileCreation
          if(engagementHistoryView !== "detailed") return;
          let message, icon, moduleIconTooltip = "File Creation";
          message = removeHTMLContent(event.response.content);
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-files-o";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          })
        } else if (response.moduleType === "customSource") {
          // Process - customSource
          if(engagementHistoryView !== "detailed") return;
          let icon, message, moduleIconTooltip = "Custom Source";
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          } else {
            message = getCustomSourceMessage(event);
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-codepen";
          }
          eventsData.push({
            date, time, icon, title, message, moduleIconTooltip
          });
        } else if (response.moduleType === "integrations" && response.type === "integrations") {
          // Process - integrations
          if(engagementHistoryView !== "detailed") return;
          let icon, message, moduleIconTooltip = "Integrations";
          message = event.response.content;
          if (isEmpty(ushurModule)) {
            message = MODULE_REMOVED_MESSAGE;
          }
          if (moduleIcon) {
            icon = moduleIcon;
          } else {
            icon = "fa fa-cloud";
          }
          eventsData.push({
            date, time, icon, title, message, direction: "processing", moduleIconTooltip
          });
        }
        else {
          let icon, moduleIconTooltip;
          let ushurModule = getUshurModule(event.response.UeTag);
          let emailDetails: any;
          let date = formatDate(event.timestamp);
          let time = formatTime(event.timestamp);
          let title = createLabelMap()[event.response.UeTag] || event.response.dispStr;
          let moduleType = event.response.moduleType;
          let moduleIcon = getModuleIcon(ushurModule.moduleIcon);
          if (["compare", "storedata", "lookupchoice"].indexOf(moduleType) > -1 && (engagementHistoryView !== "detailed")) {
            return;
          }

          let message = "";
          let assetIds = [];
          let direction = "outgoing";
          if (event.response.type === "routine.response" || event.response.type === "menu.response" || event.response.type === "menu.error" || event.response.type === "ushur.end" || !event.response.UeTag) {
            message = event.response.dispStr || "";
            direction = "incoming";
            // message for EndOfUshur
            if (message === "EndOfUshur") {
              if (event.response.reason) {
                message = event.response.reason;
              } else {
                message = "Normal termination";
              }
            }
            // assetIds of captureimage
            if (event.response.moduleType === "captureimage") {
              assetIds = [{ assetId: event.response.assetId, fileType: event.response.contentType }];
              try {
                assetIds = JSON.parse(event.response.dispStr);
              } catch (e) { }
            } else if (event.response.moduleType === "formresponse") {
              moduleType = "custom-formresponse"
            }
            if (moduleType === "onbrowser") {
              // message for onbrowser
              message = "UOB link accessed";
            }
          } else {
            // ignore the second UOB sent response
            if (moduleType === "onbrowser" && event.response.delivered === "false") {
              return;
            }
            if (event.response.content) {
              message = removeHTMLContent(event.response.content);
              if (event.response.moduleType === "emailmessage") {
                try {
                  var tmpContent = JSON.parse(event.response.content);
                  emailDetails = {
                    email: tmpContent.emailAddress,
                    subject: tmpContent.emailSubject,
                    body: tmpContent.emailBody
                  }
                  message = "";
                } catch {

                }
              } else if (event.response.moduleType === "formresponse") {
                try {
                  let messageJSON = JSON.parse(message);
                  message = "";
                  messageJSON.forEach(function (entry: any) {
                    if (entry.type === "multiplechoice") {
                      message += entry.choice_question + " ";
                      entry.options.forEach(function (option: any, index: any) {
                        message = message + (index + 1) + "). " + option + " ";
                      });
                    } else {
                      message += entry.text;
                    }
                    message += "<br><br>";
                  });
                } catch (e) { }
              } else if (event.response.moduleType === "sendfax") {
                let documentUrls = message.split(",");
                message = "";
                try {
                  documentUrls.forEach(function (documentUrl) {
                    message += "<a href='" + documentUrl + "' target='_blank'>Document</a><br>";
                  });
                } catch (e) { }
              } else if (event.response.moduleType === undefined) {
                moduleType = "eng_init";
              }
            } else if (event.response.meta && event.response.meta.topic) {
              message = removeHTMLContent(event.response.meta.topic);
            }
          }
          // getting icons
          const icons: any = {
            "onbrowser": "fa fa-chrome",
            "compare": "fa fa-balance-scale",
            "eng_init": "fa fa-sign-in",
            "storedata": "fa fa-save",
            "lookupchoice": "fa fa-database",
            "liClassifier": "fa fa-code-fork rot-90",
            "multiplechoice": "fa fa-list-ol",
            "welcome": "fa fa-bullhorn"
          }
          const tooltips: any = {
            "onbrowser": "On Browser",
            "compare": "Compare",
            "eng_init": "Engagement Initiated",
            "storedata": "Store Data",
            "lookupchoice": "Fetch Data",
            "liClassifier": "LI Node",
            "multiplechoice": "Multiple Choice",
            "welcome": "Welcome"
          }
          if (moduleIcon) {
            icon = moduleIcon;
            moduleIconTooltip = "Thank you"
          } else {
            icon = icons[moduleType];
            moduleIconTooltip = tooltips[moduleType];
          }

          eventsData.push({
            date, time, moduleIcon, moduleType, title, message, direction, icon, files: assetIds, emailDetails, moduleIconTooltip
          });
        }
      });
      return eventsData;
    }
  }

  useEffect(() => {
    let eventsData = processEvents();

    if (sortType === "asc") {
      eventsData = reverseArr(eventsData);
    }
    setEventsArray(eventsData ?? []);
    setDupEventsArray(eventsData);
  }, [events]);

  useEffect(() => {
    setEventsArray(reverseArr(eventsArray));
  }, [sortType]);

  const checkMatchingDataExists: Function = (col: any, search: string) => {
    if (typeof col === 'string') {
      return col.toLocaleLowerCase().includes(search)
    }
    else if (typeof col === "object" && col !== null) {
      let reqArr;
      reqArr = Array.isArray(col) ? col : Object.values(col);
      for (let index = 0; index < reqArr.length; index++) {
        return checkMatchingDataExists(reqArr[index], search);
      }
      return false;
    }
    return false;
  }

  const handleSearch = (e: any) => {
    const search = e?.target?.value.toLowerCase();
    setSearchText(search);
    const res = dupEventsArray.filter((event: any) => {
      const reqEventObj:any = {};
      searchColumns.forEach((col: string) => reqEventObj[col] = event[col]);
      return Object.values(reqEventObj).some((col: any) => {
        return checkMatchingDataExists(col, search);
      })
    });
    setEventsArray(res)
  };

  return (
    <>
      <div className="actions-row">
        <FieldButton
          buttonIcon={<FontAwesomeIcon icon={faSearch} />}
          tooltipText="Search all records"
          handleInputChange={(e: any) => handleSearch(e)}
        />
        <SortActivitySelect onChange={(type: string) => setSortType(type)} />
        <div className="icon-control" onClick={onRefresh}>
          <FontAwesomeIcon
            icon={faArrowsRotate as IconProp}
            width="14"
            height="14"
            color="#2F80ED"
          />
        </div>
      </div>
      <div>
        {eventsArray.length > 0 ? (
          eventsArray?.map((event: any) => {
            const {
              icon,
              title,
              date,
              time,
              message,
              moduleType,
              emailDetails,
              direction,
              files,
              moduleIconTooltip,
            } = event;
            return (
              <div className={`engagement-event ${direction} container`}>
                <Col sm={5}>
                  <div className="events-status">
                    <div className="engagement-module">
                      {icons[icon] || icon ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-top">
                              {moduleIconTooltip}
                            </Tooltip>
                          }
                        >
                          <span
                            className="engagement-icon icon-black"
                            style={
                              icon ? { backgroundImage: `url(${icon})` } : {}
                            }
                          >
                            {icons[icon] ? icons[icon] : ""}
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <div className="no-icon"></div>
                      )}
                      <p>
                        {title?.replace(/(^\w|\s\w)/g, (m: any) =>
                          m.toUpperCase()
                        )}
                      </p>
                    </div>
                    <div className="engagement-schedule">
                      <span className="engagement-icon">
                        {
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-top">
                                {direction === "incoming"
                                  ? "Incoming Message"
                                  : direction === "outgoing"
                                  ? "Outgoing Message"
                                  : direction === "processing"
                                  ? "Processing Message"
                                  : ""}
                              </Tooltip>
                            }
                          >
                            <span>
                              {direction === "incoming" ? (
                                <FontAwesomeIcon
                                  icon={faCircleArrowDownLeft as IconProp}
                                  color="#19AF58"
                                />
                              ) : direction === "outgoing" ? (
                                <FontAwesomeIcon
                                  icon={faCircleArrowUpRight as IconProp}
                                  color="#00A7E1"
                                />
                              ) : direction === "processing" ? (
                                <FontAwesomeIcon
                                  icon={faRecycle as IconProp}
                                  color="#00A7E1"
                                />
                              ) : (
                                <div className="no-icon"></div>
                              )}
                            </span>
                          </OverlayTrigger>
                        }
                      </span>
                      <p className="engagement-time">
                        {date} {time}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col sm={7}>
                  <EngagementDescription
                    message={message}
                    moduleType={moduleType}
                    emailDetails={emailDetails}
                    files={files}
                  />
                </Col>
              </div>
            );
          })
        ) : searchText ? (
          <div className="no-events-text">No response found</div>
        ) : null}
      </div>
    </>
  );
};

export default EngagementEvents;