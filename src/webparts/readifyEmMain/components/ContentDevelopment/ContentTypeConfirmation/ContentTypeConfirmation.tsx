/* eslint-disable @typescript-eslint/no-explicit-any */
import DefaultButton from "../../common/Buttons/DefaultButton";
import styles from "./ContentTypeConfirmation.module.scss";

interface IContentTypeConfirmationProps {
  setSectionData?: any;
  customWrapperClassName?: any;
  activeIndex?: any;
}

const ContentTypeConfirmation = ({
  setSectionData,
  customWrapperClassName,
  activeIndex,
}: IContentTypeConfirmationProps): JSX.Element => {
  return (
    <div className={`${styles.initialContent} ${customWrapperClassName}`}>
      <div className={styles.contentTypeBox}>
        <span>Please select the content type</span>
        <div className={styles.actionsBtns}>
          <DefaultButton
            btnType="primary"
            text={"List"}
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
            btnType="primary"
            text={"Paragraph"}
            onClick={() => {
              setSectionData((prev: any) => {
                const updatedSections = [...prev];
                updatedSections[activeIndex] = {
                  ...updatedSections[activeIndex],
                  contentType: "paragraph",
                };
                return updatedSections;
              });
            }}
          />
        </div>
      </div>

      {/* {!noActionBtns && (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <button className={"helpButton"}>Help?</button>
          <div style={{ display: "flex", gap: "15px" }}>
            <DefaultButton
              text="Cancel"
              btnType="darkGreyVariant"
              onClick={() => {
                navigate(-1);
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
              onClick={() => {
                addData();
              }}
            />
            <DefaultButton
              text="Submit"
              btnType="primary"
              onClick={() => {
                addData("submit");
              }}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ContentTypeConfirmation;
