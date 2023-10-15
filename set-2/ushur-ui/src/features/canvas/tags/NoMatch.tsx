import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTag, faDatabase } from "@fortawesome/pro-thin-svg-icons";
import { Button } from "@ushurengg/uicomponents";
import TagsContext from "./Context";

const NoMatch = () => {
  const { showNoMatch, setShowNoMatch, setCreateTagModalState } =
    useContext(TagsContext);

  const showCreateTagModal = () => {
    setCreateTagModalState((prevState) => ({
      ...prevState,
      show: true,
    }));
  };

  if (!showNoMatch) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-50 border-solid rounded p-2 mt-2">
      <p className="text-sm text-gray-400">
        No matches found. Save data to a new tag or datatable property.
      </p>

      <div className="flex flex-nowrap justify-between w-100">
        <Button
          label="Cancel"
          type="cancel"
          onClick={() => {
            setShowNoMatch(false);
          }}
        />

        <div className="flex flex-nowrap">
          <Button
            onClick={showCreateTagModal}
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
  );
};

export default NoMatch;
