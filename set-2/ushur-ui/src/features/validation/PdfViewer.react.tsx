import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { searchPlugin, RenderHighlightsProps } from '@react-pdf-viewer/search';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import { setSearchText, setSearchedFrom } from './ValidationSlice';
import { useAppDispatch } from '../../app/hooks';
import { createRef, useRef } from 'react';
import PdfViewerHighlighter from './PdfViewerHighlighter.react';

type SearchProps = {
  highlightKeyword: string,
  span: string,
  keyword: string,
  matchCase: boolean,
  typeColor: string,
  pageIndex: number,
  keyword_type: string,
  id: string
}
type PdfViewerProps = {
  searchText: SearchProps[];
  fileUrl: string,
  initialPage: number;
  hoveredSearchText: string;
};
const PdfViewer = (pdfProps: PdfViewerProps) => {
  const dispatch = useAppDispatch();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const scrollRefs = useRef([]);
  scrollRefs.current = [...Array.from(Array(pdfProps.searchText.length).keys())].map(
    (_, i) => scrollRefs.current[i] ?? createRef()
  );
  const renderSearchHighlights = (props: RenderHighlightsProps) => {
    return (
      <div>
        {props.highlightAreas
          .map((area: any, idx: number) => {
            const filteredData = pdfProps.searchText.filter(
              (searchText) => searchText?.keyword === area.keywordStr
                && (searchText.pageIndex - 1) === parseInt(area.pageIndex, 10));
            const filteredIndex = pdfProps.searchText.findIndex(
              (searchText) => searchText?.keyword === area.keywordStr
                && (searchText.pageIndex - 1) === parseInt(area.pageIndex, 10));
            if (filteredData.length > 0) {
              return <PdfViewerHighlighter area={area} filteredData={filteredData}
                filteredDataIndex={filteredIndex} idx={idx}
                highlightAreaProps={props} scrollRefs={scrollRefs}
                onMouseOver={() => { onMouseOver(filteredData[0], filteredIndex) }} />
            }
          }
          )}
      </div>
    );
  };

  const getBackgroundHighlightColor = (groupType: string) => {
    switch (groupType) {
      case 'acronym':
        return '1px solid #8A69FF';
      case 'number':
        return '1px solid #FFCD00';
      case 'text':
        return '1px solid #00A7E1';
      case 'special-character':
        return '1px solid #19AF58';
    }
  };

  const scrollRefStyle = (highlightId: number) => {
    // @ts-ignore: TS2339
    return scrollRefs.current[highlightId] && scrollRefs.current[highlightId].current ? scrollRefs.current[highlightId].current.style : undefined;
  }

  const onMouseOver = (searchedKeywordInfo: any, highlightId: number) => {
    onMouseLeave(highlightId);
    setTimeout(() => {
      dispatch(setSearchText(searchedKeywordInfo?.highlightKeyword));
    }, 10);
    dispatch(setSearchedFrom(searchedKeywordInfo?.file_name));
    const styleRef = scrollRefStyle(highlightId);
    if (styleRef) {
      styleRef.cursor = 'pointer';
      styleRef.border = getBackgroundHighlightColor(searchedKeywordInfo?.keyword_type);
    }
    setTimeout(() => {
      onMouseLeave(highlightId);
    }, 10000);
  }

  const onMouseLeave = (highlightId: number) => {
    dispatch(setSearchText(''));
    const styleRef = scrollRefStyle(highlightId);
    if (styleRef) {
      styleRef.cursor = 'none';
      styleRef.border = 'none';
    }
  }

  const searchPluginInstance = searchPlugin({
    keyword: pdfProps.searchText,
    renderHighlights: renderSearchHighlights
  });

  const addScrollRefToSelectors = (selectorsList: HTMLCollectionOf<Element>, keywordType: string) => {
    // @ts-ignore: TS2802
    for (const element of selectorsList) {
      if (element && element?.id) {
        let dataSelector = element;
        element.style.cursor = 'pointer';
        element.style.border = getBackgroundHighlightColor(keywordType);
        selectorsList[0].scrollIntoView({ behavior: "smooth", inline: "nearest" });
        setTimeout(() => {
          if (dataSelector) {
            dataSelector.style.cursor = 'none';
            dataSelector.style.border = 'none';
          }
        }, 10000);
      }
    }
  }

  const setHoveredSearchedWord = () => {
    if (pdfProps.hoveredSearchText) {
      const currIndex = pdfProps.searchText.findIndex((searchedKeyword: SearchProps) => searchedKeyword?.highlightKeyword.toString() === pdfProps.hoveredSearchText.toString());
      const keyword_type = pdfProps.searchText.find((searchedKeyword) => searchedKeyword?.highlightKeyword.toString() === pdfProps.hoveredSearchText.toString())?.keyword_type ?? '';
      // @ts-ignore: TS2339
      if (scrollRefs.current[currIndex] && scrollRefs.current[currIndex].current) {
        // @ts-ignore: TS2339
        let selectorsList = document.getElementsByClassName(scrollRefs.current[currIndex].current.id)
        addScrollRefToSelectors(selectorsList, keyword_type);
      }
    }
  }

  setHoveredSearchedWord();

  const loadHighlightedWord = () => {
    setTimeout(() => {
      setHoveredSearchedWord();
    }, 1000);
  }

  return (
    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
      <div
        style={{
          height: '60vh',
          width: 'inherit',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {
          pdfProps.fileUrl ?

            <Viewer
              initialPage={pdfProps.initialPage}
              fileUrl={pdfProps.fileUrl}
              onDocumentLoad={loadHighlightedWord}
              plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
            /> : ''
        }
      </div>
    </Worker>
  );
};

export default PdfViewer;

