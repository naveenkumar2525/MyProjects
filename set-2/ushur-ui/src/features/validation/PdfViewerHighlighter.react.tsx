type PdfHighlighterProps = {
    area: any;
    idx: number;
    filteredData: any;
    filteredDataIndex: number;
    scrollRefs: any;
    highlightAreaProps: any;
    onMouseOver: (filteredData: any, filteredDataIndex: number) => void;
};
const PdfViewerHighlighter = (pdfHighlighterProps: PdfHighlighterProps) => {
    return (<div
        key={`${pdfHighlighterProps.area.pageIndex}-${pdfHighlighterProps.idx}`}
        id={pdfHighlighterProps.filteredData[0]?.id}
        title={pdfHighlighterProps.filteredData[0]?.highlightKeyword}
        ref={pdfHighlighterProps.scrollRefs.current[pdfHighlighterProps.filteredDataIndex]}
        className={'rpv-search__highlight' + ' '
          + pdfHighlighterProps.filteredData[0]?.keyword_type + ' ' + pdfHighlighterProps.filteredData[0]?.id}
        onClick={() => { pdfHighlighterProps.onMouseOver(pdfHighlighterProps.filteredData[0], pdfHighlighterProps.filteredDataIndex) }}
        style={{
          ...pdfHighlighterProps.highlightAreaProps?.getCssProperties(pdfHighlighterProps.area),
          background: pdfHighlighterProps.filteredData[0]?.typeColor,
          position: 'absolute'
        }}
      >
      </div>)
}

export default PdfViewerHighlighter;