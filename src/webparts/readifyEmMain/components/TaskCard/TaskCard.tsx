/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
//
import { memo } from "react";
import StatusPill from "../StatusPill/StatusPill";
// images
const dueDataImg: any = require("../../../../assets/images/svg/dueDate.svg");
const checkMark: any = require("../../../../assets/images/svg/checkmarkGrey.svg");
const editConfigurationImg: any = require("../../../../assets/images/svg/taskConfigurationEditIcon.svg");
// styles
import styles from "./TaskCard.module.scss";
import { CurrentUserIsAdmin } from "../../../../constants/DefineUser";
import { useNavigate } from "react-router-dom";
import { getUniqueTaskData } from "../../../../services/MyTasks/MyTasksServices";
import { useDispatch } from "react-redux";
// import { getUniqueSectionsDetails } from "../../../../services/ConfigureSections/ConfigureSectionsServices";
import { setConfigurePageDetails } from "../../../../redux/features/SectionConfigurationSlice";
import DueDatePill from "../common/DueDatePill/DueDatePill";
import { removeVersionFromDocName } from "../../../../utils/formatDocName";

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
  taskData?: any;
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
console.log("roleClasses: ", roleClasses);

const TaskCard: React.FC<CardProps> = ({
  title,
  roles,
  pillSize,
  description,
  dueDate,
  onClick,
  btnText,
  taskData,
}) => {
  console.log("taskData: ", taskData);
  const roleClass = roleClasses[roles];
  const isAdmin = CurrentUserIsAdmin();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return !taskData?.completedAll ? (
    <div className={styles.taskCard}>
      <div className={styles.cardTopSection}>
        <div className={`${styles.cardIndicator} ${roleClass?.badge}`}>
          {taskData?.docVersion !== "1.0" && `version ${taskData?.docVersion}`}
        </div>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>
            {taskData?.docVersion !== "1.0"
              ? removeVersionFromDocName(title)
              : title}
          </span>
          <div className={styles.pillRHS}>
            {btnText?.toLowerCase() === "open" && roles === "Primary Author" ? (
              <button
                onClick={async () => {
                  await getUniqueTaskData(taskData?.taskID, dispatch);
                  // await getUniqueSectionsDetails(taskData?.documentDetailsId);
                  // if (taskData?.docVersion !== "1.0") {
                  //   dispatch(
                  //     setConfigurePageDetails({
                  //       pageKey: "version update",
                  //     })
                  //   );
                  // } else {
                  dispatch(
                    setConfigurePageDetails({
                      pageKey: "update",
                    })
                  );
                  // }

                  if (isAdmin) {
                    navigate(`/admin/my_tasks/${title}/configure`);
                  } else {
                    navigate(`/user/my_tasks/${title}/configure`);
                  }
                }}
              >
                <img src={editConfigurationImg} alt="editConfigurationImg" />
              </button>
            ) : (
              ""
            )}
            <StatusPill roles={roles} size={pillSize} />
          </div>
        </div>
        <div className={styles.cardContent}>
          <span className={styles.secondaryText}>{description}</span>
        </div>
      </div>
      <div className={styles.cardBottomSection}>
        <button
          className={`${styles.actionBtn} ${roleClass?.button}`}
          onClick={onClick}
        >
          {btnText}
        </button>
        <div className={styles.dueDateIndicators}>
          <DueDatePill dueDate={dueDate} roles={roles} />
          <div className={styles.dueDate}>
            <img src={dueDataImg} alt="due date" />

            <span className={styles.dueDateText}>Due on: {dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.taskCard}>
      <div className={styles.cardTopSection}>
        <div className={`${styles.cardIndicator} ${roleClass?.badge}`}>
          {taskData?.docVersion !== "1.0" && `version ${taskData?.docVersion}`}
        </div>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>
            {taskData?.docVersion !== "1.0"
              ? removeVersionFromDocName(title)
              : title}
          </span>
          <div className={styles.pillRHS}>
            {btnText?.toLowerCase() === "open" &&
              roles === "Primary Author" && (
                <button
                  disabled={true}
                  onClick={async () => {
                    await getUniqueTaskData(taskData?.taskID, dispatch);
                    // await getUniqueSectionsDetails(taskData?.documentDetailsId);
                    // if (taskData?.docVersion !== "1.0") {
                    //   dispatch(
                    //     setConfigurePageDetails({
                    //       pageKey: "version update",
                    //     })
                    //   );
                    // } else {
                    dispatch(
                      setConfigurePageDetails({
                        pageKey: "update",
                      })
                    );
                    // }

                    if (isAdmin) {
                      navigate(`/admin/my_tasks/${title}/configure`);
                    } else {
                      navigate(`/user/my_tasks/${title}/configure`);
                    }
                  }}
                >
                  <img src={editConfigurationImg} alt="editConfigurationImg" />
                </button>
              )}
            <StatusPill roles={roles} size={pillSize} />
          </div>
        </div>
        <div className={styles.cardContent}>
          <span className={styles.secondaryText}>{description}</span>
        </div>
      </div>
      <div className={styles.cardBottomSection}>
        <div className={styles.dueDateIndicators}>
          <div className={styles.dueDate}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                className={`${styles.actionBtn} ${roleClass?.button}`}
                onClick={onClick}
              >
                {btnText}
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: "5px",
                }}
              >
                <img src={checkMark} alt="due date" />
                <span className={styles.dueDateText}>
                  Completed on: {taskData?.completedOn}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.dueDateIndicators}>
          <div className={styles.dueDate}>
            <img src={dueDataImg} alt="due date" />
            <span className={styles.dueDateText}>Due on: {dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskCard);
