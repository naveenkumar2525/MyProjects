import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MessageModule } from "../../../api";
import { selectedModule, setSelectedModule } from "../data/canvasSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import ModuleTypes from "../interfaces/module-types";

export type EditorInputProps = {
  label?: string | "";
  value?: string | "";
  labelIcon?: IconProp | undefined;
  onFormEditorChange?: (value: string) => void;
};

const RichTextEditor = (props: EditorInputProps) => {
  const dispatch = useAppDispatch();
  const currentSelectedModule = useAppSelector(selectedModule);
  const [messageModuleValue] = useState(
    (currentSelectedModule as MessageModule)?.text
  );
  const { label, labelIcon, value, onFormEditorChange } = props;

  return (
    <>
      {label && labelIcon ? (
        <div className="ml-2.5 flex">
          <FontAwesomeIcon icon={labelIcon} size="sm" /> &nbsp;
          <span className="font-proxima-light text-sm">{label}</span>
        </div>
      ) : (
        ""
      )}
      <Editor
        onEditorChange={(_text: string, editor) => {
          if (!currentSelectedModule) {
            throw new Error(`Module is not set`);
          }

          // Initially we will only support SMS so using configuring plain text only.
          const plainText = editor.getContent({ format: "text" });

          if (onFormEditorChange) {
            onFormEditorChange(plainText);
          } else {
            const newModule: MessageModule = {
              ...currentSelectedModule,
              text: plainText,
            };
            dispatch(setSelectedModule(newModule));
          }
        }}
        tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
        initialValue={value || messageModuleValue}
        init={{
          branding: false,
          height: 250,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            currentSelectedModule?.type === ModuleTypes.MESSAGE_MODULE
              ? "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist | " +
                "removeformat | code | help | addIALinkButton"
              : "bold italic forecolor alignleft aligncenter numlist link image",
          content_style:
            "body { font-family: Proxima Nova Bold; font-size:14px }" +
            "span.highlight-vars {background-color: black;color: #ffffff;padding: 1px;border: 1px solid transparent;border-radius: 4px;}",
          setup: (editor) => {
            editor.ui.registry.addButton("addIALinkButton", {
              // TODO: style the button
              // TODO: Add an icon before the text as shown in the design
              text: "Insert IA link",
              icon: "link",
              onAction: () => {
                editor.insertContent(
                  "<br><br>To continue, use this secure link: "
                );

                editor.insertContent(
                  "<span class='highlight-vars'>SessionUrl</span>&nbsp;"
                );

                // TODO: Emit an event that the session url has been added to this module
                // This event listener should take care of converting the message module to send IA module

                // TODO: While saving the content, the html around SessionUrl keyword should not be saved into the json
                // The html is purely indicating that it's a variable

                // TODO: What happens when we manually remove the SessionUrl text from the editor?
                // Should we keep a listener on the changes of the message module content?
              },
            });
          },
        }}
      />
    </>
  );
};

export default RichTextEditor;
