/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import SpServices from "../../SPServices/SpServices";
import { CONFIG, LIBNAMES, LISTNAMES } from "../../../config/config";
import { calculateDueDateByRole } from "../../../utils/validations";
import { getParsedDocData } from "../../../utils/EMManualUtils";
import {
  setCDDocDetails,
  setCDHeaderDetails,
  setCDSectionData,
} from "../../../redux/features/ContentDevloperSlice";
import { sp } from "@pnp/sp/presets/all";
import {
  getCurrentPromoter,
  updateDocDataLocal,
  // updateDocDataLocal,
  updateSectionDataLocal,
} from "../../../utils/contentDevelopementUtils";
import {
  setAllSectionsChangeRecord,
  setSectionChangeRecord,
  setSectionComments,
} from "../../../redux/features/SectionCommentsSlice";

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

    console.log("sectionsResponse: ", sectionsResponse);
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
            sectionSubmitted: item?.sectionSubmitted || false,
            sectionApproved: item?.sectionApproved || false,
            sectionReviewed: item?.sectionReviewed || false,
            sectionRework: item?.sectionReviewed || false,
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
    const sortLastAppendixSectionsByOrderNo: any = sectionData
      ?.filter(
        (elem1: any) => elem1?.sectionType?.toLowerCase() === "change record"
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
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/ID, documentTemplateType/Title",
      Expand: "primaryAuthor, Author, documentTemplateType",
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
      documentTemplateType: DocDetailsResponseData?.documentTemplateType,
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
      sectionType: DocDetailsResponseData?.sectionType || "initial",
      isLoading: false,
      taskRole: taskDetails?.role,
      taskID: taskDetails?.taskID ? taskDetails?.taskID[0] : null,
    };

    dispatcher(setCDDocDetails(docDetailsForCD));

    dispatcher(
      setCDSectionData([
        ...sortDefaultSectionsByOrderNo,
        ...sortAppendixSectionsByOrderNo,
        ...sortLastAppendixSectionsByOrderNo,
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
  sectionID?: any,
  AllSectionsDataMain?: any,
  dispatch?: any,
  currentDocDetailsData?: any
): Promise<any> => {
  debugger;

  const currentSectionDetail = AllSectionsDataMain?.filter(
    (item: any) => item?.ID === itemID
  )[0];

  const docInReview: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in review";

  const docInApproval: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in approval";

  const sectionInRework: boolean =
    currentSectionDetail?.sectionStatus?.toLowerCase() === "rework in progress";

  const promoters: any = currentDocDetailsData?.reviewers?.some(
    (item: any) => item?.status === "in progress"
  )
    ? currentDocDetailsData?.reviewers
    : currentDocDetailsData?.approvers?.some(
        (item: any) => item?.status === "in progress"
      )
    ? currentDocDetailsData?.approvers
    : [];

  const currentPromoter: any = getCurrentPromoter(promoters);

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

  const isReviewerInProgress = currentDocDetailsData?.reviewers?.some(
    (item: any) => item?.status === "in progress"
  );

  const isApproverInProgress = currentDocDetailsData?.approvers?.some(
    (item: any) => item?.status === "in progress"
  );

  const isReviewerNotInProgress = currentDocDetailsData?.reviewers?.every(
    (item: any) => item?.status === "pending"
  );

  const isApproverNotInProgress = currentDocDetailsData?.approvers?.every(
    (item: any) => item?.status === "pending"
  );

  const currentSectionStatus: any =
    saveAndClose &&
    !docInReview &&
    !docInApproval &&
    isReviewerNotInProgress &&
    isApproverNotInProgress
      ? "submitted"
      : !saveAndClose && sectionInRework
      ? "Rework in progress"
      : docInReview || isReviewerInProgress
      ? `Yet to be reviewed (${currentPromoter?.currentOrder}/${currentPromoter?.totalPromoters})`
      : docInApproval || isApproverInProgress
      ? `Yet to be approved (${currentPromoter?.currentOrder}/${currentPromoter?.totalPromoters})`
      : "Content in progress";

  if (listType !== "appendix") {
    await SpServices.SPUpdateItem({
      ID: itemID,
      Listname: LISTNAMES.SectionDetails,
      RequestJSON: {
        typeOfContent: contentType,
        sectionSubmitted: saveAndClose ? saveAndClose : false,
        status: currentSectionStatus,
        sectionRework:
          !saveAndClose &&
          !currentSectionStatus?.toLowerCase()?.includes("rework")
            ? false
            : currentSectionStatus?.toLowerCase()?.includes("rework"),
      },
    })
      .then(async (res: any) => {
        console.log("res: ", res);
        const updateArray = updateSectionDataLocal(
          AllSectionsDataMain,
          itemID,
          {
            contentType: contentType,
            sectionSubmitted: saveAndClose ? saveAndClose : false,
            sectionStatus: currentSectionStatus,
            sectionRework:
              !saveAndClose &&
              !currentSectionStatus?.toLowerCase()?.includes("rework") &&
              false,
          }
        );

        dispatch(setCDSectionData([...updateArray]));
        debugger;
        try {
          const res = await SpServices.SPReadItems({
            Listname: LISTNAMES.SectionDetails,
            Select: "*",
            Filter: [
              {
                FilterValue: currentDocDetailsData?.documentDetailsID,
                Operator: "eq",
                FilterKey: "documentOf",
              },
            ],
          });

          console.log("res: ", res);

          const checkIfAnySectionHasRework = res?.some(
            (item: any) => item?.status?.toLowerCase() === "rework in progress"
          );

          let currentStageStatus = "In Development";

          if (
            currentDocDetailsData?.reviewers?.some(
              (item: any) => item?.status === "in progress"
            )
          ) {
            currentStageStatus = "In Review";
          } else if (
            currentDocDetailsData?.approvers?.some(
              (item: any) => item?.status === "in progress"
            )
          ) {
            currentStageStatus = "In Approval";
          }

          if (!checkIfAnySectionHasRework) {
            await SpServices.SPUpdateItem({
              Listname: LISTNAMES.DocumentDetails,
              ID: currentDocDetailsData?.documentDetailsID,
              RequestJSON: {
                status: currentStageStatus,
              },
            }).then((res: any) => {
              dispatch(
                setCDDocDetails({
                  ...currentDocDetailsData,
                  documentStatus: currentStageStatus,
                })
              );
            });
          }
        } catch (error) {
          console.error("Error processing document status:", error);
        }
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
  AllSectionsDataMain?: any,
  dispatch?: any,
  currentDocDetailsData?: any,
  deleteAttachment?: any,
  listType?: "appendix",
  documentID?: any,
  sectionID?: any
): Promise<any> => {
  debugger;
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
      sectionID,
      AllSectionsDataMain,
      dispatch,
      currentDocDetailsData
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
        title: "Comment added!",
        message: "your comments has been added successfully.",
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
  console.log("documentDetails: ", documentDetails);
  console.log(rejectedComment);
  debugger;
  let fileID: any;
  let currentDocResponse: any;
  console.log("currentDocResponse: ", currentDocResponse);

  await SpServices.SPReadItemUsingId({
    Listname: LISTNAMES.DocumentDetails,
    SelectedId: documentDetails?.documentDetailsID,
    Select: "*, fileDetails/ID",
    Expand: "fileDetails",
  })
    .then((res: any) => {
      console.log("res: ", res);
      fileID = res?.fileDetailsId;
      currentDocResponse = res;
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });

  const tempArray: any[] = [...AllSectionsComments];
  const jsonObject = {
    comments: rejectedComment,
    role: documentDetails.taskRole,
    sectionDetailsId: sectionId,
    createdById: currentUserDetails?.id,
    isRejectedComment: true,
  };

  await SpServices.SPUpdateItem({
    ID: sectionId,
    Listname: LISTNAMES.SectionDetails,
    RequestJSON: {
      status: "Rework in progress",
      sectionSubmitted: false,
      sectionReviewed: false,
      sectionApproved: false,
    },
  });

  await SpServices.SPUpdateItem({
    ID: documentDetails?.documentDetailsID,
    Listname: LISTNAMES.DocumentDetails,
    RequestJSON: {
      status: "In Rework",
    },
  }).then(async (res: any) => {
    await sp.web.lists
      .getByTitle(LIBNAMES.AllDocuments)
      .items.getById(fileID)
      .update({
        status: "In Rework",
      });
  });

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

      const updateArray = AllSectionsDataMain?.map((obj: any) => {
        if (obj.ID === sectionId) {
          return {
            ...obj,
            commentsCount: obj.commentsCount + 1,
            sectionStatus: "Rework in progress",
            sectionSubmitted: false,
            sectionReviewed: false,
            sectionApproved: false,
            sectionRework: true,
          };
        } else {
          return obj;
        }
      });
      console.log(updateArray);
      dispatcher(setCDSectionData([...updateArray]));

      dispatcher(
        setCDDocDetails({
          ...documentDetails,
          documentStatus: "In Rework",
        })
      );

      handleClosePopup(1);
      setToastState({
        isShow: true,
        severity: "success",
        title: "Comment added!",
        message: "your comments has been added successfully.",
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

export const changeDocStatus = async (
  docID: any,
  statusName: any,
  promoteTo: "reviewers" | "approvers" | any,
  promoteToData: any,
  docDetailsData: any,
  dispatch: any,
  lastPromoter?: any
): Promise<any> => {
  let fileID: any;
  let currentDocResponse: any;

  await SpServices.SPReadItemUsingId({
    Listname: LISTNAMES.DocumentDetails,
    SelectedId: docID,
    Select: "*, fileDetails/ID",
    Expand: "fileDetails",
  })
    .then((res: any) => {
      console.log("res: ", res);
      fileID = res?.fileDetailsId;
      currentDocResponse = res;
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });

  await SpServices.SPUpdateItem({
    Listname: LISTNAMES.DocumentDetails,
    ID: docID,
    RequestJSON: {
      status: statusName,
      [`${promoteTo}`]: JSON.stringify(promoteToData),
    },
  })
    .then(async (res: any) => {
      console.log("res: ", res);
      await sp.web.lists
        .getByTitle(LIBNAMES.AllDocuments)
        .items.getById(fileID)
        .update({
          status: statusName,
        });

      if (promoteTo === "reviewers" && !lastPromoter) {
        await SpServices.SPAddItem({
          Listname: LISTNAMES.MyTasks,
          RequestJSON: {
            taskAssigneeId:
              promoteToData?.filter(
                (item: any) => item?.status === "in progress"
              )[0]?.userData?.id || promoteToData[0]?.userData?.id,
            role: "Reviewer",
            taskStatus: "review in progress",
            taskAssignedById: currentDocResponse?.primaryAuthorId,
            Title: currentDocResponse?.Title,
            taskDueDate: calculateDueDateByRole(
              dayjs()?.format("DD/MM/YYYY"),
              "reviewer"
            ),
            docStatus: currentDocResponse?.status,
            completed: false,
            docCreatedDate: currentDocResponse?.createdDate,
            documentDetailsId: currentDocResponse?.ID,
            docVersion: currentDocResponse?.documentVersion,
            documentTemplateTypeId: currentDocResponse?.documentTemplateTypeId,
            pathName: currentDocResponse?.documentPath?.split("/").pop(),
          },
        });
      } else if (promoteTo === "approvers" && !lastPromoter) {
        await SpServices.SPAddItem({
          Listname: LISTNAMES.MyTasks,
          RequestJSON: {
            taskAssigneeId:
              promoteToData?.filter(
                (item: any) => item?.status === "in progress"
              )[0]?.userData?.id || promoteToData[0]?.userData?.id,
            role: "Approver",
            taskStatus: "approval in progress",
            taskAssignedById: currentDocResponse?.primaryAuthorId,
            Title: currentDocResponse?.Title,
            taskDueDate: calculateDueDateByRole(
              dayjs()?.format("DD/MM/YYYY"),
              "approver"
            ),
            docStatus: currentDocResponse?.status,
            completed: false,
            docCreatedDate: currentDocResponse?.createdDate,
            documentDetailsId: currentDocResponse?.ID,
            docVersion: currentDocResponse?.documentVersion,
            documentTemplateTypeId: currentDocResponse?.documentTemplateTypeId,
            pathName: currentDocResponse?.documentPath?.split("/").pop(),
          },
        });
      }

      if (lastPromoter && promoteTo === "approvers") {
        await SpServices.SPReadItems({
          Listname: LISTNAMES.MyTasks,
          Select: "*, documentDetails/ID",
          Expand: "documentDetails",
          Filter: [
            {
              FilterKey: "documentDetails",
              Operator: "eq",
              FilterValue: currentDocResponse?.ID,
            },
          ],
        }).then(async (res: any) => {
          console.log("res: ", res);
          const updatedtask: any = res?.map((item: any) => {
            return {
              ...item,
              completed: true,
            };
          });
          await SpServices.batchUpdate({
            ListName: LISTNAMES.MyTasks,
            responseData: updatedtask,
          });
        });
      }
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });

  // const updatedDOCDetails: any = updateDocDataLocal(docDetailsData, docID, {
  //   documentStatus: "In Review",
  // });

  dispatch(
    setCDDocDetails({
      ...docDetailsData,
      documentStatus: statusName,
      // documentStatus:
      //   promoteTo === "reviewers"
      //     ? "In Review"
      //     : promoteTo === "approvers" && "In Approval",
    })
  );
};

export const changeSectionStatus = async (
  sectionsData: any,
  AllSectionsData: any,
  dispatch: any,
  promoterType?: any,
  promoterTypeKey?: any,
  lastPromoter?: boolean,
  currentDocumentDetails?: any
): Promise<any> => {
  console.log("AllSectionsData: ", AllSectionsData);
  debugger;
  await SpServices.batchUpdate({
    ListName: LISTNAMES.SectionDetails,
    responseData: sectionsData,
  })
    .then((res: any) => {
      console.log("res: ", res);
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });

  for (const element of sectionsData) {
    const updatedSection: any = updateSectionDataLocal(
      AllSectionsData,
      element?.ID,
      !lastPromoter && promoterType !== "approver"
        ? {
            sectionStatus: element?.status,
            sectionReviewed: false,
            sectionApproved: false,
            sectionRework: false,
          }
        : {
            sectionStatus: element?.status,
            // [`${promoterTypeKey}`]: true,
            sectionReviewed: true,
            sectionApproved: true,
            sectionRework: false,
          }
    );
    console.log("updatedSection: ", updatedSection);
    // Collect the updates instead of dispatching right away
    AllSectionsData = [...updatedSection];
  }

  // Dispatch the update once after the loop
  dispatch(setCDSectionData(AllSectionsData));

  const updatedDOCDetails = updateDocDataLocal(
    currentDocumentDetails,
    currentDocumentDetails?.documentDetailsId,
    {
      [`${promoterType}`]: currentDocumentDetails[`${promoterType}`],
    }
  );

  dispatch(setCDDocDetails(updatedDOCDetails));
};

// function to handle change record
export const getSectionChangeRecord = async (
  sectionId: number,
  dispatcher: any
): Promise<any> => {
  let sectionChangeRecord = {};
  await SpServices.SPReadItems({
    Listname: LISTNAMES.SectionDetails,
    Select:
      "*,changeRecordAuthor/ID,changeRecordAuthor/EMail,changeRecordAuthor/Title",
    Expand: "changeRecordAuthor",
    Filter: [
      {
        FilterKey: "ID",
        Operator: "eq",
        FilterValue: sectionId,
      },
    ],
  })
    .then((res: any[]) => {
      console.log(res);
      debugger;
      sectionChangeRecord = {
        changeRecordDescription: res[0].changeRecordDescription
          ? res[0].changeRecordDescription
          : "",
        changeRecordModify: res[0].changeRecordModify
          ? res[0].changeRecordModify
          : res[0].Modified,
        changeRecordAuthor: res[0].changeRecordAuthor
          ? { email: res[0].changeRecordAuthor.EMail }
          : "",
      };
    })
    .catch((err) => console.log(err));
  dispatcher(setSectionChangeRecord(sectionChangeRecord));
  return sectionChangeRecord;
};

const convertToTxtFile = (content: any[]): any => {
  let changeRecordTable = "";

  changeRecordTable = `<table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="width: 8%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Section no
            </th>
            <th style="width: 12%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Section name
            </th>
                  <th style="width: 30%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Current change
            </th>
                  <th style="width: 12%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Author
            </th>
                  <th style="width: 10%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Last modify
            </th>
          </tr>
        </thead>
        <tbody>`;

  content?.forEach((obj: any, index: number) => {
    changeRecordTable += `<tr key={${index}}>
                      <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.sectionOrder}
                </td>
                      <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.sectionName}
                </td>
                      <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.changeRecordDescription}
                </td>
                      <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.changeRecordAuthor.authorName}
                </td>
                      <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${dayjs(obj.changeRecordModify).format("DD-MMM-YYYY hh:mm A")}
                </td>
              </tr>`;
  });
  changeRecordTable += `</tbody></table>`;

  const cleanedTable = changeRecordTable
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ");

  const blob = new Blob([cleanedTable.toString()], {
    type: "text/plain",
  });
  const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
  return file;
};
export const getAllSectionsChangeRecord = async (
  documentId: number,
  dispatcher: any
): Promise<any> => {
  debugger;
  let sectionsChangeRecord: any[] = [];
  let changeRecId: any = null;
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
  })
    .then(async (res: any[]) => {
      console.log(res);
      res?.forEach((obj: any) => {
        if (obj.Title === "Change Record") {
          changeRecId = obj.ID;
        }
        if (obj.changeRecordDescription)
          sectionsChangeRecord.push({
            sectionOrder: parseInt(obj.sectionOrder),
            sectionName: obj.Title,
            changeRecordDescription: obj.changeRecordDescription,
            changeRecordModify: obj.changeRecordModify
              ? obj.changeRecordModify
              : obj.Modified,
            changeRecordAuthor: obj.changeRecordAuthor
              ? { authorName: obj.changeRecordAuthor.Title }
              : "",
          });
      });
    })
    .catch((err) => console.log(err));
  sectionsChangeRecord = sectionsChangeRecord.sort(
    (a, b) => a.sectionOrder - b.sectionOrder
  );
  dispatcher(setAllSectionsChangeRecord(sectionsChangeRecord));
  const _file: any = await convertToTxtFile(sectionsChangeRecord);
  await SpServices.SPDeleteAttachments({
    ListName: LISTNAMES.SectionDetails,
    ListID: changeRecId,
    AttachmentName: "Sample.txt",
  })
    .then((res) => {
      console.log("res:", res);
      SpServices.SPAddAttachment({
        ListName: LISTNAMES.SectionDetails,
        ListID: changeRecId,
        FileName: "Sample.txt",
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
    .catch((err) => {
      console.log(err);
      SpServices.SPAddAttachment({
        ListName: LISTNAMES.SectionDetails,
        ListID: changeRecId,
        FileName: "Sample.txt",
        Attachments: _file,
      })
        .then((res: any) => {
          console.log("res: ", res);
          // _getData();
        })
        .catch((err: any) => {
          console.log("err: ", err);
        });
    });
};
export const addChangeRecord = async (
  changeRecordState: any,
  sectionId: number,
  documentId: number,
  handleClosePopup: any,
  closePopupIndex: number,
  setToastState: any,
  setChangeRecordState: any,
  currentUserDetails: any,
  dispatcher: any
): Promise<void> => {
  console.log(changeRecordState.Description);
  debugger;
  const jsonObject = {
    changeRecordDescription: changeRecordState.Description,
    changeRecordAuthorId: currentUserDetails?.id,
    changeRecordModify: new Date().toISOString(),
  };
  await SpServices.SPUpdateItem({
    ID: sectionId,
    Listname: LISTNAMES.SectionDetails,
    RequestJSON: jsonObject,
  })
    .then(async (res: any) => {
      dispatcher(
        setSectionChangeRecord({
          changeRecordDescription: jsonObject.changeRecordDescription,
          changeRecordModify: jsonObject.changeRecordModify,
          changeRecordAuthor: currentUserDetails,
        })
      );
      handleClosePopup(closePopupIndex);
      setChangeRecordState((prev: any) => ({
        ...prev,
        Description: "",
        IsValid: false,
        ErrorMsg: "",
      }));
      setToastState({
        isShow: true,
        severity: "success",
        title: "Description added!",
        message: "Change record description has been added successfully.",
        duration: 3000,
      });
      await getAllSectionsChangeRecord(documentId, dispatcher);
    })
    .catch((err: any) => console.log(err));
};
