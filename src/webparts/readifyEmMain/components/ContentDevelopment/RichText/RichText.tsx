/* eslint-disable @typescript-eslint/no-use-before-define */
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
  addRejectedComment,
  // AddAttachment,
  UpdateAttachment,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";
import { useNavigate } from "react-router-dom";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecondaryTextLabel from "../../common/SecondaryText/SecondaryText";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import Popup from "../../common/Popups/Popup";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
import { useDispatch, useSelector } from "react-redux";

interface IRichTextProps {
  noActionBtns?: boolean;
  currentSectionData?: any;
  activeIndex?: any;
  setSectionData?: any;
  ID?: any;
  onChange?: any;
  currentDocRole?: any;
}

const RichText = ({
  currentSectionData,
  noActionBtns,
  activeIndex,
  setSectionData,
  ID,
  onChange,
  currentDocRole,
}: IRichTextProps): JSX.Element => {
  const dispatch = useDispatch();

  const initialPopupController = [
    {
      open: false,
      popupTitle: "Are you sure want to submit this section?",
      popupWidth: "340px",
      popupType: "confirmation",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "550px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
  ];
  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionCommentsData.SectionComments
  );
  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  const popupInputs: any[] = [
    [],
    [
      <CustomTextArea
        size="MD"
        labelText="Comments"
        withLabel
        icon={false}
        mandatory={true}
        textAreaWidth={"100%"}
        value={rejectedComments.rejectedComment}
        onChange={(value: any) => {
          setRejectedComments({
            ...rejectedComments,
            rejectedComment: value,
            IsValid: false,
          });
        }}
        placeholder="Enter Description"
        isValid={rejectedComments.IsValid}
        errorMsg={rejectedComments.ErrorMsg}
        key={2}
      />,
    ],
  ];

  const popupActions: any[] = [
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(0);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await addData("submit");
        },
      },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(1);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await submitRejectedComment();
        },
      },
    ],
  ];

  console.log("currentSectionData: ", currentSectionData);
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

  const submitRejectedComment = async (): Promise<any> => {
    console.log(rejectedComments);
    if (rejectedComments.rejectedComment?.trim() !== "") {
      setRejectedComments({
        ...rejectedComments,
        rejectedComment: "",
        IsValid: false,
        ErrorMsg: "",
      });
      await addRejectedComment(
        rejectedComments.rejectedComment,
        currentDocDetailsData,
        currentSectionData?.ID,
        handleClosePopup,
        setToastMessage,
        setToastMessage,
        currentUserDetails,
        AllSectionsComments,
        AllSectionsDataMain,
        dispatch
      );
    } else {
      setRejectedComments({
        ...rejectedComments,
        IsValid: true,
        ErrorMsg: "Please enter comments",
      });
    }
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
    togglePopupVisibility(
      setPopupController,
      0,
      "close",
      "Are you sure want to submit this section?"
    );
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
      "Sample.txt",
      AllSectionsDataMain,
      dispatch
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
          readOnly={currentSectionData?.sectionSubmitted}
          placeholder="Content goes here"
          className="customeRichText"
          onChange={(text) => {
            _handleOnChange(text);
          }}
        />
      )}
      {!noActionBtns ? (
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
            {currentSectionData?.sectionSubmitted && (
              <SecondaryTextLabel
                icon={
                  <AccessTimeIcon
                    style={{
                      width: "17px",
                    }}
                  />
                }
                text="yet to be reviewed"
              />
            )}

            <DefaultButton
              text="Close"
              btnType="darkGreyVariant"
              onClick={() => {
                navigate(-1);
              }}
            />

            {(currentDocRole?.primaryAuthor ||
              currentDocRole?.sectionAuthor) && (
              <>
                {(currentDocRole?.primaryAuthor ||
                  currentDocRole?.reviewer ||
                  currentDocRole?.approver) &&
                  currentSectionData?.sectionSubmitted && (
                    <DefaultButton
                      text="Reject"
                      disabled={sectionLoader}
                      btnType="secondaryRed"
                      onClick={() => {
                        togglePopupVisibility(
                          setPopupController,
                          1,
                          "open",
                          "Reason for rejection"
                        );
                      }}
                    />
                  )}

                {!currentSectionData?.sectionSubmitted && (
                  <>
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
                    {(currentDocRole?.sectionAuthor ||
                      currentDocRole?.primaryAuthor) && (
                      <DefaultButton
                        text="Submit"
                        disabled={sectionLoader}
                        btnType="primary"
                        onClick={() => {
                          // await addData("submit");
                          togglePopupVisibility(
                            setPopupController,
                            0,
                            "open",
                            "Are you sure want to submit this section?"
                          );
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : currentSectionData?.sectionType?.toLowerCase() !==
        "appendix section" ? (
        <DefaultButton
          text="Close"
          btnType="darkGreyVariant"
          onClick={() => {
            navigate(-1);
          }}
          style={{
            marginTop: "10px",
          }}
        />
      ) : (
        ""
      )}
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />
      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          // isLoading={sectionLoader}
          PopupType={popupData.popupType}
          onHide={() =>
            togglePopupVisibility(setPopupController, index, "close")
          }
          popupTitle={
            popupData.popupType !== "confimation" && popupData.popupTitle
          }
          popupActions={popupActions[index]}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={popupData.defaultCloseBtn || false}
          confirmationTitle={
            popupData.popupType !== "custom" ? popupData.popupTitle : ""
          }
          popupHeight={index === 0 ? true : false}
        />
      ))}
    </div>
  );
};

export default RichText;
