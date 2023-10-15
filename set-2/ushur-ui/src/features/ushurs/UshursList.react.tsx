import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useModal } from "../../custom-hooks/useModal";
// @ts-ignore
import { Title, Button, DataCard } from "@ushurengg/uicomponents";
import {
  getUshursAsync,
  workflowsGroupedByCampaign,
  updateProjectsSortState,
  ushursList,
  createNewCampaign,
  createNewUshur,
  createNewWorkflow,
} from "./ushursSlice";
import { Accordion } from "react-bootstrap";
import { useTrackPageLoad } from "../../utils/tracking";
import ProjectAccordian from "./ProjectAccordian.react";
import CreateWorkflowModal from "../../features/ushurs/CreateWorkflowModal.react";
import CreateProjectModal from "./CreateProjectModal.react";
import SortProjectsSelect from "./SortProjectsSelect.react";
import WorkflowCard from "./WorkflowCard.react";
import { isFreeTrial } from "../free-trial/freeTrialSlice";
import FreeTrialCreateWorkflowModal from "../free-trial/FreeTrialCreateWorkflowModal.react";

const Stats = ({ projects }: any) => {
  const { total, active } = projects.reduce(
    (acc: any, curr: any) => {
      return {
        total: acc.total + curr.workflows.length,
        active:
          acc.active +
          curr.workflows.filter((x: any) => x.status === true).length,
      };
    },
    { total: 0, active: 0 }
  );
  return (
    <section role="section" className="mt-6 flex">
      <DataCard
        data={projects?.length ?? 0}
        label="Projects"
        onClick={() => {}}
      />
      <div className="mr-4"> </div>
      <DataCard data={total} label="Total workflows" onClick={() => {}} />
      <div className="mr-4"> </div>
      <DataCard data={active} label="Active workflows" onClick={() => {}} />
    </section>
  );
};

const RecentWorkflows = ({ workflows }: any) => {
  return (
    <section role="section" className="mt-3">
      <Title variant="h3" text="Recently Edited Workflows" />
      <div
        role="grid"
        className="row cards-wrapper mt-2"
        style={{ marginLeft: "0px" }}
      >
        {workflows.map((workflow: any, index: any) => (
          <div
            role="gridcell"
            className="card-item"
            key={`${workflow.campaignId}_${workflow.AppContext}`}
          >
            <WorkflowCard
              selevariable={workflow.AppContext}
              workflow={workflow}
              recentlyEditedCard={true}
              cardIndex={JSON.stringify(index)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const UshursList = () => {
  const dispatch = useAppDispatch();
  const isFreeTrialEnabled = useAppSelector(isFreeTrial);
  const workflowsGroupedByProjects = useAppSelector(workflowsGroupedByCampaign);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [isOpen, toggleIsOpen] = useModal();
  const [openAcceleratorModal, toggleAcceleratorModal] = useModal();
  const ushurs = useAppSelector(ushursList);
  const recentlyEditedWorkflows = ushurs
    .filter((ushur: any) => ushur.FAQ !== "true")
    .map((workflow: any) => ({
      ...workflow,
      timestamp: Date.parse(workflow.lastEdited),
    }))
    .sort((a: any, b: any) => (a.timestamp > b.timestamp ? -1 : 1))
    .slice(0, 3);

  useTrackPageLoad({ name: "Projects Page" });

  useEffect(() => {
    async function createMainContext() {
      const workflow = "Default-Main-01";
      const res: any = await dispatch(
        createNewWorkflow({
          appContext: "Main",
          workflowId: workflow,
          description:
            "Created as a default Ushur for the Application Context Main ",
        })
      );
      if (
        res.payload?.["respCode"] === 200 &&
        res.payload?.["status"] === "success"
      ) {
        await dispatch(createNewCampaign({ workflow }));
      }
    }
    if (workflowsGroupedByCampaign.length === 0) {
      createMainContext();
    }
    dispatch(getUshursAsync());
  }, []);

  return (
    <div className="p-3 m-0">
      <div className="container-fluid p-3">
        <div className="row m-0 mb-3">
          <div className="col-12 p-0">
            <Title
              text="Projects"
              subText="Manage and create new projects and workflows to automate customer engagements."
            />
            <Stats projects={workflowsGroupedByProjects} />
            <RecentWorkflows workflows={recentlyEditedWorkflows} />
          </div>
        </div>
        <div className="row m-0 mb-3">
          <div className="col-12 p-0">
            <Title variant="h3" text="All Projects" />
            <section role="section" className="flex justify-between pt-3">
              <div className="inline-flex gap-2">
                <Button
                  startIcon={<i className="bi bi-folder2" />}
                  label="Create Project"
                  onClick={() => setProjectModalOpen(true)}
                  type="secondary"
                />
                <Button
                  startIcon={<i className="bi bi-boxes"></i>}
                  label="Create Workflow"
                  onClick={() =>
                    isFreeTrialEnabled
                      ? toggleAcceleratorModal()
                      : toggleIsOpen()
                  }
                  type="secondary"
                />
              </div>
              <SortProjectsSelect
                onChange={(type: string) =>
                  dispatch(updateProjectsSortState(type))
                }
              />
            </section>

            <section role="section">
              <Accordion alwaysOpen={false}>
                {workflowsGroupedByProjects.map((item: any, index: any) => {
                  return (
                    <ProjectAccordian
                      key={item.AppContext}
                      cardIndex={index}
                      title={item.AppContext}
                      eventKeys={item?.AppContext}
                      id={item.AppContext}
                      dataTableCount={1}
                      workflowCount={item.workflows.length}
                      publishedCount={
                        item.workflows.filter((x: any) => {
                          return x.status === true;
                        }).length
                      }
                      workflows={item.workflows}
                      FAQs={item.faqs}
                    />
                  );
                })}
              </Accordion>
            </section>

            <CreateWorkflowModal
              handleModalClose={toggleIsOpen}
              showModal={isOpen}
              selectedPrjMenu={""}
            />
            <FreeTrialCreateWorkflowModal
              handleModalClose={toggleAcceleratorModal}
              showModal={openAcceleratorModal}
            />
            <CreateProjectModal
              showModal={projectModalOpen}
              handleModalClose={() => setProjectModalOpen(!projectModalOpen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UshursList;
