import { ReactElement } from "react";
import { Form } from "react-bootstrap";
import { selectedModule } from "../../../data/canvasSlice";
import RichTextEditor from "../../RichTextEditor";
import { useAppSelector } from "../../../../../app/hooks";
import ModuleTypes from "../../../interfaces/module-types";

const MessageModule = (): ReactElement => {
  const currentSelectedModule = useAppSelector(selectedModule);
  return (
    <div className={ModuleTypes.MESSAGE_MODULE}>
      <Form.Label className="ushur-label">
        <span className="text-sm">
          {currentSelectedModule?.title} to display
        </span>
      </Form.Label>
      <RichTextEditor />
    </div>
  );
};

export default MessageModule;
