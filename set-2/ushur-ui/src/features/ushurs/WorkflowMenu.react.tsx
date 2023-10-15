import React, { useState } from "react";
import PopoverMenu from "./PopoverMenu.react";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuDotIcon } from "./SvgIcons.react";
import { ArrowIcon } from "./SvgIcons.react";
import { useModal } from "../../custom-hooks/useModal";
import CloneWorkflowModal from "./CloneWorkflowModal.react";
import ExportWorkflowModal from "./ExportWorkflow.react";
import { useAppDispatch } from "../../app/hooks";
import { setActiveMenu, subMenuID } from "./ushursSlice";
import { useAppSelector } from "../../app/hooks";
import { useHistory } from "react-router-dom";
import { isFreeTrial } from "../../features/free-trial/freeTrialSlice";

type Props = {
  workflow: string;
  buttonIndex: any;
  cardActiveIndex: any;
  selevariable: any;
  status?: boolean;
};

const WorkflowMenu = (props: Props) => {
  const dispatch = useAppDispatch();
  const { workflow, buttonIndex, cardActiveIndex, selevariable, status } =
    props;
  const [isCloneOpen, toggleIsCloneOpen] = useModal();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const previousActiveID = useAppSelector(subMenuID);
  const history = useHistory();
  const isFreeTrialEnabled = useAppSelector(isFreeTrial)

  function callbackfun(e: any) {
    if (e == false) {
      document
        .getElementById("button-index-" + previousActiveID[0]?.ActiveMenu)
        ?.classList.remove("group-active-button");
      document
        .querySelector("." + previousActiveID[0]?.actionMenuCard)
        ?.classList.remove("active-card");
    } else {
      document
        .getElementById("button-index-" + buttonIndex)
        ?.classList.add("group-active-button");
      document
        .querySelector("." + cardActiveIndex)
        ?.classList.add("active-card");
      dispatch(
        setActiveMenu([
          { ActiveMenu: buttonIndex, actionMenuCard: cardActiveIndex },
        ])
      );
    }
  }

  return (
    <>
      <PopoverMenu
        callbackfun={(e: any) => {
          callbackfun(e);
        }}
        Cardposition="submenu-custom"
        menuKey={buttonIndex}
        menuList={[
          {
            menus: <li className="popover-title">WORKFLOW MENU</li>,
            showMenu: true,
          },
          {
            menus: (
              <li
                className="popover-normal"
                onClick={() => {
                  setExportDialogOpen(true);
                }}
              >
                Export Workflow
              </li>
            ),
            showMenu: isFreeTrialEnabled ? false : true,
          },
          {
            menus: (
              <li className="popover-normal" onClick={toggleIsCloneOpen}>
                Clone
              </li>
            ),
            showMenu: false,
          },
          {
            menus: <li className="popover-normal">Edit Name & Description</li>,
            showMenu: false,
          },
          {
            menus: (
              <li className="popover-normal">
                Go to Draft
                <ArrowIcon width="18" height="18" />
              </li>
            ),
            showMenu: false,
          },
          {
            menus: (
              <li className="popover-delete">
                {" "}
                <FontAwesomeIcon
                  icon={faTrash as IconProp}
                  color="red"
                  size={"sm"}
                />{" "}
                &nbsp; Delete Workflow
              </li>
            ),
            showMenu: false,
          },
          {
            menus: (
              <li
                className={`popover-normal ${status ? "" : "unpub"}`}
                onClick={() => {
                  const route: any = `${status ? "launchpad" : "project"}`;
                  const params = new URLSearchParams({ route });
                  history.replace({
                    search: params.toString(),
                    state: { value: workflow },
                  });
                }}
              >
                <div style={{ textDecoration: "none" }}>Launchpad</div>
                <span style={{ width: "100%", paddingRight: 11 }}>
                  <ArrowIcon width="16" height="16" />
                </span>
              </li>
            ),
            showMenu: true,
          },
          {
            menus: (
              <li
                className="popover-normal"
                onClick={() => {
                  const route: any = "campaign";
                  const params = new URLSearchParams({ route });
                  history.replace({
                    search: params.toString(),
                    state: { value: workflow },
                  });
                }}
              >
                <div style={{ textDecoration: "none" }}>Campaign Analytics</div>
                <span style={{ paddingRight: 11 }}>
                  <ArrowIcon width="16" height="16" />
                </span>
              </li>
            ),
            showMenu: true,
          },
        ]}
        button={
          <div
            data-testid="workflow-menu"
            className="popover-button customBtn"
            id={"button-pop-ref-" + cardActiveIndex}
            onClick={(e) => {
              document.body.click();
              e.stopPropagation();
            }}
          >
            <MenuDotIcon
              className="popover-button-icon"
              width="22"
              height="22"
            />
          </div>
        }
      />
      <CloneWorkflowModal
        handleModalClose={toggleIsCloneOpen}
        showModal={isCloneOpen}
        currentWorkflow={workflow}
      />
      <ExportWorkflowModal
        open={exportDialogOpen}
        onClose={() => {
          setExportDialogOpen(false);
        }}
        campaignId={workflow}
      />
    </>
  );
};

export default WorkflowMenu;
