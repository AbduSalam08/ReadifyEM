/* eslint-disable no-debugger */
/* eslint-disable prefer-const */
/* eslint-disable @rushstack/no-new-null */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument } from "pdf-lib";
import { LIBNAMES, LISTNAMES } from "../../config/config";
import SpServices from "../SPServices/SpServices";
import { sp } from "@pnp/sp";
import { trimStartEnd } from "../../utils/validations";
import {
  AddPrimaryAuthorTask,
  UpdatePrimaryAuthorTask,
  UpdateTask,
} from "../MyTasks/MyTasksServices";
import { validateAndFindDate } from "../../utils/NewDocumentUtils";
import dayjs from "dayjs";
import {
  getNextVersions,
  replaceVersionInFilename,
} from "../../utils/EMManualUtils";

// Interface for the properties
interface IProps {
  fileName: string;
  fileID: string;
  filePath: string;
  documentFields?: any;
  setLoaderState: (loaderState: any) => void;
  isDraft?: boolean;
  initiateNewVersion?: any;
  docDetails?: any;
}

// interface for update function props
interface IUpdateProps {
  setLoaderState: (loaderState: any) => void;
  DocumentID: any;
  isDraft: boolean;
  fileID: number;
  changedDocumentPath: string | boolean;
  reorderDoc: boolean;
}

// function to add document to library
const AddNewDocumentToLib = async ({
  fileName,
  fileID,
  filePath,
  documentFields,
  setLoaderState,
  isDraft,
  initiateNewVersion,
  docDetails,
}: IProps): Promise<any> => {
  if (initiateNewVersion) {
    try {
      setLoaderState({
        isLoading: {
          inprogress: true,
          success: false,
          error: false,
        },
        visibility: true,
        text: isDraft
          ? "Saving draft document, please wait..."
          : "Document creation in progress. Please Wait...",
      });

      // Clone the existing PDF file
      const sourceFileUrl = `${docDetails?.documentPath}/${docDetails?.Title}.pdf`; // Update with your source PDF path
      const destinationFileUrl = `${replaceVersionInFilename(
        fileName,
        docDetails?.documentVersion
      )}.pdf`;

      // Read the source file's content
      const fileBuffer = await sp.web
        .getFileByServerRelativeUrl(sourceFileUrl)
        .getBuffer();

      // Upload the file to the destination
      const fileAddResult: any = await sp.web
        .getFolderByServerRelativePath(filePath)
        .files.addUsingPath(destinationFileUrl, fileBuffer, {
          Overwrite: true,
        });

      // Update metadata for the uploaded file
      const fileItem = await fileAddResult.file.getItem();
      console.log("fileItem: ", fileItem);

      await SpServices.SPUpdateItem({
        ID: fileID,
        Listname: LISTNAMES.DocumentDetails,
        RequestJSON: {
          fileDetailsId: fileItem.ID,
          Title: trimStartEnd(
            replaceVersionInFilename(fileName, docDetails?.documentVersion)
          ),
        },
      })
        .then(async (res: any) => {
          await AddPrimaryAuthorTask(fileItem.ID);
          setLoaderState({
            isLoading: {
              inprogress: false,
              success: true,
              error: false,
            },
            visibility: true,
            text: isDraft
              ? "Draft saved successfully!"
              : "New document created successfully!",
            secondaryText: isDraft
              ? `The draft document "${fileName}" has been saved successfully!`
              : `The new document "${fileName}" has been created successfully!`,
          });
          return true;
        })
        .catch((err: any) => {
          console.log("err: ", err);

          setLoaderState({
            isLoading: {
              inprogress: false,
              success: false,
              error: true,
            },
            visibility: true,
            text: "Unable to create the document.",
            secondaryText:
              "An unexpected error occurred while uploading document, please try again later.",
          });
        });

      // Update fields with metadata
      if (documentFields) {
        for (const element of documentFields) {
          await fileItem.update({
            [element.key]: element.value,
          });
        }
      }
    } catch (error) {
      console.error("Error creating or uploading PDF: ", error);

      setLoaderState({
        isLoading: {
          inprogress: false,
          success: false,
          error: true,
        },
        visibility: true,
        text:
          error.message.includes("contains invalid characters") ||
          error.message.includes("potentially dangerous Request")
            ? "Invalid document name"
            : "Unable to create the document.",
        secondaryText:
          error.message.includes("contains invalid characters") ||
          error.message.includes("potentially dangerous Request")
            ? `The document name "${fileName}" contains invalid characters, please use a different name.`
            : "An unexpected error occurred while uploading document, please try again later.",
      });

      return false;
    }
  } else {
    try {
      setLoaderState({
        isLoading: {
          inprogress: true,
          success: false,
          error: false,
        },
        visibility: true,
        text: isDraft
          ? "Saving draft document, please wait..."
          : "Document creation in progress. Please Wait...",
      });

      // Create an empty PDF document
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage();
      const pdfBytes = await pdfDoc.save();

      // Create a blob from the PDF bytes
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // Upload the PDF to the specified SharePoint library
      if (fileName) {
        const fileAddResult: any = await sp.web
          .getFolderByServerRelativePath(filePath)
          .files.addUsingPath(`${fileName}.pdf`, pdfBlob, {
            Overwrite: true,
          });

        // Update metadata for the uploaded file
        const fileItem = await fileAddResult.file.getItem();

        await SpServices.SPUpdateItem({
          ID: fileID,
          Listname: LISTNAMES.DocumentDetails,
          RequestJSON: {
            fileDetailsId: fileItem.ID,
          },
        })
          .then(async (res: any) => {
            await AddPrimaryAuthorTask(fileID);
            setLoaderState({
              isLoading: {
                inprogress: false,
                success: true,
                error: false,
              },
              visibility: true,
              text: isDraft
                ? "Draft saved successfully!"
                : "New document created successfully!",
              secondaryText: isDraft
                ? `The draft document "${fileName}" has been saved successfully!`
                : `The new document "${fileName}" has been created successfully!`,
            });
            return true;
          })
          .catch((err: any) => {
            console.log("err: ", err);

            setLoaderState({
              isLoading: {
                inprogress: false,
                success: false,
                error: true,
              },
              visibility: true,
              text: "Unable to create the document.",
              secondaryText:
                "An unexpected error occured while uploading document, please try again later.",
            });
          });
        // Update fields with metadata
        if (documentFields) {
          for (const element of documentFields) {
            await fileItem.update({
              [element.key]: element.value,
            });
          }
        }

        // return true;
      }
    } catch (error) {
      console.error("Error creating or uploading PDF: ", error);

      setLoaderState({
        isLoading: {
          inprogress: false,
          success: false,
          error: true,
        },
        visibility: true,
        text:
          error.message.includes("contains invalid characters") ||
          error.message.includes("potentially dangerous Request")
            ? "Invalid document name"
            : "Unable to create the document.",
        secondaryText:
          error.message.includes("contains invalid characters") ||
          error.message.includes("potentially dangerous Request")
            ? `The document name "${fileName}" contains invalid characters, please use a different name.`
            : "An unexpected error occured while uploading document, please try again later.",
      });

      return false;
    }
  }
};

// Function to update an existing document in the library
const UpdateDocumentInLib = async ({
  DocumentID,
  fileID,
  setLoaderState,
  isDraft,
  changedDocumentPath,
  reorderDoc,
}: IUpdateProps): Promise<any> => {
  try {
    setLoaderState({
      isLoading: {
        inprogress: true,
        success: false,
        error: false,
      },
      visibility: true,
      text: reorderDoc
        ? "Reordering Documents. Please wait..."
        : "Document update in progress. Please Wait...",
    });

    let documentFields: any;

    const res: any = await SpServices.SPReadItemUsingId({
      Listname: LISTNAMES.DocumentDetails,
      SelectedId: DocumentID,
      Select: "*, primaryAuthor/ID, primaryAuthor/Title",
      Expand: "primaryAuthor",
    });

    const responseData = res;

    documentFields = reorderDoc
      ? {
          sequenceNo: responseData?.sequenceNo,
        }
      : {
          FileLeafRef: responseData?.Title,
          status: responseData?.status,
          isVisible: false,
          nextReviewDate: responseData?.nextReviewDate,
          isDraft: responseData?.isDraft,
          createdDate: responseData?.createdDate,
        };

    if (typeof changedDocumentPath === "string") {
      await sp.web
        .getFileByServerRelativePath(changedDocumentPath)
        .moveByPath(
          `${responseData?.documentPath}/${responseData.Title}.pdf`,
          false,
          false
        )
        .then((res: any) => {
          console.log("res");
        })
        .catch((err: any) => {
          console.log("err: ", err);
        });
    }
    // debugger;
    sp.web.lists
      .getByTitle(LIBNAMES.AllDocuments)
      .items.getById(fileID)
      .update(documentFields)
      .then(async (res: any) => {
        // debugger;
        await SpServices.SPReadItems({
          Listname: LISTNAMES.MyTasks,
          Select: "*,documentDetails/ID",
          Expand: "documentDetails",
          Filter: [
            {
              FilterKey: "documentDetailsId",
              Operator: "eq",
              FilterValue: DocumentID,
            },
          ],
        })
          .then(async (res: any) => {
            const hasPATask: any[] = res?.filter((item: any) => {
              return item?.role?.toLowerCase() === "primary author";
            });
            if (hasPATask?.length !== 0) {
              await UpdatePrimaryAuthorTask(DocumentID);
              await UpdateTask(DocumentID);
            } else {
              await AddPrimaryAuthorTask(DocumentID);
            }
          })
          .catch(async (err: any) => {
            console.log("err: ", err);
            await UpdatePrimaryAuthorTask(DocumentID);
          });

        // if (!isDraft) {
        //   await AddPrimaryAuthorTask(DocumentID);
        // } else {
        //   await UpdatePrimaryAuthorTask(DocumentID);
        //   // await UpdateTask(DocumentID);
        // }

        setLoaderState({
          isLoading: {
            inprogress: false,
            success: true,
            error: false,
          },
          visibility: reorderDoc ? false : true,
          text: reorderDoc
            ? "Reordered successfully!"
            : "Document updated successfully!",
          secondaryText: reorderDoc
            ? ""
            : `The ${isDraft ? "Draft" : " "} document "${
                responseData.Title
              }" has been updated successfully!`,
        });

        return true;
      })
      .catch((err: any) => {
        console.log("err: ", err);
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: false,
            error: true,
          },
          visibility: true,
          text: "Unable to update the document.",
          secondaryText:
            "An unexpected error occurred while updating the document, please try again later.",
        });
      });
  } catch (error) {
    console.error("Error updating the document: ", error);

    setLoaderState({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: true,
      text: "Unable to update the document.",
      secondaryText:
        "An unexpected error occurred while updating the document, please try again later.",
    });

    return false;
  }
};

// Function to create a new document in the list
const AddNewDocument = async (
  data: any[],
  setLoaderState: (loaderState: any) => void,
  isDraft?: boolean,
  AllTempatesMainData?: any
): Promise<any> => {
  const selectedTemplateID: any = AllTempatesMainData?.filter(
    (el: any) => el?.templateName === data[1]?.value
  )[0]?.ID;

  const formData: any = data?.reduce((acc: any, el: any) => {
    acc[el.key] =
      el.key === "approvers" || el.key === "reviewers"
        ? JSON.stringify(el.value)
        : el.key === "primaryAuthorId"
        ? el.value[0]?.id
        : el.key === "Title"
        ? trimStartEnd(el.value)
        : el.key === "documentTemplateTypeId"
        ? selectedTemplateID
        : el.value;
    return acc;
  }, {});

  await SpServices.SPAddItem({
    Listname: LISTNAMES.DocumentDetails,
    RequestJSON: formData,
  })
    .then(async (res: any) => {
      const responseData = res?.data;
      const documentFields = [
        {
          key: "documentDetailsId",
          value: responseData?.Id,
        },
        {
          key: "status",
          value: responseData?.status,
        },
        {
          key: "isVisible",
          value: false,
        },
        {
          key: "nextReviewDate",
          value: responseData?.nextReviewDate,
        },
        {
          key: "isDraft",
          value: isDraft,
        },
        {
          key: "createdDate",
          value: responseData?.createdDate,
        },
        {
          key: "status",
          value: responseData?.status,
        },
        {
          key: "sequenceNo",
          value: responseData?.sequenceNo,
        },
      ];

      // Ensure filePath is correctly passed
      const filePath = responseData?.documentPath;
      console.log("filePath: ", filePath);

      const fileName = responseData?.Title;
      const fileID = responseData?.ID;
      if (filePath && fileName && fileID) {
        debugger;
        await AddNewDocumentToLib({
          fileName,
          fileID,
          filePath,
          documentFields,
          setLoaderState,
          isDraft,
        });
      } else {
        console.error("Error: filePath or fileName is undefined");
      }
    })
    .catch((err: any) => {
      console.log("err: ", err);
      setLoaderState({
        isLoading: {
          inprogress: false,
          success: false,
          error: true,
        },
        visibility: true,
        text: "Unable to create the document.",
        secondaryText:
          "An unexpected error occured while adding document details, please try again later.",
      });
    });
};

// Function to update an existing document in the list
// const UpdateDocument = async (
//   data: any[] | any,
//   fileID: number,
//   setLoaderState: (loaderState: any) => void,
//   DocumentID: number,
//   isDraft: boolean,
//   changedDocumentPath?: any,
//   reorderDoc?: any,
//   AllTempatesMainData?: any,
//   prevDocType?: any
// ): Promise<any> => {
//   debugger;

//   const docTypeChanged: boolean =
//     trimStartEnd(prevDocType) !== trimStartEnd(data[1]?.value);

//   const selectedTemplateID: any = AllTempatesMainData?.filter(
//     (el: any) => el?.templateName === data[1]?.value
//   )[0]?.ID;

//   const formData: any = reorderDoc
//     ? {
//         sequenceNo: data?.sequenceNo,
//       }
//     : data?.reduce((acc: any, el: any) => {
//         acc[el.key] =
//           el.key === "approvers" || el.key === "reviewers"
//             ? JSON.stringify(el.value)
//             : el.key === "primaryAuthorId"
//             ? el?.value?.length === 0
//               ? null
//               : el.value[0]?.id
//             : el.key === "Title"
//             ? trimStartEnd(el.value)
//             : el.key === "isDraft"
//             ? isDraft
//             : el.key === "status"
//             ? docTypeChanged && !isDraft
//               ? "Not Started"
//               : el.value
//             : el.key === "documentTemplateTypeId"
//             ? selectedTemplateID
//             : el.value;
//         return acc;
//       }, {});
//   debugger;
//   await SpServices.SPUpdateItem({
//     Listname: LISTNAMES.DocumentDetails,
//     ID: DocumentID,
//     RequestJSON: formData,
//   })
//     .then(async (res: any) => {
//       if (docTypeChanged) {
//         await SpServices?.SPReadItems({
//           Listname: LISTNAMES.SectionDetails,
//           Select: "*",
//           Filter: [
//             {
//               FilterKey: "documentOfId",
//               Operator: "eq",
//               FilterValue: DocumentID,
//             },
//           ],
//         }).then(async (res: any) => {
//           await SpServices.batchDelete({
//             ListName: LISTNAMES.SectionDetails,
//             responseData: res,
//           });
//         });

//         await SpServices?.SPReadItems({
//           Listname: LISTNAMES.MyTasks,
//           Select: "*",
//           Filter: [
//             {
//               FilterKey: "documentDetailsId",
//               Operator: "eq",
//               FilterValue: DocumentID,
//             },
//           ],
//         }).then(async (res: any) => {
//           await SpServices.batchDelete({
//             ListName: LISTNAMES.MyTasks,
//             responseData: res,
//           });
//         });
//       }

//       await UpdateDocumentInLib({
//         DocumentID,
//         fileID,
//         setLoaderState,
//         isDraft,
//         changedDocumentPath,
//         reorderDoc,
//       });
//     })
//     .catch((err) => {
//       console.error("Error updating document:", err);
//       setLoaderState({
//         isLoading: {
//           inprogress: false,
//           success: false,
//           error: true,
//         },
//         visibility: true,
//         text: "Unable to update the document.",
//         secondaryText:
//           "An unexpected error occurred while updating document details, please try again later.",
//       });
//     });
// };

const UpdateDocument = async (
  data: any[] | any,
  fileID: number,
  setLoaderState: (loaderState: any) => void,
  DocumentID: number,
  isDraft: boolean,
  changedDocumentPath?: any,
  reorderDoc?: any,
  AllTempatesMainData?: any,
  prevDocType?: any,
  initiateNewVersion?: boolean,
  versionChangeType?: string
): Promise<any> => {
  debugger;
  if (initiateNewVersion) {
    try {
      setLoaderState({
        isLoading: {
          inprogress: true,
          success: false,
          error: false,
        },
        visibility: true,
        text: reorderDoc
          ? "Reordering Documents. Please wait..."
          : "Document update in progress. Please Wait...",
      });
      const currentVersion = data?.filter(
        (item: any) => item?.key === "documentVersion"
      )[0];
      const currentNextReviewDate = data?.filter(
        (item: any) => item?.key === "reviewRange"
      )[0];
      const reviewers = data?.filter(
        (item: any) => item?.key === "reviewers"
      )[0];
      const currentReviewers = [
        {
          ...reviewers,
          value: reviewers?.value?.map((item: any) => ({
            ...item,
            status: "pending",
          })),
        },
      ];

      const approvers = data?.filter(
        (item: any) => item?.key === "approvers"
      )[0];
      const currentApprovers = [
        {
          ...approvers,
          value: approvers?.value?.map((item: any) => ({
            ...item,
            status: "pending",
          })),
        },
      ];

      const docTypeChanged =
        trimStartEnd(prevDocType) !== trimStartEnd(data[1]?.value);
      const selectedTemplateID = AllTempatesMainData?.find(
        (el: any) => el?.templateName === data[1]?.value
      )?.ID;

      const newDocVersion =
        versionChangeType === "minor"
          ? getNextVersions(currentVersion?.value).minorVersion
          : versionChangeType === "major"
          ? getNextVersions(currentVersion?.value).majorVersion
          : currentVersion?.value;

      const formData = reorderDoc
        ? { sequenceNo: data?.sequenceNo }
        : data?.reduce((acc: any, el: any) => {
            acc[el.key] =
              el.key === "approvers"
                ? JSON.stringify(currentApprovers)
                : el.key === "reviewers"
                ? JSON.stringify(currentReviewers)
                : el.key === "primaryAuthorId"
                ? el?.value?.length === 0
                  ? null
                  : el.value[0]?.id
                : el.key === "Title"
                ? trimStartEnd(el.value)
                : el.key === "isDraft"
                ? isDraft
                : el.key === "status"
                ? "Not Started"
                : el.key === "documentTemplateTypeId"
                ? selectedTemplateID
                : el.key === "documentVersion"
                ? newDocVersion
                : el.key === "createdDate"
                ? dayjs(new Date()).format("DD/MM/YYYY")
                : el.key === "nextReviewDate"
                ? validateAndFindDate(currentNextReviewDate?.value)
                : el.value;
            return acc;
          }, {});

      console.log("formData: ", formData);

      await SpServices.SPUpdateItem({
        Listname: LISTNAMES.DocumentDetails,
        ID: DocumentID,
        RequestJSON: formData,
      });

      // const docStatus: any = formData?.filter(
      //   (el: any) => el?.key === "status"
      // )[0]?.value;
      // console.log("docStatus: ", docStatus);

      if (docTypeChanged && formData?.status?.toLowerCase() !== "not started") {
        // const [sectionDetails, myTasks] = await Promise.all([
        await SpServices.SPReadItems({
          Listname: LISTNAMES.SectionDetails,
          Select: "*",
          Filter: [
            {
              FilterKey: "documentOfId",
              Operator: "eq",
              FilterValue: DocumentID,
            },
          ],
        }).then(async (sectionDetails: any) => {
          await SpServices.batchDelete({
            ListName: LISTNAMES.SectionDetails,
            responseData: sectionDetails,
          });
        });

        await SpServices.SPReadItems({
          Listname: LISTNAMES.MyTasks,
          Select: "*",
          Filter: [
            {
              FilterKey: "documentDetailsId",
              Operator: "eq",
              FilterValue: DocumentID,
            },
          ],
        }).then(async (myTasks: any) => {
          await SpServices.batchDelete({
            ListName: LISTNAMES.MyTasks,
            responseData: myTasks,
          });
        });
      }
      await SpServices.SPReadItemUsingId({
        Listname: LISTNAMES.DocumentDetails,
        SelectedId: DocumentID,
        Select: "*, fileDetails/ID",
        Expand: "fileDetails",
      })
        .then(async (res: any) => {
          const responseData = res?.[0] || res;
          const docDetails = res?.[0] || res;
          const reviewRangeDate = validateAndFindDate(res?.reviewRange);
          const documentFields = [
            {
              key: "documentDetailsId",
              value: responseData?.Id,
            },
            {
              key: "status",
              value: responseData?.status,
            },
            {
              key: "isVisible",
              value: false,
            },
            {
              key: "nextReviewDate",
              value: reviewRangeDate,
            },
            {
              key: "isDraft",
              value: isDraft,
            },
            {
              key: "createdDate",
              value: dayjs(new Date()).format("DD/MM/YYYY"),
            },
            {
              key: "status",
              value: responseData?.status,
            },
            {
              key: "sequenceNo",
              value: responseData?.sequenceNo,
            },
          ];
          const filePath = responseData?.documentPath;

          const fileName = responseData?.Title;
          const fileID = responseData?.ID;
          if (filePath && fileName && fileID) {
            await AddNewDocumentToLib({
              fileName,
              fileID,
              filePath,
              documentFields,
              setLoaderState,
              isDraft,
              initiateNewVersion,
              docDetails,
            });
          } else {
            console.error("Error: filePath or fileName is undefined");
          }
        })
        .catch((err: any) => {
          console.log("err: ", err);
        });
    } catch (err: any) {
      console.log("err: ", err);
      console.error("Error updating document:", err);
      if (
        err.message !==
        "Item does not exist. It may have been deleted by another user."
      ) {
        setLoaderState({
          isLoading: { inprogress: false, success: false, error: true },
          visibility: true,
          text: "Unable to update the document.",
          secondaryText:
            "An unexpected error occurred while updating document details, please try again later.",
        });
      }
    }
  } else {
    try {
      setLoaderState({
        isLoading: {
          inprogress: true,
          success: false,
          error: false,
        },
        visibility: true,
        text: reorderDoc
          ? "Reordering Documents. Please wait..."
          : "Document update in progress. Please Wait...",
      });
      const docTypeChanged =
        trimStartEnd(prevDocType) !== trimStartEnd(data[1]?.value);
      const selectedTemplateID = AllTempatesMainData?.find(
        (el: any) => el?.templateName === data[1]?.value
      )?.ID;

      const formData = reorderDoc
        ? { sequenceNo: data?.sequenceNo }
        : data?.reduce((acc: any, el: any) => {
            acc[el.key] =
              el.key === "approvers" || el.key === "reviewers"
                ? JSON.stringify(el.value)
                : el.key === "primaryAuthorId"
                ? el?.value?.length === 0
                  ? null
                  : el.value[0]?.id
                : el.key === "Title"
                ? trimStartEnd(el.value)
                : el.key === "isDraft"
                ? isDraft
                : el.key === "status"
                ? docTypeChanged && el?.value !== "Not Started" && !isDraft
                  ? "Not Started"
                  : el.value
                : el.key === "documentTemplateTypeId"
                ? selectedTemplateID
                : el.value;
            return acc;
          }, {});

      await SpServices.SPUpdateItem({
        Listname: LISTNAMES.DocumentDetails,
        ID: DocumentID,
        RequestJSON: formData,
      });

      const docStatus: any = data?.filter((el: any) => el?.key === "status")[0]
        ?.value;
      console.log("docStatus: ", docStatus);

      if (docTypeChanged && docStatus !== "Not Started") {
        // const [sectionDetails, myTasks] = await Promise.all([
        await SpServices.SPReadItems({
          Listname: LISTNAMES.SectionDetails,
          Select: "*",
          Filter: [
            {
              FilterKey: "documentOfId",
              Operator: "eq",
              FilterValue: DocumentID,
            },
          ],
        }).then(async (sectionDetails: any) => {
          await SpServices.batchDelete({
            ListName: LISTNAMES.SectionDetails,
            responseData: sectionDetails,
          });
        });

        await SpServices.SPReadItems({
          Listname: LISTNAMES.MyTasks,
          Select: "*",
          Filter: [
            {
              FilterKey: "documentDetailsId",
              Operator: "eq",
              FilterValue: DocumentID,
            },
          ],
        }).then(async (myTasks: any) => {
          await SpServices.batchDelete({
            ListName: LISTNAMES.MyTasks,
            responseData: myTasks,
          });
        });
        // ]);

        // console.log("myTasks: ", myTasks);
        // console.log("sectionDetails: ", sectionDetails);

        // await Promise.all([

        // ]).then(async (res: any) => {
        await UpdateDocumentInLib({
          DocumentID,
          fileID,
          setLoaderState,
          isDraft,
          changedDocumentPath,
          reorderDoc,
        });
        // .catch((err: any) => {
        //   console.log("err: ", err);
        // });

        // });
      } else {
        await UpdateDocumentInLib({
          DocumentID,
          fileID,
          setLoaderState,
          isDraft,
          changedDocumentPath,
          reorderDoc,
        });
      }
    } catch (err) {
      console.error("Error updating document:", err);
      if (
        err.message !==
        "Item does not exist. It may have been deleted by another user."
      ) {
        setLoaderState({
          isLoading: { inprogress: false, success: false, error: true },
          visibility: true,
          text: "Unable to update the document.",
          secondaryText:
            "An unexpected error occurred while updating document details, please try again later.",
        });
      }
    }
  }
};
// function to get all document details
const GetDocumentDetails = async (
  documentID: number,
  setFormData: any,
  formData: any,
  setPopupLoaders: any
): Promise<void> => {
  try {
    setPopupLoaders({
      isLoading: {
        inprogress: true,
        success: false,
        error: false,
      },
      visibility: true,
      text: "Fetching document details, please wait...",
    });
    const res: any = await SpServices.SPReadItemUsingId({
      Listname: LISTNAMES.DocumentDetails,
      SelectedId: documentID,
      Select:
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, documentTemplateType/Title, documentTemplateType/ID",
      Expand: "primaryAuthor, documentTemplateType",
    });
    if (res) {
      console.log("res: ", res);
      setPopupLoaders({
        isLoading: {
          inprogress: true,
          success: false,
          error: false,
        },
        visibility: false,
        text: "Data fetched!",
      });
      const matchedValue: any = formData.map((e: any) => {
        const matchedKey: any = Object.keys(res).find((key) => key === e.key);
        if (matchedKey) {
          if (matchedKey === "primaryAuthorId") {
            return {
              ...e,
              value: res.primaryAuthor ? [res.primaryAuthor] : [],
            };
          } else if (matchedKey === "documentTemplateTypeId") {
            return {
              ...e,
              value: res?.documentTemplateType?.Title || "",
            };
          } else if (matchedKey === "reviewers" || matchedKey === "approvers") {
            return {
              ...e,
              value:
                typeof res[matchedKey] === "string"
                  ? JSON.parse(res[matchedKey])
                  : res[matchedKey],
            };
          } else {
            return {
              ...e,
              value: res[matchedKey] || "",
            };
          }
        }
        return e;
      });

      setFormData(matchedValue);
    }
  } catch (err) {
    setPopupLoaders({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: false,
      text: "Error while fetching document details, try again.",
      secondaryText:
        "An unexpected error occured while fetching document details, please try again later.",
    });
    console.error("Error fetching document details: ", err);
    setFormData(null);
  }
};

export {
  AddNewDocument,
  AddNewDocumentToLib,
  GetDocumentDetails,
  UpdateDocument,
  UpdateDocumentInLib,
};
