import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { screen, render, fireEvent, act } from "../../utils/test.utils";
import ValidationForm from "./ValidationForm.react";
import { setPinned, setValidationsList } from "./ValidationSlice";
import { getGroupType } from "./ValidationUtils";
import testValListData from "../../../json-server/db.json";

const onMouseEnterSpy = jest.fn();
const handleRowClickSpy = jest.fn();

const Component = (pinned: any) => {  
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPinned(false));
    dispatch(setValidationsList(testValListData["valList"]["engagements"]))
  });

  const mockFieldsArray: any[] = [
    {
      label: 'benefit_duration',
      value: {
        span: '60 days of Monthy Income',
        value: '60',
        page_no: 1,
        file_name: 'test.pdf'
      },
      type: "DISA"
    },
    {
      label: 'broker_email',
      value: {
        span_information: {
          left_span: 'From: SEQuotes: <',
          right_span: '>,'
        },
        value: 'SEquotes@gisbenefits.net',
        page_no: null,
        file_name: null
      },
      type: "DATA_EXTRACTION"
    },
    {
      label: 'test',
      value: {
        span_information: {
          left_span: 'From: SEQuotes: <',
          right_span: '>,'
        },
        value: 'SEquotes@gisbenefits.net',
        page_no: null,
        file_name: null
      },
      type: "DATA_EXTRACTION"
    }
  ]

  return <ValidationForm campaignId={"Email_Body_PDF_Extraction"} sessionId={"2bd41e37-66f9-498d-9cc8-96819083f435-uxidxyz-485a7734-2be4-4c74-a702-9b0c3a7402e4"} onMouseEnter={onMouseEnterSpy}
  handleRowClick={handleRowClickSpy} searchText={"SEquotes@gisbenefits.net"}
  fieldsArray={mockFieldsArray} updateSessionId={function (sessionId: string): void {
    throw new Error("Function not implemented.");
  } } searchedFrom={""} isRowClicked={false} />;
};

test("Check if the Validation Form component is invoked.", () => {
  const { getByText } = render(
    <Component pinned={false} />
  );
  const ele = getByText(/extracted from this engagement/i);
  expect(ele).toBeDefined();
});

test("Check if the form search section is loaded.", () => {
  render(
    <Component pinned={false} />
  );
  const ele = screen.getByTestId('field-button');
  expect(ele).toBeDefined();
});

test("Check if the fields array is not empty.", () => {
  render(
    <Component pinned={false} />
  );
  const ele = screen.getByText(/benefit_duration/i);
  expect(ele).toBeDefined();
});

test("Check if the element click is triggered..", () => {
  render(
    <Component pinned={false} />
  );
  const ele = screen.getByText(/broker_email/i);
  act(() => {
    fireEvent.click(ele);
  })
  expect(onMouseEnterSpy).toHaveBeenCalled();
  expect(ele).toBeDefined();
});

test("Check if the engagements dropdown is present..", () => {
  render(
    <Component pinned={false} />
  );
  const ele = screen.getByTestId('validation-text-dropdown');
  expect(ele).toBeDefined();
});

test("Check if the previous / next buttons are present and clickable..", () => {
  render(
    <Component pinned={false} />
  );
  const ele = screen.getAllByRole("button");
  expect(ele[1]).toHaveClass("no-right-corner");
  expect(ele[2]).toHaveClass("no-left-corner");
  act(() => {
    fireEvent.click(ele[2]);
  })
});

test("Check if the field has the associated color.", () => {
  render(
    <Component pinned={false} />
  );
  const ele = screen.getByText(/benefit_duration/i);
  expect(ele).toHaveClass(getGroupType('60'));
});

test("Check if the field has the associated color.", () => {
  render(
    <Component pinned={false} />
  );
  const ele = screen.getByText(/broker_email/i);
  expect(ele).toHaveClass(getGroupType('SEquotes@gisbenefits.net'));
});
