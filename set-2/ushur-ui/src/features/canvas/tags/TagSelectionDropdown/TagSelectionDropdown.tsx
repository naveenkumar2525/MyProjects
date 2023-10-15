import { useCallback, useContext, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTag, faDatabase } from "@fortawesome/pro-thin-svg-icons";
import { Button } from "@ushurengg/uicomponents";
import TagsContext from "../Context";
import TagsList from "./TagsList";
import DatatableTagsList from "./DatatableTagsList";
import GlobalTagsList from "./GlobalTagsList";
import styles from "./TagSelectionDropdown.module.css";

type TagSelectionDropdownProps = {
  className?: string;
};

const TagSelectionDropdown = (props: TagSelectionDropdownProps) => {
  const { className } = props;
  const {
    tagSelectionDropdownState,
    setTagSelectionDropdownState,
    setCreateTagModalState,
  } = useContext(TagsContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const classNames = [
    "tag-selection-dropdown",
    "bg-gray-200",
    "border",
    "border-solid",
    "border-slate-100",
    "rounded",
    "w-100",
    styles.tagSelectionDropdown,
  ];

  if (className) {
    classNames.push(className);
  }

  const handleClickOutside = useCallback((event: Event) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as HTMLElement)
    ) {
      setTagSelectionDropdownState((prevState) => ({
        ...prevState,
        show: false,
      }));
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (!tagSelectionDropdownState.show) {
    return null;
  }

  return (
    <div ref={containerRef} className={classNames.join(" ")}>
      <div className="flex p-3 bg-white">
        <div className="w-1/2">
          <DatatableTagsList />
          <TagsList />
        </div>
        <div className="w-1/2">
          <GlobalTagsList />
        </div>
      </div>

      <div className="bg-transparent mt-1">
        <div className="p-3 flex flex-nowrap justify-between w-100">
          <Button
            label="Cancel"
            type="cancel"
            onClick={() => {
              setTagSelectionDropdownState((prevState) => ({
                ...prevState,
                show: false,
              }));
            }}
          />
          <div className="flex flex-nowrap">
            <Button
              onClick={() => {
                setTagSelectionDropdownState((prevState) => ({
                  ...prevState,
                  show: false,
                }));
                setCreateTagModalState((prevState) => ({
                  ...prevState,
                  show: true,
                }));
              }}
              label="New tag"
              type="secondary"
              startIcon={<FontAwesomeIcon icon={faTag as IconProp} size="lg" />}
            />
            <Button
              label="New datatable property"
              type="secondary"
              className="ml-2"
              startIcon={
                <FontAwesomeIcon icon={faDatabase as IconProp} size="lg" />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagSelectionDropdown;
