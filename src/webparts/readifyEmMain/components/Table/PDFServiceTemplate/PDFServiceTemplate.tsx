/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useState } from "react";
// import DefaultButton from "../../common/Buttons/DefaultButton";
import styles from "./PDFServiceTemplate.module.scss";
import "./PDFServiceTemplate.css";
// import jsPDF from "jspdf";
// import pdfMake from "pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import htmlToPdfmake from "html-to-pdfmake";
// import SpServices from "../../../../../services/SPServices/SpServices";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import { getDocumentRelatedSections } from "../../../../../services/PDFServices/PDFServices";
// import DefaultButton from "../../common/Buttons/DefaultButton";
// import html2pdf from "html2pdf.js";
interface Iprops {
  documentId: number;
}

const PDFServiceTemplate: React.FC<Iprops> = ({ documentId }) => {
  debugger;
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
        <div id="divToPrint">
          {allSectionContent?.map((obj: any, index: number) => {
            return (
              <div
                className={styles.paraSection}
                style={{ padding: "10px 0px" }}
                key={index}
              >
                {obj.text !== "Header" && obj.text !== "Change Record" && (
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
                )}
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
                          <span style={{ marginRight: "10px" }}>
                            {list.text}
                          </span>
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
      {/* <DefaultButton
        text="PDF"
        btnType="secondary"
        onClick={() => {
          const pdfTable: any =
            document.getElementById("divToPrint")?.innerHTML;
          debugger;
          html2pdf()
            .from(pdfTable)
            .set({
              margin: 1,
              filename: "document.pdf",
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            })
            .save();
        }}
      /> */}
    </>
  );
};
export default memo(PDFServiceTemplate);
