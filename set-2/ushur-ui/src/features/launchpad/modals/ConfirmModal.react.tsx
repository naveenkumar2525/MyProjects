import React from "react";
// @ts-ignore
import { Modal } from "@ushurengg/uicomponents";

type Props = {
  handleModalClose: () => void;
  handleConfirmClick: () => void;
  showModal: boolean;
  title: string;
  okLabel: string;
  closeLabel: string;
  children: any;
  className?: string;
};

const ConfirmModal = (props: Props) => {
  const {
    handleModalClose,
    handleConfirmClick,
    showModal,
    title,
    okLabel,
    closeLabel,
    children,
    className = "",
  } = props;

  return (
    <Modal
      className={`confrimation-modal ${className}`}
      onHide={handleModalClose}
      size="md"
      title={title}
      closeLabel={closeLabel}
      showModal={showModal}
      actions={[
        {
          onClick: handleConfirmClick,
          text: okLabel,
          type: "primary",
        },
      ].filter(({ text }) => text)}
      backdrop
    >
      {children}
    </Modal>
  );
};

export default ConfirmModal;
