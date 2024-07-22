/* eslint-disable @typescript-eslint/no-explicit-any */
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
  setContentType?: any;
}

const AppendixContent = ({
  sectionDetails,
  contentType,
  setContentType,
}: IAppendixSectionProps): JSX.Element => {
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
            <ContentTypeConfirmation setContentType={setContentType} />
          ) : contentType === "list" ? (
            <SectionContent sectionNumber={1} ID={55} noActionBtns={true} />
          ) : (
            <RichText noActionBtns={true} />
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
        <DefaultButton text="Cancel" btnType="darkGreyVariant" />
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
    </>
  );
};

export default AppendixContent;
