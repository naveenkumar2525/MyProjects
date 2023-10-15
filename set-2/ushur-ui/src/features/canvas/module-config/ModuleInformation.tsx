import { ReactElement } from "react";
import ModuleInput from "./ModuleInput";
import { selectedModule } from "../data/canvasSlice";
import { useAppSelector } from "../../../app/hooks";
import "./ModuleInformation.css";
import MessageModule from "./components/message-module/MessageModule";
import MenuModule from "./components/menu-module/MenuModule";
import FormModule from "./components/form-module/FormModule";
import ModuleTypes from "../interfaces/module-types";

const ModuleInformation = (): ReactElement => {
  const currentSelectedModule = useAppSelector(selectedModule);

  return (
    <div className="module-container">
      {(() => {
        switch (currentSelectedModule?.type) {
          case ModuleTypes.MESSAGE_MODULE:
            return <MessageModule />;
          case ModuleTypes.MENU_MODULE:
            return <MenuModule />;
          case ModuleTypes.FORM_MODULE:
            return <FormModule />;
          default:
            return <ModuleInput />;
        }
      })()}
    </div>
  );
};

export default ModuleInformation;
