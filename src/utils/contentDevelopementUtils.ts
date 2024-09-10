/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
// import { LISTNAMES } from "../config/config";
// import { UpdateAttachment } from "../services/ContentDevelopment/CommonServices/CommonServices";
// import SpServices from "../services/SPServices/SpServices";
// /* eslint-disable @typescript-eslint/no-explicit-any */

// export const addHeaderAttachmentData = async (
//   submissionType?: any,
//   sectionDetails?: any,
//   file?: any
// ): Promise<any> => {
//   if (!file.fileData?.ServerRelativeUrl && file.fileName !== "") {
//     await UpdateAttachment(
//       sectionDetails?.ID,
//       file.fileData,
//       "initial",
//       submissionType === "submit",
//       file.fileName,
//       file.fileData?.length === 0
//     );
//   }
// };

// export const addAppendixHeaderAttachmentData = async (
//   submissionType?: any,
//   sectionDetails?: any,
//   file?: any
// ): Promise<any> => {
//   console.log("sectionDetails: ", sectionDetails);
//   if (!file.fileData?.ServerRelativeUrl && file.fileName !== "") {
//     let appendixHeaderID: any = null;
//     await SpServices.SPReadItems({
//       Listname: LISTNAMES.AppendixHeader,
//       Select: "*, sectionDetail/ID, documentDetail/ID",
//       Expand: "sectionDetail, documentDetail",
//       Filter: [
//         {
//           FilterKey: "sectionDetail",
//           FilterValue: sectionDetails?.ID,
//           Operator: "eq",
//         },
//       ],
//     })
//       ?.then((res: any) => {
//         console.log("res: ", res);
//         appendixHeaderID = res[0]?.ID;
//       })
//       ?.catch((err: any) => {
//         console.log("err: ", err);
//       });

//     await UpdateAttachment(
//       appendixHeaderID,
//       file.fileData,
//       "initial",
//       submissionType === "submit",
//       file.fileName,
//       file.fileData?.length === 0,
//       "appendix",
//       sectionDetails?.documentOfId,
//       !appendixHeaderID ? sectionDetails?.ID : null
//     );
//   }
// };

// export const getSectionData = async (
//   sectionDetails?: any,
//   setFile?: any
// ): Promise<any> => {
//   const resp = await SpServices.SPReadItems({
//     Listname: LISTNAMES.SectionDetails,
//     Select: "*",
//     Filter: [
//       {
//         FilterKey: "ID",
//         FilterValue: sectionDetails?.ID,
//         Operator: "eq",
//       },
//     ],
//   });
//   console.log("resp: ", resp);

//   await SpServices.SPGetAttachments({
//     Listname: LISTNAMES.SectionDetails,
//     ID: sectionDetails?.ID,
//   })
//     .then((res: any) => {
//       console.log("res: ", res);
//       const filteredItem: any = res?.filter((item: any) =>
//         item?.FileName?.includes("headerImg")
//       );
//       console.log("filteredItem: ", filteredItem);
//       if (filteredItem.length > 0) {
//         setFile({
//           fileData: filteredItem[0],
//           fileName: filteredItem[0]?.FileName,
//         });
//         // setNewAttachment(false);
//       }
//     })
//     .catch((err) => console.log(err));
// };

// export const getSectionDataFromAppendixList = async (
//   sectionDetails?: any,
//   setFile?: any
// ): Promise<any> => {
//   const resp = await SpServices.SPReadItems({
//     Listname: LISTNAMES.AppendixHeader,
//     Select: "*, sectionDetail/ID, documentDetail/ID",
//     Expand: "sectionDetail, documentDetail",
//     Filter: [
//       {
//         FilterKey: "sectionDetail",
//         FilterValue: sectionDetails?.ID,
//         Operator: "eq",
//       },
//     ],
//   });

//   const appendixHeaderID: any = resp[0]?.ID;

//   await SpServices.SPGetAttachments({
//     Listname: LISTNAMES.AppendixHeader,
//     ID: appendixHeaderID,
//   })
//     .then((res: any) => {
//       console.log("res: ", res);
//       const filteredItem: any = res?.filter((item: any) =>
//         item?.FileName?.includes("headerImg")
//       );
//       console.log("filteredItem: ", filteredItem);
//       if (filteredItem.length > 0) {
//         setFile({
//           fileData: filteredItem[0],
//           fileName: filteredItem[0]?.FileName,
//         });
//         // setNewAttachment(false);
//       }
//     })
//     .catch((err) => console.log(err));
// };

// Services for Appendix
import { sp } from "@pnp/sp/presets/all";
import { LISTNAMES } from "../config/config";
import SpServices from "../services/SPServices/SpServices";
import {
  setCDHeaderDetails,
  setCDSectionData,
} from "../redux/features/ContentDevloperSlice";
import dayjs from "dayjs";
import {
  bindHeaderTable,
  convertBlobToBase64,
} from "../services/PDFServices/PDFServices";
import { AddSectionAttachmentFile } from "../services/ContentDevelopment/SectionDefinition/SectionDefinitionServices";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const AddAppendixAttachment = async (
  itemID: number,
  file: any,
  documentID: any,
  sectionID: any,
  fileName?: string
): Promise<any> => {
  debugger;
  if (!itemID && sectionID) {
    await SpServices.SPAddItem({
      Listname: LISTNAMES.AppendixHeader,
      RequestJSON: {
        sectionDetailId: sectionID,
        documentDetailId: documentID,
      },
    })
      .then(async (res: any) => {
        console.log("res: ", res);
        await SpServices.SPAddAttachment({
          ListName: LISTNAMES.AppendixHeader,
          ListID: res?.data?.ID,
          FileName: fileName,
          Attachments: file,
        })
          .then((res: any) => {
            console.log("res: ", res);
          })
          .catch((err: any) => {
            console.log("err: ", err);
          });
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  } else {
    await SpServices.SPAddAttachment({
      ListName: LISTNAMES.AppendixHeader,
      ListID: itemID,
      FileName: fileName,
      Attachments: file,
    })
      .then((res: any) => {
        console.log("res: ", res);
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  }
};

// export const UpdateAppendixAttachment = async (
//   itemID: number,
//   file: any,
//   fileName?: string,
//   deleteAttachment?: any,
//   documentID?: any,
//   sectionID?: any
// ): Promise<any> => {
//   debugger;
//   if (deleteAttachment) {
//     await SpServices.SPDeleteAttachments({
//       ListName: LISTNAMES.AppendixHeader,
//       ListID: itemID,
//       AttachmentName: fileName,
//     })
//       .then((res) => console.log("res:", res))
//       .catch((err) => console.log(err));
//   } else {
//     await SpServices.SPDeleteAttachments({
//       ListName: LISTNAMES.AppendixHeader,
//       ListID: itemID,
//       AttachmentName: fileName,
//     })
//       .then((res) => console.log("res:", res))
//       .catch((err) => console.log(err));

//     await AddAppendixAttachment(itemID, file, documentID, sectionID, fileName);
//   }
// };

export const UpdateAppendixAttachment = async (
  itemID: number,
  file: any,
  fileName?: string,
  deleteAttachment?: any,
  documentID?: any,
  sectionID?: any
): Promise<any> => {
  debugger;
  // Retrieve all attachments using sp.web
  if (itemID) {
    const attachments = await sp.web.lists
      .getByTitle(LISTNAMES.AppendixHeader)
      .items.getById(itemID)
      .attachmentFiles();

    console.log("Attachments: ", attachments);

    // Delete all attachments using SpServices
    for (const attachment of attachments) {
      await SpServices.SPDeleteAttachments({
        ListName: LISTNAMES.AppendixHeader,
        ListID: itemID,
        AttachmentName: attachment.FileName,
      })
        .then((res) => console.log("Deleted attachment: ", res))
        .catch((err) => console.log("Error deleting attachment: ", err));
    }

    if (!deleteAttachment) {
      await AddAppendixAttachment(
        itemID,
        file,
        documentID,
        sectionID,
        fileName
      );
    }
  } else {
    await AddAppendixAttachment(itemID, file, documentID, sectionID, fileName);
  }
};

export const addDefaultPDFheader = async (
  sectionDetails: any,
  documentId: number
): Promise<void> => {
  const DocDetailsResponse: any = await SpServices.SPReadItems({
    Listname: LISTNAMES.DocumentDetails,
    Select:
      "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/ID, documentTemplateType/Title",
    Expand: "primaryAuthor, Author, documentTemplateType",
    Filter: [
      {
        FilterKey: "ID",
        Operator: "eq",
        FilterValue: documentId,
      },
    ],
  });
  const sectionsDetails: any = await SpServices.SPReadItems({
    Listname: LISTNAMES.SectionDetails,
    Select: "*, documentOf/ID",
    Expand: "documentOf",
    Filter: [
      {
        FilterKey: "documentOf",
        Operator: "eq",
        FilterValue: documentId,
      },
    ],
  });
  const DocDetailsResponseData: any = DocDetailsResponse[0];
  debugger;
  const pdfHeaderSection = sectionsDetails.filter(
    (obj: any) => obj.sectionType === "pdf header"
  );
  await sectionsDetails?.forEach(async (obj: any) => {
    if (obj.Title === "Header") {
      await SpServices.SPGetAttachments({
        Listname: LISTNAMES.SectionDetails,
        ID: obj.Id,
      })
        .then(async (res: any) => {
          if (res.length > 0) {
            const response = await fetch(res[0].ServerRelativeUrl);
            const imageblob = await response.blob();
            const tempSectionDetails = {
              base64: await convertBlobToBase64(imageblob),
            };

            const PDFHeaderTable = await bindHeaderTable(
              tempSectionDetails,
              DocDetailsResponseData
            );
            const cleanedTable = PDFHeaderTable.replace(/\n/g, "").replace(
              /\s{2,}/g,
              " "
            );

            const blob = new Blob([JSON.stringify(cleanedTable)], {
              type: "text/plain",
            });
            const file: any = new File([blob], "Sample.txt", {
              type: "text/plain",
            });

            await AddSectionAttachmentFile(pdfHeaderSection[0].ID, file);
          } else {
            const PDFHeaderTable = await bindHeaderTable(
              sectionDetails,
              DocDetailsResponseData
            );
            const cleanedTable = PDFHeaderTable.replace(/\n/g, "").replace(
              /\s{2,}/g,
              " "
            );

            const blob = new Blob([JSON.stringify(cleanedTable)], {
              type: "text/plain",
            });
            const file: any = new File([blob], "Sample.txt", {
              type: "text/plain",
            });

            await AddSectionAttachmentFile(pdfHeaderSection[0].ID, file);
          }
        })
        .catch((err: any) => console.log(err));
    }
  });
};

// Services for Section Details
export const AddSectionAttachment = async (
  itemID: number,
  file: any,
  contentType: any,
  saveAndClose: boolean,
  fileName?: string,
  allSectionsData?: any,
  currentDocDetailsData?: any,
  dispatcher?: any
): Promise<any> => {
  debugger;
  await SpServices.SPAddAttachment({
    ListName: LISTNAMES.SectionDetails,
    ListID: itemID,
    FileName: fileName,
    Attachments: file,
  })
    .then(async (res: any) => {
      console.log("res: ", res);
      console.log("currentDocDetailsData: ", currentDocDetailsData);
      console.log("allSectionsData: ", allSectionsData);
      debugger;
      const response = await fetch(res.data.ServerRelativeUrl);
      const imageBlob = await response.blob();
      const base64Data = await convertBlobToBase64(imageBlob);
      const sectionDetail = { base64: base64Data };
      console.log("sectionDetail: ", sectionDetail);
      addDefaultPDFheader(
        sectionDetail,
        currentDocDetailsData.documentDetailsID
      );
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });

  const updatePayload =
    contentType?.toLowerCase() === "initial"
      ? {
          sectionSubmitted: saveAndClose ? saveAndClose : false,
        }
      : {
          typeOfContent: contentType,
          sectionSubmitted: saveAndClose ? saveAndClose : false,
          status: saveAndClose ? "submitted" : "content in progress",
        };

  await SpServices.SPUpdateItem({
    ID: itemID,
    Listname: LISTNAMES.SectionDetails,
    RequestJSON: updatePayload,
  })
    .then((res: any) => {
      console.log("res: ", res);
      const updateArray = allSectionsData?.map((obj: any) => {
        if (obj.ID === itemID) {
          return {
            ...obj,
            contentType: contentType,
            sectionSubmitted: saveAndClose ? saveAndClose : false,
            sectionStatus: saveAndClose ? "submitted" : "content in progress",
          };
        } else {
          return obj;
        }
      });
      console.log("updateArray: ", updateArray);

      dispatcher(setCDSectionData([...updateArray]));
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const UpdateSectionAttachment = async (
  itemID: number,
  file: any,
  contentType: any,
  saveAndClose?: boolean | any,
  fileName?: string,
  deleteAttachments?: boolean,
  allSectionsData?: any,
  currentDocDetailsData?: any,
  dispatcher?: any
): Promise<any> => {
  debugger;
  console.log("saveAndClose: ", saveAndClose);

  try {
    // Retrieve all attachments for the given item
    if (deleteAttachments && !file) {
      const attachments = await sp.web.lists
        .getByTitle(LISTNAMES.SectionDetails)
        .items.getById(itemID)
        .attachmentFiles();

      // Delete all retrieved attachments
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          await SpServices.SPDeleteAttachments({
            ListName: LISTNAMES.SectionDetails,
            ListID: itemID,
            AttachmentName: attachment.FileName,
          });
        }
        console.log("All existing attachments deleted.");
      }
    } else if (!deleteAttachments && file) {
      const attachments = await sp.web.lists
        .getByTitle(LISTNAMES.SectionDetails)
        .items.getById(itemID)
        .attachmentFiles();

      // Delete all retrieved attachments
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          await SpServices.SPDeleteAttachments({
            ListName: LISTNAMES.SectionDetails,
            ListID: itemID,
            AttachmentName: attachment.FileName,
          });
        }
        console.log("All existing attachments deleted.");
      }
      if (!deleteAttachments && file) {
        // Add new attachment
        await AddSectionAttachment(
          itemID,
          file,
          contentType,
          saveAndClose,
          fileName,
          allSectionsData,
          currentDocDetailsData,
          dispatcher
        );
        console.log("New attachment added successfully.");
      }
    }
  } catch (err) {
    console.error("Error while updating section attachments: ", err);
  }
};

export const addHeaderAttachmentData = async (
  submissionType?: any,
  sectionDetails?: any,
  file?: any,
  allSectionData?: any,
  currentDocDetailsData?: any,
  dispatch?: any,
  contentType?: any
): Promise<any> => {
  if (!file.fileData?.ServerRelativeUrl && file.fileName?.trim() !== "") {
    await UpdateSectionAttachment(
      sectionDetails?.ID,
      file.fileData,
      contentType,
      submissionType === "submit",
      file.fileName,
      file.fileData?.length === 0,
      allSectionData,
      currentDocDetailsData,
      dispatch
    );
  }
};

export const addAppendixHeaderAttachmentData = async (
  submissionType?: any,
  sectionDetails?: any,
  file?: any,
  deleteAttachment?: boolean
): Promise<any> => {
  debugger;
  console.log("sectionDetails: ", sectionDetails);
  if (!file.fileData?.ServerRelativeUrl && file.fileName !== "") {
    let appendixHeaderID: any = null;
    await SpServices.SPReadItems({
      Listname: LISTNAMES.AppendixHeader,
      Select: "*, sectionDetail/ID, documentDetail/ID",
      Expand: "sectionDetail, documentDetail",
      Filter: [
        {
          FilterKey: "sectionDetail",
          FilterValue: sectionDetails?.ID,
          Operator: "eq",
        },
      ],
    })
      ?.then((res: any) => {
        console.log("res: ", res);
        appendixHeaderID = res[0]?.ID;
      })
      ?.catch((err: any) => {
        console.log("err: ", err);
      });

    if (file.fileData && file.fileName) {
      await UpdateAppendixAttachment(
        appendixHeaderID,
        file.fileData,
        file.fileName,
        file.fileData?.length === 0,
        sectionDetails?.documentOfId,
        sectionDetails?.ID
      );
    } else if (deleteAttachment) {
      await UpdateAppendixAttachment(
        appendixHeaderID,
        file.fileData,
        file.fileName,
        file.fileData?.length === 0,
        sectionDetails?.documentOfId,
        sectionDetails?.ID
      );
    }
  }
};

export const getSectionData = async (
  sectionDetails?: any,
  setFile?: any,
  dispatcher?: any
): Promise<any> => {
  const resp = await SpServices.SPReadItems({
    Listname: LISTNAMES.SectionDetails,
    Select: "*",
    Filter: [
      {
        FilterKey: "ID",
        FilterValue: sectionDetails?.ID,
        Operator: "eq",
      },
    ],
  });
  console.log("resp: ", resp);

  await SpServices.SPGetAttachments({
    Listname: LISTNAMES.SectionDetails,
    ID: sectionDetails?.ID,
  })
    .then((res: any) => {
      console.log("res: ", res);
      // const filteredItem: any = res?.filter((item: any) =>
      //   item?.FileName?.includes("headerImg")
      // );
      // console.log("filteredItem: ", filteredItem);
      // if (filteredItem.length > 0) {
      const data = {
        fileData: res[0],
        fileName: res[0]?.FileName,
      };
      setFile([data]);
      dispatcher && dispatcher(setCDHeaderDetails(data));
      // setNewAttachment(false);
      // }
    })
    .catch((err) => {
      console.log(err);
      dispatcher && dispatcher(setCDHeaderDetails([]));
    });
};

export const getSectionDataFromAppendixList = async (
  sectionDetails?: any,
  setFile?: any,
  dispatcher?: any
): Promise<any> => {
  debugger;
  const resp = await SpServices.SPReadItems({
    Listname: LISTNAMES.AppendixHeader,
    Select: "*, sectionDetail/ID, documentDetail/ID",
    Expand: "sectionDetail, documentDetail",
    Filter: [
      {
        FilterKey: "sectionDetail",
        FilterValue: sectionDetails?.ID,
        Operator: "eq",
      },
    ],
  });
  console.log("resp: ", resp);

  const appendixHeaderID: any = resp[0]?.ID;

  if (resp && resp?.length) {
    await SpServices.SPGetAttachments({
      Listname: LISTNAMES.AppendixHeader,
      ID: appendixHeaderID,
    })
      .then((res: any) => {
        console.log("res: ", res);
        // const filteredItem: any = res?.filter((item: any) =>
        //   item?.FileName?.includes("headerImg")
        // );
        // console.log("filteredItem: ", filteredItem);
        // if (filteredItem.length > 0) {
        const data = {
          fileData: res[0],
          fileName: res[0]?.FileName,
        };
        setFile([data]);
        dispatcher && dispatcher(setCDHeaderDetails(data));
        // }
      })
      .catch((err) => {
        dispatcher && dispatcher(setCDHeaderDetails([]));
        console.log(err);
      });
  } else {
    dispatcher && dispatcher(setCDHeaderDetails([]));
  }
};

export const updateSectionDataLocal = (
  sections: any[],
  sectionID: number,
  updates: Partial<any>
): any[] => {
  return sections?.map((obj) => {
    if (obj.ID === sectionID) {
      return {
        ...obj,
        ...updates,
      };
    }
    return obj;
  });
};

export const updateDocDataLocal = (
  DocData: any[],
  docID: number,
  updates: Partial<any>
): any[] => {
  return DocData?.map((obj) => {
    if (obj.ID === docID || obj.documentDetailsID === docID) {
      return {
        ...obj,
        ...updates,
      };
    }
    return obj;
  });
};

export const getCurrentPromoter = (
  promoterData: any
):
  | {
      currentOrder: number;
      currentPromoter: any;
      totalPromoters: number;
    }
  | any => {
  if (promoterData?.length === 0) {
    return {
      currentOrder: 0,
      currentPromoter: [],
      totalPromoters: 0,
    };
  }
  // Check if all promoters are pending
  const checkAllPromotersIsPending: boolean = promoterData?.every(
    (item: any) => item?.status === "pending"
  );

  if (checkAllPromotersIsPending) return null;

  // Find the first promoter with status 'in progress'
  const currentPromoter = promoterData?.find(
    (item: any) => item?.status === "in progress"
  );

  // If no promoter is in progress, return null
  if (!currentPromoter) return null;

  // Calculate the current order
  const currentOrder = promoterData?.indexOf(currentPromoter) + 1;

  // Return the current promoter, its order, and the total number of promoters
  return {
    currentOrder,
    currentPromoter,
    totalPromoters: promoterData?.length,
  };
};

export const getCurrentLoggedPromoter = (
  currentDocRole: any,
  currentDocDetailsData: any,
  currentUserDetails: any
): any => {
  return currentDocRole?.reviewer
    ? currentDocDetailsData?.reviewers?.filter((item: any) => {
        return (
          item?.userData?.secondaryText === currentUserDetails?.email ||
          item?.userData?.email === currentUserDetails?.email
        );
      })[0]
    : currentDocRole?.approver &&
        currentDocDetailsData?.approvers?.filter((item: any) => {
          return (
            item?.userData?.secondaryText === currentUserDetails?.email ||
            item?.userData?.email === currentUserDetails?.email
          );
        })[0];
};

export async function updateTaskCompletion(
  sectionName: string,
  documentOfId: any,
  type: "active" | "completed"
): Promise<void> {
  debugger;
  try {
    let currentDocDetailsData: any;
    await sp.web.lists
      .getByTitle(LISTNAMES.DocumentDetails)
      .items.getById(documentOfId)
      .select("*")
      .get()
      .then((res: any) => {
        console.log("res: ", res);
        const resp = res[0] || res;
        currentDocDetailsData = resp;
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });

    // Read items from SharePoint
    const res = await SpServices.SPReadItems({
      Listname: LISTNAMES.MyTasks,
      Select: "*",
      Filter: [
        {
          FilterKey: "sectionName",
          Operator: "eq",
          FilterValue: sectionName,
        },
        {
          FilterKey: "documentDetails",
          Operator: "eq",
          FilterValue: documentOfId,
        },
        {
          FilterKey: "docVersion",
          Operator: "eq",
          FilterValue: currentDocDetailsData?.documentVersion,
        },
      ],
    });

    console.log("res: ", res);

    let updatedTaskData;
    if (type === "active") {
      // Prepare updated task data
      updatedTaskData = res?.map((element: any) => ({
        ID: element?.ID,
        completed: false,
        completedOn: "",
      }));
    } else {
      // Prepare updated task data
      updatedTaskData = res?.map((element: any) => ({
        ID: element?.ID,
        completed: true,
        completedOn: dayjs(new Date()).format("DD/MM/YYYY"),
      }));
    }

    // Batch update tasks
    await SpServices.batchUpdate({
      ListName: LISTNAMES.MyTasks,
      responseData: updatedTaskData,
    });
  } catch (err) {
    console.error("Error updating tasks: ", err);
  }
}

// Function to get the latest review date in 'DD/MM/YYYY' format
const getLastReviewDate = (prevDocs: any): any => {
  // Filter documents that do not have 'awaiting approval' as their approvedOn
  if (prevDocs) {
    const completedDocs = prevDocs?.filter(
      (item: any) => item?.approvedOn?.toLowerCase() !== "awaiting approval"
    );

    // Check if there are any completed documents
    if (completedDocs?.length !== 0) {
      // Find the most recent approvedOn
      const lastReviewDate = completedDocs?.reduce(
        (latest: any, current: any) => {
          // Parse dates using dayjs for comparison
          const latestDate = dayjs(latest?.approvedOn, "DD/MM/YYYY");
          const currentDate = dayjs(current?.approvedOn, "DD/MM/YYYY");

          // Return the document with the latest date
          return currentDate.isAfter(latestDate) ? current : latest;
        }
      );

      // Format the latest review date to 'DD/MM/YYYY' format
      return dayjs(lastReviewDate?.approvedOn, "DD/MM/YYYY").format(
        "DD/MM/YYYY"
      );
    }
  }

  // Return null if no completed documents are found
  return null;
};

export default getLastReviewDate;
