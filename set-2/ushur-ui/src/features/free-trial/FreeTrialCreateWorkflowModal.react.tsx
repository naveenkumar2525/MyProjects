import React, { useState, useEffect } from "react";
// @ts-ignore
import { Modal } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { accelerators } from './freeTrialSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CreateWorkflowModal from '../ushurs/CreateWorkflowModal.react';
import { useModal } from '../../custom-hooks/useModal';
import { basePath } from '../../utils/helpers.utils';
import styles from "./FreeTrialCreateWorkflowModal.module.css";
import ProjectBrandingModal from '../free-trial/ProjectBrandingPage/ProjectBrandingModal.react';

const AcceleratorCard = ({ item, handleClick, selectedAccelerator }: any) => {
  const { name, iconUrl, description, cardBackgroundColor } = item;

  const SelectedStateIcon = () => {
    return (
      <div className={`${styles.acceleratorSelectedState} d-flex items-center justify-center w-6 h-6`}>
        <FontAwesomeIcon
          icon={faCheck as IconProp}
          color="#3D3F65"
          size={"lg"}
          className="bg-none"
        />
      </div>
    )
  }

  return (
    <div className={`${styles.cardWrapper} ${selectedAccelerator.name === name ? styles.active : ''}`} onClick={() => handleClick(item)}>
      <div className={styles.cardHead} style={{ backgroundColor: cardBackgroundColor }}>
        {selectedAccelerator.name === name ?
          <SelectedStateIcon />
          : <img src={`${basePath}/ushur-ui/assets/${iconUrl}`} />}
      </div>
      <div className={styles.cardBody}>
        <h2>{(name?.length > 20) ? name.substr(0, 17) + "..." : name}</h2>
        <p>{description?.substr(0, 100)}...</p>
      </div>
    </div>
  );
};

type Props = {
  handleModalClose: () => void;
  showModal: boolean;
};

const FreeTrialCreateWorkflowModal = (props: Props) => {
  const acceleratorsArr = useAppSelector(accelerators);
  const [openProjectBrandingModal, toggleProjectBrandingModal] = useModal();
  const { handleModalClose, showModal } = props;
  const [isWorkflowModalOpen, toggleWorkflowModalOpen] = useModal();
  const [selectedAccelerator, setSelectedAccelerator] = useState<any>({});

  useEffect(() => {
    setSelectedAccelerator({});
  }, [showModal]);

  const handleNextClick = () => {
    toggleProjectBrandingModal();
  }

  return (
    <>
      <Modal
        className={styles.acceleratorModal}
        onHide={handleModalClose}
        size="lg"
        title="Create Project"
        subTitle="Projects are collections of workflows, datatables, and brand settings."
        closeLabel="Cancel"
        showModal={showModal}
        actions={acceleratorsArr.length > 0 ? [
          {
            text: (
              <div className='d-flex items-center'>
                <span>Next</span>
                <FontAwesomeIcon
                  icon={faChevronRight as IconProp}
                  color="white"
                  size={"sm"}
                />
              </div>
            ),
            onClick: handleNextClick,
            type: "primary",
            disabled: !selectedAccelerator?.name
          }
        ] : []}
        backdrop
      >
        {acceleratorsArr.map((item: any) => {
          return (
            <AcceleratorCard item={item} handleClick={(item: any) => setSelectedAccelerator(item)} selectedAccelerator={selectedAccelerator} />
          );
        })}
        <div className={styles.cardWrapper} onClick={() => {
          toggleWorkflowModalOpen();
          handleModalClose();
        }}>
          <div className={styles.cardHead} style={{ backgroundColor: "#F3F3F3" }}>
            <img src={`${basePath}/ushur-ui/assets/compass-drafting.png`} />
          </div>
          <div className={styles.cardBody}>
            <h2>Start from Scratch</h2>
            <p>Begin with a fresh project, empty datatable, and blank canvas.</p>
          </div>
        </div>
      </Modal>
      <CreateWorkflowModal handleModalClose={toggleWorkflowModalOpen} showModal={isWorkflowModalOpen} selectedPrjMenu={""} />
      {
        <ProjectBrandingModal
          handleAllModalsClose={() => {
            toggleProjectBrandingModal();
            handleModalClose();
          }}
          handleModalClose={toggleProjectBrandingModal}
          showModal={openProjectBrandingModal}
          selectedAccelerator={selectedAccelerator}
        />
      }
    </>
  );
};

export default FreeTrialCreateWorkflowModal;

