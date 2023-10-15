import ValidationPhrase from './ValidationPhrase.react';
import { render, screen } from "../../utils/test.utils";
import { setValidationsDetails } from './ValidationSlice';
import { useAppDispatch } from '../../app/hooks';
import testTabData from "../../../json-server/db.json";

const mockFieldsArray: any[] = [
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
      value: 'test',
      page_no: null,
      file_name: null
    },
    type: "DATA_EXTRACTION"
  }
]
test("Check if the Validation Phrase component is invoked.", async () => {
  const Component = () => {
    const dispatch = useAppDispatch();
    dispatch(setValidationsDetails(testTabData["tabDataSet"].resp));

    return <ValidationPhrase campaignId={''} sessionId={''} searchWords={'SEquotes@gisbenefits.net'} leftSpan={'From: SEQuotes: <'} rightSpan={'>,'} 
      fieldsArray={mockFieldsArray} overallSearchWords={['SEquotes@gisbenefits.net']} />;
  };
  render(
    <Component />
  );

  const ele = screen.getByText(/SEquotes@gisbenefits.net/i);
  expect(ele).toBeDefined();
});