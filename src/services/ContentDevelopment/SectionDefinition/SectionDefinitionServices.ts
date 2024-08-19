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
  definitionTitle: string;
  definitionDescription: string;
  referenceTitle: string;
  referenceLink: string;
  referenceAuthorName: any;
  isSelected: boolean;
  isNew: boolean;
  status: boolean;
  isDeleted: boolean;
}

const convertDefinitionsToTxtFile = (content: any[]): any => {
  let filterDefinitions = content.filter((obj: any) => !obj.isDeleted);
  let definitionsTable = "";

  definitionsTable = `<table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="width: 10%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              S.No
            </th>
            <th style="width: 30%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Definition name
            </th>
            <th style="width: 60%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Description
            </th>
          </tr>
        </thead>
        <tbody>`;

  filterDefinitions?.forEach((obj: any, index: number) => {
    definitionsTable += `<tr key={${index}}>
                <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${index + 1}
                </td>
                <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.definitionTitle}
                </td>
                <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.definitionDescription}
                </td>
              </tr>`;
  });
  definitionsTable += `</tbody></table>`;

  const cleanedTable = definitionsTable
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ");

  const blob = new Blob([cleanedTable.toString()], {
    type: "text/plain",
  });
  const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
  return file;
};
const convertReferenceToTxtFile = (content: any[]): any => {
  let filterDefinitions = content.filter((obj: any) => !obj.isDeleted);
  let referencesTable = "";

  referencesTable = `<table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="width: 10%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              S.No
            </th>
            <th style="width: 20%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Reference Title
            </th>
            <th style="width: 20%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Author
            </th>
            <th style="width: 50%; font-size: 15px; color: #555; padding: 15px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
              Link
            </th>
          </tr>
        </thead>
        <tbody>`;

  filterDefinitions?.forEach((obj: any, index: number) => {
    referencesTable += `<tr key={${index}}>
                <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${index + 1}
                </td>
                <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.referenceTitle}
                </td>
                <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.referenceAuthorName}
                </td>
                <td style="font-size: 13px; padding: 8px 20px; line-height: 18px; font-family: interMedium,sans-serif; text-align: center; border: 1px solid #DDD;">
                  ${obj.referenceLink}
                </td>
              </tr>`;
  });
  referencesTable += `</tbody></table>`;

  const cleanedTable = referencesTable
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ");

  const blob = new Blob([cleanedTable.toString()], {
    type: "text/plain",
  });
  const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
  return file;
};

const getAllSectionDefinitions = async (
  documentId: number,
  sectionId: number
): Promise<any> => {
  debugger;
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
      {
        FilterKey: "sectionDetails",
        Operator: "eq",
        FilterValue: sectionId,
      },
    ],
  })
    .then((res: any[]) => {
      res?.forEach((item: any) => {
        tempArray.push({
          ID: item.ID,
          definitionTitle: item.Title,
          definitionDescription: item.description,
          referenceAuthorName: item.referenceAuthorName,
          referenceLink: item.referenceLink,
          referenceTitle: item.referenceTitle,
          definitionDetailsId: item.definitionDetails.ID,
          isSelected: false,
          isNew: false,
          status: false,
          isDeleted: item.isDeleted ? true : false,
        });
      });
    })
    .catch((err) => console.log(err));
  return tempArray;
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
              definitionTitle: item.Title,
              definitionDescription: item.description,
              // referenceAuthor: item?.referenceAuthor
              //   ? {
              //       Id: item?.referenceAuthor?.ID,
              //       Email: item?.referenceAuthor?.EMail,
              //     }
              //   : null,
              referenceAuthorName: item?.referenceAuthorName,
              referenceLink: item.referenceLink,
              referenceTitle: item.referenceTitle,
              isSelected: false,
              isNew: false,
              status: false,
              isDeleted: false,
            });
          } else {
            tempArray.push({
              ID: item.ID,
              definitionTitle: item.Title,
              definitionDescription: item.description,
              // referenceAuthor: item?.referenceAuthor
              //   ? {
              //       Id: item?.referenceAuthor?.ID,
              //       Email: item?.referenceAuthor?.EMail,
              //     }
              //   : null,
              referenceAuthorName: item?.referenceAuthorName,
              referenceLink: item.referenceLink,
              referenceTitle: item.referenceTitle,
              isSelected: true,
              isNew: false,
              status: false,
              isDeleted: false,
            });
          }
        } else {
          tempArray.push({
            ID: item.ID,
            definitionTitle: item.Title,
            definitionDescription: item.description,
            referenceAuthorName: item?.referenceAuthorName,
            // referenceAuthor: item?.referenceAuthor
            //   ? [
            //       {
            //         Id: item?.referenceAuthor?.ID,
            //         Email: item?.referenceAuthor?.EMail,
            //       },
            //     ]
            //   : [],
            referenceLink: item.referenceLink,
            referenceTitle: item.referenceTitle,
            isSelected: false,
            isNew: false,
            status: false,
            isDeleted: false,
          });
        }
      });
      // setSectionDefinitions([...tempArray]);
      // setSelectedDefinitions([...tempArray]);
      // getMasterDefinition();
    })
    .catch((err) => console.log(err));
  return tempArray;
};

const AddSectionAttachment = async (sectionId: number, file: any) => {
  await SpServices.SPDeleteAttachments({
    ListName: LISTNAMES.SectionDetails,
    ListID: sectionId,
    AttachmentName: "Sample.txt",
  })
    .then((res) => {
      console.log("res:", res);
      SpServices.SPAddAttachment({
        ListName: LISTNAMES.SectionDetails,
        ListID: sectionId,
        FileName: "Sample.txt",
        Attachments: file,
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
        ListID: sectionId,
        FileName: "Sample.txt",
        Attachments: file,
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
const AddReferenceAttachment = async (documentId: number, file: any) => {
  debugger;
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
        AddSectionAttachment(obj.ID, file);
      }
    });
  });
};

const AddSectionDefinition = (
  selectedDefinitions: any[],
  documentId: number,
  sectionId: number,
  setLoaderState: any,
  setToastState: any,
  setInitialLoader: any
) => {
  debugger;
  setInitialLoader(true);
  const tempArray: any[] = [...selectedDefinitions];
  const tempAddArray = tempArray.filter((obj: any) => obj.status);
  const tempDelArray = tempArray.filter((obj: any) => obj.isDeleted);
  const tempDelUpdateArray = tempArray.filter(
    (obj: any) => !obj.isDeleted && !obj.status
  );
  if (tempAddArray.length > 0) {
    tempAddArray.forEach(async (obj: any, index: number) => {
      const jsonObject = {
        Title: obj.definitionTitle,
        description: obj.definitionDescription,
        referenceAuthorName: obj.referenceAuthorName,
        referenceTitle: obj.referenceTitle,
        referenceLink: obj.referenceLink,
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
            tempDelUpdateArray.length === 0 &&
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
            let sectionDefinitions = getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const definitions_file: any = await convertDefinitionsToTxtFile(
              await sectionDefinitions
            );
            AddSectionAttachment(sectionId, definitions_file);
            const reference_file: any = await convertReferenceToTxtFile(
              await sectionDefinitions
            );
            AddReferenceAttachment(documentId, reference_file);
            setToastState({
              isShow: true,
              severity: "success",
              title: "Content updated!",
              message: "The content has been updated successfully.",
              duration: 3000,
            });
            setInitialLoader(false);
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
        Listname: LISTNAMES.sectionDefinition,
        ID: obj.ID,
        RequestJSON: jsonObject,
      })
        .then(async (res: any) => {
          if (
            tempDelUpdateArray.length === 0 &&
            tempDelArray.length - 1 === index
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
            let sectionDefinitions = getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const _file: any = await convertDefinitionsToTxtFile(
              await sectionDefinitions
            );
            AddSectionAttachment(sectionId, _file);
            const reference_file: any = await convertReferenceToTxtFile(
              await sectionDefinitions
            );
            AddReferenceAttachment(documentId, reference_file);
            setToastState({
              isShow: true,
              severity: "success",
              title: "Content updated!",
              message: "The content has been updated successfully.",
              duration: 3000,
            });
            setInitialLoader(false);
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
        Listname: LISTNAMES.sectionDefinition,
        ID: obj.ID,
        RequestJSON: jsonObject,
      })
        .then(async (res: any) => {
          console.log(res);
          if (tempDelUpdateArray.length - 1 === index) {
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
            let sectionDefinitions = getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const _file: any = await convertDefinitionsToTxtFile(
              await sectionDefinitions
            );
            AddSectionAttachment(sectionId, _file);
            const reference_file: any = await convertReferenceToTxtFile(
              await sectionDefinitions
            );
            AddReferenceAttachment(documentId, reference_file);
            setToastState({
              isShow: true,
              severity: "success",
              title: "Content updated!",
              message: "The content has been updated successfully.",
              duration: 3000,
            });
            setInitialLoader(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
};

const addNewDefinition = async (
  definitionsData: any,
  documentId: number,
  sectionId: number,
  setLoaderState: any,
  setToastState: any,
  setSelectedDefinitions: any,
  setInitialLoader: any,
  setPopupController: any,
  togglePopupVisibility: any
) => {
  try {
    setInitialLoader(true);
    const payloadJSON = {
      Title: definitionsData?.definitionName,
      description: definitionsData?.definitionDescription,
      referenceTitle: definitionsData.referenceTitle,
      referenceAuthorName: definitionsData.referenceAuthorName,
      referenceLink: definitionsData.referenceLink,
      // referenceAuthorId: definitionsData.referenceAuthor[0].Id,
      isApproved: false,
    };
    await SpServices.SPAddItem({
      Listname: LISTNAMES.Definition,
      RequestJSON: payloadJSON,
    })
      .then(async (res: any) => {
        console.log(res);
        const jsonObject = {
          Title: definitionsData.definitionName,
          description: definitionsData.definitionDescription,
          // referenceAuthorId: definitionsData.referenceAuthor[0].Id,
          referenceTitle: definitionsData.referenceTitle,
          referenceAuthorName: definitionsData.referenceAuthorName,
          referenceLink: definitionsData.referenceLink,
          definitionDetailsId: res?.data?.ID,
          sectionDetailsId: sectionId,
          docDetailsId: documentId,
        };
        await SpServices.SPAddItem({
          Listname: LISTNAMES.sectionDefinition,
          RequestJSON: jsonObject,
        })
          .then(async (res: any) => {
            console.log(res);
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
            let sectionDefinitions = getAllSectionDefinitions(
              documentId,
              sectionId
            );
            const _file: any = await convertDefinitionsToTxtFile(
              await sectionDefinitions
            );
            AddSectionAttachment(sectionId, _file);
            const reference_file: any = await convertReferenceToTxtFile(
              await sectionDefinitions
            );
            AddReferenceAttachment(documentId, reference_file);
            togglePopupVisibility(setPopupController, 0, "close");
            setSelectedDefinitions((prev: any) => [
              {
                ID: res.data.ID,
                definitionTitle: definitionsData.definitionName,
                definitionDescription: definitionsData.definitionDescription,
                referenceAuthorName: definitionsData.referenceAuthorName,
                referenceLink: definitionsData.referenceLink,
                referenceTitle: definitionsData.referenceTitle,
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
            console.log(err);
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
    console.log("error: ", error);
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
  AddSectionDefinition,
  addNewDefinition,
  LoadDefinitionTableData,
};
