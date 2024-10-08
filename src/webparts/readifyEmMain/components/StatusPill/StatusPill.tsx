/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import styles from "./StatusPill.module.scss";

interface Props {
  roles?:
    | "Primary Author"
    | "Section Author"
    | "Consultant"
    | "Reviewer"
    | "Approver";
  status?:
    | "Overdue"
    | "Not Started"
    | "In Development"
    | "In Review"
    | "In Rework"
    | "In Approval"
    | "Approved"
    | "Archived"
    | "Hidden"
    | "Content in progress"
    | "submitted"
    | "content in progress"
    | "Rework in progress"
    | "Review in progress"
    | "Approval in progress";
  size: "SM" | "MD" | "XL";
  customWrapperClass?: string;
  ontrackDot?: boolean;
  bordered?: boolean;
  dynamicText?: any;
}

const StatusPill: React.FC<Props> = ({
  status,
  roles,
  customWrapperClass,
  ontrackDot,
  size = "MD",
  dynamicText,
  bordered,
}: Props) => {
  const getStatusClassName = (status?: Props["status"]): string => {
    switch (status) {
      case "Overdue":
        return styles.overdue;
      case "Not Started":
        return styles.notStarted;
      case "In Development":
        return styles.inDevelopment;
      case "In Review":
        return styles.inReview;
      case "In Rework":
        return styles.inRework;
      case "In Approval":
        return styles.inApproval;
      case "Approved":
        return styles.approved;
      case "Archived":
        return styles.archived;
      case "Hidden":
        return styles.hidden;
      case "Content in progress":
      case "content in progress":
        return styles.contentInProgress;
      case "submitted":
        return styles.contentSubmitted;
      case "Review in progress":
        return styles.reviewInProgress;
      case "Approval in progress":
        return styles.approvalInProgress;
      case "Rework in progress":
        return styles.reworkInProgress;
      default:
        return "";
    }
  };

  const getDotClass = (status?: Props["status"]): string => {
    switch (status) {
      case "Overdue":
        return styles.overdue;
      case "Not Started":
        return styles.notStarted;
      case "In Development":
        return styles.inDevelopment;
      case "In Review":
        return styles.inReview;
      case "In Rework":
        return styles.inRework;
      case "In Approval":
        return styles.inApproval;
      case "Approved":
        return styles.approved;
      case "Archived":
        return styles.archived;
      case "Hidden":
        return styles.hidden;
      case "Content in progress":
      case "content in progress":
        return styles.contentInProgressDOT;
      case "submitted":
        return styles.contentSubmittedDOT;
      case "Review in progress":
        return styles.reviewInProgressDOT;
      case "Approval in progress":
        return styles.approvalInProgressDOT;
      case "Rework in progress":
        return styles.reworkInProgressDOT;
      default:
        return "";
    }
  };

  const getDisplayText = (): string => {
    if (dynamicText) return dynamicText || "";
    switch (status) {
      case "Overdue":
        return "Overdue";
      case "Not Started":
        return "Not Started";
      case "In Development":
        return "In Development";
      case "In Review":
        return "In Review";
      case "In Rework":
        return "In Rework";
      case "In Approval":
        return "In Approval";
      case "Approved":
        return "Approved";
      case "Archived":
        return "Archived";
      case "Hidden":
        return "Hidden";
      case "Content in progress":
      case "content in progress":
        return "Content in progress";
      case "submitted":
        return "Submitted";
      case "Review in progress":
        return "Review in progress";
      case "Approval in progress":
        return "Approval in progress";
      case "Rework in progress":
        return "Rework in progress";
      default:
        return dynamicText || "";
    }
  };

  const getRoleClassName = (role?: Props["roles"]): string => {
    switch (role) {
      case "Primary Author":
        return styles.primaryAuthor;
      case "Section Author":
        return styles.sectionAuthor;
      case "Consultant":
        return styles.consultant;
      case "Reviewer":
        return styles.reviewer;
      case "Approver":
        return styles.approver;
      default:
        return "";
    }
  };

  const getRoleText = (role?: Props["roles"]): string => {
    switch (role) {
      case "Primary Author":
        return "Primary Author";
      case "Section Author":
        return "Section Author";
      case "Consultant":
        return "Consultant";
      case "Reviewer":
        return "Reviewer";
      case "Approver":
        return "Approver";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className={`${
        roles ? styles.rolesPill : styles.statusPill
      } ${getStatusClassName(status)} ${getRoleClassName(roles)} ${
        styles[size]
      } ${customWrapperClass || ""}`}
    >
      {ontrackDot && (
        <span className={`${styles.ontrackDot} ${getDotClass(status)}`} />
      )}
      {getDisplayText()}
      {roles && getRoleText(roles)}
    </div>
  );
};

export default memo(StatusPill);
