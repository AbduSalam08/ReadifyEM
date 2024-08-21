/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultButton from "../../common/Buttons/DefaultButton";
import ContentTypeConfirmation from "../ContentTypeConfirmation/ContentTypeConfirmation";
import RichText from "../RichText/RichText";
import SectionContent from "../SectionContent/SectionContent";
import SetupHeader from "../SetupHeader/SetupHeader";
import styles from "./AppendixContent.module.scss";
import {
  addAppendixHeaderAttachmentData,
  UpdateSectionAttachment,
} from "../../../../../utils/contentDevelopementUtils";
import {
  addRejectedComment,
  getAppendixHeaderSectionDetails,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import Popup from "../../common/Popups/Popup";
import SecondaryTextLabel from "../../common/SecondaryText/SecondaryText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
// import SpServices from "../../../../../services/SPServices/SpServices";
// import { LISTNAMES } from "../../../../../config/config";
interface IAppendixSectionProps {
  sectionDetails: any;
  contentType?: any;
  setSectionData?: any;
  activeIndex?: any;
  currentDocDetailsData?: any;
  isLoading?: boolean;
  currentDocRole?: any;
}

const AppendixContent = ({
  sectionDetails,
  contentType,
  setSectionData,
  activeIndex,
  currentDocDetailsData,
  isLoading,
  currentDocRole,
}: IAppendixSectionProps): JSX.Element => {
  console.log("currentDocDetailsData: ", currentDocDetailsData);
  console.log(
    "currentDocDetailsData.documentTemplateType: ",
    currentDocDetailsData.documentTemplateType
  );

  console.log("sectionDetails: ", sectionDetails);
  console.log("contentType: ", contentType);
  console.log("sectionDetails: ", sectionDetails);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  // const AllSectionsComments: any = useSelector(
  //   (state: any) => state.SectionCommentsData.SectionComments
  // );

  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionData.SectionComments
  );
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
      popupTitle: "Add New Definition",
      popupWidth: "550px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
  ];

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });

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

  const submitRejectedComment = async (): Promise<any> => {
    console.log(rejectedComments);
    debugger;
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
        sectionDetails?.ID,
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

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });
  const [sectionLoader, setSectionLoader] = useState(isLoading || false);

  const showActionBtns: boolean =
    currentDocDetailsData?.taskRole?.toLowerCase() !== "consultant" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "reviewer" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "approver" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "admin";

  const [inputValue, setInputValue] = useState<any>(null);
  console.log("inputValue: ", inputValue);
  const [headerImgDetails, setHeaderImgDetails] = useState<any>(null);
  console.log("headerImgDetails: ", headerImgDetails);

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(inputValue)], {
      type: "text/plain",
    });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    debugger;
    togglePopupVisibility(
      setPopupController,
      0,
      "close",
      "Are you sure want to submit this section?"
    );
    setSectionLoader(true);
    const _file: any = await convertToTxtFile();
    let sectionAttachmentCall: any;
    let appendixSectionAttachmentCall: any;
    if (_file) {
      sectionAttachmentCall = await UpdateSectionAttachment(
        sectionDetails?.ID,
        _file,
        sectionDetails?.contentType,
        submissionType === "submit",
        "Sample.txt",
        false,
        AllSectionsDataMain,
        dispatch
      );
    }
    if (headerImgDetails?.fileName !== "") {
      appendixSectionAttachmentCall = await addAppendixHeaderAttachmentData(
        submissionType,
        sectionDetails,
        headerImgDetails,
        headerImgDetails?.noContent || false
        // headerImgDetails?.fileData?.length === 0
      );
    }

    Promise.all([sectionAttachmentCall, appendixSectionAttachmentCall])
      .then(async (res: any) => {
        await getAppendixHeaderSectionDetails(
          sectionDetails?.ID,
          dispatch,
          sectionDetails?.sectionName
        );
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
          duration: 3000,
        });
        setSectionLoader(false);
      })
      .catch((err: any) => {
        console.log("err: ", err);
        setToastMessage({
          isShow: true,
          severity: "error",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
        setSectionLoader(false);
      });
  };

  useEffect(() => {
    getAppendixHeaderSectionDetails(
      sectionDetails?.ID,
      dispatch,
      sectionDetails?.sectionName
    );
    if (inputValue || headerImgDetails) {
      setSectionLoader(false);
    } else {
      setSectionLoader(true);
    }
    // getCurrentSectionType();
  }, [inputValue, headerImgDetails]);

  return (
    <>
      {!sectionLoader ? (
        <div className={styles.scrollableApxSection}>
          <SetupHeader
            currentDocRole={currentDocRole}
            type={currentDocDetailsData.documentTemplateType?.Title}
            headerTitle={currentDocDetailsData.documentName}
            appendixName={sectionDetails?.sectionName}
            version={currentDocDetailsData.version}
            sectionDetails={sectionDetails}
            appendixSection={true}
            primaryAuthorDefaultHeader={false}
            noActionBtns={true}
            onChange={(value: any) => {
              console.log("value: ", value);
              setHeaderImgDetails(value);
            }}
          />
          <div className={styles.appxContentWrapper}>
            <span className={styles.label}>Content</span>

            {contentType === "initial" ? (
              <ContentTypeConfirmation
                currentDocRole={currentDocRole}
                customWrapperClassName={styles.customInitialContent}
                activeIndex={activeIndex}
                noActionBtns={true}
                setSectionData={setSectionData}
                currentSectionData={sectionDetails}
                sectionID={sectionDetails?.ID}
              />
            ) : contentType === "list" ? (
              <SectionContent
                currentDocRole={currentDocRole}
                activeIndex={activeIndex}
                setSectionData={setSectionData}
                sectionNumber={sectionDetails?.sectionOrder}
                currentSectionDetails={sectionDetails}
                ID={sectionDetails?.ID}
                noActionBtns={true}
                onChange={(value: any) => {
                  setInputValue(value);
                }}
              />
            ) : (
              <RichText
                currentDocRole={currentDocRole}
                activeIndex={activeIndex}
                setSectionData={setSectionData}
                currentSectionData={sectionDetails}
                noActionBtns={true}
                ID={sectionDetails?.ID}
                onChange={(value: any) => {
                  setInputValue(value);
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="contentDevLoaderWrapper">
          <CircularSpinner />
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            paddingTop: "10px",
          }}
        >
          {sectionDetails?.sectionSubmitted && (
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

          {showActionBtns &&
            (currentDocRole?.primaryAuthor ||
              currentDocRole?.sectionAuthor) && (
              <>
                {currentDocRole?.primaryAuthor
                  ? sectionDetails?.sectionSubmitted && (
                      <DefaultButton
                        disabled={
                          sectionLoader && currentDocRole?.reviewer
                            ? sectionDetails?.sectionReviewed
                            : currentDocRole?.approver &&
                              sectionDetails?.sectionApprover &&
                              currentDocDetailsData?.documentStatus
                                ?.toLowerCase === "approved"
                        }
                        text="Rework"
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
                      <DefaultButton
                        disabled={
                          sectionLoader &&
                          currentDocDetailsData?.documentStatus?.toLowerCase ===
                            "approved"
                        }
                        text="Rework"
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

                {!sectionDetails?.sectionSubmitted &&
                  (currentDocRole?.sectionAuthor ||
                    currentDocRole?.primaryAuthor) && (
                    <>
                      <DefaultButton
                        disabled={sectionLoader}
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
                        disabled={sectionLoader}
                        text="Save and Close"
                        btnType="lightGreyVariant"
                        onClick={async () => {
                          await addData();
                        }}
                      />
                      <DefaultButton
                        disabled={sectionLoader}
                        text="Submit"
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
                    </>
                  )}
              </>
            )}
        </div>
      </div>
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
    </>
  );
};

export default AppendixContent;
