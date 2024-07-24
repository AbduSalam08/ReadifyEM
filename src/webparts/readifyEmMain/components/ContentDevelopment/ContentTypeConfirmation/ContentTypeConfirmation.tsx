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
    </div>
  );
};

export default ContentTypeConfirmation;
