/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { LISTNAMES } from "../../../config/config";
import { setAllSectionsData } from "../../../redux/features/SectionConfigurationSlice";
import { updateSectionDataLocal } from "../../../utils/contentDevelopementUtils";
import { calculateDueDateByRole } from "../../../utils/validations";
import SpServices from "../../SPServices/SpServices";

export const addSectionConsultants = async (
  documentDetails: any,
  sectionDetails: any,
  consultants: any[],
  currentUserDetails: any,
  dispatch: any,
  AllSectionsDataMain: any,
  setToastMessageState: any
): Promise<any> => {
  try {
    // let consultantsData = consultants.map((obj: any) => obj.id);
    SpServices.SPUpdateItem({
      ID: sectionDetails?.ID,
      Listname: LISTNAMES.SectionDetails,
      RequestJSON: {
        consultantsId: { results: consultants?.map((el: any) => el?.id) },
      },
    })
      .then(async (res: any) => {
        // setToastMessageState({
        //   isShow: true,
        //   severity: "success",
        //   title: "Consultants updated!",
        //   message: "Consultants updated successfully.",
        //   duration: 3000,
        // });
        //   removeConsultantsTask
        await SpServices.SPReadItems({
          Listname: LISTNAMES.MyTasks,
          Select: "*,documentDetails/ID,sectionDetails/ID",
          Expand: "documentDetails,sectionDetails",
          Filter: [
            {
              FilterKey: "documentDetails",
              FilterValue: documentDetails?.documentDetailsID,
              Operator: "eq",
            },
            {
              FilterKey: "sectionDetails",
              FilterValue: sectionDetails?.ID,
              Operator: "eq",
            },
            {
              FilterKey: "role",
              FilterValue: "Consultant",
              Operator: "eq",
            },
          ],
        }).then(async (res) => {
          if (res?.length > 0) {
            res.forEach(async (task: any) => {
              await SpServices.SPDeleteItem({
                Listname: LISTNAMES.MyTasks,
                ID: task?.ID,
              });
            });
          }
          const newConsultantTasks = consultants?.map((el: any) => ({
            taskAssignee: el.id,
            role: "Consultant",
            status: "content in progress",
            sectionName: sectionDetails?.sectionName,
          }));
          await Promise.all(
            newConsultantTasks.map(async (taskItem: any) => {
              await SpServices.SPAddItem({
                Listname: LISTNAMES.MyTasks,
                RequestJSON: {
                  Title: documentDetails?.documentName,
                  taskAssigneeId: taskItem.taskAssignee,
                  role: taskItem.role,
                  taskStatus: taskItem.status || "content in progress",
                  docVersion: documentDetails?.version,
                  docCreatedDate: documentDetails?.createdDate,
                  taskDueDate: calculateDueDateByRole(
                    documentDetails?.createdDate,
                    "consultant"
                  ),
                  documentDetailsId: documentDetails?.documentDetailsID,
                  sectionDetailsId: sectionDetails?.ID,
                  pathName: documentDetails?.documentPath?.split("/").pop(),
                  sectionName: taskItem.sectionName,
                  docStatus: documentDetails.documentStatus,
                  taskAssignedById: currentUserDetails?.id,
                  // taskAssignedById: docDetails?.taskAssignee?.ID,
                },
              });
            })
          );
          const updatedSections = updateSectionDataLocal(
            AllSectionsDataMain,
            sectionDetails?.ID,
            {
              consultants: consultants,
            }
          );
          dispatch(setAllSectionsData(updatedSections));
        });
      })
      .catch((error) => console.log("Error : ", error));
  } catch (err) {
    console.log("Error : ", err);
  }
};
