import React from "react";
import ConfirmModal from "./ConfirmModal.react";

type Props = {
  handleModalClose: () => void;
  handleConfirmClick: () => void;
  showModal: boolean;
  count: number;
};

const launchProps = {
  title: "Launch Engagement?",
  okLabel: "Yes, Launch",
  closeLabel: "Close",
};

const ConfirmLaunch = (props: Props) => {
  const { count, ...restProps } = props;

  return (
    <ConfirmModal {...{ ...restProps, ...launchProps }}>
      <div className="text-sm" style={{ minHeight: 80 }}>
        {`Are you sure you want to launch the engagement for ${count} contact${
          count > 1 ? "s" : ""
        }?`}
      </div>
    </ConfirmModal>
  );
};

export default ConfirmLaunch;
