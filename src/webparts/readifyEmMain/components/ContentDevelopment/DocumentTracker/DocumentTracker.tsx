/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./DocumentTracker.module.scss";
import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";
const checkMark = require("../../../../../assets/images/png/checkMarkBlue.png");
const warning = require("../../../../../assets/images/png/exclamation.png");
import { Timeline } from "primereact/timeline";
import "./DocumentTracker.css";

interface Props {
  sectionData: any;
}

const DocumentTracker: React.FC<Props> = ({ sectionData }) => {
  const events = [
    {
      status: "Ordered",
      date: "15/10/2020 10:30",
      icon: "pi pi-shopping-cart",
      color: "#593ABB",
      borderColor: "#cdbff7",
      image: "game-controller.jpg",
      serialNumber: 1,
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div className={styles.trackerHeadlineSec}>
              <h3 style={{ color: "#593ABB" }}>Primary Auhtor</h3>
              <MultiplePeoplePersona
                data={sectionData?.primaryAuthor}
                positionLeft={15}
              />
            </div>
            <span>Document template setup</span>
          </div>
          <div className={styles.statusSection}>
            {/* <p>Rework in progress</p> */}
            <button className={styles.backBtn}>
              <img src={checkMark} alt={"back to my tasks"} />
            </button>
          </div>
        </div>
      ),
    },
    {
      status: "Processing",
      date: "15/10/2020 14:00",
      icon: "pi pi-cog",
      color: "#C4000C",
      borderColor: "#ffffff96",
      serialNumber: 2,
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div className={styles.trackerHeadlineSec}>
              <h3 style={{ color: "#C4000C" }}>Section Auhtors</h3>
              <MultiplePeoplePersona
                data={sectionData?.sectionAuthors}
                positionLeft={15}
              />
            </div>
            <span>Content Development</span>
          </div>
          <div className={styles.statusSection}>
            {/* <p>Rework in progress</p> */}
            <button className={styles.backBtn}>
              <img src={checkMark} alt={"back to my tasks"} />
            </button>
          </div>
        </div>
      ),
    },
    {
      status: "Shipped",
      date: "15/10/2020 16:15",
      icon: "pi pi-shopping-cart",
      color: "#593ABB",
      borderColor: "#cdbff7",
      serialNumber: 3,
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div className={styles.trackerHeadlineSec}>
              <h3 style={{ color: "#593ABB" }}>Reviewer's</h3>
              <MultiplePeoplePersona
                data={sectionData?.reviewers}
                positionLeft={15}
              />
            </div>
            <span>Review & Reject progress for all section</span>
          </div>
          <div className={styles.statusSection}>
            <p style={{ color: "#C4000C" }}>Rework in progress</p>
            <button className={styles.backBtn}>
              <img src={warning} alt={"back to my tasks"} />
            </button>
          </div>
        </div>
      ),
    },
    {
      status: "Delivered",
      date: "16/10/2020 10:00",
      icon: "pi pi-check",
      color: "#555555",
      borderColor: "#e7dfdfde",
      serialNumber: 4,
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div className={styles.trackerHeadlineSec}>
              <h3 style={{ color: "#555555" }}>Approver's</h3>
              <MultiplePeoplePersona
                data={sectionData?.Approvers}
                positionLeft={15}
              />
            </div>
            <span>Approve & Reject progress for all section</span>
          </div>
          <div className={styles.statusSection}>
            {/* <p>Rework in progress</p>
            <button
              className={styles.backBtn}
            >
              <img src={checkMark} alt={"back to my tasks"} />
            </button> */}
          </div>
        </div>
      ),
    },
    {
      status: "Document Published",
      date: "16/10/2020 10:00",
      icon: "pi pi-check",
      color: "#555555",
      borderColor: "#e7dfdfde",
      serialNumber: 5,
      content: (
        <div>
          <div className={styles.trackerContent}>
            <h3 style={{ color: "#555555" }}>Document Published</h3>
            <span>Final output of the document</span>
          </div>
        </div>
      ),
    },
  ];

  const customizedMarker = (item: any) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{
          backgroundColor: item.color,
          border: `6px solid ${item.borderColor}`,
          padding: "5px 9px",
          borderRadius: "50px",
          color: "#fff",
        }}
      >
        <span>{item.serialNumber}</span>
      </span>
    );
  };

  const customizedContent = (item: any) => {
    return <div>{item.content}</div>;
  };

  return (
    <>
      <div className={styles.documentTrackerContainer}>
        <Timeline
          value={events}
          // align="left"
          className="w-full md:w-20rem"
          // className="customized-timeline"
          marker={customizedMarker}
          content={customizedContent}
        />
      </div>
    </>
  );
};

export default DocumentTracker;
