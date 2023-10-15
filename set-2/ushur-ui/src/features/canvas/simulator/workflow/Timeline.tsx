import { useEffect, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faQuestion } from "@fortawesome/pro-thin-svg-icons";
import keys from "lodash/keys";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  workflowDetails,
  initUshurResult,
  continueUshurResult,
  ueTagVariables,
} from "../../data/canvasSlice";
import { getVariablesByUeTagAsync } from "../../data/canvasAsyncRequests";
import WorkflowTimelineItem from "./TimelineItem";
import { AccumulatedData } from "../../../../api";
import ModuleIcons from "../../interfaces/module-icons";
import { TimelineItemType } from "./types";

type VariablesList = Record<
  string,
  {
    value: string;
    uetag: string;
  }
>;

const WorkflowTimeline = () => {
  const dispatch = useAppDispatch();
  const currentWorkflowDetails = useAppSelector(workflowDetails);
  const initWorkflowResult = useAppSelector(initUshurResult);
  const continueWorkflowResult = useAppSelector(continueUshurResult);
  const currentUeTagVariables = useAppSelector(ueTagVariables);
  const [timeline, setTimeline] = useState<TimelineItemType[]>([]);
  const [, setVariablesList] = useState<VariablesList>({});

  const addToTimeline = (data: AccumulatedData) => {
    const campaignId = currentWorkflowDetails?.id as string;

    if (timeline.length) {
      const { uetag } = timeline[timeline.length - 1];

      dispatch(
        getVariablesByUeTagAsync({
          campaignId,
          ueTag: uetag,
        })
      ).catch(() => {});
    }

    const { promptText, uetag, module } = data;

    let title;
    let Icon;

    switch (module) {
      case "multiplechoice": {
        title = "Menu";
        Icon = ModuleIcons["menu-module"];
        break;
      }

      case "freeresponse": {
        title = "Form";
        Icon = ModuleIcons["form-module"];
        break;
      }

      default: {
        title = "Unknown";
        Icon = faQuestion as IconProp;
      }
    }

    timeline.push({
      Icon,
      title,
      promptText: promptText as string,
      uetag: uetag as string,
      variables: [],
    });

    setTimeline(timeline.slice());
  };

  const updateTimelineVariable = (
    uetag: string,
    name: string,
    value: unknown
  ) => {
    setTimeline((prevTimeline) => {
      for (let index = prevTimeline.length - 1; index >= 0; index -= 1) {
        if (prevTimeline[index].uetag !== uetag) {
          continue;
        }

        const match = prevTimeline[index].variables.find(
          (variable) => variable.name === name
        );

        if (!match) {
          prevTimeline[index].variables.push({
            name,
            value,
          });

          return prevTimeline.slice();
        }
      }

      return prevTimeline;
    });
  };

  useEffect(() => {
    if (initWorkflowResult && initWorkflowResult.accumulatedData) {
      addToTimeline(initWorkflowResult.accumulatedData[0]);
    }
  }, [initWorkflowResult]);

  useEffect(() => {
    if (continueWorkflowResult && continueWorkflowResult.accumulatedData) {
      addToTimeline(continueWorkflowResult.accumulatedData[0]);
    }
  }, [continueWorkflowResult]);

  useEffect(() => {
    currentUeTagVariables?.result?.map((resultItem) => {
      const { ueTag: uetag, variables } = resultItem;
      const names = keys(variables);

      setVariablesList((list) => {
        const updatedList = { ...list };

        names.map((name) => {
          const value = variables ? (variables[name] as string) : "";

          if (!updatedList[name]) {
            updatedList[name] = {
              value,
              uetag: uetag as string,
            };

            updateTimelineVariable(uetag as string, name, value);
          }

          return name;
        });

        return updatedList;
      });

      return resultItem;
    });
  }, [currentUeTagVariables]);

  return (
    <ul className="m-0 p-4">
      {timeline.map((timelineItem) => (
        <WorkflowTimelineItem
          key={timelineItem.uetag}
          Icon={timelineItem.Icon}
          uetag={timelineItem.uetag}
          title={timelineItem.title}
          variables={timelineItem.variables}
          promptText={timelineItem.promptText}
        />
      ))}
    </ul>
  );
};

export default WorkflowTimeline;
