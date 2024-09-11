/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import dayjs from "dayjs";
import styles from "./DueDatePill.module.scss";

interface DueDatePillProps {
  dueDate: string; // Due date in DD/MM/YYYY format
  leftText?: any; // Due date in DD/MM/YYYY format
  roles:
    | "Primary Author"
    | "Section Author"
    | "Consultant"
    | "Reviewer"
    | "Approver";
}

const DueDatePill: React.FC<DueDatePillProps> = ({
  dueDate,
  roles,
  leftText,
}) => {
  const currentRole: string = roles?.toLowerCase();
  const today = dayjs();
  const dueDateFormatted = dayjs(dueDate, "DD/MM/YYYY");
  const daysLeft = dueDateFormatted.diff(today, "day");

  const getPillColor = (): string => {
    if (currentRole === "primary author") {
      if (daysLeft >= 90) return styles.green;
      if (daysLeft >= 30) return styles.yellow;
      if (daysLeft <= 15) return styles.red; // In case the due date is today or overdue
    } else if (
      currentRole === "section author" ||
      currentRole === "consultant"
    ) {
      if (daysLeft >= 30) return styles.green;
      if (daysLeft >= 15) return styles.yellow;
      if (daysLeft <= 5) return styles.red; // In case the due date is today or overdue
    } else if (currentRole === "reviewer" || currentRole === "approver") {
      if (daysLeft >= 7) return styles.green;
      if (daysLeft >= 4) return styles.yellow;
      if (daysLeft <= 2) return styles.red; // In case the due date is today or overdue
    }

    return styles.red; // Default to red if no role matches
  };

  return (
    <div
      className={`${styles.pill} ${getPillColor()}`}
      title={`${daysLeft} days left`}
    >
      {daysLeft >= 0
        ? `${daysLeft} ${leftText ? leftText : "days left"}`
        : "Overdue"}
    </div>
  );
};

export default DueDatePill;
