import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faMessageSmile,
  faListTree,
  faClipboardListCheck,
  faQuestion,
} from "@fortawesome/pro-thin-svg-icons";
import { useAppSelector } from "../../../app/hooks";
import { selectedModule } from "../data/canvasSlice";
import ModuleInformation from "./ModuleInformation";
import ModuleTypes from "../interfaces/module-types";

const MessageIcon = faMessageSmile as IconProp;
const MenuIcon = faListTree as IconProp;
const FormIcon = faClipboardListCheck as IconProp;
const DefaultIcon = faQuestion as IconProp;

const ModuleDetail = (): ReactElement => {
  const currentSelectedModule = useAppSelector(selectedModule);

  const renderModuleIcon = () => {
    let Icon;

    switch (currentSelectedModule?.type) {
      case ModuleTypes.MESSAGE_MODULE: {
        Icon = MessageIcon;
        break;
      }

      case ModuleTypes.MENU_MODULE: {
        Icon = MenuIcon;
        break;
      }

      case ModuleTypes.FORM_MODULE: {
        Icon = FormIcon;
        break;
      }

      default: {
        Icon = DefaultIcon;
      }
    }

    return <FontAwesomeIcon icon={Icon} size="lg" />;
  };

  return !currentSelectedModule ? (
    <h1>Loading</h1>
  ) : (
    <div className="pt-4 pl-3 pr-3 pb-1">
      <div
        className="flex flex-row items-center p-2 rounded-lg w-full mb-[2rem]"
        style={{ background: "#d1f3ff" }}
      >
        {renderModuleIcon()}

        <div className="ml-2.5">
          <p className="non-italic font-semibold text-base text-dark-blue m-0 text-sm">
            {`${currentSelectedModule.title} Module`}
          </p>
        </div>
      </div>
      <ModuleInformation />
      <div className="mt-4 text-[rgb(233,233,234)]">
        <hr />
        <span className="flex items-center content-center">
          <i className="mr-2 fa-regular fa-2xs fa-chevron-right" />
          Show more Advanced Features
        </span>
      </div>
    </div>
  );
};
export default ModuleDetail;
