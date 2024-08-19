/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { useState, useEffect } from "react";
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
} from "../../../../../utils/contentDevelopementUtils";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import CustomDateInput from "../../common/CustomInputFields/CustomDateInput";
import dayjs from "dayjs";
import { setCDSectionData } from "../../../../../redux/features/ContentDevloperSlice";

interface IProps {
  sectionNumber: any;
  ID: number;
  noActionBtns?: boolean;
  activeIndex?: any;
  setSectionData?: any;
  currentSectionDetails?: any;
  onChange?: any;
  currentDocRole?: any;
}

interface IPoint {
  text: string;
  value: string;
  class: any;
}

const SectionContent: React.FC<IProps> = ({
  sectionNumber,
  currentSectionDetails,
  ID,
  noActionBtns,
  activeIndex,
  setSectionData,
  onChange,
  currentDocRole,
}) => {
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
    debugger;
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

    console.log("promoters: ", promoters);

    const currentPromoter: any = getCurrentPromoter(promoters);
    console.log("currentPromoter: ", currentPromoter);

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
        console.log("updatedSections: ", updatedSections);

        dispatch(setCDSectionData([...updatedSections]));
      })
      .catch((err: any) => {
        console.log("err: ", err);
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
          handleClosePopup(2);
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
  ];

  const submitRejectedComment = async (): Promise<any> => {
    console.log(rejectedComments);
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

  const [sectionLoader, setSectionLoader] = useState(true);

  const navigate = useNavigate();

  const [points, setPoints] = useState<IPoint[]>([
    { text: String(sectionNumber), value: "", class: "I_0" },
  ]);
  console.log("points: ", points);

  const [subPointSequences, setSubPointSequences] = useState<{
    [key: string]: number;
  }>({});

  const getNextPoint = (lastPoint: IPoint): IPoint => {
    const parts = lastPoint?.text.split(".");
    const majorPart = parseInt(parts[0]);
    const minorPart = parseInt(parts[1]) + 1 || 1;
    const className = `I_${parts.length}`; // Calculate the indent count based on the number of dots
    return { text: `${majorPart}.${minorPart}`, value: "", class: className };
  };

  const getNextSubPoint = (parentPoint: string, sequence: number): IPoint => {
    const className = `I_${parentPoint.split(".").length + 1}`; // Increase indent count for sub-points
    return { text: `${parentPoint}.${sequence}`, value: "", class: className };
  };

  const handleAddPoint = (): void => {
    const newPoint = getNextPoint(points[points.length - 1]);
    setPoints([...points, newPoint]);
  };

  const handleAddSubPoint = (index: number): void => {
    const parentPoint = points[index];
    if (parentPoint.value.trim() === "") {
      alert(
        "Please enter a value for the parent point before adding a sub-point."
      );
      return;
    }
    const sequence = subPointSequences[parentPoint.text] || 1;
    const newSubPoint = getNextSubPoint(parentPoint.text, sequence);
    const newPoints = [
      ...points.slice(0, index + 1),
      newSubPoint,
      ...points.slice(index + 1),
    ];
    const newSequence = sequence + 1;
    setSubPointSequences({
      ...subPointSequences,
      [parentPoint.text]: newSequence,
    });
    setPoints(newPoints);
  };

  const renderPoint = (point: IPoint, index: number): JSX.Element => {
    const indent = point.class;
    const marginLeft = (indent - 1) * 26;
    const nestedStyle: React.CSSProperties = {
      marginLeft: `${marginLeft}px`,
      display: "flex",
      alignItems: "center",
    };

    const ancestors: JSX.Element[] = [];
    for (let i = 1; i < indent; i++) {
      ancestors.push(
        <div
          key={i}
          style={{
            position: "absolute",
            top: `-12%`,
            left: `${i === 1 ? `0` : `${(i - 1) * 26}px`}`,
            borderLeft: `1px solid ${i === 1 ? `transparent` : `#adadad60`}`,
            height: "136%",
          }}
        />
      );
    }

    return (
      <div key={index} style={{ position: "relative" }}>
        <div
          style={nestedStyle}
          className={`${styles.renderedInput} renderedInput`}
        >
          {ancestors}
          <span style={{ marginRight: "5px" }} className={styles.pointText}>
            {point.text}
          </span>
          <ContentEditor
            readOnly={
              currentSectionDetails?.sectionSubmitted ||
              currentDocRole?.consultant
            }
            editorHtmlValue={point.value}
            placeholder="Enter here"
            setEditorHtml={(html: any) => {
              handleInputChange(index, html);
            }}
          />
          {!currentSectionDetails?.sectionSubmitted && (
            <>
              <button
                onClick={() => handleInputClear(index)}
                className="actionButtons"
                style={{
                  background: "transparent",
                  padding: "0 5px 0 0",
                }}
              >
                <i className="pi pi-times-circle" />
              </button>
              <button
                onClick={() => handleAddSubPoint(index)}
                className="actionButtons"
              >
                <i className="pi pi-angle-double-right" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const sortedPoints = points.sort((a, b) => {
    const pointA = a?.text?.split(".")?.map(parseFloat);
    const pointB = b?.text?.split(".")?.map(parseFloat);

    for (let i = 0; i < Math.min(pointA.length, pointB.length); i++) {
      if (pointA[i] !== pointB[i]) {
        return pointA[i] - pointB[i];
      }
    }
    return pointA.length - pointB.length;
  });

  const handleInputChange = (index: number, value: string): void => {
    const newPoints = [...points];
    newPoints[index].value = value;
    setPoints(newPoints);
    onChange && onChange(newPoints);
  };

  const handleInputClear = (index: number): void => {
    const pointToRemove = points[index];
    const newPoints = points.filter((_, i) => i !== index);

    const removeSubPoints = (parentPoint: string): any => {
      const subPoints = newPoints.filter((point) =>
        point.text.startsWith(parentPoint + ".")
      );
      subPoints.forEach((subPoint) => {
        const subPointIndex = newPoints.indexOf(subPoint);
        newPoints.splice(subPointIndex, 1);
        removeSubPoints(subPoint.text);
      });
    };
    removeSubPoints(pointToRemove.text);
    setPoints(newPoints);
    onChange && onChange(newPoints);
  };

  // const renderPoint = (point: IPoint, index: number): JSX.Element => {
  //   const indent = point.text.split(".").length - 1;
  //   const marginLeft = (indent - 1) * 26;
  //   const nestedStyle: React.CSSProperties = {
  //     marginLeft: `${marginLeft}px`,
  //     display: "flex",
  //     alignItems: "center",
  //   };

  //   const ancestors: JSX.Element[] = [];
  //   for (let i = 1; i < indent; i++) {
  //     ancestors.push(
  //       <div
  //         key={i}
  //         style={{
  //           position: "absolute",
  //           top: `-12%`,
  //           left: `${i === 1 ? `0` : `${(i - 1) * 26}px`}`,
  //           borderLeft: `1px solid ${i === 1 ? `transparent` : `#adadad60`}`,
  //           height: "136%",
  //         }}
  //       />
  //     );
  //   }

  //   return (
  //     <div key={index} style={{ position: "relative" }}>
  //       <div
  //         style={nestedStyle}
  //         className={`${styles.renderedInput} renderedInput`}
  //       >
  //         {ancestors}
  //         <span style={{ marginRight: "5px" }} className={styles.pointText}>
  //           {point.text}
  //         </span>
  //         <ContentEditor
  //           readOnly={
  //             currentSectionDetails?.sectionSubmitted ||
  //             currentDocRole?.consultant
  //           }
  //           editorHtmlValue={point.value}
  //           placeholder="Enter here"
  //           setEditorHtml={(html: any) => {
  //             handleInputChange(index, html);
  //           }}
  //         />
  //         {!currentSectionDetails?.sectionSubmitted && (
  //           <>
  //             <button
  //               onClick={() => handleInputClear(index)}
  //               className="actionButtons"
  //               style={{
  //                 background: "transparent",
  //                 padding: "0 5px 0 0",
  //               }}
  //             >
  //               <i className="pi pi-times-circle" />
  //             </button>
  //             <button
  //               onClick={() => handleAddSubPoint(index)}
  //               className="actionButtons"
  //             >
  //               <i className="pi pi-angle-double-right" />
  //             </button>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // const sortedPoints = points.sort((a, b) => {
  //   const pointA = a?.text?.split(".")?.map(parseFloat);
  //   const pointB = b?.text?.split(".")?.map(parseFloat);

  //   for (let i = 0; i < Math.min(pointA.length, pointB.length); i++) {
  //     if (pointA[i] !== pointB[i]) {
  //       return pointA[i] - pointB[i];
  //     }
  //   }
  //   return pointA.length - pointB.length;
  // });

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
        console.log("res: ", res);
        const parsedValue: any = JSON.parse(res);
        if (typeof parsedValue === "object") {
          setPoints([...parsedValue]);
          onChange && onChange([...parsedValue]);
          setSectionLoader(false);
        } else {
          setSectionLoader(false);
        }
      })
      .catch((err: any) => {
        console.log("err: ", err);
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
        console.log("res: ", res);
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
          setSectionLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSectionLoader(false);
      });
  };

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(points)], { type: "text/plain" });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    debugger;
    togglePopupVisibility(
      setPopupController,
      0,
      "close",
      "Are you sure want to submit this section?"
    );
    setSectionLoader(true);
    const _file: any = await convertToTxtFile();
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

  useEffect(() => {
    setSectionLoader(true);
    if (currentSectionDetails?.contentType === "list") {
      getSectionData();
    }

    // if (sortedPoints) {
    //   setSectionLoader(false);
    // }
  }, [ID]);

  useEffect(() => {
    console.log(sectionChangeRecord);
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
      {sectionLoader && !noActionBtns ? (
        <div className="contentDevLoaderWrapper">
          <CircularSpinner />
        </div>
      ) : (
        <div className={styles.textPlayGround}>
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
              onClick={handleAddPoint}
            />
          )}
          {sortedPoints.length > 1 ? (
            sortedPoints?.map((item: any, idx: number) =>
              item?.text !== String(sectionNumber) ? renderPoint(item, idx) : ""
            )
          ) : (
            <p className={styles.placeholder}>Content goes here as points...</p>
          )}
        </div>
      )}
      {/* {!noActionBtns ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <button className={"helpButton"}>Help?</button>
          <div style={{ display: "flex", gap: "15px" }}>
            {currentSectionDetails?.sectionSubmitted && (
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
            )}
            <DefaultButton
              text="Close"
              btnType="darkGreyVariant"
              onClick={() => {
                navigate(-1);
              }}
            />
            {currentDocRole?.primaryAuthor || currentDocRole?.sectionAuthor ? (
              <>
                {(currentDocRole?.primaryAuthor ||
                  currentDocRole?.reviewer ||
                  currentDocRole?.approver) &&
                  currentSectionDetails?.sectionSubmitted && (
                    <DefaultButton
                      text="Rework"
                      disabled={sectionLoader}
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
                  )}
                {!currentSectionDetails?.sectionSubmitted && (
                  <>
                    <DefaultButton
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
                    />

                    <DefaultButton
                      text="Save and Close"
                      disabled={sectionLoader}
                      btnType="lightGreyVariant"
                      onClick={() => {
                        addData();
                      }}
                    />

                    {(currentDocRole?.sectionAuthor ||
                      currentDocRole?.primaryAuthor) && (
                      <DefaultButton
                        text="Submit"
                        disabled={sectionLoader}
                        btnType="primary"
                        onClick={() => {
                          // addData("submit");
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
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        currentSectionDetails?.sectionType?.toLowerCase() !==
          "appendix section" && (
          <DefaultButton
            text="Close"
            btnType="darkGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
            style={{
              marginTop: "10px",
            }}
          />
        )
      )} */}

      {!noActionBtns ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "15px",
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
              text="Close"
              btnType="darkGreyVariant"
              onClick={() => {
                navigate(-1);
              }}
            />

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
                          !["in development"].includes(
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
                              currentDocRole?.reviewer
                                ? "Reviewed"
                                : currentDocRole?.approver && "Approved"
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
                      <DefaultButton
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
                      />
                      <DefaultButton
                        text="Save and Close"
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
            text="Close"
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

export default SectionContent;
