/* eslint-disable @rushstack/no-new-null */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
// components
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import styles from "./Definitions.module.scss";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import Table from "../../webparts/readifyEmMain/components/Table/Table";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";
// import CustomPeoplePicker from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomPeoplePicker";
import { togglePopupVisibility } from "../../utils/togglePopup";
import { initialPopupLoaders } from "../../config/config";
import { IPopupLoaders } from "../../interface/MainInterface";
import AlertPopup from "../../webparts/readifyEmMain/components/common/Popups/AlertPopup/AlertPopup";
import {
  AddDefinition,
  UpdateDefinition,
  DeleteDefinition,
  LoadDefinitionTableData,
  LoadDefinitionData,
  ApproveDefinition,
} from "../../services/Definitions/DefinitionServices";
import { useDispatch, useSelector } from "react-redux";
import CustomTextArea from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomTextArea";
import { validateWebURL } from "../../utils/validations";
// assets
const editIcon: any = require("../../assets/images/svg/normalEdit.svg");
const deleteIcon: any = require("../../assets/images/svg/deleteIcon.svg");
const viewDocBtn: any = require("../../assets/images/svg/viewEye.svg");
const ApproveBtn: any = require("../../assets/images/svg/addIconPurple.svg");

interface IDefinitionDetails {
  ID: number | null;
  definitionName: string;
  IsValid: boolean;
  IsDuplicate: boolean;
  ErrorMsg: string;
  definitionDescription: string;
  referenceTitle: string;
  referenceAuthorName: string;
  yearOfPublish: string;
  referenceAuthor: any[];
  referenceLink: string;
  isApproved: boolean;
  isLoading: boolean;
}

// local constants
const initialPopupController = [
  {
    open: false,
    popupTitle: "Add New Definition",
    popupWidth: "550px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "Edit Definition",
    popupWidth: "550px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "View Definition",
    popupWidth: "550px",
    popupType: "custom",
    defaultCloseBtn: true,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "Are you sure want to delete this Definition?",
    popupType: "confirmation",
    popupWidth: "460px",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "Are you sure want to approve this Definition?",
    popupType: "confirmation",
    popupWidth: "460px",
    defaultCloseBtn: false,
    popupData: "",
  },
];

const Definitions = (): JSX.Element => {
  // redux dispatcher
  const dispatch = useDispatch();

  // redux selectors
  const AllDefinitionData = useSelector(
    (state: any) => state.DefinitionsData.AllDefinitions
  );

  // initial definitions data
  const initialDefinitionsData = {
    ID: null,
    definitionName: "",
    IsValid: true,
    ErrorMsg: "",
    IsDuplicate: false,
    definitionDescription: "",
    referenceTitle: "",
    referenceAuthorName: "",
    yearOfPublish: "",
    referenceAuthor: [],
    referenceLink: "",
    isApproved: true,
    isLoading: false,
  };

  // main table data
  const [tableData, setTableData] = useState({
    headers: ["Definition Name", "Description"],
    loading: false,
    masterList: [],
    data: [],
  });

  // main state to hable all top filters globally in page
  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
  });

  // popup view and actions controller
  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // popup loaders and messages
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // main sections data which used in forms
  const [definitionsData, setDefinitionsData] = useState<IDefinitionDetails>({
    ID: null,
    definitionName: "",
    IsValid: true,
    ErrorMsg: "",
    IsDuplicate: false,
    definitionDescription: "",
    referenceTitle: "",
    referenceAuthorName: "",
    yearOfPublish: "",
    referenceAuthor: [],
    referenceLink: "",
    isApproved: true,
    isLoading: false,
  });

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  // current popup data from the popupcontroller - used for template update scenerio
  // const currentTemplateData: any = popupController?.filter((popup: any) => {
  //   return popup?.open;
  // });

  // fn for onchange of definition name
  const handleOnChange = (value: string | any, key: string): void => {
    if (key === "referenceAuthor") {
      setDefinitionsData((prev: any) => ({
        ...prev,
        referenceAuthor:
          value.length > 0
            ? [{ Id: value[0]?.id, Email: value[0]?.secondaryText }]
            : [],
      }));
    } else {
      setDefinitionsData((prev: any) => ({
        ...prev,
        [key]: value,
        IsDuplicate: false,
      }));
    }
  };

  // util for validating sections
  const validateSections = (): any => {
    // return true;
    const duplicateCheck = AllDefinitionData.filter((obj: any) => {
      return (
        obj.definitionName.toLowerCase().trim() ===
          definitionsData.definitionName.toLowerCase().trim() &&
        obj.ID !== definitionsData.ID
      );
    });
    if (duplicateCheck.length > 0) {
      setDefinitionsData((prev: any) => ({
        ...prev,
        IsValid: false,
        IsDuplicate: true,
        ErrorMsg: "Definition Name already exists",
      }));
      return false;
    } else {
      if (definitionsData.definitionName === "") {
        setDefinitionsData((prev: any) => ({
          ...prev,
          IsValid: false,
          ErrorMsg: "definitionName",
        }));
        return false;
      } else if (definitionsData.definitionDescription === "") {
        setDefinitionsData((prev: any) => ({
          ...prev,
          IsValid: false,
          ErrorMsg: "definitionDescription",
        }));
      } else if (definitionsData.referenceTitle !== "") {
        if (definitionsData.referenceAuthorName === "") {
          setDefinitionsData((prev: any) => ({
            ...prev,
            IsValid: false,
            ErrorMsg: "referenceAuthorName",
          }));
        } else {
          if (definitionsData.referenceLink !== "") {
            if (!validateWebURL(definitionsData.referenceLink)) {
              setDefinitionsData((prev: any) => ({
                ...prev,
                IsValid: false,
                ErrorMsg: "referenceLink",
              }));
            } else {
              setDefinitionsData((prev: any) => ({
                ...prev,
                IsValid: true,
                ErrorMsg: "",
              }));
              return true;
            }
          } else {
            setDefinitionsData((prev: any) => ({
              ...prev,
              IsValid: true,
              ErrorMsg: "",
            }));
            return true;
          }
        }
        // setDefinitionsData((prev: any) => ({
        //   ...prev,
        //   IsValid: false,
        //   ErrorMsg: "referenceTitle",
        // }));
      } else if (definitionsData.referenceAuthorName !== "") {
        if (definitionsData.referenceTitle === "") {
          setDefinitionsData((prev: any) => ({
            ...prev,
            IsValid: false,
            ErrorMsg: "referenceTitle",
          }));
        } else {
          if (definitionsData.referenceLink !== "") {
            if (!validateWebURL(definitionsData.referenceLink)) {
              setDefinitionsData((prev: any) => ({
                ...prev,
                IsValid: false,
                ErrorMsg: "referenceLink",
              }));
            } else {
              setDefinitionsData((prev: any) => ({
                ...prev,
                IsValid: true,
                ErrorMsg: "",
              }));
              return true;
            }
          } else {
            setDefinitionsData((prev: any) => ({
              ...prev,
              IsValid: true,
              ErrorMsg: "",
            }));
            return true;
          }
        }
        // setDefinitionsData((prev: any) => ({
        //   ...prev,
        //   IsValid: false,
        //   ErrorMsg: "referenceAuthorName",
        // }));
      } else if (definitionsData.referenceLink !== "") {
        if (!validateWebURL(definitionsData.referenceLink)) {
          setDefinitionsData((prev: any) => ({
            ...prev,
            IsValid: false,
            ErrorMsg: "referenceLink",
          }));
        } else {
          setDefinitionsData((prev: any) => ({
            ...prev,
            IsValid: true,
            ErrorMsg: "",
          }));
          return true;
        }
      } else {
        setDefinitionsData((prev: any) => ({
          ...prev,
          IsValid: true,
          ErrorMsg: "",
        }));
        return true;
      }
    }
  };

  // main fn that handles submission of update definition function
  const handleUpdate = (): void => {
    if (validateSections()) {
      // Submit the form
      const popupIndex: number = popupController?.findIndex((e) => e.open);
      togglePopupVisibility(setPopupController, popupIndex, "close");

      UpdateDefinition(definitionsData, setPopupLoaders);
    } else {
      console.log("invalid");
    }
  };

  // main fn that handles submission of delete definition function
  const handleSoftDelete = (): void => {
    togglePopupVisibility(setPopupController, 3, "close");
    DeleteDefinition(definitionsData, setPopupLoaders);
  };

  // main fn that handles submission of delete definition function
  const handleApprove = (): void => {
    togglePopupVisibility(setPopupController, 4, "close");
    ApproveDefinition(definitionsData, setPopupLoaders);
  };

  // main fn that handles submission of create new definition function
  const handleSubmit = (): void => {
    if (validateSections()) {
      // Submit the form
      const popupIndex: number = popupController?.findIndex((e) => e.open);
      togglePopupVisibility(setPopupController, popupIndex, "close");
      AddDefinition(definitionsData, setPopupLoaders);
    } else {
      console.log("invalid");
    }
  };

  // array of obj which contains all popup inputs
  const popupInputs: any[] = [
    [
      <div key={1} className={styles.defWrapper}>
        <div key={2} className={styles.referenceWrapper}>
          <span>Definition</span>
          <CustomInput
            size="MD"
            labelText="Name"
            withLabel
            icon={false}
            value={definitionsData.definitionName}
            // isValid={
            //   definitionsData.definitionName === "" && !definitionsData.IsValid
            //     ? true
            //     : definitionsData.definitionName !== "" &&
            //       definitionsData.IsDuplicate
            //     ? true
            //     : false
            // }
            isValid={
              definitionsData.definitionName === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "definitionName"
                ? true
                : definitionsData.definitionName !== "" &&
                  definitionsData.IsDuplicate
                ? true
                : false
            }
            onChange={(value: any) => {
              handleOnChange(value, "definitionName");
            }}
            placeholder="Enter here"
            // isValid={!definitionsData.IsValid}
            errorMsg={
              definitionsData.definitionName !== "" &&
              definitionsData.IsDuplicate
                ? definitionsData.ErrorMsg
                : "The definition name field is required"
            }
            key={1}
          />
          <CustomTextArea
            size="MD"
            labelText="Description"
            withLabel
            icon={false}
            // mandatory={true}
            textAreaWidth={"67%"}
            value={definitionsData.definitionDescription}
            onChange={(value: any) => {
              handleOnChange(value, "definitionDescription");
            }}
            placeholder="Enter Description"
            // isValid={
            //   definitionsData.definitionDescription === "" &&
            //   !definitionsData.IsValid
            // }
            isValid={
              definitionsData.definitionDescription === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "definitionDescription"
            }
            errorMsg={"The description field is required"}
            key={2}
          />
        </div>
        <div key={3} className={styles.referenceWrapper}>
          <span>References</span>
          <CustomInput
            size="MD"
            labelText="Title"
            withLabel
            icon={false}
            value={definitionsData.referenceTitle}
            onChange={(value: any) => {
              handleOnChange(value, "referenceTitle");
            }}
            inputWrapperClassName={styles.referenceInput}
            placeholder="Enter here"
            isValid={
              definitionsData.referenceTitle === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceTitle"
            }
            errorMsg={"The references title field is required"}
            key={3}
          />
          {/* <CustomPeoplePicker
            size="MD"
            minWidth={"265px"}
            withLabel
            labelText="Author"
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthor");
            }}
            selectedItem={definitionsData?.referenceAuthor[0]?.Email}
            placeholder="Add people"
            isValid={
              definitionsData.referenceAuthor.length === 0 &&
              !definitionsData.IsValid
            }
            errorMsg={"The reference author field is required"}
            key={4}
          /> */}
          <CustomInput
            size="MD"
            labelText="Author"
            withLabel
            icon={false}
            value={definitionsData.referenceAuthorName}
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthorName");
            }}
            placeholder="Enter here"
            isValid={
              definitionsData.referenceAuthorName === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceAuthorName"
            }
            errorMsg={"The reference author field is required"}
            key={4}
          />
          <CustomInput
            size="MD"
            labelText="Year of publish"
            withLabel
            secWidth="100%"
            icon={false}
            // mandatory={true}
            value={definitionsData.yearOfPublish}
            onChange={(value: any) => {
              handleOnChange(value, "yearOfPublish");
            }}
            placeholder="Enter here"
            isValid={
              definitionsData.yearOfPublish === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "yearOfPublish"
            }
            errorMsg={"The Year of publish field is required"}
            key={5}
          />
          <CustomInput
            size="MD"
            labelText="Link"
            withLabel
            icon={false}
            value={definitionsData.referenceLink}
            onChange={(value: any) => {
              handleOnChange(value, "referenceLink");
            }}
            placeholder="Enter here"
            isValid={
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceLink"
            }
            errorMsg={
              validateWebURL(definitionsData.referenceLink) ? "" : "Invalid URL"
            }
            key={6}
          />
        </div>
      </div>,
    ],
    [
      <div key={1} className={styles.defWrapper}>
        <div key={2} className={styles.referenceWrapper}>
          <span>Definition</span>
          <CustomInput
            size="MD"
            labelText="Name"
            withLabel
            icon={false}
            value={definitionsData.definitionName}
            onChange={(value: any) => {
              handleOnChange(value, "definitionName");
            }}
            placeholder="Enter here"
            // isValid={
            //   definitionsData.definitionName === "" && !definitionsData.IsValid
            //     ? true
            //     : definitionsData.definitionName !== "" &&
            //       definitionsData.IsDuplicate
            //     ? true
            //     : false
            // }
            isValid={
              definitionsData.definitionName === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "definitionName"
                ? true
                : definitionsData.definitionName !== "" &&
                  definitionsData.IsDuplicate
                ? true
                : false
            }
            errorMsg={
              definitionsData.definitionName !== "" &&
              definitionsData.IsDuplicate
                ? definitionsData.ErrorMsg
                : "The definition name field is required"
            }
            key={1}
          />
          <CustomTextArea
            size="MD"
            labelText="Description"
            withLabel
            icon={false}
            // mandatory={true}
            textAreaWidth={"67%"}
            value={definitionsData.definitionDescription}
            onChange={(value: any) => {
              handleOnChange(value, "definitionDescription");
            }}
            placeholder="Enter Description"
            // isValid={
            //   definitionsData.definitionDescription === "" &&
            //   !definitionsData.IsValid
            // }
            isValid={
              definitionsData.definitionDescription === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "definitionDescription"
            }
            errorMsg={"The description field is required"}
            key={2}
          />
        </div>
        <div key={3} className={styles.referenceWrapper}>
          <span>References</span>
          <CustomInput
            size="MD"
            labelText="Title"
            withLabel
            icon={false}
            value={definitionsData.referenceTitle}
            onChange={(value: any) => {
              handleOnChange(value, "referenceTitle");
            }}
            placeholder="Enter here"
            isValid={
              definitionsData.referenceTitle === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceTitle"
            }
            errorMsg={"The references title field is required"}
            key={3}
          />
          {/* <CustomPeoplePicker
            size="MD"
            withLabel
            labelText="Author"
            minWidth={"265px"}
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthor");
            }}
            selectedItem={definitionsData?.referenceAuthor[0]?.Email}
            placeholder="Add people"
            isValid={
              definitionsData.referenceAuthor.length === 0 &&
              !definitionsData.IsValid
            }
            errorMsg={"The reference author field is required"}
            key={4}
          /> */}
          <CustomInput
            size="MD"
            labelText="Author"
            withLabel
            icon={false}
            value={definitionsData.referenceAuthorName}
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthorName");
            }}
            placeholder="Enter here"
            isValid={
              definitionsData.referenceAuthorName === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceAuthorName"
            }
            errorMsg={"The reference author field is required"}
            key={4}
          />
          <CustomInput
            size="MD"
            labelText="Year of publish"
            withLabel
            secWidth="100%"
            icon={false}
            // mandatory={true}
            value={definitionsData.yearOfPublish}
            onChange={(value: any) => {
              handleOnChange(value, "yearOfPublish");
            }}
            placeholder="Enter here"
            isValid={
              definitionsData.yearOfPublish === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "yearOfPublish"
            }
            errorMsg={"The Year of publish field is required"}
            key={5}
          />
          <CustomInput
            size="MD"
            labelText="Link"
            withLabel
            icon={false}
            value={definitionsData.referenceLink}
            onChange={(value: any) => {
              handleOnChange(value, "referenceLink");
            }}
            placeholder="Enter here"
            isValid={
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceLink"
            }
            errorMsg={
              validateWebURL(definitionsData.referenceLink) ? "" : "Invalid URL"
            }
            key={6}
          />
        </div>
      </div>,
    ],
    [
      <div key={1} className={styles.defWrapper}>
        <div key={2} className={styles.referenceWrapper}>
          <span>Definition</span>
          <CustomInput
            size="MD"
            labelText="Name"
            withLabel
            icon={false}
            value={definitionsData.definitionName}
            onChange={(value: any) => {
              handleOnChange(value, "definitionName");
            }}
            placeholder="Enter here"
            // isValid={!definitionsData.IsValid}
            // errorMsg={"Template name required"}
            key={1}
            readOnly={true}
            noBorderInput={true}
          />
          <CustomTextArea
            size="MD"
            labelText="Description"
            withLabel
            icon={false}
            textAreaWidth={"67%"}
            value={definitionsData.definitionDescription}
            onChange={(value: any) => {
              handleOnChange(value, "definitionDescription");
            }}
            placeholder="Enter Description"
            // isValid={
            //   definitionsData.definitionDescription === "" &&
            //   !definitionsData.IsValid
            // }
            // isValid={
            //   definitionsData.definitionDescription === "" &&
            //   !definitionsData.IsValid &&
            //   definitionsData.ErrorMsg === "definitionDescription"
            // }
            errorMsg={"The description field is required"}
            key={2}
            // isValid={!definitionsData.IsValid}
            // errorMsg={definitionsData.ErrorMsg}
            readOnly={true}
            noBorderInput={true}
          />
        </div>
        <div key={3} className={styles.referenceWrapper}>
          <span>References</span>
          <CustomInput
            size="MD"
            labelText="Title"
            withLabel
            icon={false}
            value={definitionsData.referenceTitle}
            onChange={(value: any) => {
              handleOnChange(value, "referenceTitle");
            }}
            placeholder="Enter here"
            // isValid={!definitionsData.IsValid}
            // errorMsg={definitionsData.ErrorMsg}
            key={3}
            readOnly={true}
            noBorderInput={true}
          />
          {/* <CustomPeoplePicker
            size="MD"
            withLabel
            labelText="Author"
            minWidth={"265px"}
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthor");
            }}
            selectedItem={definitionsData?.referenceAuthor[0]?.Email}
            placeholder="Add people"
            // isValid={!definitionsData.IsValid}
            // errorMsg={definitionsData.ErrorMsg}
            key={4}
            readOnly={true}
            noBorderInput={true}
          /> */}
          <CustomInput
            size="MD"
            labelText="Author"
            withLabel
            icon={false}
            value={definitionsData.referenceAuthorName}
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthorName");
            }}
            placeholder="Enter here"
            // isValid={!definitionsData.IsValid}
            // errorMsg={definitionsData.ErrorMsg}
            key={4}
            readOnly={true}
            noBorderInput={true}
          />
          <CustomInput
            size="MD"
            labelText="Year of publish"
            withLabel
            secWidth="100%"
            icon={false}
            // mandatory={true}
            value={definitionsData.yearOfPublish}
            onChange={(value: any) => {
              handleOnChange(value, "yearOfPublish");
            }}
            placeholder="Enter here"
            readOnly={true}
            noBorderInput={true}
            key={5}
          />
          <CustomInput
            size="MD"
            labelText="Link"
            withLabel
            icon={false}
            value={definitionsData.referenceLink}
            onChange={(value: any) => {
              handleOnChange(value, "referenceLink");
            }}
            placeholder="Enter here"
            // isValid={!definitionsData.IsValid}
            // errorMsg={definitionsData.ErrorMsg}
            readOnly={true}
            noBorderInput={true}
            key={6}
          />
        </div>
      </div>,
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
          // handleClosePopup(3);
          // const currentTemplateData: any = filterTemplateByName(
          //   sectionsData.templateName,
          //   AllSDDTemplateData
          // );
          // softDeleteTemplate(
          //   currentTemplateData[0]?.ID,
          //   sectionsData.templateName,
          //   setPopupLoaders
          // );
          handleSoftDelete();
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
          handleClosePopup(4);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          // handleClosePopup(3);
          // const currentTemplateData: any = filterTemplateByName(
          //   sectionsData.templateName,
          //   AllSDDTemplateData
          // );
          // softDeleteTemplate(
          //   currentTemplateData[0]?.ID,
          //   sectionsData.templateName,
          //   setPopupLoaders
          // );
          handleApprove();
        },
      },
    ],
  ];

  // main that calls all data
  const setMainData = async (): Promise<any> => {
    await LoadDefinitionTableData(setTableData, dispatch);
  };

  // lifecycle hooks
  useEffect(() => {
    setMainData();
  }, []);

  return (
    <div>
      <div className={styles.pageTitleHeader}>
        <PageTitle text={"Definitions"} />

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
                setDefinitionsData(initialDefinitionsData);
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
          columns={["definitionName", "definitionDescription"]}
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
                    setDefinitionsData(initialDefinitionsData);

                    LoadDefinitionData(
                      item?.ID,
                      definitionsData,
                      setDefinitionsData,
                      item?.definitionName,
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
                    setDefinitionsData(initialDefinitionsData);

                    togglePopupVisibility(
                      setPopupController,
                      1,
                      "open",
                      false,
                      item
                    );

                    LoadDefinitionData(
                      item?.ID,
                      definitionsData,
                      setDefinitionsData,
                      item?.definitionName,
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
                        height: "19px",
                      }}
                    />
                  }
                  key={index}
                  onClick={() => {
                    togglePopupVisibility(
                      setPopupController,
                      3,
                      "open",
                      `Are you sure want to delete "${item?.definitionName}" definition?`
                    );
                    setDefinitionsData((prev) => ({
                      ...prev,
                      ID: item.ID,
                      definitionName: item?.definitionName,
                    }));
                  }}
                />
                {item?.isApproved ? null : (
                  <DefaultButton
                    disableRipple={true}
                    style={{
                      minWidth: "auto",
                    }}
                    btnType={"actionBtn"}
                    text={
                      <img
                        src={ApproveBtn}
                        style={{
                          height: "19px",
                        }}
                      />
                    }
                    key={index}
                    onClick={() => {
                      togglePopupVisibility(
                        setPopupController,
                        4,
                        "open",
                        `Are you sure want to approve "${item?.definitionName}" definition?`
                      );
                      setDefinitionsData((prev) => ({
                        ...prev,
                        ID: item.ID,
                        definitionName: item?.definitionName,
                      }));
                      // ApproveDefinition(definitionsData, setPopupLoaders);
                    }}
                  />
                )}
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
          isLoading={definitionsData?.isLoading}
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

export default memo(Definitions);
