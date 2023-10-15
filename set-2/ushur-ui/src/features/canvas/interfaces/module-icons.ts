import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faMessageSmile,
  faListTree,
  faClipboardListCheck,
} from "@fortawesome/pro-thin-svg-icons";

const MessageIcon = faMessageSmile as IconProp;
const MenuIcon = faListTree as IconProp;
const FormIcon = faClipboardListCheck as IconProp;

export default {
  "message-module": MessageIcon,
  "menu-module": MenuIcon,
  "form-module": FormIcon,
};
