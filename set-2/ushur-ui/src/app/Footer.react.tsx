import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { truncateText } from '../utils/helpers.utils';
import { getUserNickname, getUserEmailId } from '../utils/api.utils';
import { userLogout } from './authAPI';

type FooterProps = {
  show?: boolean;
}

const Footer = (props: FooterProps) => {
  const userNickname = getUserNickname() || getUserEmailId();
  const handleLogout = async () => {
    await userLogout();
  }

  return (
    <footer className="sidebar-footer" style={{boxShadow: props.show ? "0px 2px 16px rgba(0, 0, 0, 0.25)" : ""}}>
      <div className="nickname">
        <FontAwesomeIcon
          icon={faUser as IconProp}
          color="inhereit"
          size={"sm"}
        />
        <OverlayTrigger
          placement="top"
          overlay={
            userNickname.length > 10 ?
              <Tooltip id="tooltip-top">
                {userNickname}
              </Tooltip> : <></>
          }
        >
          <span className={`ml-2 ${userNickname.length > 10 ? 'cursor-pointer' : 'cursor-default'}`}>{truncateText(userNickname, 10)}</span>
        </OverlayTrigger>
      </div>
      <a href="#" data-testid="logout-button" onClick={handleLogout} >Logout</a>
    </footer>
  );
}
export default Footer;
