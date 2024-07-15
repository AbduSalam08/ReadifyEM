import styles from "./SectionBanner.module.scss";

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
        <div>logo</div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "10px" }}>Welcome Abroad!</h1>
          <span style={{ color: "#b6b6b8" }}>Version : {version}</span>
        </div>
        <div>
          <div className={styles.bannerSec}>
            <span>Type</span>
            <span>{type}</span>
          </div>
          <div className={styles.bannerSec}>
            <span>Creatde on</span>
            <span>{createDate}</span>
          </div>
          <div className={styles.bannerSec}>
            <span>Last review</span>
            <span>{lastReviewDate}</span>
          </div>
          <div className={styles.bannerSec}>
            <span>Next review</span>
            <span>{nextReviewDate}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionBanner;
