import {
  useState,
  FocusEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import TagsContext from "../../../../tags/Context";

export type TextInputProps = {
  type?: string | "";
  label?: string | "";
  placeholder?: string;
  defaultValue?: string | "";
  onChange?: (event: ContentEditableEvent) => void;
  onBlur?: (event?: FocusEvent<HTMLDivElement>) => void;
};

const TextInput = (props: TextInputProps) => {
  const {
    label = "Text input",
    placeholder = "Provide a field label",
    defaultValue = "",
    onBlur,
    onChange,
  } = props;
  const [value, setValue] = useState(defaultValue);
  const {
    setTagSelectionDropdownState,
    setCreateTagModalState,
    findTagPlaceholder,
    getTagPlaceholderReplacement,
  } = useContext(TagsContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tagPlaceholder = findTagPlaceholder();

    if (tagPlaceholder.length) {
      setTagSelectionDropdownState((prevState) => ({
        ...prevState,
        onSelect: (newTag: Record<string, string>) => {
          setValue(
            value.replace(
              tagPlaceholder,
              getTagPlaceholderReplacement(newTag.desc)
            )
          );

          inputRef.current?.focus();
        },
      }));

      setCreateTagModalState((prevState) => ({
        ...prevState,
        onCreate: (newTag: Record<string, string>) => {
          setValue(
            value.replace(
              tagPlaceholder,
              getTagPlaceholderReplacement(newTag.desc)
            )
          );

          inputRef.current?.focus();
        },
      }));
    }
  }, [value]);

  const handleChange = useCallback((event: ContentEditableEvent) => {
    setValue(event.target.value);
  }, []);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      setTimeout(() => {
        setValue(
          sanitizeHtml(event.target.innerHTML, {
            allowedTags: ["span", "svg", "path"],
            allowedAttributes: { span: ["*"], svg: ["*"], path: ["*"] },
            nestingLimit: 6,
          })
        );
      }, 100);
    },
    [value]
  );

  return (
    <>
      <div>
        <span className="ushur-label form-label">{label}</span>
      </div>
      {/* commented the extra class to avoid the border issue: `h-auto pb-0 pt-0`  */}
      <div
        className="ushur-input form-control overflow-hidden w-100"
        style={{ paddingRight: "2.375rem" }}
      >
        <ContentEditable
          data-testid="textInput"
          className="inline-block overflow-hidden w-100 whitespace-nowrap"
          style={{
            display: "inline-block",
            overflow: "hidden",
            lineHeight: "calc(32px - 0.75rem)",
            width: "100%",
          }}
          html={value}
          title={placeholder}
          placeholder={placeholder}
          suppressContentEditableWarning
          onChange={(event: ContentEditableEvent) => {
            handleChange(event);

            if (onChange) {
              onChange(event);
            }
          }}
          onBlur={(event: FocusEvent<HTMLDivElement>) => {
            handleBlur(event);

            if (onBlur) {
              onBlur(event);
            }
          }}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        />
      </div>
    </>
  );
};

export default TextInput;
