/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import DefaultButton from "../../common/Buttons/DefaultButton";
require("../../../../../../node_modules/html2pdf.js/dist/html2pdf.bundle.min.js");
// import DefaultButton from "../../common/Buttons/DefaultButton";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import ContentEditor from "../../ContentDevelopment/SectionContent/ContentEditor/ContentEditor";
// import styles from "./PDFServiceTemplate.module.scss";

const PDFServiceTemplate = (parsedJSON: any): JSX.Element => {
  const pdfRef: any = useRef();
  const sortedArray = parsedJSON.parsedJSON.sort(
    (a: any, b: any) => parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
  );
  const [points, setPoints] = useState<any[]>(parsedJSON);
  console.log(parsedJSON, points, sortedArray);

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

  const generatePdf = async () => {
    const element = pdfRef.current.innerHTML;
    let HTMLContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Page Title</title>
      </head>
      <body>
        ${element}
        ${element}
        ${element}
        ${element}
      </body>
      </html>`;
    console.log(HTMLContent);
    debugger;

    setTimeout(() => {
      html2pdf()
        .from(element)
        .set({
          margin: [20, 20, 20, 20],
          filename: "testPDF",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            //   dpi: 96,
            scale: 1,
            //   scrollX: 0,
            //   scrollY: 0,
            backgroundColor: "#FFF",
          },
          jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
          pagebreak: { before: ".page-break", avoid: ["img", "tr"] },
        })
        .save();
    }, 3000);

    // await html2pdf()
    //   .from(element)
    //   .set({
    //     margin: [20, 20, 20, 20],
    //     filename: "testPDF",
    //     image: { type: "jpeg", quality: 0.98 },
    //     html2canvas: {
    //       //   dpi: 96,
    //       scale: 1,
    //       //   scrollX: 0,
    //       //   scrollY: 0,
    //       backgroundColor: "#FFF",
    //     },
    //     jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    //     pagebreak: { before: ".page-break", avoid: ["img", "tr"] },
    //   })
    //   .save();
    //   .toPdf()
    //   .get("pdf")
    //   .then(async (pdf: any) => {
    //     let totalPages = pdf.internal.getNumberOfPages();
    //     for (let i = 1; i <= totalPages; i++) {
    //       await pdf.setPage(i);
    //       await pdf.setFontSize(10);
    //       await pdf.setTextColor(150);
    //       // await pdf.addImage(_PDFHeaderImg, "JPG", 0, 0, 560, 120);
    //       // await pdf.addImage(_PDFFooderImg, "JPG", 0, 732, 560, 120);

    //       if (totalPages === i) {
    //         let pdfData = pdf.output("blob");
    //         console.log(pdfData);

    //         //   pdfData["name"] = `${
    //         //     bidderSuggestionData[j].supplierName
    //         //       ? bidderSuggestionData[j].supplierName
    //         //       : "Test"
    //         //   }.pdf`;
    //         //   await _addDoc(pdfData, type, j, _curSupplierArr.length);
    //       }
    //     }
    //   });
  };

  //   const generatePdf = async () => {
  //     const element = pdfRef.current;
  //     const canvas = await html2canvas(element, { scale: 2 });
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("documentmain.pdf");
  //   };

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
      <div style={{ height: "100%" }} ref={pdfRef}>
        {points.length > 1 &&
          points?.map((item: any, idx: number) => (
            <div key={idx}>
              <h2>
                {idx + 1}.{item.text}
              </h2>
              {typeof item.value === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: item.value }} />
              ) : (
                item.value.map((list: any, index: number) => {
                  const indent = list.text.split(".").length - 1;
                  console.log(indent);
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
                          borderLeft: `1px solid ${
                            i === 1 ? `transparent` : `#adadad60`
                          }`,
                          height: "136%",
                        }}
                      />
                    );
                  }
                  return (
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
                  );
                })
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default memo(PDFServiceTemplate);
