// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes } from "@fortawesome/pro-regular-svg-icons";
import { FolderOpenIcon, CircleUser } from "../ushurs/SvgIcons.react";
import "./EngagementDetails.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Overlay from "react-bootstrap/Overlay";
import { useRef, useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import Pill from "../../components/Pill";
import { IA_STATUS_LABELS } from "../../utils/helpers.utils";

type DetailsProps = {
  userName: string;
  projectName: string;
  workflowName: string;
  status: string;
};

const EngagementDetails = (props: DetailsProps) => {
  const { projectName, workflowName, status, userName } = props;
  const [showUsernameTooltip, setShowUsernameTooltip] = useState(false);
  const usernameTooltipTarget = useRef(null);

  const handleTooltip = (e: any) => {
    if (e.target.scrollWidth > e.target.offsetWidth && e.target?.firstChild) {
      setShowUsernameTooltip(true);
    }
  };

  return (
    <>
      <div className="center engagement-details">
        <span className="engagement-title">Viewing engagement:</span>
        <OverlayTrigger
          key={"id"}
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>{projectName}</Tooltip>}
        >
          <span className="engagement-icon">
            <FolderOpenIcon
              className="folder-open"
              width="14"
              height="14"
              fill="#A7A8A9"
            />
          </span>
        </OverlayTrigger>
        <OverlayTrigger
          key={"id"}
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>{workflowName}</Tooltip>}
        >
          <span className="engagement-icon">
            <FontAwesomeIcon
              icon={faCubes as IconProp}
              width="14"
              height="14"
              color="#A7A8A9"
            />
          </span>
        </OverlayTrigger>
        <span className="engagement-icon">
          <CircleUser width="14" height="14" fill="#332E20" />
        </span>
        <Overlay
          target={usernameTooltipTarget.current}
          show={showUsernameTooltip}
          placement="top"
        >
          {(props) => (
            <Tooltip
              id="summary-overlay-tooltip"
              className="activity-summary-modal-overlay-tooltip"
              {...props}
            >
              {userName?.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
            </Tooltip>
          )}
        </Overlay>

        <span
          className="username"
          ref={usernameTooltipTarget}
          onMouseOver={(e) => handleTooltip(e)}
          onMouseLeave={() => setShowUsernameTooltip(false)}
        >
          {userName?.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
        </span>
        <span className="engagement-status">
          <Pill
            text={IA_STATUS_LABELS[status] || status}
            className={`ia-status-${status}`}
          />
        </span>
      </div>
    </>
  );
};

export default EngagementDetails;
