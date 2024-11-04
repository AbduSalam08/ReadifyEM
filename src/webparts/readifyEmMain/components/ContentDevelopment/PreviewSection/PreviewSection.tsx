/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { memo, useEffect, useState } from "react";
import { getSectionAttachment } from "../../../../../services/ContentDevelopment/SectionPreview/SectionPreview";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import styles from "./PreviewSection.module.scss";
// import styles from "./PreviewSection.module.scss";

interface Iprops {
  sectionId: number;
  sectionDetails: any;
}

const PreviewSection: React.FC<Iprops> = ({ sectionId, sectionDetails }) => {
  const [sectionAttachment, setSectionAttachment] = useState<any>(0);

  useEffect(() => {
    getSectionAttachment(sectionId, sectionDetails, setSectionAttachment);
  }, []);

  // Function to render points recursively
  const renderPoints = (
    arr: any[],
    parentPath: number[] = []
  ): JSX.Element[] => {
    return arr?.map((point, index) => {
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
          {point?.children.length > 0 &&
            renderPoints(point?.children, currentPath)}
        </div>
      );
    });
  };

  return (
    <div className={styles.paraSection}>
      {sectionAttachment !== 0 && sectionAttachment !== "empty" ? (
        typeof sectionAttachment === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: sectionAttachment }} />
        ) : (
          // sectionAttachment.map((list: any, index: number) => {
          //   const indent = list.text.split(".").length - 1;
          //   const marginLeft = (indent + 1 - 1) * 26;
          // const nestedStyle: React.CSSProperties = {
          //   marginLeft: `${marginLeft}px`,
          //   display: "flex",
          //   alignItems: "center",
          //   paddingBottom: "13px",
          // };
          //   return (
          //     list.value !== "" && (
          //       <div
          //         className={styles.listItem}
          //         style={nestedStyle}
          //         key={index}
          //       >
          //         <span style={{ marginRight: "10px" }}>{list.text}</span>
          //         <span
          //           dangerouslySetInnerHTML={{
          //             __html: list.value,
          //           }}
          //         />
          //       </div>
          //     )
          //   );
          // })
          <div>{renderPoints(sectionAttachment)}</div>
        )
      ) : sectionAttachment === "empty" ? (
        <div className={styles.noDataFound}>
          <span>No content has been developed at this time.</span>
        </div>
      ) : (
        <div>
          <CircularSpinner />
        </div>
      )}
    </div>
  );
};
export default memo(PreviewSection);
