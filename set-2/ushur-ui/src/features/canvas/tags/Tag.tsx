import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTag } from "@fortawesome/pro-thin-svg-icons";
import styles from "./Tag.module.css";

type TagProps = {
  text: string;
};

const Tag = (props: TagProps) => {
  const { text } = props;
  const classes = [
    "inline-block",
    "align-middle",
    "px-2",
    "rounded",
    "leading-none",
    styles.tag,
  ];

  return (
    <>
      <>&nbsp;</>
      <span className={classes.join(" ")} contentEditable={false}>
        <span className="inline-flex flex-nowrap items-center">
          <FontAwesomeIcon icon={faTag as IconProp} size="lg" />
          <span className="ml-2">{text}</span>
        </span>
      </span>
      <>&nbsp;</>
    </>
  );
};

export default Tag;
