import { useContext, useRef } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTag, faDatabase } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "@ushurengg/uicomponents";
import TagsContext from "./Context";
import TagsTable from "./TagsTable";
import DatatableTagsTable from "./DatatableTagsTable";
import styles from "./SaveToTagModal.module.css";

const SaveToTagModal = () => {
  const {
    setCreateTagModalState,
    saveToTagModalState,
    setSaveToTagModalState,
  } = useContext(TagsContext);
  const inspector = useRef(
    document.getElementsByClassName("canvas-inspector")[0]
  );

  const showCreateTagModal = () => {
    setCreateTagModalState((createTagModalPevState) => ({
      ...createTagModalPevState,
      show: true,
      onCreate: (newTag) => {
        setSaveToTagModalState((saveToTagModalPrevState) => ({
          ...saveToTagModalPrevState,
          show: true,
          outputTag: newTag,
        }));
      },
    }));
  };

  const hideSaveToTagModal = () => {
    setSaveToTagModalState((prevState) => ({
      ...prevState,
      show: false,
      outputTag: null,
    }));
  };

  return (
    <Modal
      style={{
        left: inspector.current?.getBoundingClientRect().left,
      }}
      className={styles.modal}
      backdrop={false}
      show={saveToTagModalState.show}
      centered
      onHide={hideSaveToTagModal}
    >
      <div className="px-3 py-2">
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title>
            <span>Save output</span>
          </Modal.Title>
        </Modal.Header>
        <p className="text-sm text-gray-400 mb-3">
          Save the output of this field to a tag or datatable so that you can
          reference it later. If one doesn&apos;t already exist, create a new
          one.
        </p>

        <Modal.Body className="p-0">
          <TagsTable />
          <DatatableTagsTable />
        </Modal.Body>

        <Modal.Footer className={styles.modalFooter}>
          <div className="flex flex-nowrap justify-between w-100">
            <Button label="Cancel" type="cancel" onClick={hideSaveToTagModal} />
            <div className="flex flex-nowrap">
              <Button
                onClick={() => {
                  hideSaveToTagModal();
                  showCreateTagModal();
                }}
                className="ml-2"
                label="New tag"
                type="secondary"
                startIcon={
                  <FontAwesomeIcon icon={faTag as IconProp} size="lg" />
                }
              />
              <Button
                label="New datatable property"
                type="secondary"
                className="ml-2"
                startIcon={
                  <FontAwesomeIcon icon={faDatabase as IconProp} size="lg" />
                }
              />
              <Button
                onClick={hideSaveToTagModal}
                disabled={!saveToTagModalState.outputTag}
                className="ml-2"
                label="Submit"
                type="primary"
              />
            </div>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default SaveToTagModal;
