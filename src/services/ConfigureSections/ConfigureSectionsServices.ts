/* eslint-disable no-dupe-else-if */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import { LISTNAMES } from "../../config/config";
import { defaultTemplates } from "../../constants/DefaultTemplates";
import { setSDDTemplateDetails } from "../../redux/features/SDDTemplatesSlice";
import { calculateDueDateByRole, emptyCheck } from "../../utils/validations";
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
  const isPATaskisNotConfigured: boolean =
    docDetails?.role?.toLowerCase() === "primary author" &&
    docDetails?.taskStatus?.toLowerCase() === "not started";

  const templateTitle = formData?.templateDetails?.templateName;
  try {
    // const sectionKeys = ["defaultSections", "appendixSections"];
    const payloadJSON: any[] = noHeader
      ? []
      : [
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
        return item?.sectionSelected && !item?.removed && !item?.ID;
      })
      ?.sort((a: any, b: any) => {
        return a?.sectionOrderNo - b?.sectionOrderNo;
      })
      ?.map((item: any, index: number) => {
        return { ...item, sectionOrderNo: String(index + 1) };
      });

    const appendixSectionsData: any[] = formData.appendixSections
      ?.filter((item: any) => {
        return item?.sectionSelected && !item?.removed && !item?.ID;
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

// export const updateSections = async (
//   formData: any,
//   setLoaderState: any,
//   docDetails: any
// ): Promise<any> => {
//   debugger;
//   try {
//     const sectionsToUpdate: any[] = [];
//     console.log("sectionsToUpdate: ", sectionsToUpdate);
//     const sectionsToAdd: any[] = [];
//     const allPayload: any[] = [];

//     const defaultSectionsData: any[] = formData.defaultSections
//       ?.filter((item: any) => {
//         return (
//           item?.sectionSelected || (item?.ID !== null && !item?.sectionSelected)
//         );
//       })
//       ?.sort((a: any, b: any) => {
//         return a?.sectionOrderNo - b?.sectionOrderNo;
//       })
//       ?.map((item: any, index: number) => {
//         return { ...item, sectionOrderNo: String(index + 1) };
//       });

//     const appendixSectionsData: any[] = formData.appendixSections
//       ?.filter((item: any) => {
//         return (
//           item?.sectionSelected || (item?.ID !== null && !item?.sectionSelected)
//         );
//       })
//       ?.sort((a: any, b: any) => {
//         return a?.sectionOrderNo - b?.sectionOrderNo;
//       })
//       ?.map((item: any, index: number) => {
//         return { ...item, sectionOrderNo: String(index + 1) };
//       });
//     console.log("allPayload: ", allPayload);
//     [...defaultSectionsData, ...appendixSectionsData]?.forEach(
//       (element: any) => {
//         const sectionPayload = {
//           Title: element?.sectionName?.value,
//           templateTitle: formData?.templateDetails?.templateName,
//           sectionOrder: element.sectionOrderNo,
//           sectionAuthorId: element?.sectionAuthor?.value?.[0]?.id,
//           consultantsId: {
//             results: element?.consultants?.value?.map((el: any) => el?.id),
//           },
//           sectionType:
//             element?.sectionType === "defaultSection" ||
//             element?.sectionType === "normalSections"
//               ? "default section"
//               : "appendix section",
//           documentOfId: docDetails?.documentDetailsId,
//           status: "content in progress",
//           isActive: element?.sectionSelected && !element?.removed,
//           ID: element?.ID,
//         };

//         // if (element?.ID || element?.templateSectionID) {
//         //   // If section has an ID or templateSectionID, add to update list
//         //   sectionsToUpdate.push({
//         //     ...sectionPayload,
//         //     ID: element?.ID,
//         //   });
//         // } else if (!element?.removed) {
//         //   // If section does not have an ID and is not marked as removed, add to add list
//         //   sectionsToAdd.push(sectionPayload);
//         // }

//         allPayload.push(sectionPayload);
//         if (element?.templateSectionID || element?.ID) {
//           sectionsToUpdate.push(sectionPayload);
//         } else {
//           sectionsToAdd.push(element);
//         }
//       }
//     );

//     // Handle update sections
//     // if (allPayload?.length > 0) {
//     setLoaderState({
//       isLoading: { inprogress: true, success: false, error: false },
//       visibility: true,
//       text: "Updating sections, please wait...",
//       secondaryText: "",
//     });

//     try {
//       if (sectionsToUpdate.length === 0 && sectionsToAdd.length === 0) {
//         setLoaderState({
//           isLoading: { inprogress: false, success: false, error: true },
//           visibility: true,
//           text: "No sections to update or add.",
//           secondaryText:
//             "No sections are selected for update or add. Please select at least one section.",
//         });
//       }

//       // Handle add sections
//       if (sectionsToAdd.length > 0) {
//         setLoaderState({
//           isLoading: { inprogress: true, success: false, error: false },
//           visibility: true,
//           text: "Section configuration in progress, please wait...",
//           secondaryText: "",
//         });

//         try {
//           // await Promise.all(
//           //   sectionsToAdd.map(async (payload: any) => {
//           //     await SpServices.SPAddItem({
//           //       Listname: LISTNAMES.SectionDetails,
//           //       RequestJSON: payload,
//           //     });
//           //   })
//           // );

//           await Promise.all([
//             await AddSections(formData, setLoaderState, docDetails, true, true),
//           ]);

//           // setLoaderState({
//           //   isLoading: { inprogress: false, success: true, error: false },
//           //   visibility: true,
//           //   text: "Sections Up successfully!",
//           //   secondaryText: `The document "${docDetails?.docName}'s" sections have been added successfully!`,
//           // });
//         } catch (err) {
//           setLoaderState({
//             isLoading: { inprogress: false, success: false, error: true },
//             visibility: true,
//             text: "Unable to add the sections.",
//             secondaryText:
//               "An unexpected error occurred while adding the sections, please try again later.",
//           });
//         }
//       }
//       console.log(
//         "allPayload",
//         allPayload?.filter((item?: any) => {
//           return !item?.isActive;
//         })
//       );
//       await Promise.all([
//         allPayload?.map(async (section: any) => {
//           console.log("section: ", section);
//           console.log("consultantsId: ", section?.consultantsId?.results);

//           const uniqueTaskByResponse = await SpServices.SPReadItems({
//             Listname: LISTNAMES.MyTasks,
//             Select: "*,documentDetails/ID,sectionDetails/ID",
//             Expand: "documentDetails,sectionDetails",
//             Filter: [
//               {
//                 FilterKey: "sectionDetails",
//                 FilterValue: section?.ID,
//                 Operator: "eq",
//               },
//             ],
//           });

//           console.log("uniqueTaskByResponse: ", uniqueTaskByResponse);
//           console.log("section?.ID: ", section?.ID);

//           let currentSectionDetails: any;

//           if (section?.ID) {
//             currentSectionDetails = await SpServices.SPReadItemUsingId({
//               Listname: LISTNAMES.SectionDetails,
//               SelectedId: section?.ID,
//               Select: "*,documentOf/ID",
//               Expand: "documentOf",
//             });
//             console.log("currentSectionDetails: ", currentSectionDetails);

//             // Update the section
//             await SpServices.SPUpdateItem({
//               Listname: LISTNAMES.SectionDetails,
//               ID: section?.ID,
//               RequestJSON: section,
//             });
//           }

//           if (section?.isActive) {
//             // Handle tasks associated with the section
//             await Promise.all(
//               uniqueTaskByResponse.map(async (item: any) => {
//                 console.log("item: ", item);
//                 // if (item?.role?.toLowerCase() === "section author") {
//                 if (
//                   section?.sectionAuthorId &&
//                   item?.role?.toLowerCase() === "section author"
//                 ) {
//                   await SpServices.SPUpdateItem({
//                     Listname: LISTNAMES.MyTasks,
//                     ID: item?.ID,
//                     RequestJSON: {
//                       sectionName: section?.Title,
//                       taskAssigneeId: section?.sectionAuthorId,
//                     },
//                   });
//                   // } else if (item?.role?.toLowerCase() === "consultant") {
//                 }
//                 if (
//                   section?.consultantsId?.results?.length > 0 &&
//                   item?.role?.toLowerCase() === "consultant"
//                 ) {
//                   console.log(
//                     "Deleting existing consultant task with ID: ",
//                     item?.ID
//                   );

//                   if (item?.role?.toLowerCase() === "consultant") {
//                     await SpServices.SPDeleteItem({
//                       Listname: LISTNAMES.MyTasks,
//                       ID: item?.ID,
//                     });
//                   }
//                 }
//               })
//             );

//             const sectionCreatedDate = calculateDueDateByRole(
//               dayjs(currentSectionDetails?.Created).format("DD/MM/YYYY"),
//               "consultant"
//             );

//             const newConsultantTasks = section?.consultantsId?.results?.map(
//               (el: any) => {
//                 return {
//                   taskAssignee: el,
//                   role: "Consultant",
//                   status: "content in progress",
//                   sectionName: section?.Title,
//                 };
//               }
//             );

//             console.log("newConsultantTasks: ", newConsultantTasks);

//             // Add new tasks for consultants
//             await Promise.all(
//               newConsultantTasks.map(async (taskItem: any) => {
//                 if (section?.ID) {
//                   await Promise.all([
//                     await AddTask(
//                       docDetails?.documentDetailsId,
//                       taskItem,
//                       null,
//                       sectionCreatedDate,
//                       section?.ID
//                     ),
//                   ]);
//                 } else {
//                   const mainRes: any = await SpServices.SPReadItems({
//                     Listname: LISTNAMES.SectionDetails,
//                     Select: "*,documentOf/ID",
//                     Expand: "documentOf",
//                     Filter: [
//                       {
//                         FilterKey: "Title",
//                         FilterValue: taskItem?.sectionName,
//                         Operator: "eq",
//                       },
//                       {
//                         FilterKey: "documentOf",
//                         FilterValue: docDetails?.documentDetailsId,
//                         Operator: "eq",
//                       },
//                     ],
//                   });
//                   console.log("mainRes: ", mainRes);
//                   await Promise.all([
//                     await AddTask(
//                       docDetails?.documentDetailsId,
//                       taskItem,
//                       null,
//                       sectionCreatedDate,
//                       mainRes[0]?.ID
//                     ),
//                   ]);
//                 }
//                 console.log("section?.ID: ", section?.ID);
//               })
//             );
//           }
//           // else {
//           //   // If section is not active, delete the section and related tasks
//           //   await SpServices.SPDeleteItem({
//           //     Listname: LISTNAMES.SectionDetails,
//           //     ID: section?.ID,
//           //   });

//           //   // Delete associated tasks
//           //   await Promise.all(
//           //     uniqueTaskByResponse.map(async (item: any) => {
//           //       console.log("Deleting task with ID: ", item?.ID);
//           //       await SpServices.SPDeleteItem({
//           //         Listname: LISTNAMES.MyTasks,
//           //         ID: item?.ID,
//           //       });
//           //     })
//           //   );
//           // }
//         }),
//         allPayload
//           ?.filter((item?: any) => {
//             return !item?.isActive;
//           })
//           ?.forEach(async (section: any) => {
//             const uniqueTaskByResponse = await SpServices.SPReadItems({
//               Listname: LISTNAMES.MyTasks,
//               Select: "*,documentDetails/ID,sectionDetails/ID",
//               Expand: "documentDetails,sectionDetails",
//               Filter: [
//                 {
//                   FilterKey: "sectionDetails",
//                   FilterValue: section?.ID,
//                   Operator: "eq",
//                 },
//               ],
//             });

//             // If section is not active, delete the section and related tasks
//             await Promise.all(
//               await SpServices.SPDeleteItem({
//                 Listname: LISTNAMES.SectionDetails,
//                 ID: section?.ID,
//               })
//             );

//             // Delete associated tasks
//             await Promise.all(
//               uniqueTaskByResponse.map(async (item: any) => {
//                 console.log("Deleting task with ID: ", item?.ID);
//                 await SpServices.SPDeleteItem({
//                   Listname: LISTNAMES.MyTasks,
//                   ID: item?.ID,
//                 });
//               })
//             );
//           }),
//       ])
//         .then(async () => {
//           setLoaderState({
//             isLoading: { inprogress: false, success: true, error: false },
//             visibility: true,
//             text: "Sections updated successfully!",
//             secondaryText: `The document "${docDetails?.docName}'s" sections have been updated successfully!`,
//           });
//         })
//         .catch((err) => {
//           console.log("err: ", err);
//           setLoaderState({
//             isLoading: { inprogress: false, success: false, error: true },
//             visibility: true,
//             text: "Unable to update the sections.",
//             secondaryText:
//               "An unexpected error occurred while updating the sections, please try again later.",
//           });
//         });
//     } catch (err) {
//       setLoaderState({
//         isLoading: { inprogress: false, success: false, error: true },
//         visibility: true,
//         text: "Unable to update the sections.",
//         secondaryText:
//           "An unexpected error occurred while updating the sections, please try again later.",
//       });
//     }
//     // }
//   } catch (err) {
//     setLoaderState({
//       isLoading: { inprogress: false, success: false, error: true },
//       visibility: true,
//       text: "Unable to process the sections.",
//       secondaryText:
//         "An unexpected error occurred while processing the sections, please try again later.",
//     });
//   }
// };

// export const updateSections = async (
//   formData: any,
//   setLoaderState: any,
//   docDetails: any
// ): Promise<any> => {
//   console.log("docDetails: ", docDetails);
//   try {
//     const sectionsToUpdate: any[] = [];
//     const sectionsToAdd: any[] = [];
//     const allPayload: any[] = [];

//     const defaultSectionsData: any[] = formData.defaultSections
//       ?.filter((item: any) => {
//         return (
//           item?.sectionSelected || (item?.ID !== null && !item?.sectionSelected)
//         );
//       })
//       ?.sort((a: any, b: any) => {
//         return a?.sectionOrderNo - b?.sectionOrderNo;
//       })
//       ?.map((item: any, index: number) => {
//         return { ...item, sectionOrderNo: String(index + 1) };
//       });

//     const appendixSectionsData: any[] = formData.appendixSections
//       ?.filter((item: any) => {
//         return (
//           item?.sectionSelected || (item?.ID !== null && !item?.sectionSelected)
//         );
//       })
//       ?.sort((a: any, b: any) => {
//         return a?.sectionOrderNo - b?.sectionOrderNo;
//       })
//       ?.map((item: any, index: number) => {
//         return { ...item, sectionOrderNo: String(index + 1) };
//       });

//     [...defaultSectionsData, ...appendixSectionsData]?.forEach(
//       (element: any) => {
//         const sectionPayload = {
//           Title: element?.sectionName?.value,
//           templateTitle: formData?.templateDetails?.templateName,
//           sectionOrder: element.sectionOrderNo,
//           sectionAuthorId: element?.sectionAuthor?.value?.[0]?.id,
//           consultantsId: {
//             results: element?.consultants?.value?.map((el: any) => el?.id),
//           },
//           sectionType:
//             element?.sectionType === "defaultSection" ||
//             element?.sectionType === "normalSections"
//               ? "default section"
//               : "appendix section",
//           documentOfId: docDetails?.documentDetailsId,
//           status: "content in progress",
//           isActive: element?.sectionSelected && !element?.removed,
//           ID: element?.ID,
//         };

//         allPayload.push(sectionPayload);
//         if (element?.templateSectionID || element?.ID) {
//           sectionsToUpdate.push(sectionPayload);
//         } else {
//           sectionsToAdd.push(element);
//         }
//       }
//     );

//     setLoaderState({
//       isLoading: { inprogress: true, success: false, error: false },
//       visibility: true,
//       text: "Updating sections, please wait...",
//       secondaryText: "",
//     });

//     if (sectionsToUpdate.length === 0 && sectionsToAdd.length === 0) {
//       setLoaderState({
//         isLoading: { inprogress: false, success: false, error: true },
//         visibility: true,
//         text: "No sections to update or add.",
//         secondaryText:
//           "No sections are selected for update or add. Please select at least one section.",
//       });
//       return;
//     }

//     if (sectionsToAdd.length > 0) {
//       await AddSections(formData, setLoaderState, docDetails, true, true);
//     }

//     const updateSectionsPromise = allPayload.map(async (section: any) => {
//       const uniqueTaskByResponse = await SpServices.SPReadItems({
//         Listname: LISTNAMES.MyTasks,
//         Select: "*,documentDetails/ID,sectionDetails/ID",
//         Expand: "documentDetails,sectionDetails",
//         Filter: [
//           {
//             FilterKey: "sectionDetails",
//             FilterValue: section?.ID,
//             Operator: "eq",
//           },
//         ],
//       });

//       let currentSectionDetails: any;
//       if (section?.ID) {
//         currentSectionDetails = await SpServices.SPReadItemUsingId({
//           Listname: LISTNAMES.SectionDetails,
//           SelectedId: section?.ID,
//           Select: "*,documentOf/ID",
//           Expand: "documentOf",
//         });

//         await SpServices.SPUpdateItem({
//           Listname: LISTNAMES.SectionDetails,
//           ID: section?.ID,
//           RequestJSON: section,
//         });
//       }

//       if (section?.isActive) {
//         await Promise.all(
//           uniqueTaskByResponse.map(async (item: any) => {
//             if (
//               section?.sectionAuthorId &&
//               item?.role?.toLowerCase() === "section author"
//             ) {
//               await SpServices.SPUpdateItem({
//                 Listname: LISTNAMES.MyTasks,
//                 ID: item?.ID,
//                 RequestJSON: {
//                   sectionName: section?.Title,
//                   taskAssigneeId: section?.sectionAuthorId,
//                 },
//               });
//             }
//             if (
//               section?.consultantsId?.results?.length > 0 &&
//               item?.role?.toLowerCase() === "consultant"
//             ) {
//               await SpServices.SPDeleteItem({
//                 Listname: LISTNAMES.MyTasks,
//                 ID: item?.ID,
//               });
//             }
//           })
//         );

//         const sectionCreatedDate = calculateDueDateByRole(
//           dayjs(currentSectionDetails?.Created).format("DD/MM/YYYY"),
//           "consultant"
//         );

//         const newConsultantTasks = section?.consultantsId?.results?.map(
//           (el: any) => ({
//             taskAssignee: el,
//             role: "Consultant",
//             status: "content in progress",
//             sectionName: section?.Title,
//           })
//         );

//         await Promise.all(
//           newConsultantTasks.map(async (taskItem: any) => {
//             if (section?.ID) {
//               await SpServices.SPAddItem({
//                 Listname: LISTNAMES.MyTasks,
//                 RequestJSON: {
//                   Title: docDetails?.docName,
//                   taskAssigneeId: taskItem.taskAssignee,
//                   role: taskItem.role,
//                   taskStatus: taskItem.taskStatus,
//                   docVersion: docDetails?.docVersion,
//                   docCreatedDate: docDetails?.docCreatedDate,
//                   taskDueDate: sectionCreatedDate,
//                   sectionDetailsId: section?.ID,
//                   pathName: docDetails?.pathName,
//                   documentDetailsId: docDetails?.documentDetailsId,
//                   sectionName: taskItem.sectionName,
//                   docStatus: taskItem.docStatus,
//                   taskAssignedById: docDetails?.taskAssignee?.ID,
//                 },
//               });
//             } else {
//               const mainRes: any = await SpServices.SPReadItems({
//                 Listname: LISTNAMES.SectionDetails,
//                 Select: "*,documentOf/ID",
//                 Expand: "documentOf",
//                 Filter: [
//                   {
//                     FilterKey: "Title",
//                     FilterValue: taskItem?.sectionName,
//                     Operator: "eq",
//                   },
//                   {
//                     FilterKey: "documentOf",
//                     FilterValue: docDetails?.documentDetailsId,
//                     Operator: "eq",
//                   },
//                 ],
//               });
//               await SpServices.SPAddItem({
//                 Listname: LISTNAMES.MyTasks,
//                 RequestJSON: {
//                   // Title: taskItem.sectionName,
//                   // taskAssigneeId: taskItem.taskAssignee,
//                   // role: taskItem.role,
//                   // taskStatus: taskItem.status,
//                   // taskDueDate: sectionCreatedDate,
//                   // documentDetailsId: docDetails?.documentDetailsId,

//                   Title: docDetails?.docName,
//                   taskAssigneeId: taskItem.taskAssignee,
//                   role: taskItem.role,
//                   taskStatus: taskItem.taskStatus,
//                   docVersion: docDetails?.docVersion,
//                   docCreatedDate: docDetails?.docCreatedDate,
//                   taskDueDate: sectionCreatedDate,
//                   pathName: docDetails?.pathName,
//                   sectionDetailsId: mainRes[0]?.ID,
//                   documentDetailsId: docDetails?.documentDetailsId,
//                   sectionName: taskItem.sectionName,
//                   docStatus: taskItem.docStatus,
//                   taskAssignedById: docDetails?.taskAssignee?.ID,
//                 },
//               });
//             }
//           })
//         );
//       } else {
//         await SpServices.SPDeleteItem({
//           Listname: LISTNAMES.SectionDetails,
//           ID: section?.ID,
//         });

//         await Promise.all(
//           uniqueTaskByResponse.map(async (item: any) => {
//             await SpServices.SPDeleteItem({
//               Listname: LISTNAMES.MyTasks,
//               ID: item?.ID,
//             });
//           })
//         );
//       }
//     });

//     await Promise.all([...updateSectionsPromise])
//       .then(() => {
//         setLoaderState({
//           isLoading: { inprogress: false, success: true, error: false },
//           visibility: true,
//           text: "Sections updated successfully!",
//           secondaryText: `The document "${docDetails?.docName}'s" sections have been updated successfully!`,
//         });
//       })
//       .catch((err) => {
//         console.error("Error updating sections:", err);
//         // setLoaderState({
//         //   isLoading: { inprogress: false, success: false, error: true },
//         //   visibility: true,
//         //   text: "Unable to update the sections.",
//         //   secondaryText:
//         //     "An unexpected error occurred while updating the sections, please try again later.",
//         // });
//       });
//   } catch (err) {
//     if (
//       err?.message?.value !==
//       "Item does not exist. It may have been deleted by another user."
//     ) {
//       setLoaderState({
//         isLoading: { inprogress: false, success: false, error: true },
//         visibility: true,
//         text: "Unable to process the sections.",
//         secondaryText:
//           "An unexpected error occurred while processing the sections, please try again later.",
//       });
//     }
//   }
// };

export const updateSections = async (
  formData: any,
  setLoaderState: any,
  docDetails: any
): Promise<any> => {
  console.log("docDetails: ", docDetails);
  try {
    const sectionsToUpdate: any[] = [];
    const sectionsToAdd: any[] = [];
    const allPayload: any[] = [];

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

        allPayload.push(sectionPayload);
        if (element?.templateSectionID || element?.ID) {
          sectionsToUpdate.push(sectionPayload);
        } else {
          sectionsToAdd.push(element);
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
            FilterKey: "sectionDetails",
            FilterValue: section?.ID,
            Operator: "eq",
          },
        ],
      });

      let currentSectionDetails: any;
      if (section?.ID) {
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

      if (section?.isActive) {
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
                  taskStatus: taskItem.status,
                  docVersion: docDetails?.docVersion,
                  docCreatedDate: docDetails?.docCreatedDate,
                  taskDueDate: sectionCreatedDate,
                  pathName: docDetails?.pathName,
                  sectionDetailsId: mainRes[0]?.ID,
                  documentDetailsId: docDetails?.documentDetailsId,
                  sectionName: taskItem.sectionName,
                  docStatus: taskItem.docStatus,
                  taskAssignedById: docDetails?.taskAssignee?.ID,
                },
              });
            }
          })
        );
      } else {
        await SpServices.SPDeleteItem({
          Listname: LISTNAMES.SectionDetails,
          ID: section?.ID,
        });

        // await Promise.all(
        uniqueTaskByResponse.map(async (item: any) => {
          await SpServices.SPDeleteItem({
            Listname: LISTNAMES.MyTasks,
            ID: item?.ID,
          });
        });
        // )
        // .then((res: any) => {
        //   console.log("res: ", res);
        // })
        // .catch((err: any) => {
        //   console.log("err: ", err);
        //   if (
        //     err?.message?.value !==
        //     "Item does not exist. It may have been deleted by another user."
        //   ) {
        //     setLoaderState({
        //       isLoading: { inprogress: false, success: false, error: true },
        //       visibility: true,
        //       text: "Unable to process the sections.",
        //       secondaryText:
        //         "An unexpected error occurred while processing the sections, please try again later.",
        //     });
        //   }
        // });
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
