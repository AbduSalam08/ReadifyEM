/* eslint-disable @typescript-eslint/no-var-requires */
// custom components
import StatusPill from "../../webparts/readifyEmMain/components/StatusPill/StatusPill";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import CustomDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomDropDown";
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
//images
const arrowBackBtn = require("../../assets/images/svg/arrowBack.svg");
// styles
import styles from "./ConfigureSections.module.scss";
import ConfigureSectionCard from "../../webparts/readifyEmMain/components/ConfigureSectionCard/ConfigureSectionCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfigureSections = (): JSX.Element => {
  const navigate = useNavigate();

  const [sectionsData, setSectionsData] = useState({
    defaultSections: [
      {
        sectionOrderNo: "1",
        sectionName: "",
        sectionEnabled: false,
        sectionAuthor: "",
        consultants: "",
        sectionAuthorPlaceholder: "Section author",
        consultantPlaceholder: "Consultants",
        personSelectionLimit: 10,
        sectionType: "defaultSection",
      },
    ],
    appendixSections: [
      {
        sectionOrderNo: "1",
        sectionName: "",
        sectionEnabled: false,
        sectionAuthor: "",
        consultants: "",
        sectionAuthorPlaceholder: "Section author",
        consultantPlaceholder: "Consultants",
        personSelectionLimit: 10,
        sectionType: "appendixSection",
      },
    ],
  });

  return (
    <div className={styles.configureSectionsWrapper}>
      <div className={styles.headerTitle}>
        <button
          className={styles.backBtn}
          onClick={() => {
            navigate(-1);
          }}
        >
          <img src={arrowBackBtn} alt={"back to my tasks"} />
        </button>
        <PageTitle text="Standardized Document Developer" />
        <StatusPill roles="Primary Author" size="SM" />
      </div>

      <div className={styles.dndSectionsWrapper}>
        <div className={styles.header}>
          <div className={styles.docTitle}>Risk Management Program</div>
          <div className={styles.docDetails}>
            <span>Created on : 12/03/2024</span>
            <span>Due on : 12/10/2024</span>
          </div>
        </div>

        <div className={styles.filters}>
          <CustomDropDown
            onChange={(value: string) => {
              // console.log("value: ", value);
            }}
            options={["TEMP X", "Sample one"]}
            value={""}
            placeholder="Select existing templates"
            size="MD"
          />
        </div>

        <ConfigureSectionCard
          addNewButtonText="New Section"
          setSections={setSectionsData}
          sectionTitle="Section"
          onNewSection={() => {
            // console.log("new one");
          }}
          objKey="defaultSections"
          sections={sectionsData}
        />

        <ConfigureSectionCard
          addNewButtonText="New Appendix"
          setSections={setSectionsData}
          sectionTitle="Appendix"
          onNewSection={() => {
            // console.log("new one");
          }}
          objKey="appendixSections"
          sections={sectionsData}
        />

        <div className={styles.footer}>
          <DefaultButton
            btnType="lightGreyVariant"
            text={"Cancel"}
            onClick={() => {
              navigate(-1);
            }}
          />
          <DefaultButton btnType="primaryBlue" text={"Save"} />
        </div>
      </div>
    </div>
  );
};

export default ConfigureSections;
