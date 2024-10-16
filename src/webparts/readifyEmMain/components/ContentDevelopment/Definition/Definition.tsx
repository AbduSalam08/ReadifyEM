/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { memo, useEffect, useRef, useState } from "react";
import styles from "./Definition.module.scss";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Popup from "../../common/Popups/Popup";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import DefaultButton from "../../common/Buttons/DefaultButton";
// import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
const closeBtn = require("../../../../../assets/images/png/close.png");
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import CloseIcon from "@mui/icons-material/Close";

import {
  getAllSectionDefinitions,
  getMasterDefinition,
  submitSectionDefinitions,
  addNewDefinition,
  LoadDefinitionTableData,
  updateSectionDefinition,
} from "../../../../../services/ContentDevelopment/SectionDefinition/SectionDefinitionServices";
import { useNavigate } from "react-router-dom";
import { IPopupLoaders } from "../../../../../interface/MainInterface";
import { initialPopupLoaders, LISTNAMES } from "../../../../../config/config";
import AlertPopup from "../../common/Popups/AlertPopup/AlertPopup";
import { useDispatch, useSelector } from "react-redux";
import ToastMessage from "../../common/Toast/ToastMessage";
import { updateSectionDetails } from "../../../../../services/ContentDevelopment/SupportingDocument/SupportingDocumentServices";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import {
  addChangeRecord,
  addRejectedComment,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { ContentDeveloperStatusLabel } from "../../common/ContentDeveloperStatusLabel/ContentDeveloperStatusLabel";
import {
  getCurrentLoggedPromoter,
  getCurrentPromoter,
  updateSectionDataLocal,
  updateTaskCompletion,
} from "../../../../../utils/contentDevelopementUtils";
import CustomDateInput from "../../common/CustomInputFields/CustomDateInput";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import dayjs from "dayjs";
import { setCDSectionData } from "../../../../../redux/features/ContentDevloperSlice";
import SpServices from "../../../../../services/SPServices/SpServices";
import PreviewSection from "../PreviewSection/PreviewSection";
import { validateWebURL } from "../../../../../utils/validations";
import { compareArraysOfObjects } from "../../../../../utils/CommonUtils";

interface Props {
  documentId: number;
  sectionId: number;
  currentSectionDetails?: any;
  currentDocRole?: any;
  setCheckChanges?: any;
}

interface IDefinitionDetails {
  ID: number | any;
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
  isSectionDefinition: boolean;
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
    popupTitle: "Add New Definition",
    popupWidth: "550px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "",
    popupWidth: "350px",
    popupType: "confirmation",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "",
    popupWidth: "550px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "Are you sure want to mark this section as reviewed?",
    popupWidth: "340px",
    popupType: "confirmation",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "",
    popupWidth: "950px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
  {
    open: false,
    popupTitle: "Update Definition",
    popupWidth: "550px",
    popupType: "custom",
    defaultCloseBtn: false,
    popupData: "",
  },
];

const Definition: React.FC<Props> = ({
  documentId,
  sectionId,
  currentSectionDetails,
  currentDocRole,
  setCheckChanges,
}) => {
  const divRef: any = useRef();

  // redux dispatcher
  const dispatch = useDispatch();

  const navigate = useNavigate();
  // initial definitions data

  // popup loaders and messages
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });
  const pageDetailsState: any = useSelector(
    (state: any) => state?.MainSPContext?.PageDetails
  );
  const AllDefinitionData = useSelector(
    (state: any) => state.DefinitionsData.AllDefinitions
  );
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionData.SectionComments
  );
  const sectionChangeRecord: any = useSelector(
    (state: any) => state.SectionData.sectionChangeRecord
  );

  // Change record state
  const [changeRecordDetails, setChangeRecordDetails] = useState<any>({
    author: sectionChangeRecord.changeRecordAuthor
      ? sectionChangeRecord.changeRecordAuthor
      : currentUserDetails,
    currentDate: dayjs(new Date(sectionChangeRecord.changeRecordModify)).format(
      "DD-MMM-YYYY hh:mm A"
    ),
    lastSubmitDate: "",
    Description: sectionChangeRecord.changeRecordDescription,
    IsValid: false,
    ErrorMsg: "",
  });

  const submitChangeRecord = async (): Promise<any> => {
    if (changeRecordDetails.Description?.trimStart() !== "") {
      await addChangeRecord(
        changeRecordDetails,
        currentSectionDetails?.ID,
        currentDocDetailsData.documentDetailsID,
        handleClosePopup,
        3,
        setToastMessage,
        setChangeRecordDetails,
        currentUserDetails,
        dispatch
      );
      setChangeRecordDetails({
        ...changeRecordDetails,
        IsValid: false,
        ErrorMsg: "",
      });
    } else {
      setChangeRecordDetails({
        ...changeRecordDetails,
        IsValid: true,
        ErrorMsg: "Please enter Description",
      });
    }
  };

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
    isSectionDefinition: true,
    isLoading: false,
  };
  const [sectionDefinitions, setSectionDefinitions] = useState<any[]>([]);
  const [filterDefinitions, setFilterDefinitions] = useState<any>("");
  const [selectedDefinitions, setSelectedDefinitions] = useState<any[]>([]);
  const [masterDefinitions, setMasterDefinitions] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [initialLoader, setInitialLoader] = useState(true);
  const [updateChecker, setUpdateChecker] = useState(true);

  // popup view and actions controller
  const [popupController, setPopupController] = useState(
    initialPopupController
  );

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
    isSectionDefinition: true,
  });

  // toast message

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  const handleOnChange = (value: string | any, key: string): void => {
    setDefinitionsData((prev: any) => ({
      ...prev,
      IsValid: true,
      ErrorMsg: "",
    }));
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
        [key]: value.trimStart(),
        IsDuplicate: false,
      }));
    }
  };

  const validateSections = (): any => {
    // return true;
    const duplicateCheck = AllDefinitionData.filter((obj: any) => {
      return (
        obj.definitionName?.toLowerCase().trim() ===
        definitionsData?.definitionName.toLowerCase().trim()
      );
    });
    if (duplicateCheck.length > 0 && updateChecker) {
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

  const submitRejectedComment = async (): Promise<any> => {
    if (rejectedComments.rejectedComment?.trim() !== "") {
      setRejectedComments({
        ...rejectedComments,
        rejectedComment: "",
        IsValid: false,
        ErrorMsg: "",
      });
      await addRejectedComment(
        rejectedComments.rejectedComment,
        currentDocDetailsData,
        sectionId,
        handleClosePopup,
        setToastMessage,
        setToastMessage,
        currentUserDetails,
        AllSectionsComments,
        AllSectionsDataMain,
        dispatch
      );
      await updateTaskCompletion(
        currentSectionDetails?.sectionName,
        currentSectionDetails?.documentOfId,
        "active"
      );
    } else {
      setRejectedComments({
        ...rejectedComments,
        IsValid: true,
        ErrorMsg: "Please enter comments",
      });
    }
  };

  const addNewSectionDefinition = async (): Promise<any> => {
    if (validateSections()) {
      // Submit the form
      setInitialLoader(true);
      await addNewDefinition(
        definitionsData,
        AllSectionsDataMain,
        documentId,
        sectionId,
        currentSectionDetails.sectionOrder,
        setPopupLoaders,
        setToastMessage,
        setSelectedDefinitions,
        setInitialLoader,
        setPopupController,
        togglePopupVisibility
      );
    }
  };

  const updateSubmitSectionDefinition = async (): Promise<any> => {
    if (validateSections()) {
      // Submit the form
      togglePopupVisibility(setPopupController, 6, "close");
      await updateSectionDefinition(
        definitionsData,
        AllSectionsDataMain,
        documentId,
        sectionId,
        currentSectionDetails.sectionOrder,
        setPopupLoaders,
        setToastMessage,
        setSelectedDefinitions,
        setInitialLoader,
        setPopupController,
        togglePopupVisibility
      );
    }
  };

  const docInReview: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in review";

  const docInApproval: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in approval";

  const promoteSection = async (): Promise<any> => {
    togglePopupVisibility(
      setPopupController,
      2,
      "close",
      "Are you sure want to submit this section?"
    );
    setInitialLoader(true);

    const promoters: any = docInReview
      ? currentDocDetailsData?.reviewers
      : docInApproval
      ? currentDocDetailsData?.approvers
      : [];

    const currentPromoter: any = getCurrentPromoter(promoters);

    const promoterKey: string = currentDocRole?.reviewer
      ? "sectionReviewed"
      : currentDocRole?.approver
      ? "sectionApproved"
      : "";

    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.SectionDetails,
      ID: currentSectionDetails?.ID,
      RequestJSON: {
        [`${promoterKey}`]: true,
        lastReviewedBy: JSON.stringify({
          currentOrder: currentPromoter?.currentOrder,
          currentPromoter: currentPromoter?.currentPromoter?.userData,
          totalPromoters: currentPromoter?.totalPromoters,
        }),
      },
    })
      .then((res: any) => {
        setInitialLoader(false);
        setToastMessage({
          isShow: true,
          severity: "success",
          title: `Section ${
            promoterKey === "sectionApproved" ? "approved" : "reviewed"
          }!`,
          message: `The section has been ${
            promoterKey === "sectionApproved" ? "approved" : "reviewed"
          } successfully.`,
          duration: 3000,
        });

        const updatedSections: any = updateSectionDataLocal(
          AllSectionsDataMain,
          currentSectionDetails?.ID,
          {
            [`${promoterKey}`]: true,
            sectionRework: false,
            lastReviewedBy: {
              currentOrder: currentPromoter?.currentOrder,
              currentPromoter: currentPromoter?.userData,
              totalPromoters: currentPromoter?.totalPromoters,
            },
          }
        );

        dispatch(setCDSectionData([...updatedSections]));
      })
      .catch((err: any) => {
        console.log("Error : ", err);
        setInitialLoader(false);
        setToastMessage({
          isShow: true,
          severity: "warn",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
      });
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
            // mandatory={true}
            secWidth="100%"
            value={definitionsData.definitionName}
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
            secWidth="100%"
            icon={false}
            // mandatory={true}
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
            mandatory={true}
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthor");
            }}
            selectedItem={definitionsData?.referenceAuthor[0]?.Email}
            placeholder="Add people"
            isValid={
              definitionsData.referenceAuthor.length === 0 &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceAuthor"
            }
            errorMsg={"The reference author field is required"}
            key={4}
          /> */}

          <CustomInput
            size="MD"
            labelText="Author"
            withLabel
            secWidth="100%"
            icon={false}
            // mandatory={true}
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
            secWidth="100%"
            icon={false}
            // mandatory={true}
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
              // definitionsData.referenceLink === ""
              //   ? "The references Link field is required"
              validateWebURL(definitionsData.referenceLink) ? "" : "Invalid URL"
            }
            key={6}
          />
        </div>
      </div>,
    ],
    [
      <CustomTextArea
        size="MD"
        labelText="Comments"
        withLabel
        icon={false}
        // mandatory={true}
        textAreaWidth={"100%"}
        topLabel
        value={rejectedComments.rejectedComment}
        onChange={(value: any) => {
          setRejectedComments({
            ...rejectedComments,
            rejectedComment: value,
            IsValid: false,
          });
        }}
        placeholder="Enter comments..."
        isValid={rejectedComments.IsValid}
        errorMsg={rejectedComments.ErrorMsg}
        key={2}
      />,
    ],
    [],
    [
      <div
        style={{ display: "flex", gap: "9px", flexDirection: "column" }}
        key={1}
      >
        <CustomDateInput
          size="MD"
          withLabel
          label="Last change date"
          readOnly
          value={changeRecordDetails.currentDate}
          key={1}
        />
        <CustomPeoplePicker
          size="MD"
          minWidth={"265px"}
          withLabel
          labelText="Author"
          // onChange={(value: any) => {
          //   handleOnChange(value, "referenceAuthor");
          // }}
          selectedItem={changeRecordDetails?.author?.email}
          placeholder="Add people"
          // isValid={
          //   definitionsData.referenceAuthor.length === 0 &&
          //   !definitionsData.IsValid
          // }
          errorMsg={"The reference author field is required"}
          readOnly
          key={2}
        />
        <CustomTextArea
          size="MD"
          labelText="Description"
          withLabel
          topLabel={true}
          icon={false}
          // mandatory={true}
          rows={7}
          textAreaWidth={"100%"}
          // textAreaWidth={"67%"}
          value={changeRecordDetails.Description}
          onChange={(value: any) => {
            setChangeRecordDetails({
              ...changeRecordDetails,
              Description: value,
              IsValid: false,
            });
          }}
          placeholder="Enter Description"
          isValid={changeRecordDetails.IsValid}
          errorMsg={changeRecordDetails.ErrorMsg}
          key={3}
        />
      </div>,
    ],
    [],
    [
      <div key={1}>
        <span
          style={{
            display: "flex",
            paddingBottom: "15px",
            fontSize: "22px",
            fontFamily: "interMedium, sans-serif",
          }}
        >
          {currentSectionDetails.sectionOrder +
            ". " +
            currentSectionDetails.sectionName}
        </span>
        <PreviewSection
          sectionId={sectionId}
          sectionDetails={currentSectionDetails}
        />
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
            // mandatory={true}
            secWidth="100%"
            value={definitionsData.definitionName}
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
            readOnly={!definitionsData.isSectionDefinition}
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
            isValid={
              definitionsData.definitionDescription === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "definitionDescription"
            }
            errorMsg={"The description field is required"}
            readOnly={!definitionsData.isSectionDefinition}
            key={2}
          />
        </div>
        <div key={3} className={styles.referenceWrapper}>
          <span>References</span>
          <CustomInput
            size="MD"
            labelText="Title"
            withLabel
            secWidth="100%"
            icon={false}
            // mandatory={true}
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
            readOnly={!definitionsData.isSectionDefinition}
            key={3}
          />

          {/* <CustomPeoplePicker
            size="MD"
            minWidth={"265px"}
            withLabel
            labelText="Author"
            mandatory={true}
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthor");
            }}
            selectedItem={definitionsData?.referenceAuthor[0]?.Email}
            placeholder="Add people"
            isValid={
              definitionsData.referenceAuthor.length === 0 &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceAuthor"
            }
            errorMsg={"The reference author field is required"}
            key={4}
          /> */}

          <CustomInput
            size="MD"
            labelText="Author"
            withLabel
            secWidth="100%"
            icon={false}
            // mandatory={true}
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
            readOnly={!definitionsData.isSectionDefinition}
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
            readOnly={!definitionsData.isSectionDefinition}
            key={5}
          />
          <CustomInput
            size="MD"
            labelText="Link"
            withLabel
            secWidth="100%"
            icon={false}
            // mandatory={true}
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
              // definitionsData.referenceLink === ""
              //   ? "The references Link field is required"
              validateWebURL(definitionsData.referenceLink) ? "" : "Invalid URL"
            }
            readOnly={!definitionsData.isSectionDefinition}
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
        disabled: initialLoader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          addNewSectionDefinition();
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
        text: "Submit",
        btnType: "primary",
        disabled: initialLoader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await submitRejectedComment();
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
      {
        text: "Submit",
        btnType: "primary",
        disabled: initialLoader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          submitSectionDefinition(true);
          // handleClosePopup(2);
          // await submitRejectedComment();
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
          handleClosePopup(3);
          setChangeRecordDetails({
            ...changeRecordDetails,
            author: sectionChangeRecord.changeRecordAuthor
              ? sectionChangeRecord.changeRecordAuthor
              : currentUserDetails,
            Description: sectionChangeRecord.changeRecordDescription,
            currentDate: dayjs(
              new Date(sectionChangeRecord.changeRecordModify)
            ).format("DD-MMM-YYYY hh:mm A"),
            IsValid: false,
          });
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: initialLoader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await submitChangeRecord();
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
        disabled: initialLoader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(4);
          await promoteSection();
        },
      },
    ],
    [
      {
        text: "Close",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(5);
        },
      },
    ],

    definitionsData.isSectionDefinition
      ? [
          {
            text: "Cancel",
            btnType: "darkGreyVariant",
            disabled: false,
            endIcon: false,
            startIcon: false,
            onClick: () => {
              handleClosePopup(6);
            },
          },
          {
            text: "Update",
            btnType: "primary",
            disabled:
              !definitionsData.isSectionDefinition ||
              currentSectionDetails?.sectionSubmitted
                ? true
                : false,
            endIcon: false,
            startIcon: false,
            onClick: () => {
              updateSubmitSectionDefinition();
            },
          },
        ]
      : [
          {
            text: "Cancel",
            btnType: "darkGreyVariant",
            disabled: false,
            endIcon: false,
            startIcon: false,
            onClick: () => {
              handleClosePopup(6);
            },
          },
        ],
  ];

  const handleSearchOnChange = (value: string): void => {
    setSearchValue(value.trimStart());
    const filterValues = sectionDefinitions?.filter((obj: any) => {
      if (
        obj.definitionName.toLowerCase().includes(value.toLowerCase().trim())
      ) {
        return obj;
      }
    });
    setFilterDefinitions(filterValues);
  };

  const getMainDefinition = async (Data: any): Promise<any> => {
    const tempArray: any = await getMasterDefinition(Data);
    setSectionDefinitions(await tempArray);
    setInitialLoader(false);
  };

  const getAllSecDefinitions = async (): Promise<any> => {
    setInitialLoader(true);
    const tempSelectedDefinitionArray: any = await getAllSectionDefinitions(
      documentId,
      sectionId
    );
    const masterTempSelectedDefinitionArray: any =
      await getAllSectionDefinitions(documentId, sectionId);
    setSelectedDefinitions(await tempSelectedDefinitionArray);
    setMasterDefinitions(await masterTempSelectedDefinitionArray);
    getMainDefinition(tempSelectedDefinitionArray);
  };

  const onSelectDefinition = async (id: number): Promise<void> => {
    const tempArray = filterDefinitions;
    let tempSelectedDocuments = [...selectedDefinitions];
    const index = tempArray.findIndex((obj: any) => obj.ID === id);
    const definitionObject = tempArray[index];
    definitionObject.isSelected = !definitionObject.isSelected;
    tempArray[index] = definitionObject;
    if (definitionObject.isSelected) {
      const isMatch = selectedDefinitions.some(
        (obj: any) => obj.definitionName === definitionObject.definitionName
      );
      if (isMatch) {
        const index = tempSelectedDocuments.findIndex((select: any) => {
          return select.definitionName === definitionObject.definitionName;
        });
        tempSelectedDocuments[index].isDeleted = false;
        setSelectedDefinitions([...tempSelectedDocuments]);

        const objectsEqual = compareArraysOfObjects(masterDefinitions, [
          ...tempSelectedDocuments,
        ]);
        if (await objectsEqual) {
          setCheckChanges(false);
        } else {
          setCheckChanges(true);
        }
      } else {
        setSelectedDefinitions((prev: any) => {
          return [
            {
              ID: definitionObject.ID,
              definitionName: definitionObject.definitionName,
              definitionDescription: definitionObject.definitionDescription,
              referenceAuthorName: definitionObject?.referenceAuthorName,
              yearOfPublish: definitionObject?.yearOfPublish,
              referenceLink: definitionObject.referenceLink,
              referenceTitle: definitionObject.referenceTitle,
              isSelected: false,
              isDeleted: false,
              isNew: false,
              status: true,
            },
            ...prev,
          ];
        });

        const objectsEqual = compareArraysOfObjects(masterDefinitions, [
          {
            ID: definitionObject.ID,
            definitionName: definitionObject.definitionName,
            definitionDescription: definitionObject.definitionDescription,
            referenceAuthorName: definitionObject?.referenceAuthorName,
            yearOfPublish: definitionObject?.yearOfPublish,
            referenceLink: definitionObject.referenceLink,
            referenceTitle: definitionObject.referenceTitle,
            isSelected: false,
            isDeleted: false,
            isNew: false,
            status: true,
          },
          ...selectedDefinitions,
        ]);
        if (await objectsEqual) {
          setCheckChanges(false);
        } else {
          setCheckChanges(true);
        }
      }
    } else {
      const isMatch = selectedDefinitions.some(
        (obj: any) => obj.definitionName === definitionObject.definitionName
      );
      if (isMatch) {
        const index = tempSelectedDocuments.findIndex((select: any) => {
          return select.definitionName === definitionObject.definitionName;
        });
        if (tempSelectedDocuments[index].status) {
          tempSelectedDocuments = tempSelectedDocuments.filter(
            (selectedObj: any) => {
              return (
                selectedObj.definitionName !== definitionObject.definitionName
              );
            }
          );
          setSelectedDefinitions([...tempSelectedDocuments]);
          const objectsEqual = compareArraysOfObjects(masterDefinitions, [
            ...tempSelectedDocuments,
          ]);
          if (await objectsEqual) {
            setCheckChanges(false);
          } else {
            setCheckChanges(true);
          }
        } else {
          tempSelectedDocuments[index].isDeleted = true;
          setSelectedDefinitions([...tempSelectedDocuments]);
          const objectsEqual = compareArraysOfObjects(masterDefinitions, [
            ...tempSelectedDocuments,
          ]);
          if (await objectsEqual) {
            setCheckChanges(false);
          } else {
            setCheckChanges(true);
          }
        }
      }
    }
    setFilterDefinitions([...tempArray]);
  };

  const submitSectionDefinition = async (
    submitCondition: boolean
  ): Promise<any> => {
    setCheckChanges(false);
    togglePopupVisibility(setPopupController, 2, "close", "");
    const tempFilterData = selectedDefinitions.filter((obj) => !obj.isDeleted);
    if (selectedDefinitions.length !== 0 && tempFilterData.length !== 0) {
      if (submitCondition) {
        await updateTaskCompletion(
          currentSectionDetails?.sectionName,
          currentSectionDetails?.documentOfId,
          "completed"
        );

        // getAllSelectedDocuments();
        await updateSectionDetails(
          sectionId,
          AllSectionsDataMain,
          dispatch,
          currentDocDetailsData
        );
      }
      await submitSectionDefinitions(
        [...selectedDefinitions],
        AllSectionsDataMain,
        documentId,
        sectionId,
        currentSectionDetails.sectionOrder,
        setSelectedDefinitions,
        setMasterDefinitions,
        setPopupLoaders,
        setToastMessage,
        setInitialLoader,
        submitCondition
      );
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Invalid submission!",
        message: "Please select/add at least one definition.",
        duration: 3000,
      });
    }
  };

  const removeDefinition = async (index: number): Promise<any> => {
    let tempSelectedDocuments = [...selectedDefinitions];
    // tempSelectedDocuments[index].isDeleted = true;
    const filterSelectionDefinitions = sectionDefinitions.map((obj: any) => {
      if (obj.definitionName === tempSelectedDocuments[index].definitionName) {
        return { ...obj, isDeleted: true, isSelected: false };
      } else {
        return obj;
      }
    });
    if (tempSelectedDocuments[index].status) {
      tempSelectedDocuments = tempSelectedDocuments.filter(
        (obj: any, ind: number) => {
          return ind !== index;
        }
      );
    } else {
      tempSelectedDocuments[index].isDeleted = true;
    }
    setSectionDefinitions([...filterSelectionDefinitions]);
    setSelectedDefinitions([...tempSelectedDocuments]);
    const objectsEqual = compareArraysOfObjects(masterDefinitions, [
      ...tempSelectedDocuments,
    ]);
    if (await objectsEqual) {
      setCheckChanges(false);
    } else {
      setCheckChanges(true);
    }
  };

  const editDefinition = async (index: number): Promise<any> => {
    setUpdateChecker(false);
    setDefinitionsData(selectedDefinitions[index]);
    togglePopupVisibility(
      setPopupController,
      6,
      "open",
      selectedDefinitions[index].isSectionDefinition
        ? "Update Definition"
        : "View Definition"
    );
  };

  const loggerPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  useEffect(() => {
    getAllSecDefinitions();
    LoadDefinitionTableData(dispatch);

    const closeDiv = (e: any): void => {
      if (
        e?.target.className !== "p-inputtext p-component" &&
        e?.target?.id !== "sectionDefinitionUniqueId"
      ) {
        setFilterDefinitions("");
      }
    };
    document.body.addEventListener("click", closeDiv);
    return () => document.body.removeEventListener("click", closeDiv);
  }, []);

  useEffect(() => {
    setChangeRecordDetails({
      ...changeRecordDetails,
      author: sectionChangeRecord.changeRecordAuthor
        ? sectionChangeRecord.changeRecordAuthor
        : currentUserDetails,
      Description: sectionChangeRecord.changeRecordDescription,
      currentDate: dayjs(
        new Date(sectionChangeRecord.changeRecordModify)
      ).format("DD-MMM-YYYY hh:mm A"),
    });
  }, [sectionChangeRecord]);

  return (
    <>
      <div className={"sectionWrapper"}>
        <div className={styles.textPlayGround}>
          <div className={styles.definitionHeaderWrapper}>
            <span>
              {currentSectionDetails?.sectionSubmitted
                ? "Definitions"
                : "Add Definitions"}
            </span>
          </div>
          {!currentSectionDetails?.sectionSubmitted &&
            (currentDocRole?.primaryAuthor ||
              currentDocRole?.sectionAuthor) && (
              <div className={styles.filterMainWrapper}>
                <div className={styles.TopFilters}>
                  <div ref={divRef} className={styles.inputmainSec}>
                    <CustomInput
                      value={searchValue}
                      secWidth="257px"
                      placeholder="Search definitions"
                      onChange={(value: any) => {
                        handleSearchOnChange(value);
                      }}
                      onClickFunction={(value: boolean) => {
                        // handleSearchClick(value);
                        if (value) {
                          setFilterDefinitions([...sectionDefinitions]);
                        }
                      }}
                    />
                    {searchValue !== "" && (
                      <button className={styles.closeBtn}>
                        <img
                          src={closeBtn}
                          alt={"Add Document"}
                          onClick={() => {
                            setFilterDefinitions("");
                            setSearchValue("");
                          }}
                        />
                      </button>
                    )}
                  </div>
                  <DefaultButton
                    disabled={initialLoader}
                    btnType="primary"
                    text={"New"}
                    size="medium"
                    onClick={() => {
                      setUpdateChecker(true);
                      togglePopupVisibility(setPopupController, 0, "open");
                      setDefinitionsData(initialDefinitionsData);
                    }}
                  />
                </div>
                {typeof filterDefinitions !== "string" && (
                  <div className={styles.filterSecWrapper}>
                    {searchValue !== "" && isEmpty(filterDefinitions) && (
                      <div className={styles.noDataFound}>
                        <span>No data found</span>
                      </div>
                    )}
                    {filterDefinitions.map((obj: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={
                            obj.isSelected
                              ? styles.filterDefinitionSecSelected
                              : styles.filterDefinitionSec
                          }
                          onClick={(ev) => {
                            onSelectDefinition(obj.ID);
                            ev.preventDefault();
                          }}
                          id="sectionDefinitionUniqueId"
                        >
                          <div
                            style={{ width: "10%" }}
                            id="sectionDefinitionUniqueId"
                          >
                            <Checkbox
                              id="sectionDefinitionUniqueId"
                              checkedIcon={<RadioButtonCheckedIcon />}
                              icon={<RadioButtonUncheckedIcon />}
                              key={index}
                              checked={obj.isSelected}
                              // onClick={(ev) => {
                              //   onSelectDefinition(obj.ID);
                              //   ev.preventDefault();
                              // }}
                            />
                          </div>
                          <div
                            className={styles.title}
                            style={{ width: "30%" }}
                            // onClick={(ev) => {
                            //   onSelectDefinition(obj.ID);
                            //   ev.preventDefault();
                            // }}
                            id="sectionDefinitionUniqueId"
                          >
                            <span
                              id="sectionDefinitionUniqueId"
                              title={obj.definitionName}
                            >
                              {obj.definitionName}
                            </span>
                          </div>
                          <div
                            className={styles.description}
                            style={{ width: "60%" }}
                            id="sectionDefinitionUniqueId"
                          >
                            <span
                              id="sectionDefinitionUniqueId"
                              title={obj.definitionDescription}
                            >
                              {obj.definitionDescription}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          {!initialLoader ? (
            <div style={{ padding: "10px 0px" }}>
              {!selectedDefinitions.some(
                (obj: any) => obj.isDeleted === false
              ) && (
                <div className={styles.noDataFound}>
                  <span>No Document Definition Data Found</span>
                </div>
              )}
              {selectedDefinitions?.map((obj: any, index: number) => {
                return (
                  !obj.isDeleted && (
                    <div
                      key={index}
                      className={styles.SelectedDefinitionSec}
                      onClick={() => editDefinition(index)}
                    >
                      <div style={{ width: "30%" }}>
                        <span className={styles.definitionTitle}>
                          {obj.definitionName}
                        </span>
                      </div>
                      <div style={{ width: "67%" }}>
                        <span className={styles.definitionDescription}>
                          {obj.definitionDescription}
                        </span>
                      </div>
                      {!currentSectionDetails?.sectionSubmitted &&
                        (currentDocRole?.primaryAuthor ||
                          currentDocRole?.sectionAuthor) && (
                          <button className={styles.closeBtn}>
                            <img
                              src={closeBtn}
                              onClick={(event) => {
                                event.stopPropagation();
                                removeDefinition(index);
                              }}
                            />
                          </button>
                        )}
                    </div>
                  )
                );
              })}
            </div>
          ) : (
            <CircularSpinner />
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            margin: "10px 0px",
            justifyContent: "space-between",
          }}
        >
          {/* <button className={"helpButton"}>Help?</button> */}
          <a
            className={"helpButton"}
            href={
              pageDetailsState.helpLink.startsWith("https://")
                ? encodeURI(pageDetailsState.helpLink)
                : encodeURI("https://" + pageDetailsState.helpLink)
            }
            target="_blank"
            rel="noreferrer"
          >
            Help?
          </a>

          <div
            style={{
              display: "flex",
              gap: "15px",
              // margin: "10px 0px",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {ContentDeveloperStatusLabel(
              currentSectionDetails?.sectionSubmitted,
              currentSectionDetails?.sectionReviewed,
              currentSectionDetails?.sectionApproved,
              currentSectionDetails?.sectionRework,
              currentDocDetailsData,
              currentDocRole,
              loggerPromoter
            )}

            {/* {currentSectionDetails?.sectionSubmitted && (
              <SecondaryTextLabel
                icon={
                  <AccessTimeIcon
                    style={{
                      width: "17px",
                    }}
                  />
                }
                text="yet to be reviewed"
              />
            )} */}

            <DefaultButton
              text={<CloseIcon sx={{ Padding: "0px" }} />}
              btnType="darkGreyVariant"
              onlyIcon={true}
              title="Close"
              onClick={() => {
                setCheckChanges(false);
                navigate(-1);
              }}
            />
            {/* <CloseIcon
              onClick={() => {
                navigate(-1);
              }}
            /> */}
            <DefaultButton
              text="Preview"
              btnType="secondaryBlue"
              onClick={() => {
                togglePopupVisibility(
                  setPopupController,
                  5,
                  "open",
                  "Preview section"
                );
              }}
            />
            {currentDocDetailsData?.version !== "1.0" &&
              !currentDocRole?.reviewer &&
              !currentDocRole?.consultant &&
              !currentDocRole?.approver &&
              !currentSectionDetails?.sectionSubmitted && (
                <DefaultButton
                  text="Change record"
                  btnType="primaryGreen"
                  onClick={() => {
                    togglePopupVisibility(
                      setPopupController,
                      3,
                      "open",
                      "Change record"
                    );
                  }}
                />
              )}

            {(currentDocRole?.primaryAuthor ||
              currentDocRole?.sectionAuthor ||
              currentDocRole?.reviewer ||
              currentDocRole?.approver) && (
              <>
                {currentDocRole?.primaryAuthor
                  ? currentSectionDetails?.sectionSubmitted && (
                      <DefaultButton
                        text="Rework"
                        btnType="secondaryRed"
                        disabled={
                          !["in development", "approved", "in rework"].includes(
                            currentDocDetailsData?.documentStatus?.toLowerCase()
                          )
                        }
                        onClick={() =>
                          togglePopupVisibility(
                            setPopupController,
                            1,
                            "open",
                            "Reason for rejection"
                          )
                        }
                      />
                    )
                  : (currentDocRole?.reviewer || currentDocRole?.approver) && (
                      <>
                        {
                          <DefaultButton
                            text={
                              // currentDocRole?.reviewer
                              //   ? "Review"
                              //   : currentDocRole?.approver && "Approve"
                              "Approve"
                            }
                            disabled={
                              currentSectionDetails?.sectionSubmitted &&
                              !currentSectionDetails?.sectionRework &&
                              ((currentDocRole?.reviewer &&
                                !currentSectionDetails?.sectionReviewed) ||
                                (currentDocRole?.approver &&
                                  !currentSectionDetails?.sectionApproved)) &&
                              loggerPromoter?.status !== "completed"
                                ? false
                                : true
                            }
                            btnType="primary"
                            onClick={() => {
                              togglePopupVisibility(
                                setPopupController,
                                4,
                                "open",
                                `Are you sure want to mark this section as ${
                                  currentDocRole?.reviewer
                                    ? "reviewed"
                                    : currentDocRole?.approver && "approved"
                                }?`
                              );
                            }}
                          />
                        }

                        <DefaultButton
                          text="Rework"
                          btnType="secondaryRed"
                          disabled={
                            loggerPromoter?.status !== "completed"
                              ? false
                              : true
                          }
                          onClick={() =>
                            togglePopupVisibility(
                              setPopupController,
                              1,
                              "open",
                              "Reason for rejection"
                            )
                          }
                        />
                      </>
                    )}

                {!currentSectionDetails?.sectionSubmitted &&
                  (currentDocRole?.sectionAuthor ||
                    currentDocRole?.primaryAuthor) && (
                    <>
                      <DefaultButton
                        text="Save"
                        btnType="lightGreyVariant"
                        onClick={async () => {
                          await submitSectionDefinition(false);
                        }}
                      />
                      <DefaultButton
                        disabled={initialLoader}
                        text="Submit"
                        btnType="primary"
                        onClick={() => {
                          // submitSectionDefinition(true);
                          togglePopupVisibility(
                            setPopupController,
                            2,
                            "open",
                            "Are you sure want to submit this section?"
                          );
                        }}
                      />
                    </>
                  )}
              </>
            )}
          </div>
        </div>
        <ToastMessage
          severity={toastMessage.severity}
          title={toastMessage.title}
          message={toastMessage.message}
          duration={toastMessage.duration}
          isShow={toastMessage.isShow}
          setToastMessage={setToastMessage}
        />
        <AlertPopup
          secondaryText={popupLoaders.secondaryText}
          isLoading={popupLoaders.isLoading}
          onClick={() => {
            setPopupLoaders(initialPopupLoaders);
            // getAllSecDefinitions();
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
            // isLoading={definitionsData?.isLoading}
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
    </>
  );
};

export default memo(Definition);
