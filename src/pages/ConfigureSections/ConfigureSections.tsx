/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// custom components
import StatusPill from "../../webparts/readifyEmMain/components/StatusPill/StatusPill";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
//images
const arrowBackBtn = require("../../assets/images/svg/arrowBack.svg");
import ConfigureSectionCard from "../../webparts/readifyEmMain/components/ConfigureSectionCard/ConfigureSectionCard";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadTableData } from "../../services/SDDTemplates/SDDTemplatesServices";
import { useDispatch, useSelector } from "react-redux";
import {
  AddSections,
  getUniqueSectionsDetails,
  LoadSectionsTemplateData,
  updateSections,
} from "../../services/ConfigureSections/ConfigureSectionsServices";
import ErrorElement from "../../webparts/readifyEmMain/components/common/ErrorElement/ErrorElement";
import { IPopupLoaders } from "../../interface/MainInterface";
import { initialPopupLoaders } from "../../config/config";
import AlertPopup from "../../webparts/readifyEmMain/components/common/Popups/AlertPopup/AlertPopup";
import { defaultTemplates } from "../../constants/DefaultTemplates";
// styles
import styles from "./ConfigureSections.module.scss";
import { removeVersionFromDocName } from "../../utils/formatDocName";
const ConfigureSections = (): JSX.Element => {
  // use navigate for routing purpose
  const navigate = useNavigate();
  // use dispatch for redux triggers
  const dispatch = useDispatch();

  // const AllSDDTemplateData = useSelector(
  //   (state: any) => state.SDDTemplatesData.AllSDDTemplates
  // );

  // const AllSDDTemplateDetails = useSelector(
  //   (state: any) => state.SDDTemplatesData.SDDtemplateDetails
  // );

  const currentTaskData: any = useSelector(
    (state: any) => state.myTasksData?.uniqueTaskData
  );
  console.log("currentTaskData: ", currentTaskData);
  const ConfigurePageDetails: any = useSelector(
    (state: any) => state.SectionConfiguration?.ConfigurePageDetails
  );
  console.log("ConfigurePageDetails: ", ConfigurePageDetails);

  // const AllSectionsDataConfiguration: any = useSelector(
  //   (state: any) => state.SectionConfiguration?.AllSectionsData
  // );

  // console.log("AllSectionsDataConfiguration: ", AllSectionsDataConfiguration);

  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // filter states
  const defaultSectionsData: any = defaultTemplates?.map(
    (item: string, index: number) => {
      return {
        templateSectionID: null,
        sectionOrderNo: String(index + 1),
        sectionName: {
          value: item,
          placeHolder: "Section name",
          isValid: true,
        },
        sectionAuthor: {
          value: [],
          placeHolder: "Section author",
          isValid: true,
        },
        consultants: {
          value: [],
          placeHolder: "Consultants",
          isValid: true,
          personSelectionLimit: 10,
        },
        sectionSelected: false,
        sectionType: "defaultSection",
        removed: false,
        sectionIsValid: true,
        readOnlySection: true,
      };
    }
  );

  // const initialSectionsData: any = {
  //   templateDetails: {
  //     templateID: 0,
  //     templateName: "",
  //   },
  //   defaultSectionsError: {
  //     isValid: true,
  //     errorMsg: "",
  //   },
  //   appendixSectionsError: {
  //     isValid: true,
  //     errorMsg: "",
  //   },
  //   defaultSections: [...defaultSectionsData],
  //   appendixSections: [],
  //   isLoading: false,
  // };

  // state for store section's data
  const [sectionsData, setSectionsData] = useState({
    templateDetails: {
      templateID: 0,
      templateName: "",
    },
    defaultSectionsError: {
      isValid: true,
      errorMsg: "",
    },
    appendixSectionsError: {
      isValid: true,
      errorMsg: "",
    },
    defaultSections: [...defaultSectionsData],
    appendixSections: [],
    isLoading: false,
  });
  console.log("sectionsData: ", sectionsData);

  // main that calls all data
  const setMainData = async () => {
    await LoadTableData(dispatch);
  };

  const getTemplateDetails = async (templateID: number): Promise<any> => {
    await LoadSectionsTemplateData(templateID, setSectionsData, dispatch);
  };
  // validate sections of the sections data on submit
  const validateSections = (sectionsData: any): boolean => {
    let isValid = true;

    // Function to check for duplicates
    const checkDuplicatesForSDD = (sections: any[]): boolean => {
      const sectionNames = sections
        .filter((section) => section.sectionSelected)
        .map((section) => section.sectionName.value.trim());
      const uniqueNames = new Set(sectionNames);
      return sectionNames.length !== uniqueNames.size;
    };

    // Check for duplicates and empty selections
    const hasDuplicatesAppendixSection = checkDuplicatesForSDD(
      sectionsData.appendixSections
    );
    const hasDuplicatesDefaultSection = checkDuplicatesForSDD(
      sectionsData.defaultSections
    );
    const selectedDefaultSections = sectionsData.defaultSections.filter(
      (el: any) => el.sectionSelected
    );

    const validateSection = (section: any): any => {
      const isSectionValid = section.sectionName.value.trim() !== "";
      const isSectionAuthorValid = section.sectionAuthor.value.length > 0;
      const isConsultantsValid = section.consultants.value.length > 0;

      const sectionIsValid =
        isSectionValid && isSectionAuthorValid && isConsultantsValid;

      if (!sectionIsValid) isValid = false;

      return {
        ...section,
        sectionName: { ...section.sectionName, isValid: isSectionValid },
        sectionAuthor: {
          ...section.sectionAuthor,
          isValid: isSectionAuthorValid,
        },
        consultants: { ...section.consultants, isValid: isConsultantsValid },
        sectionIsValid,
      };
    };

    const updatedSectionsData = {
      ...sectionsData,
      appendixSections: sectionsData.appendixSections.map((section: any) =>
        !section.removed && section.sectionSelected
          ? validateSection(section)
          : section
      ),
      defaultSections: sectionsData.defaultSections.map((section: any) =>
        !section.removed && section.sectionSelected
          ? validateSection(section)
          : section
      ),
    };

    // Check and set errors for default sections
    if (hasDuplicatesDefaultSection) {
      isValid = false;
      updatedSectionsData.defaultSectionsError = {
        isValid: false,
        errorMsg: "Duplicate sections found",
      };
    } else if (selectedDefaultSections.length === 0) {
      isValid = false;
      updatedSectionsData.defaultSectionsError = {
        isValid: false,
        errorMsg: "No sections selected",
      };
    }

    // Check and set errors for appendix sections
    if (hasDuplicatesAppendixSection) {
      isValid = false;
      updatedSectionsData.appendixSectionsError = {
        isValid: false,
        errorMsg: "Duplicate sections found",
      };
    }

    setSectionsData(updatedSectionsData);

    return isValid;
  };

  const handleSubmitSection = async (): Promise<any> => {
    if (validateSections(sectionsData)) {
      if (
        ConfigurePageDetails?.pageKey === "update"
        // ||
        // ConfigurePageDetails?.pageKey === "version update"
      ) {
        await updateSections(sectionsData, setPopupLoaders, currentTaskData);
      } else {
        await AddSections(sectionsData, setPopupLoaders, currentTaskData);
      }
    }
  };

  const getAllSectionsData = async (): Promise<any> => {
    await getUniqueSectionsDetails(
      currentTaskData?.documentDetailsId,
      setSectionsData,
      dispatch
    );
  };
  console.log("ConfigurePageDetails: ", ConfigurePageDetails);

  const hasInvalidDefaultSections = sectionsData?.defaultSections?.some(
    (item: any) =>
      !item?.sectionAuthor?.isValid ||
      !item?.consultants?.isValid ||
      !item?.sectionName?.isValid
  );

  const hasInvalidAppendixSections = sectionsData?.appendixSections?.some(
    (item: any) =>
      !item?.sectionAuthor?.isValid ||
      !item?.consultants?.isValid ||
      !item?.sectionName?.isValid
  );

  const hasInvalidSections =
    hasInvalidDefaultSections || hasInvalidAppendixSections;

  // lifecycle hooks
  useEffect(() => {
    if (ConfigurePageDetails?.pageKey === "update") {
      getAllSectionsData();
      setMainData();
    } else {
      setMainData();
      // const templateID = AllSDDTemplateData?.filter(
      //   (templateData: any) =>
      //     templateData?.templateName ===
      //     currentTaskData?.documentTemplateType?.Title
      // );
      setSectionsData((prev: any) => ({
        ...prev,
        templateDetails: {
          templateID: currentTaskData?.documentTemplateType?.ID,
          templateName: currentTaskData?.documentTemplateType?.Title,
        },
      }));
      getTemplateDetails(currentTaskData?.documentTemplateType?.ID);
    }
  }, []);

  useEffect(() => {
    if (
      ConfigurePageDetails?.pageKey === "update" ||
      ConfigurePageDetails?.pageKey === "version update" ||
      currentTaskData?.docVersion !== "1.0"
    ) {
      getAllSectionsData();
      setMainData();
    } else {
      setMainData();
    }
  }, [ConfigurePageDetails]);

  return (
    <>
      {currentTaskData?.length === 0 ? (
        <ErrorElement />
      ) : (
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
            <PageTitle text={"Standardized Document Developer"} />
            <StatusPill roles={currentTaskData?.role} size="SM" />
          </div>

          <div className={styles.dndSectionsWrapper}>
            <div className={styles.header}>
              <div className={styles.docTitle}>
                {removeVersionFromDocName(currentTaskData?.docName) || "-"}
                <div className={styles.versionPill}>
                  v{currentTaskData?.docVersion}
                </div>
              </div>
              <div className={styles.docDetails}>
                <span>
                  Created on : {currentTaskData?.docCreatedDate || "-"}
                </span>
                <span>Due on : {currentTaskData?.taskDueDate || "-"}</span>
              </div>
            </div>

            {/* <div className={styles.filters}>
              {ConfigurePageDetails?.pageKey !== "update" && (
                <CustomDropDown
                  onChange={(value: string) => {
                    const templateID = AllSDDTemplateData?.filter(
                      (templateData: any) =>
                        templateData?.templateName === value
                    );
                    setSectionsData((prev: any) => ({
                      ...prev,
                      templateDetails: {
                        templateID: templateID[0]?.ID,
                        templateName: value,
                      },
                    }));
                    getTemplateDetails(templateID[0]?.ID);
                  }}
                  options={templateOptions}
                  value={sectionsData?.templateDetails?.templateName}
                  placeholder="Select existing templates"
                  size="MD"
                />
              ) }
              {sectionsData.templateDetails.templateName ? (
                <button
                  className={styles.clearFilterBtn}
                  onClick={() => {
                    setSectionsData(initialSectionsData);
                  }}
                >
                  {/* Clear All Filters{" "} */}
            {/* <Close
                    sx={{
                      fontSize: "15px",
                    }}
                  />
                </button>
              ) : null} */}
            {/* </div> */}

            <ConfigureSectionCard
              addNewButtonText="New Section"
              setSections={setSectionsData}
              sectionTitle="Section"
              objKey="defaultSections"
              sections={sectionsData}
            />

            <ConfigureSectionCard
              addNewButtonText="New Appendix"
              setSections={setSectionsData}
              sectionTitle="Appendix"
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
              <div className={styles.flexEnd}>
                <DefaultButton
                  btnType="primaryBlue"
                  text={"Save"}
                  onClick={() => {
                    handleSubmitSection();
                  }}
                />
                {hasInvalidSections && (
                  <p className={styles.errorMsg}>
                    Please fill out all the fields.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders.isLoading}
        onClick={() => {
          setPopupLoaders(initialPopupLoaders);
          navigate(ConfigurePageDetails?.pageKey === "update" ? -2 : -1);
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
      />
    </>
  );
};

export default memo(ConfigureSections);
