/* eslint-disable @typescript-eslint/no-explicit-any */
// import styles from "./StatusPill.module.scss";

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
    | "Not Started"
    | "In Development"
    | "In Review"
    | "In Rework"
    | "In Approval"
    | "Approved"
    | "Current"
    | "Hidden";
  size: "SM" | "MD" | "XL";
  customWrapperClass?: any;
  ontrackDot?: boolean;
  bordered?: boolean;
}

const StatusPill = ({
  status,
  customWrapperClass,
  ontrackDot,
  size = "MD",
}: Props): JSX.Element => {
  return (
    <div className={`${customWrapperClass} `}>
      {<span />}
      {status}
    </div>
  );
};

export default StatusPill;
