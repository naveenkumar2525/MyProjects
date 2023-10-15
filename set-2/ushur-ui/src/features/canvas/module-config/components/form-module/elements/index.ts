import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faQuotes,
  faImage,
  faFileMagnifyingGlass,
  faInputNumeric,
  faInputText,
  faParagraph,
  faToggleOff,
  faCircleCheck,
  faCaretDown,
  faSquareCheck,
  faCalendarDays,
  faLocationDot,
  faPenNib,
  faCloudArrowUp,
} from "@fortawesome/pro-thin-svg-icons";
import RichTextEditor, { EditorInputProps } from "../../../RichTextEditor";
import { FormElement } from "../../../../../../api";
import TextInput, { TextInputProps } from "./TextInput";

const TextIcon = faQuotes as IconProp;
const ImageIcon = faImage as IconProp;
const FileViewerIcon = faFileMagnifyingGlass as IconProp;
const NumberInputIcon = faInputNumeric as IconProp;
const TextInputIcon = faInputText as IconProp;
const LargeTextIcon = faParagraph as IconProp;
const ToggleSwitchIcon = faToggleOff as IconProp;
const RadioButtonsIcon = faCircleCheck as IconProp;
const DropdownIcon = faCaretDown as IconProp;
const CheckboxIcon = faSquareCheck as IconProp;
const DateTimeIcon = faCalendarDays as IconProp;
const LocationIcon = faLocationDot as IconProp;
const EsignatureIcon = faPenNib as IconProp;
const FileUploadIcon = faCloudArrowUp as IconProp;

export const staticElements: FormElement[] = [
  {
    id: "text",
    name: "text",
    title: "Display Text",
    type: "rte",
  },
  {
    id: "image",
    name: "image",
    title: "Image",
    type: "text",
  },
  {
    id: "fileViewer",
    name: "fileViewer",
    title: "File Viewer",
    type: "text",
  },
];

export const formElements: FormElement[] = [
  {
    id: "numberInput",
    name: "numberInput",
    title: "Numeric Input",
    type: "text",
  },
  {
    id: "textInput",
    name: "textInput",
    title: "Text Input",
    type: "text",
  },
  {
    id: "largeText",
    name: "largeText",
    title: "Large Text",
    type: "textarea",
  },
  {
    id: "toggleSwitch",
    name: "toggleSwitch",
    title: "Toggle Switch",
    type: "text",
  },
  {
    id: "radioButtons",
    name: "radioButtons",
    title: "Radio Buttons",
    type: "text",
  },
  {
    id: "dropdown",
    name: "dropdown",
    title: "Dropdown",
    type: "text",
  },
  {
    id: "checkbox",
    name: "checkbox",
    title: "Checkbox",
    type: "text",
  },
  {
    id: "dateTime",
    name: "dateTime",
    title: "Date and Time",
    type: "text",
  },
  {
    id: "location",
    name: "location",
    title: "Location",
    type: "text",
  },
  {
    id: "esignature",
    name: "esignature",
    title: "E-signature",
    type: "text",
  },
  {
    id: "fileUpload",
    name: "fileUpload",
    title: "File Upload",
    type: "text",
  },
];

export const elementIcons: Record<string, IconProp> = {
  text: TextIcon,
  image: ImageIcon,
  fileViewer: FileViewerIcon,
  numberInput: NumberInputIcon,
  textInput: TextInputIcon,
  largeText: LargeTextIcon,
  toggleSwitch: ToggleSwitchIcon,
  radioButtons: RadioButtonsIcon,
  dropdown: DropdownIcon,
  checkbox: CheckboxIcon,
  dateTime: DateTimeIcon,
  location: LocationIcon,
  esignature: EsignatureIcon,
  fileUpload: FileUploadIcon,
};

export const staticElementFields: Record<
  string,
  React.FunctionComponent<EditorInputProps>
> = {
  text: RichTextEditor,
};

export const elementFields: Record<
  string,
  React.FunctionComponent<TextInputProps>
> = {
  image: TextInput,
  fileViewer: TextInput,
  numberInput: TextInput,
  textInput: TextInput,
  largeText: TextInput,
  toggleSwitch: TextInput,
  radioButtons: TextInput,
  dropdown: TextInput,
  checkbox: TextInput,
  dateTime: TextInput,
  location: TextInput,
  esignature: TextInput,
  fileUpload: TextInput,
};
