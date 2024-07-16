/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AllSections.module.scss";
import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";

interface Props {
  data: any;
  activeSection: number;
  onChange: (
    value: number | any,
    condition: boolean,
    popupTitle: string
  ) => void;
}

const AllSections: React.FC<Props> = ({ activeSection, data, onChange }) => {
  console.log(data);

  const selectSection = (index: number, type: string): any => {
    if (type === "View comments") {
      onChange(index, false, "Promoted Comments");
    } else {
      onChange(index, true, "");
    }
  };

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h3>All Sections</h3>
        <div
          className={styles.commentBox}
          onClick={() => selectSection(0, "View comments")}
        >
          comments
        </div>
      </div>
      {data.length > 0 &&
        data?.map((item: any, index: number) => {
          return item.sectionPermission ? (
            <div
              className={`${styles.sectionVisible} ${
                activeSection === index ? styles.activeSection : ""
              }`}
              key={index}
              onClick={() => selectSection(index, "Select section")}
            >
              <div
                className={styles.sectionList}
                style={{ marginBottom: "10px" }}
              >
                <h3>{item.sectionName}</h3>
                <span className={styles.commentCount}>
                  {item.commentsCount}
                </span>
              </div>
              <div
                className={styles.sectionList}
                style={{ marginBottom: "10px" }}
              >
                <span style={{ fontSize: "14px", color: "#ADADAD" }}>
                  Assigned to you
                </span>
                <div style={{ marginRight: "55px" }}>
                  <MultiplePeoplePersona
                    data={item.sectionPersons}
                    positionLeft={15}
                  />
                </div>
              </div>
              <div className={styles.sectionList}>
                <span className={styles.statusSec}>{item.sectionStatus}</span>
                <span className={styles.visibleDateSec}>{item.updateDate}</span>
              </div>
            </div>
          ) : (
            <div className={styles.sectionDisabled} key={index}>
              <div className={styles.sectionList}>
                <h3>{item.sectionName}</h3>
                <span className={styles.disableDateSec}>{item.updateDate}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default AllSections;
