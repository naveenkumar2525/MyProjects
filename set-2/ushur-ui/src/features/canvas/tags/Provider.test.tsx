import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../utils/test.utils";
import TagsProvider from "./Provider";
import TextInput from "../module-config/components/form-module/elements/TextInput";
import TagSelectionDropdown from "./TagSelectionDropdown/TagSelectionDropdown";

test("Provider renders", () => {
  render(
    <TagsProvider>
      <span>Inside tags provider</span>
    </TagsProvider>
  );
  const text = screen.getByText("Inside tags provider");

  expect(text).toBeInTheDocument();
});

test("Provider No Match Component renders", async () => {
  render(
    <TagsProvider>
      <TextInput />
    </TagsProvider>
  );
  const input = screen.getByTestId("textInput");

  await userEvent.type(input, "{{{{demo");

  const text = screen.getByText(
    "No matches found. Save data to a new tag or datatable property."
  );

  expect(text).toBeInTheDocument();
});

test("Provider Tag Selection Dropdown renders", async () => {
  render(
    <TagsProvider>
      <TextInput />
      <TagSelectionDropdown />
    </TagsProvider>
  );
  const input = screen.getByTestId("textInput");

  await userEvent.type(input, "{{{{name");

  const tagsHeading = screen.getByText("Tags");
  const datatableTagsHeading = screen.getByText("Datatables");
  const globalValuesHeading = await screen.findByText("Global Values");

  expect(tagsHeading).toBeInTheDocument();
  expect(datatableTagsHeading).toBeInTheDocument();
  expect(globalValuesHeading).toBeInTheDocument();
});
