import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTag } from "@fortawesome/pro-thin-svg-icons";
import { faTag as faTagSolid } from "@fortawesome/pro-solid-svg-icons";
import { useAppSelector } from "../../../../app/hooks";
import { tagsResponse } from "../../data/canvasSlice";
import TagsContext from "../Context";

const TagsList = () => {
  const { tagSelectionDropdownState } = useContext(TagsContext);
  const tags = useAppSelector(tagsResponse);
  const [tagsList, setTagsList] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    const list: Record<string, string>[] = [];

    tags?.content?.map((item) => {
      item.vars?.map((variable) => {
        list.push(variable);
        return variable;
      });

      return item;
    });

    setTagsList(list);
  }, [tags]);

  return (
    <>
      <div className="flex flex-nowrap items-center mb-2">
        <FontAwesomeIcon icon={faTagSolid as IconProp} size="sm" />
        <span className="ml-1 text-sm font-bold">Tags</span>
      </div>
      <ul className="m-0 p-0">
        {tagsList.map((listItem) => (
          <li key={listItem.variable} className="mb-2 ml-4">
            <button
              aria-label={listItem.desc}
              name={listItem.desc}
              style={{ fontSize: "inherit" }}
              className="
                bg-transparent border-transparent text-black
                flex flex-nowrap leading-5"
              onClick={(event) => {
                event.preventDefault();
                tagSelectionDropdownState.onSelect(listItem);
              }}
              type="button"
            >
              <span className="mt-1">
                <FontAwesomeIcon icon={faTag as IconProp} />
              </span>
              <span className="flex flex-wrap ml-2 pr-2">
                <span className="mr-2">
                  {listItem.desc || listItem.variable}
                </span>
                <span className="text-gray-400">{listItem.type}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TagsList;
