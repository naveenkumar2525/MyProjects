import { ReactElement } from "react";
import { Form } from "react-bootstrap";
import { Input } from "@ushurengg/uicomponents";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import RichTextEditor from "../../RichTextEditor";
import {
  selectedModule,
  setSelectedModule,
  isAddStepModalOpened,
  setIsAddStepModalOpened,
  selectedMenuOption,
  diagrammingService,
  selectedCellId,
} from "../../../data/canvasSlice";
import MenuOptions from "./MenuOptions";
import BranchDropdown from "./BranchDropdown";
import ModuleTypes from "../../../interfaces/module-types";
import { MenuModule as MenuModuleType } from "../../../../../api";
import AddStepModal from "./AddStepModal";

const MenuModule = (): ReactElement => {
  const currentSelectedModule = useAppSelector(
    selectedModule
  ) as MenuModuleType;
  const currentSelectedMenuOption = useAppSelector(selectedMenuOption);
  const isAddStepModalOpen = useAppSelector(isAddStepModalOpened);
  const currentDiagrammingService = useAppSelector(diagrammingService);
  const currentStepId = useAppSelector(selectedCellId) as string;
  const dispatch = useAppDispatch();

  /* handlers */
  const handleCancelAddStepModal = () => {
    dispatch(setIsAddStepModalOpened(false));
  };

  const handleFinishAddStepModal = (stepName: string) => {
    const newStepId = currentDiagrammingService?.addNewStep(
      currentStepId,
      stepName
    ) as string;
    if (currentSelectedModule && currentSelectedMenuOption) {
      const newMenuOptions = [...currentSelectedModule.menuOptions];
      const currentIndex = newMenuOptions.findIndex(
        (menuOption) => menuOption.id === currentSelectedMenuOption?.id
      );
      const newMenuOption = { ...currentSelectedMenuOption };
      newMenuOption.branchToStepId = newStepId;
      newMenuOptions[currentIndex] = newMenuOption;
      const newModule: MenuModuleType = {
        ...currentSelectedModule,
        menuOptions: newMenuOptions,
      };
      dispatch(setSelectedModule(newModule));
    }
    dispatch(setIsAddStepModalOpened(false));
  };

  const handleDismissAddStepModal = () => {
    dispatch(setIsAddStepModalOpened(false));
  };

  return (
    <div className={ModuleTypes.MENU_MODULE}>
      <Form.Label className="ushur-label">
        <span className="text-sm font-proxima-bold">
          {currentSelectedModule?.title} heading
        </span>
      </Form.Label>
      <RichTextEditor />
      <MenuOptions />
      <Input
        className="mt-4 tag-input"
        label={
          <span className="text-sm font-proxima-bold">Save user selection</span>
        }
        defaultValue={currentSelectedModule?.menuUserSelection}
        handleInputChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          const newModule: MenuModuleType = {
            ...currentSelectedModule,
            menuUserSelection: ev.target.value,
          };
          dispatch(setSelectedModule(newModule));
        }}
        placeholder="Select tag or datatable"
      />
      <div className="mt-4">
        <div className="col-7">
          <span className="text-sm font-proxima-bold">Error Limit</span>
          <span className="text-sm font-proxima-bold float-right">
            Branch to...
          </span>
        </div>
      </div>
      <div className="row m-0">
        <div className="m-0 col-7 border-solid rounded border-1 text-sm font-proxima-light">
          <div className="flex flex-row w-100">
            <Input
              className={`hide-label error-limit border-0 box-shadow-0 m-0 ${
                currentSelectedModule?.errorBranchTo !== "" ? "col-7" : "col-10"
              }`}
              handleInputChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                const newModule: MenuModuleType = {
                  ...currentSelectedModule,
                  errorLimitValue: ev.target.value,
                };
                dispatch(setSelectedModule(newModule));
              }}
              defaultValue={currentSelectedModule?.errorLimitValue}
            />
            <BranchDropdown
              onClick={() => {}}
              dropdownName="error-branch-dropdown"
            />
          </div>
        </div>
      </div>
      <AddStepModal
        showModal={isAddStepModalOpen}
        onCancel={handleCancelAddStepModal}
        onFinish={handleFinishAddStepModal}
        onDismiss={handleDismissAddStepModal}
      />
    </div>
  );
};

export default MenuModule;
