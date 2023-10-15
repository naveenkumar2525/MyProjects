import { ReactNode, useContext, useEffect, useState } from "react";
import { render, screen } from "../../../utils/test.utils";
import TagsContext, { tagsContextInitialState } from "./Context";
import NoMatch from "./NoMatch";

const setCreateTagModalState = jest.fn();

type ContainerProps = {
  children: ReactNode;
};

const InnerContainer = (props: ContainerProps) => {
  const { children } = props;
  const { setShowNoMatch } = useContext(TagsContext);

  useEffect(() => {
    setShowNoMatch(true);
  }, []);

  return <>{children}</>;
};

const OuterContainer = (props: ContainerProps) => {
  const { children } = props;
  const [showNoMatch, setShowNoMatch] = useState(false);

  return (
    <TagsContext.Provider
      value={{
        ...tagsContextInitialState,
        showNoMatch,
        setShowNoMatch,
        setCreateTagModalState,
      }}
    >
      <InnerContainer>{children}</InnerContainer>
    </TagsContext.Provider>
  );
};

test("NoMatch component renders", () => {
  render(
    <OuterContainer>
      <NoMatch />
    </OuterContainer>
  );
  const text = screen.getByText(
    "No matches found. Save data to a new tag or datatable property."
  );

  expect(text).toBeInTheDocument();
});

test("NoMatch component click on New Tag button", () => {
  render(
    <OuterContainer>
      <NoMatch />
    </OuterContainer>
  );
  const button = screen.getByRole("button", {
    name: "New tag",
  });

  button.click();

  expect(setCreateTagModalState).toBeCalled();
});

test("NoMatch component click on Cancel button", () => {
  render(
    <OuterContainer>
      <NoMatch />
    </OuterContainer>
  );
  const text = screen.getByText(
    "No matches found. Save data to a new tag or datatable property."
  );
  const button = screen.getByRole("button", {
    name: "Cancel",
  });

  button.click();

  expect(text).not.toBeInTheDocument();
});
