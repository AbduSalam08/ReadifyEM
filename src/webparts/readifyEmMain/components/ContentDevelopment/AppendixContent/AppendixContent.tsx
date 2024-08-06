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
import { getAppendixHeaderSectionDetails } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch } from "react-redux";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
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
  console.log("contentType: ", contentType);
  console.log("sectionDetails: ", sectionDetails);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        "Sample.txt"
      );
    }
    if (headerImgDetails?.fileName !== "") {
      appendixSectionAttachmentCall = await addAppendixHeaderAttachmentData(
        submissionType,
        sectionDetails,
        headerImgDetails
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

  // const getCurrentSectionType = async (): Promise<void> => {
  //   await SpServices.SPReadItemUsingId({
  //     Listname: LISTNAMES.SectionDetails,
  //     SelectedId: sectionDetails?.ID,
  //     Select: "*,documentOf/ID",
  //     Expand: "documentOf",
  //   })
  //     .then((res: any) => {
  //       console.log("res: ", res);
  //       setSectionData((prev: any) => {
  //         const updatedSections = [...prev];
  //         updatedSections[activeIndex] = {
  //           ...updatedSections[activeIndex],
  //           contentType: res?.typeOfContent,
  //         };
  //         return updatedSections;
  //       });
  //     })
  //     .catch((err: any) => {
  //       console.log("err: ", err);
  //     });
  // };

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
            type={currentDocDetailsData.documentType}
            headerTitle={currentDocDetailsData.documentName}
            appendixName={sectionDetails?.sectionName}
            version={currentDocDetailsData.version}
            sectionDetails={sectionDetails}
            appendixSection={true}
            primaryAuthorDefaultHeader={false}
            noActionBtns={true}
            onChange={(value: any) => {
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
          <DefaultButton
            text="Close"
            btnType="darkGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
          />
          {(showActionBtns && currentDocRole?.primaryAuthor) ||
          currentDocRole?.sectionAuthor ? (
            <>
              {currentDocRole?.primaryAuthor ? (
                <DefaultButton
                  disabled={sectionLoader}
                  text="Reject"
                  btnType="secondaryRed"
                  onClick={() => {
                    console.log("rejected");
                  }}
                />
              ) : (
                ""
              )}
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
              {currentDocRole?.sectionAuthor ? (
                <DefaultButton
                  disabled={sectionLoader}
                  text="Submit"
                  btnType="primary"
                  onClick={async () => {
                    await addData("submit");
                  }}
                />
              ) : (
                ""
              )}
            </>
          ) : (
            ""
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
    </>
  );
};

export default AppendixContent;
