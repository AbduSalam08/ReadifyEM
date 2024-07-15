/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
//
import { memo } from "react";
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
  btnText: string;
}

const roleClasses = {
  "Primary Author": {
    button: styles.primaryAuthorButton,
    badge: styles.primaryAuthorBadge,
  },
  "Section Author": {
    button: styles.sectionAuthorButton,
    badge: styles.sectionAuthorBadge,
  },
  Consultant: {
    button: styles.consultantButton,
    badge: styles.consultantBadge,
  },
  Reviewer: {
    button: styles.reviewerButton,
    badge: styles.reviewerBadge,
  },
  Approver: {
    button: styles.approverButton,
    badge: styles.approverBadge,
  },
};

const TaskCard: React.FC<CardProps> = ({
  title,
  roles,
  pillSize,
  description,
  dueDate,
  onClick,
  btnText,
}) => {
  const roleClass = roleClasses[roles];

  return (
    <div className={styles.taskCard}>
      <div className={styles.cardTopSection}>
        <div className={`${styles.cardIndicator} ${roleClass.badge}`} />
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>{title}</span>
          <StatusPill roles={roles} size={pillSize} />
        </div>
        <div className={styles.cardContent}>
          <span className={styles.secondaryText}>{description}</span>
        </div>
      </div>
      <div className={styles.cardBottomSection}>
        <button
          className={`${styles.actionBtn} ${roleClass.button}`}
          onClick={onClick}
        >
          {btnText}
        </button>
        <div className={styles.dueDate}>
          <img src={dueDataImg} alt="due date" />
          <span className={styles.dueDateText}>Due on: {dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskCard);
