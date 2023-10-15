import React, { useState, useEffect } from "react";
// @ts-ignore
import { Modal, Dropdown, Input, Checkbox, notifyToast } from "@ushurengg/uicomponents";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  createNewUshur,
  createNewCampaign,
  getUshursAsync,
  createNewWorkflow,
} from "./ushursSlice";
import "./CreateWorkflowModal.css";
import { uniqueSortedProjects } from "../../utils/helpers.utils";
import { workflowsGroupedByCampaign } from "./ushursSlice";
import { getMobGraphUrl } from "../../utils/url.utils";
import { useModal } from "../../custom-hooks/useModal";
import CreateProjectModal from "./CreateProjectModal.react";

type Props = {
  handleModalClose: () => void;
  showModal: boolean;
  selectedPrjMenu: any;
};

const CreateWorkflowModal = (props: Props) => {
  
  const { handleModalClose, showModal, selectedPrjMenu } = props;
  const dispatch = useAppDispatch();
  const dataFormat = /^\s*[a-zA-Z0-9-_]*$/;
  const [projects, setProjects] = useState<any>([]);
  const [projectsRefresh, setProjectsRefresh] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<any>(
    selectedPrjMenu || ""
  );
  const [workflow, setWorkflow] = useState<any>("");
  const [workflowCheckbox, setWorkflowCheckbox] = useState<boolean>(false);
  const [duplicateErr, setDuplicateErr] = useState<boolean>(false);
  const [specialCharacterErr, setSpecialCharacterErr] =
    useState<boolean>(false);
  const campaignList = useAppSelector((state) => state.ushurs.list);
  const [isProjectOpen, toggleProjectOpen] = useModal();
  const workflowsGroupedByProjects = useAppSelector(workflowsGroupedByCampaign);
  const createWorkflow = async () => {
    const res: any = await dispatch(
        createNewWorkflow({
          appContext: selectedProject as string,
          workflowId: workflow as string,
        })
    );

    if (res.payload["respCode"] === 200) {
      const campaignRes = await dispatch(createNewCampaign({ workflow }));
      dispatch(getUshursAsync());

      if (workflowCheckbox) {
        window.open(getMobGraphUrl(workflow), "_blank");
      }
      handleModalClose();
      notifyToast({ variant: "success", text: 'Success', CustomMessageComponent: <span>Workflow <span className='font-bold'>{workflow}</span> created successfully</span>, animation: true });
    
    } else alert("An Ushur With this Name already Exists");
  };

  useEffect(() => {
    setWorkflow("");
    setSelectedProject(selectedPrjMenu);
    setWorkflowCheckbox(false);
  }, [showModal]);

  useEffect(() => {
    if (campaignList.length > 0) {
      const sortedProjectsList = uniqueSortedProjects(campaignList);
      setProjects(sortedProjectsList);
    }
  }, [campaignList, projectsRefresh]);

  useEffect(() => {
    setDuplicateErr(false);
    workflowsGroupedByProjects.map((item: any) => {
      item?.workflows.map((itm: any) => {
        if (itm?.campaignId === workflow && itm?.AppContext === selectedProject)
          setDuplicateErr(true);
      });
    });
    dataFormat.test(workflow)
      ? setSpecialCharacterErr(false)
      : setSpecialCharacterErr(true);
  }, [workflow, selectedProject]);

  return (
    <>
      <Modal
        className="create-workflow-modal"
        onHide={handleModalClose}
        size="md"
        title="Create Workflow"
        subTitle="Create a workflow to implement a new automation."
        closeLabel="Cancel"
        showModal={showModal}
        actions={[
          {
            onClick: createWorkflow,
            text: "Create",
            type: "primary",
            disabled:
              (workflow != "" && selectedProject != "" && !duplicateErr) ||
              !specialCharacterErr
                ? ""
                : "true",
          },
        ].filter(({ text }) => text)}
        backdrop
      >
        <Dropdown
          label="Select Project"
          title={selectedProject || "Select Existing Project"}
          disabled={selectedPrjMenu}
          subTitle="Create a workflow to implement a new automation."
          noDataText="No projects available"
          options={projects.map((item: any) => ({
            text: item,
            value: item,
            category: "",
            onClick: () => {
              setSelectedProject(item);
            },
          }))}
          className="variable-type-dropdown mt-2"
        />
        <span className="helper-text form-text">
          Select a project for your workflow or{" "}
          <a
            href="javascript:void(0)"
            onClick={() => {
              handleModalClose();
              toggleProjectOpen();
            }}
          >
            Create New Project.
          </a>
        </span>
        <div className="workflow-Modal">
          <Input
            label="Workflow Name"
            value={workflow}
            handleInputChange={(ev: any) => {
              setWorkflow(ev.target.value);
            }}
            helperText={
              duplicateErr
                ? "This workflow name already exists under selected project."
                : specialCharacterErr
                ? "The workflow name should not contain special characters or space"
                : "This is a friendly name used to identify your workflow."
            }
            error={duplicateErr || specialCharacterErr ? "true" : ""}
          />
        </div>

        <Checkbox
          checked={workflowCheckbox}
          handleOnChange={() => {
            setWorkflowCheckbox(!workflowCheckbox);
          }}
          label="Open workflow after creating"
          className="mt-3"
        />
      </Modal>
      <CreateProjectModal
        showModal={isProjectOpen}
        handleModalClose={toggleProjectOpen}
      />
    </>
  );
};

export default CreateWorkflowModal;
