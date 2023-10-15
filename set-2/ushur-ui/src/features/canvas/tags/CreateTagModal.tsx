import { useContext, useEffect, useState, useRef, ChangeEvent } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTag } from "@fortawesome/pro-thin-svg-icons";
import Select from "react-select";
import toLower from "lodash/toLower";
import { Button, Input } from "@ushurengg/uicomponents";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getTagTypesAsync,
  getTagsAsync,
  createTagAsync,
} from "../data/canvasAsyncRequests";
import {
  workflowDetails,
  tagTypesResponse,
  tagsResponse,
} from "../data/canvasSlice";
import TagsContext from "./Context";
import styles from "./CreateTagModal.module.css";

type TagTypeOption = {
  value: string;
  label: string;
};

const selectStyles = {
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    boxShadow: "none",
    fontSize: "12px",
    height: "32px",
    minHeight: "32px",
  }),
  valueContainer: (provided: Record<string, unknown>) => ({
    ...provided,
    padding: "0 0.75rem",
  }),
  singleValue: (provided: Record<string, unknown>) => ({
    ...provided,
    margin: "0px",
  }),
  input: (provided: Record<string, unknown>) => ({
    ...provided,
    height: "32px",
    margin: "0px",
    padding: "0px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (provided: Record<string, unknown>) => ({
    ...provided,
    height: "32px",
  }),
  option: (provided: Record<string, unknown>) => ({
    ...provided,
    fontSize: "12px",
  }),
};

type NameInputProps = {
  name: string;
  setName: (name: string) => void;
  formErrors: Record<string, string | undefined>;
  setFormErrors: (prevErrors: Record<string, string | undefined>) => void;
};

const NameInput = (props: NameInputProps) => {
  const { name, setName, formErrors, setFormErrors } = props;

  return (
    <Input
      label="Tag name"
      value={name}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setName(value);

        setFormErrors({
          ...formErrors,
          name: /^[a-zA-Z0-9-_]*$/.test(value)
            ? undefined
            : "Tag name is not valid",
        });
      }}
      error={formErrors.name}
      tooltipText={formErrors.name}
    />
  );
};

/* eslint-disable-next-line max-lines-per-function */
const CreateTagModal = () => {
  const dispatch = useAppDispatch();
  const currentWorkflowDetails = useAppSelector(workflowDetails);
  const tagTypes = useAppSelector(tagTypesResponse);
  const tags = useAppSelector(tagsResponse);
  const { createTagModalState, setCreateTagModalState } =
    useContext(TagsContext);
  const [tagTypeOptions, setTagTypeOptions] = useState<TagTypeOption[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<TagTypeOption | null>(null);
  const [formErrors, setFormErrors] = useState<
    Record<string, string | undefined>
  >({});
  const inspector = useRef(
    document.getElementsByClassName("canvas-inspector")[0]
  );

  useEffect(() => {
    dispatch(getTagTypesAsync()).catch(() => {});
    dispatch(getTagsAsync(currentWorkflowDetails?.id as string)).catch(
      () => {}
    );
  }, []);

  useEffect(() => {
    const options: TagTypeOption[] = [];

    tagTypes?.content?.map((item) => {
      if (item.title) {
        options.push({
          value: item.type as string,
          label: item.title,
        });
      }

      return item;
    });

    setTagTypeOptions(options);
  }, [tagTypes]);

  const hideCreateTagModal = () => {
    setCreateTagModalState((prevState) => ({
      ...prevState,
      show: false,
      onCreate: () => {},
    }));
    setName("");
    setType(null);
  };

  const saveTag = () => {
    const data: Record<string, string>[] = [];

    let error: string | undefined;

    tags?.content?.map((item) => {
      item.vars?.map((variable) => {
        data.push(variable);

        if (toLower(variable.desc as string) === toLower(name)) {
          error = "Tag already exists";
        }

        return variable;
      });

      return item;
    });

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      name: error,
    }));

    if (error) {
      return;
    }

    const tagId = `c_uVar_${name}`;
    const newTag: Record<string, string> = {
      desc: name,
      type: type?.value as string,
      variable: tagId,
      private: "no",
    };

    newTag[tagId] = type?.value as string;
    data.push(newTag);

    dispatch(
      createTagAsync({
        campaignId: currentWorkflowDetails?.id as string,
        vars: data,
      })
    )
      .then(() => {
        const { onCreate } = createTagModalState;

        hideCreateTagModal();
        onCreate(newTag);

        return dispatch(getTagsAsync(currentWorkflowDetails?.id as string));
      })
      .catch(() => {});
  };

  return (
    <Modal
      style={{
        left: inspector.current?.getBoundingClientRect().left,
      }}
      className={styles.modal}
      backdrop={false}
      show={createTagModalState.show}
      centered
      onHide={hideCreateTagModal}
    >
      <div className="px-3 py-2">
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title>
            <span className="flex items-center">
              <FontAwesomeIcon icon={faTag as IconProp} size="sm" />
              <span className="ml-2">New Tag</span>
            </span>
          </Modal.Title>
        </Modal.Header>
        <p className="text-sm text-gray-400 mb-3">
          Create a new tag by providing a name and a data type below
        </p>

        <Modal.Body className="p-0">
          <div className="mb-2">
            <NameInput
              name={name}
              setName={setName}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
            />
          </div>

          <div className="mb-4">
            <span className="ushur-label form-label">Data type</span>
            <Select
              value={type}
              onChange={(newValue) => setType(newValue as TagTypeOption)}
              styles={selectStyles}
              options={tagTypeOptions}
            />
          </div>
        </Modal.Body>

        <Modal.Footer className={styles.modalFooter}>
          <div className="flex flex-nowrap justify-between w-100">
            <Button label="Cancel" type="cancel" onClick={hideCreateTagModal} />

            <Button
              disabled={!name || !type || formErrors.name}
              label="New Tag"
              type="primary"
              onClick={saveTag}
            />
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default CreateTagModal;
