
import React from "react";
import {
  WorkflowIcon,
  ProfileIcon,
  PencilIcon,
  FolderClosedIcon,
} from "./SvgIcons.react";
import {
  faCube,
  faClock,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import InfoCard from './InfoCard.react';
import { getMobGraphUrl } from "../../utils/url.utils";

type WorkflowCardProps = {
  workflow: {
    campaignId: string;
    author: string;
    lastEdited: string;
    status: boolean;
    AppContext: string;
  };
  recentlyEditedCard: boolean;
  cardIndex :any;
  selevariable :any;
}

const WorkflowCard = (props: WorkflowCardProps) => {
  const { workflow, recentlyEditedCard,cardIndex,selevariable } = props;
  const canvasWorkflowRoute = getMobGraphUrl(workflow.campaignId);
  return (
    <InfoCard
      selevariable = {selevariable}
      cardType="workflow-card"
      cardIndex={cardIndex}
      header={{
        title: workflow.campaignId,
        icon: <WorkflowIcon width="28" height="25" />,
      }}
      data={[
        {
          icon: (
            <FontAwesomeIcon icon={faCube} width="15" height="15" />
          ),
          value: "12",
          disablePill: true,
          tooltipText: "Modules in workflow"
        },
        {
          icon: <ProfileIcon width="15" height="15" />,
          value: workflow.author ?? "",
          disablePill: false,
          tooltipText: "Created by"
        },
        {
          icon: <PencilIcon width="15" height="15" />,
          value: workflow.lastEdited && !workflow.lastEdited.includes('UTC')
            ? moment(workflow.lastEdited).fromNow()
            : "--",
          disablePill: false,
          tooltipText: "Last Edited"
        },
        recentlyEditedCard ? {
          icon: (
            <FolderClosedIcon
              width="15"
              height="15"
            />
          ),
          value: workflow.AppContext,
          disablePill: false,
          tooltipText: "Parent project"

        } :
          {
            icon: (
              <FontAwesomeIcon
                icon={faClock}
                width="15"
                height="15"
              />
            ),
            value: "Never activated",
            disablePill: true,
            tooltipText: "Last Published"
          },
      ]}
      status={workflow.status}
      route={canvasWorkflowRoute}
      disableCircles
    />
  );
}

export default WorkflowCard;