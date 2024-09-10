/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-var-requires */
// import styles from "./DocumentTracker.module.scss";
// import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";
// const checkMark = require("../../../../../assets/images/svg/checkIconViolet.svg");
// const warning = require("../../../../../assets/images/svg/exclamationDarkRed.svg");
// import { Timeline } from "primereact/timeline";
// import "./DocumentTracker.css";

// interface Props {
//   documentData: any;
//   sectionsData: any;
// }

// const DocumentTracker: React.FC<Props> = ({ documentData, sectionsData }) => {
//   console.log("sectionsData: ", sectionsData);
//   console.log("documentData: ", documentData);
//   const sectionAuthors: any = sectionsData?.map((item: any) => {
//     return item?.sectionAuthor;
//   });

//   const hasRework = sectionsData?.some((item: any) => {
//     return item?.sectionStatus === "rework in progress";
//   });
//   const docApproved = documentData?.documentStatus?.toLowerCase() === "approved";

//   const noreviewStarted = documentData?.reviewers?.every((item:any)=>item?.status==='pending')
//   const reviewStarted = documentData?.reviewers?.some((item:any)=>item?.status==='in progress')
//   const reviewed = documentData?.reviewers?.every((item: any) => item?.status === 'completed')

//   const noapprovalStarted = documentData?.reviewers?.every((item:any)=>item?.status==='pending')
//   const approvalStarted = documentData?.reviewers?.some((item:any)=>item?.status==='in progress')
//   const approval = documentData?.reviewers?.every((item:any)=>item?.status==='completed')

//   const events = [
//     {
//       color: "#593ABB",
//       borderColor: "#ffffffd4",
//       serialNumber: 1,
//       content: (
//         <div className={styles.trackSection}>
//           <div className={styles.trackerContent}>
//             <div className={styles.trackerHeadlineSec}>
//               <span className={styles.roleType} style={{ color: "#593ABB" }}>
//                 Primary Author
//               </span>
//               <MultiplePeoplePersona
//                 data={[documentData?.primaryAuthor]}
//                 positionLeft={15}
//               />
//             </div>
//             <span>Document template & sections setup</span>
//           </div>
//           <div className={styles.statusSection}>
//             {/* <p>Rework in progress</p> */}
//             <button className={styles.backBtn}>
//               <img src={checkMark} />
//             </button>
//           </div>
//         </div>
//       ),
//     },
//     {
//       color: hasRework ? "#C4000C" : "#593ABB",
//       borderColor: hasRework ? "#fee4e5" : "#ffffffd4",
//       serialNumber: 2,
//       content: (
//         <div className={styles.trackSection}>
//           <div className={styles.trackerContent}>
//             <div
//               className={styles.trackerHeadlineSec}
//               style={{
//                 flexDirection: "column",
//                 alignItems: "flex-start",
//                 justifyContent: "flex-start",
//                 gap: "0",
//               }}
//             >
//               <span
//                 className={styles.roleType}
//                 style={{ color: hasRework ? "#C4000C" : "#593ABB" }}
//               >
//                 Section Author(s)
//               </span>
//               <div
//                 style={{
//                   marginLeft: "10px",
//                   marginTop: "5px",
//                 }}
//               >
//                 <MultiplePeoplePersona
//                   data={sectionAuthors}
//                   positionLeft={15}
//                 />
//               </div>
//             </div>
//             <span>Content Development</span>
//           </div>
//           <div className={styles.statusSection}>
//             {hasRework ? (
//               <>
//                 <p style={{ color: "#C4000C" }}>Rework in progress</p>
//                 <button className={styles.backBtn}>
//                   <img src={warning} alt={"back to my tasks"} />
//                 </button>
//               </>
//             ) : docApproved ? (
//               <>
//                 <button className={styles.backBtn}>
//                   <img src={checkMark} />
//                 </button>
//               </>
//             ) : sectionsData?.some((item: any) => {
//                 return item?.sectionStatus
//                   ?.toLowerCase()
//                   ?.includes("yet to be reviewed");
//               }) ? (
//               <>
//                 <p style={{ color: "#555" }}>Reviewal in progress</p>
//               </>
//             ) : sectionsData?.some((item: any) => {
//                 return item?.sectionStatus
//                   ?.toLowerCase()
//                   ?.includes("yet to be approved");
//               }) ? (
//               <>
//                 <p style={{ color: "#555" }}>Approval in progress</p>
//               </>
//             ) : (
//               <>
//                 <p style={{ color: "#555" }}>development in progress</p>
//               </>
//             )}
//           </div>
//         </div>
//       ),
//     },
//     {
//       color: reviewed || reviewStarted ? "#593ABB" : "#555",
//       borderColor: "#ffffffd4",
//       serialNumber: 3,
//       content: (
//         <div className={styles.trackSection}>
//           <div className={styles.trackerContent}>
//             <div className={styles.trackerHeadlineSec}>
//               <span
//                 className={styles.roleType}
//                 style={{
//                   color: reviewed || reviewStarted ? "#593ABB" : "#555",
//                 }}
//               >
//                 Reviewer(s)
//               </span>
//               <MultiplePeoplePersona
//                 data={documentData?.reviewers}
//                 positionLeft={15}
//               />
//             </div>
//             <span>Review & Reject progress for all section</span>
//           </div>
//           <div className={styles.statusSection}>
//             {/* <p>Rework in progress</p> */}
//             <button className={styles.backBtn}>
//               <img src={checkMark} alt={"back to my tasks"} />
//             </button>
//           </div>
//         </div>
//       ),
//     },
//     {
//       color: "#555555",
//       borderColor: "#ffffffd4",
//       serialNumber: 4,
//       content: (
//         <div className={styles.trackSection}>
//           <div className={styles.trackerContent}>
//             <div className={styles.trackerHeadlineSec}>
//               <span className={styles.roleType} style={{ color: "#555555" }}>
//                 Approver(s)
//               </span>
//               <MultiplePeoplePersona
//                 data={documentData?.approvers}
//                 positionLeft={15}
//               />
//             </div>
//             <span>Approve & Reject progress for all section</span>
//           </div>
//           <div className={styles.statusSection}>
//             {/* <p>Rework in progress</p>
//             <button
//               className={styles.backBtn}
//             >
//               <img src={checkMark} alt={"back to my tasks"} />
//             </button> */}
//           </div>
//         </div>
//       ),
//     },
//     {
//       color:docApproved?"#19d3b2": "#555555",
//       borderColor: docApproved?"#00342b":"#ffffffd4",
//       serialNumber: 5,
//       content: (
//         <div>
//           <div className={styles.trackerContent}>
//             <span
//               className={styles.roleType}
//               style={{ color: "#555555", marginBottom: "5px" }}
//             >
//               Document Published
//             </span>
//             <span>Final output of the document</span>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   const customizedMarker = (item: any): any => {
//     return (
//       <span
//         className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
//         style={{
//           backgroundColor: item.color,
//           border: `6px solid ${item.borderColor}`,
//           padding: "5px 9px",
//           borderRadius: "50px",
//           color: "#fff",
//         }}
//       >
//         <span>{item.serialNumber}</span>
//       </span>
//     );
//   };

//   const customizedContent = (item: any): any => {
//     return <div>{item.content}</div>;
//   };

//   return (
//     <>
//       <div className={styles.documentTrackerContainer}>
//         <Timeline
//           value={events}
//           // align="left"
//           className="w-full md:w-20rem"
//           // className="customized-timeline"
//           marker={customizedMarker}
//           content={customizedContent}
//         />
//       </div>
//     </>
//   );
// };

// export default DocumentTracker;

import React from "react";
import styles from "./DocumentTracker.module.scss";
import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";
const checkMark = require("../../../../../assets/images/svg/completedSVG.svg");
const warning = require("../../../../../assets/images/svg/exclamationDarkRed.svg");
import { Timeline } from "primereact/timeline";
import "./DocumentTracker.css";

interface Props {
  documentData: any;
  sectionsData: any;
}

const DocumentTracker: React.FC<Props> = ({ documentData, sectionsData }) => {
  console.log("sectionsData: ", sectionsData);
  console.log("documentData: ", documentData);

  const sectionAuthors = sectionsData?.map((item: any) => item?.sectionAuthor);

  const hasRework = sectionsData?.some(
    (item: any) => item?.sectionStatus?.toLowerCase() === "rework in progress"
  );

  // const allsectionsSubmitted = sectionsData
  //   ?.filter(
  //     (item: any) =>
  //       item?.sectionType?.toLowerCase() !== "header section" &&
  //       item?.sectionType?.toLowerCase() !== "change record"
  //   )
  //   ?.every((item: any) => item?.sectionStatus?.toLowerCase() === "submitted");
  const docApproved =
    documentData?.documentStatus?.toLowerCase() === "approved" ||
    documentData?.documentStatus?.toLowerCase() === "current";
  const docInDev =
    documentData?.documentStatus?.toLowerCase() === "in development";

  const reviewPending = documentData?.reviewers?.every(
    (item: any) => item?.status === "pending"
  );
  const reviewStarted = documentData?.reviewers?.some(
    (item: any) => item?.status === "in progress"
  );
  const reviewed = documentData?.reviewers?.every(
    (item: any) => item?.status === "completed"
  );

  const approvalPending = documentData?.approvers?.some(
    (item: any) => item?.status === "pending"
  );
  const approvalStarted = documentData?.approvers?.some(
    (item: any) => item?.status === "in progress"
  );
  const approvalCompleted = documentData?.approvers?.every(
    (item: any) => item?.status === "completed"
  );

  const allsectionsSubmitted =
    reviewStarted || approvalStarted || reviewed || approvalCompleted;

  console.log("allsectionsSubmitted: ", allsectionsSubmitted);

  const events = [
    {
      color: "#32BA7C",
      borderColor: "#ffffffd4",
      serialNumber: (
        <img
          src={checkMark}
          style={{
            width: "20px",
            // height: "20px",
          }}
          alt="check mark"
        />
      ),
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div className={styles.trackerHeadlineSec}>
              <span className={styles.roleType} style={{ color: "#555" }}>
                Primary Author
              </span>
              <MultiplePeoplePersona
                data={[documentData?.primaryAuthor]}
                positionLeft={15}
              />
            </div>
            <span>Document template & sections setup</span>
          </div>
          {/* <div className={styles.statusSection}>
            <button className={styles.backBtn}>
              <img
                src={checkMark}
                style={{
                  width: "20px",
                  height: "20px",
                }}
                alt="check mark"
              />
            </button>
          </div> */}
        </div>
      ),
    },
    {
      color: hasRework
        ? "#fff"
        : allsectionsSubmitted && !docInDev && !hasRework
        ? "#32BA7C"
        : "#593ABB",
      borderColor: hasRework ? "#fee4e5" : "#ffffffd4",
      serialNumber: hasRework ? (
        <img
          src={warning}
          style={{
            width: "26px",
            height: "30px",
          }}
          alt="check mark"
        />
      ) : allsectionsSubmitted && !docInDev && !hasRework ? (
        <img
          src={checkMark}
          style={{
            width: "20px",
            // height: "20px",
          }}
          alt="check mark"
        />
      ) : (
        2
      ),
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div
              className={styles.trackerHeadlineSec}
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "0",
              }}
            >
              <span
                className={styles.roleType}
                style={{
                  color: "#555",
                  // color: hasRework
                  //   ? "#C4000C"
                  //   : allsectionsSubmitted
                  //   ? "#32BA7C"
                  //   : "#593ABB",
                }}
              >
                Section Author(s)
              </span>
              <div
                style={{
                  marginLeft: "10px",
                  marginTop: "5px",
                }}
              >
                <MultiplePeoplePersona
                  data={sectionAuthors}
                  positionLeft={15}
                />
              </div>
            </div>
            <span>Content Development</span>
          </div>
          <div className={styles.statusSection}>
            {hasRework ? (
              <>
                <p style={{ color: "#C4000C" }}>Rework in progress</p>
                {/* <button className={styles.backBtn}>
                  <img src={warning} alt="back to my tasks" />
                </button> */}
              </>
            ) : allsectionsSubmitted && !docInDev && !hasRework ? (
              <>
                <p style={{ color: "#32BA7C" }}>Sections submitted</p>
              </>
            ) : (
              docInDev && (
                <>
                  <p
                    style={{
                      color: "#593ABB",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    Content in progress
                  </p>
                </>
              )
            )}
          </div>
        </div>
      ),
    },
    {
      color: reviewed ? "#32BA7C" : reviewStarted ? "#593ABB" : "#555",
      borderColor: "#ffffffd4",
      serialNumber: reviewed ? (
        <img
          src={checkMark}
          style={{
            width: "20px",
            // height: "20px",
          }}
          alt="check mark"
        />
      ) : (
        3
      ),
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div className={styles.trackerHeadlineSec}>
              <span
                className={styles.roleType}
                style={{
                  // color: reviewed || reviewStarted ? "#593ABB" : "#555",
                  color: "#555",
                }}
              >
                Reviewer(s)
              </span>
              <MultiplePeoplePersona
                data={documentData?.reviewers}
                positionLeft={15}
              />
            </div>
            <span>Review & Reject progress for all sections</span>
          </div>
          <div className={styles.statusSection}>
            {
              //   reviewed ? (
              //   <button className={styles.backBtn}>
              //     <img src={checkMark} alt="check mark" />
              //   </button>
              // ) :
              reviewPending ? (
                <>
                  <p
                    style={{
                      color: "#adadad",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    {/* Reviewal is pending */}Awaiting reviewal
                  </p>
                </>
              ) : reviewed ? (
                <>
                  <p
                    style={{
                      color: "#32BA7C",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    Reviewed
                  </p>
                </>
              ) : (
                <>
                  <p
                    style={{
                      color: "#593ABB",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    Review in progress
                  </p>
                </>
              )
            }
          </div>
        </div>
      ),
    },
    {
      color: approvalCompleted
        ? "#32BA7C"
        : approvalStarted
        ? "#593ABB"
        : "#555555",
      borderColor: "#ffffffd4",
      serialNumber: approvalCompleted ? (
        <img
          src={checkMark}
          style={{
            width: "20px",
            // height: "20px",
          }}
          alt="check mark"
        />
      ) : (
        4
      ),
      content: (
        <div className={styles.trackSection}>
          <div className={styles.trackerContent}>
            <div className={styles.trackerHeadlineSec}>
              <span
                className={styles.roleType}
                style={{
                  color: "#555555",
                  // color:
                  //   approvalCompleted || approvalStarted
                  //     ? "#593ABB"
                  //     : "#555555",
                }}
              >
                Approver(s)
              </span>
              <MultiplePeoplePersona
                data={documentData?.approvers}
                positionLeft={15}
              />
            </div>
            <span>Approve & Reject progress for all sections</span>
          </div>
          <div className={styles.statusSection}>
            {
              //   approvalCompleted ? (
              //   <button className={styles.backBtn}>
              //     <img src={checkMark} alt="check mark" />
              //   </button>
              // ) :
              approvalPending ? (
                <>
                  <p
                    style={{
                      color: "#adadad ",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    {/* Approval is pending */}
                    Awaiting approval
                  </p>
                </>
              ) : approvalCompleted ? (
                <>
                  <p
                    style={{
                      color: "#32BA7C",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    Approved
                  </p>
                </>
              ) : (
                <>
                  <p
                    style={{
                      color: "#593ABB",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    Approval in progress
                  </p>
                </>
              )
            }
          </div>
        </div>
      ),
    },
    {
      color: docApproved ? "#32BA7C" : "#555555",
      borderColor: docApproved ? "#ffffffd4" : "#ffffffd4",
      serialNumber: docApproved ? (
        <img
          src={checkMark}
          style={{
            width: "20px",
            // height: "20px",
          }}
          alt="check mark"
        />
      ) : (
        5
      ),
      content: (
        <div>
          <div className={styles.trackerContent}>
            <span
              className={styles.roleType}
              style={{
                color: "#555555",
                // color: docApproved ? "#32BA7C"  : "#555555",
                marginBottom: "5px",
              }}
            >
              Document Published
            </span>
            <span>Final output of the document</span>
          </div>
        </div>
      ),
    },
  ];

  const customizedMarker = (item: any): any => {
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

  const customizedContent = (item: any): any => {
    return <div>{item.content}</div>;
  };

  return (
    <div className={styles.documentTrackerContainer}>
      <Timeline
        value={events}
        marker={customizedMarker}
        content={customizedContent}
      />
    </div>
  );
};

export default DocumentTracker;
