/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { CONFIG, LISTNAMES } from "../../../config/config";
import {
  setCDDocDetails,
  setCDSectionData,
} from "../../../redux/features/ContentDevloperSlice";
import {
  getCurrentPromoter,
  updateSectionDataLocal,
} from "../../../utils/contentDevelopementUtils";
import SpServices from "../../SPServices/SpServices";

const getAllSupportingDocumentsData = async (
  sectionId: number,
  documentId: number
) => {
  const tempSelectedDocumentsArray: any = [];
  await SpServices.SPReadItems({
    Listname: LISTNAMES.sectionSupportingDoc,
    Select: "*,sectionDetail/ID,documentDetail/ID",
    Expand: "sectionDetail,documentDetail",
    Filter: [
      {
        FilterKey: "sectionDetail",
        Operator: "eq",
        FilterValue: sectionId,
      },
      {
        FilterKey: "documentDetail",
        Operator: "eq",
        FilterValue: documentId,
      },
    ],
  })
    .then((res: any) => {
      res?.forEach((obj: any) => {
        tempSelectedDocumentsArray.push({
          ID: obj?.ID,
          documentName: obj?.Title,
          documentLink: obj?.documentLink,
          sectionId: sectionId,
          documentId: documentId,
          isSelected: true,
          isNew: false,
          status: false,
          isDeleted: obj.isDeleted ? true : false,
        });
      });
      // setSelectedDocuments([...tempSelectedDocumentsArray]);
      // getDocumentDeatils([...tempSelectedDocumentsArray]);
    })
    .catch((err: any) => {
      console.log("Error : ", err);
    });
  return tempSelectedDocumentsArray;
};

const getDocumentDeatils = async (Data: any[]) => {
  const tempArray: any = [];
  await SpServices.SPReadItems({
    Listname: LISTNAMES.DocumentDetails,
    Select: "*,fileDetails/ID",
    Expand: "fileDetails",
    Filter: [
      {
        FilterKey: "status",
        Operator: "eq",
        FilterValue: "Current",
      },
    ],
  })
    .then((res: any[]) => {
      res?.forEach((item: any) => {
        const index = Data.findIndex(
          (obj: any) => obj.documentName === item.Title
        );
        if (Data[index]) {
          if (Data[index].isDeleted) {
            tempArray.push({
              ID: item.ID,
              documentId: item.fileDetailsId,
              documentName: item.Title,
              isSelected: false,
            });
          } else {
            tempArray.push({
              ID: item.ID,
              documentId: item.fileDetailsId,
              documentName: item.Title,
              isSelected: true,
            });
          }
        } else {
          tempArray.push({
            ID: item.ID,
            documentId: item.fileDetailsId,
            documentName: item.Title,
            isSelected: false,
          });
        }
      });
      // getApprovedDocuments(tempArray);
    })
    .catch((error) => console.log("Error : ", error));
  return tempArray;
};

const getApprovedDocuments = async (Data: any) => {
  const approvedDocuments: any = [];
  // await documents.forEach(async (document: any) => {
  await SpServices.SPReadItems({
    Listname: LISTNAMES.AllDocuments,
    Select:
      "*, FileLeafRef, FileRef, FileDirRef, Author/Title, Author/EMail, Author/Id",
    Expand: "File, Author",
    Filter: [
      {
        FilterKey: "status",
        Operator: "eq",
        FilterValue: "Approved",
      },
    ],
  })
    .then((res: any) => {
      const tempArray = res?.map((obj: any) => {
        if (obj?.File?.Name) {
          return {
            ID: obj.ID,
            FileRef: CONFIG.tenantURL + obj.FileRef,
            documentName: obj.FileLeafRef.replace(".pdf", ""),
          };
        }
      });
      tempArray?.forEach((item: any) => {
        const index = Data.findIndex(
          (obj: any) => obj.documentName === item.documentName
        );
        if (Data[index]) {
          if (Data[index].isDeleted) {
            approvedDocuments.push({
              ID: item.ID,
              FileRef: item.FileRef,
              documentName: item.documentName,
              isSelected: false,
            });
          } else {
            approvedDocuments.push({
              ID: item.ID,
              FileRef: item.FileRef,
              documentName: item.documentName,
              isSelected: true,
            });
          }
        } else {
          approvedDocuments.push({
            ID: item.ID,
            FileRef: item.FileRef,
            documentName: item.documentName,
            isSelected: false,
          });
        }
      });

      // if (res?.File?.ServerRelativeUrl) {
      //   const tempDocumentDetails = {
      //     ...document,
      //     ...res,
      //   };
      //   approvedDocuments.push(tempDocumentDetails);
      // setAllDocumentsLink((prev: any) => {
      //   return [...prev, tempDocumentDetails];
      // });
      // setFilterDocuments((prev: any) => {
      //   return [...prev, tempDocumentDetails];
      // });
      // }
    })
    .catch((err: any) => {
      console.log("Error : ", err);
    });
  // });
  return await approvedDocuments;
  // setAllDocumentsLink(approvedDocuments);
};

const convertSupportingDocToTxtFile = (
  content: any[],
  sectionOrder: number
): any => {
  const filterSupportingDocuments = content.filter(
    (obj: any) => !obj.isDeleted
  );
  let supportingDocTable = "";

  // supportingDocTable = `<table style="border-collapse: collapse; width: 100%;">
  //       <thead>
  //         <tr>
  //           <th style="width: 10%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             S.No
  //           </th>
  //           <th style="width: 30%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             Document name
  //           </th>
  //           <th style="width: 60%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
  //             Link
  //           </th>
  //         </tr>
  //       </thead>
  //       <tbody>`;
  supportingDocTable += `<div style="margin-left: 25px;">`;

  filterSupportingDocuments?.forEach((obj: any, index: number) => {
    // supportingDocTable += `<tr key={${index}}>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${index + 1}
    //             </td>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    //               ${obj.documentName}
    //             </td>
    //             <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
    // <a style="word-break: break-all;" href=${
    //   obj.documentLink.startsWith("https://")
    //     ? obj.documentLink
    //     : "https://" + obj.documentLink
    // } target="_blank">
    //   ${
    //     obj.documentLink.startsWith("https://")
    //       ? obj.documentLink
    //       : "https://" + obj.documentLink
    //   }
    // </a>
    //             </td>
    //           </tr>`;

    supportingDocTable += `<div style="width:100%;margin-bottom: 10px;">
      <span style="width:5%;line-height: 20px;font-weight: 500;font-size: 17px;">
      ${sectionOrder}.${index + 1}.</span>
      <span style="width:95%;">
        <a style="word-break: break-all;" href=${
          obj.documentLink.startsWith("https://")
            ? encodeURI(obj.documentLink)
            : encodeURI("https://" + obj.documentLink)
        } target="_blank">
          ${obj.documentName}
        </a>
      </span>
    </div>`;
  });
  // supportingDocTable += `</tbody></table>`;
  supportingDocTable += `</div>`;

  const cleanedTable = supportingDocTable
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/"/g, "'");

  const blob = new Blob([JSON.stringify(cleanedTable)], {
    type: "text/plain",
  });
  const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
  return file;
};

const AddSectionAttachment = async (sectionId: number, file: any) => {
  await SpServices.SPDeleteAttachments({
    ListName: LISTNAMES.SectionDetails,
    ListID: sectionId,
    AttachmentName: "Sample.txt",
  })
    .then((res) => {
      SpServices.SPAddAttachment({
        ListName: LISTNAMES.SectionDetails,
        ListID: sectionId,
        FileName: "Sample.txt",
        Attachments: file,
      });
    })
    .catch((err) => {
      console.log("Error : ", err);
      SpServices.SPAddAttachment({
        ListName: LISTNAMES.SectionDetails,
        ListID: sectionId,
        FileName: "Sample.txt",
        Attachments: file,
      });
    });
};

const submitSupportingDocuments = (
  selectedDocuments: any,
  documentId: number,
  sectionId: number,
  setToastState: any,
  getSelectedFun: any,
  sectionOrder: number
) => {
  let renderCondition: boolean = false;
  const tempArray: any[] = [...selectedDocuments];
  const tempAddArray = tempArray.filter((obj: any) => obj.status);
  const tempDelArray = tempArray.filter((obj: any) => obj.isDeleted);
  const tempDelUpdateArray = tempArray.filter(
    (obj: any) => !obj.isDeleted && !obj.status
  );

  if (tempAddArray.length > 0) {
    tempAddArray.forEach((obj: any, index: number) => {
      const jsonObject = {
        Title: obj.documentName,
        documentLink: obj.documentLink,
        sectionDetailId: sectionId,
        documentDetailId: documentId,
      };
      SpServices.SPAddItem({
        Listname: "SupportingDocuments",
        RequestJSON: jsonObject,
      })
        .then(async (res: any) => {
          renderCondition = true;
          if (
            tempAddArray.length - 1 === index &&
            tempDelArray.length === 0 &&
            tempDelUpdateArray.length === 0
          ) {
            const supportingDocumentsData = getAllSupportingDocumentsData(
              sectionId,
              documentId
            );
            const supportingDoc_file: any = await convertSupportingDocToTxtFile(
              await supportingDocumentsData,
              sectionOrder
            );
            AddSectionAttachment(sectionId, supportingDoc_file);
            setToastState({
              isShow: true,
              severity: "success",
              title: "Content updated!",
              message: "The content has been updated successfully.",
              duration: 3000,
            });
            getSelectedFun();
            return renderCondition;
          }
        })
        .catch((error) => console.log("Error : ", error));
    });
  }
  if (tempDelArray.length > 0) {
    // toast.error("Please select atleast one document to add");
    tempDelArray.forEach((obj: any, index: number) => {
      SpServices.SPDeleteItem({
        Listname: "SupportingDocuments",
        ID: obj.ID,
      })
        .then(async (res: any) => {
          renderCondition = true;
          if (
            tempDelArray.length - 1 === index &&
            tempDelUpdateArray.length === 0
          ) {
            const supportingDocumentsData = getAllSupportingDocumentsData(
              sectionId,
              documentId
            );
            const supportingDoc_file: any = await convertSupportingDocToTxtFile(
              await supportingDocumentsData,
              sectionOrder
            );
            AddSectionAttachment(sectionId, supportingDoc_file);
            setToastState({
              isShow: true,
              severity: "success",
              title: "Content updated!",
              message: "The content has been updated successfully.",
              duration: 3000,
            });
            getSelectedFun();
            return renderCondition;
          }
        })
        .catch((err) => {
          console.log("Error : ", err);
        });
    });
  }
  if (tempDelUpdateArray.length > 0) {
    tempDelUpdateArray.forEach((obj: any, index: number) => {
      const jsonObject = {
        isDeleted: false,
      };
      SpServices.SPUpdateItem({
        Listname: "SupportingDocuments",
        ID: obj.ID,
        RequestJSON: jsonObject,
      })
        .then(async (res: any) => {
          renderCondition = true;
          if (tempDelUpdateArray.length - 1 === index) {
            const supportingDocumentsData = getAllSupportingDocumentsData(
              sectionId,
              documentId
            );
            const supportingDoc_file: any = await convertSupportingDocToTxtFile(
              await supportingDocumentsData,
              sectionOrder
            );
            AddSectionAttachment(sectionId, supportingDoc_file);
            setToastState({
              isShow: true,
              severity: "success",
              title: "Content updated!",
              message: "The content has been updated successfully.",
              duration: 3000,
            });
            getSelectedFun();
            return renderCondition;
          }
        })
        .catch((err) => {
          console.log("Error : ", err);
        });
    });
  }
  // return renderCondition;
};

const updateSectionDetails = async (
  sectionID: number,
  AllsectionData?: any,
  dispatch?: any,
  currentDocDetailsData?: any
) => {
  // const currentSectionDetail = AllsectionData?.filter(
  //   (item: any) => item?.ID === sectionID
  // )[0];

  const docInReview: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in review";

  const docInApproval: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in approval";

  // const sectionInRework: boolean =
  //   currentSectionDetail?.sectionStatus?.toLowerCase() === "rework in progress";

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
    !docInReview &&
    !docInApproval &&
    isReviewerNotInProgress &&
    isApproverNotInProgress
      ? "submitted"
      : docInReview || isReviewerInProgress
      ? `Yet to be reviewed (${currentPromoter?.currentOrder}/${currentPromoter?.totalPromoters})`
      : docInApproval || isApproverInProgress
      ? `Yet to be approved (${currentPromoter?.currentOrder}/${currentPromoter?.totalPromoters})`
      : "Content in progress";

  await SpServices.SPUpdateItem({
    ID: sectionID,
    Listname: LISTNAMES.SectionDetails,
    RequestJSON: {
      sectionSubmitted: true,
      status: currentSectionStatus,
      sectionRework: !currentSectionStatus?.toLowerCase()?.includes("rework")
        ? false
        : currentSectionStatus?.toLowerCase()?.includes("rework"),
    },
  })
    .then(async (res: any) => {
      const updateArray = updateSectionDataLocal(AllsectionData, sectionID, {
        sectionSubmitted: true,
        sectionStatus: currentSectionStatus,
        sectionRework:
          !currentSectionStatus?.toLowerCase()?.includes("rework") && false,
      });

      dispatch(setCDSectionData([...updateArray]));

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
      console.log("Error : ", err);
    });

  // SpServices.SPUpdateItem({
  //   Listname: LISTNAMES.SectionDetails,
  //   ID: sectionID,
  //   RequestJSON: { sectionSubmitted: true, status: "submitted" },
  // })
  //   .then((res: any) => {
  //     const updatedSections = updateSectionDataLocal(
  //       AllsectionData,
  //       sectionID,
  //       {
  //         sectionSubmitted: true,
  //         sectionStatus: "submitted",
  //       }
  //     );

  //     dispatch(setCDSectionData([...updatedSections]));
  //   })
  //   .catch((error)=>console.log("Error : ",error));
};

export {
  getAllSupportingDocumentsData,
  getDocumentDeatils,
  getApprovedDocuments,
  submitSupportingDocuments,
  updateSectionDetails,
};
