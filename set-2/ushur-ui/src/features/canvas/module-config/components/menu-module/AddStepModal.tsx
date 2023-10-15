import { ChangeEvent, useState } from "react";
import { Modal, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faQuestionSquare,
  faChevronDown,
} from "@fortawesome/pro-thin-svg-icons";
import { Button } from "@ushurengg/uicomponents";
import { useAppSelector } from "../../../../../app/hooks";
import { addStepModalPosition } from "../../../data/canvasSlice";

const faPropIcon = faQuestionSquare as IconProp;
const faChevronDownProp = faChevronDown as IconProp;

interface Props {
  showModal: boolean;
  onCancel: () => void;
  onFinish: (stepName: string) => void;
  onDismiss: () => void;
}
const AddStepModal = ({ showModal, onCancel, onFinish, onDismiss }: Props) => {
  const modalPosition = useAppSelector(addStepModalPosition);
  const [stepName, setStepName] = useState<string>("New Step");
  const handleChangeStepName = (event: ChangeEvent<HTMLInputElement>) => {
    setStepName(event.target.value);
  };
  return (
    <Modal
      show={showModal}
      onHide={onDismiss}
      style={{ position: "fixed", left: modalPosition.x, top: modalPosition.y }}
    >
      <Modal.Body className="pt-2 pr-2 pb-4 pl-2">
        <p className="mb-2 text-sm font-proxima-bold">Name this step</p>
        <div className="flex flex-row items-center">
          <div className="flex rounded flex-row items-center px-1 py-2 border-[1px] border-solid border-primary-gray">
            <FontAwesomeIcon
              className="cursor-pointer text-sm"
              icon={faPropIcon}
            />
            <FontAwesomeIcon
              className="cursor-pointer text-xs"
              icon={faChevronDownProp}
            />
          </div>
          <FormControl
            onChange={handleChangeStepName}
            value={stepName}
            className="my-0 mx-1"
          />
          <Button
            type="cancel"
            label="Cancel"
            size="md"
            className="mx-1"
            onClick={onCancel}
          />
          <Button
            type="secondary"
            label="Finish"
            size="md"
            className="mx-1"
            onClick={() => onFinish(stepName)}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddStepModal;
