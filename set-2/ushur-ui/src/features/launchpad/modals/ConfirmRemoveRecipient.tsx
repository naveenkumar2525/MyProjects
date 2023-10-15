import React from "react";
// @ts-ignore
import ConfirmModal from "./ConfirmModal.react";

type Props = {
  handleModalClose: () => void;
  handleConfirmClick: () => void;
  showModal: boolean;
  count: Number;
};

const ConfirmRemoveRecipient = (props: Props) => {
  const { count, ...restProps } = props;

  const removeRecipientsProps = {
    title: `Remove recipient${count > 1 ? "s" : ""}?`,
    okLabel: 'Yes, Remove',
    closeLabel: "Cancel",
  };

  return (
    <ConfirmModal {...{ ...removeRecipientsProps, ...restProps }}>
      <>
        <div className="text-sm ">
          {`Are you sure you want to remove the selected ${count} contact${count > 1 ? "s" : ""
            } from the recipients list?`}
        </div>
      </>
    </ConfirmModal>
  );
};

export default ConfirmRemoveRecipient;
