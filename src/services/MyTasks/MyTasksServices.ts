/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dayjs from "dayjs";
import { LISTNAMES } from "../../config/config";
import {
  setTasksData,
  setUniqueTasksData,
} from "../../redux/features/MyTasksSlice";
import { calculateDueDateByRole } from "../../utils/validations";
import SpServices from "../SPServices/SpServices";
import { sortTasksByDateTime } from "../../utils/MyTasksUtils";

// fn to get all the tasks items
// export const getAllTasksList = async (
//   currentUserDetails: any,
//   setStateData: any,
//   dispatch?: any
// ): Promise<any> => {
//   try {
//     setStateData &&
//       setStateData((prev: any) => ({
//         ...prev,
//         loading: true,
//       }));

//     const dataResponse: any = await SpServices.SPReadItems({
//       Listname: LISTNAMES.MyTasks,
//       Select:
//         "*, taskAssignee/ID, taskAssignee/EMail, taskAssignee/Title, taskAssignedBy/ID, taskAssignedBy/EMail, taskAssignedBy/Title, documentDetails/ID, sectionDetails/ID",
//       Expand: "taskAssignee, taskAssignedBy, documentDetails, sectionDetails",
//     });

//     const primaryAuthorTasks: any[] = [];
//     const sectionAuthorTasks: any[] = [];
//     const consultantsTasks: any[] = [];
//     const reviewersTasks: any[] = [];
//     const approversTasks: any[] = [];
//     const contentInProgressTasks: any[] = [];

//     const uniqueTasksMap: Map<string, any> = new Map();

//     dataResponse?.forEach((item: any) => {
//       const defaultFields: any = {
//         taskID: [item?.ID],
//         documentDetaixlsId: item.documentDetailsId,
//         taskAssignedBy: item?.taskAssignedBy,
//         taskAssignee: [item?.taskAssignee],
//         docName: item?.Title,
//         pathName: item?.pathName,
//         taskDueDate: item?.taskDueDate,
//         completed: item.completed,
//         completedOn: item?.completedOn,
//         docVersion: item?.docVersion,
//         role: item?.role,
//         taskStatus: item?.taskStatus,
//         docStatus: item?.docStatus,
//         taskCreatedDate: dayjs(item?.Created)?.format("DD/MM/YYYY HH:mm:ss"),
//       };

//       const taskKey = `${item?.Title}_${item?.role}`;

//       if (uniqueTasksMap.has(taskKey)) {
//         const existingTask = uniqueTasksMap.get(taskKey);
//         uniqueTasksMap.set(taskKey, {
//           ...existingTask,
//           taskID: [...existingTask.taskID, item?.ID],
//           taskAssignee: [...existingTask.taskAssignee, item?.taskAssignee],
//         });
//       } else {
//         uniqueTasksMap.set(taskKey, defaultFields);
//       }
//     });

//     const uniqueTasks = Array.from(uniqueTasksMap.values());

//     uniqueTasks.forEach((task) => {
//       if (
//         task.role.toLowerCase() === "primary author" &&
//         task.taskAssignee.some(
//           (assignee: any) => assignee.EMail === currentUserDetails?.email
//         )
//       ) {
//         primaryAuthorTasks.push(task);
//       }
//       if (
//         task.role.toLowerCase() === "section author" &&
//         task.taskAssignee.some(
//           (assignee: any) => assignee.EMail === currentUserDetails?.email
//         )
//       ) {
//         sectionAuthorTasks.push(task);
//       }
//       if (
//         task.role.toLowerCase() === "consultant" &&
//         task.taskAssignee.some(
//           (assignee: any) => assignee.EMail === currentUserDetails?.email
//         )
//       ) {
//         consultantsTasks.push(task);
//       }
//       if (
//         task.role.toLowerCase() === "reviewer" &&
//         task.taskAssignee.some(
//           (assignee: any) => assignee.EMail === currentUserDetails?.email
//         )
//       ) {
//         reviewersTasks.push(task);
//       }
//       if (
//         task.role.toLowerCase() === "approver" &&
//         task.taskAssignee.some(
//           (assignee: any) => assignee.EMail === currentUserDetails?.email
//         )
//       ) {
//         approversTasks.push(task);
//       }
//     });

//     const AllTasks: any[] = [
//       ...primaryAuthorTasks,
//       ...sectionAuthorTasks,
//       ...consultantsTasks,
//       ...reviewersTasks,
//       ...approversTasks,
//       ...contentInProgressTasks,
//     ];

//     const sortedTasksData: any[] = sortTasksByDateTime(AllTasks);

//     setStateData &&
//       setStateData((prev: any) => ({
//         ...prev,
//         loading: false,
//         data: AllTasks,
//       }));

//     dispatch && dispatch(setTasksData(sortedTasksData));
//   } catch (err: any) {
//     console.log("Error : ", err);
//   }
// };

export const getAllTasksList = async (
  currentUserDetails: any,
  setStateData: any,
  dispatch?: any
): Promise<any> => {
  setStateData &&
    setStateData((prev: any) => ({
      ...prev,
      loading: true,
    }));
  try {
    const dataResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.MyTasks,
      Select:
        "*, taskAssignee/ID, taskAssignee/EMail, taskAssignee/Title, taskAssignedBy/ID, taskAssignedBy/EMail, taskAssignedBy/Title, documentDetails/ID, sectionDetails/ID",
      Expand: "taskAssignee, taskAssignedBy, documentDetails, sectionDetails",
    });

    const primaryAuthorTasks: any[] = [];
    const sectionAuthorTasks: any[] = [];
    const consultantsTasks: any[] = [];
    const reviewersTasks: any[] = [];
    const approversTasks: any[] = [];
    const contentInProgressTasks: any[] = [];

    const uniqueTasksMap: Map<string, any> = new Map();

    dataResponse?.forEach((item: any) => {
      // Ensure taskAssignee is an array
      const assignees = Array.isArray(item?.taskAssignee)
        ? item?.taskAssignee
        : item?.taskAssignee
        ? [item.taskAssignee]
        : [];

      // Filter out tasks not assigned to the current user
      if (
        !assignees.some(
          (assignee: any) => assignee.EMail === currentUserDetails?.email
        )
      ) {
        return;
      }

      const defaultFields: any = {
        taskID: [item?.ID],
        documentDetailsId: item.documentDetailsId,
        taskAssignedBy: item?.taskAssignedBy,
        taskAssignee: assignees,
        docName: item?.Title,
        pathName: item?.pathName,
        taskDueDate: item?.taskDueDate,
        completed: item.completed,
        completedOn: item?.completedOn,
        docVersion: item?.docVersion,
        role: item?.role,
        taskStatus: item?.taskStatus,
        docStatus: item?.docStatus,
        taskCreatedDate: dayjs(item?.Created)?.format("DD/MM/YYYY HH:mm:ss"),
        completedAll: item.completed,
      };

      const taskKey = `${item?.Title}_${item?.role}`;

      if (uniqueTasksMap.has(taskKey)) {
        const existingTask = uniqueTasksMap.get(taskKey);
        existingTask.taskID.push(item?.ID);
        existingTask.taskAssignee.push(...assignees);
        existingTask.completedAll = existingTask.completedAll && item.completed;

        uniqueTasksMap.set(taskKey, existingTask);
      } else {
        uniqueTasksMap.set(taskKey, defaultFields);
      }
    });

    const uniqueTasks = Array.from(uniqueTasksMap.values());

    uniqueTasks.forEach((task) => {
      if (task.role.toLowerCase() === "primary author") {
        primaryAuthorTasks.push(task);
      }
      if (task.role.toLowerCase() === "section author") {
        sectionAuthorTasks.push(task);
      }
      if (task.role.toLowerCase() === "consultant") {
        consultantsTasks.push(task);
      }
      if (task.role.toLowerCase() === "reviewer") {
        reviewersTasks.push(task);
      }
      if (task.role.toLowerCase() === "approver") {
        approversTasks.push(task);
      }
    });

    const AllTasks: any[] = [
      ...primaryAuthorTasks,
      ...sectionAuthorTasks,
      ...consultantsTasks,
      ...reviewersTasks,
      ...approversTasks,
      ...contentInProgressTasks,
    ];

    const sortedTasksData: any[] = sortTasksByDateTime(AllTasks);

    setStateData &&
      setStateData((prev: any) => ({
        ...prev,
        loading: false,
        data: AllTasks,
      }));

    dispatch && dispatch(setTasksData(sortedTasksData));
  } catch (err: any) {
    console.log("Error : ", err);
    setStateData &&
      setStateData((prev: any) => ({
        ...prev,
        loading: false,
      }));
  }
};

// getting the unique task item's data on the task click
export const getUniqueTaskData = async (
  taskID: any,
  dispatch: any
): Promise<any> => {
  const TASK_ID: any =
    typeof taskID === "object" && taskID?.length !== 0 ? taskID[0] : taskID;

  const taskResponse: any = await SpServices.SPReadItems({
    Listname: LISTNAMES.MyTasks,
    Select:
      "*, taskAssignee/ID, taskAssignee/EMail, taskAssignee/Title, taskAssignedBy/ID, taskAssignedBy/EMail, taskAssignedBy/Title, documentDetails/ID, documentTemplateType/ID, documentTemplateType/Title, sectionDetails/ID",
    Expand:
      "taskAssignee, taskAssignedBy, documentDetails, sectionDetails, documentTemplateType",
    Filter: [
      {
        FilterKey: "ID",
        FilterValue: TASK_ID,
        Operator: "eq",
      },
    ],
  });

  const responseData: any = taskResponse[0];
  let fileDetailsID: any;

  await SpServices.SPReadItemUsingId({
    Listname: LISTNAMES.DocumentDetails,
    SelectedId: responseData?.documentDetailsId,
    Select: "*, fileDetails/ID",
    Expand: "fileDetails",
  })
    .then((res: any) => {
      const resp = res[0] || res;
      fileDetailsID = resp?.fileDetailsId;
    })
    .catch((err: any) => {
      console.log("Error : ", err);
    });

  const uniqueTaskData: any = {
    taskID: responseData?.ID,
    docName: responseData?.Title,
    completed: responseData?.completed,
    docCreatedDate: responseData?.docCreatedDate,
    docVersion: responseData?.docVersion,
    documentDetailsId: responseData?.documentDetailsId,
    documentTemplateType: responseData?.documentTemplateType,
    pathName: responseData?.pathName,
    role: responseData?.role,
    sectionDetailsId: responseData?.sectionDetailsId,
    taskAssignedBy: responseData?.taskAssignedBy,
    taskAssignee: responseData?.taskAssignee,
    taskDueDate: responseData?.taskDueDate,
    taskStatus: responseData?.taskStatus,
    docStatus: responseData?.docStatus,
    fileDetailsID: fileDetailsID,
  };

  dispatch && dispatch(setUniqueTasksData(uniqueTaskData));
};

// functions to add a task for the primary author
export const AddPrimaryAuthorTask = async (
  fileID: any,
  newVersion?: any
): Promise<any> => {
  if (newVersion) {
    try {
      const AllDocResponse: any = await SpServices.SPReadItems({
        Listname: LISTNAMES.DocumentDetails,
        Select:
          "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/Title, documentTemplateType/ID,fileDetails/ID",
        Expand: "primaryAuthor, Author, documentTemplateType,fileDetails",
        Filter: [
          {
            FilterKey: "isDraft",
            Operator: "eq",
            FilterValue: "0",
          },
          {
            FilterKey: "fileDetails",
            Operator: "eq",
            FilterValue: fileID,
          },
        ],
      });

      const primaryAuthorTasks: any[] = [];

      AllDocResponse?.forEach((item: any) => {
        // const reviewers = JSON.parse(item?.reviewers);
        // const approvers = JSON.parse(item?.approvers);

        const defaultFields: any = {
          documentDetailsId: item?.ID,
          docCreatedDate: item?.createdDate,
          fileDetailsId: item?.fileDetailsId,
          docName: item.Title,
          documentTemplateTypeId: item.documentTemplateType?.ID,
          pathName: item?.documentPath?.split(
            "sites/ReadifyEM/AllDocuments/"
          )[1],
          taskDueDate: calculateDueDateByRole(item?.createdDate, "document"),
          completed: false,
          docVersion: item?.documentVersion,
          docStatus: item?.status,
          taskStatus:
            item?.status?.toLowerCase() === "in development"
              ? "development in progress"
              : item?.status,
        };

        primaryAuthorTasks.push({
          ...defaultFields,
          role: "Primary Author",
          taskAssignedBy: item?.Author?.ID,
          taskAssignee: item?.primaryAuthor?.ID,
        });
      });

      const AllTasks: any[] = [...primaryAuthorTasks];

      const allTaskCalls: any = AllTasks?.map(async (taskItem: any) => {
        const defaultPayload: any = {
          Title: taskItem?.docName,
          pathName: taskItem?.pathName,
          docCreatedDate: taskItem?.docCreatedDate,
          documentTemplateTypeId: taskItem?.documentTemplateTypeId,
          documentDetailsId: taskItem?.documentDetailsId,
          taskDueDate: taskItem?.taskDueDate,
          role: taskItem?.role,
          taskAssignedById: taskItem?.taskAssignedBy,
          taskAssigneeId: taskItem?.taskAssignee,
          completed: false,
          docVersion: taskItem?.docVersion,
          docStatus: taskItem?.docStatus,
          taskStatus: taskItem?.taskStatus,
          // fileDetailsId: taskItem?.fileDetailsId,
        };
        await SpServices.SPAddItem({
          Listname: LISTNAMES.MyTasks,
          RequestJSON: defaultPayload,
        });
      });

      await Promise.all(allTaskCalls);
    } catch (err: any) {
      console.log("Error : ", err);
    }
  } else {
    try {
      const AllDocResponse: any = await SpServices.SPReadItems({
        Listname: LISTNAMES.DocumentDetails,
        Select:
          "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/Title, documentTemplateType/ID",
        Expand: "primaryAuthor, Author, documentTemplateType",
        Filter: [
          {
            FilterKey: "isDraft",
            Operator: "eq",
            FilterValue: "0",
          },
          {
            FilterKey: "ID",
            Operator: "eq",
            FilterValue: fileID,
          },
        ],
      });

      const primaryAuthorTasks: any[] = [];

      AllDocResponse?.forEach((item: any) => {
        // const reviewers = JSON.parse(item?.reviewers);
        // const approvers = JSON.parse(item?.approvers);

        const defaultFields: any = {
          documentDetailsId: item?.ID,
          docCreatedDate: item?.createdDate,
          fileDetailsId: item?.fileDetailsId,
          docName: item.Title,
          documentTemplateTypeId: item.documentTemplateType?.ID,
          pathName: item?.documentPath?.split(
            "sites/ReadifyEM/AllDocuments/"
          )[1],
          taskDueDate: calculateDueDateByRole(item?.createdDate, "document"),
          completed: false,
          docVersion: item?.documentVersion,
          docStatus: item?.status,
          taskStatus:
            item?.status?.toLowerCase() === "in development"
              ? "development in progress"
              : item?.status,
        };

        primaryAuthorTasks.push({
          ...defaultFields,
          role: "Primary Author",
          taskAssignedBy: item?.Author?.ID,
          taskAssignee: item?.primaryAuthor?.ID,
        });
      });

      const AllTasks: any[] = [...primaryAuthorTasks];

      const allTaskCalls: any = AllTasks?.map(async (taskItem: any) => {
        const defaultPayload: any = {
          Title: taskItem?.docName,
          pathName: taskItem?.pathName,
          docCreatedDate: taskItem?.docCreatedDate,
          documentTemplateTypeId: taskItem?.documentTemplateTypeId,
          documentDetailsId: taskItem?.documentDetailsId,
          taskDueDate: taskItem?.taskDueDate,
          role: taskItem?.role,
          taskAssignedById: taskItem?.taskAssignedBy,
          taskAssigneeId: taskItem?.taskAssignee,
          completed: false,
          docVersion: taskItem?.docVersion,
          docStatus: taskItem?.docStatus,
          taskStatus: taskItem?.taskStatus,
        };
        await SpServices.SPAddItem({
          Listname: LISTNAMES.MyTasks,
          RequestJSON: defaultPayload,
        });
      });

      await Promise.all(allTaskCalls);
    } catch (err: any) {
      console.log("Error : ", err);
    }
  }
};

// functions to update task's primary author item
export const UpdatePrimaryAuthorTask = async (fileID: any): Promise<any> => {
  try {
    // Fetch the document details
    const AllDocResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.DocumentDetails,
      Select:
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/Title, documentTemplateType/ID",
      Expand: "primaryAuthor, Author, documentTemplateType",
      Filter: [
        {
          FilterKey: "isDraft",
          Operator: "eq",
          FilterValue: "0",
        },
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: fileID,
        },
      ],
    });

    const primaryAuthorTasks: any[] = [];

    AllDocResponse?.forEach((item: any) => {
      const defaultFields: any = {
        documentDetailsId: item?.ID,
        docCreatedDate: item?.createdDate,
        fileDetailsId: item?.fileDetailsId,
        docName: item.Title,
        pathName: item?.documentPath?.split("sites/ReadifyEM/AllDocuments/")[1],
        documentTemplateTypeId: item.documentTemplateType?.ID,
        docVersion: item?.documentVersion,
        // taskDueDate: calculateDueDateByRole(item?.createdDate, "document"),
        // completed: false,
        // status:
        //   item?.status?.toLowerCase() === "content in progress"
        //     ? "development in progress"
        //     : item?.status,
      };

      primaryAuthorTasks.push({
        ...defaultFields,
        role: "Primary Author",
        taskAssignedBy: item?.Author?.ID,
        taskAssignee: item?.primaryAuthor?.ID,
      });
    });

    const AllTasks: any[] = [...primaryAuthorTasks];

    const allTaskCalls: any = AllTasks?.map(async (taskItem: any) => {
      // Fetch existing task items for this document and primary author
      const existingTasks: any = await SpServices.SPReadItems({
        Listname: LISTNAMES.MyTasks,
        Select: "*",
        Filter: [
          {
            FilterKey: "documentDetailsId",
            Operator: "eq",
            FilterValue: taskItem.documentDetailsId,
          },
          {
            FilterKey: "docVersion",
            Operator: "eq",
            FilterValue: taskItem.docVersion,
          },
          {
            FilterKey: "role",
            Operator: "eq",
            FilterValue: "Primary Author",
          },
        ],
      });

      const updateTaskCalls = existingTasks?.map(async (existingTask: any) => {
        const updatePayload: any = {
          Title: taskItem?.docName,
          pathName: taskItem?.pathName,
          documentDetailsId: taskItem?.documentDetailsId,
          taskDueDate: taskItem?.taskDueDate,
          documentTemplateTypeId: taskItem?.documentTemplateTypeId,
          role: taskItem?.role,
          taskAssignedById: taskItem?.taskAssignedBy,
          taskAssigneeId: taskItem?.taskAssignee,
          completed: false,
          docVersion: taskItem?.docVersion,
          taskStatus: taskItem?.status,
        };
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.MyTasks,
          ID: existingTask?.ID,
          RequestJSON: updatePayload,
        });
      });

      await Promise.all(updateTaskCalls);
    });

    await Promise.all(allTaskCalls);
  } catch (err: any) {
    console.log("Error : ", err);
  }
};

// start - UTILS for get the data ready
const getDefaultFields = (item: any): any => ({
  documentDetailsId: item?.ID,
  docCreatedDate: item?.createdDate,
  fileDetailsId: item?.fileDetailsId,
  docName: item.Title,
  pathName: item?.documentPath?.split("sites/ReadifyEM/AllDocuments/")[1],
  docVersion: item?.documentVersion,
});

const createTaskPayload = (taskItem: any): any => ({
  Title: taskItem?.docName,
  sectionName: taskItem?.sectionName,
  pathName: taskItem?.pathName,
  docCreatedDate: taskItem?.docCreatedDate,
  documentDetailsId: taskItem?.documentDetailsId,
  taskDueDate: taskItem?.taskDueDate,
  role: taskItem?.role,
  taskAssignedById: taskItem?.taskAssignedBy,
  taskAssigneeId: taskItem?.taskAssignee,
  // completed: false,
  docVersion: taskItem?.docVersion,
  taskStatus: taskItem?.taskStatus,
  docStatus: taskItem?.docStatus,
});
// end - UTILS for get the data ready

// Function to add a task for the primary author
export const AddTask = async (
  fileID: any,
  formData?: any,
  docStatusProp?: any,
  updateDueDate?: any,
  sectionID?: any
): Promise<any> => {
  try {
    const AllDocResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.DocumentDetails,
      Select:
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/Title, documentTemplateType/ID",
      Expand: "primaryAuthor, Author, documentTemplateType",
      Filter: [
        { FilterKey: "isDraft", Operator: "eq", FilterValue: "0" },
        { FilterKey: "ID", Operator: "eq", FilterValue: fileID },
      ],
    });

    const taskData: any[] = AllDocResponse?.map((item: any) => ({
      ...getDefaultFields(item),
      role: formData?.role,
      sectionName: formData?.sectionName,
      taskAssignedBy: item?.primaryAuthor?.ID,
      taskAssignee: formData?.taskAssignee,
      taskDueDate: updateDueDate
        ? updateDueDate
        : calculateDueDateByRole(
            dayjs(new Date()).format("DD/MM/YYYY"),
            formData?.role?.toLowerCase() === "section author"
              ? "content developer"
              : formData?.role?.toLowerCase() === "consultant"
              ? "consultant"
              : formData?.role?.toLowerCase() === "approver"
              ? "approver"
              : formData?.role?.toLowerCase() === "reviewer"
              ? "reviewer"
              : "content developer"
          ),
      documentTemplateTypeId: item.documentTemplateType?.ID,
      taskStatus:
        docStatusProp?.toLowerCase() === "in development"
          ? "In Development"
          : formData?.status,
      docStatus:
        docStatusProp?.toLowerCase() === "in development"
          ? "In Development"
          : formData?.status,
    }));

    taskData?.map(async (taskItem: any) => {
      await SpServices.SPAddItem({
        Listname: LISTNAMES.MyTasks,
        RequestJSON: createTaskPayload(taskItem),
      })
        .then(async (res: any) => {
          if (sectionID) {
            await SpServices.SPUpdateItem({
              Listname: LISTNAMES.MyTasks,
              ID: res?.data?.ID,
              RequestJSON: {
                sectionDetailsId: sectionID,
              },
            });
          }
        })
        .catch((err: any) => {
          console.log("Error : ", err);
        });
    });
  } catch (err: any) {
    console.error("Error adding task:", err);
  }
};

// Function to update a task
export const UpdateTask = async (fileID: any, formData?: any): Promise<any> => {
  try {
    // Fetch the document details
    const AllDocResponse: any = await SpServices.SPReadItems({
      Listname: LISTNAMES.DocumentDetails,
      Select:
        "*, primaryAuthor/ID, primaryAuthor/Title, primaryAuthor/EMail, Author/ID, Author/Title, Author/EMail, documentTemplateType/Title, documentTemplateType/ID",
      Expand: "primaryAuthor, Author, documentTemplateType",
      Filter: [
        {
          FilterKey: "isDraft",
          Operator: "eq",
          FilterValue: "0",
        },
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: fileID,
        },
      ],
    });

    // Prepare the updated task information
    const updatedTasks: any[] = AllDocResponse?.map((item: any) => ({
      documentDetailsId: item?.ID,
      docCreatedDate: item?.createdDate,
      fileDetailsId: item?.fileDetailsId,
      docName: item.Title,
      documentTemplateTypeId: item.documentTemplateType?.ID,
      pathName: item?.documentPath?.split("sites/ReadifyEM/AllDocuments/")[1],
      docVersion: item?.documentVersion,
      // role: "Primary Author",
      // taskAssignedBy: item?.Author?.ID,
      // taskAssignee: item?.primaryAuthor?.ID,
    }));

    // Process each updated task to update existing task items
    const allTaskCalls = updatedTasks?.map(async (taskItem: any) => {
      // Fetch existing task items for this document and primary author
      const existingTasks: any = await SpServices.SPReadItems({
        Listname: LISTNAMES.MyTasks,
        Select: "*",
        Filter: [
          {
            FilterKey: "documentDetailsId",
            Operator: "eq",
            FilterValue: taskItem.documentDetailsId,
          },
          {
            FilterKey: "docVersion",
            Operator: "eq",
            FilterValue: taskItem.docVersion,
          },
        ],
      });

      // Update the existing tasks with new information
      const updateTaskCalls = existingTasks?.map(async (existingTask: any) => {
        const updatePayload: any = {
          Title: taskItem?.docName,
          pathName: taskItem?.pathName,
          documentDetailsId: taskItem?.documentDetailsId,
          documentTemplateTypeId: taskItem.documentTemplateTypeId,
          taskDueDate: taskItem?.taskDueDate,
          role: taskItem?.role,
          taskAssignedById: taskItem?.taskAssignedBy,
          taskAssigneeId: taskItem?.taskAssignee,
          // completed: false,
          docVersion: taskItem?.docVersion,
          // taskStatus: taskItem?.status,
        };
        await SpServices.SPUpdateItem({
          Listname: LISTNAMES.MyTasks,
          ID: existingTask?.ID,
          RequestJSON: updatePayload,
        });
      });

      await Promise.all(updateTaskCalls);
    });

    await Promise.all(allTaskCalls);
  } catch (err: any) {
    console.log("Error : ", err);
  }
};
