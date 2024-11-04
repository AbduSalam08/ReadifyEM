/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../common/Popups/Popup";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import DefaultButton from "../../common/Buttons/DefaultButton";
import { getAllSectionDefinitions } from "../../../../../services/ContentDevelopment/SectionDefinition/SectionDefinitionServices";
import styles from "./References.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { ContentDeveloperStatusLabel } from "../../common/ContentDeveloperStatusLabel/ContentDeveloperStatusLabel";
import {
  getCurrentLoggedPromoter,
  getCurrentPromoter,
  updateSectionDataLocal,
  updateTaskCompletion,
} from "../../../../../utils/contentDevelopementUtils";
const closeBtn = require("../../../../../assets/images/png/close.png");
import CloseIcon from "@mui/icons-material/Close";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import { validateWebURL } from "../../../../../utils/validations";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import {
  addNewReference,
  getSectionRefernces,
  submitSectionReferences,
  UpdateReference,
} from "../../../../../services/ContentDevelopment/SectionReference/SectionReference";
import { IPopupLoaders } from "../../../../../interface/MainInterface";
import { initialPopupLoaders, LISTNAMES } from "../../../../../config/config";
import AlertPopup from "../../common/Popups/AlertPopup/AlertPopup";
import ToastMessage from "../../common/Toast/ToastMessage";
import PreviewSection from "../PreviewSection/PreviewSection";
import { updateSectionDetails } from "../../../../../services/ContentDevelopment/SupportingDocument/SupportingDocumentServices";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
import {
  addChangeRecord,
  addRejectedComment,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import SpServices from "../../../../../services/SPServices/SpServices";
import { setCDSectionData } from "../../../../../redux/features/ContentDevloperSlice";
import CustomDateInput from "../../common/CustomInputFields/CustomDateInput";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import dayjs from "dayjs";
interface Props {
  allSectionsData: any;
  documentId: number;
  sectionId: number;
  currentSectionDetails: any;
  currentDocRole: any;
  setCheckChanges?: any;
}
interface IReferenceDetails {
  ID: number | any;
  IsValid: boolean;
  IsDuplicate: boolean;
  ErrorMsg: string;
  referenceTitle: string;
  referenceAuthorName: string;
  yearOfPublish: string;
  referenceLink: string;
  isSectionReferences: boolean;
  isApproved: boolean;
  isLoading: boolean;
}

const References: React.FC<Props> = ({
  allSectionsData,
  documentId,
  sectionId,
  currentSectionDetails,
  currentDocRole,
  setCheckChanges,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialReferenceData = {
    ID: null,
    IsValid: true,
    ErrorMsg: "",
    IsDuplicate: false,
    referenceTitle: "",
    referenceAuthorName: "",
    yearOfPublish: "",
    referenceLink: "",
    isApproved: true,
    isLoading: false,
    isSectionReferences: true,
  };
  const pageDetailsState: any = useSelector(
    (state: any) => state?.MainSPContext?.PageDetails
  );
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionData.SectionComments
  );

  const sectionChangeRecord: any = useSelector(
    (state: any) => state.SectionData.sectionChangeRecord
  );

  const [loader, setLoader] = useState<boolean>(false);
  const [referencesData, setReferencesData] = useState<IReferenceDetails>({
    ID: null,
    IsValid: true,
    ErrorMsg: "",
    IsDuplicate: false,
    referenceTitle: "",
    referenceAuthorName: "",
    yearOfPublish: "",
    referenceLink: "",
    isApproved: true,
    isLoading: false,
    isSectionReferences: true,
  });
  const [allReferencesData, setAllReferencesData] = useState<any[]>([]);
  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });

  // popup loaders and messages
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // toast message

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

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

  // local constants
  const initialPopupController = [
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
      popupTitle: "",
      popupWidth: "950px",
      popupType: "custom",
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
      popupWidth: "550px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
  ];

  // popup view and actions controller
  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };
  const handleOnChange = (value: string | any, key: string): void => {
    setReferencesData((prev: any) => ({
      ...prev,
      IsValid: true,
      ErrorMsg: "",
    }));
    if (key === "referenceAuthor") {
      setReferencesData((prev: any) => ({
        ...prev,
        referenceAuthor:
          value.length > 0
            ? [{ Id: value[0]?.id, Email: value[0]?.secondaryText }]
            : [],
      }));
    } else {
      setReferencesData((prev: any) => ({
        ...prev,
        [key]: value.trimStart(),
        IsDuplicate: false,
      }));
    }
  };

  const validateSections = (): any => {
    if (referencesData.referenceTitle.trimStart() === "") {
      setReferencesData((prev: any) => ({
        ...prev,
        IsValid: false,
        ErrorMsg: "referenceTitle",
      }));
    } else if (referencesData.referenceAuthorName.trimStart() === "") {
      setReferencesData((prev: any) => ({
        ...prev,
        IsValid: false,
        ErrorMsg: "referenceAuthorName",
      }));
    } else if (referencesData.referenceLink.trimStart() !== "") {
      // setReferencesData((prev: any) => ({
      //   ...prev,
      //   IsValid: false,
      //   ErrorMsg: "referenceLink",
      // }));
      if (!validateWebURL(referencesData.referenceLink.trimStart())) {
        setReferencesData((prev: any) => ({
          ...prev,
          IsValid: false,
          ErrorMsg: "referenceLink",
        }));
      } else {
        setReferencesData((prev: any) => ({
          ...prev,
          IsValid: true,
          ErrorMsg: "",
        }));
        return true;
      }
    } else {
      setReferencesData((prev: any) => ({
        ...prev,
        IsValid: true,
        ErrorMsg: "",
      }));
      return true;
    }
  };

  const addNewSectionReference = async (): Promise<any> => {
    if (validateSections()) {
      // Submit the form
      // setLoader(true);
      await addNewReference(
        referencesData,
        AllSectionsDataMain,
        documentId,
        sectionId,
        setPopupLoaders,
        setToastMessage,
        allReferencesData,
        setAllReferencesData,
        setLoader,
        setPopupController,
        togglePopupVisibility
      );
    }
  };
  const updateSectionReference = async (): Promise<any> => {
    if (validateSections()) {
      // Submit the form
      // setLoader(true);
      await UpdateReference(
        referencesData,
        AllSectionsDataMain,
        documentId,
        sectionId,
        setPopupLoaders,
        setToastMessage,
        allReferencesData,
        setAllReferencesData,
        setLoader,
        setPopupController,
        togglePopupVisibility
      );
    }
  };

  const submitRejectedComment = async (): Promise<any> => {
    if (rejectedComments.rejectedComment?.trim() !== "") {
      handleClosePopup(4);
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
      setRejectedComments({
        ...rejectedComments,
        rejectedComment: "",
        IsValid: false,
        ErrorMsg: "",
      });
    } else {
      setRejectedComments({
        ...rejectedComments,
        IsValid: true,
        ErrorMsg: "Please enter comments",
      });
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
    setLoader(true);

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
        setLoader(false);
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
        setLoader(false);
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

  const submitChangeRecord = async (): Promise<any> => {
    if (changeRecordDetails.Description?.trimStart() !== "") {
      await addChangeRecord(
        changeRecordDetails,
        currentSectionDetails?.ID,
        currentDocDetailsData.documentDetailsID,
        handleClosePopup,
        6,
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

  const popupInputs = [
    [
      <div key={1} className={styles.referenceWrapper}>
        <CustomInput
          size="MD"
          labelText="Title"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.referenceTitle}
          onChange={(value: any) => {
            handleOnChange(value, "referenceTitle");
          }}
          inputWrapperClassName={styles.referenceInput}
          placeholder="Enter here"
          isValid={
            referencesData.referenceTitle === "" &&
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "referenceTitle"
          }
          errorMsg={"The title field is required"}
          key={1}
        />
        <CustomInput
          size="MD"
          labelText="Author"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.referenceAuthorName}
          onChange={(value: any) => {
            handleOnChange(value, "referenceAuthorName");
          }}
          placeholder="Enter here"
          isValid={
            referencesData.referenceAuthorName === "" &&
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "referenceAuthorName"
          }
          errorMsg={"The author field is required"}
          key={2}
        />
        <CustomInput
          size="MD"
          labelText="Year of publish"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.yearOfPublish}
          onChange={(value: any) => {
            handleOnChange(value, "yearOfPublish");
          }}
          placeholder="Enter here"
          isValid={
            referencesData.yearOfPublish === "" &&
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "yearOfPublish"
          }
          errorMsg={"The Year of publish field is required"}
          key={3}
        />
        <CustomInput
          size="MD"
          labelText="Link"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.referenceLink}
          onChange={(value: any) => {
            handleOnChange(value, "referenceLink");
          }}
          placeholder="Enter here"
          isValid={
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "referenceLink"
          }
          errorMsg={
            referencesData.referenceLink === ""
              ? "The Link field is required"
              : validateWebURL(referencesData.referenceLink)
              ? ""
              : "Invalid URL"
          }
          key={4}
        />
      </div>,
    ],
    [
      <div key={2}>
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
      <div key={1} className={styles.referenceWrapper}>
        <CustomInput
          size="MD"
          labelText="Title"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.referenceTitle}
          onChange={(value: any) => {
            handleOnChange(value, "referenceTitle");
          }}
          inputWrapperClassName={styles.referenceInput}
          placeholder="Enter here"
          isValid={
            referencesData.referenceTitle === "" &&
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "referenceTitle"
          }
          errorMsg={"The title field is required"}
          key={1}
        />
        <CustomInput
          size="MD"
          labelText="Author"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.referenceAuthorName}
          onChange={(value: any) => {
            handleOnChange(value, "referenceAuthorName");
          }}
          placeholder="Enter here"
          isValid={
            referencesData.referenceAuthorName === "" &&
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "referenceAuthorName"
          }
          errorMsg={"The author field is required"}
          key={2}
        />
        <CustomInput
          size="MD"
          labelText="Year of publish"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.yearOfPublish}
          onChange={(value: any) => {
            handleOnChange(value, "yearOfPublish");
          }}
          placeholder="Enter here"
          isValid={
            referencesData.yearOfPublish === "" &&
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "yearOfPublish"
          }
          errorMsg={"The Year of publish field is required"}
          key={3}
        />
        <CustomInput
          size="MD"
          labelText="Link"
          withLabel
          secWidth="100%"
          icon={false}
          // mandatory={true}
          value={referencesData.referenceLink}
          onChange={(value: any) => {
            handleOnChange(value, "referenceLink");
          }}
          placeholder="Enter here"
          isValid={
            !referencesData.IsValid &&
            referencesData.ErrorMsg === "referenceLink"
          }
          errorMsg={
            // referencesData.referenceLink === ""
            //   ? "The Link field is required"
            validateWebURL(referencesData.referenceLink) ? "" : "Invalid URL"
          }
          key={4}
        />
      </div>,
    ],
    [],
    [
      <CustomTextArea
        size="MD"
        labelText="Comments"
        withLabel
        icon={false}
        topLabel
        // mandatory={true}
        textAreaWidth={"100%"}
        value={rejectedComments.rejectedComment}
        onChange={(value: any) => {
          if (value.trimStart() !== "") {
            setRejectedComments({
              ...rejectedComments,
              rejectedComment: value,
              IsValid: false,
            });
          } else {
            setRejectedComments({
              ...rejectedComments,
              rejectedComment: "",
              IsValid: false,
            });
          }
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
          setReferencesData(initialReferenceData);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: loader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          addNewSectionReference();
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
          setReferencesData(initialReferenceData);
        },
      },
      {
        text: "Update",
        btnType: "primary",
        disabled:
          loader || currentSectionDetails?.sectionSubmitted ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          updateSectionReference();
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
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: loader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          submitSectionReference(true);
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
          handleClosePopup(4);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: loader,
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
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(5);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: loader,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(5);
          await promoteSection();
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
          handleClosePopup(6);
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
        disabled: loader ? true : false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await submitChangeRecord();
        },
      },
    ],
  ];

  const getReferencesFromDefintions = async () => {
    setLoader(true);
    const sectionReferences = await getSectionRefernces(
      currentSectionDetails?.ID
    );

    const definitionsData = allSectionsData.filter(
      (obj: any) => obj.sectionName.toLowerCase() === "definitions"
    );

    const tempSelectedDefinitionArray = await getAllSectionDefinitions(
      documentId,
      definitionsData[0].ID
    );
    const tempArray = await tempSelectedDefinitionArray.filter(
      (obj: any) =>
        !obj.isDeleted &&
        obj.referenceAuthorName !== "" &&
        obj.referenceTitle !== ""
    );
    setAllReferencesData([...(await tempArray), ...(await sectionReferences)]);
    setLoader(false);

    // await allSectionsData.forEach(async (obj: any) => {
    //   if (obj.sectionName.toLowerCase() === "definitions") {
    //     const tempSelectedDefinitionArray = await getAllSectionDefinitions(
    //       documentId,
    //       obj.ID
    //     );
    //     const tempArray = await tempSelectedDefinitionArray.filter(
    //       (obj: any) =>
    //         !obj.isDeleted &&
    //         obj.referenceAuthorName !== "" &&
    //         obj.referenceTitle !== ""
    //     );
    //     console.log(tempArray, sectionReferences);
    //     setAllReferencesData([
    //       ...(await tempArray),
    //       ...(await sectionReferences),
    //     ]);
    //     setLoader(false);
    //   } else {
    //     setAllReferencesData([...sectionReferences]);
    //   }
    // });
  };
  const loggerPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  const removeReference = (delIndex: number) => {
    setCheckChanges(true);
    setAllReferencesData((prev) =>
      prev.map((item, index) =>
        index === delIndex ? { ...item, isDeleted: true } : item
      )
    );
  };

  const submitSectionReference = async (condition: boolean) => {
    if (allReferencesData.length !== 0) {
      setLoader(true);
      setCheckChanges(false);
      if (condition) {
        handleClosePopup(3);
        await updateTaskCompletion(
          currentSectionDetails?.sectionName,
          currentSectionDetails?.documentOfId,
          "completed"
        );
        await updateSectionDetails(
          sectionId,
          AllSectionsDataMain,
          dispatch,
          currentDocDetailsData
        );
        // setToastMessage({
        //   isShow: true,
        //   severity: "success",
        //   title: "Section submit",
        //   message: "section has been submitted successfully!",
        //   duration: 3000,
        // });
      }
      await submitSectionReferences(
        allReferencesData,
        setAllReferencesData,
        AllSectionsDataMain,
        documentId,
        setLoader,
        setToastMessage,
        condition
      );
    } else {
      handleClosePopup(3);
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Invalid submission!",
        message: "Please select/add at least one definition.",
        duration: 3000,
      });
    }
  };

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

  useEffect(() => {
    getReferencesFromDefintions();
  }, []);

  return (
    <>
      {loader ? (
        <CircularSpinner />
      ) : (
        <div className={"sectionWrapper"}>
          <div className={styles.textPlayGround}>
            <div
              style={{ height: "100%", overflow: "auto", paddingRight: "5px" }}
            >
              <div className={styles.TopFilters}>
                <div className={styles.definitionHeaderWrapper}>
                  <span>
                    {currentSectionDetails?.sectionSubmitted
                      ? "References"
                      : "Add References"}
                  </span>
                </div>
                {!currentSectionDetails?.sectionSubmitted &&
                  (currentDocRole?.primaryAuthor ||
                    currentDocRole?.sectionAuthor) && (
                    <DefaultButton
                      disabled={loader}
                      btnType="primary"
                      text={"New"}
                      size="medium"
                      onClick={() => {
                        setReferencesData(initialReferenceData);
                        togglePopupVisibility(
                          setPopupController,
                          0,
                          "open",
                          "Add new reference"
                        );
                        // setReferencesData(initialreferencesData);
                      }}
                    />
                  )}
              </div>

              {allReferencesData?.map((obj: any, index: number) => {
                return (
                  !obj.isDeleted && (
                    <div
                      key={index}
                      className={styles.selectedReferencesSec}
                      style={{
                        backgroundColor: obj.isNew ? "#593ABB10" : "",
                        cursor: obj.isSectionReferences ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (obj.isSectionReferences) {
                          setReferencesData(obj);
                          togglePopupVisibility(
                            setPopupController,
                            2,
                            "open",
                            "Update reference"
                          );
                        }
                      }}
                    >
                      <div
                        style={{
                          width: "90%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        <p className={styles.referenceTitle}>
                          {obj.referenceAuthorName}.{" "}
                          {obj.yearOfPublish
                            ? "(" + obj.yearOfPublish + "). "
                            : ""}
                          <span>{obj.referenceTitle}.</span>
                        </p>
                        {obj.referenceLink !== "" && (
                          <a
                            href={
                              obj.referenceLink?.startsWith("https://")
                                ? encodeURI(obj.referenceLink)
                                : encodeURI("https://" + obj.referenceLink)
                            }
                            target="_blank"
                            className={styles.referenceLink}
                          >
                            {obj.referenceLink?.startsWith("https://")
                              ? obj.referenceLink
                              : "https://" + obj.referenceLink}
                          </a>
                        )}
                      </div>
                      {!currentSectionDetails?.sectionSubmitted &&
                        obj.isSectionReferences &&
                        (currentDocRole?.primaryAuthor ||
                          currentDocRole?.sectionAuthor) && (
                          <button className={styles.closeBtn}>
                            <img
                              src={closeBtn}
                              alt={"Remove Document"}
                              onClick={(event) => {
                                event.stopPropagation();
                                removeReference(index);
                              }}
                            />
                          </button>
                        )}
                    </div>
                  )
                );
              })}
              {allReferencesData.length === 0 && (
                <div className={styles.noDataFound}>
                  <span>No Data Found</span>
                </div>
              )}
            </div>
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
                  // setCheckChanges(false);
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
                    1,
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
                        6,
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
                            ![
                              "in development",
                              "approved",
                              "in rework",
                            ].includes(
                              currentDocDetailsData?.documentStatus?.toLowerCase()
                            )
                          }
                          onClick={() =>
                            togglePopupVisibility(
                              setPopupController,
                              4,
                              "open",
                              "Reason for rejection"
                            )
                          }
                        />
                      )
                    : (currentDocRole?.reviewer ||
                        currentDocRole?.approver) && (
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
                                  5,
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
                                4,
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
                            await submitSectionReference(false);
                          }}
                        />
                        <DefaultButton
                          disabled={loader}
                          text="Submit"
                          btnType="primary"
                          onClick={() => {
                            // submitSectionDefinition(true);
                            togglePopupVisibility(
                              setPopupController,
                              3,
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
      )}
    </>
  );
};
export default memo(References);
