/* eslint-disable no-unused-expressions */
// /* eslint-disable @typescript-eslint/explicit-function-return-type */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-floating-promises */
// import * as React from "react";
// import { useState } from "react";
// import styles from "./SectionContent.module.scss";
// import DefaultButton from "../../common/Buttons/DefaultButton";
// import ContentEditor from "./ContentEditor/ContentEditor";

// interface IProps {
//   sectionNumber: number;
//   ID: number;
// }
// interface IPoint {
//   text: string;
//   value: string;
// }

// import SpServices from "../../../../../services/SPServices/SpServices";

// const SectionContent: React.FC<IProps> = ({ sectionNumber, ID }) => {
//   //   const SectionTitle = "Objectives";
//   const [points, setPoints] = useState<IPoint[]>([
//     { text: String(sectionNumber), value: "" },
//   ]);
//   console.log("points: ", points);

//   const [subPointSequences, setSubPointSequences] = useState<{
//     [key: string]: number;
//   }>({});

//   const [newAttachment, setNewAttachment] = useState<boolean>(true);

//   const getNextPoint = (lastPoint: IPoint): IPoint => {
//     const parts = lastPoint.text.split(".");
//     const majorPart = parseInt(parts[0]);
//     const minorPart = parseInt(parts[1]) + 1 || 1;
//     return { text: `${majorPart}.${minorPart}.`, value: "" };
//   };

//   const handleAddPoint = (): void => {
//     const lastPoint = points[points.length - 1];
//     const newPoint = getNextPoint(lastPoint);
//     setPoints([...points, newPoint]);
//   };

//   const getNextSubPoint = (parentPoint: string, sequence: number): IPoint => {
//     return { text: `${parentPoint}${sequence}.`, value: "" };
//   };

//   const handleAddSubPoint = (index: number): void => {
//     const parentPoint = points[index];
//     const sequence = subPointSequences[parentPoint.text] || 1;
//     const newSubPoint = getNextSubPoint(parentPoint.text, sequence);
//     console.log(points.slice(0, index + 1));
//     console.log(points.slice(index + 1));
//     console.log(newSubPoint);

//     const newPoints = [
//       ...points.slice(0, index + 1),
//       newSubPoint,
//       ...points.slice(index + 1),
//     ];
//     const newSequence = sequence + 1;
//     setSubPointSequences({
//       ...subPointSequences,
//       [parentPoint.text]: newSequence,
//     });
//     console.log(newPoints);
//     setPoints(newPoints);
//   };

//   const handleInputChange = (index: number, value: string): void => {
//     const newPoints = [...points];
//     newPoints[index].value = value;
//     setPoints(newPoints);
//   };

//   const handleInputClear = (index: number): void => {
//     const newPoints = [...points];
//     if (newPoints[index]) {
//       newPoints.splice(index, 1);
//     }
//     setPoints(newPoints);
//   };

//   const renderPoint = (point: IPoint, index: number): JSX.Element => {
//     const indent = point.text.split(".").length - 1;
//     const marginLeft = (indent - 1) * 26; // Adjust indentation level as needed
//     const nestedStyle: React.CSSProperties = {
//       marginLeft: `${marginLeft}px`,
//       display: "flex",
//       alignItems: "center",
//     };

//     const ancestors: JSX.Element[] = [];
//     for (let i = 1; i < indent; i++) {
//       console.log("indent: ", indent);
//       console.log("i: ", i);
//       ancestors.push(
//         <div
//           key={i}
//           style={{
//             position: "absolute",
//             top: `-12%`,
//             left: `${i === 1 ? `0` : `${(i - 1) * 26}px`}`,
//             borderLeft: `1px solid ${i === 1 ? `transparent` : `#adadad60`}`,
//             height: "136%",
//           }}
//         />
//       );
//     }

//     return (
//       <div
//         key={index}
//         style={{
//           position: "relative",
//         }}
//       >
//         <div style={nestedStyle} className={styles.renderedInput}>
//           {ancestors}
//           <span style={{ marginRight: "5px" }} className={styles.pointText}>
//             {point.text}
//           </span>
//           <ContentEditor
//             editorHtmlValue={point.value}
//             placeholder="Enter here"
//             setEditorHtml={(html: any) => {
//               handleInputChange(index, html);
//             }}
//           />
//           <button
//             onClick={() => handleInputClear(index)}
//             className="actionButtons"
//             style={{
//               background: "transparent",
//               padding: "0 5px 0 0",
//             }}
//           >
//             <i className="pi pi-times-circle" />
//           </button>
//           <button
//             onClick={() => handleAddSubPoint(index)}
//             className="actionButtons"
//           >
//             <i className="pi pi-angle-double-right" />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const sortedPoints = points.sort((a, b) => {
//     const pointA = a.text.split(".").map(parseFloat);
//     const pointB = b.text.split(".").map(parseFloat);

//     for (let i = 0; i < Math.min(pointA.length, pointB.length); i++) {
//       if (pointA[i] !== pointB[i]) {
//         return pointA[i] - pointB[i];
//       }
//     }
//     return pointA.length - pointB.length;
//   });

//   const readTextFileFromTXT = (data: any): void => {
//     console.log("data: ", data);
//     SpServices.SPReadAttachments({
//       ListName: "SectionDetails",
//       ListID: ID,
//       AttachmentName: data?.FileName,
//     })
//       .then((res: any) => {
//         const parsedValue: any = JSON.parse(res);
//         setPoints([...parsedValue]);
//       })
//       .catch((err: any) => {
//         console.log("err: ", err);
//       });
//   };

//   const getSectionData = (): void => {
//     SpServices.SPGetAttachments({ Listname: "SectionDetails", ID: ID })
//       .then((res: any) => {
//         console.log(res);
//         if (res.length > 0) {
//           readTextFileFromTXT(res[0]);
//           setNewAttachment(false);
//         } else {
//           //   setPoints([]);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   const convertToTxtFile = (): any => {
//     const blob = new Blob([JSON.stringify(points)], { type: "text/plain" });
//     const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
//     return file;
//   };

//   const addAttchment = async (itemID: number, _file: any) => {
//     await SpServices.SPAddAttachment({
//       ListName: "SectionDetails",
//       ListID: itemID,
//       FileName: "Sample.txt",
//       Attachments: _file,
//     })
//       .then((res: any) => {
//         // _getData();
//       })
//       .catch((err: any) => {
//         console.log("err: ", err);
//       });
//   };
//   const updateAttachment = async (itemID: number, _file: any) => {
//     await SpServices.SPDeleteAttachments({
//       ListName: "SectionDetails",
//       ListID: itemID,
//       AttachmentName: "Sample.txt",
//     })
//       .then((res) => console.log("removed", res))
//       .catch((err) => console.log(err));
//     await addAttchment(itemID, _file);
//   };

//   const addData = async () => {
//     const _file: any = await convertToTxtFile();
//     if (newAttachment) {
//       await addAttchment(ID, _file);
//     } else {
//       await updateAttachment(ID, _file);
//     }
//   };

//   React.useEffect(() => {
//     getSectionData();
//   }, []);

//   return (
//     <div>
//       <div className={styles.textPlayGround}>
//         {sortedPoints?.length > 1 ? (
//           sortedPoints.map((item: any, idx: number) =>
//             item.text !== String(sectionNumber) ? renderPoint(item, idx) : ""
//           )
//         ) : (
//           <p className={styles.placeholder}>content goes here as points...</p>
//         )}
//       </div>
//       <div
//         style={{
//           width: "100%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginTop: "15px",
//         }}
//       >
//         <button
//           className={styles.primaryButton}
//           style={{
//             padding: "5px 15px",
//           }}
//           onClick={handleAddPoint}
//         >
//           <i
//             className="pi pi-plus-circle"
//             style={{
//               marginRight: "10px",
//             }}
//           />
//           Add New Point
//         </button>
//         <div style={{ display: "flex", gap: "15px" }}>
//           <DefaultButton text="Cancel" btnType="darkGreyVariant" />
//           <DefaultButton
//             text="Save and Close"
//             btnType="lightGreyVariant"
//             onClick={() => {
//               addData();
//             }}
//           />
//           <DefaultButton
//             text="Submit"
//             btnType="primary"
//             onClick={() => {
//               addData();
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SectionContent;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

// --------------------------
// import * as React from "react";
// import { useState, useEffect } from "react";
// import styles from "./SectionContent.module.scss";

// import DefaultButton from "../../common/Buttons/DefaultButton";
// import ContentEditor from "./ContentEditor/ContentEditor";
// // import SpServices from "../../../../../services/SPServices/SpServices";
// import { useNavigate } from "react-router-dom";
// import SpServices from "../../../../../services/SPServices/SpServices";
// import {
//   // AddAttachment,
//   UpdateAttachment,
// } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
// import { LISTNAMES } from "../../../../../config/config";

// interface IProps {
//   sectionNumber: number;
//   ID: number;
//   noActionBtns?: boolean;
//   activeIndex?: any;
//   setSectionData?: any;
//   currentSectionDetails?: any;
// }

// interface IPoint {
//   text: string;
//   value: string;
// }

// const SectionContent: React.FC<IProps> = ({
//   sectionNumber,
//   currentSectionDetails,
//   ID,
//   noActionBtns,
//   activeIndex,
//   setSectionData,
// }) => {
//   console.log("currentSectionDetails: ", currentSectionDetails);
//   const [points, setPoints] = useState<IPoint[]>([
//     { text: String(sectionNumber), value: "" },
//   ]);
//   const navigate = useNavigate();

//   const [subPointSequences, setSubPointSequences] = useState<{
//     [key: string]: number;
//   }>({});

//   const [newAttachment, setNewAttachment] = useState<boolean>(true);

//   const getNextPoint = (lastPoint: IPoint): IPoint => {
//     const parts = lastPoint?.text.split(".");
//     const majorPart = parseInt(parts[0]);
//     const minorPart = parseInt(parts[1]) + 1 || 1;
//     return { text: `${majorPart}.${minorPart}`, value: "" };
//   };

//   const handleAddPoint = (): void => {
//     // if (points.length > 0) {
//     //   const lastPoint = points[points.length - 1];
//     //   if (lastPoint.value.trim() === "") {
//     //     alert(
//     //       "Please enter a value for the last point before adding a new one."
//     //     );
//     //     return;
//     //   }
//     // }

//     const newPoint = getNextPoint(points[points.length - 1]);
//     setPoints([...points, newPoint]);
//   };

//   const getNextSubPoint = (parentPoint: string, sequence: number): IPoint => {
//     return { text: `${parentPoint}.${sequence}`, value: "" };
//   };

//   const handleAddSubPoint = (index: number): void => {
//     const parentPoint = points[index];
//     if (parentPoint.value.trim() === "") {
//       alert(
//         "Please enter a value for the parent point before adding a sub-point."
//       );
//       return;
//     }
//     const sequence = subPointSequences[parentPoint.text] || 1;
//     const newSubPoint = getNextSubPoint(parentPoint.text, sequence);
//     const newPoints = [
//       ...points.slice(0, index + 1),
//       newSubPoint,
//       ...points.slice(index + 1),
//     ];
//     const newSequence = sequence + 1;
//     setSubPointSequences({
//       ...subPointSequences,
//       [parentPoint.text]: newSequence,
//     });
//     setPoints(newPoints);
//   };

//   const handleInputChange = (index: number, value: string): void => {
//     const newPoints = [...points];
//     newPoints[index].value = value;
//     setPoints(newPoints);
//   };

//   const handleInputClear = (index: number): void => {
//     const pointToRemove = points[index];
//     const newPoints = points.filter((_, i) => i !== index); // Remove sub-points recursively

//     const removeSubPoints = (parentPoint: string) => {
//       const subPoints = newPoints.filter((point) =>
//         point.text.startsWith(parentPoint + ".")
//       );
//       subPoints.forEach((subPoint) => {
//         const subPointIndex = newPoints.indexOf(subPoint);
//         newPoints.splice(subPointIndex, 1);
//         removeSubPoints(subPoint.text);
//       });
//     };
//     removeSubPoints(pointToRemove.text);
//     setPoints(newPoints);
//   };

//   const renderPoint = (point: IPoint, index: number): JSX.Element => {
//     const indent = point.text.split(".").length - 1;
//     const marginLeft = (indent - 1) * 26;
//     const nestedStyle: React.CSSProperties = {
//       marginLeft: `${marginLeft}px`,
//       display: "flex",
//       alignItems: "center",
//     };

//     const ancestors: JSX.Element[] = [];
//     for (let i = 1; i < indent; i++) {
//       ancestors.push(
//         <div
//           key={i}
//           style={{
//             position: "absolute",
//             top: `-12%`,
//             left: `${i === 1 ? `0` : `${(i - 1) * 26}px`}`,
//             borderLeft: `1px solid ${i === 1 ? `transparent` : `#adadad60`}`,
//             height: "136%",
//           }}
//         />
//       );
//     }

//     return (
//       <div key={index} style={{ position: "relative" }}>
//         <div
//           style={nestedStyle}
//           className={`${styles.renderedInput} renderedInput`}
//         >
//           {ancestors}
//           <span style={{ marginRight: "5px" }} className={styles.pointText}>
//             {point.text}
//           </span>
//           <ContentEditor
//             editorHtmlValue={point.value}
//             placeholder="Enter here"
//             setEditorHtml={(html: any) => {
//               handleInputChange(index, html);
//             }}
//           />
//           <button
//             onClick={() => handleInputClear(index)}
//             className="actionButtons"
//             style={{
//               background: "transparent",
//               padding: "0 5px 0 0",
//             }}
//           >
//             <i className="pi pi-times-circle" />
//           </button>
//           <button
//             onClick={() => handleAddSubPoint(index)}
//             className="actionButtons"
//           >
//             <i className="pi pi-angle-double-right" />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const sortedPoints = points.sort((a, b) => {
//     const pointA = a?.text?.split(".")?.map(parseFloat);
//     const pointB = b?.text?.split(".")?.map(parseFloat);

//     for (let i = 0; i < Math.min(pointA.length, pointB.length); i++) {
//       if (pointA[i] !== pointB[i]) {
//         return pointA[i] - pointB[i];
//       }
//     }
//     return pointA.length - pointB.length;
//   });

//   const readTextFileFromTXT = (data: any): void => {
//     SpServices.SPReadAttachments({
//       ListName: "SectionDetails",
//       ListID: ID,
//       AttachmentName: data?.FileName,
//     })
//       .then((res: any) => {
//         console.log("res: ", res);
//         const parsedValue: any = JSON.parse(res);
//         setPoints([...parsedValue]);
//       })
//       .catch((err: any) => {
//         console.log("err: ", err);
//       });
//   };

//   const getSectionData = async (): Promise<any> => {
//     await SpServices.SPGetAttachments({
//       Listname: LISTNAMES.SectionDetails,
//       ID: ID,
//     })
//       .then((res: any) => {
//         console.log("res: ", res);
//         const filteredItem: any = res?.filter(
//           (item: any) => item?.FileName === "Sample.txt"
//         );
//         if (
//           filteredItem.length > 0 &&
//           currentSectionDetails?.contentType === "list"
//         ) {
//           readTextFileFromTXT(filteredItem[0]);
//           setNewAttachment(false);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   const convertToTxtFile = (): any => {
//     const blob = new Blob([JSON.stringify(points)], { type: "text/plain" });
//     const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
//     return file;
//   };

//   const addData = async (submissionType?: any): Promise<any> => {
//     const _file: any = await convertToTxtFile();
//     if (newAttachment) {
//       await UpdateAttachment(ID, _file, "list", submissionType === "submit");
//     } else {
//       await UpdateAttachment(ID, _file, "list", submissionType === "submit");
//     }
//   };

//   useEffect(() => {
//     if (currentSectionDetails?.contentType === "list") {
//       getSectionData();
//     }
//   }, []);

//   return (
//     <div className="sectionWrapper">
//       <div className={styles.textPlayGround}>
//         <DefaultButton
//           btnType="primary"
//           startIcon={
//             <i
//               className="pi pi-plus-circle"
//               style={{
//                 fontSize: "12px",
//               }}
//             />
//           }
//           text={"Add new point"}
//           onClick={handleAddPoint}
//         />
//         {sortedPoints.length > 1 ? (
//           sortedPoints?.map((item: any, idx: number) =>
//             item?.text !== String(sectionNumber) ? renderPoint(item, idx) : ""
//           )
//         ) : (
//           <p className={styles.placeholder}>Content goes here as points...</p>
//         )}
//       </div>
//       {!noActionBtns && (
//         <div
//           style={{
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginTop: "15px",
//           }}
//         >
//           <button className={"helpButton"}>Help?</button>
//           <div style={{ display: "flex", gap: "15px" }}>
//             <DefaultButton
//               text="Cancel"
//               btnType="darkGreyVariant"
//               onClick={() => {
//                 navigate(-1);
//               }}
//             />
//             <DefaultButton
//               text="Reset content"
//               btnType="secondaryRed"
//               onClick={() => {
//                 setSectionData((prev: any) => {
//                   const updatedSections = [...prev];
//                   updatedSections[activeIndex] = {
//                     ...updatedSections[activeIndex],
//                     contentType: "initial",
//                   };
//                   return updatedSections;
//                 });
//               }}
//             />
//             <DefaultButton
//               text="Save and Close"
//               btnType="lightGreyVariant"
//               onClick={() => {
//                 addData();
//               }}
//             />
//             <DefaultButton
//               text="Submit"
//               btnType="primary"
//               onClick={() => {
//                 addData("submit");
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default SectionContent;

import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./SectionContent.module.scss";
import DefaultButton from "../../common/Buttons/DefaultButton";
import ContentEditor from "./ContentEditor/ContentEditor";
import { useNavigate } from "react-router-dom";
import SpServices from "../../../../../services/SPServices/SpServices";
import { UpdateAttachment } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { LISTNAMES } from "../../../../../config/config";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";

interface IProps {
  sectionNumber: any;
  ID: number;
  noActionBtns?: boolean;
  activeIndex?: any;
  setSectionData?: any;
  currentSectionDetails?: any;
  onChange?: any;
}

interface IPoint {
  text: string;
  value: string;
}

const SectionContent: React.FC<IProps> = ({
  sectionNumber,
  currentSectionDetails,
  ID,
  noActionBtns,
  activeIndex,
  setSectionData,
  onChange,
}) => {
  const [sectionLoader, setSectionLoader] = useState(true);
  const [points, setPoints] = useState<IPoint[]>([
    { text: String(sectionNumber), value: "" },
  ]);
  console.log("points: ", points);
  const navigate = useNavigate();
  const [subPointSequences, setSubPointSequences] = useState<{
    [key: string]: number;
  }>({});
  // const [newAttachment, setNewAttachment] = useState<boolean>(true);

  const getNextPoint = (lastPoint: IPoint): IPoint => {
    const parts = lastPoint?.text.split(".");
    const majorPart = parseInt(parts[0]);
    const minorPart = parseInt(parts[1]) + 1 || 1;
    return { text: `${majorPart}.${minorPart}`, value: "" };
  };

  const handleAddPoint = (): void => {
    const newPoint = getNextPoint(points[points.length - 1]);
    setPoints([...points, newPoint]);
  };

  const getNextSubPoint = (parentPoint: string, sequence: number): IPoint => {
    return { text: `${parentPoint}.${sequence}`, value: "" };
  };

  const handleAddSubPoint = (index: number): void => {
    const parentPoint = points[index];
    if (parentPoint.value.trim() === "") {
      alert(
        "Please enter a value for the parent point before adding a sub-point."
      );
      return;
    }
    const sequence = subPointSequences[parentPoint.text] || 1;
    const newSubPoint = getNextSubPoint(parentPoint.text, sequence);
    const newPoints = [
      ...points.slice(0, index + 1),
      newSubPoint,
      ...points.slice(index + 1),
    ];
    const newSequence = sequence + 1;
    setSubPointSequences({
      ...subPointSequences,
      [parentPoint.text]: newSequence,
    });
    setPoints(newPoints);
  };

  const handleInputChange = (index: number, value: string): void => {
    const newPoints = [...points];
    newPoints[index].value = value;
    setPoints(newPoints);
    onChange(newPoints);
  };

  const handleInputClear = (index: number): void => {
    const pointToRemove = points[index];
    const newPoints = points.filter((_, i) => i !== index);

    const removeSubPoints = (parentPoint: string) => {
      const subPoints = newPoints.filter((point) =>
        point.text.startsWith(parentPoint + ".")
      );
      subPoints.forEach((subPoint) => {
        const subPointIndex = newPoints.indexOf(subPoint);
        newPoints.splice(subPointIndex, 1);
        removeSubPoints(subPoint.text);
      });
    };
    removeSubPoints(pointToRemove.text);
    setPoints(newPoints);
  };

  const renderPoint = (point: IPoint, index: number): JSX.Element => {
    const indent = point.text.split(".").length - 1;
    const marginLeft = (indent - 1) * 26;
    const nestedStyle: React.CSSProperties = {
      marginLeft: `${marginLeft}px`,
      display: "flex",
      alignItems: "center",
    };

    const ancestors: JSX.Element[] = [];
    for (let i = 1; i < indent; i++) {
      ancestors.push(
        <div
          key={i}
          style={{
            position: "absolute",
            top: `-12%`,
            left: `${i === 1 ? `0` : `${(i - 1) * 26}px`}`,
            borderLeft: `1px solid ${i === 1 ? `transparent` : `#adadad60`}`,
            height: "136%",
          }}
        />
      );
    }

    return (
      <div key={index} style={{ position: "relative" }}>
        <div
          style={nestedStyle}
          className={`${styles.renderedInput} renderedInput`}
        >
          {ancestors}
          <span style={{ marginRight: "5px" }} className={styles.pointText}>
            {point.text}
          </span>
          <ContentEditor
            editorHtmlValue={point.value}
            placeholder="Enter here"
            setEditorHtml={(html: any) => {
              handleInputChange(index, html);
            }}
          />
          <button
            onClick={() => handleInputClear(index)}
            className="actionButtons"
            style={{
              background: "transparent",
              padding: "0 5px 0 0",
            }}
          >
            <i className="pi pi-times-circle" />
          </button>
          <button
            onClick={() => handleAddSubPoint(index)}
            className="actionButtons"
          >
            <i className="pi pi-angle-double-right" />
          </button>
        </div>
      </div>
    );
  };

  const sortedPoints = points.sort((a, b) => {
    const pointA = a?.text?.split(".")?.map(parseFloat);
    const pointB = b?.text?.split(".")?.map(parseFloat);

    for (let i = 0; i < Math.min(pointA.length, pointB.length); i++) {
      if (pointA[i] !== pointB[i]) {
        return pointA[i] - pointB[i];
      }
    }
    return pointA.length - pointB.length;
  });

  const readTextFileFromTXT = (data: any): void => {
    setSectionLoader(true);
    SpServices.SPReadAttachments({
      ListName: "SectionDetails",
      ListID: ID,
      AttachmentName: data?.FileName,
    })
      .then((res: any) => {
        console.log("res: ", res);
        const parsedValue: any = JSON.parse(res);
        if (typeof parsedValue === "object") {
          setPoints([...parsedValue]);
          onChange && onChange([...parsedValue]);
          setSectionLoader(false);
        } else {
          setSectionLoader(false);
        }
      })
      .catch((err: any) => {
        console.log("err: ", err);
        setSectionLoader(false);
      });
  };

  const getSectionData = async (): Promise<any> => {
    setSectionLoader(true);
    await SpServices.SPGetAttachments({
      Listname: LISTNAMES.SectionDetails,
      ID: ID,
    })
      .then((res: any) => {
        console.log("res: ", res);
        const filteredItem: any = res?.filter(
          (item: any) => item?.FileName === "Sample.txt"
        );
        if (
          filteredItem.length > 0 &&
          currentSectionDetails?.contentType === "list"
        ) {
          readTextFileFromTXT(filteredItem[0]);
          // setNewAttachment(false);
        } else {
          setSectionLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSectionLoader(false);
      });
  };

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(points)], { type: "text/plain" });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    setSectionLoader(true);
    const _file: any = await convertToTxtFile();
    const updateAttachmentPromise: Promise<any> = await UpdateAttachment(
      ID,
      _file,
      "list",
      submissionType === "submit",
      "Sample.txt"
    );

    Promise.all([updateAttachmentPromise])
      .then((res: any) => {
        setSectionLoader(false);
      })
      .catch((err: any) => {
        setSectionLoader(false);
      });
  };

  useEffect(() => {
    setSectionLoader(true);
    if (currentSectionDetails?.contentType === "list") {
      getSectionData();
    }

    // if (sortedPoints) {
    //   setSectionLoader(false);
    // }
  }, [ID]);

  return (
    <div className="sectionWrapper">
      {sectionLoader && !noActionBtns ? (
        <div className="contentDevLoaderWrapper">
          <CircularSpinner />
        </div>
      ) : (
        <div className={styles.textPlayGround}>
          <DefaultButton
            btnType="primary"
            startIcon={
              <i
                className="pi pi-plus-circle"
                style={{
                  fontSize: "12px",
                }}
              />
            }
            text={"Add new point"}
            onClick={handleAddPoint}
          />
          {sortedPoints.length > 1 ? (
            sortedPoints?.map((item: any, idx: number) =>
              item?.text !== String(sectionNumber) ? renderPoint(item, idx) : ""
            )
          ) : (
            <p className={styles.placeholder}>Content goes here as points...</p>
          )}
        </div>
      )}
      {!noActionBtns && (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <button className={"helpButton"}>Help?</button>
          <div style={{ display: "flex", gap: "15px" }}>
            <DefaultButton
              text="Cancel"
              btnType="darkGreyVariant"
              onClick={() => {
                navigate(-1);
              }}
            />
            <DefaultButton
              text="Reset content"
              disabled={sectionLoader}
              btnType="secondaryRed"
              onClick={() => {
                setSectionData((prev: any) => {
                  const updatedSections = [...prev];
                  updatedSections[activeIndex] = {
                    ...updatedSections[activeIndex],
                    contentType: "initial",
                  };
                  return updatedSections;
                });
              }}
            />
            <DefaultButton
              text="Save and Close"
              disabled={sectionLoader}
              btnType="lightGreyVariant"
              onClick={() => {
                addData();
              }}
            />
            <DefaultButton
              text="Submit"
              disabled={sectionLoader}
              btnType="primary"
              onClick={() => {
                addData("submit");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionContent;
