/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Sections.tsx
import { InputSwitch } from "primereact/inputswitch";
import styles from "./ConfigureSectionCard.module.scss";
import CustomPeoplePicker from "../common/CustomInputFields/CustomPeoplePicker";
import DefaultButton from "../common/Buttons/DefaultButton";
import CustomInput from "../common/CustomInputFields/CustomInput";
import { OrderList } from "primereact/orderlist";

interface SectionsProps {
  sectionTitle: string;
  addNewButtonText: string;
  sections: any;
  setSections: any;
  onNewSection: any;
  objKey?: string | any;
}
const ConfigureSectionCard: React.FC<SectionsProps> = ({
  sectionTitle,
  addNewButtonText,
  sections,
  objKey,
  onNewSection,
  setSections,
}) => {
  const handleOnChange = (index: number, field: string, value: any): void => {
    setSections((prevState: any) => {
      const updatedSections = [...prevState[objKey]];
      updatedSections[index][field] = value;
      return { ...prevState, [objKey]: updatedSections };
    });
  };

  const handleAddSection = (type: string) => {
    const newSection = {
      sectionOrderNo: String(sections[objKey]?.length + 1),
      sectionName: "",
      sectionEnabled: false,
      sectionAuthor: "",
      consultants: "",
      sectionAuthorPlaceholder: "Section author",
      consultantPlaceholder: "Consultants",
      personSelectionLimit: 10,
      sectionType: type,
    };

    setSections((prevState: any) => {
      const updatedSections = [...prevState[objKey], newSection];
      return { ...prevState, [objKey]: updatedSections };
    });
  };

  const SectionRow = (section: any) => {
    const sectionName = section?.sectionName;
    const sectionEnabled = section?.sectionEnabled;
    const sectionAuthorPlaceholder = "Section author";
    const consultantPlaceholder = "Consultants";
    const personSelectionLimit = 10;
    // const consultants = section?.consultants;
    // const sectionAuthor = section?.sectionAuthor;
    const sectionType = section?.sectionType;

    const sectionInputPlaceHolder: string =
      sectionType === "defaultSection" ? "Section Name" : "Appendix Name";

    const currentItemIndex: number = sections[objKey]?.findIndex(
      (item: any) => section?.sectionOrderNo === item?.sectionOrderNo
    );

    return (
      <div
        className={`${
          !sectionEnabled ? styles.sectionRow : styles.sectionRowActive
        }`}
      >
        <div className={styles.dragHandle}>
          <span />
          <span />
        </div>
        <span className={styles.sectionName}>
          <CustomInput
            value={sectionName}
            onChange={(value: string) => {
              handleOnChange(currentItemIndex, "sectionName", value);
            }}
            inputWrapperClassName={styles.sectionInputWrapper}
            inputClassName={styles.sectionInput}
            // disabled={tasksData.data.length === 0 || tasksData.loading}
            placeholder={sectionInputPlaceHolder}
          />
        </span>
        <div className={styles.enableSectionSwitch}>
          <InputSwitch
            checked={sectionEnabled}
            className="sectionToggler"
            onChange={(e) => {
              handleOnChange(currentItemIndex, "sectionEnabled", e?.value);
            }}
          />
        </div>
        <div className={styles.sectionAuthor}>
          <CustomPeoplePicker
            errorMsg=""
            isValid={false}
            onChange={(value: any) => {
              handleOnChange(currentItemIndex, "sectionAuthor", value);
            }}
            minWidth={"100%"}
            size="SM"
            placeholder={sectionAuthorPlaceholder}
          />
        </div>
        <div className={styles.consultant}>
          <CustomPeoplePicker
            errorMsg=""
            isValid={false}
            onChange={(value: any) => {
              handleOnChange(currentItemIndex, "consultants", value);
            }}
            minWidth={"100%"}
            size="SM"
            placeholder={consultantPlaceholder}
            personSelectionLimit={personSelectionLimit}
          />
        </div>
      </div>
    );
  };

  // const handleDeleteSection = (type: string, index: number): void => {
  //   setSections((prevState: any) => {
  //     const updatedSections = [...prevState[type]];
  //     updatedSections[index].sectionEnabled = false; // Disable the section

  //     return { ...prevState, [type]: updatedSections };
  //   });
  // };

  return (
    <div className={styles.sectionsWrapper}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>{sectionTitle}</div>
        <DefaultButton
          btnType="secondaryBlue"
          text={addNewButtonText}
          onClick={() => {
            const sectionType: string =
              objKey === "defaultSections"
                ? "defaultSection"
                : "appendixSection";
            handleAddSection(sectionType);
          }}
          style={{
            width: "150px",
          }}
        />
      </div>
      <div className={styles.sections}>
        <OrderList
          className="sectionRowDropList"
          key={objKey}
          value={sections[objKey]}
          dataKey={`item`}
          // onChange={(e) => console.log("e: ", e)}
          itemTemplate={(item: any) => SectionRow(item)}
          // header="Default Sections"
          dragdrop
        />
      </div>
    </div>
  );
};

export default ConfigureSectionCard;
