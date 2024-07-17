/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./SectionBanner.module.scss";
const sampleDocHeaderImg: any = require("../../../../../assets/images/svg/sampleDocHeaderImg.svg");
interface Props {
  version: string;
  type: string;
  createDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
}

const SectionBanner: React.FC<Props> = ({
  version,
  type,
  createDate,
  lastReviewDate,
  nextReviewDate,
}) => {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img src={sampleDocHeaderImg} alt="doc header logo" />
        </div>
        <div className={styles.headerText}>
          <p>Welcome Abroad!</p>
          <span>Version : {version}</span>
        </div>
        <div className={styles.bannerSecWrapper}>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Type</span>
            <span className={styles.docDetailsSpan2}>{type}</span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Created on</span>
            <span className={styles.docDetailsSpan2}>{createDate}</span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Last review</span>
            <span className={styles.docDetailsSpan2}>{lastReviewDate}</span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Next review</span>
            <span className={styles.docDetailsSpan2}>{nextReviewDate}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionBanner;
