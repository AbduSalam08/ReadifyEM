/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LISTNAMES } from "../../config/config";
// import { defaultTemplates } from "../../constants/DefaultTemplates";
import {
  setAllDefinitions,
  setDefinitionDetails,
} from "../../redux/features/DefinitionSlice";
// import { emptyCheck } from "../../utils/validations";
import SpServices from "../SPServices/SpServices";
// import * as dayjs from "dayjs";

// Update Difinition Function
const UpdateDefinition = async (
  formData: any,
  setLoaderState: any
): Promise<any> => {
  const templateTitle = formData?.definitionName;
  setLoaderState({
    isLoading: {
      inprogress: true,
      success: false,
      error: false,
    },
    visibility: true,
    text: `Updating definition, please wait...`,
    //  secondaryText: `The Standardized definition template "${templateTitle}" has been updated successfully! `,
  });
  try {
    const payloadJSON = {
      Title: formData?.definitionName,
      description: formData?.definitionDescription,
      referenceTitle: formData.referenceTitle,
      referenceLink: formData.referenceLink,
      referenceAuthorId: formData.referenceAuthor[0].Id,
    };

    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.Definition,
      RequestJSON: payloadJSON,
      ID: formData.ID,
    })
      .then((res) => {
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: true,
            error: false,
          },
          visibility: true,
          text: `Definition updated successfully!`,
          secondaryText: `The Standardized definition template "${templateTitle}" has been updated successfully! `,
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
          text: "Unable to update the definition.",
          secondaryText:
            "An unexpected error occurred while update the definition, please try again later.",
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
      text: "Unable to update the definition.",
      secondaryText:
        "An unexpected error occurred while update the definition, please try again later.",
    });
  }
};

const DeleteDefinition = async (
  formData: any,
  setLoaderState: any
): Promise<any> => {
  const templateTitle = formData?.definitionName;
  setLoaderState({
    isLoading: {
      inprogress: true,
      success: false,
      error: false,
    },
    visibility: true,
    text: `Deleting definition, please wait...`,
    //  secondaryText: `The Standardized definition template "${templateTitle}" has been updated successfully! `,
  });
  try {
    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.Definition,
      RequestJSON: { isDeleted: true },
      ID: formData.ID,
    })
      .then((res) => {
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: true,
            error: false,
          },
          visibility: true,
          text: `Definition deleted successfully!`,
          secondaryText: `The Standardized definition template "${templateTitle}" has been deleted successfully! `,
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
          text: "Unable to delete the definition.",
          secondaryText:
            "An unexpected error occurred while delete the definition, please try again later.",
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
      text: "Unable to delete the definition.",
      secondaryText:
        "An unexpected error occurred while delete the definition, please try again later.",
    });
  }
};

const ApproveDefinition = async (
  formData: any,
  setLoaderState: any
): Promise<any> => {
  const templateTitle = formData?.definitionName;
  setLoaderState({
    isLoading: {
      inprogress: true,
      success: false,
      error: false,
    },
    visibility: true,
    text: `Updating definition, please wait...`,
    //  secondaryText: `The Standardized definition template "${templateTitle}" has been updated successfully! `,
  });
  try {
    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.Definition,
      RequestJSON: { isApproved: true },
      ID: formData.ID,
    })
      .then((res) => {
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: true,
            error: false,
          },
          visibility: true,
          text: `Definition Approved successfully!`,
          secondaryText: `The Standardized definition template "${templateTitle}" has been Approved successfully! `,
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
          text: "Unable to approve the definition.",
          secondaryText:
            "An unexpected error occurred while approve the definition, please try again later.",
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
      text: "Unable to approve the definition.",
      secondaryText:
        "An unexpected error occurred while approve the definition, please try again later.",
    });
  }
};

// Add Definition Function
const AddDefinition = async (
  formData: any,
  setLoaderState: any
): Promise<any> => {
  const templateTitle = formData?.definitionName;
  setLoaderState({
    isLoading: {
      inprogress: true,
      success: false,
      error: false,
    },
    visibility: true,
    text: `Creating new definition, please wait...`,
    //  secondaryText: `The Standardized definition template "${templateTitle}" has been updated successfully! `,
  });
  try {
    const payloadJSON = {
      Title: formData?.definitionName,
      description: formData?.definitionDescription,
      referenceTitle: formData.referenceTitle,
      referenceLink: formData.referenceLink,
      referenceAuthorId: formData.referenceAuthor[0].Id,
    };

    await SpServices.SPAddItem({
      Listname: LISTNAMES.Definition,
      RequestJSON: payloadJSON,
    })
      .then((res) => {
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: true,
            error: false,
          },
          visibility: true,
          text: `Definition created successfully!`,
          secondaryText: `The Standardized definition template "${templateTitle}" has been created successfully! `,
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

// A function to get and set the formatted tabledata into that state
const LoadDefinitionTableData = async (
  setTableData: (data: any) => void,
  dispatch: any
): Promise<void> => {
  setTableData((prevData: any) => ({
    ...prevData,
    loading: true,
    data: [],
  }));

  const data = await fetchTemplates();
  const { allMainTemplateData } = data;
  dispatch(setAllDefinitions(allMainTemplateData));
  setTableData((prevData: any) => ({
    ...prevData,
    loading: false,
    data: allMainTemplateData,
  }));
};

// Main function to load all sections data
const LoadDefinitionData = async (
  templateID: number,
  sectionsData: any,
  setSectionsData: any,
  templateName: string,
  update?: boolean,
  dispatch?: any
): Promise<any> => {
  debugger;
  // Set loading state
  setSectionsData((prev: any) => ({
    ...prev,
    isLoading: true,
  }));

  try {
    // Fetch data from SharePoint
    await SpServices.SPReadItemUsingId({
      Listname: LISTNAMES.Definition,
      SelectedId: templateID,
      Select:
        "*,referenceAuthor/Id,referenceAuthor/Title,referenceAuthor/EMail",
      Expand: "referenceAuthor",
    })
      .then((res: any) => {
        console.log(res);
        const CurrentDefinitionDetails: any = {
          ID: templateID,
          definitionName: res?.Title ? res.Title : "",
          definitionDescription: res?.description ? res.description : "",
          referenceTitle: res?.referenceTitle ? res.referenceTitle : "",
          referenceAuthor: res?.referenceAuthor
            ? [
                {
                  Id: res?.referenceAuthor?.Id,
                  Email: res?.referenceAuthor?.EMail,
                },
              ]
            : [],
          referenceLink: res?.referenceLink ? res.referenceLink : "",
          isLoading: false,
        };
        setSectionsData((prevData: any) => ({
          ...prevData,
          ID: templateID,
          definitionName: res?.Title ? res.Title : "",
          definitionDescription: res?.description ? res.description : "",
          referenceTitle: res?.referenceTitle ? res.referenceTitle : "",
          referenceAuthor: res?.referenceAuthor
            ? [
                {
                  Id: res?.referenceAuthor?.Id,
                  Email: res?.referenceAuthor?.EMail,
                },
              ]
            : "",
          referenceLink: res?.referenceLink ? res.referenceLink : "",
          isLoading: false,
        }));
        dispatch(setDefinitionDetails(CurrentDefinitionDetails));
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.error("Error loading sections template data:", error);
    setSectionsData((prev: any) => ({
      ...prev,
      isLoading: false,
    }));
  }
};

export {
  LoadDefinitionTableData,
  LoadDefinitionData,
  AddDefinition,
  UpdateDefinition,
  DeleteDefinition,
  ApproveDefinition,
};
