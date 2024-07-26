/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// css
import "./RichText.css";
import DefaultButton from "../../common/Buttons/DefaultButton";
import {
  AddAttachment,
  UpdateAttachment,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";

interface IRichTextProps {
  noActionBtns?: boolean;
  currentSectionData?: any;
  activeIndex?: any;
  setSectionData?: any;
  ID?: any;
}

const RichText = ({
  currentSectionData,
  noActionBtns,
  activeIndex,
  setSectionData,
  ID,
}: IRichTextProps): JSX.Element => {
  console.log("ID: ", ID);
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
  const [newAttachment, setNewAttachment] = useState<boolean>(true);

  const [description, setDescription] = useState<string>("");

  const _handleOnChange = (newText: string): string => {
    setDescription(newText === "<p><br></p>" ? "" : newText);
    return newText;
  };

  const readTextFileFromTXT = (data: any): void => {
    SpServices.SPReadAttachments({
      ListName: "SectionDetails",
      ListID: ID,
      AttachmentName: data?.FileName,
    })
      .then((res: any) => {
        const parsedValue: any = JSON.parse(res);
        setDescription(parsedValue);
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  };

  const getSectionData = async (): Promise<any> => {
    await SpServices.SPGetAttachments({
      Listname: LISTNAMES.SectionDetails,
      ID: ID,
    })
      .then((res: any) => {
        console.log("res: ", res);
        const filteredItem: any = res?.filter(
          (item: any) => item?.FileName === "Sample.txt"
        );
        if (
          filteredItem?.length !== 0 &&
          currentSectionData?.contentType === "paragraph"
        ) {
          readTextFileFromTXT(filteredItem[0]);
          setNewAttachment(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(description)], {
      type: "text/plain",
    });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    const _file: any = await convertToTxtFile();
    if (newAttachment) {
      await AddAttachment(ID, _file, "paragraph", submissionType === "submit");
    } else {
      await UpdateAttachment(
        ID,
        _file,
        "paragraph",
        submissionType === "submit"
      );
    }
  };

  useEffect(() => {
    if (currentSectionData?.contentType === "paragraph") {
      getSectionData();
    }
  }, []);

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
            justifyContent: "space-between",
            width: "100%",
            gap: "15px",
          }}
        >
          <button className={"helpButton"}>Help?</button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "15px",
            }}
          >
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
              text="Save and Close"
              btnType="lightGreyVariant"
              onClick={async () => {
                await addData();
              }}
            />
            <DefaultButton
              text="Submit"
              btnType="primary"
              onClick={async () => {
                await addData("submit");
              }}
            />
            {/* </> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichText;
