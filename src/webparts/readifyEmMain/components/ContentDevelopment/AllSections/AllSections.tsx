/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AllSections.module.scss";
import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";
import StatusPill from "../../StatusPill/StatusPill";
import { useSelector } from "react-redux";
import { ChevronRight } from "@mui/icons-material";
const commentsIcon: any = require("../../../../../assets/images/svg/commentsIcon.svg");

interface Props {
  data: any;
  activeSection: number;
  currentDocDetailsData: any;
  currentDocRole?: any;
  onChange: (
    value: number | any,
    condition: boolean,
    popupTitle: string
  ) => void;
}

const AllSections: React.FC<Props> = ({
  activeSection,
  data,
  onChange,
  currentDocDetailsData,
  currentDocRole,
}) => {
  console.log("currentDocRole: ", currentDocRole);
  console.log("currentDocDetailsData: ", currentDocDetailsData);
  console.log("data: ", data);

  const selectSection = (index: number, type: string): any => {
    if (type === "View comments") {
      onChange(index, false, "Promoted Comments");
    } else {
      onChange(index, true, "");
    }
  };

  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );
  console.log("currentUserDetails: ", currentUserDetails);

  const updateStatusCount = (itemStatus: string, newCount: number): string => {
    // Check if the status string includes either "review in progress" or "approval in progress"
    if (
      itemStatus.toLowerCase().includes("yet to be reviewed") ||
      itemStatus.toLowerCase().includes("yet to be approved")
    ) {
      // Split the status to get the current counts
      const parts = itemStatus.split("(");
      if (parts.length > 1) {
        const countPart = parts[1].split("/");
        if (countPart.length > 1) {
          // Update the last count with the newCount
          countPart[1] = `${newCount})`;
          // Reconstruct the status string
          return `${parts[0]}(${countPart.join("/")}`;
        }
      }
    }
    // Return the original status if the conditions are not met
    return itemStatus;
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
          console.log("item: ", item);

          return item?.sectionType === "header section" &&
            currentDocRole?.primaryAuthor ? (
            <div
              className={`${styles.sectionVisible} ${
                activeSection === index ? styles.activeSection : ""
              }`}
              key={index}
              onClick={() => selectSection(index, "Select section")}
            >
              <div className={styles.sectionList}>
                <span className={styles.sectionsName} title={item.sectionName}>
                  {item.sectionName}
                </span>
              </div>
              <div className={styles.sectionList}>
                <span className={styles.assignedText}>Assigned to you</span>
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
            </div>
          ) : item?.sectionType !== "header section" &&
            item.sectionPermission ? (
            <div
              className={`${styles.sectionVisible} ${
                activeSection === index ? styles.activeSection : ""
              }`}
              key={index}
              onClick={() => selectSection(index, "Select section")}
            >
              <div className={styles.sectionList}>
                <span className={styles.sectionsName} title={item.sectionName}>
                  {item.sectionName}
                </span>
                {item.commentsCount !== 0 && (
                  <span className={styles.commentCount}>
                    {item?.commentsCount && Number(item?.commentsCount) > 9
                      ? "9+"
                      : item.commentsCount}
                  </span>
                )}
              </div>
              <div className={styles.sectionList}>
                {item?.assignedToUser && (
                  <span className={styles.assignedText}>Assigned to you</span>
                )}
                {/* {currentDocRole?.primaryAuthor
                  ? item?.sectionType?.toLowerCase() === "header section" &&
                    currentDocDetailsData?.primaryAuthor?.email ===
                      currentUserDetails?.email && (
                      <span className={styles.assignedText}>
                        Assigned to you
                      </span>
                    )
                  : item?.assignedToUser && (
                      <span className={styles.assignedText}>
                        Assigned to you
                      </span>
                    )} */}

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
              {item.sectionName !== "Header" && (
                <div className={styles.sectionList}>
                  {/* <span className={styles.statusSec}>{item.sectionStatus}</span> */}
                  <StatusPill
                    status={
                      item?.sectionStatus
                        ?.toLowerCase()
                        ?.includes("yet to be reviewed")
                        ? "Review in progress"
                        : item?.sectionStatus
                    }
                    dynamicText={
                      item?.sectionStatus
                        ?.toLowerCase()
                        ?.includes("yet to be reviewed")
                        ? updateStatusCount(
                            item?.sectionStatus,
                            currentDocDetailsData?.reviewers?.length
                          )
                        : item?.sectionStatus
                            ?.toLowerCase()
                            ?.includes("approval in progress")
                        ? updateStatusCount(
                            item?.sectionStatus,
                            currentDocDetailsData?.approvers?.length
                          )
                        : ""
                    }
                    size="SM"
                    ontrackDot={true}
                  />
                  <div
                    className={styles.flexCenter}
                    style={{
                      marginTop: "5px",
                    }}
                  >
                    <span className={styles.visibleDateSec}>
                      {item.dueDate}
                    </span>
                    <ChevronRight
                      style={{
                        color: "#160364",
                        backgroundColor: "#E2EEFF",
                        borderRadius: "3px",
                        fontSize: "17px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : item?.sectionType !== "header section" &&
            !currentDocRole?.primaryAuthor &&
            !item.sectionPermission ? (
            <div className={styles.sectionDisabled} key={index}>
              <div className={styles.sectionList}>
                <span className={styles.sectionsName} title={item.sectionName}>
                  {item.sectionName}
                </span>
                <span className={styles.disableDateSec}>{item.dueDate}</span>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.sectionVisible} ${
                activeSection === index ? styles.activeSection : ""
              }`}
              key={index}
              onClick={() => selectSection(index, "Select section")}
            >
              <div className={styles.sectionList}>
                <span className={styles.sectionsName} title={item.sectionName}>
                  {item.sectionName}
                </span>
              </div>
              <div className={styles.sectionList}>
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
            </div>
          );
        })}
    </div>
  );
};
export default AllSections;
