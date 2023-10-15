import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TimelineItemType } from "./types";
import styles from "./Variable.module.css";

const WorkflowTimelineItem = (props: TimelineItemType) => {
  const { Icon, title, promptText, variables } = props;
  const variableClasses = [
    "flex",
    "flex-row",
    "items-center",
    "p-2",
    "rounded-md",
    "whitespace-nowrap",
    "text-black",
  ];

  variableClasses.push(styles.variable);

  return (
    <li className="position-relative mb-2">
      <div className="flex flex-row align-items-center">
        <div className="w-4 text-center">
          <FontAwesomeIcon icon={Icon} size="1x" />
        </div>
        <h6 className="mb-0 ml-2">{title}</h6>
      </div>

      <div className="pl-2">
        <div className="pl-4 pt-2 pb-3 border-l-2 border-solid border-black">
          <p className="text-sm text-gray-400">{promptText}</p>

          {variables.map((variable) => (
            <div className={variableClasses.join(" ")}>
              <span>{variable.name}:&nbsp;</span>
              <em>{(variable.value as string) || ""}</em>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
};

export default WorkflowTimelineItem;
