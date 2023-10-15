import PopoverMenu from "./PopoverMenu.react";
import { faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useModal } from "../../custom-hooks/useModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuDotIcon } from "./SvgIcons.react";
import CreateWorkflowModal from "./CreateWorkflowModal.react";
import {
  Button,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { isFreeTrial } from "../../features/free-trial/freeTrialSlice";
import { useAppSelector } from "../../app/hooks";

type ProjectMenuProps = {
  eventKey: string;
  onMouseOver: any;
  onMouseLeave: any;
};

const ProjectMenu = (props: ProjectMenuProps) => {
  const [isOpen, toggleIsOpen] = useModal();
  const { eventKey, onMouseOver, onMouseLeave } = props;
  const [openAcceleratorModal, toggleAcceleratorModal] = useModal();
  const isFreeTrialEnabled = useAppSelector(isFreeTrial)

  const triggerButtenEvent = () => {
    let children = document.getElementById("acc-" + eventKey)?.children[0];
    children?.classList.add("acc-active");
    let element = document.getElementsByClassName("bs-popover-bottom");
    for (var i = 0; i < element.length; i++) {
      if (eventKey !== element.item(i)?.id) {
        element.item(i)?.classList.remove("show");
      }
    }
  };

  return (
    <div className="projectMenu" style={{
      position: "absolute",
      right: "4.375rem",
      marginTop: "2.3rem",
      zIndex: "999"
    }}>
      <PopoverMenu
        style={{ zIndex: 999 }}
        callbackfun={(e: any) => {
          let all: any = document.querySelectorAll(".acc-active");
          for (let i = 0; i < all.length; i++) {
            all.item(i).classList.remove("acc-active");
          }
        }}
        Cardposition="popover"
        menuKey={eventKey}
        menuList={[
          {
            menus: <li className="popover-title">PROJECT MENU</li>,
            showMenu: true,
          },
          {
            menus: (
              <li className="popover-normal">
                <a
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleIsOpen()
                  }}
                >
                  Create Workflow
                </a>
              </li>
            ),
            showMenu: true,
          },
          {
            menus: (
              <li 
              className="popover-normal">
                Import Workflow{" "}
                <span style={{ color: "#CCCCCC" }}> &nbsp; (.ufo)</span>
              </li>
            ),
            showMenu: isFreeTrialEnabled ? false : true,
          },
          {
            menus: <li className="popover-normal">Edit Project Name</li>,
            showMenu: false,
          },
          {
            menus: (
              <li className="popover-delete">
                {" "}
                <FontAwesomeIcon
                  icon={faTrashAlt as IconProp}
                  color="red"
                  size={"sm"}
                />{" "}
                &nbsp; Delete Project
              </li>
            ),
            showMenu: false,
          },
        ]}
        button={
          <div
            onMouseEnter={(event: any) => {
              onMouseOver(event);
            }}
            onMouseLeave={(event: any) => onMouseLeave(event)}
            onClick={(e: any) => {
              e.stopPropagation();
              document.body.click();
              triggerButtenEvent();
            }}
          >
            <Button
              endIcon={
                <MenuDotIcon
                  className="popover-button-icon"
                  width="21"
                  height="21"
                />
              }
              className="popover-button menu-icon-button"
              type="secondary"
            />
          </div>
        }
      />
      <CreateWorkflowModal
        handleModalClose={toggleIsOpen}
        showModal={isOpen}
        selectedPrjMenu={eventKey}
      />
    </div>
  );
};

export default ProjectMenu;