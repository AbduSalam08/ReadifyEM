/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
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
import { useRef } from "react";

const ContentEditor: React.FC<EditorProps> = ({
  placeholder,
  setEditorHtml,
  editorHtmlValue,
  readOnly,
}) => {
  const quillRef = useRef<any>(null);
  const handleChange = async (
    html: string,
    delta: any,
    source: any,
    editor: any
  ) => {
    console.log("html", html);
    console.log("delta", delta);
    console.log("source", source);
    console.log("editor", editor);
    debugger;
    const quill = quillRef.current.getEditor();

    const currentContents = quill.getContents();
    let cumulativeIndex = 0;

    for (let i = 0; i < currentContents.ops.length; i++) {
      const op = currentContents.ops[i];
      if (op.insert && op.insert.image) {
        const imgSrc = op.insert.image;
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        if (blob.size > 1 * 1024 * 1024 || blob.size < 500 * 1024) {
          // 1MB limit
          // Remove the large image from the editor's content
          quill.deleteText(cumulativeIndex, 1);
          alert(
            "Image size is either too large (over 1MB) or too small (below 500KB) and has been removed."
          );
          cumulativeIndex -= 1;
        } else {
          // Get the image element and set its size to 300px by 300px
          const imageElement = quill.container.querySelector(
            `img[src="${imgSrc}"]`
          );
          if (imageElement) {
            imageElement.style.width = "400px";
            imageElement.style.height = "400px";
          }
        }
      }

      // Update the cumulative index for each op
      cumulativeIndex += op.insert
        ? typeof op.insert === "string"
          ? op.insert.length
          : 1
        : 0;
    }

    setEditorHtml(editor.getHTML());
    console.log("editor", editor.getHTML());
    // setEditorHtml(editor.getHTML());
    // if (html) {
    //   setEditorHtml(html);
    // }
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
      ref={quillRef}
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
