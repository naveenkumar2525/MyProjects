import {
  render,
  fireEvent,
  getByRole,
  screen,
  within,
  waitFor,
} from "../../utils/test.utils";
import ContactList from "./ContactsList.react";

test("should display heading and sub-heading when component renders", () => {
  const { getByText, container } = render(<ContactList />);

  expect(getByText("View, edit and manage your Contacts")).toBeInTheDocument();

  let element = screen.getByRole("heading", { name: "Contacts" });

  expect(element).toBeInTheDocument();
});

test("should display table content when component renders with no data", async () => {
  const { getByText, container } = render(<ContactList />);
  const noData = container.querySelector(
    ".react-bs-table-no-data"
  ) as HTMLElement;
  expect(
    within(noData).getByText(
      "There are no contacts created for this project. Create contacts first to start adding data records."
    )
  ).toBeInTheDocument();
});

test("should display contact table colunm heads", async () => {
  const { getByText, container } = render(<ContactList />);

  const contactTableHeader = container.querySelector(
    ".contacts-table"
  ) as HTMLElement;
  const selectElement = within(contactTableHeader);
  let element = await selectElement.findByText("NAME");
  expect(element).toBeInTheDocument();

  element = await selectElement.findByText("PHONE");
  expect(element).toBeInTheDocument();

  element = await selectElement.findByText("EMAIL");
  expect(element).toBeInTheDocument();

  element = await selectElement.findByText("ADDRESS");
  expect(element).toBeInTheDocument();

  element = await selectElement.findByText("GROUPS");
  expect(element).toBeInTheDocument();

  element = await selectElement.findByText("LISTS");
  expect(element).toBeInTheDocument();
});

test("Should contain table settings button", () => {
  const { getByText, container } = render(<ContactList />);
  const ele = container.querySelector(".settings-data-dropdown");
  expect(ele).toBeInTheDocument();
});

test("should display Cards", async () => {
  const { getByText, container } = render(<ContactList />);
  const contactCards = container.querySelector(".card-wrap") as HTMLElement;
  const selectElement = within(contactCards);
  let element = await selectElement.findByText("Total Contacts");
  expect(element).toBeInTheDocument();
});

test("should display table setting button", async () => {
  const { getByText, container } = render(<ContactList />);
  const DropdownToggle = container.querySelector(
    ".settings-data-dropdown .dropdown-toggle"
  ) as HTMLElement;
  fireEvent.click(DropdownToggle);
  const showDropdown = await waitFor(() =>
    container.querySelector(".show.dropdown")
  );
  expect(showDropdown).toBeInTheDocument();
  expect(container.querySelectorAll(".dropdown-item")).toHaveLength(1);
});

test("should display variable dropdown select", async () => {
  const { getByText, container } = render(<ContactList />);
  const DropdownToggle = container.querySelector(
    ".variable-type-dropdown .dropdown-toggle"
  ) as HTMLElement;
  fireEvent.click(DropdownToggle);
  expect(container.querySelectorAll(".dropdown-item")).toHaveLength(1);
});

test("should display add data dropdown", async () => {
  const { getByText, container } = render(<ContactList />);
  const DropdownToggle = container.querySelector(
    ".add-data-dropdown .dropdown-toggle"
  ) as HTMLElement;
  fireEvent.click(DropdownToggle);
  expect(container.querySelectorAll(".dropdown-item")).toHaveLength(4);
});
