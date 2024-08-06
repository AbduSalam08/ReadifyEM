/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import SpServices from "../../SPServices/SpServices";
import { CONFIG, LISTNAMES } from "../../../config/config";
import { calculateDueDateByRole } from "../../../utils/validations";
import { getParsedDocData } from "../../../utils/EMManualUtils";
import {
  setCDDocDetails,
  setCDHeaderDetails,
  setCDSectionData,
} from "../../../redux/features/ContentDevloperSlice";
import { sp } from "@pnp/sp/presets/all";
import { setSectionComments } from "../../../redux/features/SectionCommentsSlice";

export const getSectionsDetails = async (
  taskDetails: any,
  currentUserDetails: any,
  dispatcher: any
): Promise<any> => {
  const documentDetailsID: number = taskDetails?.documentDetailsId;

  const userDocumentRole: string = taskDetails?.role?.toLowerCase();

  try {
    const sectionsResponse = await SpServices.SPReadItems({
      Listname: LISTNAMES.SectionDetails,
      Select:
        "*, sectionAuthor/ID,sectionAuthor/Title,sectionAuthor/EMail,consultants/ID,consultants/Title,consultants/EMail,documentOf/ID",
      Expand: "sectionAuthor, consultants, documentOf",
      Filter: [
        {
          FilterKey: "documentOf",
          Operator: "eq",
          FilterValue: documentDetailsID,
        },
        {
          FilterKey: "isActive",
          Operator: "eq",
          FilterValue: "1",
        },
      ],
    });

    const sectionData: any[] = await Promise.all(
      sectionsResponse.map(async (item: any) => {
        try {
          const commentsResponse = await SpServices.SPReadItems({
            Listname: LISTNAMES.SectionComments,
            Select: "*, sectionDetails/ID",
            Expand: "sectionDetails",
            Filter: [
              {
                FilterKey: "sectionDetails",
                Operator: "eq",
                FilterValue: item?.ID,
              },
            ],
          });

          const localSectionData = {
            sectionAuthor: [
              {
                ID: item?.sectionAuthor?.ID,
                title: item?.sectionAuthor?.Title,
                email: item?.sectionAuthor?.EMail,
              },
            ],
            consultants: item?.consultants?.map((consultant: any) => ({
              ID: consultant?.ID,
              title: consultant?.Title,
              email: consultant?.EMail,
            })),
            sectionName: item?.Title,
            isActive: item?.isActive,
            sectionAuthorId: item?.sectionAuthorId,
            consultantsId: item?.consultantsId,
            sectionType: item?.sectionType,
            sectionOrder: item?.sectionOrder,
            documentOfId: item?.documentOfId,
            sectionStatus: item?.status,
            sectionSubmitted: item?.sectionSubmitted,
            lastApprovedBy: item?.lastApprovedBy,
            lastReviewedBy: item?.lastReviewedBy,
            sectionReviewers: item?.sectionReviewers,
            sectionApprovers: item?.sectionApprovers,
            templateTitle: item?.templateTitle,
            ID: item?.ID,
            commentsCount: commentsResponse.length,
            sectionComments: commentsResponse,
            contentType: item?.typeOfContent || "initial",
          };

          let sectionPermission = false;
          let assignedToUser = false;
          let dueDate = "";
          const SectionCreatedDate = dayjs(item?.Created).format("DD/MM/YYYY");

          switch (userDocumentRole) {
            case "section author":
              sectionPermission =
                item?.sectionAuthor?.EMail === currentUserDetails?.email;
              assignedToUser =
                item?.sectionAuthor?.EMail === currentUserDetails?.email;
              dueDate = calculateDueDateByRole(
                SectionCreatedDate,
                "content developer"
              );
              break;
            case "primary author":
              sectionPermission = true;
              assignedToUser =
                item?.sectionAuthor?.EMail === currentUserDetails?.email ||
                item?.consultants?.some(
                  (consultant: any) =>
                    consultant?.EMail === currentUserDetails?.email
                );
              dueDate =
                item?.sectionAuthor?.EMail === currentUserDetails?.email ||
                item?.consultants?.some(
                  (consultant: any) =>
                    consultant?.EMail === currentUserDetails?.email
                )
                  ? calculateDueDateByRole(SectionCreatedDate, "document")
                  : "";
              break;
            case "consultant":
              sectionPermission = item?.consultants?.some(
                (consultant: any) =>
                  consultant?.EMail === currentUserDetails?.email
              );
              assignedToUser = item?.consultants?.some(
                (consultant: any) =>
                  consultant?.EMail === currentUserDetails?.email
              );
              dueDate = calculateDueDateByRole(
                SectionCreatedDate,
                "consultant"
              );
              break;
            case "reviewer":
              sectionPermission = true;
              assignedToUser = true;
              dueDate = calculateDueDateByRole(SectionCreatedDate, "reviewer");
              break;
            case "approver":
              sectionPermission = true;
              assignedToUser = true;
              dueDate = calculateDueDateByRole(SectionCreatedDate, "approver");
              break;
            default:
              sectionPermission = true;
              assignedToUser = false;
              dueDate = "";
              break;
          }

          return {
            ...localSectionData,
            sectionPermission,
            assignedToUser,
            dueDate,
          };
        } catch (error) {
          console.log("Error fetching section comments: ", error);
          return null;
        }
      })
    );

    const sortDefaultSectionsByOrderNo: any = sectionData
      ?.filter(
        (elem1: any) =>
          elem1?.sectionType?.toLowerCase() === "default section" ||
          elem1?.sectionType?.toLowerCase() === "header section"
      )
      ?.sort(
        (elem1: any, elem2: any) => elem1?.sectionOrder - elem2?.sectionOrder
      );

    const sortAppendixSectionsByOrderNo: any = sectionData
      ?.filter(
        (elem1: any) => elem1?.sectionType?.toLowerCase() === "appendix section"
      )
      ?.sort(
        (elem1: any, elem2: any) => elem1?.sectionOrder - elem2?.sectionOrder
      );

    dispatcher(
      setCDDocDetails({
        isLoading: true,
      })
    );

    const DocDetailsResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.DocumentDetails,
      Select:
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail",
      Expand: "primaryAuthor, Author",
      Filter: [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: documentDetailsID,
        },
      ],
    });
    const DocDetailsResponseData: any = DocDetailsResponse[0];

    const docDetailsForCD: any = {
      documentDetailsID: documentDetailsID,
      documentName: DocDetailsResponseData?.Title,
      documentStatus: DocDetailsResponseData?.status,
      documentType: DocDetailsResponseData?.documentType,
      version: DocDetailsResponseData?.documentVersion,
      primaryAuthor: {
        ID: DocDetailsResponseData?.primaryAuthor?.ID,
        name: DocDetailsResponseData?.primaryAuthor?.Title,
        email: DocDetailsResponseData?.primaryAuthor?.EMail,
      },
      reviewers: getParsedDocData(DocDetailsResponseData?.reviewers),
      approvers: getParsedDocData(DocDetailsResponseData?.approvers),
      createdDate: DocDetailsResponseData?.createdDate,
      dueOnDate: calculateDueDateByRole(
        DocDetailsResponseData?.createdDate,
        "document"
      ),
      nextReviewDate: DocDetailsResponseData?.nextReviewDate,
      contentType: DocDetailsResponseData?.typeOfContent || "initial",
      isLoading: false,
      taskRole: taskDetails?.role,
      taskID: taskDetails?.taskID ? taskDetails?.taskID[0] : null,
    };

    dispatcher(setCDDocDetails(docDetailsForCD));

    dispatcher(
      setCDSectionData([
        ...sortDefaultSectionsByOrderNo,
        ...sortAppendixSectionsByOrderNo,
      ])
    );

    return sectionData.filter(Boolean); // Remove any null values from the array
  } catch (error) {
    console.log("Error fetching section details: ", error);
    return null;
  }
};

export const AddAttachment = async (
  itemID: number,
  _file: any,
  contentType: any,
  saveAndClose: boolean,
  fileName?: string,
  listType?: "appendix",
  documentID?: any,
  sectionID?: any
): Promise<any> => {
  if (listType === "appendix" && !itemID && sectionID) {
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
          ListName:
            listType === "appendix"
              ? LISTNAMES.AppendixHeader
              : LISTNAMES.SectionDetails,
          ListID: res?.data?.ID,
          FileName: fileName,
          Attachments: _file,
        })
          .then((res: any) => {
            console.log("res: ", res);
            // _getData();
          })
          .catch((err: any) => {
            console.log("err: ", err);
          });
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  } else if (listType === "appendix") {
    await SpServices.SPAddAttachment({
      ListName: LISTNAMES.AppendixHeader,
      ListID: itemID,
      FileName: fileName,
      Attachments: _file,
    })
      .then((res: any) => {
        console.log("res: ", res);
        // _getData();
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  } else {
    await SpServices.SPAddAttachment({
      ListName: LISTNAMES.SectionDetails,
      ListID: itemID,
      FileName: fileName,
      Attachments: _file,
    })
      .then((res: any) => {
        console.log("res: ", res);
        // _getData();
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  }

  if (listType !== "appendix") {
    await SpServices.SPUpdateItem({
      ID: itemID,
      Listname: LISTNAMES.SectionDetails,
      RequestJSON: {
        typeOfContent: contentType,
        sectionSubmitted: saveAndClose ? saveAndClose : false,
      },
    })
      .then((res: any) => {
        console.log("res: ", res);
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  }
};

export const UpdateAttachment = async (
  itemID: number,
  _file: any,
  contentType: any,
  saveAndClose?: boolean | any,
  fileName?: string,
  deleteAttachment?: any,
  listType?: "appendix",
  documentID?: any,
  sectionID?: any
): Promise<any> => {
  if (deleteAttachment) {
    await SpServices.SPDeleteAttachments({
      ListName:
        listType === "appendix"
          ? LISTNAMES.AppendixHeader
          : LISTNAMES.SectionDetails,
      ListID: itemID,
      AttachmentName: fileName,
    })
      .then((res) => console.log("res:", res))
      .catch((err) => console.log(err));
  } else {
    await SpServices.SPDeleteAttachments({
      ListName:
        listType === "appendix"
          ? LISTNAMES.AppendixHeader
          : LISTNAMES.SectionDetails,
      ListID: itemID,
      AttachmentName: fileName,
    })
      .then((res) => console.log("res:", res))
      .catch((err) => console.log(err));

    await AddAttachment(
      itemID,
      _file,
      contentType,
      saveAndClose,
      fileName,
      listType,
      documentID,
      sectionID
    );
  }
};

export const AddAppendixAttachment = async (
  itemID: number,
  _file: any,
  documentID: any,
  sectionID: any,
  fileName?: string
): Promise<any> => {
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

export const UpdateAppendixAttachment = async (
  itemID: number,
  _file: any,
  fileName?: string,
  documentID?: any,
  sectionID?: any,
  deleteAttachment?: any
): Promise<any> => {
  try {
    // Retrieve all attachments using sp.web
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
      });
    }

    console.log("All attachments deleted.");

    // If there's a new file to add, add it as an attachment using SpServices
    if (_file && fileName) {
      await SpServices.SPAddAttachment({
        ListName: LISTNAMES.AppendixHeader,
        ListID: itemID,
        FileName: fileName,
        Attachments: _file,
      });

      console.log("New attachment added.");
    }
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const AddSectionAttachment = async (
  itemID: number,
  _file: any,
  contentType: any,
  saveAndClose: boolean,
  fileName?: string
): Promise<any> => {
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

  await SpServices.SPUpdateItem({
    ID: itemID,
    Listname: LISTNAMES.SectionDetails,
    RequestJSON: {
      typeOfContent: contentType,
      sectionSubmitted: saveAndClose ? saveAndClose : false,
    },
  })
    .then((res: any) => {
      console.log("res: ", res);
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};

export const UpdateSectionAttachment = async (
  itemID: number,
  _file: any,
  contentType: any,
  saveAndClose?: boolean | any,
  fileName?: string,
  deleteAttachments?: boolean
): Promise<any> => {
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
        fileName
      );

      console.log("New attachment added successfully.");
    }
  } catch (err) {
    console.error("Error while updating section attachments: ", err);
  }
};

// fn to load the section banner image
export const getHeaderSectionDetails = async (
  sectionDetails?: any,
  dispatcher?: any,
  headerDescription?: any
): Promise<any> => {
  let HeaderID: any = "";
  await SpServices.SPReadItems({
    Listname: LISTNAMES.SectionDetails,
    Select: "*",
    Filter: [
      {
        FilterKey: "documentOf",
        Operator: "eq",
        FilterValue: sectionDetails?.documentOfId,
      },
      {
        FilterKey: "sectionType",
        Operator: "eq",
        FilterValue: "header section",
      },
    ],
  })
    .then((res: any) => {
      console.log("res: ", res);
      HeaderID = res[0]?.ID;
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });

  await SpServices.SPGetAttachments({
    Listname: LISTNAMES.SectionDetails,
    ID: HeaderID,
  })
    .then((res: any) => {
      console.log("res2: ", res);
      if (res[0]?.ServerRelativeUrl) {
        // setImgURL(`${CONFIG.tenantURL}${res[0]?.ServerRelativeUrl}`);
        const data: any = {
          imgURL: `${CONFIG.tenantURL}${res[0]?.ServerRelativeUrl}`,
          fileName: res[0]?.FileName,
          headerDescription: headerDescription || null,
        };
        dispatcher && dispatcher(setCDHeaderDetails(data));
      } else {
        // setImgURL("");
        dispatcher && dispatcher(setCDHeaderDetails([]));
      }
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};

export const getAppendixHeaderSectionDetails = async (
  sectionID?: any,
  dispatcher?: any,
  headerDescription?: any
): Promise<any> => {
  let HeaderID: any = "";
  await SpServices.SPReadItems({
    Listname: LISTNAMES.AppendixHeader,
    Select: "*",
    Filter: [
      {
        FilterKey: "sectionDetail",
        Operator: "eq",
        FilterValue: sectionID,
      },
    ],
  })
    .then((res: any) => {
      console.log("res: ", res);
      HeaderID = res[0]?.ID;
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });

  if (HeaderID) {
    await SpServices.SPGetAttachments({
      ID: HeaderID,
      Listname: LISTNAMES.AppendixHeader,
    })
      .then((res: any) => {
        console.log("res2: ", res);
        if (res[0]?.ServerRelativeUrl) {
          const data: any = {
            imgURL: `${CONFIG.tenantURL}${res[0]?.ServerRelativeUrl}`,
            fileName: res[0]?.FileName,
            headerDescription: headerDescription || null,
          };
          dispatcher && dispatcher(setCDHeaderDetails(data));
        } else {
          dispatcher && dispatcher(setCDHeaderDetails([]));
        }
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  } else {
    dispatcher && dispatcher(setCDHeaderDetails([]));
  }
};

export const addPromotedComment = async (
  promoteComments: string,
  documentDetails: any,
  handleClosePopup: any,
  setToastState: any,
  currentUserDetails: any
): Promise<any> => {
  console.log(promoteComments);
  const jsonObject = {
    comments: promoteComments,
    role: documentDetails.taskRole,
    documentDetailsId: documentDetails.documentDetailsID,
    createdById: currentUserDetails.id,
  };
  await SpServices.SPAddItem({
    Listname: LISTNAMES.PromotedComments,
    RequestJSON: jsonObject,
  })
    .then((res: any) => {
      console.log(res);
      handleClosePopup(3);
      setToastState({
        isShow: true,
        severity: "success",
        title: "Update promote comments",
        message: "Successfully added promote comments",
        duration: 3000,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const addRejectedComment = async (
  rejectedComment: string,
  documentDetails: any,
  sectionId: number,
  handleClosePopup: any,
  setToastState: any,
  setLoaderState: any,
  currentUserDetails: any,
  AllSectionsComments: any,
  AllSectionsDataMain: any,
  dispatcher: any
): Promise<any> => {
  console.log(rejectedComment);
  debugger;
  const tempArray: any[] = [...AllSectionsComments];
  const jsonObject = {
    comments: rejectedComment,
    role: documentDetails.taskRole,
    sectionDetailsId: sectionId,
    createdById: currentUserDetails?.id,
    isRejectedComment: true,
  };
  await SpServices.SPAddItem({
    Listname: LISTNAMES.SectionComments,
    RequestJSON: jsonObject,
  })
    .then((res: any) => {
      console.log(res);
      tempArray.push({
        ID: res?.data?.ID,
        comment: jsonObject.comments,
        commentAuthor: currentUserDetails
          ? [
              {
                id: currentUserDetails?.id,
                name: currentUserDetails?.userName,
                email: currentUserDetails?.email,
              },
            ]
          : [],
        commentDateAndTime: res?.data?.Created,
        role: jsonObject.role,
        isRejectedComment: res?.data?.isRejectedComment ? true : false,
      });
      dispatcher(setSectionComments([...tempArray]));

      const updateArray = AllSectionsDataMain.map((obj: any) => {
        if (obj.ID === sectionId) {
          return { ...obj, commentsCount: obj.commentsCount + 1 };
        } else {
          return obj;
        }
      });
      console.log(updateArray);
      dispatcher(setCDSectionData([...updateArray]));

      handleClosePopup(1);
      setToastState({
        isShow: true,
        severity: "success",
        title: "Update promote comments",
        message: "Successfully added promote comments",
        duration: 3000,
      });
    })
    .catch((err) => {
      console.log(err);
      setLoaderState({
        isLoading: {
          inprogress: false,
          success: false,
          error: true,
        },
        visibility: true,
        text: "Unable to Send the comment.",
        secondaryText:
          "An unexpected error occurred while send the comment, please try again later.",
      });
    });
};
