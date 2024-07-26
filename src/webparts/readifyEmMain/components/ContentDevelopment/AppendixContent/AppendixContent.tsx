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

  const showActionBtns: boolean =
    currentDocDetailsData?.taskRole?.toLowerCase() !== "consultant" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "reviewer" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "approver" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "admin";

  return (
    <>
      <div className={styles.scrollableApxSection}>
        <SetupHeader
          type={currentDocDetailsData.documentType}
          headerTitle={currentDocDetailsData.documentName}
          appendixName={sectionDetails?.sectionName}
          version={currentDocDetailsData.version}
          appendixSection={true}
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
              ID={sectionDetails?.ID}
              noActionBtns={true}
            />
          ) : (
            <RichText
              activeIndex={activeIndex}
              setSectionData={setSectionData}
              currentSectionData={sectionDetails}
              noActionBtns={true}
              ID={sectionDetails?.ID}
            />
          )}
        </div>
      </div>
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
                  // addData();
                }}
              />
              <DefaultButton
                text="Submit"
                btnType="primary"
                onClick={() => {
                  // addData();
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppendixContent;
