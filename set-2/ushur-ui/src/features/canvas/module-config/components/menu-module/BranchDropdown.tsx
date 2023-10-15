import { ReactElement, useRef, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCodeBranch, faPlusCircle } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "@ushurengg/uicomponents";
import { useAppSelector } from "../../../../../app/hooks";
import { getSteps } from "../../../data/canvasSlice";
import useOutsideClickAlert from "../../../../../custom-hooks/useOutsideClickAlert";

const faPlusCircleIcon = faPlusCircle as IconProp;

type BranchDropdownProps = {
  dropdownName: string;
  onClick: (branchToStepId: string) => void;
  openDropdown?: boolean;
  onClickNewStep?: () => void;
  branchToStepId?: string;
};

const BranchDropdown = (props: BranchDropdownProps): ReactElement => {
  const {
    dropdownName,
    openDropdown,
    onClick,
    onClickNewStep,
    branchToStepId = "",
  } = props;
  const allSteps = useAppSelector(getSteps);
  const [shouldOpenDropdown, setShouldOpenDropdown] = useState<boolean>(
    openDropdown ?? false
  );
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClickAlert(branchDropdownRef, shouldOpenDropdown, () => {
    setShouldOpenDropdown(false);
    if (branchToStepId) onClick(branchToStepId);
  });
  const handleClickStep = (selectedStepId: string) => {
    onClick(selectedStepId);
  };

  return (
    <div className="border-l-[2px] p-0" ref={branchDropdownRef}>
      <Dropdown
        data-testid={dropdownName}
        className="menu-branch-dropdown border-0 box-shadow-0 h-full flex flex-column items-center justify-center"
        title={
          <div className="flex flex-row items-center">
            <FontAwesomeIcon
              icon={faCodeBranch as IconProp}
              size="1x"
              className={shouldOpenDropdown ? "text-blue" : ""}
            />
            {shouldOpenDropdown && (
              <p className="text-blue font-thin text-md mb-0 ml-1">
                Select Step
              </p>
            )}
          </div>
        }
        onClick={() => {
          setShouldOpenDropdown(!shouldOpenDropdown);
        }}
        options={allSteps?.map((step) => ({
          category: "",
          onClick: () => handleClickStep(step.id),
          text: (
            <p className="text-blue font-thin text-sm mb-0 ml-1">
              {step.attrs?.label?.text}
            </p>
          ),
        }))}
        actionButton={{
          onClick: onClickNewStep,
          text: (
            <span className="text-blue font-thin text-sm mb-0 ml-1">
              <FontAwesomeIcon
                style={{ background: "transparent" }}
                icon={faPlusCircleIcon}
                className="mr-2 cursor-pointer"
              />
              New Step
            </span>
          ),
        }}
        helperText=""
        name="branchTo"
        showDivider
        show={shouldOpenDropdown}
      />
    </div>
  );
};

export default BranchDropdown;
