/* eslint-disable no-debugger */
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
  addChangeRecord,
  // AddAttachment,
  UpdateAttachment,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";
import { useNavigate } from "react-router-dom";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import Popup from "../../common/Popups/Popup";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentLoggedPromoter,
  getCurrentPromoter,
  updateSectionDataLocal,
} from "../../../../../utils/contentDevelopementUtils";
import { setCDSectionData } from "../../../../../redux/features/ContentDevloperSlice";
import { ContentDeveloperStatusLabel } from "../../common/ContentDeveloperStatusLabel/ContentDeveloperStatusLabel";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import dayjs from "dayjs";
import CustomDateInput from "../../common/CustomInputFields/CustomDateInput";
import PreviewSection from "../PreviewSection/PreviewSection";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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
    {
      open: false,
      popupTitle: "Are you sure want to mark this section as reviewed?",
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
    {
      open: false,
      popupTitle: "",
      popupWidth: "950px",
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
  console.log("currentUserDetails: ", currentUserDetails);

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionData.SectionComments
  );

  const sectionChangeRecord: any = useSelector(
    (state: any) => state.SectionData.sectionChangeRecord
  );

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  // Change record state
  const [changeRecordDetails, setChangeRecordDetails] = useState<any>({
    author: sectionChangeRecord.changeRecordAuthor
      ? sectionChangeRecord.changeRecordAuthor
      : currentUserDetails,
    currentDate: dayjs(new Date(sectionChangeRecord.changeRecordModify)).format(
      "DD-MMM-YYYY hh:mm A"
    ),
    lastSubmitDate: "",
    Description: sectionChangeRecord.changeRecordDescription,
    IsValid: false,
    ErrorMsg: "",
  });

  const submitChangeRecord = async (): Promise<any> => {
    if (changeRecordDetails.Description?.trimStart() !== "") {
      await addChangeRecord(
        changeRecordDetails,
        currentSectionData?.ID,
        currentDocDetailsData.documentDetailsID,
        handleClosePopup,
        3,
        setToastMessage,
        setChangeRecordDetails,
        currentUserDetails,
        dispatch
      );
      setChangeRecordDetails({
        ...changeRecordDetails,
        IsValid: false,
        ErrorMsg: "",
      });
    } else {
      setChangeRecordDetails({
        ...changeRecordDetails,
        IsValid: true,
        ErrorMsg: "Please enter Description",
      });
    }
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
    [],
    [
      <div
        style={{ display: "flex", gap: "9px", flexDirection: "column" }}
        key={1}
      >
        <CustomDateInput
          size="MD"
          withLabel
          label="Last change date"
          readOnly
          value={changeRecordDetails.currentDate}
          key={1}
        />
        <CustomPeoplePicker
          size="MD"
          minWidth={"265px"}
          withLabel
          labelText="Author"
          // onChange={(value: any) => {
          //   handleOnChange(value, "referenceAuthor");
          // }}
          selectedItem={changeRecordDetails?.author?.email}
          placeholder="Add people"
          // isValid={
          //   definitionsData.referenceAuthor.length === 0 &&
          //   !definitionsData.IsValid
          // }
          errorMsg={"The reference author field is required"}
          readOnly
          key={2}
        />
        <CustomTextArea
          size="MD"
          labelText="Description"
          withLabel
          topLabel={true}
          icon={false}
          mandatory={true}
          rows={7}
          textAreaWidth={"100%"}
          // textAreaWidth={"67%"}
          value={changeRecordDetails.Description}
          onChange={(value: any) => {
            setChangeRecordDetails({
              ...changeRecordDetails,
              Description: value,
              IsValid: false,
            });
          }}
          placeholder="Enter Description"
          isValid={changeRecordDetails.IsValid}
          errorMsg={changeRecordDetails.ErrorMsg}
          key={3}
        />
      </div>,
    ],
    [
      <div key={1}>
        <span
          style={{
            display: "flex",
            paddingBottom: "15px",
            fontSize: "22px",
            fontFamily: "interMedium, sans-serif",
          }}
        >
          {currentSectionData.sectionOrder +
            ". " +
            currentSectionData.sectionName}
        </span>
        <PreviewSection
          sectionId={currentSectionData?.ID}
          sectionDetails={currentSectionData}
        />
      </div>,
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
    [
      {
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(2);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(2);
          await promoteSection();
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
          handleClosePopup(2);
          setChangeRecordDetails({
            ...changeRecordDetails,
            author: sectionChangeRecord.changeRecordAuthor
              ? sectionChangeRecord.changeRecordAuthor
              : currentUserDetails,
            Description: sectionChangeRecord.changeRecordDescription,
            currentDate: dayjs(
              new Date(sectionChangeRecord.changeRecordModify)
            ).format("DD-MMM-YYYY hh:mm A"),
            IsValid: false,
          });
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
          await submitChangeRecord();
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
          handleClosePopup(4);
        },
      },
    ],
  ];

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
  console.log("description: ", description);

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
      dispatch,
      currentDocDetailsData
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

  const docInReview: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in review";

  const docInApproval: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in approval";

  const promoteSection = async (): Promise<any> => {
    debugger;
    togglePopupVisibility(
      setPopupController,
      2,
      "close",
      "Are you sure want to submit this section?"
    );
    setSectionLoader(true);

    const promoters: any = docInReview
      ? currentDocDetailsData?.reviewers
      : docInApproval
      ? currentDocDetailsData?.approvers
      : [];

    console.log("promoters: ", promoters);

    const currentPromoter: any = getCurrentPromoter(promoters);
    console.log("currentPromoter: ", currentPromoter);

    const promoterKey: string = currentDocRole?.reviewer
      ? "sectionReviewed"
      : currentDocRole?.approver
      ? "sectionApproved"
      : "";

    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.SectionDetails,
      ID: currentSectionData?.ID,
      RequestJSON: {
        [`${promoterKey}`]: true,
        lastReviewedBy: JSON.stringify({
          currentOrder: currentPromoter?.currentOrder,
          currentPromoter: currentPromoter?.currentPromoter?.userData,
          totalPromoters: currentPromoter?.totalPromoters,
        }),
      },
    })
      .then((res: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
          duration: 3000,
        });

        const updatedSections: any = updateSectionDataLocal(
          AllSectionsDataMain,
          currentSectionData?.ID,
          {
            [`${promoterKey}`]: true,
            sectionRework: false,
            lastReviewedBy: {
              currentOrder: currentPromoter?.currentOrder,
              currentPromoter: currentPromoter?.userData,
              totalPromoters: currentPromoter?.totalPromoters,
            },
          }
        );
        console.log("updatedSections: ", updatedSections);

        dispatch(setCDSectionData([...updatedSections]));
      })
      .catch((err: any) => {
        console.log("err: ", err);
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "warn",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
      });
  };

  const loggerPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  console.log("loggerPromoter: ", loggerPromoter);

  useEffect(() => {
    setSectionLoader(true);
    if (currentSectionData?.contentType === "paragraph") {
      getSectionData();
    }
  }, [ID]);

  useEffect(() => {
    console.log(sectionChangeRecord);
    setChangeRecordDetails({
      ...changeRecordDetails,
      author: sectionChangeRecord.changeRecordAuthor
        ? sectionChangeRecord.changeRecordAuthor
        : currentUserDetails,
      Description: sectionChangeRecord.changeRecordDescription,
      currentDate: dayjs(
        new Date(sectionChangeRecord.changeRecordModify)
      ).format("DD-MMM-YYYY hh:mm A"),
    });
  }, [sectionChangeRecord.changeRecordDescription]);

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
          readOnly={
            !currentSectionData?.sectionSubmitted &&
            (currentDocRole?.sectionAuthor || currentDocRole?.primaryAuthor)
              ? false
              : true
          }
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
            {ContentDeveloperStatusLabel(
              currentSectionData?.sectionSubmitted,
              currentSectionData?.sectionReviewed,
              currentSectionData?.sectionApproved,
              currentSectionData?.sectionRework,
              currentDocDetailsData,
              currentDocRole,
              loggerPromoter
            )}

            <DefaultButton
              text={<CloseIcon sx={{ Padding: "0px" }} />}
              btnType="darkGreyVariant"
              title="Close"
              onlyIcon={true}
              onClick={() => {
                navigate(-1);
              }}
            />
            {!currentSectionData?.sectionSubmitted &&
              (currentDocRole?.sectionAuthor ||
                currentDocRole?.primaryAuthor) && (
                <>
                  <DefaultButton
                    text={<RestartAltIcon />}
                    onlyIcon={true}
                    title="Reset Content"
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
                </>
              )}
            <DefaultButton
              text="Preview"
              btnType="secondaryBlue"
              onClick={() => {
                togglePopupVisibility(setPopupController, 4, "open", "Preview");
              }}
            />

            {currentDocDetailsData?.version !== "1.0" &&
              !currentDocRole?.reviewer &&
              !currentDocRole?.consultant &&
              !currentDocRole?.approver &&
              !currentSectionData?.sectionSubmitted && (
                <DefaultButton
                  text="Change record"
                  btnType="primaryGreen"
                  onClick={() => {
                    togglePopupVisibility(
                      setPopupController,
                      3,
                      "open",
                      "Change record"
                    );
                  }}
                />
              )}

            {(currentDocRole?.primaryAuthor ||
              currentDocRole?.sectionAuthor ||
              currentDocRole?.reviewer ||
              currentDocRole?.approver) && (
              <>
                {currentDocRole?.primaryAuthor
                  ? currentSectionData?.sectionSubmitted && (
                      <DefaultButton
                        text="Rework"
                        disabled={
                          !["in development", "approved"].includes(
                            currentDocDetailsData?.documentStatus?.toLowerCase()
                          )
                        }
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
                    )
                  : (currentDocRole?.reviewer || currentDocRole?.approver) && (
                      <>
                        {
                          <DefaultButton
                            text={
                              currentDocRole?.reviewer
                                ? "Review"
                                : currentDocRole?.approver && "Approve"
                            }
                            disabled={
                              !sectionLoader &&
                              currentSectionData?.sectionSubmitted &&
                              !currentSectionData?.sectionRework &&
                              ((currentDocRole?.reviewer &&
                                !currentSectionData?.sectionReviewed) ||
                                (currentDocRole?.approver &&
                                  !currentSectionData?.sectionApproved)) &&
                              loggerPromoter?.status !== "completed"
                                ? false
                                : true
                            }
                            btnType="primary"
                            onClick={() => {
                              togglePopupVisibility(
                                setPopupController,
                                2,
                                "open",
                                `Are you sure want to mark this section as ${
                                  currentDocRole?.reviewer
                                    ? "reviewed"
                                    : currentDocRole?.approver && "approved"
                                }?`
                              );
                            }}
                          />
                        }

                        <DefaultButton
                          text="Rework"
                          disabled={
                            !sectionLoader &&
                            loggerPromoter?.status !== "completed"
                              ? false
                              : true
                          }
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
                      </>
                    )}

                {!currentSectionData?.sectionSubmitted &&
                  (currentDocRole?.sectionAuthor ||
                    currentDocRole?.primaryAuthor) && (
                    <>
                      <DefaultButton
                        text="Save"
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
      ) : (
        currentSectionData?.sectionType?.toLowerCase() !==
          "appendix section" && (
          <DefaultButton
            text={<CloseIcon sx={{ Padding: "0px" }} />}
            title="Close"
            onlyIcon={true}
            btnType="darkGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
            style={{
              marginTop: "10px",
            }}
          />
        )
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
