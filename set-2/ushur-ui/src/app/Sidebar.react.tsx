import React, { useState, useRef, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./sidebar.css";
import {
  ToastContainer,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { isFreeTrial } from "../features/free-trial/freeTrialSlice";
import { useAppSelector } from "../app/hooks";
import CustomSwitch from "../components/CustomSwitch.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useModal } from "../custom-hooks/useModal";
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import CreateWorkflowModal from "../features/ushurs/CreateWorkflowModal.react";
import FreeTrialCreateWorkflowModal from "../features/free-trial/FreeTrialCreateWorkflowModal.react";
import Footer from "./Footer.react";
import useUrlSearchParams from "../custom-hooks/useUrlSearchParams";
import Header from "./Header.react";
import { notifyFunctionalityComingSoon } from "../features/canvas/data/validation";

const SpanBorder = ({ activeMenu, currentMenu }: any) => (
  <span
    className={`Border ${activeMenu === currentMenu ? "active" : ""}`}
  ></span>
);

const DivMenu = ({ activeMenu, currentMenu, displayMenu, className = "" }: any) => (
  <div
    className={`menu-item ${activeMenu === currentMenu ? "active-menu" : ""} ${className}`}
  >
    {displayMenu}
  </div>
);

const MenuItem = ({
  activeMenu,
  currentMenu,
  displayMenu,
  route,
  onClick,
}: any) => {
  const history = useHistory();

  return (
    <div className="mainItems">
      <SpanBorder {...{ activeMenu, currentMenu }} />
      <div
        className="menu-link cursor-pointer"
        onClick={() => {
          const params = new URLSearchParams({ route });
          history.replace({ search: params.toString() });
          onClick(currentMenu);
        }}
      >
        <DivMenu {...{ activeMenu, currentMenu, displayMenu }} />
      </div>
    </div>
  );
};

type SidebarProps = {
  children: any;
};

const Sidebar = (props: SidebarProps) => {
  const { children } = props;
  const { route } = useUrlSearchParams();
  const isFreeTrialEnabled = useAppSelector(isFreeTrial)
  const [activeMenu, setActiveMenu] = useState(route ?? "project");
  const [top, setTop] = useState(0);
  const [isOpen, toggleIsOpen] = useModal();
  const [openAcceleratorModal, toggleAcceleratorModal] = useModal();
  const [headerShadow, setHeaderShadow] = useState(false);
  const [footerShadow, setFooterShadow] = useState(false);
  const sidebar: any = useRef(null);
  const getOffset = (el: any) => {
    return {
      top: el.getBoundingClientRect().top,
    };
  };

  useEffect(() => {
    const mainSection = document.querySelector('.main-section');
    const el1 = document.querySelector('.sidebar-btn');
    const el2 = document.querySelector('.support');
    if (el1 && el2 && mainSection) {
      mainSection.addEventListener('scroll', function () {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        // Only completely visible elements return true:
        const isBtnVisible = (rect1.top - 30 >= 0) && (rect1.bottom <= window.innerHeight);
        if (isBtnVisible) {
          setHeaderShadow(false);
        } else {
          setHeaderShadow(true);
        }
        var isSupportVisible = (rect2.top >= 0) && (rect2.bottom + 30 <= window.innerHeight);
        if (isSupportVisible) {
          setFooterShadow(false);
        } else {
          setFooterShadow(true);
        }
      });
    }
  }, []);


  useEffect(() => {
    setActiveMenu(route ?? "project")
    setTimeout(() => {
    const nav_list: any = document.querySelectorAll(".sidebar .menu-item");
    const magicLine: any = document.querySelector(".site-nav__line");
    const sideBar: any = document.querySelector(".sidebar");
    const accordionButton: any = document.querySelectorAll(".accordion-button");
    const activeMenuItem: any = () =>
      document.querySelector(".menu-item.active-menu");

    const setActiveIndicatorProperties = (obj: any) => {
      for (const prop in obj) {
        magicLine.style[prop] = obj[prop];
      }
    };

    const isActiveMenuPresent = () => {
      if (
        activeMenuItem()?.offsetWidth > 0 ||
        activeMenuItem()?.offsetHeight > 0
      ) {
        return true;
      }
      return false;
    };

    if (isActiveMenuPresent()) {
      const topPos: any = getOffset(activeMenuItem()).top;
      setTop(topPos);
      setActiveIndicatorProperties({ height: "40px", borderRadius: "20px" });
    }

    nav_list.forEach((list: any) => {
      list.addEventListener("mouseover", () => {
        const topPos: any = getOffset(list).top;
        setTop(topPos + 16);
        setActiveIndicatorProperties({ height: "8px" });
      });
      list.addEventListener("click", () => {
        const topPos: any = getOffset(list).top;
        setTop(topPos);
        setActiveIndicatorProperties({ height: "40px", borderRadius: "20px" });
      });
    });

    sideBar.addEventListener("mouseleave", () => {
      if (isActiveMenuPresent()) {
        const topPos: any = getOffset(activeMenuItem()).top;
        setTop(topPos);
        setActiveIndicatorProperties({ height: "40px", borderRadius: "20px" });
      }
    });

    accordionButton.forEach((accordian: any) => {
      accordian.addEventListener("click", function () {
        setTimeout(function () {
          if (isActiveMenuPresent()) {
            magicLine.style.removeProperty("transition");
            const topPos: any = getOffset(activeMenuItem()).top;
            setTop(topPos);
            setActiveIndicatorProperties({
              height: "40px",
              borderRadius: "20px",
            });
          } else {
            magicLine.style.removeProperty("transition");
            setActiveIndicatorProperties({
              height: "0px",
              transition: "top 300ms",
            });
          }
        }, 1000);
      });
    });
  }, 100);
  }, [route]);

  useEffect(() => {
    const overlay: any = window.document.querySelector(".overlay");
    const nav_list = document.querySelectorAll(".menu-item");
    const overlayActive: any = window.document.querySelector(
      ".overlay.active-menu"
    );
    const menu: any = window.document.querySelector(".menu-item.active-menu");
    nav_list.forEach((list: any) => {
      list.addEventListener("mouseout", () => {
        overlay.classList.remove("active-menu");
        if (overlayActive) {
          menu.classList.remove("active-menu");
        }
      });
      return () => {
        list.removeEventListener("mouseout", () => {
          let position = list.getBoundingClientRect();
          overlay.classList.remove("active-menu");
          if (menu) {
            menu.classList.remove("active-menu");
          }
        });
      };
    });
    // window.addEventListener('mouseover', mouseOver);

    // // cleanup this component
  }, []);
  return (
    <div className='d-flex'>
      <ToastContainer />
      <nav
        style={{
          background: "rgb(250, 250, 250)",
          position: "fixed",
          backgroundColor: "#FFFFFF",
          boxShadow: "1px 0px 8px rgba(0, 0, 0, 0.15)",
          width: "12rem",
          height: "100vh",
          top: 0,
          zIndex: 99999999
        }}
      >
        <Header headerShadow={headerShadow} />
        <div className="main-section">
          <a
            className="sidebar-btn text-base"
            onClick={() => isFreeTrialEnabled ? toggleAcceleratorModal() : toggleIsOpen()}
          >
            <span>{isFreeTrialEnabled ? 'Create Project' : 'Create Workflow'}</span>
          </a>
          <div className="sidebar" ref={sidebar}>
            <div className={`overlay `} style={{ top: top + 7 }}></div>

            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="sidebar-title">
                  AUTOMATION
              </Accordion.Header>
                <Accordion.Body>
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="project"
                    displayMenu="Projects"
                    onClick={setActiveMenu}
                    route="project"
                  />
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="canvas"
                    displayMenu="Canvas"
                    onClick={()=> notifyFunctionalityComingSoon()}
                    route="canvas"
                  />
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="launchpad"
                    displayMenu="Launchpad"
                    onClick={setActiveMenu}
                    route="launchpad"
                  />
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="hub_settings"
                    displayMenu="Invisible Portal"
                    onClick={setActiveMenu}
                    route="hub_settings"
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="sidebar-title  analytics">
                  ANALYTICS
              </Accordion.Header>
                <Accordion.Body>
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="analytics"
                    displayMenu={isFreeTrialEnabled ? "Insights" : "Metrics"}
                    onClick={setActiveMenu}
                    route="analytics"
                  />
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="campaign"
                    displayMenu="Campaign"
                    onClick={setActiveMenu}
                    route="campaign"
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="sidebar-title">
                  Manage
              </Accordion.Header>
                <Accordion.Body>
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="datatables"
                    displayMenu="Data Tables"
                    onClick={setActiveMenu}
                    route="datatables"
                  />
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="rules_manager"
                    displayMenu="ML Studio"
                    onClick={setActiveMenu}
                    route="rules_manager"
                  />
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="contacts"
                    displayMenu="Contacts"
                    onClick={setActiveMenu}
                    route="contacts"
                  />
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="short_links"
                    displayMenu="Shortlinks"
                    onClick={setActiveMenu}
                    route="short_links"
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="sidebar-title">
                  Account
              </Accordion.Header>
                <Accordion.Body>
                  <MenuItem
                    activeMenu={activeMenu}
                    currentMenu="integration"
                    displayMenu="Integrations"
                    onClick={setActiveMenu}
                    route="integration"
                  />
                  <div className="mainItems">
                    <SpanBorder activeMenu={activeMenu} currentMenu="support" />
                    <a
                      className="menu-link"
                      href="https://ushur.com/support/"
                      onClick={() => setActiveMenu("support")}
                      target="_blank"
                    >
                      <DivMenu
                        activeMenu={activeMenu}
                        currentMenu="support"
                        displayMenu="Support"
                        className="support"
                      />
                    </a>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div className="site-nav__line animation" style={{ top }}></div>
          </div>

        </div>
        <CreateWorkflowModal
          handleModalClose={toggleIsOpen}
          showModal={isOpen}
          selectedPrjMenu={""}
        />
        <FreeTrialCreateWorkflowModal handleModalClose={toggleAcceleratorModal} showModal={openAcceleratorModal} />
        <Footer show={footerShadow} />
      </nav>
      <div className="main-content flex-1">{children}</div>
    </div>
  );
};

export default Sidebar;
