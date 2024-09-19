/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useState } from "react";
import styles from "./PDFServiceTemplate.module.scss";
import "./PDFServiceTemplate.css";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import { getDocumentRelatedSections } from "../../../../../services/PDFServices/PDFServices";
interface Iprops {
  documentId: number;
}

const PDFServiceTemplate: React.FC<Iprops> = ({ documentId }) => {
  const [allSectionContent, setAllSectionContent] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  console.log(allSectionContent);

  useEffect(() => {
    getDocumentRelatedSections(documentId, setAllSectionContent, setLoader);
  }, []);

  // Function to render points recursively
  const renderPoints = (
    arr: any[],
    parentPath: number[] = []
  ): JSX.Element[] => {
    return arr.map((point, index) => {
      // Calculate the current path for this point (parent path + current index)
      const currentPath = [...parentPath, index];

      // Determine the indent level based on the length of the parent path
      const indentLevel = parentPath.length;
      const marginLeft = indentLevel * 31; // Adjust this value for appropriate spacing
      const nestedStyle: React.CSSProperties = {
        marginLeft: `${marginLeft}px`,
        display: "flex",
        alignItems: "center",
        paddingBottom: "13px",
      };

      return (
        <div key={point.text}>
          <div className={styles.listItem} style={nestedStyle} key={index}>
            <span style={{ marginRight: "10px" }}>{point.text}</span>
            <span
              dangerouslySetInnerHTML={{
                __html: point.value,
              }}
            />
          </div>
          {point.children.length > 0 &&
            renderPoints(point.children, currentPath)}
        </div>
      );
    });
  };

  return (
    <>
      {loader ? (
        <div>
          <CircularSpinner />
        </div>
      ) : allSectionContent.length > 0 ? (
        <div id="divToPrint">
          {allSectionContent?.map((obj: any, index: number) => {
            return (
              <div
                className={styles.paraSection}
                style={{ padding: "10px 0px" }}
                key={index}
              >
                {obj.text !== "Header" && (
                  <span
                    style={{
                      display: "flex",
                      paddingBottom: "15px",
                      fontSize: "22px",
                      fontFamily: "interMedium, sans-serif",
                    }}
                  >
                    {obj.sectionType === "appendix section" ||
                    obj.sectionType === "change record"
                      ? obj.text
                      : obj.sectionOrder + ". " + obj.text}
                  </span>
                )}
                {typeof obj.value === "string" ? (
                  <div
                    style={{ marginLeft: "20px" }}
                    dangerouslySetInnerHTML={{ __html: obj.value }}
                  />
                ) : (
                  // obj.value.map((list: any, index: number) => {
                  //   const indent = list.text.split(".").length - 1;
                  //   const marginLeft = (indent + 1 - 1) * 26;
                  //   const nestedStyle: React.CSSProperties = {
                  //     marginLeft: `${marginLeft}px`,
                  //     display: "flex",
                  //     alignItems: "center",
                  //     paddingBottom: "13px",
                  //   };
                  //   return (
                  //     list.value !== "" && (
                  //       <div
                  //         className={styles.listItem}
                  //         style={nestedStyle}
                  //         key={index}
                  //       >
                  //         <span style={{ marginRight: "10px" }}>
                  //           {list.text}
                  //         </span>
                  //         <span
                  //           dangerouslySetInnerHTML={{
                  //             __html: list.value,
                  //           }}
                  //         />
                  //       </div>
                  //     )
                  //   );
                  // })

                  <div>{renderPoints(obj.value)}</div>
                )}
                {allSectionContent.length === 1 && (
                  <div className={styles.noDataFound}>
                    <span>No content has been developed at this time.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.noDataFound}>
          <span>No content has been developed at this time.</span>
        </div>
      )}
    </>
  );
};
export default memo(PDFServiceTemplate);
