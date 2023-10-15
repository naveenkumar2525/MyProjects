import moment from "moment";
import { isArray, uniq } from "lodash";
import { parsePhoneNumber } from "awesome-phonenumber";

const chars = (code: number, num: number) =>
  Array.from({ length: num }, (_, i) => String.fromCharCode(i + code)).join("");

export const uuid = (len: number = 6) => {
  const caps = chars("A".charCodeAt(0), 26);
  const lower = chars("a".charCodeAt(0), 26);
  const nums = chars("0".charCodeAt(0), 10);
  const all = `${caps}${lower}${nums}`;
  return Array.from(
    { length: len },
    () => all[Math.floor(Math.random() * all.length)]
  ).join("");
};

export const base64StringForImage = async (file: any) => {
  if (!file) {
    return "";
  }
  const str = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject("error");
    reader.readAsDataURL(file);
  });
  return str;
};

//Note: this method does not work well if object contains dates as well
export const cloneDeep = (input: any) => {
  return JSON.parse(JSON.stringify(input));
};

export const checkEmptyObject = (input: any) => {
  return Object.keys(input).length == 0;
};

export const checkEmptyArrayObj = (input: any) => {
  let retValue = false;

  if (isArray(input)) {
    if (input.length < 1) return true;
    if (checkEmptyObject(input[0])) return true;
  }
  return retValue;
};

export const getParamIdObj = (input: string) => {
  let paramIdObj: any = {};
  if (input.includes(".")) {
    paramIdObj.parentparamid = input.split(".")[0];
    paramIdObj.paramid = input.split(".")[1];
  } else {
    paramIdObj.parentparamid = "";
    paramIdObj.paramid = input;
  }
  return paramIdObj;
};

export const copyToClipboard = (text: string) => {
  const ta = document.createElement("textarea");
  ta.innerText = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
};

export const formatDate = (dateText: string) => {
  const date = new Date(dateText);
  return moment(date).format("MM-DD-YYYY HH:mm");
};
export const downloadWorkflow = (blob: any) => {
  const url = window.URL.createObjectURL(
    new Blob([blob]),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `Workflow.ufo`,
  );
  document.body.appendChild(link);
  link.click();
};

export const truncateText = (title: string, limit: number) => {
  if (title.length > limit) {
    let truncatedText = title.slice(0, limit) + '...';
    return truncatedText;
  }
  return title;
}

export const uniqueSortedProjects = (campaignList: any) => {
  const projectsList = uniq(campaignList.map((item: any) => item.AppContext)).filter((item: any) => item?.length > 0);
  return projectsList.sort((a: any, b: any) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
};

export const hasValidToken = (userInfo:any,adminInfo:any) => {
  if (
    (userInfo &&
      new Date(userInfo?.expiryTime).getTime() > new Date().getTime()) ||
    (adminInfo &&
      new Date(JSON.parse(adminInfo)?.expiryTime).getTime() >
      new Date().getTime())
  ) {
    return true;
  }
  return false;
};

export const basePath =  window.location.href.split('/').slice(0, 4).join('/');

// previewOrDownload file
// Input to be passed -> blob response
export const previewOrDownload = (file: any) => {
  const reader = new FileReader();
  // Construct object url
  const fileURL = window.URL.createObjectURL(file);
  reader.onload = function () {
    const tab: any = window.open();
    tab.location.href = fileURL;
  };
  reader.readAsDataURL(file);
};

// legacy labels vs New labels
export const IA_STATUS_LABELS: any = {
  Initiated: "Queued",
  Egressed: "Awaiting reply",
  Engaged: "Ongoing",
  Completed: "Complete",
  Expired: "Expired",
};

export const stripHtml = (html: string) => {
  let $tempDiv = document.createElement("div");
  $tempDiv.innerHTML = html;
  let input = $tempDiv.innerText.trim().replace(/ +(?= )/g, '');
  input = input.replace(/</g, "&lt;");
  input = input.replace(/>/g, "&gt;");
  input = input.replace(/&/g, "&amp");
  return input;
};

export const removeHTMLContent = (message: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = message;
  tempDiv.removeAttribute('style');
  tempDiv.removeAttribute('script');
  tempDiv.removeAttribute('iframe');
  // Redo the removal of scripts and styles in case enableHtml is 'No'
  const tempDiv1 = document.createElement('div');
  tempDiv1.innerHTML = tempDiv.innerText;
  tempDiv1.removeAttribute('style');
  tempDiv1.removeAttribute('script');
  tempDiv1.removeAttribute('iframe');
  return tempDiv1.innerText;
};

//Object to handle all variable types validations
export const variablesValidations: any = {
  uid_alpha_numeric_string: {
    regex: /^[a-z0-9]+$/i,
    errorMsg: "Enter a valid Alphanumeric value",
  },
  uid_email: {
    regex: /^\S+@\S+\.\S+$/,
    errorMsg: "Enter a valid email",
  },
  uid_phoneNo: {
    regex:
      /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm,
    errorMsg: "Enter a valid Phone Number",
  },
  uid_numeric_string : {
    regex:/^[-+]?[0-9]+$/,
    errorMsg: "Enter a valid Number",
  }
};

export const getDynamicName = (dataArr: any, reqStr: string) => {
  const reqArr: number[] = [];
  let dynamicName;
  dataArr.forEach((name: string) => {
    if (name.includes(reqStr)) {
      const unmatchedString = name.replace(reqStr, '');
      const unmatchedArr = unmatchedString.split('_');
      if (unmatchedArr.length === 2 && unmatchedArr[0] === "" && parseInt(unmatchedArr[1])) {
        reqArr.push(parseInt(unmatchedArr[1]));
      }
    }
  });
  if (!reqArr.length) {
    dynamicName = `${reqStr}_1`;
  } else {
    reqArr.sort((a, b) => b - a);
    dynamicName = reqStr + '_' + (reqArr[0] + 1);
  }
  return dynamicName;
}
/**
 * This function takes Default Virtual Number for the instance and Workflow Virtual Number
 * and returns the virtual number in a formatted way
 * @param defaultVirtualNumber Default Virtual Number on the instance
 * @param workflowVirtualNumber The virtual number assigned to the workflow
 * @returns Formatted Virtual number in the format +1 (xxx) xxx-xxxx
 */
export const formatVirtualNumber = (defaultVirtualNumber: string, workflowVirtualNumber: string) => {
  let rawPhoneNum = workflowVirtualNumber;
  if (rawPhoneNum === "") rawPhoneNum = defaultVirtualNumber;
  const parsedPhoneNumber = parsePhoneNumber(`+${rawPhoneNum}`);
  let phoneNumber = "";
  if(parsedPhoneNumber.possible){
    const phoneNumberCC = `+${parsedPhoneNumber?.countryCode || ""}`;
    phoneNumber = `${phoneNumberCC}${
      parsedPhoneNumber.number?.national || ""
    }`;
  }
  return phoneNumber;
}