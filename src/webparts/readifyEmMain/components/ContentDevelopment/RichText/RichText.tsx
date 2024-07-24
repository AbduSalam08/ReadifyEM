/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// css
import "./RichText.css";
import DefaultButton from "../../common/Buttons/DefaultButton";

interface IRichTextProps {
  noActionBtns?: boolean;
  activeIndex?: any;
  setSectionData?: any;
}

const RichText = ({
  noActionBtns,
  activeIndex,
  setSectionData,
}: IRichTextProps): JSX.Element => {
  const modules: any = {
    toolbar: [
      [
        {
          header: [1, 2, 3, false],
        },
      ],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        {
          color: [],
        },
        {
          background: [],
        },
      ],
      [
        {
          list: "ordered",
        },
        {
          list: "bullet",
        },
        {
          indent: "-1",
        },
        {
          indent: "+1",
        },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats: string[] = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "background",
    "color",
  ];

  const [description, setDescription] = useState<string>("");
  console.log("description: ", description);

  const _handleOnChange = (newText: string): string => {
    setDescription(newText === "<p><br></p>" ? "" : newText);
    return newText;
  };

  return (
    <div
      style={{
        height: "88%",
      }}
    >
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={description}
        placeholder="Content goes here"
        className="customeRichText"
        onChange={(text) => {
          _handleOnChange(text);
        }}
      />
      {!noActionBtns && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "15px",
          }}
        >
          <DefaultButton
            text="Reset content"
            btnType="secondaryRed"
            onClick={() => {
              setSectionData((prev: any) => {
                const updatedSections = [...prev];
                updatedSections[activeIndex] = {
                  ...updatedSections[activeIndex],
                  contentType: "initial",
                };
                return updatedSections;
              });
            }}
          />
          <DefaultButton
            text="Cancel"
            btnType="darkGreyVariant"
            onClick={() => {
              setSectionData((prev: any) => {
                const updatedSections = [...prev];
                updatedSections[activeIndex] = {
                  ...updatedSections[activeIndex],
                  contentType: "list",
                };
                return updatedSections;
              });
            }}
          />
          <DefaultButton
            text="Save and Close"
            btnType="lightGreyVariant"
            onClick={() => {
              // _addData();
            }}
          />
          <DefaultButton
            text="Submit"
            btnType="primary"
            onClick={() => {
              // _addData();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RichText;
