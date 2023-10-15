import { createContext } from "react";

export type CreateTagModalState = {
  show: boolean;
  onCreate: (newTag: Record<string, string>) => void;
};

export type SaveToTagModalState = {
  show: boolean;
  outputTag: Record<string, string> | null;
};

export type TagSelectionDropdownState = {
  show: boolean;
  onSelect: (newTag: Record<string, string>) => void;
};

export type TagsContextProps = {
  showNoMatch: boolean;
  setShowNoMatch: (show: boolean) => void;
  findTagPlaceholder: () => string;
  getTagPlaceholderReplacement: (placeholder: string) => string;
  createTagModalState: CreateTagModalState;
  setCreateTagModalState: React.Dispatch<
    React.SetStateAction<CreateTagModalState>
  >;
  saveToTagModalState: SaveToTagModalState;
  setSaveToTagModalState: React.Dispatch<
    React.SetStateAction<SaveToTagModalState>
  >;
  tagSelectionDropdownState: TagSelectionDropdownState;
  setTagSelectionDropdownState: React.Dispatch<
    React.SetStateAction<TagSelectionDropdownState>
  >;
};

export const tagsContextInitialState = {
  showNoMatch: false,
  setShowNoMatch: () => {},
  findTagPlaceholder: () => "",
  getTagPlaceholderReplacement: () => "",
  createTagModalState: {
    show: false,
    onCreate: () => {},
  },
  setCreateTagModalState: () => {},
  saveToTagModalState: {
    show: false,
    outputTag: null,
  },
  setSaveToTagModalState: () => {},
  tagSelectionDropdownState: {
    show: false,
    onSelect: () => {},
  },
  setTagSelectionDropdownState: () => {},
};

const TagsContext = createContext<TagsContextProps>(tagsContextInitialState);

export default TagsContext;
