/* eslint-disable @typescript-eslint/no-explicit-any */
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
    | "Current"
    | "Hidden";
  size: "SM" | "MD" | "XL";
  customWrapperClass?: string; // Corrected to string type
  ontrackDot?: boolean;
  bordered?: boolean;
}

const StatusPill = ({
  status,
  customWrapperClass,
  ontrackDot,
  size = "MD",
}: Props): JSX.Element => {
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
      case "Current":
        return styles.current;
      case "Hidden":
        return styles.hidden;
      default:
        return "";
    }
  };

  const getStatusText = (status?: Props["status"]): string => {
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
      case "Current":
        return "Current";
      case "Hidden":
        return "Hidden";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className={`${styles.statusPill} ${getStatusClassName(status)} ${
        styles[size]
      } ${customWrapperClass || ""}`}
    >
      {ontrackDot && <span className={styles.ontrackDot} />}
      {getStatusText(status)}
    </div>
  );
};

export default StatusPill;
