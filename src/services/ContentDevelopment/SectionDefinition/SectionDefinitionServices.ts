/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LISTNAMES } from "../../../config/config";
import { setAllDefinitions } from "../../../redux/features/DefinitionSlice";
import SpServices from "../../SPServices/SpServices";

interface definitionDetails {
  ID: number;
  definitionDetailsId?: number;
  definitionTitle: string;
  definitionDescription: string;
  referenceTitle: string;
  referenceLink: string;
  referenceAuthor: any;
  isSelected: boolean;
  isNew: boolean;
  status: boolean;
  isDeleted: boolean;
}

const getAllSectionDefinitions = async (
  documentId: number,
  sectionId: number
) => {
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
          referenceAuthor: item?.referenceAuthor
            ? {
                Id: item?.referenceAuthor?.ID,
                Email: item?.referenceAuthor?.EMail,
              }
            : null,
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
              referenceAuthor: item?.referenceAuthor
                ? {
                    Id: item?.referenceAuthor?.ID,
                    Email: item?.referenceAuthor?.EMail,
                  }
                : null,
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
              referenceAuthor: item?.referenceAuthor
                ? {
                    Id: item?.referenceAuthor?.ID,
                    Email: item?.referenceAuthor?.EMail,
                  }
                : null,
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
            referenceAuthor: item?.referenceAuthor
              ? {
                  Id: item?.referenceAuthor?.ID,
                  Email: item?.referenceAuthor?.EMail,
                }
              : null,
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

const AddSectionDefinition = (
  selectedDefinitions: any[],
  documentId: number,
  sectionId: number,
  setLoaderState: any
) => {
  const tempArray: any[] = [...selectedDefinitions];
  const tempAddArray = tempArray.filter((obj: any) => obj.status);
  const tempDelArray = tempArray.filter((obj: any) => obj.isDeleted);
  const tempDelUpdateArray = tempArray.filter(
    (obj: any) => !obj.isDeleted && !obj.status
  );
  if (tempAddArray.length > 0) {
    tempAddArray.forEach(async (obj: any, index: number) => {
      let jsonObject = {
        Title: obj.definitionTitle,
        description: obj.definitionDescription,
        referenceAuthorId: obj.referenceAuthor.Id,
        referenceTitle: obj.referenceTitle,
        referenceLink: obj.referenceLink,
        definitionDetailsId: obj.ID,
        sectionDetailsId: sectionId,
        docDetailsId: documentId,
      };
      await SpServices.SPAddItem({
        Listname: "SectionDefinition",
        RequestJSON: jsonObject,
      })
        .then((res: any) => {
          if (
            tempDelArray.length === 0 &&
            tempDelUpdateArray.length === 0 &&
            tempAddArray.length - 1 === index
          ) {
            setLoaderState({
              isLoading: {
                inprogress: false,
                success: true,
                error: false,
              },
              visibility: true,
              text: `Changes updated successfully!`,
              secondaryText: `Definitions add/remove updated successfully! `,
            });
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
        Listname: "SectionDefinition",
        ID: obj.ID,
        RequestJSON: jsonObject,
      })
        .then((res: any) => {
          if (
            tempDelUpdateArray.length === 0 &&
            tempDelArray.length - 1 === index
          ) {
            setLoaderState({
              isLoading: {
                inprogress: false,
                success: true,
                error: false,
              },
              visibility: true,
              text: `Changes updated successfully!`,
              secondaryText: `Definitions add/remove updated successfully! `,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  if (tempDelUpdateArray.length > 0) {
    tempDelUpdateArray.forEach((obj: any, index: number) => {
      let jsonObject = {
        isDeleted: false,
      };
      SpServices.SPUpdateItem({
        Listname: "SectionDefinition",
        ID: obj.ID,
        RequestJSON: jsonObject,
      })
        .then((res: any) => {
          console.log(res);
          if (tempDelUpdateArray.length - 1 === index) {
            setLoaderState({
              isLoading: {
                inprogress: false,
                success: true,
                error: false,
              },
              visibility: true,
              text: `Changes updated successfully!`,
              secondaryText: `Definitions add/remove updated successfully! `,
            });
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
  setSelectedDefinitions: any
) => {
  try {
    const payloadJSON = {
      Title: definitionsData?.definitionName,
      description: definitionsData?.definitionDescription,
      referenceTitle: definitionsData.referenceTitle,
      referenceLink: definitionsData.referenceLink,
      referenceAuthorId: definitionsData.referenceAuthor[0].Id,
      isApproved: false,
    };
    await SpServices.SPAddItem({
      Listname: LISTNAMES.Definition,
      RequestJSON: payloadJSON,
    })
      .then(async (res: any) => {
        console.log(res);
        let jsonObject = {
          Title: definitionsData.definitionName,
          description: definitionsData.definitionDescription,
          referenceAuthorId: definitionsData.referenceAuthor[0].Id,
          referenceTitle: definitionsData.referenceTitle,
          referenceLink: definitionsData.referenceLink,
          definitionDetailsId: res?.data?.ID,
          sectionDetailsId: sectionId,
          docDetailsId: documentId,
        };
        await SpServices.SPAddItem({
          Listname: "SectionDefinition",
          RequestJSON: jsonObject,
        })
          .then((res: any) => {
            console.log(res);
            setLoaderState({
              isLoading: {
                inprogress: false,
                success: true,
                error: false,
              },
              visibility: true,
              text: `Definition created successfully!`,
              secondaryText: `The Standardized definition template "${definitionsData?.definitionName}" has been created successfully! `,
            });
            setSelectedDefinitions((prev: any) => [
              ...prev,
              {
                ID: res.data.ID,
                definitionTitle: definitionsData.definitionName,
                definitionDescription: definitionsData.definitionDescription,
                referenceAuthor: definitionsData.referenceAuthor,
                referenceLink: definitionsData.referenceLink,
                referenceTitle: definitionsData.referenceTitle,
                isDeleted: false,
                isNew: false,
                isSelected: false,
                status: false,
              },
            ]);
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
