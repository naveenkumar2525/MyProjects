import { useAppDispatch } from "../../app/hooks";
import ValidationDatatable, { columns } from "./ValidationDataTable.react";
import {
  setPinned
} from "./ValidationSlice";
import { render, screen, within } from "../../utils/test.utils";

describe('Validation Data Table', () => {
  const Component = (pinned: any) => {
    const dispatch = useAppDispatch();

    const handleRowClickSpy = jest.fn()
    dispatch(setPinned(pinned));

    return <ValidationDatatable campaignId={""} headerShow={true} handleRowClick={handleRowClickSpy} />
  };

  it("Check if the Ushur Table Section is loaded properly.", () => {
    render(
      <Component pinned={false} />
    );
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    const columnHeaders = within(table).getAllByRole("columnheader");
    expect(columnHeaders.length).toBe(1);
    for (const colHeader of columnHeaders) {
      expect(colHeader).toHaveTextContent(columns[1].text);
    }
  });

  it("Check if the Ushur Table Section is loaded properly and shows no data exists.", () => {
    render(
      <Component pinned={true} />
    );
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows.length).toBe(2);
    const element = within(table).getByRole("cell", {
      name: "No extractions exist",
    });
    expect(element).toBeInTheDocument();
  });
})
