/* istanbul ignore file */
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Accordion, Modal } from "@ushurengg/uicomponents";
import { isEmpty } from "lodash";
import { useAppSelector } from "../../../app/hooks";
import { workflowDetails } from "../data/canvasSlice";
import {
  LegacySubRootMessage,
  MessageModule,
  Workflow,
  WorkflowStep,
} from "../../../api";
import {
  commonHeaders,
  getHostName,
  getTokenId,
} from "../../../utils/api.utils";
import useGetWorkflowId from "../custom-hooks/useGetWorkflowId";

const getWelcomeStepPaths = (workflow: Workflow): object[] => {
  const welcomeStep = workflow.ui.cells[0] as WorkflowStep;

  const welcomeStepPaths: object[] = [];

  const welcomeStepModules = welcomeStep.modules;

  const firstWelcomeModule = welcomeStepModules[0] as MessageModule;
  welcomeStepPaths.push({
    text: firstWelcomeModule.text,
    link: workflow.routines.Ushur_Initial_Routine.params.menuId,
  });

  return welcomeStepPaths;
};

// Generate all potential graph paths.
// Support only for message modules at the moment
const getWorkflowPaths = (
  workflow: Workflow | null,
  workflowSubRoots: LegacySubRootMessage[]
) => {
  if (!workflow) {
    return [];
  }
  const paths: object[] = [];

  const workflowPath = [];
  const welcomeStepPaths = getWelcomeStepPaths(workflow);
  workflowPath.push(...welcomeStepPaths);

  if (!workflowSubRoots?.length) {
    paths.push(workflowPath);
    return paths;
  }
  let target = workflow.routines.Ushur_Initial_Routine.params.menuId;

  /* Protection against an infinite loop in case links are end up in an infinite loop */
  const MAX_ITERATIONS = 1000;
  let iterations = 0;

  const findSubRootById = (id: string) =>
    workflowSubRoots.find((item) => id === item.id);

  while (iterations < MAX_ITERATIONS) {
    const found = findSubRootById(target);
    if (!found) {
      break;
    } else {
      const next = found.routines?.goToNextSection?.params?.menuId;
      const { text } = found.routines?.Ushur_Initial_Routine?.params ?? {
        text: "",
      };
      target = next;
      workflowPath.push({ text, link: next });
    }
    iterations += 1;
  }

  paths.push(workflowPath);

  return paths;
};

interface WorkflowDebugProps {
  show: boolean;
  onCancel: () => void;
}

const WorkflowDebug = (props: WorkflowDebugProps) => {
  const currentWorkflowDetails = useAppSelector<Workflow | null>(
    workflowDetails
  );
  const workflowId = useGetWorkflowId();
  const [workflowSubRoots, setWorkflowSubRoots] = useState(
    [] as LegacySubRootMessage[]
  );

  useEffect(() => {
    if (
      !currentWorkflowDetails ||
      currentWorkflowDetails.ui?.sections.length <= 1
    ) {
      return;
    }

    const subSections = [];
    for (let i = 1; i < currentWorkflowDetails.ui.sections.length; i += 1) {
      const section = currentWorkflowDetails.ui.sections[i];
      const subJSONId = `${workflowId}_child_${section.uid}`;
      subSections.push({
        apiVer: "2.1",
        campaignId: subJSONId,
        cmd: "getCampaign",
        tokenId: getTokenId() as string,
      });
    }

    if (!subSections.length) {
      return;
    }
    fetch(`${getHostName() as string}/infoQuery`, {
      headers: {
        ...commonHeaders,
        "content-type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(subSections),
      method: "POST",
      mode: "cors",
      credentials: "omit",
    })
      .then(async (final) => {
        const res = (await final.json()) as LegacySubRootMessage[];
        if (isEmpty(res)) {
          setWorkflowSubRoots([]);
        } else {
          setWorkflowSubRoots(res);
        }
        return res;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }, [currentWorkflowDetails]);

  const { show, onCancel } = props;

  const handleCancel = () => {
    onCancel();
  };

  let debugWorkflowPaths: object[] = [];
  try {
    debugWorkflowPaths = getWorkflowPaths(
      currentWorkflowDetails,
      workflowSubRoots
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return (
    <Modal
      onHide={handleCancel}
      size="lg"
      title="Workflow Debug"
      showModal={show}
    >
      <Form>
        <Form.Group className="mb-3">
          {currentWorkflowDetails && (
            <>
              <Accordion
                items={[
                  {
                    body: (
                      <>
                        <pre>
                          {JSON.stringify(currentWorkflowDetails, null, 4)}
                        </pre>
                      </>
                    ),
                    openLabel: "Workflow JSON",
                  },
                  ...workflowSubRoots.map((subRoot) => ({
                    body: (
                      <>
                        <pre>{JSON.stringify(subRoot, null, 4)}</pre>
                      </>
                    ),
                    openLabel: `Sub-Root JSON for ID: ${subRoot.id}`,
                  })),
                  {
                    body: (
                      <>
                        <pre>{JSON.stringify(debugWorkflowPaths, null, 4)}</pre>
                      </>
                    ),
                    openLabel: "Workflow Paths",
                  },
                ]}
              />
            </>
          )}
        </Form.Group>
      </Form>
    </Modal>
  );
};

export default WorkflowDebug;
