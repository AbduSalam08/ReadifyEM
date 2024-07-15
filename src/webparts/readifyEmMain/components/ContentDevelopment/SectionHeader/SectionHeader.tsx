/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./SectionHeader.module.scss";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import CustomMutiplePeoplePicker from "../../common/CustomInputFields/CustomMutiplePeoplePicker";

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
        <h2>{documentName}</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            <span
              style={{ display: "flex", marginBottom: "7px", color: "#424242" }}
            >
              Section Author (you)
            </span>
            <CustomPeoplePicker
              size="SM"
              selectedItem={sectionAuthor.email}
              onChange={(value: any) => {
                handleOnChangeFunction(value);
              }}
              isValid={true}
              placeholder="Add Reference Author"
              readOnly
              hideErrMsg
              key={1}
            />
          </div>
          <div>
            <span
              style={{ display: "flex", marginBottom: "7px", color: "#424242" }}
            >
              Consultant
            </span>
            <CustomMutiplePeoplePicker
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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
