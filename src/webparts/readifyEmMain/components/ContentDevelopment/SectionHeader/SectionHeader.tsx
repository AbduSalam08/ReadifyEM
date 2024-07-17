/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./SectionHeader.module.scss";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
// import CustomMutiplePeoplePicker from "../../common/CustomInputFields/CustomMutiplePeoplePicker";

interface Props {
  documentName: string;
  sectionAuthor: any;
  consultants: any[];
}

const SectionHeader: React.FC<Props> = ({
  documentName,
  sectionAuthor,
  consultants,
}) => {
  console.log(sectionAuthor);

  const handleOnChangeFunction = (value: any): any => {
    console.log(value);
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <span className={styles.sectionName}>{documentName}</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className={styles.authors}>
            <span className={styles.label}>Section Author (you)</span>
            <CustomPeoplePicker
              size="SM"
              maxWidth={"200px"}
              minWidth={"200px"}
              noRemoveBtn={true}
              selectedItem={sectionAuthor.email}
              onChange={(value: any) => {
                handleOnChangeFunction(value);
              }}
              isValid={false}
              placeholder="Add Reference Author"
              readOnly
              hideErrMsg
            />
          </div>
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
            />
            {/* <CustomMutiplePeoplePicker
              size="SM"
              personSelectionLimit={5}
              selectedItem={consultants}
              onChange={(value: any) => {
                handleOnChangeFunction(value);
              }}
              isValid={true}
              placeholder="Add Reference Author"
              readOnly
              hideErrMsg
              key={1}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
