import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, notifyToast } from "@ushurengg/uicomponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import styles from "./ProjectBrandingModal.module.css";
import { Col } from 'react-bootstrap';
import ColorPicker from './ColorPicker.react';
import BrandLogo from './BrandLogo.react';
import "../../canvas/CanvasPage.css";
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { basePath, getDynamicName } from '../../../utils/helpers.utils';
import { createNewCampaign, createNewUshur, setUshurs, workflowsGroupedByCampaign, list } from '../../ushurs/ushursSlice';
import moment from 'moment';
import { getUserEmailId } from '../../../utils/api.utils';
import { getNewCanvasUrl } from '../../../utils/url.utils';

type Props = {
  showModal: boolean;
  handleModalClose: () => void;
  selectedAccelerator: any
  handleAllModalsClose: () => void;
}

const ProjectBrandingModal = (props: Props) => {
  const { showModal, handleModalClose, selectedAccelerator, handleAllModalsClose } = props;
  const { name, description, projectName, primaryColor, logo } = selectedAccelerator;
  const [logoUrl, setLogoUrl] = useState<any>('');
  const [btnPrimaryColor, setBtnPrimaryColor] = useState(primaryColor);
  const dispatch = useAppDispatch();
  const workflowsGroupedByProjects = useAppSelector(workflowsGroupedByCampaign);
  const campaignList = useAppSelector(list);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    setBtnPrimaryColor(primaryColor);
    setLogoUrl('');
  }, [name]);

  const readFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      }
      reader.readAsDataURL(file)
    }
  };

  const handleCreateProject = async () => {
    let appContext = projectName?.trim();
    let workflow = name?.trim();

    if (!appContext) {
      setErrorMessage('Project name is missing.');
      return false;
    }
    if (!workflow) {
      setErrorMessage('Workflow name is missing.');
      return false;
    }
    if (/[-]/.test(appContext)) {
      setErrorMessage('"-" is not allowed in project name');
      return false;
    }

    if (!/[_a-zA-Z0-9]+$/y.test(appContext)) {
      setErrorMessage("Project name cannot contain special characters other than '_'");
      return false;
    }
    if (!/^\s*[a-zA-Z0-9-_]*$/.test(workflow)) {
      setErrorMessage('The workflow name should not contain special characters or spaces.');
      return false;
    }
    // if project name already exists then add _nextnumber at the end
    if (workflowsGroupedByProjects.find((obj: any) => obj.AppContext === appContext)) {
      const projectsArr = workflowsGroupedByProjects.map((obj: any) => obj.AppContext);
      const newProjectName = getDynamicName(projectsArr, appContext);
      appContext = newProjectName;
    }
    // if workflow name already exists then add _nextnumber at the end
    const allWorkflows = workflowsGroupedByProjects.map((item: any) => item?.workflows || null).flat();
    if (allWorkflows.find((obj: any) => obj.campaignId === workflow)) {
      const workflowsArr = allWorkflows.map((obj: any) => obj.campaignId);
      const newWorkflowName = getDynamicName(workflowsArr, workflow);
      workflow = newWorkflowName
    }

    const res = await dispatch(
      createNewUshur({ appContext, workflow, description })
    );

    if (res.payload?.["respCode"] === 200 && res.payload?.["status"] === "success") {
      // Create association on campaign
      const response: any = await dispatch(createNewCampaign({ workflow }));
      // Refresh project list with newly added project
      if (!response?.error) {
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
        // Redirect to canvas 2.0
        // window.open(getNewCanvasUrl(name), "_blank");
      } else {
        notifyToast({ variant: "error", text: 'Error', subText: 'Something went wrong', animation: true });
      }
    } else {
      notifyToast({ variant: "error", text: 'Error', subText: 'Something went wrong', animation: true });
    }
    handleAllModalsClose();
  }

  return (
    <Modal
      className={styles.projectBrandingModal}
      onHide={handleAllModalsClose}
      size="lg"
      title="Create Project"
      subTitle="Projects are collections of workflows, datatables, and brand settings."
      closeLabel="Cancel"
      showModal={showModal}
      actions={[
        {
          text: (
            <div className='d-flex items-center gap-1'>
              <FontAwesomeIcon
                icon={faChevronLeft as IconProp}
                color=" #2F80ED"
                size={"lg"}
              />
              <span>Back</span>
            </div>
          ),
          onClick: handleModalClose,
          type: "secondary",
        },
        {
          text: (
            <div className='d-flex items-center gap-1'>
              <span>Create</span>
            </div>
          ),
          type: "primary",
          onClick: handleCreateProject
        }
      ]}
      backdrop
    >
      <div className={`${styles.description} rounded-lg p-3`}>This workflow uses the Ushur Invisible App to deliver a rich browser-based app-like experience. Use the defaults provided below or provide your own branding to continue.</div>
      <div className="row mt-4">
        <Col sm={6}>
          <h4 className='font-light' data-testid="form-heading">Experience</h4>
          <ColorPicker
            color={btnPrimaryColor}
            onChangeColor={(color: string) => setBtnPrimaryColor(color)}
            title="Primary color"
          />
          <BrandLogo title="Brand Logo" logoUrl={logoUrl || `${basePath}/ushur-ui/assets/${logo}`} handleFileChange={readFile} />
          <Input
            label="Default channel"
            name="channel"
            disabled
            value="SMS"
            type="text"
            className={styles.defaultChannel}
          />
        </Col>
        <Col sm={6}>
          <div className='mx-4'>
            <h4 className='font-light'>Preview</h4>
            <div className="mobile_simulator_outer box-border bg-very-dark-gray flex items-center justify-center">
              <div className="mobile_simulator_inner p-2 w-94 h-97 flex justify-center align-center flex-col" style={{ background: "linear-gradient(90deg, rgba(241,250,251,1) 52%, rgba(236,245,245,1) 81%)" }}>
                <div className={`${styles.workflowLaunchPreview} p-3 rounded-lg text-center mb-3`}>
                  <img src={logoUrl || `${basePath}/ushur-ui/assets/${logo}`} className="mx-auto w-50 mb-3" />
                  <h4 className='mb-2 pt-3 font-bold text-base text-light-black'>{name}</h4>
                  <div className='text-slate-gray'>{description}</div>
                </div>
                <Button
                  label="Get started"
                  style={{ background: btnPrimaryColor, border: `1px solid ${btnPrimaryColor}` }} className={`w-full d-flex justify-center ${styles.getStartedBtn}`}
                />
              </div>
            </div>
          </div>
        </Col>
      </div>
      <div className='error-msg'>{errorMessage}</div>
    </Modal>
  );
}

export default ProjectBrandingModal;
