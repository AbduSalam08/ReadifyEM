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
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { LISTNAMES } from "../../../../../config/config";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
import SecondaryTextLabel from "../../common/SecondaryText/SecondaryText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import Popup from "../../common/Popups/Popup";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
import { useDispatch, useSelector } from "react-redux";

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

  console.log("AllSectionsDataMain: ", AllSectionsDataMain);

  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionCommentsData.SectionComments
  );

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
  const [points, setPoints] = useState<IPoint[]>([
    { text: String(sectionNumber), value: "" },
  ]);
  console.log("points: ", points);
  const navigate = useNavigate();
  const [subPointSequences, setSubPointSequences] = useState<{
    [key: string]: number;
  }>({});
  // const [newAttachment, setNewAttachment] = useState<boolean>(true);

  const getNextPoint = (lastPoint: IPoint): IPoint => {
    const parts = lastPoint?.text.split(".");
    const majorPart = parseInt(parts[0]);
    const minorPart = parseInt(parts[1]) + 1 || 1;
    return { text: `${majorPart}.${minorPart}`, value: "" };
  };

  const handleAddPoint = (): void => {
    const newPoint = getNextPoint(points[points.length - 1]);
    setPoints([...points, newPoint]);
  };

  const getNextSubPoint = (parentPoint: string, sequence: number): IPoint => {
    return { text: `${parentPoint}.${sequence}`, value: "" };
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

  const renderPoint = (point: IPoint, index: number): JSX.Element => {
    const indent = point.text.split(".").length - 1;
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
            readOnly={currentSectionDetails?.sectionSubmitted}
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
      dispatch
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
      {!noActionBtns ? (
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
                      text="Reject"
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
      ) : currentSectionDetails?.sectionType?.toLowerCase() !==
        "appendix section" ? (
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
      ) : (
        ""
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
