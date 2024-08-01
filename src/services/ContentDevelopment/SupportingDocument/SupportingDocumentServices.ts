/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LISTNAMES } from "../../../config/config";
import SpServices from "../../SPServices/SpServices";

const getAllDocuments = async (sectionId: number, documentId: number) => {
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
      console.log(err);
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
        FilterValue: "Approved",
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
    .catch((err) => console.log(err));
  return tempArray;
};

const getApprovedDocuments = (documents: any) => {
  const approvedDocuments: any = [];
  documents.forEach(async (document: any) => {
    await SpServices.SPReadItemUsingId({
      Listname: LISTNAMES.AllDocuments,
      SelectedId: document.documentId,
      Select:
        "*, FileLeafRef, FileRef, FileDirRef, Author/Title, Author/EMail, Author/Id",
      Expand: "File, Author",
    })
      .then((res: any) => {
        if (res?.File?.ServerRelativeUrl) {
          const tempDocumentDetails = {
            ...document,
            ...res,
          };
          approvedDocuments.push(tempDocumentDetails);
          // setAllDocumentsLink((prev: any) => {
          //   return [...prev, tempDocumentDetails];
          // });
          // setFilterDocuments((prev: any) => {
          //   return [...prev, tempDocumentDetails];
          // });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
  return approvedDocuments;
  // setAllDocumentsLink(approvedDocuments);
};

const submitSupportingDocuments = (
  selectedDocuments: any,
  documentId: number,
  sectionId: number,
  setToastState: any,
  getSelectedFun: any
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
        .then((res: any) => {
          console.log(res);
          renderCondition = true;
          if (
            tempAddArray.length - 1 === index &&
            tempDelArray.length === 0 &&
            tempDelUpdateArray.length === 0
          ) {
            setToastState({
              isShow: true,
              severity: "success",
              title: "Updated Supporting Documents",
              message: "Successfully adding/deleting supporting documents",
              duration: 3000,
            });
            getSelectedFun();
            return renderCondition;
          }
        })
        .catch((err) => console.log(err));
    });
  }
  if (tempDelArray.length > 0) {
    // toast.error("Please select atleast one document to add");
    tempDelArray.forEach((obj: any, index: number) => {
      const jsonObject = {
        isDeleted: true,
      };
      SpServices.SPUpdateItem({
        Listname: "SupportingDocuments",
        ID: obj.ID,
        RequestJSON: jsonObject,
      })
        .then((res: any) => {
          renderCondition = true;
          if (
            tempDelArray.length - 1 === index &&
            tempDelUpdateArray.length === 0
          ) {
            setToastState({
              isShow: true,
              severity: "success",
              title: "Updated Supporting Documents",
              message: "Successfully adding/deleting supporting documents",
              duration: 3000,
            });
            getSelectedFun();
            return renderCondition;
          }
        })
        .catch((err) => {
          console.log(err);
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
        .then((res: any) => {
          renderCondition = true;
          if (tempDelUpdateArray.length - 1 === index) {
            setToastState({
              isShow: true,
              severity: "success",
              title: "Updated Supporting Documents",
              message: "Successfully adding/deleting supporting documents",
              duration: 3000,
            });
            getSelectedFun();
            return renderCondition;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  // return renderCondition;
};

const updateSectionDetails = (sectionID: number) => {
  SpServices.SPUpdateItem({
    Listname: LISTNAMES.SectionDetails,
    ID: sectionID,
    RequestJSON: { sectionSubmitted: true },
  })
    .then((res: any) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};

export {
  getAllDocuments,
  getDocumentDeatils,
  getApprovedDocuments,
  submitSupportingDocuments,
  updateSectionDetails,
};
