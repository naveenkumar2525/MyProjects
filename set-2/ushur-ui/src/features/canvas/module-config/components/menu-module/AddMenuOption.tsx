import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCirclePlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AddOptionProps = {
  isFirstOption: boolean;
  addOptionClick: () => void;
};
const AddMenuOption = (props: AddOptionProps) => {
  const { isFirstOption, addOptionClick } = props;
  return (
    <div className="mt-2 text-sm font-proxima-light">
      <div
        role="button"
        tabIndex={0}
        className="col-9 p-1 border-dashed rounded border-2 cursor-pointer add-menu-option"
        onClick={addOptionClick}
        onKeyDown={() => {}}
      >
        <FontAwesomeIcon
          icon={faCirclePlus as IconProp}
          size="1x"
          color="#d3d3d3"
        />
        <span className="pl-3">
          {isFirstOption ? "Add another option" : "Add option"}
        </span>
      </div>
    </div>
  );
};
export default AddMenuOption;
