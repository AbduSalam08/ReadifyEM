/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useState } from "react";
import styles from "./PDFServiceTemplate.module.scss";
import "./PDFServiceTemplate.css";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import { getDocumentRelatedSections } from "../../../../../services/PDFServices/PDFServices";
import React, { useRef } from "react";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

interface Iprops {
  documentId: number;
}

const PDFServiceTemplate: React.FC<Iprops> = ({ documentId }) => {
  const [allSectionContent, setAllSectionContent] = useState<any[]>([]);
  const [pdfHeaderSection, setPdfHeaderSection] = useState<any>("");
  const [loader, setLoader] = useState<boolean>(false);
  console.log(allSectionContent, pdfHeaderSection);

  useEffect(() => {
    getDocumentRelatedSections(
      documentId,
      setAllSectionContent,
      setLoader,
      setPdfHeaderSection
    );
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
  const contentRef = useRef<any>();
  // const generatePDFFunction = () => {
  //   const header: any = document.querySelector(".pdf_header");
  //   const pdf: any = document.querySelector("#divToPrint");

  //   // Change the font size for all <p> tags
  //   const paragraphs = pdf.querySelectorAll("p");
  //   paragraphs.forEach((p: HTMLElement) => {
  //     p.style.fontSize = "13px"; // Set your desired font size here
  //   });

  //   const images = pdf.querySelectorAll(".rtUploadImage");
  //   images.forEach((img: HTMLElement) => {
  //     // const wrapper = document.createElement("div");
  //     // wrapper.style.pageBreakInside = "avoid";
  //     // wrapper.style.display = "block";
  //     // img.parentNode?.insertBefore(wrapper, img);
  //     // wrapper.appendChild(img);
  //     img.style.pageBreakInside = "avoid";
  //     img.style.breakInside = "avoid";
  //     img.style.display = "block";
  //   });

  //   //   const style = document.createElement("style");
  //   //   style.innerHTML = `
  //   //   .rtUploadImage {
  //   //     page-break-inside: avoid;
  //   //     break-inside: avoid;
  //   //   }
  //   //   .pdf_section {
  //   //     page-break-inside: avoid;
  //   //     break-inside: avoid;
  //   //   }
  //   // `;
  //   //   document.head.appendChild(style);

  //   //   const styleTag = document.createElement("style");
  //   //   styleTag.innerHTML = `
  //   //   .rtUploadImage {
  //   //     page-break-inside: avoid !important;
  //   //     break-inside: avoid !important;
  //   //   }
  //   //   .pdf_section {
  //   //     page-break-inside: avoid !important;
  //   //     break-inside: avoid !important;
  //   //   }
  //   // `;
  //   //   pdf.prepend(styleTag);

  //   html2canvas(header).then((headerCanvas) => {
  //     const doc = new jsPDF({
  //       orientation: "portrait",
  //       format: "a4",
  //       unit: "pt",
  //     });

  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     // const pageHeight = doc.internal.pageSize.getHeight();

  //     // Set the content width to fit the PDF page
  //     const scaleFactor = pageWidth / pdf.offsetWidth;
  //     console.log(scaleFactor, pageWidth);

  //     pdf.style.width = `${pageWidth + 50}px`;

  //     if (pdf) {
  //       // doc.addHTML()
  //       doc.html(pdf, {
  //         x: 10,
  //         y: 10,
  //         html2canvas: {
  //           scale: scaleFactor, // Scale content down to fit the page
  //         },
  //         margin: [100, 20, 50, 20],
  //         autoPaging: "text",
  //         // pageBreak: {
  //         //   mode: ["css", "avoid-all"], // Avoid breaking elements based on CSS and avoid page breaks where possible
  //         // },
  //         callback: async function (doc) {
  //           const pageCount = (doc as any).internal.getNumberOfPages();
  //           const pdfName = new Date();

  //           for (let i = 1; i <= pageCount; i++) {
  //             doc.setPage(i);
  //             const pageSize = doc.internal.pageSize;
  //             const currentPageHeight = pageSize.height
  //               ? pageSize.height
  //               : pageSize.getHeight();

  //             // Add page number to the bottom right corner
  //             doc.text(
  //               "Page " + String(i) + " / " + String(pageCount),
  //               doc.internal.pageSize.getWidth() - 60,
  //               currentPageHeight - 8
  //             );

  //             // Add the header on top of each page, scale it properly
  //             const headerHeight = 80; // Change this value to make the header larger
  //             const pagewidth = doc.internal.pageSize.getWidth();
  //             doc.addImage(
  //               headerCanvas,
  //               "PNG",
  //               10,
  //               10,
  //               pagewidth - 20,
  //               headerHeight
  //             );
  //           }

  //           doc.save(`${pdfName}.pdf`);
  //         },
  //       });
  //     }
  //   });
  // };

  // const generatePDFFunction = () => {
  //   const header: any = document.querySelector(".pdf_header");
  //   const pdf: any = document.querySelector("#divToPrint");

  //   // Change the font size for all <p> tags
  //   const paragraphs = pdf.querySelectorAll("p");
  //   paragraphs.forEach((p: HTMLElement) => {
  //     p.style.fontSize = "13px"; // Set your desired font size here
  //   });
  //   html2canvas(header).then((headerCanvas) => {
  //     const doc = new jsPDF({
  //       orientation: "portrait",
  //       format: "a4",
  //       unit: "pt",
  //     });

  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const scaleFactor = pageWidth / pdf.offsetWidth;

  //     pdf.style.width = `${pageWidth + 80}px`;

  //     const sections = pdf.children; // Get all child elements of the PDF container
  //     let currentY = 10; // Starting Y position for the first element

  //     const renderSection = (section: HTMLElement) => {
  //       return new Promise<void>((resolve) => {
  //         // Use the jsPDF html method to render the section
  //         doc.html(section, {
  //           x: 10,
  //           y: currentY,
  //           html2canvas: {
  //             scale: scaleFactor,
  //           },
  //           margin: [100, 0, 20, 20],
  //           // autoPaging: "text",
  //           callback: function () {
  //             currentY += section.offsetHeight + 10; // Update the current Y position for the next section
  //             resolve();
  //           },
  //         });
  //       });
  //     };

  //     (async () => {
  //       for (const section of sections) {
  //         const isAppendix = section.classList.contains("appendix");
  //         const sectionHeight = section.offsetHeight;

  //         // Check if we need to add a new page
  //         if (
  //           (doc as any).internal.getCurrentPageInfo().pageHeight <
  //             10 + sectionHeight ||
  //           isAppendix
  //         ) {
  //           doc.addPage();
  //           currentY = 10; // Reset Y position for new page
  //         }

  //         await renderSection(section); // Render the section

  //         // After rendering each section, check if it's an appendix
  //         // if (isAppendix) {
  //         //   console.log("section", section);

  //         //   // If it's an appendix, check if we need to add a new page
  //         //   doc.addPage();
  //         //   currentY = 10; // Reset Y position for new page
  //         // }
  //       }

  //       // After rendering all sections, add header and page numbers
  //       const pageCount = (doc as any).internal.getNumberOfPages();

  //       for (let i = 1; i <= pageCount; i++) {
  //         doc.setPage(i);
  //         const pageSize = doc.internal.pageSize;
  //         const currentPageHeight = pageSize.height
  //           ? pageSize.height
  //           : pageSize.getHeight();
  //         // Add page number to the bottom right corner
  //         doc.text(
  //           "Page " + String(i) + " / " + String(pageCount),
  //           doc.internal.pageSize.getWidth() - 60,
  //           currentPageHeight - 8
  //         );
  //         // Add the header on top of each page
  //         const headerHeight = 80;
  //         const pagewidth = doc.internal.pageSize.getWidth();
  //         doc.addImage(
  //           headerCanvas,
  //           "PNG",
  //           10,
  //           10,
  //           pagewidth - 20,
  //           headerHeight
  //         );
  //       }
  //       // Save the PDF
  //       doc.save(`Document.pdf`);
  //     })();
  //   });
  // };

  return (
    <>
      {/* <button
        type="button"
        onClick={() => {
          generatePDFFunction();
        }}
      >
        PDF
      </button> */}
      {loader ? (
        <div>
          <CircularSpinner />
        </div>
      ) : allSectionContent.length > 0 ? (
        <div>
          {pdfHeaderSection !== "" && (
            <div>
              <div
                style={{ marginLeft: "20px" }}
                dangerouslySetInnerHTML={{ __html: pdfHeaderSection }}
              />
            </div>
          )}
          <div id="divToPrint" ref={contentRef}>
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
