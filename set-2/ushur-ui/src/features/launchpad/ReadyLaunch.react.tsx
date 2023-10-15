import { useState, useEffect } from "react";
import { useModal } from "../../custom-hooks/useModal";
import ChannelSelect from "./ChannelSelect.react";
import EngagementSummary from "./EngagementSummary.react";
import GroupSelect from "./GroupSelect.react";
import LaunchEngagement from "./LaunchEngagement.react";
import {
  launchUshur,
  selectedContacts,
  errorContacts,
  setCurrentGroup,
  setSelectedGroup,
  setContacts,
  launchResp,
  resetLaunchResp,
} from "./launchpadSlice";
import { notifyToast } from "@ushurengg/uicomponents";
import ConfirmLaunch from "./modals/ConfirmLaunch.react";
import WorkflowSelect from "./WorkflowSelect.react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { faHexagonExclamation } from '@fortawesome/pro-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from "moment";

const maxRecipients = 500;

const HeadTitle = () => {
  return (
    <>
      <div className="text-base font-semibold">Ready to launch?</div>
      <div className="text-xs font-normal pb-2">
        Select a workflow, group, and channel to launch your engagement.
      </div>
    </>
  );
};

type Props = {
  width?: number | string;
  defaultValue:any
};
const useDelayUnmount = (isMounted: boolean, delayTime: number) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: any;
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);
  return shouldRender;
};

const ReadyLaunch = (props: Props) => {
  const { width = 250,defaultValue } = props;
  const dispatch = useAppDispatch();
  const selContacts = useAppSelector(selectedContacts);
  const errContacts = useAppSelector(errorContacts);
  const response = useAppSelector(launchResp);
  const [workflow, setWorkflow] = useState("");
  const [channel, setChannel] = useState("");
  const [allowLaunch, setAllowLaunch] = useState(false);
  const [confirmLaunch, toggleLaunch] = useModal();
  let isSuccess: any;

  useEffect(() => {
    if (workflow && channel && selContacts.length > 0 && selContacts?.length <= maxRecipients) {
      setAllowLaunch(true);
    } else {
      setAllowLaunch(false);
    }
  }, [workflow, channel, selContacts]);

  const onClickLaunch = () => {
    toggleLaunch();
    dispatch(
      launchUshur({
        workflow,
        channel,
        users: selContacts.map(({ userPhoneNo }: any) => userPhoneNo) ?? [],
      })
    );
  };

  const onSuccess = () => {
    setWorkflow("");
    setChannel("");
    dispatch(setCurrentGroup(""));
    dispatch(setSelectedGroup(""));
    dispatch(setContacts([]));
  };

  useEffect(() => {
    if (response?.success || response?.respCode === 200) {
      isSuccess = "success";
    } else if (response?.respText?.includes("500")) {
      isSuccess = "maxAtt";
    } else {
      isSuccess = "fail";
    }
    if (response) {
      if (isSuccess === "success") {
        onSuccess();
      }
      notifyToast({ variant: isSuccess === "success" ? "success" : "error", text: isSuccess === "success" ? "Success" : "Error", subText: isSuccess === "success" ? "Workflow Launched Successfully at "+moment().format("MM/DD/YYYY hh:mm:ss A") : isSuccess === "maxAtt" ? "Not able to launch workflow when contacts more than 500." : "There are failures while lanching ushur. Please try again.", animation: true })
    }
    dispatch(resetLaunchResp());
  }, [response]);

  return (
    <div className="bg-white p-3 rounded-lg" style={{ width }}>
      <HeadTitle />
      <WorkflowSelect value={workflow} onSelect={setWorkflow} selectDefault={defaultValue} />
      <GroupSelect />
      <ChannelSelect value={channel} onSelect={setChannel} />
      <EngagementSummary
        goodCount={selContacts.length}
        errorCount={errContacts.length}
      />
      <LaunchEngagement disabled={!allowLaunch} onClick={toggleLaunch} />
      {selContacts.length > maxRecipients &&
        <p className="d-flex mt-2.5 error-msg">
          <FontAwesomeIcon icon={faHexagonExclamation as IconProp} className="mt-1" />
          <span className="ml-1">Cannot launch to more than {maxRecipients} recipients at a time.</span>
        </p>
      }
      <ConfirmLaunch
        handleModalClose={toggleLaunch}
        handleConfirmClick={onClickLaunch}
        showModal={confirmLaunch}
        count={selContacts.length}
      />
    </div>
  );
};

export default ReadyLaunch;


