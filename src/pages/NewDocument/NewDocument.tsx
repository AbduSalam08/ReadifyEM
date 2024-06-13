/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// components
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import StepperForm from "../../webparts/readifyEmMain/components/StepperForm/StepperForm";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CustomTreeDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomTreeDropDown";
import UserList from "../../webparts/readifyEmMain/components/StepperForm/UserList/UserList";
import CustomRadioGroup from "../../webparts/readifyEmMain/components/StepperForm/RadioGroup/RadioGroup";
import CustomPeoplePicker from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomPeoplePicker";
import {
  IFormDataItem,
  IPopupLoaders,
  IStepData,
} from "../../interface/MainInterface";
import AlertPopup from "../../webparts/readifyEmMain/components/common/Popups/AlertPopup/AlertPopup";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";
import * as dayjs from "dayjs";
// services
import {
  AddNewDocument,
  GetDocumentDetails,
  UpdateDocument,
  filterDataByURL,
  validateAndFindDate,
} from "../../services/NewDocument/NewDocumentServices";
import { getAllFilesList } from "../../services/EMManual/EMMServices";
// utils
import { initialPopupLoaders } from "../../config/config";
import { emptyCheck, trimStartEnd } from "../../utils/validations";
// styles
import styles from "./NewDocument.module.scss";
// interfaces

interface Props {
  setScreens: any;
  screens?: any;
  setMainData?: any;
}

const NewDocument = ({
  setScreens,
  setMainData,
  screens,
}: Props): JSX.Element => {
  const DocumentPathOptions = useSelector(
    (state: any) => state.EMMTableOfContents.foldersData
  );
  const EMMTOCAdminData = useSelector(
    (state: any) => state.EMMTableOfContents.adminData
  );

  const [activeStep, setActiveStep] = useState(0);

  const [masterList, setMasterList] = useState({
    All: [],
    folders: [],
    files: [],
  });

  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  const [confimationPopup, setConfimationPopup] = useState({
    visibility: false,
    title: "Are you sure want to save this as draft?",
  });

  const [docUsersList, setDocUsersList] = useState({
    approvers: [
      {
        id: 1,
        userData: "",
        isValid: true,
      },
    ],
    reviewers: [
      {
        id: 1,
        userData: "",
        isValid: true,
      },
    ],
  });

  const initialFormData: IFormDataItem[] = [
    {
      key: "Title",
      value: "",
      isValid: true,
      errorMsg: "Document name required",
    },
    {
      key: "documentPath",
      value: "",
      isValid: true,
      errorMsg: "Please specify the path",
    },
    {
      key: "primaryAuthorId",
      value: "",
      isValid: true,
      errorMsg: "Please select the primary Author",
    },
    {
      key: "reviewers",
      value: docUsersList.reviewers,
      isValid: true,
      errorMsg: "Please select the reviewers",
    },
    {
      key: "approvers",
      value: docUsersList.approvers,
      isValid: true,
      errorMsg: "Please select the approvers",
    },
    {
      key: "reviewRange",
      value: "",
      isValid: true,
      errorMsg: "Please specify the term",
    },
    {
      key: "status",
      value: "Not Started",
    },
    {
      key: "documentVersion",
      value: "1",
    },
    {
      key: "isDraft",
      value: false,
    },
    {
      key: "nextReviewDate",
      value: "",
    },
    {
      key: "createdDate",
      value: dayjs().format("DD/MM/YYYY"),
    },
    {
      key: "sequenceNo",
      value: "",
    },
  ];

  const [formData, setFormData] = useState<IFormDataItem[]>(initialFormData);

  const [stepperFormData, setStepperFormData] = useState<IStepData[]>([
    {
      step: 1,
      question: "What is the title of this document?",
      completed: false,
    },
    {
      step: 2,
      question: "Where do you want to file this document?",
      completed: false,
    },
    {
      step: 3,
      question: "Who is the primary author of this document?",
      completed: false,
    },
    {
      step: 4,
      question:
        "Who will need to review this document (list in order of review process)?",
      completed: false,
    },
    {
      step: 5,
      question:
        "Who will need to approve this document (list in order of approval process)?",
      completed: false,
    },
    {
      step: 6,
      question: "How often will this document be reviewed?",
      completed: false,
    },
  ]);

  const filterRecursiveByURLVal: any = filterDataByURL(
    formData[1].value,
    masterList.All
  );
  // A condition for validating if the current page is edit document or Add document.
  const isEditDocument = screens.pageTitle
    .toLowerCase()
    .includes("edit document");

  // the folder URL which comes form the screens props
  const splittedPath: any = screens.editDocumentData?.url;

  // splitting the folder path for saving and editting the path if only its editted
  const folderPathShallowCopy: string = isEditDocument ? splittedPath : "";

  // confirmation buttons to render it on the bottom of the forms.
  const confirmationButtons: any[] = [
    {
      text: "No",
      btnType: "darkGreyVariant",
      disabled: false,
      endIcon: false,
      startIcon: false,
      onClick: () => {
        setConfimationPopup((prev) => ({
          ...prev,
          visibility: false,
        }));
      },
    },
    {
      text: "Yes",
      btnType: "primary",
      disabled: false,
      endIcon: false,
      startIcon: false,
      onClick: () => {
        saveAndClose();
      },
    },
  ];

  // handling input change for all inputs in stepper forms
  const handleInputChange: any = (value: any) => {
    setFormData((prev: any) => {
      const updatedFormData = [...prev];
      const currentStep = updatedFormData[activeStep];
      let isValid = false;
      let duplicate = false;

      if (currentStep.key === "Title") {
        isValid = emptyCheck(value) && value !== null && value !== undefined;
        duplicate = !masterList.files.some((el: any) => {
          return (
            trimStartEnd(el.label?.split(".pdf")[0])?.toLowerCase() ===
            trimStartEnd(value)?.toLowerCase()
          );
        });
      } else {
        isValid =
          typeof value !== "object"
            ? emptyCheck(value) && value !== null && value !== undefined
            : value &&
              value.length !== 0 &&
              value !== null &&
              value !== undefined;
      }

      updatedFormData[activeStep] = {
        ...currentStep,
        value: value,
        isValid:
          currentStep.key === "Title" && !isEditDocument
            ? duplicate && isValid
            : isValid,
        errorMsg:
          currentStep.key === "Title"
            ? !isValid
              ? "Document name required"
              : !duplicate && "Document name already exists."
            : currentStep.errorMsg,
      };

      return updatedFormData;
    });
  };

  // input values to store values in it
  const inputValue: any = formData[activeStep]?.value;
  const inputError: any = !formData[activeStep]?.isValid;
  const inputErrorMsg: any = formData[activeStep]?.errorMsg;

  // steps input object
  const stepperInputs: any = [
    <CustomInput
      key="input1"
      size="XL"
      icon={false}
      onChange={(value: any) => {
        handleInputChange(value);
      }}
      value={inputValue}
      placeholder="Enter here"
      isValid={inputError}
      errorMsg={inputErrorMsg}
    />,
    <CustomTreeDropDown
      key="dropdown"
      size="XL"
      onChange={(value: any) => {
        handleInputChange(value);
      }}
      placeholder="Select"
      value={inputValue}
      isValid={inputError}
      errorMsg={inputErrorMsg}
      options={DocumentPathOptions}
    />,
    <CustomPeoplePicker
      onChange={(value: any) => {
        handleInputChange(value);
      }}
      selectedItem={inputValue?.secondaryText || inputValue?.[0]?.EMail}
      placeholder="Add people"
      isValid={inputError}
      errorMsg={inputErrorMsg}
    />,
    <UserList
      setUsers={setDocUsersList}
      setMainFormData={setFormData}
      formData={formData}
      userType="Reviewers"
      users={
        formData[activeStep].key === "reviewers" && inputValue && isEditDocument
          ? inputValue
          : docUsersList.reviewers
      }
      isValid={inputError}
      errorMsg={inputErrorMsg}
    />,
    <UserList
      setUsers={setDocUsersList}
      setMainFormData={setFormData}
      formData={formData}
      userType="Approvers"
      users={
        formData[activeStep].key === "approvers" && inputValue && isEditDocument
          ? inputValue
          : docUsersList.approvers
      }
      isValid={inputError}
      errorMsg={inputErrorMsg}
    />,
    <CustomRadioGroup
      selectedValue={inputValue}
      onChange={(value: any) => {
        setFormData((prev: any) => {
          const updatedFormData = [...prev];

          const nextReviewDate: number = updatedFormData.findIndex(
            (item: any) => item.key === "nextReviewDate"
          );

          if (nextReviewDate !== -1) {
            updatedFormData[nextReviewDate] = {
              ...updatedFormData[nextReviewDate],
              value: validateAndFindDate(value),
            };
          }

          updatedFormData[activeStep] = {
            ...updatedFormData[activeStep],
            value: value,
          };
          return updatedFormData;
        });
      }}
      isValid={inputError}
      errorMsg={inputErrorMsg}
      radioOptions={[
        {
          value: "Every year",
          label: "Every year",
        },
        {
          value: "Every two year",
          label: "Every two year",
        },
        {
          value: "Every three year",
          label: "Every three year",
        },
      ]}
    />,
  ];

  // IIFE  UTIL fn for validating the step inputs
  const isCurrentStepValidated = (() => {
    if (!formData || typeof activeStep !== "number" || !formData[activeStep]) {
      return false;
    }

    const { value, key } = formData[activeStep];

    if (typeof value === "string") {
      return emptyCheck(value) && value !== null && value !== undefined;
    }

    if ((key === "reviewers" || key === "approvers") && Array.isArray(value)) {
      // Check for duplicates in userData
      const userDataSet = new Set();
      const hasDuplicates = value.some((e: any) => {
        if (e.userData) {
          const userDataString = JSON.stringify(e.userData);
          const isDuplicate = userDataSet.has(userDataString);
          userDataSet.add(userDataString);
          return isDuplicate;
        }
        return false;
      });

      if (hasDuplicates) {
        return "duplicate";
      }

      return value.every(
        (e: any) =>
          e.userData &&
          e.userData.length !== 0 &&
          e.userData !== null &&
          e.userData !== undefined
      );
    }

    return value && value.length !== 0 && value !== null && value !== undefined;
  })();

  // filtering selected path items files to add the sequence no
  const currentPathItems: any =
    filterRecursiveByURLVal[0]?.items?.filter(
      (el: any) => el.type === "file"
    ) || 0;

  const currentPathItemsCount: any = currentPathItems?.length + 1;

  // function for validation in next and submit
  const handleNext = (): any => {
    // Adding sequence number to formdata once if the document path is updated.
    if (!isEditDocument) {
      setFormData((prev: any) => {
        const updatedFormData = [...prev];

        // Check if the key is "sequenceNo" before updating
        if (updatedFormData[activeStep].key?.toLowerCase() === "documentpath") {
          updatedFormData[updatedFormData.length - 1] = {
            ...updatedFormData[updatedFormData.length - 1],
            value: String(currentPathItemsCount),
          };
        }

        return updatedFormData;
      });
    }

    // Manual validation logic for the current step, specifically for "Title"
    const validateTitle = (): any => {
      if (
        !formData ||
        typeof activeStep !== "number" ||
        !formData[activeStep]
      ) {
        return false;
      }

      const { value, key } = formData[activeStep];

      if (key === "Title") {
        const isValid =
          emptyCheck(value) && value !== null && value !== undefined;

        const isDuplicate = masterList.files.some((el: any) => {
          return (
            trimStartEnd(el.label?.split(".pdf")[0])?.toLowerCase() ===
            trimStartEnd(value)?.toLowerCase()
          );
        });

        if (isDuplicate) {
          return "duplicate";
        }

        return isValid;
      }

      // Return true for other steps as this function is only for Title validation
      return true;
    };

    const currentStepValidation =
      formData[activeStep].key === "Title" && !isEditDocument
        ? validateTitle()
        : isCurrentStepValidated;

    const isLastStep = activeStep === stepperFormData.length - 1;

    if (currentStepValidation && currentStepValidation !== "duplicate") {
      setStepperFormData((prev) => {
        const updatedFormData = [...prev];
        updatedFormData[activeStep] = {
          ...updatedFormData[activeStep],
          completed: true,
        };
        return updatedFormData;
      });

      setFormData((prev: any) => {
        const updatedFormData = [...prev];
        updatedFormData[activeStep] = {
          ...updatedFormData[activeStep],
          isValid: true,
          // errorMsg: "",
        };
        return updatedFormData;
      });

      if (isLastStep && stepperFormData.some((steps) => steps.completed)) {
        if (isEditDocument) {
          UpdateDocument(
            formData,
            screens.editDocumentData.fileID,
            setPopupLoaders,
            screens.editDocumentData.ID,
            false,
            folderPathShallowCopy === formData[1].value
              ? false
              : folderPathShallowCopy
          );
        } else {
          AddNewDocument(formData, setPopupLoaders);
        }
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (currentStepValidation === "duplicate") {
      setStepperFormData((prev) => {
        const updatedFormData = [...prev];
        updatedFormData[activeStep] = {
          ...updatedFormData[activeStep],
          completed: false,
        };
        return updatedFormData;
      });

      setFormData((prev: any) => {
        const updatedFormData = [...prev];
        updatedFormData[activeStep] = {
          ...updatedFormData[activeStep],
          isValid: false,
          errorMsg:
            updatedFormData[activeStep].key === "reviewers" ||
            updatedFormData[activeStep].key === "approvers"
              ? "User has been already selected"
              : updatedFormData[activeStep].key === "Title"
              ? "Document name already exists."
              : updatedFormData[activeStep].errorMsg,
        };
        return updatedFormData;
      });
    } else {
      setFormData((prev: any) => {
        const updatedFormData = [...prev];
        updatedFormData[activeStep] = {
          ...updatedFormData[activeStep],
          isValid: false,
          errorMsg:
            updatedFormData[activeStep].key === "reviewers" ||
            updatedFormData[activeStep].key === "approvers"
              ? `Document ${updatedFormData[activeStep].key} required`
              : updatedFormData[activeStep].key === "Title"
              ? "Document name required."
              : updatedFormData[activeStep].errorMsg,
        };
        return updatedFormData;
      });
    }
  };

  // function for handling previous move
  const handleBack = (): any => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // function for closing the page
  const onCancelDoc = (): any => {
    setScreens((prev: any) => ({
      ...prev,
      toc: true,
      NewDocument: false,
      pageTitle: "EM Manual - Table Of Contents",
    }));
  };

  // function for handling Draft Save
  const saveAndClose = (): any => {
    setFormData((prev: any) => {
      const updatedFormData = [...prev];

      // Find the index of the object with the key 'isDraft'
      const index = updatedFormData.findIndex(
        (item: any) => item.key === "isDraft"
      );

      if (index !== -1) {
        // Update the value of the object at the found index
        updatedFormData[index] = {
          ...updatedFormData[index],
          value: true,
        };
      }
      // calling the add fn with updated data
      isEditDocument
        ? UpdateDocument(
            updatedFormData,
            screens.editDocumentData.fileID,
            setPopupLoaders,
            screens.editDocumentData.ID,
            true,
            folderPathShallowCopy === formData[1].value
              ? false
              : folderPathShallowCopy
          )
        : AddNewDocument(updatedFormData, setPopupLoaders, true);
      return updatedFormData;
    });
  };

  // lifecycle hooks
  useEffect(() => {
    const AllFiles: any = getAllFilesList(EMMTOCAdminData);
    setMasterList((prev) => ({
      ...prev,
      All: EMMTOCAdminData,
      folders: DocumentPathOptions,
      files: AllFiles,
    }));
  }, [formData]);

  useEffect(() => {
    if (isEditDocument) {
      GetDocumentDetails(
        screens.editDocumentData.ID,
        setFormData,
        formData,
        setPopupLoaders
      );
    }
  }, [screens.pageTitle]);

  return (
    <div className={styles.newDocumentWrapper}>
      <StepperForm
        activeStep={activeStep}
        stepperFormData={stepperFormData}
        stepperInputs={stepperInputs}
      />

      <div className={styles.stepperFormFooter}>
        {/* back, cancel, save & close, next / finish */}
        <DefaultButton
          btnType="darkGreyVariant"
          text="Cancel"
          onClick={onCancelDoc}
        />

        <div className={styles.rhsBtns}>
          {isEditDocument && !screens.editDocumentData.isDraft
            ? ""
            : ((screens.editDocumentData.isDraft && isEditDocument) ||
                !isEditDocument) && (
                <DefaultButton
                  btnType="secondary"
                  text="Save & Close"
                  disabled={activeStep < 2}
                  onClick={() => {
                    setConfimationPopup((prev) => ({
                      ...prev,
                      visibility: true,
                    }));
                  }}
                />
              )}

          <DefaultButton
            btnType="lightGreyVariant"
            text="Back"
            startIcon={<ChevronLeft />}
            disabled={activeStep === 0}
            onClick={handleBack}
          />

          <DefaultButton
            btnType="primary"
            text={
              activeStep === stepperFormData.length - 1 && !isEditDocument
                ? "Submit"
                : activeStep === stepperFormData.length - 1 && isEditDocument
                ? "Save Changes"
                : activeStep === stepperFormData.length - 1 &&
                  screens.editDocumentData?.isDraft
                ? "Save Draft"
                : "Next"
            }
            onClick={handleNext}
            endIcon={
              activeStep !== stepperFormData.length - 1 ? <ChevronRight /> : ""
            }
          />
        </div>
      </div>

      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders.isLoading}
        onClick={() => {
          setMainData();
          setPopupLoaders(initialPopupLoaders);
          setScreens((prev: any) => ({
            ...prev,
            toc: true,
            NewDocument: false,
            pageTitle: "EM Manual - Table Of Contents",
          }));
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
      />

      <Popup
        PopupType="confirmation"
        onHide={() => {
          setConfimationPopup((prev) => ({
            ...prev,
            visibility: false,
          }));
        }}
        popupWidth={"25vw"}
        confirmationTitle={confimationPopup.title}
        visibility={confimationPopup.visibility}
        popupActions={confirmationButtons}
      />
    </div>
  );
};

export default memo(NewDocument);
