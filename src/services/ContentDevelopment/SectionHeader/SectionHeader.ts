/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { LISTNAMES } from "../../../config/config";
import { calculateDueDateByRole } from "../../../utils/validations";
import SpServices from "../../SPServices/SpServices";

export const addSectionConsultants = async (
  documentDetails: any,
  sectionDetails: any,
  consultants: any[],
  currentUserDetails: any
): Promise<any> => {
  debugger;
  try {
    // let consultantsData = consultants.map((obj: any) => obj.id);
    SpServices.SPUpdateItem({
      ID: sectionDetails?.ID,
      Listname: LISTNAMES.SectionDetails,
      RequestJSON: {
        consultantsId: { results: consultants?.map((el: any) => el?.id) },
      },
    })
      .then(async (res) => {
        console.log(res);
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
          console.log(res);
          debugger;
          if (res.length > 0) {
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
              debugger;
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
                  pathName: documentDetails?.documentPath,
                  sectionName: taskItem.sectionName,
                  docStatus: documentDetails.documentStatus,
                  taskAssignedById: currentUserDetails?.id,
                  // taskAssignedById: docDetails?.taskAssignee?.ID,
                },
              });
            })
          );
        });
        console.log(documentDetails, sectionDetails, consultants);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
