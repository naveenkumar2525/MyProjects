import { FunctionComponent, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faXmark,
  faExpandArrowsAlt,
  faWindowMinimize,
} from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Offcanvas } from "react-bootstrap";

// styles for reflex
import "react-reflex/styles.css";

// after the styles, import the components
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement,
  HandlerProps,
} from "react-reflex";

import styles from "./SimulatorFlyout.module.css";
import WorkflowTimeline from "./workflow/Timeline";

interface FlyoutProps {
  showSimulator: boolean;
  setShowSimulator: (value: boolean) => void;
}
const onResize = (e: HandlerProps) => {
  const domElem = (e?.domElement as Element) || "";
  if (domElem) {
    domElem.classList.add("resizing");
  }
  e.domElement = { ...e.domElement, ...domElem }; // eslint-disable-line no-param-reassign
};
const onStopResize = (e: HandlerProps) => {
  const domElem = (e?.domElement as Element) || "";
  if (domElem) {
    domElem.classList.remove("resizing");
  }
  e.domElement = { ...e.domElement, ...domElem }; // eslint-disable-line no-param-reassign
};

const SimulatorFlyout: FunctionComponent<FlyoutProps> = ({
  showSimulator,
  setShowSimulator,
  children,
}) => {
  const [topFlex, setTopFlex] = useState(0.75);
  const expandProcessSection = () => {
    setTopFlex(0.25);
  };
  const minimizeProcessSection = () => {
    setTopFlex(0.75);
  };
  return (
    <Offcanvas
      data-testid="simulator-panel"
      show={showSimulator}
      placement="end"
      className={styles.mobilesimulator}
    >
      <Offcanvas.Header className="bg-slate-blue h-[53px]">
        <Offcanvas.Title
          className={`font-proxima-light text-white ${styles.flyout_header}`}
        >
          Test Workflow
        </Offcanvas.Title>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowSimulator(false)}
          onKeyDown={() => setShowSimulator(false)}
          className={`text-red rounded p-2 ${styles.flyout_header_close_button} !w-1/4 flex items-center 
                  justify-center cursor-pointer top-0 right-0 font-proxima-light not-italic leading-5 bg-white`}
        >
          <FontAwesomeIcon className="mr-1" icon={faXmark as IconProp} /> Close
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body className="flex items-center flex-column justify-around bg-very-light-blue">
        <ReflexContainer orientation="horizontal">
          <ReflexElement
            className="flex justify-center"
            onResize={onResize}
            onStopResize={onStopResize}
            flex={topFlex}
            data-testid="simulator-top"
          >
            {children}
          </ReflexElement>
          <ReflexSplitter className={styles.panel_splitter} />
          <ReflexElement
            className={styles.panel2}
            data-testid="simulator-bottom"
          >
            <div>
              <div className={styles.panel2_top}>
                <div className="h4 font-proxima-light">Workflow Process</div>
                <div>
                  {topFlex > 0.25 ? (
                    <FontAwesomeIcon
                      className={`mr-2 cursor-pointer ${styles.icon_expand}`}
                      data-testid="expand-workflow-process"
                      icon={faExpandArrowsAlt as IconProp}
                      onClick={expandProcessSection}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className={`mr-2 cursor-pointer ${styles.icon_expand}`}
                      data-testid="minimise-workflow-process"
                      icon={faWindowMinimize as IconProp}
                      onClick={minimizeProcessSection}
                    />
                  )}
                </div>
              </div>
              <div
                className={`flex flex-row flex-nowrap content-end items-center font-proxima-light ${styles.legend}`}
              >
                <div className={`${styles.dt_box} gap-2`} />
                Datatables
                <div className={styles.warn_box} />
                Warning
                <div className={styles.var_box} />
                Variables
                <div className={styles.err_box} />
                Errors
              </div>
              <div className={styles.var_section}>
                <WorkflowTimeline />
              </div>
            </div>
          </ReflexElement>
        </ReflexContainer>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SimulatorFlyout;
