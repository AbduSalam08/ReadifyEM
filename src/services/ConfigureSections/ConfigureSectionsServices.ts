/* eslint-disable max-lines */
/* eslint-disable prefer-const */
/* eslint-disable no-dupe-else-if */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { LISTNAMES } from "../../config/config";
// import { defaultTemplates } from "../../constants/DefaultTemplates";
import { setSDDTemplateDetails } from "../../redux/features/SDDTemplatesSlice";
import {
  calculateDueDateByRole,
  emptyCheck,
  // trimStartEnd,
} from "../../utils/validations";
import { AddTask } from "../MyTasks/MyTasksServices";
import SpServices from "../SPServices/SpServices";

// Function to trigger - Adding sections
export const AddSections = async (
  formData: any,
  setLoaderState: any,
  docDetails: any,
  noHeader?: boolean,
  addNewSectionFromUpdate?: boolean
): Promise<any> => {
  debugger;
  const isPATaskisNotConfigured: boolean =
    docDetails?.role?.toLowerCase() === "primary author" &&
    docDetails?.taskStatus?.toLowerCase() === "not started";

  const templateTitle = formData?.templateDetails?.templateName;

  if (docDetails?.docVersion !== "1.0") {
    try {
      const payloadJSON: any[] = [];
      const sectionsToAdd: any[] = [];

      let hasChangeRecord: any;
      // let hasReferences: any;
      let hasHeader: any;

      const sectionItems = await SpServices.SPReadItems({
        Listname: LISTNAMES.SectionDetails,
        Select: "*, documentOf/ID",
        Expand: "documentOf",
        Filter: [
          {
            FilterKey: "documentOf",
            Operator: "eq",
            FilterValue: docDetails?.documentDetailsId,
          },
        ],
      });

      hasChangeRecord = sectionItems?.filter(
        (item: any) => item?.sectionType?.toLowerCase() === "change record"
      );
      // hasReferences = sectionItems?.filter(
      //   (item: any) => item?.sectionType?.toLowerCase() === "references section"
      // );
      hasHeader = sectionItems?.filter(
        (item: any) => item?.sectionType?.toLowerCase() === "header section"
      );

      if (hasChangeRecord?.length !== 0) {
        try {
          await SpServices.SPDeleteAttachments({
            ListName: LISTNAMES.SectionDetails,
            AttachmentName: "Sample.txt",
            ListID: hasChangeRecord[0]?.ID,
          });
        } catch (err) {
          console.error("Error deleting attachment:", err);
        }
      } else {
        sectionsToAdd.push({
          Title: "Change Record",
          templateTitle: "",
          sectionOrder: String(formData?.appendixSections?.length + 1),
          sectionType: "change record",
          sectionAuthorId: docDetails?.taskAssignedBy?.ID,
          documentOfId: docDetails?.documentDetailsId,
          status: "content in progress",
          isActive: true,
        });
      }

      if (hasHeader?.length === 0) {
        sectionsToAdd.push({
          Title: "Header",
          templateTitle: "",
          sectionOrder: "0",
          sectionType: "header section",
          sectionAuthorId: docDetails?.taskAssignedBy?.ID,
          documentOfId: docDetails?.documentDetailsId,
          status: "content in progress",
          isActive: true,
        });
      }

      // const hasDefinitions = formData?.defaultSections?.filter(
      //   (item: any) =>
      //     trimStartEnd(item?.sectionName?.value?.toLowerCase()) ===
      //     "definitions"
      // );

      // if (
      //   hasDefinitions?.length !== 0 &&
      //   hasDefinitions[0]?.sectionSelected &&
      //   hasReferences?.length === 0
      // ) {
      //   sectionsToAdd.push({
      //     Title: "References",
      //     templateTitle: "",
      //     sectionOrder: String(
      //       formData?.defaultSections?.filter(
      //         (item: any) => item?.sectionSelected && !item?.removed
      //       )?.length + 1
      //     ),
      //     sectionType: "references section",
      //     sectionAuthorId: docDetails?.taskAssignedBy?.ID,
      //     documentOfId: docDetails?.documentDetailsId,
      //     status: "content in progress",
      //     isActive: true,
      //   });
      // }

      const getUpdatedSectionsData = (sections: any[], type: string): any =>
        sections
          ?.filter((item: any) => item?.sectionSelected && !item?.removed)
          ?.sort(
            (a: any, b: any) =>
              parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo)
          )
          ?.map((item: any, index: number) => ({
            ...item,
            sectionOrderNo: addNewSectionFromUpdate
              ? item?.sectionOrderNo
              : String(index + 1),
            sectionType: type,
          }));

      const defaultSectionsData = getUpdatedSectionsData(
        formData.defaultSections,
        "default section"
      );
      const appendixSectionsData = getUpdatedSectionsData(
        formData.appendixSections,
        "appendix section"
      );

      const SATasks: any[] = [];
      const CONSULTANTSTasks: any[] = [];

      [...defaultSectionsData, ...appendixSectionsData]?.forEach(
        (element: any) => {
          const isReferenceSections =
            element?.sectionName?.value?.toLowerCase() === "references";

          if (
            emptyCheck(element?.sectionName?.value) &&
            element?.sectionSelected
          ) {
            const sectionPayload = {
              Title: element?.sectionName?.value,
              templateTitle: formData?.templateDetails?.templateName,
              sectionOrder: element.sectionOrderNo,
              sectionAuthorId: element?.sectionAuthor?.value?.[0]?.id,
              consultantsId: {
                results: element?.consultants?.value?.map((el: any) => el?.id),
              },
              // sectionType: element?.sectionType,
              sectionType: isReferenceSections
                ? "references section"
                : (element?.sectionType === "defaultSection" &&
                    !isReferenceSections) ||
                  (element?.sectionType === "normalSection" &&
                    !isReferenceSections)
                ? "default section"
                : element?.sectionType === "appendixSection" &&
                  !isReferenceSections
                ? "appendix section"
                : "default section" || element?.sectionType,
              documentOfId: docDetails?.documentDetailsId,
              isActive: element?.sectionSelected && !element?.removed,
              ID: element?.ID,
              status: "content in progress",
            };

            payloadJSON.push({
              ...sectionPayload,
              status: "content in progress",
              sectionSubmitted: false,
              lastReviewedBy: "",
              lastApprovedBy: "",
            });

            SATasks.push({
              taskAssignee: element?.sectionAuthor?.value?.[0]?.id,
              role: "Section Author",
              status: "content in progress",
              sectionName: element?.sectionName?.value,
            });

            element?.consultants?.value?.forEach((el: any) => {
              CONSULTANTSTasks.push({
                taskAssignee: el?.id,
                role: "Consultant",
                status: "content in progress",
                sectionName: element?.sectionName?.value,
              });
            });

            if (
              !element?.templateSectionID &&
              !element?.ID &&
              emptyCheck(element?.sectionName?.value) &&
              element?.sectionSelected &&
              !element?.removed
            ) {
              sectionsToAdd.push(sectionPayload);
            }
          }
        }
      );
      if (!addNewSectionFromUpdate) {
        setLoaderState({
          isLoading: { inprogress: true, success: false, error: false },
          visibility: true,
          text: "Section configuration in progress, please wait...",
          secondaryText: "",
        });
      }
      const docDetailsRes = await SpServices.SPReadItems({
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

      const docDetail = docDetailsRes?.find(
        (el: any) => el?.status?.toLowerCase() === "not started"
      );
      const updateDocDetails = docDetail ? { status: "In Development" } : null;

      if (updateDocDetails !== null) {
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.DocumentDetails,
          ID: docDetailsRes[0]?.ID,
          RequestJSON: updateDocDetails,
        });
      }

      await Promise.all(
        SATasks.map((taskItem: any) =>
          AddTask(
            docDetails?.documentDetailsId,
            taskItem,
            updateDocDetails?.status
          )
        )
      );

      if (!addNewSectionFromUpdate) {
        await Promise.all(
          CONSULTANTSTasks.map((taskItem: any) =>
            AddTask(
              docDetails?.documentDetailsId,
              taskItem,
              updateDocDetails?.status
            )
          )
        );
      }

      await Promise.all(
        payloadJSON.map(async (section: any) => {
          if (section?.ID) {
            await SpServices.SPUpdateItem({
              Listname: LISTNAMES.SectionDetails,
              ID: section?.ID,
              RequestJSON: section,
            });
          }
        })
      );

      await SpServices.SPReadItems({
        Listname: LISTNAMES.SectionDetails,
        Select: "*",
        Filter: [
          {
            FilterKey: "documentOf",
            Operator: "eq",
            FilterValue: docDetails?.documentDetailsId,
          },
        ],
      }).then(async (res: any) => {
        console.log("res: ", res);
        const payload = res?.map((item: any) => {
          return {
            ID: item?.ID,
            status: "content in progress",
            sectionSubmitted: false,
            sectionRework: false,
            sectionApproved: false,
            sectionReviewed: false,
          };
        });
        res?.map(async (item: any) => {
          if (
            item?.sectionType?.toLowerCase() !== "header section" &&
            item.sectionType?.toLowerCase() !== "change record"
          ) {
            const taskItems = await SpServices.SPReadItems({
              Listname: LISTNAMES.MyTasks,
              Select: "*,documentDetails/ID",
              Expand: "documentDetails",
              Filter: [
                {
                  FilterValue: item?.Title,
                  FilterKey: "sectionName",
                  Operator: "eq",
                },
                {
                  FilterValue: docDetails?.documentDetailsId,
                  FilterKey: "documentDetails",
                  Operator: "eq",
                },
              ],
            });

            await Promise.all(
              taskItems.map(async (item: any) =>
                SpServices.SPUpdateItem({
                  Listname: LISTNAMES.MyTasks,
                  ID: item?.ID,
                  RequestJSON: { sectionDetailsId: item?.ID },
                })
              )
            );
          }
        });
        await SpServices.batchUpdate({
          ListName: LISTNAMES.SectionDetails,
          responseData: payload,
        });
      });

      if (sectionsToAdd?.length > 0) {
        try {
          await Promise.all(
            sectionsToAdd.map(async (payload: any) => {
              const mainRes = await SpServices.SPAddItem({
                Listname: LISTNAMES.SectionDetails,
                RequestJSON: payload,
              });

              if (mainRes?.data?.Title?.toLowerCase() !== "header") {
                const taskItems = await SpServices.SPReadItems({
                  Listname: LISTNAMES.MyTasks,
                  Select: "*,documentDetails/ID",
                  Expand: "documentDetails",
                  Filter: [
                    {
                      FilterValue: mainRes?.data?.Title,
                      FilterKey: "sectionName",
                      Operator: "eq",
                    },
                    {
                      FilterValue: docDetails?.documentDetailsId,
                      FilterKey: "documentDetails",
                      Operator: "eq",
                    },
                  ],
                });

                await Promise.all(
                  taskItems.map(async (item: any) =>
                    SpServices.SPUpdateItem({
                      Listname: LISTNAMES.MyTasks,
                      ID: item?.ID,
                      RequestJSON: { sectionDetailsId: mainRes?.data?.ID },
                    })
                  )
                );
              }
            })
          );
        } catch (err) {
          console.error("Error configuring sections:", err);
          setLoaderState({
            isLoading: { inprogress: false, success: false, error: true },
            visibility: true,
            text: "Unable to configure the sections.",
            secondaryText:
              "An unexpected error occurred while configuring the sections, please try again later.",
          });
        }
      }

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
      if (!addNewSectionFromUpdate) {
        setLoaderState({
          isLoading: { inprogress: false, success: true, error: false },
          visibility: true,
          text: `Sections configured successfully!`,
          secondaryText: `The document "${docDetails?.docName}'s" sections have been configured successfully!`,
        });
      }
    } catch (err) {
      console.error("Error during section configuration:", err);
      setLoaderState({
        isLoading: { inprogress: false, success: false, error: true },
        visibility: true,
        text: "Unable to configure the sections.",
        secondaryText:
          "An unexpected error occurred while configuring the sections, please try again later.",
      });
    }
  } else {
    try {
      const payloadJSON: any[] = [];

      if (!noHeader) {
        payloadJSON.push({
          Title: "Header",
          templateTitle: "",
          sectionOrder: "0",
          sectionType: "header section",
          sectionAuthorId: docDetails?.taskAssignedBy?.ID,
          documentOfId: docDetails?.documentDetailsId,
          status: "content in progress",
          isActive: true,
        });
      }
      // formData?.defaultSections?.some(
      //   (item: any) =>
      //     trimStartEnd(item?.sectionName?.value?.toLowerCase()) ===
      //     "definitions"
      // )
      // const hasDefinitions = formData?.defaultSections?.filter(
      //   (item: any) =>
      //     trimStartEnd(item?.sectionName?.value?.toLowerCase()) ===
      //     "definitions"
      // );

      // if (hasDefinitions?.length !== 0 && hasDefinitions[0]?.sectionSelected) {
      //   payloadJSON.push({
      //     Title: "References",
      //     templateTitle: "",
      //     sectionOrder: String(
      //       formData?.defaultSections?.filter(
      //         (item: any) => item?.sectionSelected && !item?.removed
      //       )?.length + 1
      //     ),
      //     sectionType: "references section",
      //     sectionAuthorId: docDetails?.taskAssignedBy?.ID,
      //     documentOfId: docDetails?.documentDetailsId,
      //     status: "content in progress",
      //     isActive: true,
      //   });
      // }
      // If none of the conditions are met, payloadJSON will remain an empty array.

      const SATasks: any[] = [];
      const CONSULTANTSTasks: any[] = [];

      const defaultSectionsData: any[] = formData.defaultSections
        ?.filter((item: any) => {
          return item?.sectionSelected && !item?.removed && !item?.ID;
        })
        ?.sort((a: any, b: any) => {
          return parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo);
        })
        ?.map((item: any, index: number) => {
          return {
            ...item,
            sectionOrderNo: addNewSectionFromUpdate
              ? item?.sectionOrderNo
              : String(index + 1),
          };
        });

      const appendixSectionsData: any[] = formData.appendixSections
        ?.filter((item: any) => {
          return item?.sectionSelected && !item?.removed && !item?.ID;
        })
        ?.sort((a: any, b: any) => {
          return parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo);
        })
        ?.map((item: any, index: number) => {
          return {
            ...item,
            sectionOrderNo: addNewSectionFromUpdate
              ? item?.sectionOrderNo
              : String(index + 1),
          };
        });

      [...defaultSectionsData, ...appendixSectionsData]?.forEach(
        (element: any) => {
          const isReferenceSections =
            element?.sectionName?.value?.toLowerCase() === "references";

          if (
            emptyCheck(element?.sectionName?.value) &&
            element?.sectionSelected
          ) {
            payloadJSON.push({
              Title: element?.sectionName?.value,
              templateTitle: element?.templateSectionID ? templateTitle : "",
              sectionOrder: element.sectionOrderNo,
              sectionAuthorId: element?.sectionAuthor?.value?.[0]?.id,
              consultantsId: {
                results: element?.consultants?.value?.map((el: any) => el?.id),
              },
              sectionType: isReferenceSections
                ? "references section"
                : (element?.sectionType === "defaultSection" &&
                    !isReferenceSections) ||
                  (element?.sectionType === "normalSection" &&
                    !isReferenceSections)
                ? "default section"
                : element?.sectionType === "appendixSection" &&
                  !isReferenceSections
                ? "appendix section"
                : "default section" || element?.sectionType,
              documentOfId: docDetails?.documentDetailsId,
              status: "content in progress",
              isActive: element?.sectionSelected,
            });

            if (element?.sectionAuthor?.value?.[0]?.id) {
              SATasks.push({
                taskAssignee: element?.sectionAuthor?.value?.[0]?.id,
                role: "Section Author",
                status: "content in progress",
                sectionName: element?.sectionName?.value,
              });
            }

            element?.consultants?.value?.forEach((el: any) => {
              if (el?.id) {
                CONSULTANTSTasks.push({
                  taskAssignee: el?.id,
                  role: "Consultant",
                  status: "content in progress",
                  sectionName: element?.sectionName?.value,
                });
              }
            });
          }
        }
      );

      if (!addNewSectionFromUpdate) {
        setLoaderState({
          isLoading: { inprogress: true, success: false, error: false },
          visibility: true,
          text: "Section configuration in progress, please wait...",
          secondaryText: "",
        });
      }

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

      if (!addNewSectionFromUpdate) {
        const CONSULTANTSTasksResponses = CONSULTANTSTasks.map(
          async (taskItem: any) => {
            await AddTask(
              docDetails?.documentDetailsId,
              taskItem,
              updateDocDetails !== null ? updateDocDetails?.status : null
            );
          }
        );
        await Promise.all(CONSULTANTSTasksResponses);
      }

      await Promise.all(SATasksResponses);

      if (payloadJSON?.length > 0) {
        try {
          await Promise.all(
            payloadJSON?.map(async (payload: any) => {
              try {
                const mainRes: any = await SpServices.SPAddItem({
                  Listname: LISTNAMES.SectionDetails,
                  RequestJSON: payload,
                });

                if (mainRes?.data?.Title?.toLowerCase() !== "header") {
                  try {
                    const res = await SpServices.SPReadItems({
                      Listname: LISTNAMES.MyTasks,
                      Select: "*,documentDetails/ID",
                      Expand: "documentDetails",
                      Filter: [
                        {
                          FilterValue: mainRes?.data?.Title,
                          FilterKey: "sectionName",
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
                          console.error(
                            `Error updating item ${item?.ID}: `,
                            err
                          );
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
          if (!addNewSectionFromUpdate) {
            setLoaderState({
              isLoading: { inprogress: false, success: true, error: false },
              visibility: true,
              text: `Sections configured successfully!`,
              secondaryText: `The document "${docDetails?.docName}'s" sections have been configured successfully!`,
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
    const allPayload: any[] = [];
    console.log("sectionsToAdd: ", sectionsToAdd);

    const defaultSectionsData: any[] = formData.defaultSections
      ?.filter((item: any) => {
        return (
          item?.sectionSelected || (item?.ID !== null && !item?.sectionSelected)
        );
      })
      ?.sort((a: any, b: any) => {
        return parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo);
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
        return parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo);
      })
      ?.map((item: any, index: number) => {
        return { ...item, sectionOrderNo: String(index + 1) };
      });

    // Filter to get only valid default sections that are selected and not removed
    const validDefaultSections = formData?.defaultSections?.filter(
      (item: any) => item?.sectionSelected && !item?.removed
    );

    // Filter to get only valid appendix sections that are selected and not removed
    const validAppendixSections = formData?.appendixSections?.filter(
      (item: any) => item?.sectionSelected && !item?.removed
    );

    // Initialize counters to track the next available section order for each type
    let nextDefaultOrderNumber = validDefaultSections.length + 1;
    let nextAppendixOrderNumber = validAppendixSections.length + 1;

    // Combine default and appendix sections data
    [...defaultSectionsData, ...appendixSectionsData]?.forEach(
      (element: any) => {
        // Determine the sectionOrder based on the element's status and type
        let sectionOrder;

        if (element?.sectionSelected && !element?.removed) {
          // If element is selected and not removed, find its order within its respective valid section
          if (
            element?.sectionType === "defaultSection" ||
            element?.sectionType === "referencesSection" ||
            element?.sectionType === "normalSection"
          ) {
            sectionOrder = String(
              validDefaultSections?.findIndex(
                (el: any) =>
                  el?.sectionName?.value === element?.sectionName?.value
              ) + 1
            );
          } else {
            sectionOrder = String(
              validAppendixSections?.findIndex(
                (el: any) =>
                  el?.sectionName?.value === element?.sectionName?.value
              ) + 1
            );
          }
        } else {
          // Assign the next available order number based on the section type
          if (
            element?.sectionType === "defaultSection" ||
            element?.sectionType === "referencesSection" ||
            element?.sectionType === "normalSection"
          ) {
            sectionOrder = String(nextDefaultOrderNumber);
            nextDefaultOrderNumber += 1; // Increment for the next default section item
          } else {
            sectionOrder = String(nextAppendixOrderNumber);
            nextAppendixOrderNumber += 1; // Increment for the next appendix section item
          }
        }
        const isReferenceSections =
          element?.sectionName?.value?.toLowerCase() === "references";
        // Create section payload with the determined order and other properties
        const sectionPayload = {
          Title: element?.sectionName?.value,
          templateTitle: formData?.templateDetails?.templateName,
          sectionOrder: sectionOrder,
          sectionAuthorId: element?.sectionAuthor?.value?.[0]?.id,
          consultantsId: {
            results: element?.consultants?.value?.map((el: any) => el?.id),
          },
          sectionType: isReferenceSections
            ? "references section"
            : (element?.sectionType === "defaultSection" &&
                !isReferenceSections) ||
              (element?.sectionType === "normalSection" && !isReferenceSections)
            ? "default section"
            : element?.sectionType === "appendixSection" && !isReferenceSections
            ? "appendix section"
            : "default section",
          documentOfId: docDetails?.documentDetailsId,
          isActive: element?.sectionSelected,
          isDeleted: element?.removed,
          ID: element?.ID,
        };

        // Add the section payload to the respective arrays
        allPayload.push(sectionPayload);
        if (element?.templateSectionID || element?.ID) {
          sectionsToUpdate.push(sectionPayload);
        } else {
          sectionsToAdd.push(sectionPayload);
        }
      }
    );

    setLoaderState({
      isLoading: { inprogress: true, success: false, error: false },
      visibility: true,
      text: "Updating sections, please wait...",
      secondaryText: "",
    });

    if (sectionsToUpdate.length === 0 && sectionsToAdd.length === 0) {
      setLoaderState({
        isLoading: { inprogress: false, success: false, error: true },
        visibility: true,
        text: "No sections to update or add.",
        secondaryText:
          "No sections are selected for update or add. Please select at least one section.",
      });
      return;
    }

    if (sectionsToAdd.length > 0) {
      await AddSections(formData, setLoaderState, docDetails, true, true);
    }

    const updateSectionsPromise = allPayload.map(async (section: any) => {
      const uniqueTaskByResponse = await SpServices.SPReadItems({
        Listname: LISTNAMES.MyTasks,
        Select: "*,documentDetails/ID,sectionDetails/ID",
        Expand: "documentDetails,sectionDetails",
        Filter: [
          {
            FilterKey: "sectionName",
            FilterValue: section?.Title,
            Operator: "eq",
          },
          {
            FilterKey: "documentDetails",
            FilterValue: section?.documentOfId,
            Operator: "eq",
          },
        ],
      });
      const AllTaskOfDoc = await SpServices.SPReadItems({
        Listname: LISTNAMES.MyTasks,
        Select: "*,documentDetails/ID,sectionDetails/ID",
        Expand: "documentDetails,sectionDetails",
        Filter: [
          {
            FilterKey: "documentDetails",
            FilterValue: section?.documentOfId,
            Operator: "eq",
          },
        ],
      });

      let currentSectionDetails: any;
      if (section?.ID && !section?.isDeleted) {
        currentSectionDetails = await SpServices.SPReadItemUsingId({
          Listname: LISTNAMES.SectionDetails,
          SelectedId: section?.ID,
          Select: "*,documentOf/ID",
          Expand: "documentOf",
        });
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.SectionDetails,
          ID: section?.ID,
          RequestJSON: section,
        });
      }

      if (section?.isActive && !section?.isDeleted) {
        const hasSectionAuthor = uniqueTaskByResponse?.some(
          (item: any) =>
            item?.role?.toLowerCase() === "section author" &&
            item?.sectionName === section?.Title
        );
        const completedDate = AllTaskOfDoc?.filter(
          (item: any) => item?.completed
        )[0]?.completedOn;

        if (!hasSectionAuthor) {
          await SpServices.SPAddItem({
            Listname: LISTNAMES.MyTasks,
            RequestJSON: {
              Title: docDetails?.docName,
              taskAssigneeId: section?.sectionAuthorId,
              role: "Section Author",
              taskStatus: "content in progress",
              docVersion: docDetails?.docVersion,
              docCreatedDate: docDetails?.docCreatedDate,
              taskDueDate: calculateDueDateByRole(
                docDetails?.docCreatedDate,
                "content developer"
              ),
              sectionDetailsId: section?.ID,
              pathName: docDetails?.pathName,
              documentDetailsId: docDetails?.documentDetailsId,
              sectionName: section?.Title,
              completed: currentSectionDetails?.sectionSubmitted || false,
              completedOn: currentSectionDetails?.sectionSubmitted
                ? completedDate
                : "",
              docStatus: docDetails?.docStatus,
              taskAssignedById: docDetails?.taskAssignee?.ID,
            },
          });
        }
        await Promise.all(
          uniqueTaskByResponse.map(async (item: any) => {
            if (
              section?.sectionAuthorId &&
              item?.role?.toLowerCase() === "section author"
            ) {
              await SpServices.SPUpdateItem({
                Listname: LISTNAMES.MyTasks,
                ID: item?.ID,
                RequestJSON: {
                  sectionName: section?.Title,
                  taskAssigneeId: section?.sectionAuthorId,
                },
              });
            }
            if (
              section?.consultantsId?.results?.length > 0 &&
              item?.role?.toLowerCase() === "consultant"
            ) {
              await SpServices.SPDeleteItem({
                Listname: LISTNAMES.MyTasks,
                ID: item?.ID,
              });
            }
          })
        );

        const sectionCreatedDate = calculateDueDateByRole(
          dayjs(currentSectionDetails?.Created).format("DD/MM/YYYY"),
          "consultant"
        );

        const newConsultantTasks = section?.consultantsId?.results?.map(
          (el: any) => ({
            taskAssignee: el,
            role: "Consultant",
            status: "content in progress",
            sectionName: section?.Title,
          })
        );

        await Promise.all(
          newConsultantTasks.map(async (taskItem: any) => {
            if (section?.ID) {
              await SpServices.SPAddItem({
                Listname: LISTNAMES.MyTasks,
                RequestJSON: {
                  Title: docDetails?.docName,
                  taskAssigneeId: taskItem.taskAssignee,
                  role: taskItem.role,
                  taskStatus: taskItem.taskStatus || "content in progress",
                  docVersion: docDetails?.docVersion,
                  docCreatedDate: docDetails?.docCreatedDate,
                  taskDueDate: sectionCreatedDate,
                  sectionDetailsId: section?.ID,
                  pathName: docDetails?.pathName,
                  documentDetailsId: docDetails?.documentDetailsId,
                  sectionName: taskItem.sectionName,
                  docStatus: taskItem.docStatus,
                  completed: currentSectionDetails?.sectionSubmitted || false,
                  completedOn: currentSectionDetails?.sectionSubmitted
                    ? completedDate
                    : "",
                  taskAssignedById: docDetails?.taskAssignee?.ID,
                },
              });
            } else {
              const mainRes: any = await SpServices.SPReadItems({
                Listname: LISTNAMES.SectionDetails,
                Select: "*,documentOf/ID",
                Expand: "documentOf",
                Filter: [
                  {
                    FilterKey: "Title",
                    FilterValue: taskItem?.sectionName,
                    Operator: "eq",
                  },
                  {
                    FilterKey: "documentOf",
                    FilterValue: docDetails?.documentDetailsId,
                    Operator: "eq",
                  },
                ],
              });
              await SpServices.SPAddItem({
                Listname: LISTNAMES.MyTasks,
                RequestJSON: {
                  Title: docDetails?.docName,
                  taskAssigneeId: taskItem.taskAssignee,
                  role: taskItem.role,
                  taskStatus: taskItem.taskStatus || "content in progress",
                  docVersion: docDetails?.docVersion,
                  docCreatedDate: docDetails?.docCreatedDate,
                  taskDueDate: sectionCreatedDate,
                  pathName: docDetails?.pathName,
                  sectionDetailsId: mainRes[0]?.ID,
                  documentDetailsId: docDetails?.documentDetailsId,
                  sectionName: taskItem.sectionName,
                  docStatus: taskItem.docStatus,
                  completed: currentSectionDetails?.sectionSubmitted || false,
                  completedOn: currentSectionDetails?.sectionSubmitted
                    ? completedDate
                    : "",
                  taskAssignedById: docDetails?.taskAssignee?.ID,
                },
              });
            }
          })
        );
      } else {
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.SectionDetails,
          ID: section?.ID,
          RequestJSON: {
            isActive: section?.isActive,
          },
        });

        uniqueTaskByResponse.map(async (item: any) => {
          await SpServices.SPDeleteItem({
            Listname: LISTNAMES.MyTasks,
            ID: item?.ID,
          });
        });
      }

      if (section?.isDeleted) {
        await SpServices.SPDeleteItem({
          Listname: LISTNAMES.SectionDetails,
          ID: section?.ID,
        });

        uniqueTaskByResponse.forEach(async (item: any) => {
          await SpServices.SPDeleteItem({
            Listname: LISTNAMES.MyTasks,
            ID: item?.ID,
          });
        });
      }
    });

    await Promise.all([...updateSectionsPromise])
      .then(() => {
        setLoaderState({
          isLoading: { inprogress: false, success: true, error: false },
          visibility: true,
          text: "Sections updated successfully!",
          secondaryText: `The document "${docDetails?.docName}'s" sections have been updated successfully!`,
        });
      })
      .catch((err) => {
        console.error("Error updating sections:", err);
        if (
          err?.message?.value !==
          "Item does not exist. It may have been deleted by another user."
        ) {
          setLoaderState({
            isLoading: { inprogress: false, success: false, error: true },
            visibility: true,
            text: "Unable to process the sections.",
            secondaryText:
              "An unexpected error occurred while processing the sections, please try again later.",
          });
        }
      });
  } catch (err) {
    console.log("err: ", err);
    if (
      err?.message?.value !==
      "Item does not exist. It may have been deleted by another user."
    ) {
      setLoaderState({
        isLoading: { inprogress: false, success: false, error: true },
        visibility: true,
        text: "Unable to process the sections.",
        secondaryText:
          "An unexpected error occurred while processing the sections, please try again later.",
      });
    }
  }
};

// Main function to load all sections data
export const LoadSectionsTemplateData = async (
  templateID: number,
  setSectionsData: any,
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
        // sectionOrderNo: String(index + 1),
        sectionOrderNo: e?.sequenceNo,
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
      } else if (e?.sectionType?.toLowerCase() === "references section") {
        normalSection.push({
          ...sectionData,
          sectionType: "referencesSection",
        });
      } else if (
        e?.sectionType?.toLowerCase() === "appendix" ||
        e?.sectionType?.toLowerCase() === "appendix section"
      ) {
        appendixSection.push({
          ...sectionData,
          sectionType: "appendixSection",
        });
      }
    });

    // Order default sections based on predefined order
    // const orderedDefaultSection = defaultSection.sort(
    //   (a, b) =>
    //     defaultTemplates.indexOf(a.value) - defaultTemplates.indexOf(b.value)
    // );
    const orderedDefaultSection = defaultSection?.sort(
      (a: any, b: any) => Number(a?.sectionOrderNo) - Number(b?.sectionOrderNo)
    );

    // const orderedNormalSection = normalSection.sort((a, b) => a.id - b.id);
    const orderedNormalSection = normalSection?.sort(
      (a: any, b: any) => Number(a?.sectionOrderNo) - Number(b?.sectionOrderNo)
    );

    const orderedAppendixSection = appendixSection.sort(
      (a, b) => a.sectionOrderNo - b.sectionOrderNo
    );

    const currentTemplateDetails: any = {
      templateDetails: {
        templateID: filteredData[0]?.mainTemplate?.Id,
        templateName: filteredData[0]?.mainTemplate?.Title,
      },
      templateSectionID: "",
      defaultSections: [...orderedDefaultSection, ...orderedNormalSection]?.map(
        (item: any, index: number) => {
          return {
            ...item,
            sectionOrderNo: String(index + 1),
          };
        }
      ),
      appendixSections: [...orderedAppendixSection]?.map(
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
        // {
        //   FilterKey: "isActive",
        //   Operator: "eq",
        //   FilterValue: "1",
        // },
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
        templateSectionID: e?.templateTitle || null,
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
      } else if (e?.sectionType?.toLowerCase() === "references section") {
        normalSection.push({
          ...sectionData,
          sectionType: "referencesSection",
        });
      } else if (
        e?.sectionType?.toLowerCase() === "appendix" ||
        e?.sectionType?.toLowerCase() === "appendix section"
      ) {
        appendixSection.push({
          ...sectionData,
          sectionType: "appendixSection",
        });
      }
      // else if (e?.sectionType?.toLowerCase() === "change record") {
      //   appendixSection.push({
      //     ...sectionData,
      //     sectionType: "change record",
      //   });
      // }
    });

    // Order sections
    // const orderedDefaultSection = defaultSection.sort(
    //   (a, b) => parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo)
    // );

    const orderedNormalSection = [...defaultSection, ...normalSection].sort(
      (a, b) => parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo)
    );

    const orderedAppendixSection = appendixSection.sort(
      (a, b) => parseInt(a.sectionOrderNo) - parseInt(b.sectionOrderNo)
    );

    const currentTemplateDetails: any = {
      defaultSections: [...orderedNormalSection]?.map(
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
