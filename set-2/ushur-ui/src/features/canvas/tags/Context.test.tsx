import { useContext, useEffect } from "react";
import { render, screen } from "../../../utils/test.utils";
import TagsContext, { tagsContextInitialState } from "./Context";

const Component = () => {
  const {
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
  } = useContext(TagsContext);

  useEffect(() => {
    setShowNoMatch(showNoMatch);
    getTagPlaceholderReplacement(findTagPlaceholder());
    setCreateTagModalState(createTagModalState);
    setSaveToTagModalState(saveToTagModalState);
    setTagSelectionDropdownState(tagSelectionDropdownState);
  }, []);

  return (
    <>
      <span>Inside tags context</span>
    </>
  );
};

test("Context renders", () => {
  render(
    <TagsContext.Provider value={tagsContextInitialState}>
      <Component />
    </TagsContext.Provider>
  );
  const text = screen.getByText("Inside tags context");

  expect(text).toBeInTheDocument();
});
