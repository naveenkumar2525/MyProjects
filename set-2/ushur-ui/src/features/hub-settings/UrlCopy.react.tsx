import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faLink } from "@fortawesome/pro-regular-svg-icons";
import { faCheckCircle  } from "@fortawesome/pro-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { copyToClipboard } from "../../utils/helpers.utils";

type Props = {
  url: string;
  label: string;
  active: boolean;
};

//used to update the tooltip size and position dynamically when its text changes
const UpdatingToolTip = React.forwardRef<any, any>(
   ({ popper, children, show: _, ...props }, ref) => {
      useEffect(() => {
         popper.scheduleUpdate();
      }, [children, popper]);

      return (
         <Tooltip ref={ref} body {...props}>
            {children}
         </Tooltip>
      );
   }
);

const UrlCopy = (props: Props) => {

  const { url, label, active } = props;
  const [copied, setCopied] = useState<boolean>(false);

  const handleClick = (): void => {
     if (active) {
        setCopied(true);
        copyToClipboard(url);
     }
  };

  return (
     <div>
        <label className="ushur-label form-label mt-10">{label}</label>
        <div className="flex justify-between">
           <label
              className="ushur-text break-all"
              style={{ color: active ? "#2F80ED" : "#A7A8A9" }}
           >
              {url}
           </label>
           <OverlayTrigger
              placement={"top"}
              overlay={
                 <UpdatingToolTip id="popover-contained">
                    {copied ? "Copied!" : "Copy Link"}
                 </UpdatingToolTip>
              }
           >
              <div
                 className={`${active ? "cursor-pointer" : ""} ${
                    copied ? "border-1 border-[#03AD2A]" : ""
                 } grid place-content-center w-[31px] h-[32px] rounded-[4px] bg-[#F4F5F7] `}
              >
                 <FontAwesomeIcon
                    color={
                       active ? (copied ? "#03AD2A" : "#2F80ED") : "#A7A8A9"
                    }
                    onClick={handleClick}
                    //@ts-ignore
                    icon={copied ? faCheckCircle : faLink}
                 />
              </div>
           </OverlayTrigger>
        </div>
     </div>
  );
};

export default UrlCopy;