import { faPhoneSlash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import "./BlockedContact.css";

type BlockedContactProps = {
  user: any
}

const BlockedContact = (props: BlockedContactProps) => {
  const { user } = props;
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="tooltip-top" className="blocklist-tooltip">
          <div>Blocklisted</div>
          <div>Updated on: {user?.updateTimestamp ? moment(new Date(user.updateTimestamp)).format('DD/MM/YYYY') : '--'}</div>
          {
            user?.isUserInitiated === 'Yes' && <div>Initiated by: End-user</div>
          }
        </Tooltip>
      }
    >
      <div className="blocklist-icon flex justify-center items-center" role="blocklistIcon">
        <FontAwesomeIcon
          icon={faPhoneSlash as IconProp}
          width="12"
          height="12"
        />
      </div>
    </OverlayTrigger>
  )
}

export default BlockedContact;