/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import SpServices from "../../SPServices/SpServices";
import { LISTNAMES } from "../../../config/config";
import { calculateDueDateByRole } from "../../../utils/validations";
import { getParsedDocData } from "../../../utils/EMManualUtils";
import {
  setCDDocDetails,
  setCDSectionData,
} from "../../../redux/features/ContentDevloperSlice";
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
            contentType: item?.contentType || "initial",
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
  saveAndClose: boolean
): Promise<any> => {
  debugger;
  await SpServices.SPAddAttachment({
    ListName: "SectionDetails",
    ListID: itemID,
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

export const UpdateAttachment = async (
  itemID: number,
  _file: any,
  contentType: any,
  saveAndClose?: boolean | any
): Promise<any> => {
  await SpServices.SPDeleteAttachments({
    ListName: "SectionDetails",
    ListID: itemID,
    AttachmentName: "Sample.txt",
  })
    .then((res) => console.log("res:", res))
    .catch((err) => console.log(err));
  await AddAttachment(itemID, _file, contentType, saveAndClose);
};
