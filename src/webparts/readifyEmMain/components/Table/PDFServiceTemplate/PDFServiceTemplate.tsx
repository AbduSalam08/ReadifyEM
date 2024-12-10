/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { memo, useEffect, useState } from "react";
import styles from "./PDFServiceTemplate.module.scss";
import "./PDFServiceTemplate.css";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import { getDocumentRelatedSections } from "../../../../../services/PDFServices/PDFServices";
import React from "react";
import { useSelector } from "react-redux";
// import { sp } from "@pnp/sp";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";
const htmlToPdfmake = require("html-to-pdfmake") as any;
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
// import htmlToPdfmake from "html-to-pdfmake";
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts?.pdfMake?.vfs;
// import { graph } from "@pnp/graph/presets/all";
import "@pnp/graph/users";
import { sp } from "@pnp/sp/presets/all";

interface Iprops {
  documentId: number;
  documentDetails: any;
}

const PDFServiceTemplate: React.FC<Iprops> = ({
  documentId,
  documentDetails,
}) => {
  const siteUrl: any = useSelector(
    (state: any) => state?.MainSPContext?.siteUrl
  );
  console.log("siteUrl", siteUrl);

  const [allSectionContent, setAllSectionContent] = useState<any[]>([]);
  const [headerAndFooterDetails, setHeaderAndFooterDetails] = useState<any>({
    imageBase64: "",
    documentName: "",
    documentVersion: "",
    templateType: "",
    lastReviewDate: "",
    nextReviewDate: "",
    createdDate: "",
    footerTitle: "",
  });
  const [isPDFGenerate, setIsPDFGenerate] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [pdfLoader, setPdfLoader] = useState<boolean>(false);
  console.log("headerDetails", headerAndFooterDetails);
  console.log("allSectionContent", allSectionContent);

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
      const parser = new DOMParser();
      const doc = parser.parseFromString(point.value, "text/html");
      const pElement: any = doc.querySelector("p");

      // Create the span element from inputValue
      const spanElement = parser
        .parseFromString(`<span>${point.text}. </span>`, "text/html")
        .querySelector("span");

      // Insert the span at the beginning of the paragraph
      if (pElement && spanElement) {
        pElement.insertBefore(spanElement, pElement.firstChild);
      }

      // Serialize the updated content back to HTML
      const updatedValue = pElement.outerHTML;

      return (
        <div key={point.text}>
          <div
            id={`margin${marginLeft}`}
            style={{ display: "flex", alignItems: "center" }}
            key={index}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: updatedValue,
              }}
            />
          </div>
          {point.children.length > 0 &&
            renderPoints(point.children, currentPath)}
        </div>
      );
    });
  };

  const processToPDF = async (): Promise<any> => {
    // try {
    //   debugger;
    //   // Ensure the user is authenticated
    //   const me = await graph.me();
    //   console.log(me);

    //   // Email details
    //   const email: any = {
    //     message: {
    //       subject: "Hello from SPFx and Graph API",
    //       body: {
    //         contentType: "HTML",
    //         content:
    //           "<p>This is a test email sent using Microsoft Graph API.</p>",
    //       },
    //       toRecipients: [
    //         {
    //           emailAddress: {
    //             address: "maasi@mydomain28.onmicrosoft.com",
    //           },
    //         },
    //       ],
    //       ccRecipients: [
    //         // {
    //         //   emailAddress: {
    //         //     address: "venkat@mydomain28.onmicrosoft.com",
    //         //   },
    //         // },
    //       ],
    //     },
    //     saveToSentItems: "true", // Save a copy to the sender's Sent Items
    //   };

    //   // Send the email using Graph API
    //   await graph.me.sendMail(email);
    //   console.log("Email sent successfully!");
    // } catch (error) {
    //   console.error("Error sending email:", error);
    // }

    const sectionElements = document.querySelector("#divToPrint");
    if (sectionElements) {
      const htmlContent = sectionElements.innerHTML;
      // Parse and clean the HTML
      const container = document.createElement("div");
      container.innerHTML = htmlContent;
      const cleanHtml = (node: any) => {
        const children = [...node.childNodes];
        children.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE && !child.nodeValue.trim()) {
            node.removeChild(child);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            cleanHtml(child);
          }
        });
      };
      await cleanHtml(container);

      const cleanedHtml = container.innerHTML;

      const pdfContent = await htmlToPdfmake(cleanedHtml);

      pdfContent?.forEach((obj: any, index: number) => {
        if (
          obj?.id?.includes("pageBreakBefore") &&
          obj?.stack[0].text === "Change Record"
        ) {
          pdfContent[index].stack[1].stack[0].stack[0].table.widths = [
            "10%",
            "20%",
            "30%",
            "20%",
            "20%",
          ];
        }
      });

      // Function to add page break to elements with the "pageBreakBefore" class
      const applyPageBreak = (content: any): any => {
        content.forEach((item: any) => {
          if (item.id && item.id.includes("pageBreakBefore")) {
            item.pageBreak = "before";
          }
          if (item.id && item.id.includes("sectionStart")) {
            item.margin = [20, 0, 0, 10];
          }
          if (item.id && item.id.startsWith("definitionValue")) {
            item.margin = [22, 10, 0, 10];
          }
          if (item.id && item.id.startsWith("margin")) {
            const marginLeft = parseInt(item.id.replace("margin", ""), 10) || 0;
            item.margin = item.margin || [0, 0, 0, 0];
            item.margin[0] = marginLeft;
          }
          if (item.stack) {
            applyPageBreak(item.stack); // Recursively process child elements
          }
        });
      };

      // Apply page break logic
      await applyPageBreak(pdfContent);

      // Convert Data URL to Blob
      const dataUrlToBlob = (dataUrl: any) => {
        const byteString = atob(dataUrl.split(",")[1]);
        const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const buffer = new ArrayBuffer(byteString.length);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < byteString.length; i++) {
          view[i] = byteString.charCodeAt(i);
        }

        return new Blob([buffer], { type: mimeString });
      };

      const documentDefinition = {
        header: (currentPage: any, pageCount: any) => {
          return {
            table: {
              widths: ["23%", "46%", "31%"], // Adjust the widths as needed
              body: [
                [
                  {
                    image: headerAndFooterDetails?.imageBase64,
                    fit: [90, 50], // Adjust the size of the image
                    alignment: "center",
                    border: [true, true, true, true], // Apply borders to all sides
                    margin: [0, 5, 0, 0],
                  },
                  {
                    stack: [
                      {
                        text: headerAndFooterDetails?.documentName,
                        style: "documentTitleStyle",
                        alignment: "center",
                      },
                      {
                        text: `Version : ${headerAndFooterDetails?.documentVersion}`,
                        style: "versionStyle",
                        alignment: "center",
                      },
                    ],
                    border: [true, true, true, true],
                    margin: [0, 5, 0, 0],
                    alignment: "center", // Vertically align content
                    // height: 70, // Set a fixed height for vertical alignment
                  },
                  {
                    table: {
                      widths: ["37%", "63%"],
                      body: [
                        [
                          {
                            text: "Type",
                            bold: true,
                            fontSize: 9,
                            alignment: "start",
                          },
                          {
                            text: headerAndFooterDetails?.templateType,
                            bold: false,
                            fontSize: 9,
                            alignment: "start",
                          },
                        ],
                        [
                          {
                            text: "Created on",
                            bold: true,
                            fontSize: 9,
                            alignment: "start",
                          },
                          {
                            text: headerAndFooterDetails?.createdDate,
                            fontSize: 9,
                            alignment: "start",
                          },
                        ],
                        [
                          {
                            text: "Last review",
                            bold: true,
                            fontSize: 9,
                            alignment: "start",
                          },
                          {
                            text: headerAndFooterDetails?.lastReviewDate,
                            fontSize: 9,
                            alignment: "start",
                          },
                        ],
                        [
                          {
                            text: "Next review",
                            bold: true,
                            fontSize: 9,
                            alignment: "start",
                          },
                          {
                            text: headerAndFooterDetails?.nextReviewDate,
                            fontSize: 9,
                            alignment: "start",
                          },
                        ],
                      ],
                    },
                    alignment: "",
                    layout: {
                      hLineWidth: (i: any) => 0,
                      vLineWidth: (i: any) => 0,
                      hLineColor: () => "black",
                      vLineColor: () => "black",
                    },
                    margin: [0, 0, 0, 0],
                    border: [true, true, true, true], // Apply borders to the outer table
                    // margin: [5, 5, 5, 5],
                  },
                ],
              ],
            },
            layout: {
              defaultBorder: true, // Ensures all cells have borders
            },
            margin: [30, 20, 30, 5],
          };
        },
        footer: (currentPage: any, pageCount: any) => {
          return [
            {
              columns: [
                {
                  text: headerAndFooterDetails?.footerTitle,
                  style: "headerStyle",
                  width: "50%",
                  alignment: "left",
                  margin: [30, 5, 0, 0],
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  style: "headerStyle",
                  width: "50%",
                  alignment: "right",
                  margin: [0, 5, 30, 0],
                },
              ],
            },
          ];
        },
        pageMargins: [30, 100, 30, 50],
        content: await pdfContent,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          paragraph: {
            fontSize: 12,
            lineHeight: 1.2,
            margin: [0, 5, 0, 5],
          },
          documentTitleStyle: {
            fontSize: 17,
            bold: true,
          },
          versionStyle: {
            fontSize: 10,
          },
          changeRecordTable: {
            margin: [0, 10, 0, 10],
          },
        },
      };
      const pdfDocGenerator = await pdfMake.createPdf(documentDefinition);

      await pdfDocGenerator.getDataUrl(async (dataUrl: string) => {
        if (!dataUrl) {
          console.log("Failed to generate data URL for the PDF.");
          return;
        }
        const pdfBlob = dataUrlToBlob(dataUrl);
        if (documentDetails?.url) {
          const filePath = `${documentDetails?.url?.split(`${siteUrl}/`)[1]}`;
          // const filePath =
          //   "AllDocuments/Header Issue/Header Image Issue_2.0.pdf";

          // Replace (or upload) the file in the SharePoint library
          const result = await sp.web
            .getFolderByServerRelativeUrl(LISTNAMES.AllDocuments)
            .files.add(filePath, pdfBlob, true);

          console.log("result", result);
        } else {
          console.log("Not Uploaded");
        }
        const iframeContainer = document.querySelector("#iframeContainer");

        if (!iframeContainer) {
          console.error("Iframe container not found.");
          return;
        }

        const iframe = document.createElement("iframe");
        iframe.src = dataUrl;
        iframe.name = `${headerAndFooterDetails?.documentName}_${headerAndFooterDetails?.documentVersion}`;
        iframe.style.width = "100%";
        iframe.style.height = "500px";
        iframeContainer.appendChild(iframe);
        setPdfLoader(false);
      });

      if (
        documentDetails?.fields?.status.toLowerCase() === "approved" &&
        !documentDetails?.isPdfGenerated
      ) {
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.AllDocuments,
          ID: documentDetails?.fileID,
          RequestJSON: {
            isPdfGenerated: true,
          },
        });
        // await pdfDocGenerator.getDataUrl(async (dataUrl: string) => {
        //   if (!dataUrl) {
        //     console.log("Failed to generate data URL for the PDF.");
        //     return;
        //   }
        //   const pdfBlob = dataUrlToBlob(dataUrl);

        //   const filePath = `${documentDetails?.url?.split(`${siteUrl}/`)[1]}`;

        //   // Replace (or upload) the file in the SharePoint library
        //   const result = await sp.web
        //     .getFolderByServerRelativeUrl(LISTNAMES.AllDocuments)
        //     .files.add(filePath, pdfBlob, true);

        //   console.log("result", result);

        //   await SpServices.SPUpdateItem({
        //     Listname: LISTNAMES.AllDocuments,
        //     ID: documentDetails?.fileID,
        //     RequestJSON: {
        //       isPdfGenerated: true,
        //     },
        //   });
        // });
      }
    } else {
      console.error("HTML element not found.");
    }
  };

  // const renderPointsHtml = (arr: any[], parentPath: number[] = []): any => {
  //   return arr.map((point, index) => {
  //     // Calculate the current path for this point (parent path + current index)
  //     const currentPath = [...parentPath, index];

  //     // Determine the indent level based on the length of the parent path
  //     const indentLevel = parentPath.length;
  //     const marginLeft = indentLevel * 31; // Adjust this value for appropriate spacing
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(point.value, "text/html");
  //     const pElement: any = doc.querySelector("p");

  //     // Create the span element from inputValue
  //     const spanElement = parser
  //       .parseFromString(`<span>${point.text}. </span>`, "text/html")
  //       .querySelector("span");

  //     // Insert the span at the beginning of the paragraph
  //     if (pElement && spanElement) {
  //       pElement.insertBefore(spanElement, pElement.firstChild);
  //     }

  //     // Serialize the updated content back to HTML
  //     const updatedValue = pElement.outerHTML;

  //     return `<div key={point.text}>
  //         <div
  //           id="margin${marginLeft}"
  //           style={{ display: "flex", alignItems: "center" }}
  //           key={index}
  //         >
  //           <span>${updatedValue}</span>
  //         </div>
  //         ${
  //           point.children.length > 0 &&
  //           renderPointsHtml(point.children, currentPath)
  //         }
  //       </div>`;
  //   });
  // };

  // const bindHTML = () => {
  //   let htmlContent = "";
  //   htmlContent += "<div>";
  //   allSectionContent?.forEach((obj: any, index: number) => {
  //     htmlContent += `<div id=${
  //       obj.sectionType === "appendix section" ||
  //       obj.sectionType === "change record"
  //         ? "pageBreakBefore"
  //         : ""
  //     }>`;
  //     {
  //       obj.text !== "Header" &&
  //         (htmlContent += `<span>
  //              ${
  //                obj.sectionType === "appendix section" ||
  //                obj.sectionType === "change record"
  //                  ? obj.text
  //                  : obj.sectionOrder + ". " + obj.text
  //              }
  //            </span>`);
  //     }
  //     {
  //       typeof obj.value === "string"
  //         ? (htmlContent += `<div
  //            id="sectionStart"
  //            className={${
  //              obj.sectionType === "change record" ? "changeRecordTable" : ""
  //            }}
  //        >${obj.value}</div>`)
  //         : (htmlContent += `<div id="sectionStart">${renderPointsHtml(
  //             obj.value
  //           )}</div>`);
  //     }
  //     htmlContent += "</div>";
  //   });
  //   htmlContent += "</div>";
  // };

  useEffect(() => {
    setPdfLoader(true);
    setTimeout(() => {
      processToPDF();
      // bindHTML();
    }, 2000);
    // bindPDFContents();
  }, [isPDFGenerate]);

  useEffect(() => {
    getDocumentRelatedSections(
      documentId,
      setAllSectionContent,
      setHeaderAndFooterDetails,
      setIsPDFGenerate,
      setLoader
      // setPdfHeaderSection
    );
  }, []);

  return (
    <div
    // style={{
    //   display: `${documentDetails?.documentDetailsID ? "None" : ""}`,
    // }}
    >
      {loader ? (
        <div>
          <CircularSpinner />
        </div>
      ) : allSectionContent.length > 0 ? (
        <div>
          {pdfLoader ? (
            <div>
              <CircularSpinner />
            </div>
          ) : (
            <div />
          )}
          <div id="iframeContainer" />
          <div id="divToPrint">
            {allSectionContent?.map((obj: any, index: number) => {
              return (
                <div
                  className={styles.paraSection}
                  id={
                    obj.sectionType === "appendix section" ||
                    obj.sectionType === "change record"
                      ? "pageBreakBefore"
                      : ""
                  }
                  style={{ padding: "10px 0px" }}
                  key={index}
                >
                  {obj.text !== "Header" && (
                    <span
                      style={{
                        display: "flex",
                        margin: "0px 0px 15px 0px",
                        fontSize: "22px",
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
                      id="sectionStart"
                      className={`${
                        obj.sectionType === "change record"
                          ? "changeRecordTable"
                          : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: obj.value }}
                    />
                  ) : (
                    <div id="sectionStart">{renderPoints(obj.value)}</div>
                  )}
                  {allSectionContent.length === 0 && (
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
    </div>
  );
};
export default memo(PDFServiceTemplate);
