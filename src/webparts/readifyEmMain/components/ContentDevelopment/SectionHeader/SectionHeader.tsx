/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./SectionHeader.module.scss";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import { useSelector } from "react-redux";
// import CustomMutiplePeoplePicker from "../../common/CustomInputFields/CustomMutiplePeoplePicker";

interface Props {
  documentName: string;
  sectionAuthor: any;
  PrimaryAuthor?: any;
  isPrimaryAuthor?: boolean;
  consultants: any[];
  activeSectionData: any;
}

const SectionHeader: React.FC<Props> = ({
  documentName,
  sectionAuthor,
  consultants,
  PrimaryAuthor,
  isPrimaryAuthor,
  activeSectionData,
}) => {
  const handleOnChangeFunction = (value: any): any => {
    console.log("value");
  };

  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  return (
    <>
      <div className={styles.headerContainer}>
        <span className={styles.sectionName}>
          {`${
            documentName?.toLowerCase() === "header"
              ? documentName
              : `${activeSectionData?.sectionOrder + ". " + documentName}`
          }`}
          {activeSectionData?.sectionType?.toLowerCase() ===
          "appendix section" ? (
            <span className={styles.appendixPill}>Appendix</span>
          ) : (
            ""
          )}
        </span>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className={styles.authors}>
            <span className={styles.label}>
              {!isPrimaryAuthor
                ? `Section Author ${
                    activeSectionData?.sectionAuthor[0]?.email ===
                    currentUserDetails?.email
                      ? "(you)"
                      : ""
                  }`
                : `Primary Author ${
                    activeSectionData?.sectionAuthor[0]?.email ===
                    currentUserDetails?.email
                      ? "(you)"
                      : ""
                  }`}
            </span>
            <CustomPeoplePicker
              size="SM"
              maxWidth={"200px"}
              minWidth={"200px"}
              noRemoveBtn={true}
              selectedItem={
                !isPrimaryAuthor ? sectionAuthor?.email : PrimaryAuthor?.email
              }
              onChange={(value: any) => {
                handleOnChangeFunction(value);
              }}
              isValid={false}
              placeholder="Add Reference Author"
              readOnly
              hideErrMsg
            />
          </div>
          {!isPrimaryAuthor && (
            <div className={styles.authors}>
              <span className={styles.label}>Consultant</span>
              <CustomPeoplePicker
                size="SM"
                maxWidth={"200px"}
                minWidth={"200px"}
                personSelectionLimit={5}
                selectedItem={consultants}
                onChange={(value: any) => {
                  handleOnChangeFunction(value);
                }}
                isValid={false}
                placeholder="Add Reference Author"
                // readOnly
                hideErrMsg
                multiUsers={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
