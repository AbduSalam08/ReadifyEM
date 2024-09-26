/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useEffect, useState } from "react";
import styles from "./SupportingDocuments.module.scss";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import DefaultButton from "../../common/Buttons/DefaultButton";
// import SpServices from "../../../../../services/SPServices/SpServices";
const closeBtn = require("../../../../../assets/images/png/close.png");
// const checkBtn = require("../../../../../assets/images/png/checkmark.png");

import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import CloseIcon from "@mui/icons-material/Close";

import {
  getAllSupportingDocumentsData,
  // getDocumentDeatils,
  getApprovedDocuments,
  submitSupportingDocuments,
  updateSectionDetails,
} from "../../../../../services/ContentDevelopment/SupportingDocument/SupportingDocumentServices";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../../common/Toast/ToastMessage";
import Popup from "../../common/Popups/Popup";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
import {
  addRejectedComment,
  addChangeRecord,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import { ContentDeveloperStatusLabel } from "../../common/ContentDeveloperStatusLabel/ContentDeveloperStatusLabel";
import {
  getCurrentLoggedPromoter,
  getCurrentPromoter,
  updateSectionDataLocal,
  updateTaskCompletion,
} from "../../../../../utils/contentDevelopementUtils";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import CustomDateInput from "../../common/CustomInputFields/CustomDateInput";
import dayjs from "dayjs";
import { setCDSectionData } from "../../../../../redux/features/ContentDevloperSlice";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";
import PreviewSection from "../PreviewSection/PreviewSection";
import { validateWebURL } from "../../../../../utils/validations";
import { compareArraysOfObjects } from "../../../../../utils/CommonUtils";

interface Props {
  documentId: number;
  sectionId: number;
  currentSectionDetails: any;
  currentDocRole: any;
  setCheckChanges?: any;
}
interface documentDetails {
  ID: number;
  documentName: any;
  documentLink: any;
  isSelected: boolean;
  isNew: boolean;
  status: boolean;
  isDeleted: boolean;
  isValid: boolean;
  emptyField?: string;
}

const SupportingDocuments: React.FC<Props> = ({
  documentId,
  sectionId,
  currentSectionDetails,
  currentDocRole,
  setCheckChanges,
}) => {
  const initialPopupController = [
    {
      open: false,
      popupTitle: "Are you sure want to submit this section?",
      popupWidth: "340px",
      popupType: "confirmation",
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
    {
      open: false,
      popupTitle: "",
      popupWidth: "950px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
  ];
  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const pageDetailsState: any = useSelector(
    (state: any) => state?.MainSPContext?.PageDetails
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

  // const AllSectionsComments: any = useSelector(
  //   (state: any) => state.SectionCommentsData.SectionComments
  // );
  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionData.SectionComments
  );
  const sectionChangeRecord: any = useSelector(
    (state: any) => state.SectionData.sectionChangeRecord
  );
  const [popupController, setPopupController] = useState(
    initialPopupController
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

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
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

  const popupInputs: any[] = [
    [],
    [
      <CustomTextArea
        size="MD"
        labelText="Comments"
        withLabel
        topLabel
        icon={false}
        // mandatory={true}
        textAreaWidth={"100%"}
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
          mandatory={true}
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
          sectionId={currentSectionDetails?.ID}
          sectionDetails={currentSectionDetails}
        />
      </div>,
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
        onClick: async () => {
          // handleClosePopup(2);
          await submitSupDocuments(true);
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
        disabled: false,
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
          handleClosePopup(2);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(2);
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
        disabled: false,
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
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(4);
        },
      },
    ],
  ];

  // initial definitions data
  const [allDocumentsLink, setAllDocumentsLink] = useState<any[]>([]);
  const [filterDocuments, setFilterDocuments] = useState<any>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedDocuments, setSelectedDocuments] = useState<documentDetails[]>(
    []
  );
  const [masterSupportingDoc, setMasterSupportingDoc] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });
  console.log(selectedDocuments);

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

  const handleSearchOnChange = (value: string): any => {
    setSearchValue(value.trimStart());
    const filterValues = allDocumentsLink?.filter((obj: any) => {
      if (obj.FileRef.toLowerCase().includes(value.toLowerCase().trim())) {
        return obj;
      }
    });
    setFilterDocuments(filterValues);
  };

  const getApprovedDocumentsLinks = async (data: any) => {
    const approvedDocuments: any = await getApprovedDocuments(data);
    setAllDocumentsLink(await approvedDocuments);
    setLoader(false);
  };

  // const getMainDocumentDeatails = async (Data: any[]) => {
  //   const tempDocumentsDetails: any = await getDocumentDeatils(Data);
  //   getApprovedDocumentsLinks(await tempDocumentsDetails);
  //   setLoader(false);
  // };

  const getAllSelectedDocuments = async (): Promise<any> => {
    setLoader(true);
    const tempSelectedDocumentsArray: any = await getAllSupportingDocumentsData(
      sectionId,
      documentId
    );
    const splitArray = [...tempSelectedDocumentsArray];
    const sortedArray = tempSelectedDocumentsArray.sort(
      (a: any, b: any) => b.ID - a.ID
    );
    const tempSortedArray = splitArray.sort((a: any, b: any) => b.ID - a.ID);
    setSelectedDocuments(sortedArray);
    setMasterSupportingDoc(tempSortedArray);
    getApprovedDocumentsLinks([...sortedArray]);
  };

  const onSelectDocument = async (id: number): Promise<void> => {
    const tempArray = [...filterDocuments];
    let tempSelectedDocuments = [...selectedDocuments];
    const index = tempArray.findIndex((obj: any) => obj.ID === id);
    const documentObject = tempArray[index];
    documentObject.isSelected = !documentObject.isSelected;
    tempArray[index] = documentObject;
    if (documentObject.isSelected) {
      const isMatch = selectedDocuments.some(
        (obj: any) => obj.documentName === documentObject.documentName
      );
      if (isMatch) {
        const index = tempSelectedDocuments.findIndex((select: any) => {
          return select.documentName === documentObject.documentName;
        });
        tempSelectedDocuments[index].isDeleted = false;
        setSelectedDocuments([...tempSelectedDocuments]);
        const objectsEqual = compareArraysOfObjects(masterSupportingDoc, [
          ...tempSelectedDocuments,
        ]);
        if (await objectsEqual) {
          setCheckChanges(false);
        } else {
          setCheckChanges(true);
        }
      } else {
        setSelectedDocuments((prev: any) => {
          return [
            {
              ID: selectedDocuments.length + 1,
              documentName: documentObject.documentName,
              documentLink: documentObject.FileRef,
              isSelected: false,
              isDeleted: false,
              isNew: false,
              status: true,
            },
            ...prev,
          ];
        });
        const objectsEqual = compareArraysOfObjects(masterSupportingDoc, [
          [
            {
              ID: selectedDocuments.length + 1,
              documentName: documentObject.documentName,
              documentLink: documentObject.FileRef,
              isSelected: false,
              isDeleted: false,
              isNew: false,
              status: true,
            },
            ...selectedDocuments,
          ],
        ]);
        if (await objectsEqual) {
          setCheckChanges(false);
        } else {
          setCheckChanges(true);
        }
      }
    } else {
      const isMatch = selectedDocuments.some(
        (obj: any) => obj.documentName === documentObject.documentName
      );
      if (isMatch) {
        const index = tempSelectedDocuments.findIndex((select: any) => {
          return select.documentName === documentObject.documentName;
        });
        if (tempSelectedDocuments[index].status) {
          tempSelectedDocuments = tempSelectedDocuments.filter(
            (selectedObj: any) => {
              return selectedObj.documentName !== documentObject.documentName;
            }
          );
          setSelectedDocuments([...tempSelectedDocuments]);
          const objectsEqual = compareArraysOfObjects(masterSupportingDoc, [
            ...tempSelectedDocuments,
          ]);
          if (await objectsEqual) {
            setCheckChanges(false);
          } else {
            setCheckChanges(true);
          }
        } else {
          tempSelectedDocuments[index].isDeleted = true;
          setSelectedDocuments([...tempSelectedDocuments]);
          const objectsEqual = compareArraysOfObjects(masterSupportingDoc, [
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
    setFilterDocuments([...tempArray]);
  };

  const AddNewDocument = async (): Promise<any> => {
    const tempArray = selectedDocuments;
    const checkCondition = selectedDocuments.some((obj: any) => obj.isNew);
    if (!checkCondition) {
      tempArray.unshift({
        ID: selectedDocuments.length + 1,
        documentName: "",
        documentLink: "",
        isSelected: false,
        isNew: true,
        status: true,
        isDeleted: false,
        isValid: false,
        emptyField: "",
      });
      setSelectedDocuments([...tempArray]);
      const objectsEqual = compareArraysOfObjects(masterSupportingDoc, [
        ...tempArray,
      ]);
      if (await objectsEqual) {
        setCheckChanges(false);
      } else {
        setCheckChanges(true);
      }
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Add supporting link",
        message: "Please add supporting link before submit",
        duration: 3000,
      });
    }
  };

  const validation = (index: number) => {
    const tempSelectedDocuments = [...selectedDocuments];
    if (tempSelectedDocuments[index].documentName === "") {
      tempSelectedDocuments[index].emptyField = "documentName";
      tempSelectedDocuments[index].isValid = true;
      setSelectedDocuments([...tempSelectedDocuments]);
      return false;
    } else if (tempSelectedDocuments[index].documentLink === "") {
      tempSelectedDocuments[index].emptyField = "documentLink";
      tempSelectedDocuments[index].isValid = true;
      setSelectedDocuments([...tempSelectedDocuments]);
      return false;
    } else if (!validateWebURL(tempSelectedDocuments[index].documentLink)) {
      tempSelectedDocuments[index].emptyField = "documentLink";
      tempSelectedDocuments[index].isValid = true;
      setSelectedDocuments([...tempSelectedDocuments]);
      return false;
    } else {
      return true;
    }
  };

  const checkinNewSupportingDocument = (index: number) => {
    const validate = validation(index);
    const tempSelectedDocuments = [...selectedDocuments];
    if (validate) {
      tempSelectedDocuments[index].isNew = false;
      setSelectedDocuments([...tempSelectedDocuments]);
    }
  };

  const removeSupportingDocument = async (index: number) => {
    let tempSelectedDocuments = [...selectedDocuments];

    const filterSelectionDefinitions = allDocumentsLink.map((obj: any) => {
      if (obj.documentName === tempSelectedDocuments[index].documentName) {
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

    setAllDocumentsLink([...filterSelectionDefinitions]);
    setSelectedDocuments(tempSelectedDocuments);

    const objectsEqual = compareArraysOfObjects(masterSupportingDoc, [
      ...tempSelectedDocuments,
    ]);
    if (await objectsEqual) {
      setCheckChanges(false);
    } else {
      setCheckChanges(true);
    }
  };

  const documentOnchange = (
    value: string,
    id: number,
    key: string,
    ind: number
  ): void => {
    const tempArray: any[] = [...selectedDocuments];
    const onChangeArray = tempArray.map((obj: any) => {
      if (obj.ID === id) {
        obj[key] = value.trimStart();
        if (key === "documentName" && value.trimStart() !== "") {
          obj.isValid = false;
        } else if (key === "documentLink" && value.trimStart() !== "") {
          obj.isValid = false;
        }
        return obj;
      } else {
        return obj;
      }
    });
    setSelectedDocuments([...onChangeArray]);
  };

  const loggerPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  const submitSupDocuments = async (submitCondition: boolean) => {
    setCheckChanges(false);
    // togglePopupVisibility(
    //   setPopupController,
    //   0,
    //   "close",
    //   ""
    // );
    const checkCondition = selectedDocuments.some((obj: any) => obj.isNew);
    if (!checkCondition) {
      if (selectedDocuments.length !== 0) {
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
        await submitSupportingDocuments(
          [...selectedDocuments],
          documentId,
          sectionId,
          setToastMessage,
          getAllSelectedDocuments,
          currentSectionDetails?.sectionOrder,
          submitCondition,
          togglePopupVisibility,
          setPopupController,
          setLoader
        );
      } else {
        setToastMessage({
          isShow: true,
          severity: "warn",
          title: "Invalid submission!",
          message: "Please select/add at least one supporting document link.",
          duration: 3000,
        });
      }
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Add supporting link",
        message: "Please add supporting link before submit",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    getAllSelectedDocuments();

    const closeDiv = (e: any) => {
      if (
        e?.target.className !== "p-inputtext p-component" &&
        e?.target?.id !== "sectionSupportingDocumentId"
      ) {
        setFilterDocuments("");
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
  }, [sectionChangeRecord.changeRecordDescription]);

  return (
    <div className="sectionWrapper">
      <div className={styles.textPlayGround}>
        <div className={styles.definitionHeaderWrapper}>
          <span>
            {currentSectionDetails?.sectionSubmitted
              ? "Supporting Documents"
              : "Add supporting documents links"}
          </span>
          {/* <DefaultButton
            btnType="primary"
            text={"New"}
            size="medium"
            onClick={() => {
              // togglePopupVisibility(setPopupController, 0, "open");
              //   setDefinitionsData(initialDefinitionsData);
              AddNewDocument();
            }}
          /> */}
        </div>
        {!currentSectionDetails?.sectionSubmitted &&
          (currentDocRole?.primaryAuthor || currentDocRole?.sectionAuthor) && (
            <div className={styles.filterMainWrapper}>
              <div className={styles.inputmainSec}>
                <CustomInput
                  value={searchValue}
                  placeholder="Search documents by name"
                  onChange={(value: any) => {
                    handleSearchOnChange(value);
                  }}
                  onClickFunction={(value: boolean) => {
                    // handleSearchClick(value);
                    if (value) {
                      setFilterDocuments([...allDocumentsLink]);
                    }
                  }}
                  secWidth="257px"
                  // clearBtn
                />
                {searchValue !== "" && (
                  <button className={styles.closeBtn}>
                    <img
                      src={closeBtn}
                      alt={"Add Document"}
                      onClick={() => {
                        setFilterDocuments("");
                        setSearchValue("");
                      }}
                    />
                  </button>
                )}
              </div>
              {!selectedDocuments.some((obj: any) => obj.isNew) && (
                <DefaultButton
                  disabled={loader}
                  btnType="primary"
                  text={"New"}
                  size="medium"
                  onClick={() => {
                    // togglePopupVisibility(setPopupController, 0, "open");
                    // setDefinitionsData(initialDefinitionsData);
                    AddNewDocument();
                  }}
                />
              )}
              {typeof filterDocuments !== "string" && (
                <div
                  className={styles.filterSecWrapper}
                  id="sectionSupportingDocumentId"
                >
                  {(allDocumentsLink.length === 0 ||
                    filterDocuments.length === 0) && (
                    <div className={styles.noDataFound}>
                      <span>No data found</span>
                    </div>
                  )}
                  {filterDocuments?.map((obj: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className={
                          obj?.isSelected
                            ? styles.filterDefinitionSecSelected
                            : styles.filterDefinitionSec
                        }
                        onClick={(ev) => {
                          const checkCondition = selectedDocuments.some(
                            (obj: any) => obj.isNew
                          );
                          if (!checkCondition) {
                            onSelectDocument(obj.ID);
                            ev.preventDefault();
                          } else {
                            setToastMessage({
                              isShow: true,
                              severity: "warn",
                              title: "Add supporting link",
                              message:
                                "Please provide the supporting link before choosing the document.",
                              duration: 3000,
                            });
                          }
                        }}
                        id="sectionSupportingDocumentId"
                      >
                        <div
                          style={{ width: "10%" }}
                          id="sectionSupportingDocumentId"
                        >
                          <Checkbox
                            id="sectionSupportingDocumentId"
                            checkedIcon={<RadioButtonCheckedIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            key={index}
                            //   name={user?.value}
                            //   value={user?.sectionSelected}
                            checked={obj.isSelected}
                            //   id={user.value}
                            // onClick={(ev) => {
                            //   onSelectDocument(obj.ID);
                            //   ev.preventDefault();
                            // }}
                            size="small"
                          />
                        </div>
                        <div
                          // onClick={(ev) => {
                          //   onSelectDocument(obj.ID);
                          // }}
                          className={styles.title}
                          id="sectionSupportingDocumentId"
                        >
                          <span
                            id="sectionSupportingDocumentId"
                            title={obj.documentName}
                          >
                            {obj.documentName}
                          </span>
                        </div>
                        <div
                          className={styles.description}
                          id="sectionSupportingDocumentId"
                          title={obj.FileRef}
                        >
                          <span id="sectionSupportingDocumentId">
                            {obj.FileRef}
                          </span>
                        </div>
                        {/* <div className={styles.description}>
                      <span>{obj.description}</span>
                    </div> */}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        {loader ? (
          <CircularSpinner />
        ) : (
          <div style={{ padding: "10px 0px" }}>
            {!selectedDocuments.some((obj: any) => obj.isDeleted === false) && (
              <div className={styles.noDataFound}>
                <span>No Supporting Document Data Found</span>
              </div>
            )}
            {selectedDocuments?.map((obj: any, index: number) => {
              return (
                !obj.isDeleted && (
                  <div
                    key={index}
                    className={styles.SelectedDocumentsSec}
                    style={{ backgroundColor: obj.isNew ? "#593ABB10" : "" }}
                  >
                    {obj.isNew ? (
                      <div className={styles.documentInputSec}>
                        <CustomInput
                          onChange={(value: string) => {
                            documentOnchange(
                              value,
                              obj.ID,
                              "documentName",
                              index
                            );
                          }}
                          value={obj.documentName}
                          placeholder="Enter here"
                          withLabel
                          labelText="Document Name"
                          isValid={
                            obj.isValid &&
                            obj.emptyField === "documentName" &&
                            obj.documentName === ""
                          }
                          errorMsg="Please enter document name"
                          topLabel
                        />
                        <CustomInput
                          onChange={(value: string) => {
                            documentOnchange(
                              value,
                              obj.ID,
                              "documentLink",
                              index
                            );
                          }}
                          value={obj.documentLink}
                          placeholder="Enter here"
                          withLabel
                          labelText="Document Link"
                          isValid={
                            obj.isValid && obj.emptyField === "documentLink"
                          }
                          errorMsg={
                            obj.documentLink === ""
                              ? "Please enter document link"
                              : validateWebURL(obj.documentLink)
                              ? ""
                              : "Invalid URL"
                          }
                          topLabel
                        />
                      </div>
                    ) : (
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
                        <p className={styles.documentName}>
                          {obj.documentName}
                        </p>
                        <a
                          href={
                            obj.documentLink.startsWith("https://")
                              ? encodeURI(obj.documentLink)
                              : encodeURI("https://" + obj.documentLink)
                          }
                          target="_blank"
                          className={styles.documentLink}
                        >
                          {obj.documentLink.startsWith("https://")
                            ? obj.documentLink
                            : "https://" + obj.documentLink}
                        </a>
                      </div>
                    )}
                    {obj.isNew && (
                      // <button className={styles.closeBtn}>
                      //   <img
                      //     src={checkBtn}
                      //     alt={"Add Document"}
                      //     onClick={() => checkinNewSupportingDocument(index)}
                      //   />
                      // </button>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          gap: "10px",
                          justifyContent: "end",
                        }}
                      >
                        <DefaultButton
                          text={<CloseIcon sx={{ Padding: "0px" }} />}
                          onlyIcon={true}
                          title="Cancel"
                          btnType="darkGreyVariant"
                          onClick={() => removeSupportingDocument(index)}
                        />
                        <DefaultButton
                          text="Add"
                          btnType="primary"
                          onClick={() => checkinNewSupportingDocument(index)}
                        />
                      </div>
                    )}
                    {!obj.isNew && (
                      <div style={{ display: "flex", gap: "10px" }}>
                        {!currentSectionDetails?.sectionSubmitted &&
                          (currentDocRole?.primaryAuthor ||
                            currentDocRole?.sectionAuthor) &&
                          !obj.isNew && (
                            <button className={styles.closeBtn}>
                              <img
                                src={closeBtn}
                                alt={"Remove Document"}
                                onClick={() => removeSupportingDocument(index)}
                              />
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                )
              );
            })}
          </div>
        )}
      </div>

      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
          margin: "10px 0px",
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
            alignItems: "center",
            gap: "15px",
            // margin: "10px 0px",
            justifyContent: "flex-end",
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

          <DefaultButton
            text={<CloseIcon sx={{ Padding: "0px" }} />}
            onlyIcon={true}
            title="Close"
            btnType="darkGreyVariant"
            onClick={() => {
              setCheckChanges(false);
              navigate(-1);
            }}
          />
          <DefaultButton
            text="Preview"
            btnType="secondaryBlue"
            onClick={() => {
              togglePopupVisibility(
                setPopupController,
                4,
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
                      // disabled={sectionLoader}
                      disabled={
                        !["in development", "in rework", "approved"].includes(
                          currentDocDetailsData?.documentStatus?.toLowerCase()
                        )
                      }
                      btnType="secondaryRed"
                      onClick={() => {
                        togglePopupVisibility(
                          setPopupController,
                          1,
                          "open",
                          "Reason for rejection"
                        );
                      }}
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
                              2,
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
                          loggerPromoter?.status !== "completed" &&
                          currentDocDetailsData?.documentStatus?.toLowerCase !==
                            "approved"
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
                        await submitSupDocuments(false);
                      }}
                    />
                    <DefaultButton
                      disabled={loader}
                      text="Submit"
                      btnType="primary"
                      onClick={async () => {
                        // await submitSupDocuments(true);
                        togglePopupVisibility(
                          setPopupController,
                          0,
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
  );
};

export default memo(SupportingDocuments);
