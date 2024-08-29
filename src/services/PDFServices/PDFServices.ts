/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
// /* eslint-disable @typescript-eslint/no-var-requires */

import { CONFIG, LISTNAMES } from "../../config/config";
// import { setSectionsAttachments } from "../../redux/features/PDFServicceSlice";
import SpServices from "../SPServices/SpServices";
// const sampleDocHeaderImg: any = require("../../../../../assets/images/png/imagePlaceholder.png");
// const sampleDocHeaderImg: any = require("../../assets/images/png/imagePlaceholder.png");
// import sampleDocHeaderImg from "../../assets/images/png/imagePlaceholder.png";

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
        value: parsedValue,
      };
      setAllSectionContent((prev: any) => {
        // Add the new sectionDetails to the previous state
        const updatedSections = [...prev, sectionDetails];

        // Sort the updatedSections array by the "sectionOrder" key
        updatedSections.sort((a, b) => {
          return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
        });

        // Return the sorted array to update the state
        return updatedSections;
      });
      if (index + 1 === length) {
        setLoader(false);
      }
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};

const bindHeaderTable = (sectionDetails: any, docDetails: any) => {
  let definitionsTable = "";
  definitionsTable = `<table style="border-collapse: collapse; width: 100%;">
        <tbody>`;
  // definitionsTable = `<table style="border-collapse: collapse; width: 100%;">
  //       <thead>
  //         <tr>
  //           <th style="width: 10%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">
  //             S.No
  //           </th>
  //           <th style="width: 30%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">
  //             Definition name
  //           </th>
  //           <th style="width: 60%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">
  //             Description
  //           </th>
  //         </tr>
  //       </thead>
  //       <tbody>`;

  definitionsTable += `<tr>
                <td style="width: 20%;font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;">
                  <img style="width: 100% !important;height:auto !important" src="${
                    sectionDetails?.imgURL && sectionDetails?.imgURL
                  }" alt="doc header logo" />
                </td>
                <td style="width: 50%;font-size: 13px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #000;border-right: 0px;">
                  <div>
                    <p style="font-size: 26px;font-family: interMedium, sans-serif;margin-bottom: 10px;">${
                      docDetails?.Title || "-"
                    }</p>
                    <span style="font-family: interRegular, sans-serif;font-size: 14px;color: #adadad;">Version : ${
                      docDetails.documentVersion
                    }</span>
                  </div>
                </td>
                <td style="width: 30%;font-size: 13px;line-height: 18px; font-family: interMedium,sans-serif; text-align: center;">
                  <table style="width: 100%;">
                    <tbody>
                      <tr>
                        <td style="border: 1px solid #000; text-align: end; padding: 3px 10px;">Type</td>
                        <td style="border: 1px solid #000; text-align: start; padding: 3px 10px;">${
                          docDetails?.documentTemplateType?.Title || "-"
                        }</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #000; text-align: end; padding: 3px 10px;">Created on</td>
                        <td style="border: 1px solid #000; text-align: start; padding: 3px 10px;">${
                          docDetails?.createdDate || "-"
                        }</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #000; text-align: end; padding: 3px 10px;">Last review</td>
                        <td style="border: 1px solid #000; text-align: start; padding: 3px 10px;">${
                          docDetails?.lastReviewDate || "-"
                        }</td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #000; text-align: end; padding: 3px 10px;">Next review</td>
                        <td style="border: 1px solid #000; text-align: start; padding: 3px 10px;">${
                          docDetails?.nextReviewDate || "-"
                        }</td>
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
          console.log(sortedArray);
          debugger;
          for (const item of sortedArray) {
            console.log(item.sectionOrder);
            let attachments = await SpServices.SPGetAttachments({
              Listname: LISTNAMES.SectionDetails,
              ID: item.Id,
            });
            if (attachments.length !== 0) {
              sectionObject = {
                ...attachments[0],
                ID: item.Id,
                sectionName: item.Title,
                sectionOrder: item.sectionOrder,
                fileData: attachments[0],
                imgURL: `${CONFIG.tenantURL}${attachments[0]?.ServerRelativeUrl}`,
                attachmentFileName: attachments[0]?.FileName,
              };
              attachments[0] = sectionObject;
              tempAttachments.push(attachments);
            }
          }
          console.log(tempAttachments);
          // dispatcher(setSectionsAttachments([...tempAttachments]));
          if (tempAttachments.length !== 0) {
            tempAttachments.forEach(async (item: any, index: number) => {
              if (item[0].sectionName === "Header") {
                const PDFHeaderTable = bindHeaderTable(
                  item[0],
                  DocDetailsResponseData
                );
                const sectionDetails = {
                  text: item[0].sectionName,
                  sectionOrder: item[0].sectionOrder,
                  value: PDFHeaderTable,
                };
                setAllSectionContent((prev: any) => {
                  // Add the new sectionDetails to the previous state
                  const updatedSections = [...prev, sectionDetails];

                  // Sort the updatedSections array by the "sectionOrder" key
                  updatedSections.sort((a, b) => {
                    return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
                  });

                  // Return the sorted array to update the state
                  return updatedSections;
                });
              }
              const filteredItem: any = item?.filter(
                (item: any) => item?.FileName === "Sample.txt"
              );
              if (filteredItem.length > 0) {
                readTextFileFromTXT(
                  filteredItem[0],
                  tempAttachments.length,
                  index,
                  setAllSectionContent,
                  setLoader
                );
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
        console.log(err);
      });
  } catch (error) {
    console.error("Error in updateFolderSequenceNumber: ", error);
  }
};
