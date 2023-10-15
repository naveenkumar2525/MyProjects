import { ReactNode, useContext, useEffect, useState } from "react";
import { render, screen } from "../../../utils/test.utils";
import TagsContext, {
  tagsContextInitialState,
  SaveToTagModalState,
} from "./Context";
import SaveToTagModal from "./SaveToTagModal";

const setCreateTagModalState = jest.fn();

type ContainerProps = {
  children: ReactNode;
};

const InnerContainer = (props: ContainerProps) => {
  const { children } = props;
  const { setSaveToTagModalState } = useContext(TagsContext);

  useEffect(() => {
    setSaveToTagModalState((prevState) => ({
      ...prevState,
      show: true,
    }));
  }, []);

  return <>{children}</>;
};

const OuterContainer = (props: ContainerProps) => {
  const { children } = props;
  const [saveToTagModalState, setSaveToTagModalState] =
    useState<SaveToTagModalState>({
      show: false,
      outputTag: null,
    });

  return (
    <TagsContext.Provider
      value={{
        ...tagsContextInitialState,
        saveToTagModalState,
        setSaveToTagModalState,
        setCreateTagModalState,
      }}
    >
      <InnerContainer>{children}</InnerContainer>
    </TagsContext.Provider>
  );
};

test("Save To Tag modal renders", () => {
  render(
    <OuterContainer>
      <SaveToTagModal />
    </OuterContainer>
  );
  const modal = screen.getByRole("dialog");

  expect(modal).toBeInTheDocument();
});

test("Save To Tag modal heading renders", () => {
  render(
    <OuterContainer>
      <SaveToTagModal />
    </OuterContainer>
  );
  const heading = screen.getByText("Save output");

  expect(heading).toBeInTheDocument();
});

test("Save To Tag modal click on New Tag button", () => {
  render(
    <OuterContainer>
      <SaveToTagModal />
    </OuterContainer>
  );
  const button = screen.getByLabelText("New tag");

  button.click();

  expect(setCreateTagModalState).toBeCalled();
});
