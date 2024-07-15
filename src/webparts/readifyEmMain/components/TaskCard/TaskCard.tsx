/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
//
import StatusPill from "../StatusPill/StatusPill";
// images
const dueDataImg: any = require("../../../../assets/images/svg/dueDate.svg");
// styles
import styles from "./TaskCard.module.scss";

interface CardProps {
  title: string;
  roles:
    | "Primary Author"
    | "Section Author"
    | "Consultant"
    | "Reviewer"
    | "Approver";
  pillSize: "SM" | "MD" | "XL";
  description: string;
  dueDate: string;
  onClick: any;
}

const TaskCard: React.FC<CardProps> = ({
  title,
  roles,
  pillSize,
  description,
  dueDate,
  onClick,
}) => {
  return (
    <div className={styles.taskCard}>
      <div className={styles.cardTopSection}>
        <div className={styles.cardIndicator} />
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>{title}</span>
          <StatusPill roles={roles} size={pillSize} />
        </div>
        <div className={styles.cardContent}>
          <span className={styles.secondaryText}>{description}</span>
        </div>
      </div>
      <div className={styles.cardBottomSection}>
        <button className={styles.actionBtn} onClick={onClick}>
          Configure
        </button>
        <div className={styles.dueDate}>
          <img src={dueDataImg} alt="due date" />
          <span className={styles.dueDateText}>Due on: {dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
