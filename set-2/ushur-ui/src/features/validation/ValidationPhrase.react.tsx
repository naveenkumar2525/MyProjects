import "./Validation.css";
import { setSearchText, validationDetails } from "./ValidationSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Highlighter from "react-highlight-words";
import { createRef, useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { getGroupType } from "./ValidationUtils";

type ValidationPhraseProps = {
  campaignId: string;
  sessionId: string;
  searchWords: string;
  leftSpan: string;
  rightSpan: string;
  fieldsArray: any;
  overallSearchWords: any;
};

const ValidationPhrase = (props: ValidationPhraseProps) => {
  let { searchWords, leftSpan, rightSpan, overallSearchWords, fieldsArray } = props;
  const details = useAppSelector(validationDetails);
  const searchWordsInitialValue: string[] = [];
  const dispatch = useAppDispatch();
  const [searchWordsArr, setSearchWordsArr] = useState(searchWordsInitialValue);
  const scrollRefs = useRef([]);
  const chunkLimit = 25;
  let content: string = details && details.length > 0 
    ? details[0]?.incomingData?.content ?? "" : "";
  useEffect(() => {
    if (searchWords !== "") {
      setSearchWordsArr([searchWords]);
    }
  }, [searchWords]);

  const cleanupRegex = (input: string) => {
    return input
      .replaceAll("\\n", "\\\n")
      .replaceAll("\n", "\\n")
      .replaceAll("\r", "\\r")
      .replaceAll("$", "\\$")
      .replaceAll("%", "\\%")
      .replaceAll(":", "\\:")
      .replaceAll(";", "\\;")
      .replaceAll("#", "\\#")
      .replaceAll("^", "\\^")
      .replaceAll("&", "\\&")
      .replaceAll("/", "\\/")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll("+", "\\+")
      .replaceAll("*", "\\*")
      .replaceAll(",", "\\,")
      .replaceAll("-", "\\-");
  };

  scrollRefs.current = [...Array.from(Array(overallSearchWords.length).keys())].map(
    (_, i) => scrollRefs.current[i] ?? createRef()
  );

  const sortNulls = (() => {
    return function (a: any, b: any) {
      // equal items sort equally
      if (a.value === b.value) {
        return 0;
      }
      // nulls sort after anything else
      else if (a.value === null || a.value === "") {
        return 1;
      } else if (b.value === null || b.value === "") {
        return -1;
      }
      return 0;
    };
  });

  const findChunksWithPrePost = (inputArray: any) => {
    const chunks: { start: number; end: number; }[] = [];
    let textToHighlight = content;
    let searchWord = "";
    try {
      let preValue = "";
      let postValue = "";
      let searchedText = "";
      // Temporary fix for chunks limit to get the entire email content loaded.
      if (searchWords !== "") {
        preValue = leftSpan ?? '';
        postValue = rightSpan ?? '';
        searchWord = searchWords ?? '';
        searchedText = preValue + searchWord + postValue;
        const re = new RegExp(cleanupRegex(searchedText), "g");
        const searchStart = textToHighlight.search(re);
        const start = searchStart + preValue.length;
        const end = start + searchWord.length;
        if (searchStart >= 0 && chunks.length <= chunkLimit) {
          chunks.push({
            start,
            end,
          });
        }
      }
      // --- Commented for now but we will need this feature with increased chunks limit later ---
      inputArray?.sort(sortNulls).map((field: any) => {
        let valueObj = field?.value;
        preValue = valueObj?.span_information?.left_span ?? '';
        postValue = valueObj?.span_information?.right_span ?? '';
        searchWord = valueObj?.value ?? '';
        if (searchWords !== searchWord) {
          searchedText = preValue + searchWord + postValue;
          const re = new RegExp(cleanupRegex(searchedText), "g");
          const searchStart = textToHighlight.search(re);
          const start = searchStart + preValue.length;
          const end = start + searchWord.length;
          if (searchStart >= 0 && chunks.length <= chunkLimit) {
            chunks.push({
              start,
              end,
            });
          }
        }
      });
    } catch (exp: any) {
      console.log(exp.toString());
    } finally {
      return chunks;
    }
  };

  const setHighlightClassname = (searchText: string, isSearched: boolean) => {
    switch (getGroupType(searchText)) {
      case 'acronym':
        return 'validation-highlighter-acronym' + (isSearched ? ' acronym-hover' : '')
      case 'number':
        return 'validation-highlighter-number' + (isSearched ? ' number-hover' : '')
      case 'text':
        return 'validation-highlighter-text' + (isSearched ? ' text-hover' : '')
      case 'special-character':
        return 'validation-highlighter-special-character' + (isSearched ? ' special-char-hover' : '')
    }
  };

  const chunksData = () => {
    return findChunksWithPrePost(fieldsArray.sort(sortNulls));
  }

  const modifyHoveredSearchText = (searchText: string) => {
    dispatch(setSearchText(''));
    setTimeout(() => {
      dispatch(setSearchText(searchText));
    }, 10);
    setTimeout(() => {
      dispatch(setSearchText(''));
    }, 10000);
  }

  const scrollSmoothHandler = (index: number) => {
    // @ts-ignore
    scrollRefs.current[index]?.current?.scrollIntoView({ behavior: "smooth", inline: "nearest" });
  };
  
  // @ts-ignore
  const getHighlightTag = () => ({ children, highlightIndex }) => {
    let currHighlight = false;
    if (leftSpan && searchWords && rightSpan) {
      let searchedSpan = leftSpan + searchWords + rightSpan;
      currHighlight = (searchedSpan.includes(children) && searchWords === children);
    } else {
      currHighlight = (searchWords === children);
    }
    if (currHighlight) {
      scrollSmoothHandler(highlightIndex);
    }
    return (
        // @ts-ignore
        <mark ref={scrollRefs.current[highlightIndex]}
          className={setHighlightClassname(children, currHighlight)} 
          onClick={ () => modifyHoveredSearchText(children)}>
            {children}
        </mark>
    );
};

  return (
    <div
      style={{ whiteSpace: "pre-line" }}
      className="validation-form-text">
        <Card id={'highlighter-card'}>
          <Card.Body>
            <Highlighter
              highlightTag={getHighlightTag()}
              searchWords={overallSearchWords}
              autoEscape={false}
              textToHighlight={content}
              findChunks={chunksData} />
          </Card.Body>
        </Card>
    </div>
  );
};

export default ValidationPhrase;
