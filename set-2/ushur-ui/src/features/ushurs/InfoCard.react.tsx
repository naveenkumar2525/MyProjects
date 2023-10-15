import React from "react";
// @ts-ignore
import {
  Card,
  Button,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "./InfoCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup } from "react-bootstrap";
import WorkflowMenu from "./WorkflowMenu.react";
import { truncateText } from '../../utils/helpers.utils';
import { useHistory } from "react-router-dom";

type DataItem = {
  icon: React.ReactNode;
  disablePill: boolean;
  value: string;
  tooltipText: string;
  selevariable?: any;
};

export type CardProps = {
  cardType: string;
  data: [DataItem, DataItem, DataItem, DataItem];
  header: {
    title: string;
    icon: React.ReactNode;
  };
  status?: boolean;
  route: string;
  disableCircles?: boolean;
  cardIndex : any;
  selevariable: any;
};

const maxCharacters = 13;

const InfoCard = (props: CardProps) => {
  const {
    cardType,
    data,
    header: { title, icon },
    status,
    route,
    disableCircles,
    cardIndex,
    selevariable
  } = props;

  const history = useHistory();

  const openWorkflowWindow = (route: string, title: string | undefined = undefined) => {
    history.replace({ search: route });
  }

  const handleTooltip = (e: any) => {
    if (e.target.scrollWidth > e.target.offsetWidth && e.target?.firstChild?.style) {
      e.target.firstChild.style.display = 'block';
    }
  }

  return (
    <Card
      cardClass={`${cardType} ${status ? "active" : ""} info-card ${`card-index-`+cardIndex}`}
      customCardBody={
        <>
          <div className="d-flex align-items-center" id={title}>
            <span className="card-icon">{icon}</span>
            <div className="mx-2 font-weight-bold flex-1 cardtitle" onMouseOver={(e) => handleTooltip(e)} role="card-title">
              <span className="custom-tooltip card-title-tooltip" style={{ display: 'none' }} role="card-title-tooltip">{title}</span>
              {title}
            </div>
            <div className='infoCardTile'>
              {cardType === "workflow-card" ?
                <ButtonGroup size="lg" className= "Group-button" id = {`button-index-`+cardIndex} >
                  <Button
                    onClick={() => {
                      openWorkflowWindow(route, title);
                    }}
                    style={{ marginRight: 2 }}>Open</Button>
                  <WorkflowMenu 
                    selevariable = {selevariable} 
                    workflow={title} 
                    buttonIndex = {cardIndex} 
                    cardActiveIndex={`card-index-`+cardIndex} 
                    status={status}
                  />
                </ButtonGroup>
                :
                <Button
                  className="Group-button"
                  variant="primary"
                  onClick={() => {
                    openWorkflowWindow(route);
                  }}
                >
                  Open
              </Button>
              }
            </div>
          </div>
          <section role="section" className="mt-2 additional-info">
            {data.map((item: any, index: any) => {
              return (
                !item.disablePill ? (
                  <span className="pill" key={index}>
                    <span>
                      {item.icon}
                    </span>
                    <span className="custom-tooltip pill-tooltip">{item.value?.length > maxCharacters ? item.tooltipText + ' ' + item.value : item.tooltipText}</span>
                    <span className="ml-1">{truncateText(item.value ?? "", maxCharacters)}</span>
                  </span>
                ) : null);
            })}
          </section>
          <hr style={{ backgroundColor: "#CCCCCC" }} />
          <div className="status-info d-flex justify-content-between align-items-center">
            {cardType === "workflow-card" || cardType === "faq-card" ? (
              <>
                {
                  !disableCircles ? (<section role="section" className="number-circles d-flex">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <span className="circle" key={i}>{i}</span>
                    ))}
                  </section>
                  ) : <span></span>
                }
                <div className={`status-text ${status ? "active" : ""}`}>
                  {status ? (
                    <>
                      <FontAwesomeIcon
                        title="status-circle"
                        icon={faCheckCircle}
                        width="15"
                        height="15"
                      />
                      <span className="ml-1">Published</span>
                    </>
                  ) : (
                    "Unpublished"
                  )}
                </div>
              </>
            ) : (
              <div className="status-text">
                Use this Datatable to store, manage, and export data.
              </div>
            )}
          </div>
        </>
      }
    />
  );
};

export default InfoCard;
