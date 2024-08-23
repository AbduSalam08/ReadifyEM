/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useState } from "react";
// import DefaultButton from "../../common/Buttons/DefaultButton";
import styles from "./PDFServiceTemplate.module.scss";
// import SpServices from "../../../../../services/SPServices/SpServices";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import { getDocumentRelatedSections } from "../../../../../services/PDFServices/PDFServices";
interface Iprops {
  documentId: number;
}

const PDFServiceTemplate: React.FC<Iprops> = ({ documentId }) => {
  console.log(documentId);

  const [allSectionContent, setAllSectionContent] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  console.log(allSectionContent);

  // const readTextFileFromTXT = (data: any, index: number): void => {
  //   SpServices.SPReadAttachments({
  //     ListName: "SectionDetails",
  //     ListID: data.ID,
  //     AttachmentName: data?.FileName,
  //   })
  //     .then((res: any) => {
  //       const parsedValue: any = JSON.parse(res);
  //       const sectionDetails = {
  //         text: data.sectionName,
  //         sectionOrder: data.sectionOrder,
  //         value: parsedValue,
  //       };
  //       setAllSectionContent((prev: any) => {
  //         // Add the new sectionDetails to the previous state
  //         const updatedSections = [...prev, sectionDetails];

  //         // Sort the updatedSections array by the "sectionOrder" key
  //         updatedSections.sort((a, b) => {
  //           return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
  //         });

  //         // Return the sorted array to update the state
  //         return updatedSections;
  //       });
  //       if (index + 1 === AllSectionsAttachments.length) {
  //         setLoader(false);
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.log("err: ", err);
  //     });
  // };

  // const readSectionAttachments = (): any => {
  //   if (AllSectionsAttachments.length !== 0) {
  //     AllSectionsAttachments.forEach((item: any, index: number) => {
  //       const filteredItem: any = item?.filter(
  //         (item: any) => item?.FileName === "Sample.txt"
  //       );
  //       if (filteredItem.length > 0) {
  //         readTextFileFromTXT(filteredItem[0], index);
  //       } else {
  //         // setSectionLoader(false);
  //       }
  //     });
  //   } else {
  //     // setLoader(false);
  //   }
  // };
  useEffect(() => {
    getDocumentRelatedSections(documentId, setAllSectionContent, setLoader);
  }, []);

  // useEffect(() => {
  //   setLoader(true);
  //   readSectionAttachments();
  // }, [AllSectionsAttachments]);

  return (
    <>
      {loader ? (
        <div>
          <CircularSpinner />
        </div>
      ) : allSectionContent.length > 0 ? (
        allSectionContent?.map((obj: any, index: number) => {
          return (
            <div
              className={styles.paraSection}
              style={{ padding: "10px 0px" }}
              key={index}
            >
              <span
                style={{
                  display: "flex",
                  paddingBottom: "15px",
                  fontSize: "22px",
                  fontFamily: "interMedium, sans-serif",
                }}
              >
                {obj.sectionOrder + ". " + obj.text}
              </span>
              {typeof obj.value === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: obj.value }} />
              ) : (
                obj.value.map((list: any, index: number) => {
                  const indent = list.text.split(".").length - 1;
                  console.log(indent);
                  const marginLeft = (indent + 1 - 1) * 26;
                  const nestedStyle: React.CSSProperties = {
                    marginLeft: `${marginLeft}px`,
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: "13px",
                  };
                  return (
                    list.value !== "" && (
                      <div
                        className={styles.listItem}
                        style={nestedStyle}
                        key={index}
                      >
                        <span style={{ marginRight: "10px" }}>{list.text}</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: list.value,
                          }}
                        />
                      </div>
                    )
                  );
                })
              )}
            </div>
          );
        })
      ) : (
        <div className={styles.noDataFound}>
          <span>No content has been developed at this time.</span>
        </div>
      )}
    </>
  );
};
export default memo(PDFServiceTemplate);
