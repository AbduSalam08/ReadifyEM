/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
// import { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "./ContentEditor.css";
// const ImageResize = require("quill-image-resize-module-react");

// Quill.register("modules/imageResize", ImageResize);
//Text direction
Quill.register(Quill.import("attributors/style/direction"), true);
//Alignment
Quill.register(Quill.import("attributors/style/align"), true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["0.75em", "1em", "1.5em", "2.5em"];
Quill.register(Size, true);

const ColorClass: any = Quill.import("attributors/class/color");
const ColorStyle: any = Quill.import("attributors/style/color");

ColorStyle.whitelist = ["black", "red", "orange", "yellow", "green", "blue"];

Quill.register(ColorClass, true);
Quill.register(ColorStyle, true);

interface EditorProps {
  placeholder: string;
  setEditorHtml: any;
  editorHtmlValue: any;
  readOnly?: boolean;
}
import "react-quill/dist/quill.bubble.css";

const ContentEditor: React.FC<EditorProps> = ({
  placeholder,
  setEditorHtml,
  editorHtmlValue,
  readOnly,
}) => {
  const handleChange = (html: string, b: any, c: any, d: any) => {
    if (html) {
      setEditorHtml(html);
    }
  };
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      ["image"],
      // ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [
        { color: ["black", "red", "orange", "yellow", "green", "blue"] },
        { background: ["black", "red", "orange", "yellow", "green", "blue"] },
      ],
      ["clean"],
    ],
    // clipboard: {
    //   matchVisual: false,
    // },
    // imageResize: {
    //   parchment: Quill.import("parchment"),
    //   modules: ["Resize", "DisplaySize"],
    // },
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "image",
    "color",
    "background",
    "header",
    "list",
    // "link",
    "align",
  ];

  return (
    <ReactQuill
      readOnly={readOnly}
      theme="bubble"
      className="quillWrap"
      onChange={handleChange}
      value={editorHtmlValue}
      modules={modules}
      formats={formats}
      bounds={`[data-text-editor="form-editor"]`}
      placeholder={placeholder}
    />
  );
};

export default ContentEditor;
