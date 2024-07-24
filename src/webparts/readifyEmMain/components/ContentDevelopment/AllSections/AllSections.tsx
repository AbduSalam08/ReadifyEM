/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AllSections.module.scss";
import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";
import StatusPill from "../../StatusPill/StatusPill";
const commentsIcon: any = require("../../../../../assets/images/svg/commentsIcon.svg");

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
        <span className={styles.sectionsTitle}>All Sections</span>
        <div
          className={styles.commentBox}
          onClick={() => selectSection(0, "View comments")}
        >
          comments <img src={commentsIcon} alt="comments icon" />
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
              <div className={styles.sectionList}>
                <span className={styles.sectionsName}>{item.sectionName}</span>
                {item.commentsCount !== 0 ? (
                  <span className={styles.commentCount}>
                    {item.commentsCount}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.sectionList}>
                {item?.assignedToUser ? (
                  <span className={styles.assignedText}>Assigned to you</span>
                ) : (
                  ""
                )}
                <div
                  style={{
                    marginLeft: "8px",
                  }}
                >
                  <MultiplePeoplePersona
                    data={[
                      ...(item.consultants || []),
                      ...(item.sectionAuthor || []),
                    ]}
                  />
                </div>
              </div>
              <div className={styles.sectionList}>
                {/* <span className={styles.statusSec}>{item.sectionStatus}</span> */}
                <StatusPill
                  status={item?.sectionStatus}
                  size="SM"
                  ontrackDot={true}
                />
                <span className={styles.visibleDateSec}>{item.dueDate}</span>
              </div>
            </div>
          ) : (
            <div className={styles.sectionDisabled} key={index}>
              <div className={styles.sectionList}>
                <span className={styles.sectionsName}>{item.sectionName}</span>
                <span className={styles.disableDateSec}>{item.dueDate}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default AllSections;
