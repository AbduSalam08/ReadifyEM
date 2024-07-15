/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./Header.module.scss";
import DefaultButton from "../../common/Buttons/DefaultButton";
const arrowBackBtn = require("../../../../../assets/images/svg/arrowBack.svg");
// const trackingPin = require("../../../../../assets/images/png/Track.png");

interface Props {
  documentName: string;
  role: string;
  documentStatus: string;
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
  const selectSection = (index: number, title: string) => {
    onChange(index, false, title);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerSec}>
          <button
            className={styles.backBtn}
            // onClick={() => {
            //   navigate(-1);
            // }}
          >
            <img src={arrowBackBtn} alt={"back to my tasks"} />
          </button>
          <h3 className={styles.headerTitle}>Content Developer</h3>
          <div className={styles.documentSec}>
            <h3>{documentName}</h3>
            <span>{role}</span>
          </div>
          <span className={styles.documentStatus}>{documentStatus}</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <DefaultButton
            text="Track"
            btnType="lightGreyVariant"
            onClick={() => selectSection(1, "Document Tracker")}
            // iconComponent={<trackingPin />}
            // isIcon=
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
