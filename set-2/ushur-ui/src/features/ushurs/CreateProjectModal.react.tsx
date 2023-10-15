import React, { useState } from "react";
// @ts-ignore
import { Modal, Input, notifyToast } from "@ushurengg/uicomponents";
import { createNewUshur, createNewCampaign, workflowsGroupedByCampaign, setUshurs, createNewWorkflow } from './ushursSlice';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getUserEmailId,
} from "../../utils/api.utils";
import moment from 'moment';

type Props = {
  handleModalClose: () => void;
  showModal: boolean;
};


const CreateProjectModal = (props: Props) => {
  const { handleModalClose, showModal } = props;
  const [projectName, setProjectName] = useState('');
  const [errorMessage,setErrorMessage]= useState('');
  const [isValid, setIsValid] = useState(true);
  const dispatch = useAppDispatch();
  const workflowsGroupedByProjects = useAppSelector(workflowsGroupedByCampaign);
  const campaignList = useAppSelector((state) => state.ushurs.list);

  const checkProjectExists = (projectName: string) => {
    if (workflowsGroupedByProjects.find((obj: any) => obj.AppContext === projectName)) {
      return true;
    }
    return false;
  }


  const handleCreateProject = async () => {
  
    // Validating project name entered
    var appContext = projectName.trim();
    const regex = /[_a-zA-Z0-9]+$/y;
    appContext = appContext.replace(/'/g, "\\'");

    if (appContext === "") {
      return false;
    }
    if (checkProjectExists(appContext)) {
      setErrorMessage('The project Name you entered already exists.');
      setIsValid(false);
      return false;
    }
    if (/[-]/.test(appContext)) {
      setErrorMessage('"-" is not allowed in project names');
      setIsValid(false);
      return false;
    }
    if (!regex.test(appContext)) {
      setErrorMessage("This field cannot contain special characters other than '_'");
      setIsValid(false);
      return false;
    }

    const workflow = "Default-" + projectName + "-01";
    const res: any = await dispatch(
      createNewWorkflow({ appContext: projectName, workflowId: workflow, description: "Created as a default Ushur for the Application Context " + projectName })
    );
    if (res.payload?.["respCode"] === 200 && res.payload?.["status"] === "success") {
      // Create association on campaign
      await dispatch(createNewCampaign({ workflow }));
      // Refresh project list with newly added project
      await dispatch(setUshurs([...campaignList, {
        campaignId: workflow,
        templateId: null,
        lastEdited: moment().toISOString(),
        author: getUserEmailId(),
        AppContext: appContext,
        Languages: "{ }",
        description: "Created as a default Ushur for the Application Context " + appContext,
        IsInvisible: "yes"
      }]));
      notifyToast({ variant: "success", text: 'Success', CustomMessageComponent: <span>Project <span className='font-bold'>{appContext}</span> created successfully</span>, animation: true });
      handleModalClose();
      setProjectName("");
      const element = document.getElementById(`acc-${appContext}`);
      const accordianBtn = document.querySelector(`#acc-${appContext} button`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          if (accordianBtn instanceof HTMLElement) {
            accordianBtn.click();
          }
        }, 1000);
      }
    }
  };

  return (
    <Modal
      className="create-project-modal sweet-alert"
      onHide={handleModalClose}
      size="md"
      title="Create Project"
      subTitle="Projects are folders used to associate Datatables and Workflows, used to implement automation solutions."
      closeLabel="Cancel"
      showModal={showModal}
      actions={[
        {
          onClick: handleCreateProject,
          text: "Create",
          type: "primary",
          disabled:!projectName
        },
      ]}
      backdrop
    >
      <Input
        label="Project Name"
        value={projectName}
        handleInputChange={(ev: any) => {
          setProjectName(ev.target.value);
          !isValid && setIsValid(true);
        } 
        }
        placeholder="Enter name here"
        error={!isValid}
        helperText={
          !isValid
            ? errorMessage
            : ""
        }
        onKeyPress={(event: any) => {
          if (event.key === 'Enter') {
            handleCreateProject();
          }
        }}
      />
     
    </Modal>
  );
}

export default CreateProjectModal;
