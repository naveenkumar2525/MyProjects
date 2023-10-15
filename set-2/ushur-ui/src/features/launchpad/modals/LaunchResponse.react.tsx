import React, { useEffect } from "react";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useModal } from "../../../custom-hooks/useModal";
import { launchResp, resetLaunchResp } from "../launchpadSlice";
// @ts-ignore
import ConfirmModal from "./ConfirmModal.react";

const commonProps = {
  okLabel: "",
  handleConfirmClick: () => {},
  closeLabel: "Close",
};

const successTitle = "Workflow launched successfully";
const errorTitle = "Unable to launch engagement";

type Props = {
  onSuccess: () => void;
};

const LaunchResponse = (props: Props) => {
  const { onSuccess } = props;
  const dispatch = useAppDispatch();
  const response = useAppSelector(launchResp);
  const [showDialog, toggleDialog, closeDialog] = useModal();
  let isSuccess: any;

  if (response?.success || response?.respCode === 200) {
    isSuccess = "success";
  } else if (response?.respText?.includes("500")) {
    isSuccess = "maxAtt";
  } else {
    isSuccess = "fail";
  }
  const onClose = () => {
    closeDialog();
    dispatch(resetLaunchResp());
  };

  useEffect(() => {
    if (response && !showDialog) {
      toggleDialog();
      if (isSuccess === "success") {
        onSuccess();
      }
      // auto close the dialog after 3 seconds
      setTimeout(onClose, 3000);
    }
  }, [response]);

  const modalProps = {
    ...commonProps,
    title: isSuccess === "success" ? successTitle : errorTitle,
    showModal: showDialog,
    handleModalClose: onClose,
  };

  return showDialog ? (
    <ConfirmModal {...modalProps}>
      <div className="text-sm" style={{ minHeight: 80 }}>
        {isSuccess === "success"
          ? moment().format("MM/DD/YYYY hh:mm:ss A")
          : isSuccess === "maxAtt"
          ? "Not able to launch workflow when contacts more than 500."
          : "There are failures while lanching ushur. Please try again."}
      </div>
    </ConfirmModal>
  ) : null;
};

export default LaunchResponse;
