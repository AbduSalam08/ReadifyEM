/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./NewDocument.module.scss";
import StepperForm from "../../webparts/readifyEmMain/components/StepperForm/StepperForm";
import { memo, useState } from "react";
import { emptyCheck } from "../../utils/validations";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CustomTreeDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomTreeDropDown";
import UserList from "../../webparts/readifyEmMain/components/StepperForm/UserList/UserList";
import CustomRadioGroup from "../../webparts/readifyEmMain/components/StepperForm/RadioGroup/RadioGroup";
import CustomPeoplePicker from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomPeoplePicker";

// interfaces
interface StepData {
  step: number;
  question: string;
  completed: boolean;
}

interface Props {
  setScreens: any;
}

interface FormDataItem {
  key: string;
  value: string | any | { id: number; user: string }[];
  isValid: boolean;
  errorMsg: string;
}

const NewDocument = ({ setScreens }: Props): JSX.Element => {
  const [activeStep, setActiveStep] = useState(0);

  const [docUsersList, setDocUsersList] = useState({
    docApprovers: [
      {
        id: 1,
        userData: "",
        isValid: true,
      },
    ],
    docReviewers: [
      {
        id: 1,
        userData: "",
        isValid: true,
      },
    ],
  });

  console.log("docUsersList: ", docUsersList);

  const initialFormData: FormDataItem[] = [
    {
      key: "documentName",
      value: "",
      isValid: true,
      errorMsg: "Document name is required",
    },
    {
      key: "documentPath",
      value: "",
      isValid: true,
      errorMsg: "Document path is required",
    },
    {
      key: "primaryAuthor",
      value: "",
      isValid: true,
      errorMsg: "Primary author is required",
    },
    {
      key: "docReviewers",
      value: docUsersList.docReviewers,
      isValid: true,
      errorMsg: "Document reviewers required",
    },
    {
      key: "docApprovers",
      value: docUsersList.docApprovers,
      isValid: true,
      errorMsg: "Document approvers required",
    },
    {
      key: "docTerm",
      value: "",
      isValid: true,
      errorMsg: "Document review term is required",
    },
  ];

  const [formData, setFormData] = useState<FormDataItem[]>(initialFormData);

  const [stepperFormData, setStepperFormData] = useState<StepData[]>([
    {
      step: 1,
      question: "What is the title of this Document?",
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

  console.log("stepperFormData: ", stepperFormData);

  const handleInputChange: any = (value: any) => {
    setFormData((prev: any) => {
      const updatedFormData = [...prev];
      updatedFormData[activeStep] = {
        ...updatedFormData[activeStep],
        value: value,
        isValid:
          typeof value !== "object"
            ? emptyCheck(value) && value !== null && value !== undefined
            : value &&
              value?.length !== 0 &&
              value !== null &&
              value !== undefined,
      };
      return updatedFormData;
    });
  };

  const inputValue: any = formData[activeStep]?.value;
  const inputError: any = !formData[activeStep]?.isValid;
  const inputErrorMsg: any = formData[activeStep]?.errorMsg;

  const stepperInputs: any = [
    <CustomInput
      key="input1"
      size="XL"
      icon={false}
      onChange={(value: any) => {
        handleInputChange(value);
      }}
      value={inputValue}
      placeholder="Enter here..."
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
      options={[
        {
          key: "0",
          label: "Emergency Management Program Folder",
          data: "Emergency Management Program Folder",
          // icon: "pi pi-inbox",
          children: [
            {
              key: "0-1",
              label: "Policies & Procedures",
              data: "Policies & Procedures Folder",
              // icon: "pi pi-cog",
              // children: [
              //   {
              //     key: "Expenses.doc",
              //     label: "Expenses.doc",
              //     // icon: "pi pi-file",
              //     data: "Expenses Document",
              //   },
              //   {
              //     key: "Resume.doc",
              //     label: "Resume.doc",
              //     // icon: "pi pi-file",
              //     data: "Resume Document",
              //   },
              // ],
            },
          ],
        },
        {
          key: "1",
          label: "Ememrgency Operations Plan",
          data: "Ememrgency Operations Plan Folder",
          // icon: "pi pi-home",
          // children: [
          //   {
          //     key: "Invoices.txt",
          //     label: "Invoices.txt",
          //     // icon: "pi pi-file",
          //     data: "Invoices for this month",
          //   },
          // ],
        },
        {
          key: "2",
          label: "Corporate Business Continuity Plan (BCP) ",
          data: "Corporate Business Continuity Plan (BCP)  Folder",
          // icon: "pi pi-home",
          // children: [
          //   {
          //     key: "Invoices.txt",
          //     label: "Invoices.txt",
          //     // icon: "pi pi-file",
          //     data: "Invoices for this month",
          //   },
          // ],
        },
      ]}
    />,
    <CustomPeoplePicker
      onChange={(value: any) => {
        console.log("value: ", value);
        handleInputChange(value[0]);
      }}
      selectedItem={inputValue}
      placeholder="Tag people here.."
      isValid={inputError}
      errorMsg={inputErrorMsg}
    />,
    <UserList
      setUsers={setDocUsersList}
      setMainFormData={setFormData}
      formData={formData}
      userType="Reviewers"
      users={docUsersList.docReviewers}
      isValid={inputError}
      errorMsg={inputErrorMsg}
    />,
    <UserList
      setUsers={setDocUsersList}
      setMainFormData={setFormData}
      formData={formData}
      userType="Approvers"
      users={docUsersList.docApprovers}
      isValid={inputError}
      errorMsg={inputErrorMsg}
    />,
    <CustomRadioGroup
      selectedValue={(value: any) => {
        setFormData((prev: any) => {
          const updatedFormData = [...prev];
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

  const isCurrentStepValidated = (() => {
    const { value, key } = formData && formData[activeStep];

    if (typeof value === "string") {
      return emptyCheck(value) && value !== null && value !== undefined;
    }

    if (
      (key === "docReviewers" || key === "docApprovers") &&
      Array.isArray(value)
    ) {
      return value.every(
        (e: any) =>
          e.userData &&
          e.userData.length !== 0 &&
          e.userData !== null &&
          e.userData !== undefined
      );
    }

    return (
      value && value?.length !== 0 && value !== null && value !== undefined
    );
  })();

  const handleNext = (): any => {
    const isLastStep = activeStep === stepperFormData.length - 1;

    if (isCurrentStepValidated) {
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
        };
        return updatedFormData;
      });

      if (isLastStep && stepperFormData.some((steps) => steps.completed)) {
        console.log("All stages passed validation. Submitting...");
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      setFormData((prev: any) => {
        const updatedFormData = [...prev];
        updatedFormData[activeStep] = {
          ...updatedFormData[activeStep],
          isValid: false,
        };
        return updatedFormData;
      });
    }
  };

  const handleBack = (): any => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onCancelDoc = (): any => {
    setScreens((prev: any) => ({
      ...prev,
      toc: true,
      NewDocument: false,
    }));
  };

  const saveAndClose = (): any => {
    setScreens((prev: any) => ({
      ...prev,
      toc: true,
      NewDocument: false,
    }));
  };

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
          <DefaultButton
            btnType="secondary"
            text="Save & Close"
            disabled={activeStep === 0}
            onClick={saveAndClose}
          />

          <DefaultButton
            btnType="lightGreyVariant"
            text="Back"
            startIcon={<ChevronLeft />}
            disabled={activeStep === 0}
            onClick={handleBack}
          />

          <DefaultButton
            btnType="primary"
            text={activeStep === stepperFormData.length - 1 ? "Submit" : "Next"}
            onClick={handleNext}
            endIcon={
              activeStep !== stepperFormData.length - 1 ? <ChevronRight /> : ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export default memo(NewDocument);
