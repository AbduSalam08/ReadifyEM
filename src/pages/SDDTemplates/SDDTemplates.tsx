/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
// components
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import styles from "./SDDTemplates.module.scss";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import Table from "../../webparts/readifyEmMain/components/Table/Table";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";
import SDDSections from "../../webparts/readifyEmMain/components/SDDSections/SDDSections";
// utils
import { emptyCheck } from "../../utils/validations";
import { togglePopupVisibility } from "../../utils/togglePopup";
import { initialPopupLoaders } from "../../config/config";
import { IPopupLoaders } from "../../interface/MainInterface";
import AlertPopup from "../../webparts/readifyEmMain/components/common/Popups/AlertPopup/AlertPopup";
import {
  AddSDDTemplate,
  LoadTableData,
  LoadSectionsTemplateData,
  softDeleteTemplate,
  UpdateSDDTemplate,
} from "../../services/SDDTemplates/SDDTemplatesServices";
import { defaultTemplates } from "../../constants/DefaultTemplates";
import { useDispatch, useSelector } from "react-redux";
import {
  checkDuplicates,
  filterTemplateByName,
} from "../../utils/SDDTemplatesUtils";
// assets
const editIcon: any = require("../../assets/images/svg/normalEdit.svg");
const deleteIcon: any = require("../../assets/images/svg/deleteIcon.svg");
const viewDocBtn: any = require("../../assets/images/svg/viewEye.svg");

// local interfaces
interface ISectionDetails {
  id: number;
  unqID: number | any;
  type: string;
  isValid: boolean;
  value: string;
  removed?: boolean;
  sectionSelected?: boolean;
}

// local configs
const SectionDetailsConfig: ISectionDetails = {
  id: 1,
  unqID: null,
  type: "",
  isValid: true,
  value: "",
  removed: false,
};

// local constants
const initialPopupController = [
  {
    open: false,
    popupTitle: "Add New Template",
    popupWidth: "520px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "Edit Template",
    popupWidth: "520px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "View Template",
    popupWidth: "520px",
    popupType: "custom",
    defaultCloseBtn: true,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "Are you sure want to delete this template?",
    popupType: "confirmation",
    popupWidth: "420px",
    defaultCloseBtn: false,
    popupData: "",
  },
];

const defaultSections: ISectionDetails[] = defaultTemplates?.map(
  (template: string, index: number) => {
    return {
      id: index + 1,
      unqID: null,
      isValid: true,
      type: "defaultSection",
      value: template,
      sectionSelected: false,
    };
  }
);
const appendixSections: ISectionDetails[] = [SectionDetailsConfig];
const normalSections: ISectionDetails[] = [SectionDetailsConfig];

const initialSectionsData = {
  templateName: "",
  templateNameIsValid: true,
  templateErrorMsg: "",
  defaultSection: defaultSections,
  appendixSection: appendixSections,
  appendixSectionError: {
    isValid: true,
    errorMsg: "",
  },
  normalSection: [...defaultSections],
  normalSectionError: {
    isValid: true,
    errorMsg: "",
  },
  isLoading: false,
};

// TSX component with JSX features
const SDDTemplates = (): JSX.Element => {
  // redux dispatcher
  const dispatch = useDispatch();
  // redux selectors
  const AllSDDTemplateData = useSelector(
    (state: any) => state.SDDTemplatesData.AllSDDTemplates
  );
  // main table data
  const [tableData, setTableData] = useState({
    headers: ["Template Name", "Created At"],
    loading: false,
    data: [],
  });

  // popup view and actions controller
  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // popup loaders and messages
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // main sections data which used in forms
  const [sectionsData, setSectionsData] = useState({
    templateName: "",
    templateNameIsValid: true,
    templateErrorMsg: "",
    defaultSection: defaultSections,
    appendixSection: appendixSections,
    appendixSectionError: {
      isValid: true,
      errorMsg: "",
    },
    normalSection: normalSections,
    normalSectionError: {
      isValid: true,
      errorMsg: "",
    },
    isLoading: false,
  });

  // main state to hable all top filters globally in page
  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
  });

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  // current popup data from the popupcontroller - used for template update scenerio
  const currentTemplateData: any = popupController?.filter((popup: any) => {
    return popup?.open;
  });

  // fn for onchange of template name
  const handleTemplateNameChange = (
    value: string,
    templateType?: string
  ): void => {
    const updateTemplate = templateType?.toLowerCase() === "update";

    // A validation for checking duplicates while creating the template name
    const isDuplicate: boolean = AllSDDTemplateData?.map((data: any) => {
      return (
        data?.templateName?.trim()?.toLowerCase() ===
        value?.trim()?.toLowerCase()
      );
    })?.every((e: boolean) => e === false);

    // A validation for checking duplicates while updating the template name - only works for updating the template name
    const isDuplicateForUpdate: boolean = updateTemplate
      ? AllSDDTemplateData?.filter((e: any) => {
          return (
            e?.templateName?.trim() !==
            currentTemplateData?.[0]?.popupData?.templateName?.trim()
          );
        })
          ?.map((data: any) => {
            return (
              data?.templateName?.trim()?.toLowerCase() ===
              value?.trim()?.toLowerCase()
            );
          })
          ?.every((e: boolean) => e === false)
      : false;

    if (!updateTemplate) {
      setSectionsData((prev: any) => ({
        ...prev,
        templateName: value,
        templateNameIsValid: emptyCheck(value) && isDuplicate,
        templateErrorMsg: !isDuplicate
          ? "Template name already exists."
          : "Template name required.",
      }));
    } else {
      setSectionsData((prev: any) => ({
        ...prev,
        templateName: value,
        templateNameIsValid: emptyCheck(value) && isDuplicateForUpdate,
        templateErrorMsg: !isDuplicateForUpdate
          ? "Template name already exists."
          : "Template name required.",
      }));
    }
  };

  // array of obj which contains all popup inputs
  const popupInputs: any[] = [
    [
      <CustomInput
        size="MD"
        labelText="Template Name"
        withLabel
        icon={false}
        value={sectionsData.templateName}
        onChange={handleTemplateNameChange}
        placeholder="Enter here"
        isValid={!sectionsData.templateNameIsValid}
        errorMsg={sectionsData.templateErrorMsg}
        key={1}
      />,
      <SDDSections
        sectionTitle="Default Sections"
        sectionsData={sectionsData.normalSection}
        AllSectionsData={sectionsData}
        objKey={"normalSection"}
        setSectionsData={setSectionsData}
        errorMsg="Default Section's required."
        key={2}
      />,
      // <SDDSections
      //   sectionTitle="New Sections"
      //   sectionsData={sectionsData.normalSection}
      //   AllSectionsData={sectionsData}
      //   objKey={"normalSection"}
      //   setSectionsData={setSectionsData}
      //   errorMsg="New Sections required."
      //   key={4}
      // />,
      <SDDSections
        sectionTitle="Appendix Sections"
        sectionsData={sectionsData.appendixSection}
        AllSectionsData={sectionsData}
        objKey={"appendixSection"}
        setSectionsData={setSectionsData}
        errorMsg="Appendix Section's required."
        key={3}
      />,
    ],
    [
      <CustomInput
        size="MD"
        labelText="Template Name"
        withLabel
        icon={false}
        value={sectionsData.templateName}
        onChange={(value: any) => {
          handleTemplateNameChange(value, "update");
        }}
        placeholder="Enter here"
        isValid={!sectionsData.templateNameIsValid}
        errorMsg={sectionsData.templateErrorMsg}
        key={1}
      />,
      <SDDSections
        sectionTitle="Default Sections"
        sectionsData={sectionsData.normalSection}
        AllSectionsData={sectionsData}
        objKey={"normalSection"}
        setSectionsData={setSectionsData}
        errorMsg="Default Section's required."
        key={2}
        update={true}
      />,
      // <SDDSections
      //   sectionTitle="New Sections"
      //   sectionsData={sectionsData.normalSection}
      //   AllSectionsData={sectionsData}
      //   objKey={"normalSection"}
      //   setSectionsData={setSectionsData}
      //   errorMsg="New Sections required."
      //   key={4}
      //   update={true}
      // />,
      <SDDSections
        sectionTitle="Appendix Sections"
        sectionsData={sectionsData.appendixSection}
        AllSectionsData={sectionsData}
        objKey={"appendixSection"}
        setSectionsData={setSectionsData}
        errorMsg="Appendix Section's required."
        key={3}
        update={true}
      />,
    ],
    [
      <CustomInput
        size="MD"
        labelText="Template Name"
        withLabel
        icon={false}
        value={sectionsData.templateName}
        onChange={handleTemplateNameChange}
        placeholder="Enter here"
        isValid={!sectionsData.templateNameIsValid}
        errorMsg={"Template name required"}
        key={1}
        readOnly={true}
      />,
      <SDDSections
        sectionTitle="Default Sections"
        sectionsData={sectionsData.normalSection}
        objKey={"normalSection"}
        setSectionsData={setSectionsData}
        errorMsg="Default Section's required."
        key={2}
        viewOnly={true}
      />,
      // <SDDSections
      //   sectionTitle="New Sections"
      //   sectionsData={sectionsData.normalSection}
      //   objKey={"normalSection"}
      //   setSectionsData={setSectionsData}
      //   errorMsg="New Sections required."
      //   key={4}
      //   viewOnly={true}
      // />,
      <SDDSections
        sectionTitle="Appendix Sections"
        sectionsData={sectionsData.appendixSection}
        objKey={"appendixSection"}
        setSectionsData={setSectionsData}
        errorMsg="Appendix Section's required."
        key={3}
        viewOnly={true}
      />,
    ],
  ];

  // array of obj which contains all popup action buttons
  const popupActions: any[] = [
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(0);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleSubmit();
        },
      },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(1);
        },
      },
      {
        text: "Save changes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleUpdate();
        },
      },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(2);
        },
      },
    ],
    [
      {
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(3);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(3);
          const currentTemplateData: any = filterTemplateByName(
            sectionsData.templateName,
            AllSDDTemplateData
          );
          softDeleteTemplate(
            currentTemplateData[0]?.ID,
            sectionsData.templateName,
            setPopupLoaders
          );
        },
      },
    ],
  ];

  // validation for all popup forms
  const validateSections = (updateValidation?: boolean): boolean => {
    let isValid = true;

    const hasDuplicatesAppendixSection = checkDuplicates([
      ...sectionsData.appendixSection,
      ...sectionsData.defaultSection,
    ]);
    const hasDuplicatesNormalSection = checkDuplicates([
      ...sectionsData.normalSection,
    ]);

    // validation for duplicate template name
    const isDuplicate: boolean = AllSDDTemplateData?.map((data: any) => {
      return (
        data?.templateName?.trim()?.toLowerCase() ===
        sectionsData.templateName?.trim()?.toLowerCase()
      );
    })?.every((e: boolean) => e === false);

    // A small validation for checking duplicates while updating the template name
    const isDuplicateForUpdate: boolean = updateValidation
      ? AllSDDTemplateData?.filter((e: any) => {
          return (
            e?.templateName?.trim() !==
            currentTemplateData?.[0]?.popupData?.templateName?.trim()
          );
        })
          ?.map((data: any) => {
            return (
              data?.templateName?.trim()?.toLowerCase() ===
              sectionsData.templateName?.trim()?.toLowerCase()
            );
          })
          ?.every((e: boolean) => e === false)
      : false;

    const updatedSectionsData = {
      ...sectionsData,
      templateName: sectionsData.templateName?.trim(),
      templateNameIsValid: updateValidation
        ? emptyCheck(sectionsData.templateName) && isDuplicateForUpdate
        : emptyCheck(sectionsData.templateName) && isDuplicate,
      templateErrorMsg: updateValidation
        ? !isDuplicateForUpdate
          ? "Template name already exists."
          : "Template name required."
        : !isDuplicate
        ? "Template name already exists."
        : "Template name required.",
      appendixSection: sectionsData.appendixSection.map((section, index) => {
        if (
          sectionsData.appendixSection?.length > 1 &&
          !emptyCheck(section.value)
        ) {
          isValid = false;
          return { ...section, isValid: false };
        }
        return { ...section, isValid: true };
      }),
      normalSection: sectionsData.normalSection.map((section, index) => {
        if (
          sectionsData.normalSection?.length > 1 &&
          !emptyCheck(section.value)
        ) {
          isValid = false;
          return { ...section, isValid: false };
        }
        return { ...section, isValid: true };
      }),
    };

    // empty check for template name
    if (
      !updateValidation &&
      (!emptyCheck(sectionsData.templateName) || !isDuplicate)
    ) {
      isValid = false;
      updatedSectionsData.templateNameIsValid = false;
    } else if (
      updateValidation &&
      (!emptyCheck(sectionsData.templateName) || !isDuplicateForUpdate)
    ) {
      isValid = false;
      updatedSectionsData.templateNameIsValid = false;
    }

    // Check for duplicates in sections
    if (hasDuplicatesAppendixSection || hasDuplicatesNormalSection) {
      isValid = false;
      if (hasDuplicatesAppendixSection) {
        updatedSectionsData.appendixSectionError = {
          isValid: false,
          errorMsg: "Duplicate sections found",
        };
      } else if (hasDuplicatesNormalSection) {
        updatedSectionsData.normalSectionError = {
          isValid: false,
          errorMsg: "Duplicate sections found",
        };
      }
    }

    setSectionsData(updatedSectionsData);

    // return validation is failed (false) or passed (true).
    return isValid;
  };

  // main fn that handles submission of create new template form
  const handleSubmit = (): void => {
    if (validateSections()) {
      // Submit the form
      const popupIndex: number = popupController?.findIndex((e) => e.open);
      togglePopupVisibility(setPopupController, popupIndex, "close");
      AddSDDTemplate(sectionsData, setPopupLoaders);
    }
  };

  // main fn that handles submission of update template form
  const handleUpdate = (): void => {
    if (validateSections(true)) {
      // Submit the form
      const popupIndex: number = popupController?.findIndex((e) => e.open);
      togglePopupVisibility(setPopupController, popupIndex, "close");

      const currentTemplateName: any = popupController[popupIndex]?.popupData;

      const currentTemplateData: any = filterTemplateByName(
        currentTemplateName?.templateName,
        AllSDDTemplateData
      );

      UpdateSDDTemplate(currentTemplateData[0], sectionsData, setPopupLoaders);
    }
  };

  // main that calls all data
  const setMainData = async (): Promise<any> => {
    await LoadTableData(dispatch, setTableData);
  };

  // lifecycle hooks
  useEffect(() => {
    setMainData();
  }, []);

  return (
    <div className={styles.SDDTWrapper}>
      <div className={styles.pageTitleHeader}>
        <PageTitle text={"Templates"} />

        {/* filters section */}
        <div className={styles.filters}>
          <CustomInput
            value={filterOptions.searchTerm}
            onChange={(value: string) => {
              setFilterOptions((prev) => ({
                ...prev,
                searchTerm: value,
              }));
            }}
            disabled={false}
            icon
            placeholder="Search"
          />

          <div className={styles.rhs}>
            <DefaultButton
              btnType="primary"
              text={"Create New"}
              size="medium"
              onClick={() => {
                togglePopupVisibility(setPopupController, 0, "open");
                setSectionsData(initialSectionsData);
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <Table
          data={tableData.data}
          headers={tableData.headers}
          filters={filterOptions}
          loading={tableData.loading}
          loadData={setMainData}
          columns={["templateName", "createdDate"]}
          renderActions={(item: any, index: number) => {
            return (
              <>
                <DefaultButton
                  disableRipple={true}
                  style={{
                    minWidth: "auto",
                  }}
                  btnType={"actionBtn"}
                  text={
                    <img
                      src={viewDocBtn}
                      style={{
                        minWidth: "auto",
                        height: "24px",
                      }}
                    />
                  }
                  key={index}
                  onClick={() => {
                    togglePopupVisibility(setPopupController, 2, "open");
                    setSectionsData(initialSectionsData);

                    LoadSectionsTemplateData(
                      item?.ID,
                      sectionsData,
                      setSectionsData,
                      item?.templateName,
                      false,
                      dispatch
                    );
                  }}
                />
                <DefaultButton
                  disableRipple={true}
                  style={{
                    minWidth: "auto",
                  }}
                  btnType={"actionBtn"}
                  text={<img src={editIcon} />}
                  key={index}
                  onClick={() => {
                    setSectionsData(initialSectionsData);

                    togglePopupVisibility(
                      setPopupController,
                      1,
                      "open",
                      false,
                      item
                    );

                    LoadSectionsTemplateData(
                      item?.ID,
                      sectionsData,
                      setSectionsData,
                      item?.templateName,
                      true,
                      dispatch
                    );
                  }}
                />
                <DefaultButton
                  disableRipple={true}
                  style={{
                    minWidth: "auto",
                  }}
                  btnType={"actionBtn"}
                  text={
                    <img
                      src={deleteIcon}
                      style={{
                        height: "20px",
                      }}
                    />
                  }
                  key={index}
                  onClick={() => {
                    togglePopupVisibility(
                      setPopupController,
                      3,
                      "open",
                      `Are you sure want to delete "${item?.templateName}" template?`
                    );
                    setSectionsData((prev) => ({
                      ...prev,
                      templateName: item?.templateName,
                    }));
                  }}
                />
              </>
            );
          }}
          actions={true}
          defaultTable={true}
        />
      </div>

      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders.isLoading}
        onClick={() => {
          setPopupLoaders(initialPopupLoaders);
          setMainData();
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
      />

      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          isLoading={sectionsData?.isLoading}
          PopupType={popupData.popupType}
          onHide={() =>
            togglePopupVisibility(setPopupController, index, "close")
          }
          popupTitle={
            popupData.popupType !== "confimation" && popupData.popupTitle
          }
          popupActions={popupActions[index]}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={popupData.defaultCloseBtn || false}
          confirmationTitle={
            popupData.popupType !== "custom" ? popupData.popupTitle : ""
          }
        />
      ))}
    </div>
  );
};

export default memo(SDDTemplates);
