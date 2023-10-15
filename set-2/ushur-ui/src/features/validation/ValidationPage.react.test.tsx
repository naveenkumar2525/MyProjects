import { useEffect } from "react";
import { act, fireEvent, render, screen, within } from "../../utils/test.utils";
import { useAppDispatch } from "../../app/hooks";
import ValidationPage from './ValidationPage.react';
import { getUshursAsync } from "../ushurs/ushursSlice";
import { columns } from "./ValidationDataTable.react";
import { setValidationsDetails } from "./ValidationSlice";
import testTabData from "../../../json-server/db.json";

const Component = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
      dispatch(getUshursAsync());
      dispatch(setValidationsDetails(testTabData["tabDataSet"].resp));
  }, []);

  return <ValidationPage />;
};

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

test("Check if the Validation Page component is invoked.", () => {
  const { getByText } = render(
    <Component />
  );
  const titleElement = getByText(/Validation Queue/i);
  expect(titleElement).toBeDefined();
  expect(screen.getByRole('button', { name: /Workflow/i })).toBeInTheDocument();
  expect(screen.getByRole('table')).toBeInTheDocument();
});

test("Check if the Validation Page contains the workflow select component.", () => {
  render(<Component />);
  const workflowElement = screen.getByRole('button', { name: /Workflow/i });
  act(() => {
    fireEvent.click(workflowElement);
  })
  expect(workflowElement).toBeInTheDocument();
  const campaignLinkElement = screen.getByTestId('campaign-link');
  act(() => {
    fireEvent.click(campaignLinkElement);
  });
  expect(campaignLinkElement).toHaveStyle({ cursor: "not-allowed" });
  expect(campaignLinkElement).toBeInTheDocument();
});

test("Check if the Validation Header Component contains the DataCard.", () => {
  const { getByText } = render(
    <Component />
  );
  expect(getByText(/KEY/i)).toBeInTheDocument();
  expect(getByText(/Text/i)).toBeInTheDocument();
  expect(getByText(/Acronym/i)).toBeInTheDocument();
});

test("Check if the Validation Page Body content is displayed.", () => {
  render(
    <Component />
  );
  // Check if Validation Form is present in the Validation Body.
  expect(screen.getByText(/extracted from this engagement/i)).toBeInTheDocument();
  // Check if the form search section is loaded.
  const ele = screen.getByTestId('field-button');
  expect(ele).toBeDefined();
  const formElement = screen.getByText(/benefit_percentage/i);
  act(() => {
    fireEvent.click(ele);
  })
  expect(formElement).toBeDefined();
  // Check if Validation Data Table is present in the Validation Body.
  expect(screen.getByRole('table')).toBeInTheDocument();

  const viewerEle = screen.getByTestId('core__viewer');
  expect(viewerEle).toBeDefined();
});

test("Check if the Ushur Table Section is loaded properly.", () => {
  render(
    <Component />
  );
  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();
  const columnHeaders = within(table).getAllByRole("columnheader");
  expect(columnHeaders.length).toBe(3);
  for (let i = 0; i < columnHeaders.length; i += 1) {
    expect(columnHeaders[i]).toHaveTextContent(columns[i].text as string);
  }
  const rows = within(table).getAllByRole("row");
  expect(rows.length).toBe(2);
  const element = within(table).getByRole("cell", {
    name: "No extractions exist",
  });
  expect(element).toBeInTheDocument();
});