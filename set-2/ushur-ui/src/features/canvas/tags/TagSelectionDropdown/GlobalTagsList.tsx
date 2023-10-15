import { useEffect, useState } from "react";
import keys from "lodash/keys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faGlobe } from "@fortawesome/pro-thin-svg-icons";
import { faGlobe as faGlobeSolid } from "@fortawesome/pro-solid-svg-icons";
import { useAppSelector } from "../../../../app/hooks";
import { datatableTagsResponse } from "../../data/canvasSlice";

const GlobalTagsList = () => {
  const datatableTags = useAppSelector(datatableTagsResponse);
  const [datatableTagsList, setDatatableTagsList] = useState<
    Record<string, string>[]
  >([]);

  useEffect(() => {
    const list: Record<string, string>[] = [];

    datatableTags?.content?.map((item) => {
      keys(item)
        .filter((key) => key !== "_id")
        .map((key) => {
          list.push(item[key] as Record<string, string>);
          return key;
        });

      return item;
    });

    setDatatableTagsList(list);
  }, [datatableTags]);

  return (
    <>
      <div className="flex flex-nowrap items-center mb-2">
        <FontAwesomeIcon icon={faGlobeSolid as IconProp} size="sm" />
        <span className="ml-1 text-sm font-bold">Global Values</span>
      </div>

      <ul className="m-0 p-0">
        {datatableTagsList.map((listItem) => (
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
              }}
              type="button"
            >
              <span className="mt-1">
                <FontAwesomeIcon icon={faGlobe as IconProp} />
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

export default GlobalTagsList;
