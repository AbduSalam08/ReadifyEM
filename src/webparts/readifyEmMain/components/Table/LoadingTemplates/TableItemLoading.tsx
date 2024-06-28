/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "primereact/skeleton";
import styles from "../Table.module.scss"; // Importing the SCSS module

const TableItemLoading = (item: any) => {
  const headers = [
    "Document Name",
    "Created At",
    "Next Review",
    "Status",
    // "Visibility",
    "Action",
  ];

  return (
    <div className={styles.itemContainer}>
      <div className={styles.item} title={item?.DocumentName || "-"}>
        <Skeleton shape="circle" width="1rem" />
        <Skeleton width="13rem" />
      </div>
      {headers?.map(
        (e: any, i: number) =>
          i >= 1 && (
            <div className={styles.item} title={e || "-"} key={i}>
              <Skeleton width="10rem" />
            </div>
          )
      )}
    </div>
  );
};

export { TableItemLoading };
