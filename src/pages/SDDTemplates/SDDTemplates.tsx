/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import styles from "./SDDTemplates.module.scss";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import Table from "../../webparts/readifyEmMain/components/Table/Table";
import { memo, useEffect, useState } from "react";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";
import SDDSections from "../../webparts/readifyEmMain/components/SDDSections/SDDSections";
import { emptyCheck } from "../../utils/validations";
import { togglePopupVisibility } from "../../utils/togglePopup";
const editIcon: any = require("../../assets/images/svg/normalEdit.svg");
const deleteIcon: any = require("../../assets/images/svg/deleteIcon.svg");
const viewDocBtn: any = require("../../assets/images/svg/viewEye.svg");

// local interfaces
interface ISectionDetails {
  id: number;
  type: string;
  isValid: boolean;
  value: string;
  sectionSelected?: boolean;
}

interface ItableData {
  headers: any[];
  isLoading: false;
  data: ItableDataItem[];
}
interface ItableDataItem {
  id: number;
  templateName: string;
  createdOn: string;
}

// local configs
const SectionDetailsConfig: ISectionDetails = {
  id: 1,
  type: "",
  isValid: true,
  value: "",
};

// constants
const initialPopupController = [
  {
    open: false,
    popupTitle: "Add New Template",
    popupWidth: "520px",
    popupType: "custom",
    defaultCloseBtn: false,
  },
  {
    open: false,
    popupTitle: "Edit Template",
    popupWidth: "520px",
    popupType: "custom",
    defaultCloseBtn: false,
  },
  {
    open: false,
    popupTitle: "View Template",
    popupWidth: "520px",
    popupType: "custom",
    defaultCloseBtn: true,
  },
  {
    open: false,
    popupTitle: "Are you sure want to delete this template?",
    popupType: "confirmation",
    popupWidth: "420px",
    defaultCloseBtn: false,
  },
];

const SDDTemplates = (): JSX.Element => {
  // main table data
  const [tableData, setTableData] = useState<ItableData>({
    headers: [],
    isLoading: false,
    data: [],
  });

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  const defaultSections: ISectionDetails[] = [
    {
      id: 1,
      isValid: true,
      type: "defaultSection",
      value: "Definitions",
      sectionSelected: false,
    },
    {
      id: 2,
      isValid: true,
      type: "defaultSection",
      value: "Supporting Documents",
      sectionSelected: false,
    },
  ];

  const appendixSections: ISectionDetails[] = [SectionDetailsConfig];
  const normalSections: ISectionDetails[] = [SectionDetailsConfig];

  const [sectionsData, setSectionsData] = useState({
    templateName: "",
    templateNameIsValid: true,
    defaultSection: defaultSections,
    appendixSection: appendixSections,
    normalSection: normalSections,
  });

  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
  });

  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  const handleTemplateNameChange = (value: string): void => {
    setSectionsData((prev) => ({
      ...prev,
      templateName: value,
      templateNameIsValid: emptyCheck(value),
    }));
  };

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
        errorMsg={"Template name required"}
        key={1}
      />,
      <SDDSections
        sectionTitle="Default Sections"
        sectionsData={sectionsData.defaultSection}
        objKey={"defaultSection"}
        setSectionsData={setSectionsData}
        errorMsg="Default Section's required."
        key={2}
      />,
      <SDDSections
        sectionTitle="Appendix Sections"
        sectionsData={sectionsData.appendixSection}
        objKey={"appendixSection"}
        setSectionsData={setSectionsData}
        errorMsg="Appendix Section's required."
        key={3}
      />,
      <SDDSections
        sectionTitle="New Sections"
        sectionsData={sectionsData.normalSection}
        objKey={"normalSection"}
        setSectionsData={setSectionsData}
        errorMsg="New Sections required."
        key={4}
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
      />,
      <SDDSections
        sectionTitle="Default Sections"
        sectionsData={sectionsData.defaultSection}
        objKey={"defaultSection"}
        setSectionsData={setSectionsData}
        errorMsg="Default Section's required."
        key={2}
      />,
      <SDDSections
        sectionTitle="Appendix Sections"
        sectionsData={sectionsData.appendixSection}
        objKey={"appendixSection"}
        setSectionsData={setSectionsData}
        errorMsg="Appendix Section's required."
        key={3}
      />,
      <SDDSections
        sectionTitle="New Sections"
        sectionsData={sectionsData.normalSection}
        objKey={"normalSection"}
        setSectionsData={setSectionsData}
        errorMsg="New Sections required."
        key={4}
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
        disabled={true}
      />,
      <SDDSections
        sectionTitle="Default Sections"
        sectionsData={sectionsData.defaultSection}
        objKey={"defaultSection"}
        setSectionsData={setSectionsData}
        errorMsg="Default Section's required."
        key={2}
        viewOnly={true}
      />,
      <SDDSections
        sectionTitle="Appendix Sections"
        sectionsData={sectionsData.appendixSection}
        objKey={"appendixSection"}
        setSectionsData={setSectionsData}
        errorMsg="Appendix Section's required."
        key={3}
        viewOnly={true}
      />,
      <SDDSections
        sectionTitle="New Sections"
        sectionsData={sectionsData.normalSection}
        objKey={"normalSection"}
        setSectionsData={setSectionsData}
        errorMsg="New Sections required."
        key={4}
        viewOnly={true}
      />,
    ],
  ];

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
          handleClosePopup(0);
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
          handleClosePopup(1);
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
        },
      },
    ],
  ];

  useEffect(() => {
    setTableData({
      headers: ["Template Name", "Created On"],
      isLoading: false,
      data: [
        {
          id: 1,
          templateName: "Hello",
          createdOn: "10/10/2020",
        },
        {
          id: 2,
          templateName: "World",
          createdOn: "10/10/2023",
        },
      ],
    });
  }, []);

  return (
    <div className={styles.SDDTWrapper}>
      <div className={styles.pageTitleHeader}>
        <PageTitle text={"Standardized Document Developer Templates"} />

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
          loading={tableData.isLoading}
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
                    togglePopupVisibility(setPopupController, 1, "open");
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
                    togglePopupVisibility(setPopupController, 3, "open");
                  }}
                />
              </>
            );
          }}
          actions={true}
          defaultTable={true}
        />
      </div>

      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
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
