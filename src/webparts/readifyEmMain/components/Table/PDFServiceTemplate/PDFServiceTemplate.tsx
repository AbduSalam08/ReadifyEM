/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useRef, useState } from "react";
// import html2pdf from "html2pdf.js";
import DefaultButton from "../../common/Buttons/DefaultButton";
// import { render, unmountComponentAtNode } from "react-dom";
// import { pdfFromReact } from "generate-pdf-from-react-html";
// import pdfFromReact from "./../../../../../../node_modules/generate-pdf-from-react-html/pdfFromReact";
// require("../../../../../../node_modules/html2pdf.js/dist/html2pdf.bundle.min.js");
// import DefaultButton from "../../common/Buttons/DefaultButton";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { pdfFromReact } from "generate-pdf-from-react-html";
// import ContentEditor from "../../ContentDevelopment/SectionContent/ContentEditor/ContentEditor";
// import styles from "./PDFServiceTemplate.module.scss";
import { jsPDF } from "jspdf";
// import * as jsPDF from "jspdf";
// import { jsPDF } from "jspdf";
// const jsPDF = require("jspdf") as any;
// import html2canvas from "html2canvas";

const PDFServiceTemplate = (parsedJSON: any): JSX.Element => {
  const pdfRef: any = useRef();
  const sortedArray = parsedJSON.parsedJSON.sort(
    (a: any, b: any) => parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
  );
  const [points, setPoints] = useState<any[]>(parsedJSON);
  // const [PDFData, setPDFData] = useState<any>(null);
  console.log(parsedJSON, points, sortedArray);

  // let contentArray = [
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  //   "Sample Data so ForSample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For Sample Data so For  Sample Data so For",
  // ];

  //   const renderPoint = (point: any, index: number): JSX.Element => {
  //     debugger;
  //     return (
  //       <div>
  //         <h2>{point.text}</h2>
  //         {typeof point.value === "string" ? (
  //           <p>{point.value}</p>
  //         ) : (
  //           point.value.map((list: any) => {
  //             <div>
  //               {list.text}
  //               {list.value}
  //             </div>;
  //           })
  //         )}
  //       </div>
  //     );
  // const indent = point.text.split(".").length - 1;
  // const marginLeft = (indent - 1) * 26;
  // const nestedStyle: React.CSSProperties = {
  //   marginLeft: `${marginLeft}px`,
  //   display: "flex",
  //   alignItems: "center",
  // };

  // const ancestors: JSX.Element[] = [];
  // for (let i = 1; i < indent; i++) {
  //   ancestors.push(
  //     <div
  //       key={i}
  //       style={{
  //         position: "absolute",
  //         top: `-12%`,
  //         left: `${i === 1 ? `0` : `${(i - 1) * 26}px`}`,
  //         borderLeft: `1px solid ${i === 1 ? `transparent` : `#adadad60`}`,
  //         height: "136%",
  //       }}
  //     />
  //   );
  // }
  // return (
  //   <div key={index} style={{ position: "relative" }}>
  //     <div
  //       style={nestedStyle}
  //       className={`${styles.renderedInput} renderedInput`}
  //     >
  //       {ancestors}
  //       <span style={{ marginRight: "5px" }} className={styles.pointText}>
  //         {point.text}
  //       </span>
  //       <ContentEditor
  //         editorHtmlValue={point.value}
  //         placeholder="Enter here"
  //         setEditorHtml={(html: any) => {
  //           //   handleInputChange(index, html);
  //         }}
  //       />
  //       {/* <button
  //         onClick={() => handleInputClear(index)}
  //         className="actionButtons"
  //         style={{
  //           background: "transparent",
  //           padding: "0 5px 0 0",
  //         }}
  //       >
  //         <i className="pi pi-times-circle" />
  //       </button>
  //       <button
  //         onClick={() => handleAddSubPoint(index)}
  //         className="actionButtons"
  //       >
  //         <i className="pi pi-angle-double-right" />
  //       </button> */}
  //     </div>
  //   </div>
  // );
  //   };

  //   const sortedPoints = points?.sort((a: any, b: any) => {
  //     const pointA = a?.text?.split(".")?.map(parseFloat);
  //     const pointB = b?.text?.split(".")?.map(parseFloat);

  //     for (let i = 0; i < Math.min(pointA.length, pointB.length); i++) {
  //       if (pointA[i] !== pointB[i]) {
  //         return pointA[i] - pointB[i];
  //       }
  //     }
  //     return pointA.length - pointB.length;
  //   });

  // const pdfFromReact = (
  //   target: any,
  //   name: any,
  //   orientation: any,
  //   resize: any,
  //   debug: any
  // ) => {
  //   // window.html2canvas = html2canvas;
  //   console.log(document.querySelector(target));
  //   const element = pdfRef.current;
  //   const HTMLContent = `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <title>Page Title</title>
  //       <style>
  //         body{
  //           background-color: powderblue;
  //           // width:400px;
  //         }
  //         .pdfContainer{
  //           // width:400px;
  //         }
  //         // div{
  //         //     page-break-inside: avoid;
  //         //     page-break-before: always;
  //         //     page-break-after: always;
  //         //   }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="pdfContainer">
  //         ${element.innerHTML}
  //       </div>
  //     </body>
  //     </html>`;
  //   console.log(HTMLContent);

  //   let pdf = new jsPDF(orientation, "pt", "a4");
  //   if (resize) {
  //     const targetElement = document.querySelector(target);
  //     targetElement.style.width = orientation === "p" ? "600px" : "600px";
  //     targetElement.style.margin = "20px";
  //   }
  //   pdf.html(document.querySelector(target), {
  //     callback: () => {
  //       debug ? window.open(pdf.output("bloburl")) : pdf.save(`${name}.pdf`);
  //       if (resize) {
  //         document.querySelector(target).style = "";
  //       }
  //     },
  //     html2canvas: { scale: 0.5, useCORS: true, allowTaint: true },
  //     x: 10,
  //     y: 10,
  //     width: orientation === "p" ? 500 : 500,
  //     windowWidth: 700,
  //     autoPaging: false,
  //   });
  // };

  const generatePdf = async () => {
    const input = document.querySelector(".divToPrint");
    console.log(input);

    // pdfFromReact(".divToPrint", "My-file", "portrait", true, true);

    const data = document.getElementById("divToPrint");
    // window.html2canvas = html2canvas;

    const pdf = new jsPDF("portrait", "pt", "a4");
    pdf.html(data as HTMLElement, {
      callback: function (pdf: any) {
        // Get the pages array
        // const pages = pdf.internal.pages;
        // // Reverse the pages array (skip the first unused element)
        // const reversedPages = pages.slice(1).reverse();
        // // Reconstruct the pages array
        // const updateArray = [null, ...reversedPages];

        // pdf.internal.pages = [];
        // console.log(pages, updateArray);

        // updateArray.map((obj: any, index: number) => {
        //   pdf.internal.pages.push(obj);
        // });

        // console.log(pdf.internal.pages);
        // console.log(pdf);

        setTimeout(() => {
          window.open(pdf.output("bloburl"));
        }, 3000);
        // pdf.save(`SamplePDF.pdf`);
      },
      margin: [10, 10, 10, 10],
      x: 10,
      y: 10,
      // width: 700,
      // windowWidth: 700,
      // autoPaging: true,
      html2canvas: {
        scale: 0.5,
        useCORS: true,
        allowTaint: true,
        // dpi: 300,
        letterRendering: true,
        logging: false,
      },
    });

    // const data = document.getElementById("divToPrint");
    // html2canvas(data as HTMLElement).then((canvas) => {
    //   const imgWidth = 210;
    //   const pageHeight = 295;
    //   let imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight;

    //   const imgData = canvas.toDataURL("image/png");

    //   const doc = new jsPDF("p", "mm");
    //   let position = 0;

    //   doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight + 15);
    //   heightLeft -= pageHeight;

    //   while (heightLeft >= 0) {
    //     position = heightLeft - imgHeight;
    //     doc.addPage();
    //     doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight + 15);
    //     heightLeft -= pageHeight;
    //   }
    //   doc.save("Visiometria.pdf");
    // });

    // let htmlDUplicateContent: HTMLElement = contentArray.map(
    //   (obj: any, index: number) => {
    //     return (
    //       <div key={index}>
    //         <h4>Heading</h4>
    //         <p>{obj}</p>
    //       </div>
    //     );
    //   }
    // );

    // const setContentHTML = () => {
    //   return (
    //     <div></div>
    //   )

    // }

    // html2canvas(input as HTMLElement, {
    //   scale: 2, // Higher scale for better quality
    //   useCORS: true, // Enable if your element contains images from external sources
    // }).then((canvas) => {
    //   const HTMLImageElement = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF({
    //     orientation: "portrait",
    //     unit: "px", // Changed unit to pixels for more control
    //     format: [canvas.width, canvas.height], // Set format based on canvas size
    //   });
    // const margin = 10;
    // const imgWidth = canvas.width - 2 * margin;
    // const imgHeight = canvas.height - 2 * margin;
    // pdf.html(HTMLImageElement, {
    //   callback: () => {
    //     pdf.save(`${name}.pdf`);
    //   },
    // });
    // pdf.output('dataurlnewwindow');
    // pdf.save("download.pdf");
    // setPDFData(pdf);
    // });

    // const element = pdfRef.current;
    // if (!element) {
    //   console.error("PDF content element not found.");
    //   return;
    // }
    // let HTMLContent = `
    // <!DOCTYPE html>
    // <html>
    //   <head>
    //     <title>Page Title</title>
    //   </head>
    //   <body>
    //     ${element.innerHTML}
    //     ${element.innerHTML}
    //     ${element.innerHTML}
    //     ${element.innerHTML}
    //   </body>
    //   </html>`;
    // console.log(HTMLContent);
    // const options = {
    // margin: 0,
    // filename: `${text}.pdf`,
    // image: {
    //   type: "jpeg",
    //   quality: 0.98,
    // },
    // html2canvas: {
    //   scale: 2,
    // },
    // jsPDF: {
    //   unit: "in",
    //   format: "letter",
    //   orientation: "portrait",
    // },
    //   margin: 10,
    //   filename: "my-document.pdf",
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    //   pagebreak: { mode: "avoid-all" },
    //   allowHTML: true, // Enable HTML content
    //   onBeforeDraw: (pdf: any) => {
    //     pdf.internal.styling(!pdf.internal.pdfEscape);
    //   },
    //   onAfterRender: () => {
    //     const links = document.querySelectorAll("a");
    //     links.forEach((link) => {
    //       link.addEventListener("click", (event) => {
    //         event.preventDefault();
    //         window.open(link.href, "_blank");
    //       });
    //     });
    //   },
    // };

    // Create a temporary container element
    // const container = document.createElement("div");

    // Unmount any existing component from the container
    // unmountComponentAtNode(container);

    // Render the PDFTemplate component into the container
    // in this render, any values can be added as a html template to render the given HTML to PDF.

    // render(
    //   <div dangerouslySetInnerHTML={{ __html: HTMLContent }} />,
    //   container
    // );

    // console.log("container: ", container);

    // html2pdf().html(container).set(options);
  };

  useEffect(() => {
    setPoints(parsedJSON.parsedJSON);
  }, [parsedJSON]);

  /* convert PDF file function */
  //   const _conPDFFile = (_content: string, type: string): void => {
  //     let _curSupplierArr: IBidderSuggestionGetData[] = [...bidderSuggestionData];

  //     for (let j: number = 0; _curSupplierArr.length > j; j++) {
  //       let HTMLContent = `
  //         <!DOCTYPE html>
  //         <html>
  //           <head>
  //             <title>Page Title</title>
  //             <style>
  //               .container {
  //                 width: 100%;
  //                 padding-top: 60px;
  //                 padding-bottom: 60px;
  //               }
  //               .header {
  //                   display: flex;
  //                   justify-content: flex-end;
  //                   margin: 20px 0px;
  //                 }
  //             </style>
  //           </head>
  //           <body>
  //             <div class="container">
  //               ${
  //                 type === Config.FoldersName.Success
  //                   ? `
  //                     <div class="header">
  //                       <div>
  //                         <div>
  //                           <span>Date : </span>
  //                           <span>${moment().format("DD MMMM YYYY")}</span>
  //                         </div>
  //                         <div>
  //                           <span>Ref. : </span>
  //                           <span>${props?.selObject?.contractId}</span>
  //                         </div>
  //                       </div>
  //                     </div>
  //                     <div>
  //                       <div style="margin-bottom: 20px;">
  //                         TO
  //                       </div>
  //                       <div style="margin-bottom: 20px;">
  //                         <span>ATTENTION : </span>
  //                         <span>${bidderSuggestionData[j].bidderName}</span>
  //                       </div>
  //                       <div style="margin-bottom: 50px;">
  //                         <span>BY EMAIL : </span>
  //                         <span>${bidderSuggestionData[j].email}</span>
  //                       </div>
  //                       <div style="margin-bottom: 50px;">
  //                         Dear Sir/Madam,
  //                       </div>
  //                       <div style="margin-bottom: 50px;">
  //                         <span>SUBJECT : </span>
  //                         <span>LETTER OF SUCCESS – ${
  //                           bidderSuggestionData[j].contactName
  //                         }</span>
  //                       </div>
  //                       <div style="margin-bottom: 50px;">
  //                         ${_content}
  //                       </div>
  //                       <div style="margin-bottom: 100px;">
  //                         <div>
  //                           Yours faithfully,
  //                         </div>
  //                         <div>
  //                         </div>
  //                       </div>
  //                       <div style="border: 1px solid; width: 35%;"></div>
  //                       <div>Duly authorized agent</div>
  //                       <div style="margin-bottom: 150px;">
  //                         <span>DATE : </span>
  //                         <span></span>
  //                       </div>
  //                       <div>
  //                         Signed as duly authorized to act on behalf of ${
  //                           bidderSuggestionData[j].bidderName
  //                         }
  //                       </div>
  //                     </div>
  //                   `
  //                   : `
  //                     <div>
  //                       <div style="margin-bottom: 20px;">
  //                         <span>TO : </span>
  //                         <span>${bidderSuggestionData[j].supplierName}</span>
  //                       </div>
  //                       <div style="margin-bottom: 20px;">
  //                         <span>From : </span>
  //                         <span>KAMOA COPPER S.A.</span>
  //                       </div>
  //                       <div style="margin-bottom: 20px;">
  //                         <span>Date : </span>
  //                         <span></span>
  //                       </div>
  //                       <div style="margin-bottom: 50px;">
  //                         <span>SUBJECT : </span>
  //                         <span>${props?.selObject?.contractId} – ${bidderSuggestionData[j].contactName}</span>
  //                       </div>
  //                       <div style="margin-bottom: 50px;">
  //                         Dear Sir/Madam,
  //                       </div>
  //                       <div style="margin-bottom: 50px;">
  //                         ${_content}
  //                       </div>
  //                       <div style="margin-bottom: 100px;">
  //                         <div>
  //                           Kind Regards,
  //                         </div>
  //                         <div>
  //                         </div>
  //                       </div>
  //                       <div>Duly authorized agent</div>
  //                       <div style="margin-bottom: 150px;">
  //                         <div>Chief Executive Commercial</div>
  //                       </div>
  //                     </div>
  //                   `
  //               }
  //             </div>
  //           </body>
  //         </html>`;

  //       const _PDFHeaderImg: any = require("../../../../assets/Images/HeaderIMG.jpg");
  //       const _PDFFooderImg: any = require("../../../../assets/Images/FooderIMG.jpg");

  //       html2pdf()
  //         .from(HTMLContent)
  //         .set({
  //           margin: [80, 50, 50, 50],
  //           filename: bidderSuggestionData[j].supplierName,
  //           image: { type: "jpeg", quality: 0.98 },
  //           html2canvas: {
  //             dpi: 96,
  //             scale: 2.5,
  //             scrollX: 0,
  //             scrollY: 0,
  //             backgroundColor: "#FFF",
  //           },
  //           jsPDF: { unit: "pt", format: "a4", orientation: "p" },
  //           pagebreak: { before: ".page-break", avoid: ["img", "tr"] },
  //         })
  //         .toPdf()
  //         .get("pdf")
  //         .then(async (pdf: any) => {
  //           let totalPages = pdf.internal.getNumberOfPages();
  //           for (let i = 1; i <= totalPages; i++) {
  //             await pdf.setPage(i);
  //             await pdf.setFontSize(10);
  //             await pdf.setTextColor(150);
  //             await pdf.addImage(_PDFHeaderImg, "JPG", 0, 0, 560, 120);
  //             await pdf.addImage(_PDFFooderImg, "JPG", 0, 732, 560, 120);

  //             if (totalPages === i) {
  //               let pdfData = pdf.output("blob");
  //               pdfData["name"] = `${
  //                 bidderSuggestionData[j].supplierName
  //                   ? bidderSuggestionData[j].supplierName
  //                   : "Test"
  //               }.pdf`;
  //               await _addDoc(pdfData, type, j, _curSupplierArr.length);
  //             }
  //           }
  //         });
  //     }
  //   };

  return (
    <>
      <div>
        <DefaultButton text="PDF" btnType="primary" onClick={generatePdf} />
      </div>
      {/* <div
        style={{ height: "100%", width: "100%" }}
        ref={pdfRef}
        className="divToPrint"
        id="divToPrint"
      >
        {points.length > 1 &&
          points?.map((item: any, idx: number) => (
            <div
              key={idx}
              style={{
                pageBreakInside: "avoid",
                pageBreakBefore: "always",
                pageBreakAfter: "always",
              }}
            >
              <h2 style={{ margin: "10px 0px" }}>
                {idx + 1}.{item.text}
              </h2>
              {typeof item.value === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: item.value }} />
              ) : (
                item.value.map((list: any, index: number) => {
                  const indent = list.text.split(".").length - 1;
                  console.log(indent);
                  const marginLeft = (indent + 1 - 1) * 26;
                  const nestedStyle: React.CSSProperties = {
                    marginLeft: `${marginLeft}px`,
                    display: "flex",
                    alignItems: "center",
                    paddingBottom: "10px",
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
                          borderLeft: `1px solid ${
                            i === 1 ? `transparent` : `#adadad60`
                          }`,
                          height: "136%",
                        }}
                      />
                    );
                  }
                  return (
                    list.value !== "" && (
                      <div
                        style={nestedStyle}
                        key={index}
                        // style={{ display: "flex" }}
                      >
                        {ancestors}
                        <span
                          style={{ marginRight: "5px" }}
                          //   className={styles.pointText}
                        >
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
            </div>
          ))}
      </div> */}
      <table
        style={{ height: "100%", width: "100%" }}
        ref={pdfRef}
        className="divToPrint"
        id="divToPrint"
      >
        <tbody>
          {points.length > 1 &&
            points?.map((item: any, idx: number) => (
              <tr
                key={idx}
                style={{
                  pageBreakInside: "avoid",
                  pageBreakBefore: "always",
                  pageBreakAfter: "always",
                }}
              >
                <h2 style={{ margin: "10px 0px" }}>
                  {idx + 1}.{item.text}
                </h2>
                {typeof item.value === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: item.value }} />
                ) : (
                  item.value.map((list: any, index: number) => {
                    const indent = list.text.split(".").length - 1;
                    console.log(indent);
                    const marginLeft = (indent + 1 - 1) * 26;
                    const nestedStyle: React.CSSProperties = {
                      marginLeft: `${marginLeft}px`,
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: "10px",
                    };
                    // const ancestors: JSX.Element[] = [];
                    // for (let i = 1; i < indent; i++) {
                    //   ancestors.push(
                    //     <div
                    //       key={i}
                    //       style={{
                    //         position: "absolute",
                    //         top: `-12%`,
                    //         left: `${i === 1 ? `0` : `${(i - 1) * 26}px`}`,
                    //         borderLeft: `1px solid ${
                    //           i === 1 ? `transparent` : `#adadad60`
                    //         }`,
                    //         height: "136%",
                    //       }}
                    //     />
                    //   );
                    // }
                    return (
                      list.value !== "" && (
                        <div
                          style={nestedStyle}
                          key={index}
                          // style={{ display: "flex" }}
                        >
                          {/* {ancestors} */}
                          <span
                            style={{ marginRight: "5px" }}
                            //   className={styles.pointText}
                          >
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
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

// import * as React from "react";
// import { render, unmountComponentAtNode } from "react-dom";
// import { memo, useState } from "react";
// // import html2pdf from "html2pdf.js";
// const html2pdf: any = require("html2pdf.js");
// // import { saveAs } from "file-saver";
// // import html2canvas from "html2canvas";
// import PDFTemplate from "./PDFTemplate";
// import MainEditor from "../ReactQuill/MainEditor";
// import PDFViewer from "../PDFViewer/PDFViewer.jsx";

// const PDFServiceTemplate: React.FC = () => {
//   const [text, setText] = useState<string>("");
//   // const [image, setImage] = useState<File | null>(null);
//   const [HTMLText, setHTMLText] = useState<any>(null);
//   const [PDFData, setPDFData] = useState<any>(null);
//   console.log("PDFData: ", PDFData);
//   console.log("HTMLText: ", HTMLText);

//   // const inp = useRef(null);
//   const handleTextChange = (e: any): any => {
//     setText(e.target.value);
//   };

//   // const handleImageChange = (e: any): void => {
//   //   const file = e.target.files && e.target.files[0];
//   //   setImage(file);
//   // };

//   //   const generatePdf = async () => {
//   //     const options = {
//   //       margin: 0,
//   //       filename: `${text}.pdf`,
//   //       image: {
//   //         type: "jpeg",
//   //         quality: 0.98,
//   //       },
//   //       html2canvas: {
//   //         scale: 2,
//   //       },
//   //       jsPDF: {
//   //         unit: "in",
//   //         format: "letter",
//   //         orientation: "portrait",
//   //       },
//   //     };
//   //     html2pdf().from(inp.current).set(options).save();
//   //   };

//   const generatePdf = async () => {
//     const options = {
//       // margin: 0,
//       // filename: `${text}.pdf`,
//       // image: {
//       //   type: "jpeg",
//       //   quality: 0.98,
//       // },
//       // html2canvas: {
//       //   scale: 2,
//       // },
//       // jsPDF: {
//       //   unit: "in",
//       //   format: "letter",
//       //   orientation: "portrait",
//       // },
//       margin: 10,
//       filename: "my-document.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       pagebreak: { mode: "avoid-all" },
//       allowHTML: true, // Enable HTML content
//       onBeforeDraw: (pdf: any) => {
//         pdf.internal.styling(!pdf.internal.pdfEscape);
//       },
//       onAfterRender: () => {
//         const links = document.querySelectorAll("a");
//         links.forEach((link) => {
//           link.addEventListener("click", (event) => {
//             event.preventDefault();
//             window.open(link.href, "_blank");
//           });
//         });
//       },
//     };

//     // Create a temporary container element
//     const container = document.createElement("div");

//     // Unmount any existing component from the container
//     unmountComponentAtNode(container);

//     // Render the PDFTemplate component into the container
//     // in this render, any values can be added as a html template to render the given HTML to PDF.

//     render(
//       <PDFTemplate childData={HTMLText} text={text} image={undefined} />,
//       container
//     );

//     console.log("container: ", container);

//     html2pdf().from(container).set(options).save();

//     // Generate PDF from the container content
//     // let pdfFile = html2pdf()
//     //   .from(container)
//     //   .set(options)
//     //   .outputPdf("blob", "my-invoice.pdf");

//     // Clean up: remove the container from the DOM
//     // unmountComponentAtNode(container);

//     try {
//       // Generate PDF data
//       const pdfFile = await html2pdf().from(container).set(options).outputPdf();
//       console.log(pdfFile);

//       // converting Unit8Array to Blob
//       const blob = new Blob([pdfFile], { type: "application/pdf" });

//       // Create a File object from the Blob
//       const pdfFileObject = new File([blob], "your_file_name.pdf", {
//         type: "application/pdf",
//       });
//       setPDFData(pdfFileObject);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//   };

//   return (
//     <>
//       <div>
//         <label>
//           File name:
//           <input type="text" value={text} onChange={handleTextChange} />
//         </label>
//         <MainEditor
//           placeholder="Enter Here..."
//           setEditorHtml={setHTMLText}
//           editorHtmlValue={HTMLText}
//         />
//       </div>
//       {/* <div>
//         <label>
//           Choose Image:
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//         </label>
//       </div> */}
//       <button onClick={generatePdf}>Generate PDF</button>

//       {/* <button onClick={generatePdf}>View PDF</button> */}

//       {PDFData !== null ? <PDFViewer fileSrc={<h1>Hello World !</h1>} /> : ""}

//       {/* <div ref={inp}>
//         <PDFTemplate text={text} image={image ? image : undefined} />
//       </div> */}
//     </>
//   );
// };

// export default PDFGenerator;

export default memo(PDFServiceTemplate);
