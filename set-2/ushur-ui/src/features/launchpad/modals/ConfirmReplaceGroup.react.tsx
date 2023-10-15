import React from 'react';
import ConfirmModal from "./ConfirmModal.react";

type Props = {
  handleModalClose: () => void;
  handleConfirmClick: () => void;
  showModal: boolean;
};

const replaceGroupProps = {
  title: "New Group selected",
  okLabel: "Yes, Replace Group",
  closeLabel: "No, Cancel",
};

const ConfirmReplaceGroup = (props: Props) => {
  return (
    <ConfirmModal
      {...{ ...props, ...replaceGroupProps }}
    >
      <p className="text-sm">This will replace all your currently added contacts with the selected group.</p>
    </ConfirmModal>
  )
}

export default ConfirmReplaceGroup;
