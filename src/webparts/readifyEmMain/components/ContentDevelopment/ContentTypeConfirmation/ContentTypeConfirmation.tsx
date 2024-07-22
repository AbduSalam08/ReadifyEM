/* eslint-disable @typescript-eslint/no-explicit-any */
import DefaultButton from "../../common/Buttons/DefaultButton";
import styles from "./ContentTypeConfirmation.module.scss";

interface IContentTypeConfirmationProps {
  setContentType?: any;
}

const ContentTypeConfirmation = ({
  setContentType,
}: IContentTypeConfirmationProps): JSX.Element => {
  return (
    <div className={styles.initialContent}>
      <div className={styles.contentTypeBox}>
        <span>Please select the content type</span>
        <div className={styles.actionsBtns}>
          <DefaultButton
            btnType="primary"
            text={"List"}
            onClick={() => {
              setContentType("list");
            }}
          />
          <DefaultButton
            btnType="primary"
            text={"Paragraph"}
            onClick={() => {
              setContentType("paragraph");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentTypeConfirmation;
