import { useState } from "react";
import CustomSwitch from "../components/CustomSwitch.react";
import { isFreeTrial } from '../features/free-trial/freeTrialSlice';
import ushurLogo from "../ushur-logo.png";
import { useAppSelector } from './hooks';
import { basePath } from '../utils/helpers.utils';
import styles from "./Header.module.css";

type HeaderProps = {
  headerShadow: boolean;
};
const Header = (props: HeaderProps) => {
  const { headerShadow } = props;
  const isFreeTrialEnabled = useAppSelector(isFreeTrial);
  const [isActive, setIsActive] = useState(true);
  return (
    <>
      <div
        className="flex justify-around pr-2 items-center p-3 header-section" style={{
          background: isFreeTrialEnabled ? "#F4F5F7" : '', boxShadow: headerShadow
            ? "0px 2px 16px rgba(0, 0, 0, 0.25)"
            : "",
        }}
      >
        <a href={basePath + "/ushur-ui/"}>
          <img width={70.24} height={24} src={ushurLogo}></img>
        </a>
        {
          isFreeTrialEnabled ? <div className={styles.freeTrialPill}>
            <span className="m-auto">FREE TRIAL</span>
          </div> : <CustomSwitch
            style={{ width: "4rem", fontSize: "0.5rem" }}
            toggle={isActive}
            onChange={() => {
              setIsActive(!isActive);
              window.location.href =
              basePath +
                "/dashboard";
            }}
            activeColor="linear-gradient(104.17deg, #2bd5c4 0%, #4851f0 100%)"
            inactiveColor="#d9d8d6"
            activeText="Beta v2"
            inactiveText="Try Beta"
            tooltipText="Click to return to the Orginal Ushur Experience"
          />
        }
      </div>
    </>
  );
};
export default Header;
