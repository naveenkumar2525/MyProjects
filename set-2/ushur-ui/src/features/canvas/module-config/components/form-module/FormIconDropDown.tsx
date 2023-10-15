import { useContext } from "react";
import { Dropdown as UshurDropdown } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashCan,
  faToggleOff,
  faFloppyDisk,
} from "@fortawesome/pro-thin-svg-icons";
import TagsContext from "../../../tags/Context";

const faTrashIcon = faTrashCan as IconProp;
const faToggleOffIcon = faToggleOff as IconProp;
const faFloppyDiskIcon = faFloppyDisk as IconProp;

type Props = {
  maxWidth: string;
};
function FormDropDown(props: Props) {
  const { maxWidth } = props;
  const { setSaveToTagModalState } = useContext(TagsContext);

  return (
    <div>
      <UshurDropdown
        actionButton={{
          onClick: function noRefCheck() {},
          text: (
            <span>
              {" "}
              <FontAwesomeIcon
                style={{ background: "transparent" }}
                icon={faTrashIcon}
                className="mr-2 cursor-pointer"
              />
              Delete Field
            </span>
          ),
        }}
        maxWidth={maxWidth}
        options={[
          {
            category: "FIELD MENU",
            onClick: () => {},
            text: (
              <span>
                <FontAwesomeIcon
                  icon={faToggleOffIcon}
                  className="mr-2 cursor-pointer"
                />{" "}
                <span className="relative" style={{ left: "-5px" }}>
                  Make a field optional
                </span>
              </span>
            ),
            value: "make a field optional",
          },
          {
            category: "FIELD MENU",
            onClick: () => {
              setSaveToTagModalState((prevState) => ({
                ...prevState,
                show: true,
              }));
            },
            text: (
              <span>
                <FontAwesomeIcon
                  icon={faFloppyDiskIcon}
                  className="mr-2 cursor-pointer"
                />
                Save output
              </span>
            ),
            value: "Save output",
          },
        ]}
        className="add-data-dropdown"
        showDivider
        title={
          <span>
            <i className="fa-light fa-ellipsis-vertical canvas-gearDropdown" />
          </span>
        }
        type="button"
      />
    </div>
  );
}

export default FormDropDown;
