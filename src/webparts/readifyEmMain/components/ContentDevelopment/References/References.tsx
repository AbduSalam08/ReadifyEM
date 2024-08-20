/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { memo, useEffect, useState } from "react";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import { getAllSectionDefinitions } from "../../../../../services/ContentDevelopment/SectionDefinition/SectionDefinitionServices";
import styles from "./References.module.scss";
interface Props {
  allSectionsData: any;
  documentId: number;
  sectionId: number;
}

const References: React.FC<Props> = ({
  allSectionsData,
  documentId,
  sectionId,
}) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [allReferencesData, setallReferencesData] = useState<any[]>([]);

  console.log(allSectionsData);

  const getReferencesFromDefintions = () => {
    setLoader(true);
    allSectionsData.forEach(async (obj: any) => {
      if (obj.sectionName === "Definitions") {
        const tempSelectedDefinitionArray = await getAllSectionDefinitions(
          documentId,
          obj.ID
        );
        const tempArray = tempSelectedDefinitionArray.filter(
          (obj: any) => !obj.isDeleted
        );
        console.log(tempArray);
        setallReferencesData([...tempArray]);
      }
    });
    setLoader(false);
  };

  useEffect(() => {
    getReferencesFromDefintions();
  }, []);

  return (
    <>
      {loader ? (
        <CircularSpinner />
      ) : (
        <div style={{ height: "100%", overflow: "auto" }}>
          <table
            // className={styles.tableWrapper}
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
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
                  S.No
                </th>
                <th
                  style={{
                    width: "20%",
                    fontSize: "15px",
                    color: "#555",
                    padding: "15px",
                    fontFamily: "interMedium,sans-serif",
                    textAlign: "center",
                    border: "1px solid #DDD",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    width: "20%",
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
                    width: "50%",
                    fontSize: "15px",
                    color: "#555",
                    padding: "15px",
                    fontFamily: "interMedium,sans-serif",
                    textAlign: "center",
                    border: "1px solid #DDD",
                  }}
                >
                  Link
                </th>
              </tr>
            </thead>
            <tbody>
              {allReferencesData?.map((obj: any, index: number) => {
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
                      {index + 1}
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
                      {obj.referenceTitle}
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
                      {obj.referenceAuthorName}
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
                      <a
                        style={{ wordBreak: "break-all" }}
                        href={obj.referenceLink}
                        target="_blank"
                      >
                        {obj.referenceLink}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {allReferencesData.length === 0 && (
            <div className={styles.noDataFound}>
              <span>No Data Found</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default memo(References);
