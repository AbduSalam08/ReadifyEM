/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
/* eslint-disable @typescript-eslint/no-explicit-any */

export const AddAppendixAttachment = async (
  itemID: number,
  _file: any,
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
          Attachments: _file,
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
      Attachments: _file,
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
//   _file: any,
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

//     await AddAppendixAttachment(itemID, _file, documentID, sectionID, fileName);
//   }
// };

export const UpdateAppendixAttachment = async (
  itemID: number,
  _file: any,
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
        _file,
        documentID,
        sectionID,
        fileName
      );
    }
  } else {
    await AddAppendixAttachment(itemID, _file, documentID, sectionID, fileName);
  }
};

// Services for Section Details
export const AddSectionAttachment = async (
  itemID: number,
  _file: any,
  contentType: any,
  saveAndClose: boolean,
  fileName?: string,
  allSectionsData?: any,
  dispatcher?: any
): Promise<any> => {
  debugger;
  await SpServices.SPAddAttachment({
    ListName: LISTNAMES.SectionDetails,
    ListID: itemID,
    FileName: fileName,
    Attachments: _file,
  })
    .then((res: any) => {
      console.log("res: ", res);
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
  _file: any,
  contentType: any,
  saveAndClose?: boolean | any,
  fileName?: string,
  deleteAttachments?: boolean,
  allSectionsData?: any,
  dispatcher?: any
): Promise<any> => {
  debugger;
  console.log("saveAndClose: ", saveAndClose);

  try {
    // Retrieve all attachments for the given item
    if (deleteAttachments) {
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
    } else {
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
      // Add new attachment
      await AddSectionAttachment(
        itemID,
        _file,
        contentType,
        saveAndClose,
        fileName,
        allSectionsData,
        dispatcher
      );

      console.log("New attachment added successfully.");
    }
  } catch (err) {
    console.error("Error while updating section attachments: ", err);
  }
};

export const addHeaderAttachmentData = async (
  submissionType?: any,
  sectionDetails?: any,
  file?: any,
  contentType?: any
): Promise<any> => {
  if (!file.fileData?.ServerRelativeUrl && file.fileName?.trim() !== "") {
    await UpdateSectionAttachment(
      sectionDetails?.ID,
      file.fileData,
      contentType,
      submissionType === "submit",
      file.fileName,
      file.fileData?.length === 0
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
