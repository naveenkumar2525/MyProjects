import { PropsWithChildren, useCallback, useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import toLower from "lodash/toLower";
import forEach from "lodash/forEach";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getTagsAsync,
  getDatatableTagsAsync,
} from "../data/canvasAsyncRequests";
import { workflowDetails, tagsResponse } from "../data/canvasSlice";
import NoMatch from "./NoMatch";
import CreateTagModal from "./CreateTagModal";
import SaveToTagModal from "./SaveToTagModal";
import TagsContext, {
  CreateTagModalState,
  SaveToTagModalState,
  TagSelectionDropdownState,
} from "./Context";
import Tag from "./Tag";
import { getPlaceholderFromInput } from "./utils";

const TagsProvider = (props: PropsWithChildren<Record<string, unknown>>) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const currentWorkflowDetails = useAppSelector(workflowDetails);
  const tags = useAppSelector(tagsResponse);
  const [tagSelectionDropdownState, setTagSelectionDropdownState] =
    useState<TagSelectionDropdownState>({
      show: false,
      onSelect: () => {},
    });
  const [showNoMatch, setShowNoMatch] = useState(false);
  const [createTagModalState, setCreateTagModalState] =
    useState<CreateTagModalState>({
      show: false,
      onCreate: () => {},
    });
  const [saveToTagModalState, setSaveToTagModalState] =
    useState<SaveToTagModalState>({
      show: false,
      outputTag: null,
    });

  useEffect(() => {
    dispatch(getTagsAsync(currentWorkflowDetails?.id as string)).catch(
      () => {}
    );

    dispatch(
      getDatatableTagsAsync(currentWorkflowDetails?.AppContext as string)
    ).catch(() => {});
  }, []);

  const findTagPlaceholder = useCallback((): string => {
    const placeholder = getPlaceholderFromInput();

    setTagSelectionDropdownState((prevState) => ({
      ...prevState,
      show: false,
    }));

    setShowNoMatch(false);

    if (placeholder.length === 0) {
      return "";
    }

    if (placeholder === "{{") {
      setTagSelectionDropdownState((prevState) => ({
        ...prevState,
        show: true,
      }));
    } else {
      let match = null;

      forEach(tags?.content, (item) => {
        match = item.vars?.find((variable) =>
          toLower(variable.desc as string).includes(
            toLower(placeholder.replaceAll("{", "").replaceAll("}", ""))
          )
        );

        if (match) {
          return false;
        }

        return true;
      });

      if (match) {
        setTagSelectionDropdownState((prevState) => ({
          ...prevState,
          show: true,
        }));
      } else {
        setShowNoMatch(true);
      }
    }

    return placeholder;
  }, [tags]);

  const getTagPlaceholderReplacement = (placeholder: string): string =>
    ReactDOMServer.renderToString(
      <Tag text={placeholder.replaceAll("{", "").replaceAll("}", "")} />
    );

  return (
    <TagsContext.Provider
      value={{
        showNoMatch,
        setShowNoMatch,
        findTagPlaceholder,
        getTagPlaceholderReplacement,
        createTagModalState,
        setCreateTagModalState,
        saveToTagModalState,
        setSaveToTagModalState,
        tagSelectionDropdownState,
        setTagSelectionDropdownState,
      }}
    >
      {children}
      <NoMatch />
      <CreateTagModal />
      <SaveToTagModal />
    </TagsContext.Provider>
  );
};

export default TagsProvider;
