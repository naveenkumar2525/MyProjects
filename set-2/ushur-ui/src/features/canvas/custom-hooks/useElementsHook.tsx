import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectedModule, setSelectedModule } from "../data/canvasSlice";
import { FormElement, FormModule, FormTextInput } from "../../../api";
import {
  staticElements,
  formElements,
} from "../module-config/components/form-module/elements";

const useElementsHook = () => {
  const dispatch = useAppDispatch();
  const currentSelectedModule = useAppSelector(selectedModule);
  const [elements, setElements] = useState<FormElement[]>(
    (currentSelectedModule as FormModule)?.fields?.slice() || []
  );

  useEffect(() => {
    const updatedModule: FormModule = {
      ...(currentSelectedModule as FormModule),
      fields: elements.slice(),
    };

    dispatch(setSelectedModule(updatedModule));
  }, [elements]);

  const addToElements = (
    element: FormElement | undefined,
    index: number | undefined
  ) => {
    if (element) {
      setElements((prevElements) => {
        const { length } = prevElements.filter(
          (prevElement) => prevElement.name === element.name
        );

        const elementId = element.id ?? "";

        const newElement = {
          ...element,
          id: `${elementId}-${length}`,
        };

        if (typeof index === "number") {
          prevElements.splice(index, 0, newElement);
        } else {
          prevElements.push(newElement);
        }

        return prevElements.slice();
      });
    }
  };

  const updateElementInfo = (
    prevElements: FormElement[],
    elementId: string | undefined,
    elementData: string
  ) => {
    const elementsArr: FormElement[] = Object.assign([], prevElements);
    const currElementIndex = elementsArr.findIndex(
      (currValue: FormElement) => currValue.id === elementId
    );
    const elementFormData: FormTextInput = {
      ...elementsArr[currElementIndex].data,
      fieldValue: elementData,
    };
    const element: FormElement = {
      ...elementsArr[currElementIndex],
      data: elementFormData,
    };
    setElements(() => {
      elementsArr[currElementIndex] = element;
      return elementsArr.slice();
    });
  };

  const swapElements = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex !== destinationIndex) {
      setElements((prevElements) => {
        const element = prevElements[sourceIndex];
        prevElements.splice(sourceIndex, 1);
        prevElements.splice(destinationIndex, 0, element);
        return prevElements.slice();
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === "selectedElements") {
      switch (source.droppableId) {
        case "staticElements": {
          const staticElement = staticElements.find(
            (item) => item.id === draggableId
          );

          addToElements(staticElement, destination?.index);
          break;
        }

        case "formElements": {
          const formElement = formElements.find(
            (item) => item.id === draggableId
          );

          addToElements(formElement, destination?.index);
          break;
        }

        case "selectedElements": {
          swapElements(source.index, destination.index);
          break;
        }

        default: {
          break;
        }
      }
    }
  };

  return { elements, updateElementInfo, onDragEnd };
};

export default useElementsHook;
