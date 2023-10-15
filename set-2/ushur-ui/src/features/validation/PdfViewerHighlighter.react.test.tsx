import { act, fireEvent, screen } from '@testing-library/react';
import * as ReactDOM from "react-dom";
import PdfViewerHighlighter from './PdfViewerHighlighter.react';

describe('PdfViewerHighlighter', function () {
  let area = { "keyword": {}, "keywordStr": "12", "numPages": 3, "pageIndex": 0, "left": 49.28454972946699, "top": 37.95793243694418, "height": 1.2626339272164384, "width": 1.6402214712871677, "pageHeight": 1029.59375, "pageWidth": 795.59375 }
  let mockFilteredData = [{"highlightKeyword":"12","span":"Exam/Lens/Frame \n12/12/24","keyword":"12","matchCase":false,"typeColor":"rgba(255, 252, 208, 0.4)","pageIndex":"1","file_name":"Ameritas_Vision_Summary_(1).pdf","keyword_type":"number","id":"highlight-Ameritas_Vision_Summary_(1).pdf-7"}]
  let mockHighlightProps = {
    highlightAreas: [area],
    getCssProperties: jest.fn()
  };
  let scrollRefs = {
    current: [
      {
        current: {

        }
      }
    ]
  }
  const renderComponent = (status: string, container: any) => {
    ReactDOM.render(<PdfViewerHighlighter area={area} idx={0} filteredData={mockFilteredData} 
      filteredDataIndex={1} scrollRefs={scrollRefs} highlightAreaProps={mockHighlightProps} 
      onMouseOver={function (filteredData: any, filteredDataIndex: number): void {
      console.log("Mouse Over event is Triggered.");
    }} />, container);
  };

  it('renders the highlighter component with expected background', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);
    renderComponent('active', container);
    const statusElement = screen.getByTitle('12')
    act(() => {
      fireEvent.click(statusElement);
    })
    // Assert: check that text has a specific background color.
    expect(statusElement).toHaveClass('rpv-search__highlight');
    expect(statusElement).toHaveClass(mockFilteredData[0]?.keyword_type);
  });
});