/* eslint-disable no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LISTNAMES } from "../../config/config";
import { defaultTemplates } from "../../constants/DefaultTemplates";
import {
  setAllSDDTemplates,
  setSDDTemplateDetails,
} from "../../redux/features/SDDTemplatesSlice";
import { emptyCheck } from "../../utils/validations";
import SpServices from "../SPServices/SpServices";
import * as dayjs from "dayjs";

// fn that used for adding a SDD template
const AddSDDTemplate = async (
  formData: any,
  setLoaderState: any
): Promise<any> => {
  const templateTitle = formData?.templateName;
  try {
    // const getSectionType = (value: string): string => {
    //   return value === "defaultSection"
    //     ? "default section"
    //     : value === "appendixSection"
    //     ? "appendix section"
    //     : "normal section";
    // };

    // // const sectionKeys = ["defaultSection", "normalSection", "appendixSection"];
    // const sectionKeys = ["normalSection", "appendixSection"];

    // const payloadJSON: any[] = [];

    // sectionKeys.forEach((key) => {
    //   formData?.[key]?.forEach((element: any) => {
    //     if (
    //       key !== "defaultSection" &&
    //       element?.type !== "defaultSection" &&
    //       emptyCheck(element.value) &&
    //       formData?.normalSection?.some(
    //         (item: any) =>
    //           item?.type === "normalSection" ||
    //           (item?.type === "defaultSection" && item?.sectionSelected)
    //       )
    //     ) {
    //       payloadJSON.push({
    //         sequenceNo: String(element.id),
    //         Title: templateTitle,
    //         sectionName: element.value,
    //         sectionType: getSectionType(element?.type),
    //         // mainTemplateId: mainListResponse?.data?.Id,
    //       });
    //     } else if (
    //       key !== "defaultSection" &&
    //       element?.type === "defaultSection" &&
    //       emptyCheck(element.value) &&
    //       element.sectionSelected &&
    //       formData?.normalSection?.some(
    //         (item: any) =>
    //           item?.type === "normalSection" ||
    //           (item?.type === "defaultSection" && item?.sectionSelected)
    //       )
    //     ) {
    //       payloadJSON.push({
    //         sequenceNo: String(element.id),
    //         Title: templateTitle,
    //         sectionName: element.value,
    //         sectionType: getSectionType(element?.type),
    //         // mainTemplateId: mainListResponse?.data?.Id,
    //       });
    //     } else if (
    //       key === "appendixSection" &&
    //       element?.type === "appendixSection" &&
    //       emptyCheck(element.value)
    //     ) {
    //       payloadJSON.push({
    //         sequenceNo: String(element.id),
    //         Title: templateTitle,
    //         sectionName: element.value,
    //         sectionType: getSectionType(element?.key),
    //         // mainTemplateId: mainListResponse?.data?.Id,
    //       });
    //     }
    //   });
    // });

    const getSectionType = (value: string): string => {
      return value === "defaultSection"
        ? "default section"
        : value === "appendixSection"
        ? "appendix section"
        : "normal section";
    };

    // Define the section keys to iterate over
    const sectionKeys = ["normalSection", "appendixSection"];

    const payloadJSON: any[] = [];

    sectionKeys.forEach((key) => {
      formData?.[key]?.forEach((element: any) => {
        // Check for normal and default sections under normalSection
        if (
          key === "normalSection" &&
          emptyCheck(element.value) &&
          (element?.type === "normalSection" ||
            (element?.type === "defaultSection" && element.sectionSelected)) &&
          formData?.normalSection?.some(
            (item: any) =>
              item?.type === "normalSection" ||
              (item?.type === "defaultSection" && item?.sectionSelected)
          )
        ) {
          payloadJSON.push({
            sequenceNo: String(element.id),
            Title: templateTitle,
            sectionName: element.value,
            sectionType: getSectionType(element?.type),
            // mainTemplateId: mainListResponse?.data?.Id,
          });
        }
        // Check for default sections within non-default keys that are selected
        else if (
          key !== "defaultSection" &&
          element?.type === "defaultSection" &&
          emptyCheck(element.value) &&
          element.sectionSelected &&
          formData?.normalSection?.some(
            (item: any) =>
              item?.type === "normalSection" ||
              (item?.type === "defaultSection" && item?.sectionSelected)
          )
        ) {
          payloadJSON.push({
            sequenceNo: String(element.id),
            Title: templateTitle,
            sectionName: element.value,
            sectionType: getSectionType(element?.type),
            // mainTemplateId: mainListResponse?.data?.Id,
          });
        }
        // Check for appendix sections under appendixSection key
        else if (
          key === "appendixSection" &&
          element?.type === "appendixSection" &&
          emptyCheck(element.value)
        ) {
          payloadJSON.push({
            sequenceNo: String(element.id),
            Title: templateTitle,
            sectionName: element.value,
            sectionType: getSectionType(element?.type),
            // mainTemplateId: mainListResponse?.data?.Id,
          });
        }
      });
    });

    setLoaderState({
      isLoading: {
        inprogress: true,
        success: false,
        error: false,
      },
      visibility: true,
      text: "Template creation in progress, please wait...",
      secondaryText: "",
    });

    if (payloadJSON?.length !== 0) {
      const mainListResponse: any = await SpServices.SPAddItem({
        Listname: LISTNAMES.SDDTemplatesMain,
        RequestJSON: {
          Title: templateTitle?.trim(),
          createdDate: dayjs().format("DD/MM/YYYY"),
        },
      });

      const finalPayload: any = payloadJSON?.map((item: any) => {
        return {
          ...item,
          mainTemplateId: mainListResponse?.data?.Id,
        };
      });

      try {
        await Promise.all(
          finalPayload?.map(async (payload: any) => {
            await SpServices.SPAddItem({
              Listname: LISTNAMES.SDDTemplates,
              RequestJSON: payload,
            });
          })
        );
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: true,
            error: false,
          },
          visibility: true,
          text: `Template created successfully!`,
          secondaryText: `The Standardized document developer template "${templateTitle}" has been created successfully! `,
        });
      } catch (err) {
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: false,
            error: true,
          },
          visibility: true,
          text: "Unable to create the template.",
          secondaryText:
            "An unexpected error occurred while creating the template, please try again later.",
        });
      }
    } else {
      setLoaderState({
        isLoading: {
          inprogress: false,
          success: false,
          error: true,
        },
        visibility: true,
        text: "Unable to create empty template.",
        secondaryText:
          "An template must contain some sections, please select any section & try again.",
      });
    }
  } catch (err) {
    setLoaderState({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: true,
      text: "Unable to create the template.",
      secondaryText:
        "An unexpected error occurred while creating the template, please try again later.",
    });
  }
};

// fn that used for updating a SDD template
const UpdateSDDTemplate = async (
  templateData: any,
  formData: any,
  setLoaderState: any
): Promise<any> => {
  const templateTitle = formData?.templateName;
  const getSectionType = (value: string): string => {
    return value === "defaultSection"
      ? "default section"
      : value === "appendixSection"
      ? "appendix"
      : "normal section";
  };

  const sectionKeys = ["normalSection", "appendixSection"];

  const payloadJSON: any[] = [];
  sectionKeys.forEach((key) => {
    formData?.[key]?.forEach((element: any) => {
      if (
        element?.type !== "defaultSection" ||
        (element?.type === "defaultSection" && element.sectionSelected) ||
        (element?.unqID &&
          formData?.normalSection?.some(
            (item: any) =>
              (item?.type === "normalSection" && item?.unqID) ||
              (item?.type === "defaultSection" &&
                item?.sectionSelected &&
                item?.unqID)
          ))
      ) {
        payloadJSON.push({
          id: element.id,
          Title: templateTitle,
          sectionName: element.value,
          sectionType: getSectionType(element?.type),
          unqID: element.unqID,
          sectionSelected: element?.sectionSelected,
          removed: element?.removed,
        });
      }
    });
  });

  setLoaderState({
    isLoading: {
      inprogress: true,
      success: false,
      error: false,
    },
    visibility: true,
    text: "Updating template details, please wait...",
    secondaryText: "",
  });

  await SpServices.SPUpdateItem({
    Listname: LISTNAMES.SDDTemplatesMain,
    ID: templateData?.ID,
    RequestJSON: {
      Title: formData?.templateName,
    },
  });

  const promises = payloadJSON.map(async (payload) => {
    const tempPayload = {
      sequenceNo: String(payload.id),
      Title: payload.Title,
      sectionName: payload.sectionName,
      sectionType: payload.sectionType,
      mainTemplateId: templateData?.ID,
      // createdDate: payload.createdDate,
    };
    if (
      (payload?.unqID !== null &&
        payload?.unqID !== "" &&
        payload?.sectionSelected === false) ||
      (payload?.unqID !== null && payload?.unqID !== "" && payload?.removed)
    ) {
      return await SpServices.SPDeleteItem({
        Listname: LISTNAMES.SDDTemplates,
        ID: payload.unqID,
      });
    }

    if (payload?.unqID !== null && payload?.unqID !== "") {
      return await SpServices.SPUpdateItem({
        Listname: LISTNAMES.SDDTemplates,
        ID: payload?.unqID,
        RequestJSON: tempPayload,
      });
    }

    if (payload?.unqID === null || payload?.unqID === "") {
      return await SpServices.SPAddItem({
        Listname: LISTNAMES.SDDTemplates,
        RequestJSON: tempPayload,
      });
    }
  });

  try {
    await Promise.all(promises);
    setLoaderState({
      isLoading: {
        inprogress: false,
        success: true,
        error: false,
      },
      visibility: true,
      text: `Template updated successfully!`,
      secondaryText: `The Standardized document developer template "${templateTitle}" has been updated successfully! `,
    });
  } catch (error) {
    console.error("Error:", error);

    setLoaderState({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: true,
      text: "Unable to update the template.",
      secondaryText:
        "An unexpected error occurred while updating the template, please try again later.",
    });
  }
};

// fn that used for soft deletion of a SDD template
const softDeleteTemplate = async (
  templateID: any,
  templateName: string,
  setLoaderState: (state: any) => void
): Promise<void> => {
  try {
    // Set loading state to in progress
    setLoaderState({
      isLoading: {
        inprogress: true,
        success: false,
        error: false,
      },
      visibility: true,
      text: "Deleting template, please wait...",
      secondaryText: "",
    });

    // Create an array of promises for the deletion requests
    const updatePromises = SpServices.SPUpdateItem({
      Listname: LISTNAMES.SDDTemplatesMain,
      ID: templateID,
      RequestJSON: {
        isDeleted: true,
      },
    });

    const updatePromisesForSections: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.SDDTemplates,
      Select: "*,mainTemplate/Title,mainTemplate/Id",
      Expand: "mainTemplate",
      Filter: [
        {
          FilterKey: "mainTemplateId",
          Operator: "eq",
          FilterValue: templateID,
        },
        {
          FilterKey: "isDeleted",
          Operator: "eq",
          FilterValue: "0",
        },
      ],
    });

    const sectionsToDelete = updatePromisesForSections?.map(
      async (data: any) => {
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.SDDTemplates,
          ID: data?.ID,
          RequestJSON: {
            isDeleted: true,
          },
        });
      }
    );

    // Wait for all promises to resolve
    const results = await Promise.all([updatePromises, sectionsToDelete]);

    // Log the responses
    results.forEach((res, index) => {
      console.log("res");
    });

    // Set loading state to success
    setLoaderState({
      isLoading: {
        inprogress: false,
        success: true,
        error: false,
      },
      visibility: true,
      text: "Template deleted successfully.",
      secondaryText: `The template "${templateName}" has been deleted successfully!`,
    });
  } catch (err) {
    console.log("Error : ", err);

    // Set loading state to error
    setLoaderState({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: true,
      text: "Unable to delete templates.",
      secondaryText:
        "An error occurred while trying to delete the templates. Please try again.",
    });
  }
};

// Main function to get all main templates
const fetchTemplates = async (): Promise<{
  allMainTemplateData: any[];
}> => {
  try {
    const mainListResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.SDDTemplatesMain,
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
      templateName: value.Title,
      createdDate: value.createdDate || "",
    }));

    return { allMainTemplateData };
  } catch (error) {
    console.log("Error : ", error);
    return { allMainTemplateData: [] };
  }
};

// A function to get and set the formatted tabledata into that state
const LoadTableData = async (
  dispatch: any,
  setTableData?: any
): Promise<void> => {
  setTableData &&
    setTableData((prevData: any) => ({
      ...prevData,
      loading: true,
      data: [],
    }));

  const data = await fetchTemplates();
  const { allMainTemplateData } = data;

  dispatch(setAllSDDTemplates(allMainTemplateData));

  setTableData &&
    setTableData((prevData: any) => ({
      ...prevData,
      loading: false,
      data: allMainTemplateData,
    }));
};

// Main function to load all sections data
const LoadSectionsTemplateData = async (
  templateID: number,
  sectionsData: any,
  setSectionsData: any,
  templateName: string,
  update?: boolean,
  dispatch?: any
): Promise<any> => {
  // Set loading state
  setSectionsData((prev: any) => ({
    ...prev,
    isLoading: true,
  }));

  try {
    // Fetch data from SharePoint
    const filteredData: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.SDDTemplates,
      Select: "*,mainTemplate/Title,mainTemplate/Id",
      Expand: "mainTemplate",
      Filter: [
        {
          FilterKey: "mainTemplateId",
          Operator: "eq",
          FilterValue: templateID,
        },
        {
          FilterKey: "isDeleted",
          Operator: "eq",
          FilterValue: "0",
        },
      ],
    });

    // Initialize arrays for sections
    const defaultSection: any[] = update
      ? defaultTemplates?.map((template: string, index: number) => ({
          id: null,
          unqID: null,
          isValid: true,
          type: "defaultSection",
          value: template,
          sectionSelected: false,
          removed: false,
        }))
      : [];
    const normalSection: any[] = [];
    const appendixSection: any[] = [];

    // Process filtered data
    filteredData?.forEach((e: any) => {
      const sectionData = {
        // id:
        //   e?.sequenceNo !== undefined && e?.sequenceNo !== null
        //     ? e?.sequenceNo
        //     : e?.ID,
        id: Number(e?.sequenceNo) || null,
        unqID: e?.ID,
        isValid: true,
        value: e?.sectionName,
      };

      if (e?.sectionType?.toLowerCase() === "default section") {
        const existingIndex = defaultSection.findIndex(
          (el: any) => el?.value === e?.sectionName
        );

        if (existingIndex !== -1) {
          defaultSection[existingIndex] = {
            ...defaultSection[existingIndex],
            ...sectionData,
            type: "defaultSection",
            sectionSelected: true,
          };
        } else {
          defaultSection.push({
            ...sectionData,
            type: "defaultSection",
            sectionSelected: true,
          });
        }
      } else if (e?.sectionType?.toLowerCase() === "normal section") {
        normalSection.push({
          ...sectionData,
          type: "normalSection",
          removed: false,
        });
      } else if (
        e?.sectionType?.toLowerCase() === "appendix" ||
        e?.sectionType?.toLowerCase() === "appendix section"
      ) {
        appendixSection.push({
          ...sectionData,
          type: "appendixSection",
          removed: false,
        });
      }
    });

    // Order default sections based on predefined order
    const orderedDefaultSection = defaultSection.sort((a, b) => {
      // Handle null values by moving them to the end
      if (a.id === null) return 1;
      if (b.id === null) return -1;

      // Compare numeric values of the `id`
      return parseInt(a.id) - parseInt(b.id);
    });
    // const orderedDefaultSection = defaultSection.sort(
    //   (a, b) =>
    //     defaultTemplates.indexOf(a.value) - defaultTemplates.indexOf(b.value)
    // );

    // const orderedNormalSection = normalSection.sort((a, b) => a.id - b.id);
    const orderedAppendixSection = appendixSection.sort((a, b) => a.id - b.id);

    const mergedNormalSections = [
      ...orderedDefaultSection?.filter((item: any) => item?.id !== null),
      ...normalSection,
    ]?.sort((a, b) => a.id - b.id);

    const currentTemplateDetails: any = {
      templateDetails: {
        templateID: filteredData[0]?.mainTemplate?.Id,
        templateName: filteredData[0]?.mainTemplate?.Title,
      },
      defaultSection: orderedDefaultSection,
      normalSection: [
        ...mergedNormalSections,
        ...orderedDefaultSection?.filter((item: any) => item?.id === null),
      ],
      appendixSection: orderedAppendixSection,
    };

    // Dispatch the template details
    if (dispatch) {
      dispatch(setSDDTemplateDetails(currentTemplateDetails));
    }

    // Set updated section data
    setSectionsData((prev: any) => ({
      ...prev,
      templateName: templateName,
      defaultSection: orderedDefaultSection,
      normalSection: [
        ...mergedNormalSections,
        ...orderedDefaultSection?.filter((item: any) => item?.id === null),
      ],
      appendixSection: appendixSection,
      isLoading: false,
    }));
  } catch (error) {
    console.error("Error loading sections template data:", error);
    setSectionsData((prev: any) => ({
      ...prev,
      isLoading: false,
    }));
  }

  // try {
  //   // Fetch data from SharePoint
  //   const filteredData: any = await SpServices.SPReadItems({
  //     Listname: LISTNAMES.SDDTemplates,
  //     Select: "*,mainTemplate/Title,mainTemplate/Id",
  //     Expand: "mainTemplate",
  //     Filter: [
  //       {
  //         FilterKey: "mainTemplateId",
  //         Operator: "eq",
  //         FilterValue: templateID,
  //       },
  //       {
  //         FilterKey: "isDeleted",
  //         Operator: "eq",
  //         FilterValue: "0",
  //       },
  //     ],
  //   });

  //   // Initialize arrays for sections
  //   const defaultSection: any[] = update
  //     ? defaultTemplates?.map((template: string) => ({
  //         id: null,
  //         unqID: null,
  //         isValid: true,
  //         type: "defaultSection",
  //         value: template,
  //         sectionSelected: false,
  //         removed: false,
  //       }))
  //     : [];

  //   const mergedSections: any[] = [];
  //   const appendixSection: any[] = [];

  //   // Process filtered data
  //   filteredData?.forEach((e: any) => {
  //     const sectionData = {
  //       id:
  //         e?.sequenceNo !== undefined && e?.sequenceNo !== null
  //           ? e?.sequenceNo
  //           : e?.ID,
  //       unqID: e?.ID,
  //       isValid: true,
  //       value: e?.sectionName,
  //     };

  //     if (e?.sectionType?.toLowerCase() === "default section") {
  //       const existingIndex = defaultSection.findIndex(
  //         (el: any) => el?.value === e?.sectionName
  //       );

  //       if (existingIndex !== -1) {
  //         mergedSections[existingIndex] = {
  //           ...mergedSections[existingIndex],
  //           ...sectionData,
  //           type: "defaultSection",
  //           sectionSelected: true,
  //         };
  //       } else {
  //         mergedSections.push({
  //           ...sectionData,
  //           type: "defaultSection",
  //           sectionSelected: true,
  //         });
  //       }
  //     } else if (e?.sectionType?.toLowerCase() === "normal section") {
  //       mergedSections.push({
  //         ...sectionData,
  //         type: "normalSection",
  //         removed: false,
  //       });
  //     } else if (e?.sectionType?.toLowerCase() === "appendix") {
  //       appendixSection.push({
  //         ...sectionData,
  //         type: "appendixSection",
  //         removed: false,
  //       });
  //     }
  //   });

  //   // Order merged sections based on predefined order or ID
  //   const orderedMergedSections = mergedSections.sort((a, b) => {
  //     if (a.id === null) return 1;
  //     if (b.id === null) return -1;
  //     return parseInt(a.id) - parseInt(b.id);
  //   });

  //   const orderedAppendixSection = appendixSection.sort((a, b) => a.id - b.id);

  //   const currentTemplateDetails: any = {
  //     templateDetails: {
  //       templateID: filteredData[0]?.mainTemplate?.Id,
  //       templateName: filteredData[0]?.mainTemplate?.Title,
  //     },
  //     defaultSectionSection: defaultSection,
  //     normalSection: orderedMergedSections,
  //     appendixSection: orderedAppendixSection,
  //   };
  //   // Dispatch the template details
  //   if (dispatch) {
  //     dispatch(setSDDTemplateDetails(currentTemplateDetails));
  //   }

  //   // Set updated section data
  //   setSectionsData((prev: any) => ({
  //     ...prev,
  //     templateName: templateName,
  //     defaultSection: defaultSection,
  //     normalSection: orderedMergedSections,
  //     appendixSection: orderedAppendixSection,
  //     isLoading: false,
  //   }));
  // } catch (error) {
  //   console.error("Error fetching and processing sections:", error);
  // }
};

export {
  AddSDDTemplate,
  LoadTableData,
  UpdateSDDTemplate,
  LoadSectionsTemplateData,
  softDeleteTemplate,
};
