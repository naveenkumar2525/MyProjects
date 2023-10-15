import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@ushurengg/uicomponents";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { selectedModule, setSelectedModule } from "../../../data/canvasSlice";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import DraggableMenuInput from "./DraggableMenuInput";
import AddMenuOption from "./AddMenuOption";
import MenuOptionHeader from "./MenuOptionHeader";
import {
  MenuModule as MenuModuleType,
  MenuOption as MenuOptionType,
} from "../../../../../api";
import useOutsideClickAlert from "../../../../../custom-hooks/useOutsideClickAlert";

const optionsMaxLimit = 26; // count of A-Z
/* eslint max-lines-per-function: ["error", 200] */
const MenuOptions: React.FC = () => {
  const currentSelectedModule = useAppSelector(
    selectedModule
  ) as MenuModuleType;
  const currentMenuOptions = currentSelectedModule.menuOptions ?? [];
  const dispatch = useAppDispatch();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [editibleIndex, setEditibleIndex] = useState<number | null>(null);
  const editableInputRef = useRef<HTMLInputElement>(null);
  const swapItems = (
    menuListOptions: MenuOptionType[],
    srcIndex: number,
    dstIndex: number
  ) => {
    const newMenuOptions = [...menuListOptions];
    const movingItem = newMenuOptions[srcIndex];
    newMenuOptions[srcIndex] = newMenuOptions[dstIndex];
    newMenuOptions[dstIndex] = movingItem;
    return newMenuOptions;
  };

  useEffect(() => {
    setEditibleIndex(null);
    setHoveredIndex(null);
  }, [currentSelectedModule]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      // in same zone
      if (destination.index === source.index) return;
      const newMenuOptions = swapItems(
        currentMenuOptions,
        source.index,
        destination.index
      );
      const newModule: MenuModuleType = {
        ...currentSelectedModule,
        menuOptions: newMenuOptions,
      };
      dispatch(setSelectedModule(newModule));
    }
  };
  const handleOnEvent =
    (index: number) => (isHovered: boolean, isEditable: boolean) => {
      if (isHovered) {
        setHoveredIndex(index);
      } else setHoveredIndex(null);
      if (isEditable) {
        setEditibleIndex(index);
      }
    };
  const addNewOption = () => {
    if (currentMenuOptions.length < optionsMaxLimit) {
      const newMenuOption: MenuOptionType = {
        id: uuidv4(),
        title: "Next Menu Option",
        branchToStepId: "",
      };
      const newMenuOptions = [...currentMenuOptions];
      newMenuOptions.push(newMenuOption);
      const newModule: MenuModuleType = {
        ...currentSelectedModule,
        menuOptions: newMenuOptions,
      };
      dispatch(setSelectedModule(newModule));
      // Scroll window by 50px on each add option click.
      window.scrollBy(0, 50);
    }
  };
  const updateMenuOption = (
    updatedOptionValue: MenuOptionType,
    index: number
  ) => {
    const newMenuOptions = [...currentMenuOptions];
    newMenuOptions[index] = updatedOptionValue;
    const newModule: MenuModuleType = {
      ...currentSelectedModule,
      menuOptions: newMenuOptions,
    };
    dispatch(setSelectedModule(newModule));
  };
  return (
    <div className="menu-options-module">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="menu-list-zone">
          {(provided) => (
            <div
              // eslint-disable-next-line max-len
              className="menu-options"
              ref={provided.innerRef}
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              {...provided.droppableProps}
            >
              <MenuOptionHeader />
              {currentMenuOptions.map(
                (menuOption: MenuOptionType, index: number) => (
                  <Draggable
                    draggableId={menuOption.id}
                    index={index}
                    key={menuOption.id + index.toString()}
                  >
                    {(draggableProvided, snapshot) => (
                      <div
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...draggableProvided.draggableProps}
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...draggableProvided.dragHandleProps}
                        ref={draggableProvided.innerRef}
                        className="col-9 mt-2"
                        onKeyDown={() => {}}
                        role="presentation"
                      >
                        {useOutsideClickAlert(
                          editableInputRef,
                          editibleIndex === index,
                          () => {
                            const newMenuOption = { ...menuOption };
                            newMenuOption.title =
                              editableInputRef.current?.value ?? "";
                            updateMenuOption(newMenuOption, index);
                            setHoveredIndex(null);
                            setEditibleIndex(null);
                          }
                        )}
                        {editibleIndex === index ? (
                          <div>
                            <Input
                              innerRef={editableInputRef}
                              className="hide-label font-proxima-light text-sm text-dark-blue"
                              defaultValue={menuOption?.title}
                            />
                          </div>
                        ) : (
                          <DraggableMenuInput
                            onEvent={handleOnEvent(index)}
                            isHovered={hoveredIndex === index}
                            draggableBorder={
                              snapshot.draggingOver === "menu-list-zone"
                                ? "border-dotted"
                                : "border-solid"
                            }
                            index={index}
                            currentMenuOption={{ ...menuOption }}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {currentMenuOptions.length < optionsMaxLimit && (
        <AddMenuOption
          isFirstOption={currentMenuOptions.length >= 1}
          addOptionClick={addNewOption}
        />
      )}
    </div>
  );
};

export default MenuOptions;
