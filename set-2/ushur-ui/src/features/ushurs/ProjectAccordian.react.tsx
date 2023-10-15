import React, { useState, useRef } from 'react';
import Accordion from "react-bootstrap/Accordion";
// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./ProjectAccordian.css";
import InfoCard from "./InfoCard.react";
import {
  FolderClosedIcon,
  FolderOpenIcon,
  WorkflowIcon,
  DataTableIcon,
  ProfileIcon,
  PencilIcon,
  RecordsIcon,
  NoTriggersIcon,
  FolderOpenFillIcon,
  FAQIcon
} from "./SvgIcons.react";
import { truncateText } from "../../utils/helpers.utils";
import moment from "moment";
import {
  faClock,
  faTable,
  faCubes,
  faListUl
} from "@fortawesome/pro-regular-svg-icons";
import ProjectMenu from './ProjectMenu.react';
import WorkflowCard from './WorkflowCard.react';


type ProjectProps = {
  title: string;
  id: any;
  dataTableCount?: number;
  workflowCount?: number;
  publishedCount?: number;
  workflows?: [];
  eventKeys?: any;
  FAQs: [];
  cardIndex: any
};

const mainUrl = window.location.href.split("/").slice(0, 4).join("/");

const ProjectAccordian = (props: ProjectProps) => {
  const {
    title,
    dataTableCount,
    workflowCount,
    publishedCount,
    workflows,
    eventKeys,
    FAQs,
    cardIndex
  } = props;

  const [hover, setHover] = useState(false);

  const onMouseOvers = (e: any) => {
    e.preventDefault();
    setHover(true);

  }
  const onMouseLeave = () => {
    setHover(false);
  }

  const scrollRef = useRef<null | HTMLDivElement>(null);
  const executeScroll = () =>
    scrollRef?.current?.scrollIntoView({ behavior: "smooth", inline: "nearest" });

  return (
    <div className='d-flex'>
      <Accordion.Item role="list" eventKey={eventKeys} className="flex-1">
        <Accordion.Header className="custom-accordian-header" id={"acc-" + eventKeys} ref={scrollRef} onClick={() => window.setTimeout(() => executeScroll(), 500)}>
          <div className="row">
            <div className="column project-accordion-lefticon d-flex align-items-center">
              <FolderClosedIcon
                className="folder-closed"
                width="20"
                height="20"
              />
              <FolderOpenIcon className="folder-open" width="20" height="20" />
              <FolderOpenFillIcon
                className="folder-open-fill"
                width="20"
                height="20"
              />
              <span className="accordianTitle">{truncateText(title, 40)}</span>
            </div>
            <div className="column middle">
              <div className="workflow-icon">
                <WorkflowIcon width="20" height="20" />
                <span className="workflow-count">{workflowCount}</span>
                <span className="custom-tooltip accordian-head-tooltips">Workflows in Project</span>
              </div>
              <div className="check-circle-icon">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="check-mark"
                  color="#6FCF97"
                />
                <span className="published-count">{publishedCount}</span>
                <span className="custom-tooltip accordian-head-tooltips">Workflows published</span>
              </div>
              <div className="data-table-icon">
                <DataTableIcon width="20" height="20" />
                <span className="datatable-count">{dataTableCount}</span>
                <span className="custom-tooltip accordian-head-tooltips">Datatables in project</span>
              </div>
              {
                FAQs.length > 0 && (
                  <div className="faq-icon">
                    <FAQIcon width="24" height="24" />
                    <span className="faq-count">{FAQs.length}</span>
                    <span className="custom-tooltip accordian-head-tooltips"> FAQs in Project</span>
                  </div>
                )
              }
            </div>
            <div className="column project-accordion-righttext">
              <span className="expandview" style={{ visibility: hover ? "hidden" : "visible", paddingRight: '16px' }}>
                Expand
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="check-mark"
                  color="#2F80ED;"
                  style={{ paddingTop: '6px' }}
                />
              </span>
              <span className="collapseview" style={{ visibility: hover ? "hidden" : "visible", paddingRight: '16px' }}>
                Collapse
                <FontAwesomeIcon
                  icon={faChevronUp}
                  className="check-mark"
                  color="#2F80ED;"
                  style={{ paddingTop: '6px' }}
                />
              </span>
              <div className='h-8'></div>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body className="custom-accordian-body">
          <div className="row cards-wrapper pl-3">
            <div role="listitem" className="card-item">
              <InfoCard
                cardType="data-table-card"
                cardIndex={""}
                selevariable = {""}
                header={{
                  title: `${title}_Datatable`,
                  icon: <DataTableIcon width="28" height="25" />,
                }}
                data={[
                  {
                    icon: (
                      <FontAwesomeIcon icon={faTable} width="15" height="15" />
                    ),
                    value: "22 columns",
                    disablePill: true,
                    tooltipText: "Total columns"
                  },
                  {
                    icon: <RecordsIcon width="12" height="12" />,
                    value: "945 records",
                    disablePill: true,
                    tooltipText: "Total records"
                  },
                  {
                    icon: (
                      <FontAwesomeIcon icon={faCubes} width="15" height="15" />
                    ),
                    value: `${workflows?.length} workflows`,
                    disablePill: false,
                    tooltipText: "Associated workflows"
                  },
                  {
                    icon: <NoTriggersIcon width="15" height="15" />,
                    value: "no triggers",
                    disablePill: true,
                    tooltipText: "Trigger status"
                  },
                ]}
                route={`${mainUrl}/ushur-ui?route=datatables&project=${title}`}
              />
            </div>
            {/* workflow cards */}

            {workflows?.map((workflow: any, index: any) =>
              <div role="listitem" className="card-item" key={`${workflow.campaignId}_${workflow.AppContext}`}>
                <WorkflowCard selevariable = {title} workflow={workflow} recentlyEditedCard={false} cardIndex={JSON.stringify(cardIndex) + JSON.stringify(index)} />
              </div>
            )}
            {/* FAQ cards */}
            {FAQs?.map((faq: any) => (
              <div role="listitem" className="card-item" key={`${faq.campaignId}_${faq.AppContext}`}>
                <InfoCard
                selevariable = {''}
                  cardType="faq-card"
                  cardIndex={""}
                  header={{
                    title: `${faq.campaignId}_FAQ`,
                    icon: <FAQIcon width="28" height="25" />,
                  }}
                  data={[
                    {
                      icon: (
                        <FontAwesomeIcon icon={faListUl} width="15" height="15" />
                      ),
                      value: "12",
                      disablePill: true,
                      tooltipText: "Items in FAQ"
                    },
                    {
                      icon: <ProfileIcon width="15" height="15" />,
                      value: faq.author ?? "",
                      disablePill: false,
                      tooltipText: "Created by"
                    },
                    {
                      icon: <PencilIcon width="15" height="15" />,
                      value: faq.lastEdited && !faq.lastEdited.includes('UTC')
                        ? moment(faq.lastEdited).fromNow()
                        : "--",
                      disablePill: false,
                      tooltipText: "Last Edited"
                    },
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
                  status={faq.status}
                  route={`${mainUrl}/mobGraph/#${faq.campaignId}`}
                  disableCircles={true}
                />
              </div>
            ))}
          </div>
        </Accordion.Body>
      </Accordion.Item>
      <ProjectMenu eventKey={eventKeys} onMouseOver={(e: any) => { onMouseOvers(e) }} onMouseLeave={() => { onMouseLeave() }} />
    </div>
  );
};

export default ProjectAccordian;
