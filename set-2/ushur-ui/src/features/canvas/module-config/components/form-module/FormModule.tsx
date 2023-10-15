import { ReactElement } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown } from "@fortawesome/pro-thin-svg-icons";
import { staticElements, formElements } from "./elements";
import ElementsList from "./ElementsList";
import FieldsList from "./FieldsList";
import useElementsHook from "../../../custom-hooks/useElementsHook";
import "./FormModule.css";
import ModuleTypes from "../../../interfaces/module-types";

const FormModule = (): ReactElement => {
  const { elements, onDragEnd } = useElementsHook();

  return (
    <div className={ModuleTypes.FORM_MODULE}>
      {elements.length === 0 && (
        <p className="pl-5 mb-1 text-sm text-gray-400">
          This form has no elements
        </p>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="
          flex flex-column justify-center grow
          bg-gray-100 border-t border-l-0 border-r-0 border-b border-dashed border-primary-gray
          pl-3 pr-2 pt-2 pb-2 mb-4"
        >
          <FieldsList
            elements={elements}
            droppableId="selectedElements"
            isDropDisabled={false}
          >
            <p className="mt-1 mb-2 text-sm text-center text-gray-400">
              Click or drag and drop elements
              <br />
              to begin constructing your form.
            </p>

            <p className="mb-0 text-center text-gray-400">
              <FontAwesomeIcon icon={faAngleDown as IconProp} size="lg" />
            </p>
          </FieldsList>
        </div>

        <div className="pl-5 pr-3 mb-3">
          <p className="ml-1 mb-1 font-proxima-bold text-sm">Static elements</p>

          <ElementsList
            elements={staticElements}
            droppableId="staticElements"
            isDropDisabled
          />
        </div>

        <div className="pl-5 pr-3">
          <p className="ml-1 mb-1 font-proxima-bold text-sm">Form elements</p>

          <ElementsList
            elements={formElements}
            droppableId="formElements"
            isDropDisabled
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default FormModule;
