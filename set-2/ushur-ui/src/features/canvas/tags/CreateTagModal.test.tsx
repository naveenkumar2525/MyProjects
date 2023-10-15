import { ReactNode, useContext, useEffect, useState } from "react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../utils/test.utils";
import TagsContext, {
  tagsContextInitialState,
  CreateTagModalState,
} from "./Context";
import CreateTagModal from "./CreateTagModal";

type ContainerProps = {
  children: ReactNode;
};

const InnerContainer = (props: ContainerProps) => {
  const { children } = props;
  const { setCreateTagModalState } = useContext(TagsContext);

  useEffect(() => {
    setCreateTagModalState((prevState) => ({
      ...prevState,
      show: true,
    }));
  }, []);

  return <>{children}</>;
};

const OuterContainer = (props: ContainerProps) => {
  const { children } = props;
  const [createTagModalState, setCreateTagModalState] =
    useState<CreateTagModalState>({
      show: false,
      onCreate: () => {},
    });

  return (
    <TagsContext.Provider
      value={{
        ...tagsContextInitialState,
        createTagModalState,
        setCreateTagModalState,
      }}
    >
      <InnerContainer>{children}</InnerContainer>
    </TagsContext.Provider>
  );
};

test("Create Tag modal renders", () => {
  render(
    <OuterContainer>
      <CreateTagModal />
    </OuterContainer>
  );
  const modal = screen.getByRole("dialog");

  expect(modal).toBeInTheDocument();
});

test("Create Tag modal heading renders", () => {
  render(
    <OuterContainer>
      <CreateTagModal />
    </OuterContainer>
  );
  const heading = screen.getAllByText("New Tag");

  expect(heading).toHaveLength(2);
});

test("Create Tag modal description renders", () => {
  render(
    <OuterContainer>
      <CreateTagModal />
    </OuterContainer>
  );
  const desc = screen.getByText(
    "Create a new tag by providing a name and a data type below"
  );

  expect(desc).toBeInTheDocument();
});

test("Create Tag modal hide", async () => {
  render(
    <OuterContainer>
      <CreateTagModal />
    </OuterContainer>
  );
  const modal = screen.getByRole("dialog");
  const button = screen.getByRole("button", {
    name: "Close",
  });

  await userEvent.click(button);

  expect(modal).not.toBeInTheDocument();
});

test("Create Tag modal create new tag", async () => {
  render(
    <OuterContainer>
      <CreateTagModal />
    </OuterContainer>
  );
  const modal = screen.getByRole("dialog");
  const input = screen.getByRole("textbox", {
    name: "Tag name",
  });
  const select = screen.getByRole("combobox");
  const button = screen.getByRole("button", {
    name: "New Tag",
  });

  await waitFor(async () => {
    await userEvent.type(input, "Demo");
    await userEvent.click(select);
    await userEvent.keyboard("[ArrowDown]");
    await userEvent.keyboard("[Enter]");
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(modal).not.toBeInTheDocument();
  });
});
