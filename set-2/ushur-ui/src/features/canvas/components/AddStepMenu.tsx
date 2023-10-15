import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, RotateProp } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faSplit,
  faTrashCan,
} from "@fortawesome/pro-thin-svg-icons";

const inBranchIcon = faArrowDown as IconProp;
const outBranchIcon = faSplit as IconProp;
const deleteBranchIcon = faTrashCan as IconProp;

export enum AddStepMenuOptions {
  AddInBranch = "add.inBranch",
  AddOutBranch = "add.outBranch",
  DeleteBranch = "delete.Branch",
}
export interface AddStepMenuProp {
  onClickMenu: (option: AddStepMenuOptions) => void;
}

interface MenuItemProp {
  menuIcon: IconProp;
  iconRotation?: RotateProp;
  iconClassName: string;
  text: string;
  textClassName: string;
  index: number;
  onClick: () => void;
}

const MenuItem = ({
  menuIcon,
  iconRotation,
  iconClassName,
  text,
  textClassName,
  index,
  onClick,
}: MenuItemProp): ReactElement => (
  <div
    className="flex flex-row items-center mb-2 cursor-pointer"
    onClick={onClick}
    role="presentation"
    tabIndex={index}
  >
    <div className="w-4 h-4 flex flex-row justify-center">
      <FontAwesomeIcon
        className={iconClassName}
        icon={menuIcon}
        rotation={iconRotation}
      />
    </div>

    <p className={textClassName}>{text}</p>
  </div>
);

const AddStepMenu = ({ onClickMenu }: AddStepMenuProp): ReactElement => (
  <div className="app-step-menu">
    <p className="text-primary-gray font-semibold text-xs mb-2">ADD STEP</p>
    <MenuItem
      menuIcon={inBranchIcon}
      iconClassName="cursor-pointer text-base"
      text="In this branch"
      textClassName="text-dark-blue font-thin text-base mb-0 ml-1"
      index={0}
      onClick={() => {
        onClickMenu(AddStepMenuOptions.AddInBranch);
      }}
    />
    <MenuItem
      menuIcon={outBranchIcon}
      iconRotation={90}
      iconClassName="cursor-pointer text-base"
      text="On new branch"
      textClassName="text-dark-blue font-thin text-base mb-0 ml-1"
      index={1}
      onClick={() => {
        onClickMenu(AddStepMenuOptions.AddOutBranch);
      }}
    />
    <hr className="my-2 text-gray-200 w-36" />

    <MenuItem
      menuIcon={deleteBranchIcon}
      iconClassName="cursor-pointer text-base text-red-500"
      text="Delete branch"
      textClassName="text-red-500 font-thin mb-0 ml-1"
      index={2}
      onClick={() => {
        onClickMenu(AddStepMenuOptions.DeleteBranch);
      }}
    />
  </div>
);

export default AddStepMenu;
