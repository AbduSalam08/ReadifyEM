import React from "react";
import dayjs from "dayjs";
import styles from "./DueDatePill.module.scss";

interface DueDatePillProps {
  dueDate: string; // Due date in DD/MM/YYYY format
}

const DueDatePill: React.FC<DueDatePillProps> = ({ dueDate }) => {
  const today = dayjs();
  const dueDateFormatted = dayjs(dueDate, "DD/MM/YYYY");
  const daysLeft = dueDateFormatted.diff(today, "day");

  const getPillColor = (): string => {
    if (daysLeft >= 90) return `${styles.green}`;
    if (daysLeft >= 45 && daysLeft < 90) return `${styles.yellow}`;
    if (daysLeft < 0) return "red";
    return `${styles.red}`; // In case the due date is today or overdue
  };

  return (
    <div className={`${styles.pill} ${getPillColor()}`}>
      {daysLeft >= 0 ? `${daysLeft} days left` : "Overdue"}
    </div>
  );
};

export default DueDatePill;
