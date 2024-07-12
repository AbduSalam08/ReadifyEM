/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dayjs from "dayjs";

interface Task {
  taskCreatedDate: string; // Assuming this is your date-time property
  // Add more properties as needed
}

// Function to parse DD/MM/YYYY HH:mm:ss format using dayjs
const parseDateTime = (dateTimeStr: string): any => {
  if (!dateTimeStr) return null;
  return dayjs(dateTimeStr, "DD/MM/YYYY HH:mm:ss");
};

// Utility function to sort tasks by taskCreatedDate in descending order
export const sortTasksByDateTime = (tasks: Task[]): Task[] => {
  tasks.sort((a, b) => {
    const dateA = parseDateTime(a.taskCreatedDate);
    const dateB = parseDateTime(b.taskCreatedDate);

    if (dateA && dateB) {
      // Compare dates first in descending order
      if (dateA.isAfter(dateB)) {
        return -1;
      } else if (dateA.isBefore(dateB)) {
        return 1;
      } else {
        // If dates are the same, compare times
        if (dateA.hour() !== dateB.hour()) {
          return dateB.hour() - dateA.hour();
        } else if (dateA.minute() !== dateB.minute()) {
          return dateB.minute() - dateA.minute();
        } else if (dateA.second() !== dateB.second()) {
          return dateB.second() - dateA.second();
        } else {
          return 0; // Dates and times are identical
        }
      }
    } else if (dateA) {
      return -1; // dateA exists and dateB is null
    } else if (dateB) {
      return 1; // dateB exists and dateA is null
    } else {
      return 0; // both dates are null
    }
  });

  return tasks;
};
