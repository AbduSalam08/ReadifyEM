/* eslint-disable no-dupe-else-if */
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
  debugger;
  const isPATaskisNotConfigured: boolean =
    docDetails?.role?.toLowerCase() === "primary author" &&
    docDetails?.taskStatus?.toLowerCase() === "not started";

  const templateTitle = formData?.templateDetails?.templateName;
  try {
    // const sectionKeys = ["defaultSections", "appendixSections"];
    const payloadJSON: any[] = [
      {
        Title: "Header",
        templateTitle: "",
        sectionOrder: "0",
        sectionType: "header section",
        sectionAuthorId: docDetails?.taskAssignedBy?.ID,
        documentOfId: docDetails?.documentDetailsId,
        status: "content in progress",
        isActive: true,
      },
    ];
    const SATasks: any[] = [];
    const CONSULTANTSTasks: any[] = [];

    const defaultSectionsData: any[] = formData.defaultSections
      ?.filter((item: any) => {
        return item?.sectionSelected && !item?.removed;
      })
      ?.sort((a: any, b: any) => {
        return a?.sectionOrderNo - b?.sectionOrderNo;
      })
      ?.map((item: any, index: number) => {
        return { ...item, sectionOrderNo: String(index + 1) };
      });

    const appendixSectionsData: any[] = formData.appendixSections
      ?.filter((item: any) => {
        return item?.sectionSelected && !item?.removed;
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
              element?.sectionType === "defaultSection" ||
              element?.sectionType === "normalSections"
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
              Title: element?.sectionName?.value,
            });
          }

          element?.consultants?.value?.forEach((el: any) => {
            if (el?.id) {
              CONSULTANTSTasks.push({
                taskAssignee: el?.id,
                role: "Consultant",
                status: "content in progress",
                Title: element?.sectionName?.value,
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
            try {
              const mainRes: any = await SpServices.SPAddItem({
                Listname: LISTNAMES.SectionDetails,
                RequestJSON: payload,
              });

              console.log("SPAddItem response: ", mainRes);
              if (mainRes?.data?.Title?.toLowerCase() !== "header") {
                try {
                  const res = await SpServices.SPReadItems({
                    Listname: LISTNAMES.MyTasks,
                    Select: "*,documentDetails/ID",
                    Expand: "documentDetails",
                    Filter: [
                      {
                        FilterValue: mainRes?.data?.Title,
                        FilterKey: "Title",
                        Operator: "eq",
                      },
                      {
                        FilterValue: docDetails?.documentDetailsId,
                        FilterKey: "documentDetails",
                        Operator: "eq",
                      },
                    ],
                  });

                  console.log("SPReadItems response: ", res);

                  await Promise.all(
                    res.map(async (item: any) => {
                      try {
                        await SpServices.SPUpdateItem({
                          Listname: LISTNAMES.MyTasks,
                          ID: item?.ID,
                          RequestJSON: {
                            sectionDetailsId: mainRes?.data?.ID,
                          },
                        });
                        console.log(`Item ${item?.ID} updated successfully.`);
                      } catch (err) {
                        console.error(`Error updating item ${item?.ID}: `, err);
                      }
                    })
                  );
                } catch (err) {
                  console.error("Error reading items from MyTasks: ", err);
                }
              }
            } catch (err) {
              console.error("Error adding item to SectionDetails: ", err);
            }
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

export const updateSections = async (
  formData: any,
  setLoaderState: any,
  docDetails: any
): Promise<any> => {
  try {
    const sectionsToUpdate: any[] = [];
    const sectionsToAdd: any[] = [];

    const defaultSectionsData: any[] = formData.defaultSections
      ?.filter((item: any) => {
        return (
          item?.sectionSelected || (item?.ID !== null && !item?.sectionSelected)
        );
      })
      ?.sort((a: any, b: any) => {
        return a?.sectionOrderNo - b?.sectionOrderNo;
      })
      ?.map((item: any, index: number) => {
        return { ...item, sectionOrderNo: String(index + 1) };
      });

    const appendixSectionsData: any[] = formData.appendixSections
      ?.filter((item: any) => {
        return (
          item?.sectionSelected || (item?.ID !== null && !item?.sectionSelected)
        );
      })
      ?.sort((a: any, b: any) => {
        return a?.sectionOrderNo - b?.sectionOrderNo;
      })
      ?.map((item: any, index: number) => {
        return { ...item, sectionOrderNo: String(index + 1) };
      });

    [...defaultSectionsData, ...appendixSectionsData]?.forEach(
      (element: any) => {
        const sectionPayload = {
          Title: element?.sectionName?.value,
          templateTitle: formData?.templateDetails?.templateName,
          sectionOrder: element.sectionOrderNo,
          sectionAuthorId: element?.sectionAuthor?.value?.[0]?.id,
          consultantsId: {
            results: element?.consultants?.value?.map((el: any) => el?.id),
          },
          sectionType:
            element?.sectionType === "defaultSection" ||
            element?.sectionType === "normalSections"
              ? "default section"
              : "appendix section",
          documentOfId: docDetails?.documentDetailsId,
          status: "content in progress",
          isActive: element?.sectionSelected && !element?.removed,
          ID: element?.ID,
        };

        // if (element?.ID || element?.templateSectionID) {
        //   // If section has an ID or templateSectionID, add to update list
        //   sectionsToUpdate.push({
        //     ...sectionPayload,
        //     ID: element?.ID,
        //   });
        // } else if (!element?.removed) {
        //   // If section does not have an ID and is not marked as removed, add to add list
        //   sectionsToAdd.push(sectionPayload);
        // }
        if (element?.templateSectionID || element?.ID) {
          sectionsToUpdate.push(sectionPayload);
        } else {
          sectionsToAdd.push(sectionPayload);
        }
      }
    );

    // Handle update sections
    if (sectionsToUpdate.length > 0) {
      setLoaderState({
        isLoading: { inprogress: true, success: false, error: false },
        visibility: true,
        text: "Updating sections, please wait...",
        secondaryText: "",
      });

      try {
        await Promise.all(
          sectionsToUpdate.map(async (section: any) => {
            await SpServices.SPUpdateItem({
              Listname: LISTNAMES.SectionDetails,
              ID: section.ID,
              RequestJSON: section,
            });
          })
        );

        setLoaderState({
          isLoading: { inprogress: false, success: true, error: false },
          visibility: true,
          text: "Sections updated successfully!",
          secondaryText: `The document "${docDetails?.docName}'s" sections have been updated successfully!`,
        });
      } catch (err) {
        setLoaderState({
          isLoading: { inprogress: false, success: false, error: true },
          visibility: true,
          text: "Unable to update the sections.",
          secondaryText:
            "An unexpected error occurred while updating the sections, please try again later.",
        });
      }
    }

    // Handle add sections
    if (sectionsToAdd.length > 0) {
      setLoaderState({
        isLoading: { inprogress: true, success: false, error: false },
        visibility: true,
        text: "Adding new sections, please wait...",
        secondaryText: "",
      });

      try {
        await Promise.all(
          sectionsToAdd.map(async (payload: any) => {
            await SpServices.SPAddItem({
              Listname: LISTNAMES.SectionDetails,
              RequestJSON: payload,
            });
          })
        );

        setLoaderState({
          isLoading: { inprogress: false, success: true, error: false },
          visibility: true,
          text: "Sections added successfully!",
          secondaryText: `The document "${docDetails?.docName}'s" sections have been added successfully!`,
        });
      } catch (err) {
        setLoaderState({
          isLoading: { inprogress: false, success: false, error: true },
          visibility: true,
          text: "Unable to add the sections.",
          secondaryText:
            "An unexpected error occurred while adding the sections, please try again later.",
        });
      }
    }

    if (sectionsToUpdate.length === 0 && sectionsToAdd.length === 0) {
      setLoaderState({
        isLoading: { inprogress: false, success: false, error: true },
        visibility: true,
        text: "No sections to update or add.",
        secondaryText:
          "No sections are selected for update or add. Please select at least one section.",
      });
    }
  } catch (err) {
    setLoaderState({
      isLoading: { inprogress: false, success: false, error: true },
      visibility: true,
      text: "Unable to process the sections.",
      secondaryText:
        "An unexpected error occurred while processing the sections, please try again later.",
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

export const getUniqueSectionsDetails = async (
  documentDetailsID: any,
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
    const sectionsResponse: any = await SpServices.SPReadItems({
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

    // Initialize arrays for sections
    const defaultSection: any[] = [];
    const normalSection: any[] = [];
    const appendixSection: any[] = [];

    // Process sections response data
    sectionsResponse?.forEach((e: any, index: number) => {
      const sectionData = {
        templateDetails: {
          templateID: e?.ID || null,
          templateName: e?.templateTitle,
        },
        sectionOrderNo: e?.sectionOrder,
        sectionName: {
          value: e?.Title,
          placeHolder: "Section name",
          isValid: true,
        },
        sectionAuthor: {
          value: e?.sectionAuthor
            ? [
                {
                  id: e?.sectionAuthor?.ID,
                  text: e?.sectionAuthor?.Title,
                  email: e?.sectionAuthor?.EMail,
                },
              ]
            : [],
          placeHolder: "Section author",
          isValid: true,
        },
        consultants: {
          value:
            e?.consultants?.map((consultant: any) => ({
              id: consultant?.ID,
              text: consultant?.Title,
              email: consultant?.EMail,
            })) || [],
          placeHolder: "Consultants",
          isValid: true,
          personSelectionLimit: 10,
        },
        isValid: true,
        removed: false,
        sectionSelected: e?.isActive,
        ID: e?.ID,
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
      } else if (e?.sectionType?.toLowerCase() === "appendix section") {
        appendixSection.push({
          ...sectionData,
          sectionType: "appendixSection",
        });
      }
    });

    // Order sections
    const orderedDefaultSection = defaultSection.sort(
      (a, b) => a.sectionOrderNo - b.sectionOrderNo
    );

    const orderedNormalSection = normalSection.sort(
      (a, b) => a.sectionOrderNo - b.sectionOrderNo
    );

    const orderedAppendixSection = appendixSection.sort(
      (a, b) => a.sectionOrderNo - b.sectionOrderNo
    );

    const currentTemplateDetails: any = {
      defaultSections: [...orderedDefaultSection, ...orderedNormalSection]?.map(
        (el: any, index: number) => ({
          ...el,
          sectionOrderNo: String(index + 1),
        })
      ),
      appendixSections: orderedAppendixSection?.map(
        (el: any, index: number) => ({
          ...el,
          sectionOrderNo: String(index + 1),
        })
      ),
    };

    // Set updated section data
    setSectionsData((prev: any) => ({
      ...prev,
      ...currentTemplateDetails,
      isLoading: false,
    }));
  } catch (error) {
    console.error("Error loading unique sections details:", error);
    setSectionsData((prev: any) => ({
      ...prev,
      isLoading: false,
    }));
  }
};
