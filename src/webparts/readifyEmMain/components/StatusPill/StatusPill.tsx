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
  customWrapperClass?: string;
  ontrackDot?: boolean;
  bordered?: boolean;
}

const StatusPill = ({
  status,
  roles,
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
      {ontrackDot && <span className={styles.ontrackDot} />}
      {status && getStatusText(status)}
      {roles && getRoleText(roles)}
    </div>
  );
};

export default StatusPill;
