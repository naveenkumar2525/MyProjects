import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-thin-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser,
  faSignal,
  faWifi,
  faBatteryFull,
} from "@fortawesome/pro-solid-svg-icons";
import { workflowDetails } from "../data/canvasSlice";
import { getDefaultVirtualNo } from "../../../utils/api.utils";
import { useAppSelector } from "../../../app/hooks";
import { Workflow } from "../../../api/api";
import { formatVirtualNumber } from "../../../utils/helpers.utils";
import styles from "./TextTopSection.module.css";

const TextTopSection = () => {
  const currentWorkflowDetails = useAppSelector<Workflow | null>(
    workflowDetails
  );
  const workflowVirtualNumber =
    currentWorkflowDetails?.virtualPhoneNumber ?? "";
  const defaultVirtualNumber = getDefaultVirtualNo() ?? "";
  const phoneNumber = formatVirtualNumber(
    defaultVirtualNumber,
    workflowVirtualNumber
  );
  const today = new Date();
  const time = `${today.getHours()}:${String(today.getMinutes()).padStart(
    2,
    "0"
  )}`;
  return (
    <>
      <div className={styles.simulator_top_section}>
        <div className={styles.simulator_top_firstrow}>
          <div className={styles.simulator_top_left}>{time}</div>
          <div className={styles.simulator_top_right}>
            <FontAwesomeIcon
              className={styles.simulator_top_right_icon}
              icon={faSignal as IconProp}
            />
            <FontAwesomeIcon
              className={styles.simulator_top_right_icon}
              icon={faWifi as IconProp}
            />
            <FontAwesomeIcon
              className={styles.simulator_top_right_icon}
              icon={faBatteryFull as IconProp}
            />
          </div>
        </div>
        <div>
          <div className={styles.simulator_top_center}>
            <FontAwesomeIcon
              className={styles.simulator_user_icon}
              icon={faCircleUser as IconProp}
            />
            <div className={styles.simulator_top_center_no}>
              {phoneNumber}
              <FontAwesomeIcon
                className={`mr-1 ${styles.simulator_forward_icon}`}
                icon={faChevronRight as IconProp}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextTopSection;
