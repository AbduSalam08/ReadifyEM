/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./Header.module.scss";
import DefaultButton from "../../common/Buttons/DefaultButton";
import StatusPill from "../../StatusPill/StatusPill";
const arrowBackBtn = require("../../../../../assets/images/svg/arrowBack.svg");
const locationIcon = require("../../../../../assets/images/svg/locationIcon.svg");
// const trackingPin = require("../../../../../assets/images/png/Track.png");

interface Props {
  documentName: string;
  role: any;
  documentStatus: any;
  onChange: (
    value: number | any,
    condition: boolean,
    popupTitle: string
  ) => void;
}

const Header: React.FC<Props> = ({
  documentName,
  role,
  documentStatus,
  onChange,
}) => {
  const selectSection = (index: number, title: string): any => {
    onChange(index, false, title);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerSec}>
          <button className={styles.backBtn}>
            <img src={arrowBackBtn} alt={"back to my tasks"} />
          </button>
          <h3 className={styles.headerTitle}>Content Developer</h3>
          <div className={styles.documentSec}>
            <h3>{documentName}</h3>
            <StatusPill size="SM" roles={role} />
            {/* <span>{role}</span> */}
          </div>
          <StatusPill size="MD" bordered={true} status={documentStatus} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <DefaultButton
            text="Track"
            btnType="secondary"
            endIcon={<img src={locationIcon} alt="track" />}
            onClick={() => selectSection(1, "Document Tracker")}
          />
          <DefaultButton
            text="View details"
            btnType="primary"
            onClick={() => selectSection(2, "Document Details")}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
