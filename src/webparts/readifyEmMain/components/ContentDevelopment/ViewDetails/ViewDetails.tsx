/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./ViewDetails.module.scss";

interface Props {
  commentsData: any[];
}

const ViewDetails: React.FC<Props> = ({ commentsData }) => {
  return (
    <>
      <div className={styles.viewDetailsContainer}>ViewDetails</div>
    </>
  );
};

export default ViewDetails;
