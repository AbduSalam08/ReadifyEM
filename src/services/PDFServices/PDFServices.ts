/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
// /* eslint-disable @typescript-eslint/no-var-requires */

import { base64Data, LISTNAMES } from "../../config/config";
import { store } from "../../redux/store/store";
import getLastReviewDate from "../../utils/contentDevelopementUtils";
import { getPreviousVersionDoc } from "../ContentDevelopment/CommonServices/CommonServices";
// import { setSectionsAttachments } from "../../redux/features/PDFServicceSlice";
import SpServices from "../SPServices/SpServices";
// const sampleDocHeaderImg: any = require("../../assets/images/png/imagePlaceholder.png");

// const findMaxSectionOrder = (arr1: any[], arr2: any[]): number => {
//   // Combine both arrays
//   const combinedArray = [...arr1, ...arr2];

//   // If combined array is empty, return 1 as the starting order
//   if (combinedArray.length === 0) return 1;

//   // Find the maximum sectionOrder value
//   const maxOrderObject = combinedArray.reduce(
//     (maxObj, currentObj) => {
//       // Check if sectionOrder exists and is a valid number, else set to -Infinity for comparison
//       const currentOrder = parseInt(currentObj.sectionOrder, 10) || -Infinity;
//       const maxOrder = parseInt(maxObj.sectionOrder, 10) || -Infinity;

//       // Return the object with the higher sectionOrder
//       return currentOrder > maxOrder ? currentObj : maxObj;
//     },
//     { sectionOrder: "-Infinity" }
//   ); // Initialize with a default object to prevent errors

//   // Parse the final max section order and increment by 1, ensuring it starts from 1 if no valid max was found
//   const maxOrderValue = parseInt(maxOrderObject.sectionOrder, 10);
//   return isNaN(maxOrderValue) ? 1 : maxOrderValue + 1;
// };

const readTextFileFromTXT = (
  data: any,
  length: number,
  index: number,
  setAllSectionContent: any,
  // setPdfHeaderSection: any,
  setIsPDFGenerate: any,
  setLoader: any
): void => {
  SpServices.SPReadAttachments({
    ListName: "SectionDetails",
    ListID: data.ID,
    AttachmentName: data?.FileName,
  })
    .then((res: any) => {
      const parsedValue: any = JSON.parse(res);
      const sectionDetails = {
        text: data.sectionName,
        sectionOrder: data.sectionOrder,
        sectionType: data.sectionType,
        value: parsedValue,
      };
      if (data.sectionType === "pdf header") {
        // setPdfHeaderSection([sectionDetails]);
      }
      setAllSectionContent((prev: any) => {
        // Add the new sectionDetails to the previous state

        const updatedSections = [...prev, sectionDetails];

        // const headerSectionArray = updatedSections?.filter(
        //   (obj: any) => obj.sectionType === "header section"
        // );
        const defaultSectionsArray = updatedSections
          ?.filter(
            (obj: any) =>
              obj.sectionType === "default section" ||
              obj.sectionType === "references section"
          )
          .sort((a, b) => {
            return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
          });
        const normalSectionsArray = updatedSections
          ?.filter((obj: any) => obj.sectionType === "normal section")
          .sort((a, b) => {
            return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
          });
        // const referenceSectionArray = updatedSections
        //   ?.filter((obj: any) => obj.sectionType === "references section")
        //   .sort((a, b) => {
        //     return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
        //   });
        // if (referenceSectionArray.length !== 0) {
        //   referenceSectionArray[0] = {
        //     ...referenceSectionArray[0],
        //     sectionOrder: findMaxSectionOrder(
        //       defaultSectionsArray,
        //       normalSectionsArray
        //     ),
        //   };
        // }
        const appendixSectionsArray = updatedSections
          ?.filter((obj: any) => obj.sectionType === "appendix section")
          .sort((a, b) => {
            return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
          });
        const changeRecordSectionArray = updatedSections
          ?.filter((obj: any) => obj.sectionType === "change record")
          .sort((a, b) => {
            return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
          });
        if (changeRecordSectionArray.length !== 0) {
          changeRecordSectionArray[0] = {
            ...changeRecordSectionArray[0],
            sectionOrder: 1 + appendixSectionsArray.length,
          };
        }

        // Sort the updatedSections array by the "sectionOrder" key
        // updatedSections.sort((a, b) => {
        //   return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
        // });

        // Return the sorted array to update the state
        return [
          // ...headerSectionArray,
          ...defaultSectionsArray,
          ...normalSectionsArray,
          // ...referenceSectionArray,
          ...appendixSectionsArray,
          ...changeRecordSectionArray,
        ];
      });
      if (index + 1 === length) {
        setLoader(false);
        setIsPDFGenerate(true);
      }
      return sectionDetails;
    })
    .catch((err: any) => {
      console.log("Error : ", err);
    });
};

export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const bindHeaderTable = async (
  sectionDetails: any,
  docDetails: any,
  lastReviewDate: any
): Promise<string> => {
  const base64Image = base64Data.headerImage;

  let pdfHeaderTable = "";
  pdfHeaderTable = `<table class="pdf_header" style="width:100%;border: 1px solid black;">
          <tbody>`;

  pdfHeaderTable += `<tr>
                <td style="width:20%; padding:6px; text-align: center;vertical-align: middle;">
                  <table style="width: 100%; height: 95px; border-collapse: collapse;">
                    <tr>
                      <td style="text-align: center; vertical-align: middle;">
                        <img width="90" height= "90" style="padding:1px;vertical-align: middle;" src="${
                          sectionDetails?.base64 !== ""
                            ? sectionDetails?.base64
                            : base64Image
                        }" alt="doc header logo" />
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="width: 50%;font-size: 11px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border-left: 1px solid #000;border-right: 1px solid #000;">
                    <p style="font-size: 24px;font-family: interMedium, sans-serif;margin: 5px;">${
                      docDetails?.Title
                        ? docDetails?.Title.split("_")[0]
                        : docDetails?.Title || "-"
                    }</p>
                    <span style="font-family: interRegular, sans-serif;font-size: 14px;color: #adadad;">Version : ${
                      docDetails.documentVersion
                    }</span>
                </td>
                <td style="width: 30%;font-size: 11px;line-height: 18px; font-family: interMedium,sans-serif;padding: 0px;">
                  <table style="width: 100%;border-collapse: collapse;padding: 0px;">
                    <tbody>
                      <tr style = "border-bottom: 1px solid #000;">
                        <td style="width: 40%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Type</td>
                        <td>:</td>
                        <td style="width: 60%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
                          <span style="overflow-wrap: anywhere;">${
                            docDetails?.documentTemplateType?.Title || "-"
                          }</span>
                        </td>
                      </tr>
                      <tr style = "border-bottom: 1px solid #000;">
                        <td style="width: 40%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Created on</td>
                        <td>:</td>
                        <td style="width: 60%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
                          <span style="overflow-wrap: anywhere;">${
                            docDetails?.createdDate || "-"
                          }</span>
                        </td>
                      </tr>
                      <tr style = "border-bottom: 1px solid #000;">
                        <td style="width: 40%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Last review</td>
                        <td>:</td>
                        <td style="width: 60%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
                          <span style="overflow-wrap: anywhere;">${
                            lastReviewDate || "-"
                          }</span>
                        </td>
                      </tr>
                      <tr style = "">
                        <td style="width: 40%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Next review</td>
                        <td>:</td>
                        <td style="width: 60%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
                          <span style="overflow-wrap: anywhere;">${
                            docDetails?.nextReviewDate || "-"
                          }</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>`;

  pdfHeaderTable += `</tbody></table><br/>`;

  // let pdfHeaderTable = "";
  // pdfHeaderTable = `<table class="pdf_header" style="width:100%;border: 1px solid black; margin-bottom:30px;">
  //         <tbody>`;

  // pdfHeaderTable += `<tr>
  //               <td style="width:20%; padding:6px; text-align: center;vertical-align: middle;">

  //                 <div style="width: 100%;height:70px;" >
  //                   <img width="100%" height= "100%" style="padding:1px;" src="${
  //                     sectionDetails?.base64 !== ""
  //                       ? sectionDetails?.base64
  //                       : base64Image
  //                   }" alt="doc header logo" />
  //                 </div>
  //               </td>
  //               <td style="width: 50%;font-size: 11px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border-left: 1px solid #000;border-right: 1px solid #000;">
  //                   <p style="font-size: 24px;font-family: interMedium, sans-serif;margin: 5px;">${
  //                     docDetails?.Title
  //                       ? docDetails?.Title.split("_")[0]
  //                       : docDetails?.Title || "-"
  //                   }</p>
  //                   <span style="font-family: interRegular, sans-serif;font-size: 14px;color: #adadad;">Version : ${
  //                     docDetails.documentVersion
  //                   }</span>
  //               </td>
  //               <td style="width: 30%;font-size: 11px;line-height: 18px; font-family: interMedium,sans-serif;">
  //                 <table style="width: 100%;border-collapse: collapse;">
  //                   <tbody>
  //                     <tr style = "border-bottom: 1px solid #000;">
  //                       <td style="width: 35%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Type</td>
  //                       <td>:</td>
  //                       <td style="width: 65%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           docDetails?.documentTemplateType?.Title || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                     <tr style = "border-bottom: 1px solid #000;">
  //                       <td style="width: 35%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Created on</td>
  //                       <td>:</td>
  //                       <td style="width: 65%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           docDetails?.createdDate || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                     <tr style = "border-bottom: 1px solid #000;">
  //                       <td style="width: 35%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Last review</td>
  //                       <td>:</td>
  //                       <td style="width: 65%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           lastReviewDate || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                     <tr style = "">
  //                       <td style="width: 35%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">Next review</td>
  //                       <td>:</td>
  //                       <td style="width: 65%; text-align: left; padding: 3px 3px 3px 5px;font-size: 11px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           docDetails?.nextReviewDate || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                   </tbody>
  //                 </table>
  //               </td>
  //             </tr>`;

  // pdfHeaderTable += `</tbody></table><br/>`;

  // let pdfHeaderTable = "";
  // pdfHeaderTable = `<table class="pdf_header" style="border-collapse: collapse; width: 100%;">
  //       <tbody>`;

  // pdfHeaderTable += `<tr>
  //               <td style="width: 20%;font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">

  //                 <img style="width:100%;min-width: 75px !important;min-width: 150px !important;height:60px !important" src="${
  //                   sectionDetails?.base64 !== ""
  //                     ? sectionDetails?.base64
  //                     : base64Image
  //                 }" alt="doc header logo" />
  //               </td>
  //               <td style="width: 50%;font-size: 13px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">
  //                 <div style="display: flex;flex-wrap: wrap;">
  //                   <p style="width: 100%;font-size: 26px;font-family: interMedium, sans-serif;margin: 5px;">${
  //                     docDetails?.Title || "-"
  //                   }</p>
  //                   <span style="width: 100%;font-family: interRegular, sans-serif;font-size: 14px;color: #adadad;">Version : ${
  //                     docDetails.documentVersion
  //                   }</span>
  //                 </div>
  //               </td>
  //               <td style="width: 30%;font-size: 13px;line-height: 18px; font-family: interMedium,sans-serif; text-align: center;border: 1px solid #000;">
  //                 <table style="width: 100%;border-collapse: collapse;">
  //                   <tbody>
  //                     <tr style = "border-bottom: 1px solid #000;">
  //                       <td style="width: 50%; border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Type</td>
  //                       <td style="width: 50%; text-align: start; padding: 3px 10px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           docDetails?.documentTemplateType?.Title || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                     <tr style = "border-bottom: 1px solid #000;">
  //                       <td style="width: 50%;border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Created on</td>
  //                       <td style="width: 50%; text-align: start; padding: 3px 10px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           docDetails?.createdDate || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                     <tr style = "border-bottom: 1px solid #000;">
  //                       <td style="width: 50%;border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Last review</td>
  //                       <td style="width: 50%; text-align: start; padding: 3px 10px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           docDetails?.lastReviewDate || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                     <tr>
  //                       <td style="width: 50%;border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Next review</td>
  //                       <td style="width: 50%; text-align: start; padding: 3px 10px;">
  //                         <span style="overflow-wrap: anywhere;">${
  //                           docDetails?.nextReviewDate || "-"
  //                         }</span>
  //                       </td>
  //                     </tr>
  //                   </tbody>
  //                 </table>
  //               </td>
  //             </tr>`;

  // pdfHeaderTable += `</tbody></table>`;

  return pdfHeaderTable;
};

export const getDocumentRelatedSections = async (
  documentID: number,
  setAllSectionContent: any,
  setHeaderAndFooterDetails: any,
  setIsPDFGenerate: any,
  setLoader: any
  // setPdfHeaderSection: any
): Promise<any> => {
  try {
    setLoader(true);
    let lastReviewDate = "";
    getPreviousVersionDoc(documentID).then((res) => {
      lastReviewDate = getLastReviewDate(res);
    });
    const DocDetailsResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.DocumentDetails,
      Select:
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/ID, documentTemplateType/Title",
      Expand: "primaryAuthor, Author, documentTemplateType",
      Filter: [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: documentID,
        },
      ],
    });
    const DocDetailsResponseData: any = DocDetailsResponse[0];
    console.log("DocDetailsResponseData", DocDetailsResponseData);

    SpServices.SPReadItems({
      Listname: LISTNAMES.SectionDetails,
      Select: "*,documentOf/ID",
      Expand: "documentOf",
      Filter: [
        {
          FilterKey: "documentOf",
          Operator: "eq",
          FilterValue: documentID,
        },
        {
          FilterKey: "isActive",
          Operator: "eq",
          FilterValue: 1,
        },
      ],
    })
      .then(async (res: any) => {
        debugger;
        const tenantUrl = store.getState().MainSPContext.tenantUrl;
        if (res.length > 0) {
          const sortedArray = res.sort(
            (a: any, b: any) =>
              parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
          );
          let sectionObject: any = {};
          const tempAttachments: any[] = [];
          const tempSectionList: any[] = [];
          let listHeaderBase64Data: any = "";

          for (const item of sortedArray) {
            const attachments = await SpServices.SPGetAttachments({
              Listname: LISTNAMES.SectionDetails,
              ID: item.Id,
            });

            if (attachments.length !== 0) {
              if (item.Title === "Header") {
                const response = await fetch(attachments[0].ServerRelativeUrl);
                const blob = await response.blob();
                listHeaderBase64Data = await convertBlobToBase64(blob);
              }
              sectionObject = {
                ...attachments[0],
                ID: item.Id,
                sectionName: item.Title,
                sectionOrder: item.sectionOrder,
                sectionType: item.sectionType,
                fileData: attachments[0],
                imgURL: `${tenantUrl}${attachments[0]?.ServerRelativeUrl}`,
                attachmentFileName: attachments[0]?.FileName,
                base64: listHeaderBase64Data,
              };
              attachments[0] = sectionObject;
              tempAttachments.push(attachments);
            } else {
              if (item.Title === "Header") {
                sectionObject = {
                  ID: item.Id,
                  sectionName: item.Title,
                  sectionOrder: item.sectionOrder,
                  sectionType: item.sectionType,
                  base64: "",
                };
                attachments[0] = sectionObject;
                tempAttachments.push(attachments);
              }
            }
          }
          // dispatcher(setSectionsAttachments([...tempAttachments]));
          if (tempAttachments.length !== 0) {
            tempAttachments.forEach(async (item: any, index: number) => {
              if (item[0].sectionName === "Header") {
                setHeaderAndFooterDetails((prevData: any) => ({
                  ...prevData,
                  imageBase64: item[0]?.base64
                    ? item[0]?.base64
                    : base64Data.headerImage,
                  documentName: DocDetailsResponseData?.Title
                    ? DocDetailsResponseData?.Title.split("_")[0]
                    : DocDetailsResponseData?.Title || "-",
                  documentVersion: DocDetailsResponseData?.documentVersion,
                  templateType:
                    DocDetailsResponseData?.documentTemplateType?.Title || "-",
                  createdDate: DocDetailsResponseData?.createdDate || "-",
                  lastReviewDate:
                    lastReviewDate === "Invalid Date" ? "-" : lastReviewDate,
                  nextReviewDate: DocDetailsResponseData?.nextReviewDate || "-",
                  footerTitle:
                    DocDetailsResponseData?.footerTitle ||
                    DocDetailsResponseData?.primaryAuthor?.Title,
                }));
                const PDFHeaderTable = await bindHeaderTable(
                  item[0],
                  DocDetailsResponseData,
                  lastReviewDate === "Invalid Date" ? "-" : lastReviewDate
                );
                // setPdfHeaderSection([PDFHeaderTable]);
                const sectionDetails = {
                  text: item[0].sectionName,
                  sectionOrder: item[0].sectionOrder,
                  sectionType: item[0].sectionType,
                  value: PDFHeaderTable,
                };

                tempSectionList.push(sectionDetails);
                setAllSectionContent((prev: any) => {
                  // Add the new sectionDetails to the previous state
                  const updatedSections = [...prev, sectionDetails];

                  // const headerSectionArray = updatedSections?.filter(
                  //   (obj: any) => obj.sectionType === "header section"
                  // );
                  const defaultSectionsArray = updatedSections
                    ?.filter(
                      (obj: any) =>
                        obj.sectionType === "default section" ||
                        obj.sectionType === "references section"
                    )
                    .sort((a, b) => {
                      return (
                        parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
                      );
                    });
                  const normalSectionsArray = updatedSections
                    ?.filter((obj: any) => obj.sectionType === "normal section")
                    .sort((a, b) => {
                      return (
                        parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
                      );
                    });
                  // const referenceSectionArray = updatedSections
                  //   ?.filter(
                  //     (obj: any) => obj.sectionType === "references section"
                  //   )
                  //   .sort((a, b) => {
                  //     return (
                  //       parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
                  //     );
                  //   });
                  //
                  // if (referenceSectionArray.length !== 0) {
                  //   referenceSectionArray[0] = {
                  //     ...referenceSectionArray[0],
                  //     sectionOrder:
                  //       1 +
                  //       headerSectionArray.length +
                  //       defaultSectionsArray.length +
                  //       normalSectionsArray.length,
                  //   };
                  // }
                  const appendixSectionsArray = updatedSections
                    ?.filter(
                      (obj: any) => obj.sectionType === "appendix section"
                    )
                    .sort((a, b) => {
                      return (
                        parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
                      );
                    });
                  const changeRecordSectionArray = updatedSections
                    ?.filter((obj: any) => obj.sectionType === "change record")
                    .sort((a, b) => {
                      return (
                        parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
                      );
                    });
                  if (changeRecordSectionArray.length !== 0) {
                    changeRecordSectionArray[0] = {
                      ...changeRecordSectionArray[0],
                      sectionOrder: 1 + appendixSectionsArray.length,
                    };
                  }

                  // Sort the updatedSections array by the "sectionOrder" key
                  // updatedSections.sort((a, b) => {
                  //   return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
                  // });

                  // Return the sorted array to update the state
                  return [
                    // ...headerSectionArray,
                    ...defaultSectionsArray,
                    ...normalSectionsArray,
                    // ...referenceSectionArray,
                    ...appendixSectionsArray,
                    ...changeRecordSectionArray,
                  ];
                });
                // setLoader(false);
              }
              const filteredItem: any = item?.filter(
                (item: any) => item?.FileName === "Sample.txt"
              );
              if (filteredItem.length > 0) {
                const sectionDetails = readTextFileFromTXT(
                  filteredItem[0],
                  tempAttachments.length,
                  index,
                  setAllSectionContent,
                  // setPdfHeaderSection,
                  setIsPDFGenerate,
                  setLoader
                );
                tempSectionList.push(sectionDetails);
              } else {
                // setSectionLoader(false);
              }
            });
          } else {
            setLoader(false);
          }
        } else {
          setLoader(false);
        }
      })
      .catch((err: any) => {
        console.log("Error : ", err);
      });
  } catch (error) {
    console.error("Error in updateFolderSequenceNumber: ", error);
  }
};
