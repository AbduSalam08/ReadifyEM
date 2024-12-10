/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { LISTNAMES } from "../../../config/config";
import { setAllDefinitions } from "../../../redux/features/DefinitionSlice";
// import { updateSectionDataLocal } from "../../../utils/contentDevelopementUtils";
import SpServices from "../../SPServices/SpServices";

interface definitionDetails {
  ID: number;
  definitionDetailsId?: number;
  definitionName: string;
  definitionDescription: string;
  referenceTitle: string;
  referenceLink: string;
  yearOfPublish: string;
  referenceAuthorName: any;
  isSectionDefinition: boolean;
  isSelected: boolean;
  isNew: boolean;
  status: boolean;
  isDeleted: boolean;
}

const convertDefinitionsToTxtFile = (
  content: any[],
  sectionOrder: string
): any => {
  const filterDefinitions = content.filter((obj: any) => !obj.isDeleted);
  let definitionsTable = "";
  definitionsTable = `<div style="margin-left: 25px;">`;

  // definitionsTable = `<table style="border-collapse: collapse; width: 100%;">
  //       <thead>
  //         <tr>
  //           <th style="width: 10%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             S.No
  //           </th>
  //           <th style="width: 30%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             Definition name
  //           </th>
  //           <th style="width: 60%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             Description
  //           </th>
  //         </tr>
  //       </thead>
  //       <tbody>`;

  filterDefinitions?.forEach((obj: any, index: number) => {
    // definitionsTable += `<tr key={${index}}>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${index + 1}
    //             </td>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${obj.definitionName}
    //             </td>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${obj.definitionDescription}
    //             </td>
    //           </tr>`;
    definitionsTable += `<div style="width:100%;margin-bottom: 10px;">
      <span>${sectionOrder}.${index + 1}.${" "}${obj.definitionName}</span>
      <span>
        <p id="definitionValue${index}">${obj.definitionDescription}</p>
      </span>
    </div>`;
  });
  // definitionsTable += `</tbody></table>`;
  definitionsTable += `</div>`;

  const cleanedTable = definitionsTable
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/"/g, "'");

  const blob = new Blob([JSON.stringify(cleanedTable)], {
    type: "text/plain",
  });
  const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
  return file;
};
export const convertReferenceToTxtFile = (
  content: any[],
  sectionOrder: string
): any => {
  const filterData = content.filter(
    (obj: any) => obj.referenceAuthorName !== "" && obj.referenceTitle !== ""
  );
  let referencesTable = "";
  // referencesTable = `<table style="border-collapse: collapse; width: 100%;">
  //       <thead>
  //         <tr>
  //           <th style="width: 10%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             S.No
  //           </th>
  //           <th style="width: 20%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             Title
  //           </th>
  //           <th style="width: 20%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             Author
  //           </th>
  //           <th style="width: 50%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             Link
  //           </th>
  //         </tr>
  //       </thead>
  //       <tbody>`;

  referencesTable += `<div style="margin-left: 25px;">`;

  filterData?.forEach((obj: any, index: number) => {
    referencesTable += `<p style="width:100%;margin-bottom: 10px;">
    <span>${sectionOrder.toString()}.${index + 1}.</span>
    <span style="margin-left: 5px;">${obj.referenceAuthorName}${". "}${
      obj.yearOfPublish ? "(" + obj.yearOfPublish + "). " : ""
    }</span>${
      obj.referenceLink !== ""
        ? `<a style="text-decoration: none;font-style: italic;" href="${
            obj?.referenceLink?.startsWith("https://")
              ? encodeURI(obj.referenceLink)
              : encodeURI("https://" + obj.referenceLink)
          }" target="_blank">${obj.referenceTitle}.</a>`
        : `<span style="font-style: italic;">${obj.referenceTitle}.</span>`
    }</p>`;
    // referencesTable += `<tr key={${index}}>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${sectionOrder.toString()}.${index + 1}.
    //             </td>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${obj.referenceTitle}
    //             </td>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${obj.referenceAuthorName}
    //             </td>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //  <a style="word-break: break-all;" href="${
    //    obj.referenceLink.startsWith("https://")
    //      ? obj.referenceLink
    //      : "https://" + obj.referenceLink
    //  }" target="_blank">
    //                 ${
    //                   obj.referenceLink.startsWith("https://")
    //                     ? obj.referenceLink
    //                     : "https://" + obj.referenceLink
    //                 }
    //               </a>
    //             </td>
    //           </tr>`;
  });
  // referencesTable += `</tbody></table>`;
  referencesTable += `</div>`;

  const cleanedTable = referencesTable
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/"/g, "'");

  const blob = new Blob([JSON.stringify(cleanedTable)], {
    type: "text/plain",
  });
  const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
  return file;
};

const getAllSectionDefinitions = async (
  documentId: number,
  sectionId: number
): Promise<any> => {
  const tempArray: definitionDetails[] = [];
  await SpServices.SPReadItems({
    Listname: LISTNAMES.sectionDefinition,
    Select:
      "*,referenceAuthor/Title,referenceAuthor/ID,referenceAuthor/EMail,docDetails/ID,sectionDetails/ID,definitionDetails/ID",
    Expand: "referenceAuthor,docDetails,sectionDetails,definitionDetails",
    Filter: [
      {
        FilterKey: "docDetails",
        Operator: "eq",
        FilterValue: documentId,
      },
    ],
  })
    .then((res: any[]) => {
      res?.forEach((item: any) => {
        tempArray.push({
          ID: item.ID,
          definitionName: item.Title,
          definitionDescription: item.description,
          referenceAuthorName: item.referenceAuthorName
            ? item.referenceAuthorName
            : "",
          yearOfPublish: item.yearOfPublish ? item.yearOfPublish : "",
          referenceLink: item.referenceLink ? item.referenceLink : "",
          referenceTitle: item.referenceTitle ? item.referenceTitle : "",
          definitionDetailsId: item.definitionDetails.ID,
          isSectionDefinition: item.isSectionDefinition ? true : false,
          isSelected: false,
          isNew: false,
          status: false,
          isDeleted: item.isDeleted ? true : false,
        });
      });
    })
    .catch((error) => console.log("Error : ", error));
  const sortedArray = tempArray.sort((a: any, b: any) => b.ID - a.ID);
  return sortedArray;
};
const getAllSectionReferences = async (documentId: number): Promise<any> => {
  const tempArray: any[] = [];
  await SpServices.SPReadItems({
    Listname: LISTNAMES.sectionReferences,
    Filter: [
      {
        FilterKey: "docDetails",
        Operator: "eq",
        FilterValue: documentId,
      },
    ],
  })
    .then((res: any[]) => {
      res?.forEach((item: any) => {
        tempArray.push({
          ID: item.ID,
          referenceAuthorName: item.referenceAuthorName,
          referenceLink: item.referenceLink ? item.referenceLink : "",
          referenceTitle: item.referenceTitle,
          yearOfPublish: item.yearOfPublish ? item.yearOfPublish : "",
        });
      });
    })
    .catch((error) => console.log("Error : ", error));
  const sortedArray = tempArray.sort((a: any, b: any) => b.ID - a.ID);
  return sortedArray;
};

const getMasterDefinition = async (Data: any) => {
  const tempArray: definitionDetails[] = [];
  await SpServices.SPReadItems({
    Listname: LISTNAMES.Definition,
    Select: "*,referenceAuthor/Title,referenceAuthor/ID,referenceAuthor/EMail",
    Expand: "referenceAuthor",
    Filter: [
      {
        FilterKey: "isApproved",
        Operator: "eq",
        FilterValue: 1,
      },
      {
        FilterKey: "isDeleted",
        Operator: "eq",
        FilterValue: 0,
      },
    ],
  })
    .then((res: any[]) => {
      res?.forEach((item: any) => {
        const index = Data.findIndex(
          (obj: any) => obj.definitionDetailsId === item.ID
        );
        if (Data[index]) {
          if (Data[index].isDeleted) {
            tempArray.push({
              ID: item.ID,
              definitionName: item.Title,
              definitionDescription: item.description,
              referenceAuthorName: item?.referenceAuthorName,
              yearOfPublish: item?.yearOfPublish ? item?.yearOfPublish : "",
              referenceLink: item?.referenceLink ? item?.referenceLink : "",
              referenceTitle: item?.referenceTitle,
              isSectionDefinition: item?.isSectionDefinition ? true : false,
              isSelected: false,
              isNew: false,
              status: false,
              isDeleted: false,
            });
          } else {
            tempArray.push({
              ID: item.ID,
              definitionName: item.Title,
              definitionDescription: item.description,
              referenceAuthorName: item?.referenceAuthorName,
              yearOfPublish: item?.yearOfPublish ? item?.yearOfPublish : "",
              referenceLink: item?.referenceLink ? item?.referenceLink : "",
              referenceTitle: item.referenceTitle,
              isSectionDefinition: item.isSectionDefinition ? true : false,
              isSelected: true,
              isNew: false,
              status: false,
              isDeleted: false,
            });
          }
        } else {
          tempArray.push({
            ID: item.ID,
            definitionName: item.Title,
            definitionDescription: item.description,
            referenceAuthorName: item?.referenceAuthorName,
            yearOfPublish: item?.yearOfPublish ? item?.yearOfPublish : "",
            referenceLink: item?.referenceLink ? item?.referenceLink : "",
            referenceTitle: item.referenceTitle,
            isSectionDefinition: item.isSectionDefinition ? true : false,
            isSelected: false,
            isNew: false,
            status: false,
            isDeleted: false,
          });
        }
      });
    })
    .catch((error) => console.log("Error : ", error));
  return tempArray;
};

export const AddSectionAttachmentFile = async (
  sectionId: number,
  file: any
) => {
  await SpServices.SPDeleteAttachments({
    ListName: LISTNAMES.SectionDetails,
    ListID: sectionId,
    AttachmentName: "Sample.txt",
  })
    .then(async (res) => {
      await SpServices.SPAddAttachment({
        ListName: LISTNAMES.SectionDetails,
        ListID: sectionId,
        FileName: "Sample.txt",
        Attachments: file,
      });
    })
    .catch(async (err) => {
      console.log("Error : ", err);
      await SpServices.SPAddAttachment({
        ListName: LISTNAMES.SectionDetails,
        ListID: sectionId,
        FileName: "Sample.txt",
        Attachments: file,
      });
    });
};

export const findReferenceSectionNumber = async (
  AllSectionsDataMain: any[],
  documentId: number
): Promise<any> => {
  const AllSectionData = await SpServices.SPReadItems({
    Listname: LISTNAMES.SectionDetails,
    Select: "*",
    Expand: "AttachmentFiles",
    Filter: [
      {
        FilterKey: "isDeleted",
        Operator: "eq",
        FilterValue: 0,
      },
      {
        FilterKey: "documentOf",
        Operator: "eq",
        FilterValue: documentId,
      },
    ],
  });
  // const tempArray = AllSectionData.filter(
  //   (obj: any) => obj.AttachmentFiles.length !== 0
  // );
  const tempArray = AllSectionData.filter(
    (obj: any) => obj.sectionType === "references section"
  );

  // const headerSectionArray = tempArray?.filter(
  //   (obj: any) => obj.sectionType === "header section"
  // );
  // const defaultSectionsArray = tempArray
  //   ?.filter((obj: any) => obj.sectionType === "default section")
  //   .sort((a: any, b: any) => {
  //     return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
  //   });
  // const normalSectionsArray = tempArray
  //   ?.filter((obj: any) => obj.sectionType === "normal section")
  //   .sort((a: any, b: any) => {
  //     return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
  //   });
  // const referenceSectionArray = tempArray
  //   ?.filter((obj: any) => obj.sectionType === "references section")
  //   .sort((a: any, b: any) => {
  //     return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
  //   });
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

  return tempArray.length !== 0 ? tempArray[0].sectionOrder : 1;
};

export const AddReferenceAttachment = async (documentId: number, file: any) => {
  await SpServices.SPReadItems({
    Listname: LISTNAMES.SectionDetails,
    Select:
      "*,changeRecordAuthor/ID,changeRecordAuthor/EMail,changeRecordAuthor/Title",
    Expand: "changeRecordAuthor",
    Filter: [
      {
        FilterKey: "documentOfId",
        Operator: "eq",
        FilterValue: documentId,
      },
    ],
  }).then((res: any) => {
    res?.forEach(async (obj: any) => {
      if (obj.sectionType === "references section") {
        AddSectionAttachmentFile(obj.ID, file);
      }
    });
  });
};

const submitSectionDefinitions = async (
  selectedDefinitions: any[],
  AllSectionsDataMain: any[],
  documentId: number,
  sectionId: number,
  sectionOrder: string,
  setSelectedDefinitionsState: any,
  setMasterDefinitionsState: any,
  setLoaderState: any,
  setToastState: any,
  setInitialLoader: any,
  submitCondition: boolean
) => {
  setInitialLoader(true);
  const referenceSectionNumber = await findReferenceSectionNumber(
    AllSectionsDataMain,
    documentId
  );
  const tempArray: any[] = [...selectedDefinitions];
  const tempAddArray = tempArray.filter((obj: any) => obj.status);
  const tempDelArray = tempArray.filter((obj: any) => obj.isDeleted);
  // const tempDelUpdateArray = tempArray.filter(
  //   (obj: any) => !obj.isDeleted && !obj.status
  // );
  if (tempAddArray.length > 0) {
    tempAddArray.forEach(async (obj: any, index: number) => {
      const jsonObject = {
        Title: obj.definitionName,
        description: obj.definitionDescription,
        referenceAuthorName: obj.referenceAuthorName,
        yearOfPublish: obj.yearOfPublish,
        referenceTitle: obj.referenceTitle,
        referenceLink: obj.referenceLink,
        isSectionDefinition: obj.isSectionDefinition ? true : false,
        definitionDetailsId: obj.ID,
        sectionDetailsId: sectionId,
        docDetailsId: documentId,
      };
      await SpServices.SPAddItem({
        Listname: LISTNAMES.sectionDefinition,
        RequestJSON: jsonObject,
      })
        .then(async (res: any) => {
          if (
            tempDelArray.length === 0 &&
            // tempDelUpdateArray.length === 0 &&
            tempAddArray.length - 1 === index
          ) {
            // setLoaderState({
            //   isLoading: {
            //     inprogress: false,
            //     success: true,
            //     error: false,
            //   },
            //   visibility: true,
            //   text: `Changes updated successfully!`,
            //   secondaryText: `Definitions add/remove updated successfully! `,
            // });
            setToastState({
              isShow: true,
              severity: "success",
              title: `Section ${submitCondition ? "Submitted" : "Saved"}!`,
              message: `The section has been ${
                submitCondition ? "Submitted" : "Saved"
              } successfully.`,
              duration: 3000,
            });
            const sectionDefinitions = await getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const tempSectionDefinitions = await sectionDefinitions.filter(
              (obj: any) => !obj.isDeleted
            );
            const sectionReferences = await getAllSectionReferences(documentId);
            setSelectedDefinitionsState([...tempSectionDefinitions]);
            setMasterDefinitionsState([...tempSectionDefinitions]);
            const _file: any = await convertDefinitionsToTxtFile(
              await tempSectionDefinitions,
              sectionOrder
            );
            AddSectionAttachmentFile(sectionId, _file);
            const reference_file: any = await convertReferenceToTxtFile(
              [...(await tempSectionDefinitions), ...sectionReferences],
              await referenceSectionNumber
            );
            AddReferenceAttachment(documentId, reference_file);
            setInitialLoader(false);
          }
        })
        .catch((error) => console.log("Error : ", error));
    });
  }
  if (tempDelArray.length > 0) {
    // toast.error("Please select atleast one document to add");
    tempDelArray.forEach(async (obj: any, index: number) => {
      if (obj.isSectionDefinition) {
        await SpServices.SPDeleteItem({
          Listname: LISTNAMES.Definition,
          ID: obj.definitionDetailsId,
        });
      }
      await SpServices.SPDeleteItem({
        Listname: LISTNAMES.sectionDefinition,
        ID: obj.ID,
      })
        .then(async (res: any) => {
          if (
            // tempDelUpdateArray.length === 0 &&
            tempDelArray.length - 1 ===
            index
          ) {
            // setLoaderState({
            //   isLoading: {
            //     inprogress: false,
            //     success: true,
            //     error: false,
            //   },
            //   visibility: true,
            //   text: `Changes updated successfully!`,
            //   secondaryText: `Definitions add/remove updated successfully! `,
            // });
            setToastState({
              isShow: true,
              severity: "success",
              title: `Section ${submitCondition ? "Submitted" : "Saved"}!`,
              message: `The section has been ${
                submitCondition ? "Submitted" : "Saved"
              } successfully.`,
              duration: 3000,
            });
            const sectionDefinitions = await getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const sectionReferences = await getAllSectionReferences(documentId);
            const tempSectionDefinitions = await sectionDefinitions.filter(
              (obj: any) => !obj.isDeleted
            );
            setSelectedDefinitionsState([...(await tempSectionDefinitions)]);
            setMasterDefinitionsState([...(await tempSectionDefinitions)]);
            const _file: any = await convertDefinitionsToTxtFile(
              await tempSectionDefinitions,
              sectionOrder
            );
            AddSectionAttachmentFile(sectionId, await _file);
            const reference_file: any = await convertReferenceToTxtFile(
              [...(await tempSectionDefinitions), ...(await sectionReferences)],
              await referenceSectionNumber
            );
            AddReferenceAttachment(documentId, await reference_file);
            setInitialLoader(false);
          }
        })
        .catch((err) => {
          console.log("Error : ", err);
        });
    });
  }

  if (tempAddArray.length === 0 && tempDelArray.length === 0) {
    setToastState({
      isShow: true,
      severity: "success",
      title: `Section ${submitCondition ? "Submitted" : "Saved"}!`,
      message: `The section has been ${
        submitCondition ? "Submitted" : "Saved"
      } successfully.`,
      duration: 3000,
    });
    setInitialLoader(false);
  }
  // if (tempDelUpdateArray.length > 0) {
  //   tempDelUpdateArray.forEach(async (obj: any, index: number) => {
  //     const jsonObject = {
  //       isDeleted: false,
  //     };
  //     await SpServices.SPUpdateItem({
  //       Listname: LISTNAMES.sectionDefinition,
  //       ID: obj.ID,
  //       RequestJSON: jsonObject,
  //     })
  //       .then(async (res: any) => {
  //         if (tempDelUpdateArray.length - 1 === index) {
  //           // setLoaderState({
  //           //   isLoading: {
  //           //     inprogress: false,
  //           //     success: true,
  //           //     error: false,
  //           //   },
  //           //   visibility: true,
  //           //   text: `Changes updated successfully!`,
  //           //   secondaryText: `Definitions add/remove updated successfully! `,
  //           // });
  //           const sectionDefinitions = await getAllSectionDefinitions(
  //             documentId,
  //             sectionId
  //           );
  //           const tempSectionDefinitions = await sectionDefinitions.filter(
  //             (obj: any) => !obj.isDeleted
  //           );
  //           setSelectedDefinitionsState([...tempSectionDefinitions]);
  //           setMasterDefinitionsState([...tempSectionDefinitions]);
  //           const _file: any = await convertDefinitionsToTxtFile(
  //             await tempSectionDefinitions,
  //             sectionOrder
  //           );
  //           AddSectionAttachmentFile(sectionId, _file);
  //           const reference_file: any = await convertReferenceToTxtFile(
  //             await tempSectionDefinitions
  //           );
  //           AddReferenceAttachment(documentId, reference_file);
  //           setToastState({
  //             isShow: true,
  //             severity: "success",
  //             title: "Content updated!",
  //             message: "The content has been updated successfully.",
  //             duration: 3000,
  //           });
  //           setInitialLoader(false);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log("Error : ",err);
  //       });
  //   });
  // }
};

const addNewDefinition = async (
  definitionsData: any,
  AllSectionsDataMain: any[],
  documentId: number,
  sectionId: number,
  sectionOrder: string,
  setLoaderState: any,
  setToastState: any,
  setSelectedDefinitions: any,
  setInitialLoader: any,
  setPopupController: any,
  togglePopupVisibility: any
) => {
  try {
    const referenceSectionNumber = await findReferenceSectionNumber(
      AllSectionsDataMain,
      documentId
    );
    setInitialLoader(true);
    const payloadJSON = {
      Title: definitionsData?.definitionName,
      description: definitionsData?.definitionDescription,
      referenceTitle: definitionsData.referenceTitle,
      referenceAuthorName: definitionsData.referenceAuthorName,
      yearOfPublish: definitionsData.yearOfPublish,
      referenceLink: definitionsData.referenceLink,
      isSectionDefinition: true,
      // referenceAuthorId: definitionsData.referenceAuthor[0].Id,
      isApproved: false,
    };
    await SpServices.SPAddItem({
      Listname: LISTNAMES.Definition,
      RequestJSON: payloadJSON,
    })
      .then(async (res: any) => {
        const jsonObject = {
          Title: definitionsData.definitionName,
          description: definitionsData.definitionDescription,
          // referenceAuthorId: definitionsData.referenceAuthor[0].Id,
          referenceTitle: definitionsData.referenceTitle,
          referenceAuthorName: definitionsData.referenceAuthorName,
          yearOfPublish: definitionsData.yearOfPublish,
          referenceLink: definitionsData.referenceLink,
          isSectionDefinition: true,
          definitionDetailsId: res?.data?.ID,
          sectionDetailsId: sectionId,
          docDetailsId: documentId,
        };
        await SpServices.SPAddItem({
          Listname: LISTNAMES.sectionDefinition,
          RequestJSON: jsonObject,
        })
          .then(async (sectionres: any) => {
            // setLoaderState({
            //   isLoading: {
            //     inprogress: false,
            //     success: true,
            //     error: false,
            //   },
            //   visibility: true,
            //   text: `Definition created successfully!`,
            //   secondaryText: `The Standardized definition template "${definitionsData?.definitionName}" has been created successfully! `,
            // });
            const sectionDefinitions = await getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const sectionReferences = await getAllSectionReferences(documentId);
            const tempSectionDefinitions = await sectionDefinitions.filter(
              (obj: any) => !obj.isDeleted
            );
            const _file: any = await convertDefinitionsToTxtFile(
              await tempSectionDefinitions,
              sectionOrder
            );
            AddSectionAttachmentFile(sectionId, _file);
            const reference_file: any = await convertReferenceToTxtFile(
              [...(await tempSectionDefinitions), ...sectionReferences],
              await referenceSectionNumber
            );
            AddReferenceAttachment(documentId, reference_file);
            togglePopupVisibility(setPopupController, 0, "close");
            setSelectedDefinitions((prev: any) => [
              {
                ID: sectionres?.data.ID,
                definitionName: definitionsData.definitionName,
                definitionDescription: definitionsData.definitionDescription,
                referenceAuthorName: definitionsData.referenceAuthorName,
                yearOfPublish: definitionsData.yearOfPublish,
                referenceLink: definitionsData.referenceLink,
                referenceTitle: definitionsData.referenceTitle,
                definitionDetailsId: res?.data?.ID,
                isSectionDefinition: true,
                isDeleted: false,
                isNew: false,
                isSelected: false,
                status: false,
              },
              ...prev,
            ]);

            // const updateArray = updateSectionDataLocal(
            //   AllSectionsDataMain,
            //   sectionId,
            //   {
            //     sectionSubmitted: saveAndClose ? saveAndClose : false,
            //     sectionStatus: saveAndClose
            //       ? "submitted"
            //       : "content in progress",
            //   }
            // );

            // dispatch(setCDSectionData([...updateArray]));

            setToastState({
              isShow: true,
              severity: "success",
              title: "Section updated",
              message: "section has been updated successfully!",
              duration: 3000,
            });
            setInitialLoader(false);
            // getAllSecDefinitions();
          })
          .catch((err) => {
            console.log("Error : ", err);
            setLoaderState({
              isLoading: {
                inprogress: false,
                success: false,
                error: true,
              },
              visibility: true,
              text: "Unable to create the definition.",
              secondaryText:
                "An unexpected error occurred while create the definition, please try again later.",
            });
          });
      })
      .catch((err) => {
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: false,
            error: true,
          },
          visibility: true,
          text: "Unable to create the definition.",
          secondaryText:
            "An unexpected error occurred while create the definition, please try again later.",
        });
      });
  } catch (err) {
    setLoaderState({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: true,
      text: "Unable to create the definition.",
      secondaryText:
        "An unexpected error occurred while create the definition, please try again later.",
    });
  }
};

const updateSectionDefinition = async (
  definitionsData: any,
  AllSectionsDataMain: any[],
  documentId: number,
  sectionId: number,
  sectionOrder: string,
  setLoaderState: any,
  setToastState: any,
  setSelectedDefinitions: any,
  setInitialLoader: any,
  setPopupController: any,
  togglePopupVisibility: any
) => {
  try {
    const referenceSectionNumber = await findReferenceSectionNumber(
      AllSectionsDataMain,
      documentId
    );
    setInitialLoader(true);
    const payloadJSON = {
      Title: definitionsData?.definitionName,
      description: definitionsData?.definitionDescription,
      referenceTitle: definitionsData.referenceTitle,
      referenceAuthorName: definitionsData.referenceAuthorName,
      yearOfPublish: definitionsData.yearOfPublish,
      referenceLink: definitionsData.referenceLink,
      isSectionDefinition: true,
      // referenceAuthorId: definitionsData.referenceAuthor[0].Id,
      //  isApproved: false,
    };
    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.Definition,
      ID: definitionsData.definitionDetailsId,
      RequestJSON: payloadJSON,
    })
      .then(async (res: any) => {
        const jsonObject = {
          Title: definitionsData.definitionName,
          description: definitionsData.definitionDescription,
          // referenceAuthorId: definitionsData.referenceAuthor[0].Id,
          referenceTitle: definitionsData.referenceTitle,
          referenceAuthorName: definitionsData.referenceAuthorName,
          yearOfPublish: definitionsData.yearOfPublish,
          referenceLink: definitionsData.referenceLink,
          isSectionDefinition: true,
          // definitionDetailsId: definitionsData.definitionDetailsId,
          // sectionDetailsId: sectionId,
          // docDetailsId: documentId,
        };
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.sectionDefinition,
          ID: definitionsData.ID,
          RequestJSON: jsonObject,
        })
          .then(async (res: any) => {
            const sectionDefinitions = await getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const sectionReferences = await getAllSectionReferences(documentId);

            const tempSectionDefinitions = await sectionDefinitions.filter(
              (obj: any) => !obj.isDeleted
            );
            const _file: any = await convertDefinitionsToTxtFile(
              await tempSectionDefinitions,
              sectionOrder
            );
            AddSectionAttachmentFile(sectionId, _file);
            const reference_file: any = await convertReferenceToTxtFile(
              [...(await tempSectionDefinitions), ...sectionReferences],
              await referenceSectionNumber
            );
            AddReferenceAttachment(documentId, reference_file);
            togglePopupVisibility(setPopupController, 6, "close");
            // setSelectedDefinitions([...tempSectionDefinitions]);
            setToastState({
              isShow: true,
              severity: "success",
              title: "Definition updated!",
              message: "Definition has been updated successfully.",
              duration: 3000,
            });
            setSelectedDefinitions((prev: any) => {
              const tempArray = prev.map((obj: any) => {
                if (obj.ID === definitionsData.ID) {
                  return {
                    ...obj,
                    definitionName: definitionsData.definitionName,
                    definitionDescription:
                      definitionsData.definitionDescription,
                    referenceAuthorName: definitionsData.referenceAuthorName,
                    yearOfPublish: definitionsData.yearOfPublish,
                    referenceLink: definitionsData.referenceLink,
                    referenceTitle: definitionsData.referenceTitle,
                    isSectionDefinition: true,
                    isDeleted: false,
                    isNew: false,
                    isSelected: false,
                    status: false,
                  };
                } else {
                  return obj;
                }
              });
              return [...tempArray];
            });

            setInitialLoader(false);
          })
          .catch((err: any) => {
            console.log("Error : ", err);
            setLoaderState({
              isLoading: {
                inprogress: false,
                success: false,
                error: true,
              },
              visibility: true,
              text: "Unable to update the definition.",
              secondaryText:
                "An unexpected error occurred while update the definition, please try again later.",
            });
          });
      })
      .catch((err: any) => {
        console.log("Error : ", err);
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: false,
            error: true,
          },
          visibility: true,
          text: "Unable to update the definition.",
          secondaryText:
            "An unexpected error occurred while update the definition, please try again later.",
        });
      });
  } catch (err) {
    console.log("Error : ", err);
    setLoaderState({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: true,
      text: "Unable to update the definition.",
      secondaryText:
        "An unexpected error occurred while update the definition, please try again later.",
    });
  }
};

// Main function to get all main Definitions
const fetchTemplates = async (): Promise<{
  allMainTemplateData: any[];
}> => {
  try {
    const mainListResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.Definition,
      Filter: [
        {
          FilterKey: "isDeleted",
          Operator: "eq",
          FilterValue: "0",
        },
      ],
    });

    const allMainTemplateData: any[] = mainListResponse?.map((value: any) => ({
      ID: value?.ID || null,
      definitionName: value.Title,
      definitionDescription: value.description || "",
      isApproved: value.isApproved ? true : false,
    }));

    return { allMainTemplateData };
  } catch (error) {
    console.log("Error : ", error);
    return { allMainTemplateData: [] };
  }
};

const LoadDefinitionTableData = async (dispatch: any): Promise<void> => {
  const data = await fetchTemplates();
  const { allMainTemplateData } = data;
  dispatch(setAllDefinitions(allMainTemplateData));
};

export {
  getAllSectionDefinitions,
  getMasterDefinition,
  submitSectionDefinitions,
  addNewDefinition,
  updateSectionDefinition,
  LoadDefinitionTableData,
};
