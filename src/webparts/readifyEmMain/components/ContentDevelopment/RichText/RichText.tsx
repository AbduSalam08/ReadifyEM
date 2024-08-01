/* eslint-disable prefer-const */
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
  // AddAttachment,
  UpdateAttachment,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";
import { useNavigate } from "react-router-dom";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";

interface IRichTextProps {
  noActionBtns?: boolean;
  currentSectionData?: any;
  activeIndex?: any;
  setSectionData?: any;
  ID?: any;
  onChange?: any;
}

const RichText = ({
  currentSectionData,
  noActionBtns,
  activeIndex,
  setSectionData,
  ID,
  onChange,
}: IRichTextProps): JSX.Element => {
  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });
  const [sectionLoader, setSectionLoader] = useState(true);
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

  const navigate = useNavigate();
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

  // const [newAttachment, setNewAttachment] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");

  const _handleOnChange = (newText: string): string => {
    setDescription(newText === "<p><br></p>" ? "" : newText);
    onChange && onChange(newText === "<p><br></p>" ? "" : newText);
    return newText;
  };

  const readTextFileFromTXT = (data: any): void => {
    setSectionLoader(true);
    SpServices.SPReadAttachments({
      ListName: "SectionDetails",
      ListID: ID,
      AttachmentName: data?.FileName,
    })
      .then((res: any) => {
        console.log("res: ", res);
        const parsedValue: any = res ? JSON.parse(res) : "";
        if (typeof parsedValue === "string") {
          setDescription(parsedValue);
          onChange && onChange(parsedValue);
          setSectionLoader(false);
        } else {
          setSectionLoader(false);
        }
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  };

  const getSectionData = async (): Promise<any> => {
    setSectionLoader(true);
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
          currentSectionData?.contentType !== "list"
        ) {
          readTextFileFromTXT(filteredItem[0]);
          // setNewAttachment(false);
        } else {
          setSectionLoader(false);
        }
      })
      .catch((err) => {
        setSectionLoader(false);
        console.log(err);
      });
  };

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(description)], {
      type: "text/plain",
    });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    setSectionLoader(true);
    let addDataPromises: Promise<any>;
    const _file: any = await convertToTxtFile();
    // if (newAttachment) {
    //   addDataPromises = await AddAttachment(
    //     ID,
    //     _file,
    //     "paragraph",
    //     submissionType === "submit"
    //   );
    // } else {
    addDataPromises = await UpdateAttachment(
      ID,
      _file,
      "paragraph",
      submissionType === "submit",
      "Sample.txt"
    );
    Promise.all([addDataPromises])
      .then((res: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
          duration: 3000,
        });
      })
      .catch((err: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "error",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
      });
  };

  useEffect(() => {
    setSectionLoader(true);
    if (currentSectionData?.contentType === "paragraph") {
      getSectionData();
    }
  }, [ID]);

  return (
    <div
      style={{
        height: "88%",
      }}
    >
      {sectionLoader && !noActionBtns ? (
        <div className="contentDevLoaderWrapper">
          <CircularSpinner />
        </div>
      ) : (
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
      )}
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
                navigate(-1);
              }}
            />

            <DefaultButton
              text="Reset content"
              disabled={sectionLoader}
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
              disabled={sectionLoader}
              btnType="lightGreyVariant"
              onClick={async () => {
                await addData();
              }}
            />
            <DefaultButton
              text="Submit"
              disabled={sectionLoader}
              btnType="primary"
              onClick={async () => {
                await addData("submit");
              }}
            />
          </div>
        </div>
      )}
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />
    </div>
  );
};

export default RichText;
