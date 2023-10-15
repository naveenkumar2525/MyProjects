export const getWindowSelectionRange = () => {
  if (window.getSelection) {
    const selection = window.getSelection();

    if (selection?.rangeCount) {
      return selection.getRangeAt(0);
    }
  }

  return null;
};

export const getTagPlaceholderStartIndex = (
  text: string,
  currentIndex: number
): number => {
  let startIndex = -1;

  for (let index = currentIndex; index >= 0; index -= 1) {
    if (!/[a-zA-Z0-9-_]/.test(text[index])) {
      /* eslint-disable-next-line max-depth */
      if (text[index] === "{" && text[index - 1] === "{") {
        startIndex = index - 1;
      }

      break;
    }
  }

  return startIndex;
};

export const getTagPlaceholderEndIndex = (
  text: string,
  startIndex: number
): number => {
  let endIndex = -1;

  if (startIndex === -1) {
    return endIndex;
  }

  for (let index = startIndex + 2; index < text.length; index += 1) {
    if (!/[a-zA-Z0-9-_]/.test(text[index])) {
      endIndex = index;
      break;
    } else if (index === text.length - 1) {
      endIndex = text.length;
    }
  }

  return endIndex;
};

export const getPlaceholderFromText = (
  text: string,
  currentIndex: number
): string => {
  const char = text[currentIndex] || "";
  const prevChar = text[currentIndex - 1] || "";

  if (char === "{" && prevChar === "{") {
    return text.substring(currentIndex - 1, currentIndex + 1);
  }

  const startIndex = getTagPlaceholderStartIndex(text, currentIndex);
  const endIndex = getTagPlaceholderEndIndex(text, startIndex);

  if (endIndex > -1) {
    return text.substring(startIndex, endIndex);
  }

  return "";
};

export const getPlaceholderFromInput = (): string => {
  const range = getWindowSelectionRange();

  if (!range) {
    return "";
  }

  const container = range.startContainer;
  const text = container.textContent || "";
  const currentIndex = range.startOffset - 1;

  return getPlaceholderFromText(text, currentIndex);
};
