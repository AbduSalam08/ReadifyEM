/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import dayjs from "dayjs";
import { memo } from "react";
import { useSelector } from "react-redux";
// import styles from "./ChangeRecord.module.scss";

const ChangeRecord = () => {
  const allSectionsChangeRecord: any = useSelector(
    (state: any) => state.SectionData.allSectionsChangeRecord
  );
  console.log(allSectionsChangeRecord);

  return (
    <div>
      <table
        // className={styles.tableWrapper}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th
              style={{
                width: "8%",
                fontSize: "15px",
                color: "#555",
                padding: "15px",
                fontFamily: "interMedium,sans-serif",
                textAlign: "center",
                border: "1px solid #DDD",
              }}
            >
              Section no
            </th>
            <th
              style={{
                width: "12%",
                fontSize: "15px",
                color: "#555",
                padding: "15px",
                fontFamily: "interMedium,sans-serif",
                textAlign: "center",
                border: "1px solid #DDD",
              }}
            >
              Section name
            </th>
            <th
              style={{
                width: "30%",
                fontSize: "15px",
                color: "#555",
                padding: "15px",
                fontFamily: "interMedium,sans-serif",
                textAlign: "center",
                border: "1px solid #DDD",
              }}
            >
              Current change
            </th>
            <th
              style={{
                width: "12%",
                fontSize: "15px",
                color: "#555",
                padding: "15px",
                fontFamily: "interMedium,sans-serif",
                textAlign: "center",
                border: "1px solid #DDD",
              }}
            >
              Author
            </th>
            <th
              style={{
                width: "10%",
                fontSize: "15px",
                color: "#555",
                padding: "15px",
                fontFamily: "interMedium,sans-serif",
                textAlign: "center",
                border: "1px solid #DDD",
              }}
            >
              Last modify
            </th>
          </tr>
        </thead>
        <tbody>
          {allSectionsChangeRecord?.map((obj: any, index: number) => {
            return (
              <tr key={index}>
                <td
                  style={{
                    fontSize: "13px",
                    padding: "8px 20px 8px 20px",
                    lineHeight: "18px",
                    fontFamily: "interMedium,sans-serif",
                    textAlign: "center",
                    border: "1px solid #DDD",
                  }}
                >
                  {obj.sectionOrder}
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: "8px 20px 8px 20px",
                    lineHeight: "18px",
                    fontFamily: "interMedium,sans-serif",
                    textAlign: "center",
                    border: "1px solid #DDD",
                  }}
                >
                  {obj.sectionName}
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: "8px 20px 8px 20px",
                    lineHeight: "18px",
                    fontFamily: "interMedium,sans-serif",
                    textAlign: "center",
                    border: "1px solid #DDD",
                  }}
                >
                  {obj.changeRecordDescription}
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: "8px 20px 8px 20px",
                    lineHeight: "18px",
                    fontFamily: "interMedium,sans-serif",
                    textAlign: "center",
                    border: "1px solid #DDD",
                  }}
                >
                  {obj.changeRecordAuthor.authorName}
                </td>
                <td
                  style={{
                    fontSize: "13px",
                    padding: "8px 20px 8px 20px",
                    lineHeight: "18px",
                    fontFamily: "interMedium,sans-serif",
                    textAlign: "center",
                    border: "1px solid #DDD",
                  }}
                >
                  {dayjs(obj.changeRecordModify).format("DD-MMM-YYYY hh:mm A")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default memo(ChangeRecord);
