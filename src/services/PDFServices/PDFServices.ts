/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
// /* eslint-disable @typescript-eslint/no-var-requires */

import { CONFIG, LISTNAMES } from "../../config/config";
// import { setSectionsAttachments } from "../../redux/features/PDFServicceSlice";
import SpServices from "../SPServices/SpServices";
// const sampleDocHeaderImg: any = require("../../assets/images/png/imagePlaceholder.png");

const readTextFileFromTXT = (
  data: any,
  length: number,
  index: number,
  setAllSectionContent: any,
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
      setAllSectionContent((prev: any) => {
        // Add the new sectionDetails to the previous state

        debugger;
        const updatedSections = [...prev, sectionDetails];

        const headerSectionArray = updatedSections?.filter(
          (obj: any) => obj.sectionType === "header section"
        );
        const defaultSectionsArray = updatedSections
          ?.filter((obj: any) => obj.sectionType === "default section")
          .sort((a, b) => {
            return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
          });
        const normalSectionsArray = updatedSections
          ?.filter((obj: any) => obj.sectionType === "normal section")
          .sort((a, b) => {
            return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
          });
        const referenceSectionArray = updatedSections
          ?.filter((obj: any) => obj.sectionType === "references section")
          .sort((a, b) => {
            return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
          });
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

        // Sort the updatedSections array by the "sectionOrder" key
        updatedSections.sort((a, b) => {
          return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
        });

        // Return the sorted array to update the state
        return [
          ...headerSectionArray,
          ...defaultSectionsArray,
          ...normalSectionsArray,
          ...referenceSectionArray,
          ...appendixSectionsArray,
          ...changeRecordSectionArray,
        ];
      });
      if (index + 1 === length) {
        setLoader(false);
      }
      return sectionDetails;
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};

const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const bindHeaderTable = async (
  sectionDetails: any,
  docDetails: any
): Promise<string> => {
  const base64Image =
    "data:image/png;base64,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";
  console.log(base64Image);

  let definitionsTable = "";
  definitionsTable = `<table class="pdf_header" style="border-collapse: collapse; width: 100%;">
        <tbody>`;

  definitionsTable += `<tr>
                <td style="width: 20%;font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">

                  <img style="width:100%;min-width: 75px !important;min-width: 150px !important;height:60px !important" src="${
                    sectionDetails?.base64
                      ? sectionDetails?.base64
                      : base64Image

                  }" alt="doc header logo" />
                </td>
                <td style="width: 50%;font-size: 13px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">
                  <div style="display: flex;flex-wrap: wrap;">
                    <p style="width: 100%;font-size: 26px;font-family: interMedium, sans-serif;margin: 5px;">${
                      docDetails?.Title || "-"
                    }</p>
                    <span style="width: 100%;font-family: interRegular, sans-serif;font-size: 14px;color: #adadad;">Version : ${
                      docDetails.documentVersion
                    }</span>
                  </div>
                </td>
                <td style="width: 30%;font-size: 13px;line-height: 18px; font-family: interMedium,sans-serif; text-align: center;border: 1px solid #000;">
                  <table style="width: 100%;border-collapse: collapse;">
                    <tbody>
                      <tr style = "border-bottom: 1px solid #000;">
                        <td style="width: 50%; border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Type</td>
                        <td style="width: 50%; text-align: start; padding: 3px 10px;">
                          <span style="overflow-wrap: anywhere;">${
                            docDetails?.documentTemplateType?.Title || "-"
                          }</span>
                        </td>
                      </tr>
                      <tr style = "border-bottom: 1px solid #000;">
                        <td style="width: 50%;border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Created on</td>
                        <td style="width: 50%; text-align: start; padding: 3px 10px;">
                          <span style="overflow-wrap: anywhere;">${
                            docDetails?.createdDate || "-"
                          }</span>
                        </td>
                      </tr>
                      <tr style = "border-bottom: 1px solid #000;">
                        <td style="width: 50%;border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Last review</td>
                        <td style="width: 50%; text-align: start; padding: 3px 10px;">
                          <span style="overflow-wrap: anywhere;">${
                            docDetails?.lastReviewDate || "-"
                          }</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 50%;border-right: 1px solid #000; text-align: end; padding: 3px 10px;">Next review</td>
                        <td style="width: 50%; text-align: start; padding: 3px 10px;">
                          <span style="overflow-wrap: anywhere;">${
                            docDetails?.nextReviewDate || "-"
                          }</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>`;

  definitionsTable += `</tbody></table>`;
  return definitionsTable;
};

export const getDocumentRelatedSections = async (
  documentID: number,
  setAllSectionContent: any,
  setLoader: any
): Promise<any> => {
  try {
    setLoader(true);
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
      ],
    })
      .then(async (res: any) => {
        console.log(res);
        if (res.length > 0) {
          const sortedArray = res.sort(
            (a: any, b: any) =>
              parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
          );
          let sectionObject: any = {};
          const tempAttachments: any[] = [];
          const tempSectionList: any[] = [];
          let base64Data: any = "";
          console.log(sortedArray);
          debugger;
          for (const item of sortedArray) {
            console.log(item.sectionOrder);
            let attachments = await SpServices.SPGetAttachments({
              Listname: LISTNAMES.SectionDetails,
              ID: item.Id,
            });

            if (attachments.length !== 0) {
              if (item.Title === "Header") {
                const response = await fetch(attachments[0].ServerRelativeUrl);
                const blob = await response.blob();
                base64Data = await convertBlobToBase64(blob);
              }
              sectionObject = {
                ...attachments[0],
                ID: item.Id,
                sectionName: item.Title,
                sectionOrder: item.sectionOrder,
                sectionType: item.sectionType,
                fileData: attachments[0],
                imgURL: `${CONFIG.tenantURL}${attachments[0]?.ServerRelativeUrl}`,
                attachmentFileName: attachments[0]?.FileName,
                base64: base64Data,
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
          console.log(tempAttachments);
          // dispatcher(setSectionsAttachments([...tempAttachments]));
          if (tempAttachments.length !== 0) {
            tempAttachments.forEach(async (item: any, index: number) => {
              if (item[0].sectionName === "Header") {
                const PDFHeaderTable = await bindHeaderTable(
                  item[0],
                  DocDetailsResponseData
                );
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

                  const headerSectionArray = updatedSections?.filter(
                    (obj: any) => obj.sectionType === "header section"
                  );
                  const defaultSectionsArray = updatedSections
                    ?.filter(
                      (obj: any) => obj.sectionType === "default section"
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
                  const referenceSectionArray = updatedSections
                    ?.filter(
                      (obj: any) => obj.sectionType === "references section"
                    )
                    .sort((a, b) => {
                      return (
                        parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
                      );
                    });
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

                  // Sort the updatedSections array by the "sectionOrder" key
                  updatedSections.sort((a, b) => {
                    return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
                  });

                  // Return the sorted array to update the state
                  return [
                    ...headerSectionArray,
                    ...defaultSectionsArray,
                    ...normalSectionsArray,
                    ...referenceSectionArray,
                    ...appendixSectionsArray,
                    ...changeRecordSectionArray,
                  ];
                });
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
                  setLoader
                );
                tempSectionList.push(sectionDetails);
              } else {
                // setSectionLoader(false);
              }
            });
            debugger;
          } else {
            setLoader(false);
          }
        } else {
          setLoader(false);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  } catch (error) {
    console.error("Error in updateFolderSequenceNumber: ", error);
  }
};
