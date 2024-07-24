/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import DefaultButton from "../../common/Buttons/DefaultButton";
import ContentTypeConfirmation from "../ContentTypeConfirmation/ContentTypeConfirmation";
import RichText from "../RichText/RichText";
import SectionContent from "../SectionContent/SectionContent";
import SetupHeader from "../SetupHeader/SetupHeader";
import styles from "./AppendixContent.module.scss";

// local interfaces
interface IAppendixSectionProps {
  sectionDetails: any;
  contentType?: any;
  setSectionData?: any;
  activeIndex?: any;
  currentDocDetailsData?: any;
}

const AppendixContent = ({
  sectionDetails,
  contentType,
  setSectionData,
  activeIndex,
  currentDocDetailsData,
}: IAppendixSectionProps): JSX.Element => {
  const navigate = useNavigate();
  console.log("sectionDetails: ", sectionDetails);

  const showActionBtns: boolean =
    currentDocDetailsData?.taskRole?.toLowerCase() !== "consultant" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "reviewer" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "approver" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "admin";

  return (
    <>
      <div className={styles.scrollableApxSection}>
        <SetupHeader
          version={sectionDetails.version}
          type={sectionDetails.type}
          headerTitle={sectionDetails.headerTitle}
          primaryAuthorDefaultHeader={false}
          noActionBtns={true}
        />
        <div className={styles.appxContentWrapper}>
          <span className={styles.label}>Content</span>

          {contentType === "initial" ? (
            <ContentTypeConfirmation
              customWrapperClassName={styles.customInitialContent}
              activeIndex={activeIndex}
              setSectionData={setSectionData}
            />
          ) : contentType === "list" ? (
            <SectionContent
              activeIndex={activeIndex}
              setSectionData={setSectionData}
              sectionNumber={1}
              ID={55}
              noActionBtns={true}
            />
          ) : (
            <RichText
              activeIndex={activeIndex}
              setSectionData={setSectionData}
              noActionBtns={true}
            />
          )}
        </div>
      </div>
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
        {showActionBtns && (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default AppendixContent;
