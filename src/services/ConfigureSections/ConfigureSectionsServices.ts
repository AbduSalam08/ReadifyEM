/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { LISTNAMES } from "../../config/config";
import { defaultTemplates } from "../../constants/DefaultTemplates";
import { setSDDTemplateDetails } from "../../redux/features/SDDTemplatesSlice";
import { emptyCheck } from "../../utils/validations";
import { AddTask } from "../MyTasks/MyTasksServices";
import SpServices from "../SPServices/SpServices";

// Function to trigger - Adding sections
export const AddSections = async (
  formData: any,
  setLoaderState: any,
  docDetails: any
): Promise<any> => {
  const isPATaskisNotConfigured: boolean =
    docDetails?.role?.toLowerCase() === "primary author" &&
    docDetails?.taskStatus?.toLowerCase() === "not started";

  const templateTitle = formData?.templateDetails?.templateName;
  try {
    // const sectionKeys = ["defaultSections", "appendixSections"];
    const payloadJSON: any[] = [];
    const SATasks: any[] = [];
    const CONSULTANTSTasks: any[] = [];

    const defaultSectionsData: any[] = formData.defaultSections
      ?.filter((item: any) => {
        return item?.sectionSelected;
      })
      ?.sort((a: any, b: any) => {
        return a?.sectionOrderNo - b?.sectionOrderNo;
      })
      ?.map((item: any, index: number) => {
        return { ...item, sectionOrderNo: String(index + 1) };
      });

    const appendixSectionsData: any[] = formData.appendixSections
      ?.filter((item: any) => {
        return item?.sectionSelected;
      })
      ?.sort((a: any, b: any) => {
        return a?.sectionOrderNo - b?.sectionOrderNo;
      })
      ?.map((item: any, index: number) => {
        return { ...item, sectionOrderNo: String(index + 1) };
      });

    [...defaultSectionsData, ...appendixSectionsData]?.forEach(
      (element: any) => {
        if (
          emptyCheck(element?.sectionName?.value) &&
          element?.sectionSelected
        ) {
          payloadJSON.push({
            Title: element?.sectionName?.value,
            templateTitle: templateTitle,
            sectionOrder: element.sectionOrderNo,
            sectionAuthorId: element?.sectionAuthor?.value?.[0]?.id,
            consultantsId: {
              results: element?.consultants?.value?.map((el: any) => el?.id),
            },
            sectionType:
              element?.sectionType === "defaultSections"
                ? "default section"
                : "appendix section",
            documentOfId: docDetails?.documentDetailsId,
            status: "content in progress",
            isActive: element?.sectionSelected,
          });

          if (element?.sectionAuthor?.value?.[0]?.id) {
            SATasks.push({
              taskAssignee: element?.sectionAuthor?.value?.[0]?.id,
              role: "Section Author",
              status: "content in progress",
            });
          }

          element?.consultants?.value?.forEach((el: any) => {
            if (el?.id) {
              CONSULTANTSTasks.push({
                taskAssignee: el?.id,
                role: "Consultant",
                status: "content in progress",
              });
            }
          });
        }
      }
    );

    setLoaderState({
      isLoading: { inprogress: true, success: false, error: false },
      visibility: true,
      text: "Section configuration in progress, please wait...",
      secondaryText: "",
    });

    const DocDetailsResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.DocumentDetails,
      Select:
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail",
      Expand: "primaryAuthor, Author",
      Filter: [
        { FilterKey: "isDraft", Operator: "eq", FilterValue: "0" },
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: docDetails?.documentDetailsId,
        },
      ],
    });

    let updateDocDetails: any = null;

    DocDetailsResponse?.map((el: any) => {
      if (el?.status?.toLowerCase() === "not started") {
        updateDocDetails = {
          status: "In Development",
        };
      }
    });

    if (updateDocDetails !== null) {
      await SpServices.SPUpdateItem({
        Listname: LISTNAMES.DocumentDetails,
        ID: DocDetailsResponse[0]?.ID,
        RequestJSON: updateDocDetails,
      });
    }

    const SATasksResponses = SATasks.map(async (taskItem: any) => {
      await AddTask(
        docDetails?.documentDetailsId,
        taskItem,
        updateDocDetails !== null ? updateDocDetails?.status : null
      );
    });

    const CONSULTANTSTasksResponses = CONSULTANTSTasks.map(
      async (taskItem: any) => {
        await AddTask(
          docDetails?.documentDetailsId,
          taskItem,
          updateDocDetails !== null ? updateDocDetails?.status : null
        );
      }
    );

    await Promise.all(SATasksResponses);
    await Promise.all(CONSULTANTSTasksResponses);

    if (payloadJSON.length > 0) {
      try {
        await Promise.all(
          payloadJSON.map(async (payload: any) => {
            await SpServices.SPAddItem({
              Listname: LISTNAMES.SectionDetails,
              RequestJSON: payload,
            });
          })
        );

        if (isPATaskisNotConfigured) {
          await SpServices.SPUpdateItem({
            Listname: LISTNAMES.MyTasks,
            ID: docDetails?.taskID,
            RequestJSON: {
              taskStatus: "In Development",
              docStatus: "In Development",
            },
          });
        }
        setLoaderState({
          isLoading: { inprogress: false, success: true, error: false },
          visibility: true,
          text: `Sections configured successfully!`,
          secondaryText: `The document "${docDetails?.docName}'s" sections have been configured successfully!`,
        });
      } catch (err) {
        setLoaderState({
          isLoading: { inprogress: false, success: false, error: true },
          visibility: true,
          text: "Unable to configure the sections.",
          secondaryText:
            "An unexpected error occurred while configuring the sections, please try again later.",
        });
      }
    } else {
      setLoaderState({
        isLoading: { inprogress: false, success: false, error: true },
        visibility: true,
        text: "At least one section must be selected.",
        secondaryText:
          "No sections are selected. Please select at least one section to submit.",
      });
    }
  } catch (err) {
    setLoaderState({
      isLoading: { inprogress: false, success: false, error: true },
      visibility: true,
      text: "Unable to configure the sections.",
      secondaryText:
        "An unexpected error occurred while configuring the sections, please try again later.",
    });
  }
};

// Main function to load all sections data
export const LoadSectionsTemplateData = async (
  templateID: number,
  setSectionsData: any,
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
    const defaultSection: any[] = [];
    const normalSection: any[] = [];
    const appendixSection: any[] = [];
    // Process filtered data

    filteredData?.forEach((e: any, index: number) => {
      const sectionData = {
        templateSectionID: e?.ID || null,
        sectionOrderNo: String(index + 1),
        sectionName: {
          value: e?.sectionName,
          placeHolder: "Section name",
          isValid: true,
        },
        sectionAuthor: {
          value: [],
          placeHolder: "Section author",
          isValid: true,
        },
        consultants: {
          value: [],
          placeHolder: "Consultants",
          isValid: true,
          personSelectionLimit: 10,
        },
        isValid: true,
        removed: false,
        sectionSelected: true,
      };

      if (e?.sectionType?.toLowerCase() === "default section") {
        defaultSection.push({
          ...sectionData,
          sectionType: "defaultSection",
        });
      } else if (e?.sectionType?.toLowerCase() === "normal section") {
        normalSection.push({
          ...sectionData,
          sectionType: "normalSection",
        });
      } else if (e?.sectionType?.toLowerCase() === "appendix") {
        appendixSection.push({
          ...sectionData,
          sectionType: "appendixSection",
        });
      }
    });

    // Order default sections based on predefined order
    const orderedDefaultSection = defaultSection.sort(
      (a, b) =>
        defaultTemplates.indexOf(a.value) - defaultTemplates.indexOf(b.value)
    );

    const orderedNormalSection = normalSection.sort((a, b) => a.id - b.id);

    const orderedAppendixSection = appendixSection.sort((a, b) => a.id - b.id);

    const currentTemplateDetails: any = {
      templateDetails: {
        templateID: filteredData[0]?.mainTemplate?.Id,
        templateName: filteredData[0]?.mainTemplate?.Title,
      },
      defaultSections: [...orderedDefaultSection, ...orderedNormalSection]?.map(
        (item: any, index: number) => {
          return {
            ...item,
            sectionOrderNo: String(index + 1),
          };
        }
      ),
      appendixSections: orderedAppendixSection?.map(
        (item: any, index: number) => {
          return {
            ...item,
            sectionOrderNo: String(index + 1),
          };
        }
      ),
    };

    // Dispatch the template details
    if (dispatch) {
      dispatch(setSDDTemplateDetails(currentTemplateDetails));
    }

    // Set updated section data
    setSectionsData((prev: any) => ({
      ...prev,
      ...currentTemplateDetails,
      isLoading: false,
    }));
  } catch (error) {
    console.error("Error loading sections template data:", error);
    setSectionsData((prev: any) => ({
      ...prev,
      isLoading: false,
    }));
  }
};
