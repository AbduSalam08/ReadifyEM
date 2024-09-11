/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./SectionContent.module.scss";
import DefaultButton from "../../common/Buttons/DefaultButton";
import ContentEditor from "./ContentEditor/ContentEditor";
import { useNavigate } from "react-router-dom";
import SpServices from "../../../../../services/SPServices/SpServices";
import {
  addRejectedComment,
  UpdateAttachment,
  addChangeRecord,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { LISTNAMES } from "../../../../../config/config";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
// import SecondaryTextLabel from "../../common/SecondaryText/SecondaryText";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import Popup from "../../common/Popups/Popup";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
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
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PreviewSection from "../PreviewSection/PreviewSection";
// import { compareArraysOfObjects } from "../../../../../utils/CommonUtils";

interface IProps {
  sectionNumber: any;
  ID: number;
  noActionBtns?: boolean;
  activeIndex?: any;
  setSectionData?: any;
  currentSectionDetails?: any;
  onChange?: any;
  currentDocRole?: any;
  setCheckChanges?: any;
}

interface Point {
  text: string;
  value: string;
  class: any;
  children: Point[];
}

interface InvalidPointResult {
  path: number[];
  text: string;
}

// interface IPoint {
//   text: string;
//   value: string;
//   class: any;
// }

const SectionContentLatest: React.FC<IProps> = ({
  sectionNumber,
  currentSectionDetails,
  ID,
  noActionBtns,
  activeIndex,
  setSectionData,
  onChange,
  currentDocRole,
  setCheckChanges,
}) => {
  // Track the latest point to be focused
  // const lastAddedPointRef = useRef<HTMLDivElement | null>(null);
  // Inside your renderPoints function
  const contentEditorRefs = useRef<Map<string, any>>(new Map());

  // confirmation popup controllers
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
    {
      open: false,
      popupTitle: "",
      popupWidth: "950px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
  ];

  const dispatch = useDispatch();

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

  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

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
    setSectionLoader(true);

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
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
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
        setSectionLoader(false);
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
          await addData("submit");
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

  const popupInputs: any[] = [
    [],
    [
      <CustomTextArea
        size="MD"
        labelText="Comments"
        withLabel
        icon={false}
        mandatory={true}
        textAreaWidth={"100%"}
        value={rejectedComments.rejectedComment}
        onChange={(value: any) => {
          setRejectedComments({
            ...rejectedComments,
            rejectedComment: value,
            IsValid: false,
          });
        }}
        placeholder="Enter Description"
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
        currentSectionDetails?.ID,
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

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });
  const [validation, setValidation] = useState<any>({
    isValid: true,
    errorMessage: "",
  });

  const [sectionLoader, setSectionLoader] = useState(true);

  const navigate = useNavigate();

  //   const [points, setPoints] = useState<IPoint[]>([
  //     { text: String(sectionNumber), value: "", class: "I_0" },
  //   ]);

  const [masterPoints, setMasterPoints] = useState<Point[]>([]);

  const loggerPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  const readTextFileFromTXT = (data: any): void => {
    setSectionLoader(true);
    SpServices.SPReadAttachments({
      ListName: "SectionDetails",
      ListID: ID,
      AttachmentName: data?.FileName,
    })
      .then((res: any) => {
        const parsedValue: any = JSON.parse(res);
        if (typeof parsedValue === "object") {
          setMasterPoints([...parsedValue]);
          onChange && onChange([...parsedValue]);
          setSectionLoader(false);
        }
        // else {
        //   setPoints([{ text: String(sectionNumber), value: "", class: "I_0" }]);
        //   onChange &&
        //     onChange([
        //       { text: String(sectionNumber), value: "", class: "I_0" },
        //     ]);
        //   setSectionLoader(false);
        // }
      })
      .catch((err: any) => {
        // setPoints([{ text: String(sectionNumber), value: "", class: "I_0" }]);
        // onChange &&
        //   onChange([{ text: String(sectionNumber), value: "", class: "I_0" }]);
        // console.log("Error : ", err);
        setSectionLoader(false);
      });
  };

  const getSectionData = async (): Promise<any> => {
    setSectionLoader(true);
    await SpServices.SPGetAttachments({
      Listname: LISTNAMES.SectionDetails,
      ID: ID,
    })
      .then((res: any) => {
        const filteredItem: any = res?.filter(
          (item: any) => item?.FileName === "Sample.txt"
        );
        if (
          filteredItem.length > 0 &&
          currentSectionDetails?.contentType === "list"
        ) {
          readTextFileFromTXT(filteredItem[0]);
          // setNewAttachment(false);
        } else {
          //   setPoints([{ text: String(sectionNumber), value: "", class: "I_0" }]);
          //   onChange &&
          //     onChange([
          //       { text: String(sectionNumber), value: "", class: "I_0" },
          //     ]);
          setSectionLoader(false);
        }
      })
      .catch((err) => {
        // setPoints([{ text: String(sectionNumber), value: "", class: "I_0" }]);
        // onChange &&
        //   onChange([{ text: String(sectionNumber), value: "", class: "I_0" }]);
        // console.log("Error : ",err);
        setSectionLoader(false);
      });
  };

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(masterPoints)], {
      type: "text/plain",
    });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    setCheckChanges(false);
    const invalidPath = findInvalidPointPath(masterPoints);
    if (invalidPath) {
      focusOnInvalidPoint(invalidPath.path); // Focus on the first invalid point
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Empty point!",
        message: `Please fill the point ${invalidPath.text} before adding a new one.`,
        duration: 3000,
      });
      return;
    }

    togglePopupVisibility(
      setPopupController,
      0,
      "close",
      "Are you sure want to submit this section?"
    );
    if (masterPoints.length === 0) {
      // setValidation({
      //   ...validation,
      //   isValid: false,
      //   errorMessage: "error message",
      // });
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Invalid submission!",
        message: "Please add content to submit a section.",
        duration: 3000,
      });
      return;
    }
    setSectionLoader(true);
    const _file: any = await convertToTxtFile();

    if (submissionType === "submit") {
      await updateTaskCompletion(
        currentSectionDetails?.sectionName,
        currentSectionDetails?.documentOfId,
        "completed"
      );
    }

    const updateAttachmentPromise: Promise<any> = await UpdateAttachment(
      ID,
      _file,
      "list",
      submissionType === "submit",
      "Sample.txt",
      AllSectionsDataMain,
      dispatch,
      currentDocDetailsData
    );

    Promise.all([updateAttachmentPromise])
      .then((res: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
          duration: 3000,
        });
      })
      .catch((err: any) => {
        setToastMessage({
          isShow: true,
          severity: "error",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
        setSectionLoader(false);
      });
  };

  // lastest code

  // Recursively check if any point or its child has an empty value and return its path
  const findInvalidPointPath = (
    arr: Point[],
    path: number[] = []
  ): InvalidPointResult | null => {
    for (let index = 0; index < arr.length; index++) {
      const point = arr[index];
      const currentPath = [...path, index]; // Track the current path

      if (point.value.trim() === "" || point.value.trim() === "<p><br></p>") {
        return { path: currentPath, text: point.text }; // Return the path of the invalid point
      }

      if (point.children.length > 0) {
        const childPath = findInvalidPointPath(point.children, currentPath);
        if (childPath) {
          return childPath; // Return the path if a child point is invalid
        }
      }
    }
    return null; // All points and child points are valid
  };

  // Recursively check if any point or its child has an empty value
  const validatePoints = (arr: Point[]): boolean => {
    for (const point of arr) {
      if (point.value.trim() === "" || point.value.trim() === "<p><br></p>") {
        return false; // Invalid if any point has an empty value
      }
      if (point.children.length > 0) {
        const childValidation = validatePoints(point.children); // Check child points
        if (!childValidation) {
          return false; // If any child point is invalid, return false
        }
      }
    }
    return true; // All points and child points are valid
  };

  // Function to update point text recursively based on its position
  const updatePointText = (arr: Point[], prefix: string = ""): Point[] => {
    return arr.map((point, index) => {
      const newText = `${prefix}.${index + 1}`;
      return {
        ...point,
        text: newText,
        children: updatePointText(point.children, `${newText}`), // Recursively number children
      };
    });
  };

  // Function to handle input changes
  const handleInputChanges = (path: number[], newValue: string): any => {
    const updatedPoints = updatePointsAtPath(masterPoints, path, (point) => {
      return { ...point, value: newValue };
    });

    setMasterPoints(updatedPoints);
  };

  const focusOnInvalidPoint = (invalidPath: number[]): any => {
    const refKey = invalidPath.join("-"); // Generate the same key based on the path
    const editorToFocus = contentEditorRefs.current.get(refKey); // Get the corresponding editor

    if (editorToFocus) {
      editorToFocus.focus(); // Focus the editor
    }
  };

  // Function to add a new sub-point at a specific path
  const addSubPoint = (path: number[]): any => {
    const invalidPath = findInvalidPointPath(masterPoints);
    if (invalidPath) {
      focusOnInvalidPoint(invalidPath.path); // Focus on the first invalid point
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Empty point!",
        message: `Please fill the point ${invalidPath.text} before adding a new one.`,
        duration: 3000,
      });
      return;
    }
    if (validatePoints([...masterPoints])) {
      const newSubPoint: Point = {
        text: "", // This will be updated when numbering
        value: "",
        class: "",
        children: [],
      };

      const updatedPoints = updatePointsAtPath(masterPoints, path, (point) => {
        return {
          ...point,
          children: [...point.children, newSubPoint],
        };
      });

      // Re-number points after adding the sub-point
      const renumberedPoints = updatePointText(
        updatedPoints,
        currentSectionDetails.sectionOrder
      );
      setMasterPoints(renumberedPoints);
    } else {
      alert("Invalid points");
    }
  };

  // Function to delete a point at a specific path
  const deletePoint = (path: number[]): any => {
    if (path.length === 1) {
      // If deleting a top-level point
      const updatedPoints = masterPoints.filter(
        (_, index) => index !== path[0]
      );
      const renumberedPoints = updatePointText(
        updatedPoints,
        currentSectionDetails.sectionOrder
      );
      setMasterPoints(renumberedPoints);
    } else {
      // If deleting a nested point
      const updatedPoints = updatePointsAtPath(
        masterPoints,
        path.slice(0, -1),
        (parentPoint) => {
          const updatedChilds = parentPoint.children.filter(
            (_, index) => index !== path[path.length - 1]
          );
          return { ...parentPoint, children: updatedChilds };
        }
      );

      // Re-number points after deletion
      const renumberedPoints = updatePointText(
        updatedPoints,
        currentSectionDetails.sectionOrder
      );
      setMasterPoints(renumberedPoints);
    }
  };

  // Function to update points at a specific path in the nested structure
  const updatePointsAtPath = (
    points: Point[],
    path: number[],
    updater: (point: Point) => Point
  ): Point[] => {
    if (path.length === 0) return points;

    const [currentIndex, ...restPath] = path;

    return points.map((point, index) => {
      if (index === currentIndex) {
        if (restPath.length === 0) {
          return updater(point);
        } else {
          return {
            ...point,
            children: updatePointsAtPath(point.children, restPath, updater),
          };
        }
      }
      return point;
    });
  };

  // Function to render points recursively
  const renderPoints = (
    arr: Point[],
    parentPath: number[] = []
  ): JSX.Element[] => {
    return arr.map((point, index) => {
      // Calculate the current path for this point (parent path + current index)
      const currentPath = [...parentPath, index];
      const refKey = currentPath.join("-");

      // Determine the indent level based on the length of the parent path
      const indentLevel = parentPath.length + 1;
      const marginLeft = indentLevel - 1 + 15; // Adjust this value for appropriate spacing

      // Indent lines to visually connect parent and child points
      const ancestors: JSX.Element[] = [];
      for (let i = 1; i < indentLevel; i++) {
        ancestors.push(
          <div
            key={i}
            style={{
              position: "absolute",
              top: `0%`, // Position to align with the point text
              left: `${i === 0 ? `0` : `${(i - 1) * 26 - 14}px`}`,
              borderLeft: `1px solid ${i !== 1 ? `transparent` : `#adadad60`}`,
              height: "100%", // Adjust this to match the height alignment with nested points
            }}
          />
        );
      }

      return (
        <div
          key={point.text}
          style={{
            position: "relative",
            marginLeft: `${marginLeft}px`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Indent lines */}
          {ancestors}

          <div className={`${styles.renderedInput} renderedInput`}>
            <span className={styles.pointText}>{point.text}</span>

            <ContentEditor
              ref={(el: any) => {
                if (el) contentEditorRefs.current.set(refKey, el);
                // if (point.value === "") {
                //   lastAddedPointRef.current = el;
                // }
              }}
              readOnly={
                currentSectionDetails?.sectionSubmitted ||
                currentDocRole?.consultant
              }
              editorHtmlValue={point.value}
              placeholder="Enter here"
              setEditorHtml={(html: any) => {
                handleInputChanges(currentPath, html);
              }}
            />

            {!currentSectionDetails?.sectionSubmitted && (
              <div className={styles.actionButtonsContainer}>
                <button
                  onClick={() => deletePoint(currentPath)}
                  className={`${styles.actionButtons} ${styles.firstButton}`}
                >
                  <i className="pi pi-times-circle" />
                </button>

                <button
                  onClick={() => addSubPoint(currentPath)}
                  className={`${styles.actionButtons} ${styles.secondButton}`}
                >
                  <i className="pi pi-angle-double-right" />
                </button>
              </div>
            )}
          </div>

          {/* Render child points recursively */}
          {point.children.length > 0 &&
            renderPoints(point.children, currentPath)}
        </div>
      );
    });
  };

  // Function to add a new top-level point
  const addNewPoint = (): any => {
    const invalidPath = findInvalidPointPath(masterPoints);
    if (invalidPath) {
      focusOnInvalidPoint(invalidPath.path); // Focus on the first invalid point
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Empty point!",
        message: `Please fill the point ${invalidPath.text} before adding a new one.`,
        duration: 3000,
      });
      return;
    }
    if (validatePoints([...masterPoints])) {
      const newPoint: Point = {
        text: "", // This will be updated when numbering
        value: "",
        class: "",
        children: [],
      };

      const updatedPoints = [...masterPoints, newPoint];

      // Re-number points after adding the new point
      const renumberedPoints = updatePointText(
        updatedPoints,
        currentSectionDetails.sectionOrder
      );
      setMasterPoints(renumberedPoints);
    } else {
      alert("Invalid points");
    }
  };

  // Focus on the last added point when the points change
  useEffect(() => {
    const invalidPath = findInvalidPointPath(masterPoints);
    if (invalidPath) {
      focusOnInvalidPoint(invalidPath.path); // Focus on the first invalid point
    }
  }, [masterPoints.length]);

  useEffect(() => {
    setSectionLoader(true);
    if (currentSectionDetails?.contentType === "list") {
      getSectionData();
    }
    setValidation({ ...validation, isValid: true, errorMessage: "" });

    // if (sortedPoints) {
    //   setSectionLoader(false);
    // }
  }, [ID, currentSectionDetails?.ID]);

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
    <div
      style={{
        height: "100%",
        // height: "calc(100% - 30px)",
        // height: sectionLoader ? "calc(100% - 30px)" : "100%",
      }}
    >
      {sectionLoader && !noActionBtns ? (
        <div
          className="contentDevLoaderWrapper"
          style={{
            // height: "100%",
            height: "calc(100% - 30px)",
          }}
        >
          <CircularSpinner />
        </div>
      ) : (
        <div className={styles.textPlayGround}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {!currentSectionDetails?.sectionSubmitted && (
              <DefaultButton
                btnType="primary"
                startIcon={
                  <i
                    className="pi pi-plus-circle"
                    style={{
                      fontSize: "12px",
                    }}
                  />
                }
                text={"Add new point"}
                // onClick={handleAddPoint}
                onClick={addNewPoint}
              />
            )}
            {!validation.isValid && (
              <p className={styles.errorMsg}>{validation.errorMessage}</p>
            )}
          </div>
          {masterPoints.length > 0 ? (
            <div>{renderPoints(masterPoints)}</div>
          ) : (
            <p className={styles.placeholder}>Content goes here as points...</p>
          )}
          {/* {sortedPoints.length > 1 ? (
            sortedPoints?.map((item: any, idx: number) =>
              item?.text !== String(sectionNumber) ? renderPoint(item, idx) : ""
            )
          ) : (
            <p className={styles.placeholder}>Content goes here as points...</p>
          )} */}
        </div>
      )}

      {!noActionBtns ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "15px",
            marginTop: sectionLoader ? "0" : "10px",
          }}
        >
          <button className={"helpButton"}>Help?</button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "15px",
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
              text={<CloseIcon />}
              btnType="darkGreyVariant"
              title="Close"
              onlyIcon={true}
              onClick={() => {
                setCheckChanges(false);
                navigate(-1);
              }}
            />
            {!currentSectionDetails?.sectionSubmitted &&
              (currentDocRole?.sectionAuthor ||
                currentDocRole?.primaryAuthor) && (
                <>
                  <DefaultButton
                    text={<RestartAltIcon />}
                    title="Reset Content"
                    onlyIcon={true}
                    disabled={sectionLoader}
                    btnType="secondaryRed"
                    onClick={() => {
                      setSectionData((prev: any) => {
                        const updatedSections = [...prev];
                        updatedSections[activeIndex] = {
                          ...updatedSections[activeIndex],
                          contentType: "initial",
                        };
                        return updatedSections;
                      });
                    }}
                  />
                </>
              )}

            <DefaultButton
              text="Preview"
              btnType="secondaryBlue"
              onClick={() => {
                togglePopupVisibility(setPopupController, 4, "open", "Preview");
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
                              !sectionLoader &&
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
                          disabled={
                            !sectionLoader &&
                            loggerPromoter?.status !== "completed"
                              ? false
                              : true
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
                      </>
                    )}

                {!currentSectionDetails?.sectionSubmitted &&
                  (currentDocRole?.sectionAuthor ||
                    currentDocRole?.primaryAuthor) && (
                    <>
                      {/* <DefaultButton
                        text="Reset content"
                        disabled={sectionLoader}
                        btnType="secondaryRed"
                        onClick={() => {
                          setSectionData((prev: any) => {
                            const updatedSections = [...prev];
                            updatedSections[activeIndex] = {
                              ...updatedSections[activeIndex],
                              contentType: "initial",
                            };
                            return updatedSections;
                          });
                        }}
                      /> */}
                      <DefaultButton
                        text="Save"
                        disabled={sectionLoader}
                        btnType="lightGreyVariant"
                        onClick={async () => {
                          await addData();
                        }}
                      />
                      {(currentDocRole?.sectionAuthor ||
                        currentDocRole?.primaryAuthor) && (
                        <DefaultButton
                          text="Submit"
                          disabled={sectionLoader}
                          btnType="primary"
                          onClick={() => {
                            // await addData("submit");
                            togglePopupVisibility(
                              setPopupController,
                              0,
                              "open",
                              "Are you sure want to submit this section?"
                            );
                          }}
                        />
                      )}
                    </>
                  )}
              </>
            )}
          </div>
        </div>
      ) : (
        currentSectionDetails?.sectionType?.toLowerCase() !==
          "appendix section" && (
          <DefaultButton
            text={<CloseIcon sx={{ Padding: "0px" }} />}
            title="Close"
            onlyIcon={true}
            btnType="darkGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
            style={{
              marginTop: "10px",
            }}
          />
        )
      )}

      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />

      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          // isLoading={sectionLoader}
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
          popupHeight={index === 0 ? true : false}
        />
      ))}
    </div>
  );
};

export default SectionContentLatest;
