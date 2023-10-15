import "./ActivitySummaryModal.css";
import {
  Modal
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  activitySummaryList,
  activitySummaryStatus,
  getActivitySummaryData,
  getUshurJSON,
  ushurDetails,
} from "../ushurs/ushursSlice";
import EngagementDetails from "./EngagementDetails.react";
import EngagementEvents from "./EngagementEvents.react";
import { useEffect } from "react";

type modalProps = {
  isOpen: boolean;
  handleModalClose: (isOpen: boolean) => void;
  engagementDetails: any;
  engagementHistoryView: string;
  handleModalRefresh: () => void;
};

const ActivitySummaryModal = (props: modalProps) => {
  const dispatch = useAppDispatch();
  const results = useAppSelector(activitySummaryList);
  const status = useAppSelector(activitySummaryStatus);
  const sections = useAppSelector(getUshurJSON);
  const selectedUshur = useAppSelector(ushurDetails);
  const { handleModalClose, isOpen, engagementDetails, handleModalRefresh } = props;

  useEffect(() => {
    if (engagementDetails.sid && isOpen) {
      dispatch(
        getActivitySummaryData({
          summary: false,
          sid: engagementDetails.sid,
        })
      );
    }
  }, [isOpen]);

  const onModalClose = () => {
    handleModalClose(false);
  };
  const newLabels: any = {
    Initiated: "Queued",
    Egressed: "Awaiting reply",
    Engaged: "Ongoing",
    Completed: "Complete",
    Expired: "Expired",
  };
  return (
    <Modal
      className="activity-summary-modal"
      onHide={onModalClose}
      size="lg"
      title="Activity Summary"
      subTitle="Activities are displayed in chronological order, with the most recent activity displayed first."
      showModal={isOpen}
    >
      <div>
        <EngagementDetails
          userName={engagementDetails?.userName}
          projectName={selectedUshur?.AppContext}
          workflowName={selectedUshur?.id}
          status={status}
        />
        <EngagementEvents
          events={results}
          sections={sections}
          engagementHistoryView={props.engagementHistoryView?.toLowerCase()}
          onRefresh={() => {
            handleModalRefresh();
            dispatch(
              getActivitySummaryData({
                summary: false,
                sid: engagementDetails.sid,
              })
            );
          }}
        />
      </div>
    </Modal>
  );
};

export default ActivitySummaryModal;
