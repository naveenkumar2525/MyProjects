import { ReactNode, useEffect, useContext } from "react";
import { render, screen, waitFor } from "../../../../utils/test.utils";
import TagsContext from "../Context";
import TagsProvider from "../Provider";
import TagSelectionDropdown from "./TagSelectionDropdown";

type ContainerProps = {
  children: ReactNode;
};

const InnerContainer = (props: ContainerProps) => {
  const { children } = props;
  const { setTagSelectionDropdownState } = useContext(TagsContext);

  useEffect(() => {
    setTimeout(() => {
      setTagSelectionDropdownState((prevState) => ({
        ...prevState,
        show: true,
      }));
    }, 100);
  }, []);

  return <>{children}</>;
};

const OuterContainer = (props: ContainerProps) => {
  const { children } = props;

  return (
    <TagsProvider>
      <InnerContainer>{children}</InnerContainer>
    </TagsProvider>
  );
};

test("Tag Selection Dropdown Headings render", async () => {
  render(
    <OuterContainer>
      <TagSelectionDropdown />
    </OuterContainer>
  );

  await waitFor(() => {
    const tagsHeading = screen.getByText("Tags");
    const datatableTagsHeading = screen.getByText("Datatables");
    const globalValuesHeading = screen.getByText("Global Values");

    expect(tagsHeading).toBeInTheDocument();
    expect(datatableTagsHeading).toBeInTheDocument();
    expect(globalValuesHeading).toBeInTheDocument();
  });
});

test("Tag Selection Dropdown All Tags List renders", async () => {
  render(
    <OuterContainer>
      <TagSelectionDropdown />
    </OuterContainer>
  );

  await waitFor(() => {
    const list = screen.getAllByRole("list");

    expect(list).toHaveLength(3);
  });
});

test("Tag Selection Dropdown Close dropdown", async () => {
  render(
    <OuterContainer>
      <TagSelectionDropdown />
    </OuterContainer>
  );

  await waitFor(() => {
    const tagsHeading = screen.getByText("Tags");
    const datatableTagsHeading = screen.getByText("Datatables");
    const globalValuesHeading = screen.getByText("Global Values");

    const button = screen.getByRole("button", {
      name: "Cancel",
    });

    button.click();

    expect(tagsHeading).not.toBeInTheDocument();
    expect(datatableTagsHeading).not.toBeInTheDocument();
    expect(globalValuesHeading).not.toBeInTheDocument();
  });
});

test("Tag Selection Dropdown Open Create New Tag Modal", async () => {
  render(
    <OuterContainer>
      <TagSelectionDropdown />
    </OuterContainer>
  );

  await waitFor(() => {
    const button = screen.getByRole("button", {
      name: "New tag",
    });

    button.click();

    const modal = screen.getByRole("dialog");

    expect(modal).toBeInTheDocument();
  });
});

test("Tag Selection Dropdown Click on List item", async () => {
  render(
    <OuterContainer>
      <TagSelectionDropdown className="TagSelectionDropdown" />
    </OuterContainer>
  );

  await waitFor(() => {
    const button = screen.getByRole("button", {
      name: "name",
    });

    button.click();
  });
});
