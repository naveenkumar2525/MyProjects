import { useState, useEffect, useRef } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashCan,
  faUpDown,
  faCodeBranch,
} from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@ushurengg/uicomponents";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {
  selectedModule,
  setSelectedModule,
  setIsAddStepModalOpened,
  setAddStepModalPosition,
  setSelectedMenuOption,
  getStepFromId,
  diagrammingService,
  selectedCellId,
} from "../../../data/canvasSlice";
import BranchDropdown from "./BranchDropdown";
import {
  MenuModule as MenuModuleType,
  MenuOption as MenuOptionType,
} from "../../../../../api";

type DraggableMenuInputProps = {
  currentMenuOption: MenuOptionType;
  index: number;
  onEvent: (isHovered: boolean, isEditible: boolean) => void;
  isHovered: boolean;
  draggableBorder: string;
};

const DraggableMenuInput = (props: DraggableMenuInputProps) => {
  const { currentMenuOption, index, onEvent, isHovered, draggableBorder } =
    props;
  const [isPillVisible, setIsPillVisible] = useState<boolean>(false);
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
  const currentSelectedModule = useAppSelector(
    selectedModule
  ) as MenuModuleType;
  const branchToStep = useAppSelector(
    getStepFromId(currentMenuOption.branchToStepId)
  );
  const currentDiagrammingService = useAppSelector(diagrammingService);
  const currentStepId = useAppSelector(selectedCellId) as string;
  const dispatch = useAppDispatch();
  const thisRef = useRef(null);
  const alphaCharCodeArray = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabetsArray = alphaCharCodeArray.map((x) => String.fromCharCode(x));
  useEffect(() => {
    setIsPillVisible(currentMenuOption.branchToStepId as unknown as boolean);
  }, [currentMenuOption]);

  const handleDeleteMenuOption = (deleteIndex: number) => {
    const newMenuOptions = [...currentSelectedModule?.menuOptions];
    newMenuOptions.splice(deleteIndex, 1);
    const newModule: MenuModuleType = {
      ...currentSelectedModule,
      menuOptions: newMenuOptions,
    };
    dispatch(setSelectedModule(newModule));
  };

  const updateMenuOption = (updatedOptionValue: MenuOptionType) => {
    const newMenuOptions = [...currentSelectedModule?.menuOptions];
    newMenuOptions[index] = updatedOptionValue;
    const newModule: MenuModuleType = {
      ...currentSelectedModule,
      menuOptions: newMenuOptions,
    };
    dispatch(setSelectedModule(newModule));
  };

  const handleSelectBranch = (branchToStepId: string) => {
    currentMenuOption.branchToStepId = branchToStepId;
    // joint js draws line to selected step
    currentDiagrammingService?.linkTwoSteps(currentStepId, branchToStepId);
    updateMenuOption(currentMenuOption);
  };

  const handleClickNewStep = () => {
    if (!thisRef.current) return;
    const rect: DOMRect = (
      thisRef.current as unknown as HTMLElement
    ).getBoundingClientRect(); // get position of menu option element to place modal there
    dispatch(setSelectedMenuOption(currentMenuOption));
    dispatch(setIsAddStepModalOpened(true));
    // for now give constant value to coordinate modal position
    dispatch(setAddStepModalPosition({ x: rect.left - 600, y: rect.top + 10 }));
  };

  const handleClickPill = () => {
    setIsPillVisible(false);
    setIsShowDropdown(true);
  };

  const getSettingsButton = () =>
    currentMenuOption?.branchToStepId && isPillVisible ? (
      <Button
        startIcon={
          <FontAwesomeIcon
            icon={faCodeBranch as IconProp}
            size="1x"
            className="text-white"
          />
        }
        label={branchToStep?.attrs?.label?.text}
        onClick={handleClickPill}
        // hate this, as we can't customize bootstrap button color
        // with tailwind class as bootstrap class is more prioritized than tailwind class
        style={{ backgroundColor: "#6fcf97" }}
      />
    ) : (
      <BranchDropdown
        onClick={handleSelectBranch}
        onClickNewStep={handleClickNewStep}
        dropdownName="menu-branch-dropdown"
        branchToStepId={currentMenuOption.branchToStepId}
        openDropdown={isShowDropdown}
      />
    );

  return (
    <div
      className={`flex flex-row justify-between m-0 
        rounded border-1 ${draggableBorder} ${
        isHovered || draggableBorder === "border-dotted"
          ? "border-[#2F80ED]"
          : ""
      } text-sm font-proxima-light`}
      ref={thisRef}
    >
      <div
        data-testid="draggable-input"
        className={`p-1 flex flex-row items-center ${
          currentMenuOption?.branchToStepId ? "" : "w-11/12"
        }`}
        role="presentation"
        onMouseLeave={() => onEvent(false, false)}
        onMouseOver={() => onEvent(true, false)}
        onFocus={() => onEvent(true, false)}
        onBlur={() => onEvent(false, false)}
        onClick={() => onEvent(false, true)}
        onKeyDown={() => onEvent(false, true)}
      >
        {isHovered && (
          <FontAwesomeIcon
            data-testid="up-down-icon"
            icon={faUpDown as IconProp}
            size="1x"
            color="#d3d3d3"
          />
        )}
        <span className="text-dark-blue pl-2">
          <i
            className={`text-dark-blue fa-solid 
            fa-circle-${alphabetsArray[index].toLowerCase()}`}
          />
          &nbsp; {currentMenuOption?.title} &nbsp;
        </span>
        {isHovered && (
          <span
            role="button"
            tabIndex={0}
            className="ml-auto"
            onClick={() => {
              handleDeleteMenuOption(index);
            }}
            onKeyDown={() => {}}
          >
            <FontAwesomeIcon
              data-testid="delete-icon"
              icon={faTrashCan as IconProp}
              size="1x"
              color="red"
            />
          </span>
        )}
      </div>
      {getSettingsButton()}
    </div>
  );
};

export default DraggableMenuInput;
