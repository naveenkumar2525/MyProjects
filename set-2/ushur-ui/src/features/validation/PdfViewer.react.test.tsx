import { render } from "@testing-library/react";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { Provider } from "react-redux";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { createStore } from "../../utils/test.utils";
import { mockIsIntersecting } from "./mockIntersectionObserver";
import PdfViewer from './PdfViewer.react';
import { searchText, setSearchText } from "./ValidationSlice";

describe('PdfViewer', function () {
  const store = createStore({});
  let mockFilteredData = [{ "highlightKeyword": "cartographic", "span": "cartographic", "keyword": "cartographic", "matchCase": false, "typeColor": "rgba(255, 252, 208, 0.4)", "pageIndex": 1, "file_name": "Ameritas_Vision_Summary_(1).pdf", "keyword_type": "text", "id": "highlight-Ameritas_Vision_Summary_(1).pdf-7" }]
  const Component = () => {
    const dispatch = useAppDispatch();
    dispatch(setSearchText('cartographic'));
    const searchedText = useAppSelector(searchText);
    let pdfFileUrl = 'https://cdn.jsdelivr.net/gh/manikmi/react-pdf-viewer-sample@main/public/pkpadmin,+840-4082-1-CE.pdf';
    return <PdfViewer searchText={mockFilteredData} hoveredSearchText={searchedText} fileUrl={pdfFileUrl} initialPage={0} />
  };

  it('renders the document with the mentioned pdf url', async () => {
    let container = document.createElement('div');
    document.body.appendChild(container);
    
    // const { getByTestId } = render(
    //   <Provider store={store}><Component /></Provider>
    // );
    // GlobalWorkerOptions.workerSrc = '';
    // const viewerEle = getByTestId('core__viewer');
    // mockIsIntersecting(viewerEle, true);
    // expect(viewerEle).toBeDefined();
  });
});