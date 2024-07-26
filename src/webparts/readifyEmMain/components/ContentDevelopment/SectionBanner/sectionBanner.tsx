/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./SectionBanner.module.scss";
const sampleDocHeaderImg: any = require("../../../../../assets/images/svg/sampleDocHeaderImg.svg");
interface Props {
  sectionID: string;
  currentDocDetails: any;
  appendixHeader: any;
  secondaryTitle?: any;
}

const SectionBanner: React.FC<Props> = ({
  sectionID,
  currentDocDetails,
  appendixHeader,
  secondaryTitle,
}) => {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img src={sampleDocHeaderImg} alt="doc header logo" />
        </div>
        <div className={styles.headerText}>
          <p>{currentDocDetails?.documentName || "-"}</p>
          <span>
            {`${
              !appendixHeader
                ? `Version: ${currentDocDetails.version || "-"}`
                : secondaryTitle
            }`}
          </span>
        </div>
        <div className={styles.bannerSecWrapper}>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Type</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.documentType || "-"}
            </span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Created on</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.createdDate || "-"}
            </span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Last review</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.lastReviewDate || "-"}
            </span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Next review</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.nextReviewDate || "-"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionBanner;
