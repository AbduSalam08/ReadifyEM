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
const checkBtn = require("../../../../../assets/images/png/checkmark.png");

import CircularSpinner from "../../common/AppLoader/CircularSpinner";

import {
  getAllDocuments,
  getDocumentDeatils,
  getApprovedDocuments,
  submitSupportingDocuments,
  updateSectionDetails,
} from "../../../../../services/ContentDevelopment/SupportingDocument/SupportingDocumentServices";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import ToastMessage from "../../common/Toast/ToastMessage";
import SecondaryTextLabel from "../../common/SecondaryText/SecondaryText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Popup from "../../common/Popups/Popup";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
import { addRejectedComment } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  documentId: number;
  sectionId: number;
  currentSectionDetails: any;
  currentDocRole: any;
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
  ];
  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });

  const navigate = useNavigate();

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
    (state: any) => state.SectionCommentsData.SectionComments
  );

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

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
          handleClosePopup(2);
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
  ];

  // initial definitions data
  const [allDocumentsLink, setAllDocumentsLink] = useState<any[]>([]);
  const [filterDocuments, setFilterDocuments] = useState<any[]>([]);
  console.log("filterDocuments: ", filterDocuments);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedDocuments, setSelectedDocuments] = useState<documentDetails[]>(
    []
  );
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
    console.log(rejectedComments);
    debugger;
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

  const getApprovedDocumentsLinks = async (documents: any) => {
    const approvedDocuments: any = await getApprovedDocuments(documents);
    setAllDocumentsLink(approvedDocuments);
  };

  const getMainDocumentDeatails = async (Data: any[]) => {
    const tempDocumentsDetails: any = await getDocumentDeatils(Data);
    getApprovedDocumentsLinks(tempDocumentsDetails);
    setLoader(false);
  };

  const getAllSelectedDocuments = async () => {
    setLoader(true);
    const tempSelectedDocumentsArray: any = await getAllDocuments(
      sectionId,
      documentId
    );
    const sortedArray = tempSelectedDocumentsArray.sort(
      (a: any, b: any) => b.ID - a.ID
    );
    setSelectedDocuments([...sortedArray]);
    getMainDocumentDeatails([...sortedArray]);
  };

  const onSelectDocument = (id: number): void => {
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
      } else {
        setSelectedDocuments((prev: any) => {
          return [
            {
              ID: selectedDocuments.length + 1,
              documentName: documentObject.documentName,
              documentLink: documentObject.FileRef,
              isSelected: false,
              isNew: false,
              status: true,
            },
            ...prev,
          ];
        });
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
        } else {
          tempSelectedDocuments[index].isDeleted = true;
          setSelectedDocuments([...tempSelectedDocuments]);
        }
      }
    }
    setFilterDocuments([...tempArray]);
  };

  const AddNewDocument = (): any => {
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
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Pending add supporting link",
        message: "Please add new supporting link before submit",
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

  const removeSupportingDocument = (index: number) => {
    let tempSelectedDocuments = [...selectedDocuments];
    if (tempSelectedDocuments[index].status) {
      tempSelectedDocuments = tempSelectedDocuments.filter(
        (obj: any, ind: number) => {
          return ind !== index;
        }
      );
    } else {
      tempSelectedDocuments[index].isDeleted = true;
    }
    setSelectedDocuments([...tempSelectedDocuments]);
  };

  const documentOnchange = (
    value: string,
    id: number,
    key: string,
    ind: number
  ): void => {
    // console.log(value, id);
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

  useEffect(() => {
    getAllSelectedDocuments();
  }, []);

  const submitSupDocuments = async (submitCondition: boolean) => {
    togglePopupVisibility(
      setPopupController,
      0,
      "close",
      "Are you sure want to submit this section?"
    );
    const checkCondition = selectedDocuments.some((obj: any) => obj.isNew);
    if (!checkCondition) {
      const reRender: boolean | any = await submitSupportingDocuments(
        [...selectedDocuments],
        documentId,
        sectionId,
        setToastMessage,
        getAllSelectedDocuments
      );
      console.log(reRender);
      if (submitCondition) {
        // getAllSelectedDocuments();
        await updateSectionDetails(sectionId, AllSectionsDataMain, dispatch);
      }
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Pending add supporting link",
        message: "Please add new supporting link before submit",
        duration: 3000,
      });
    }
  };

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
                  secWidth="257px"
                  // clearBtn
                />
                {searchValue !== "" && (
                  <button className={styles.closeBtn}>
                    <img
                      src={closeBtn}
                      alt={"Add Document"}
                      onClick={() => setSearchValue("")}
                    />
                  </button>
                )}
              </div>
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
              {searchValue?.trim() !== "" && (
                <div className={styles.filterSecWrapper}>
                  {isEmpty(allDocumentsLink) ||
                    (isEmpty(filterDocuments) && (
                      <div className={styles.noDataFound}>
                        <span>No data found</span>
                      </div>
                    ))}
                  {filterDocuments?.map((obj: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className={
                          obj?.isSelected
                            ? styles.filterDefinitionSecSelected
                            : styles.filterDefinitionSec
                        }
                      >
                        <div style={{ width: "10%" }}>
                          <Checkbox
                            checkedIcon={<RadioButtonCheckedIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            key={index}
                            //   name={user?.value}
                            //   value={user?.sectionSelected}
                            checked={obj.isSelected}
                            //   id={user.value}
                            onClick={(ev) => {
                              onSelectDocument(obj.ID);
                              ev.preventDefault();
                            }}
                            size="small"
                          />
                        </div>
                        <div
                          onClick={(ev) => {
                            onSelectDocument(obj.ID);
                          }}
                          className={styles.title}
                        >
                          <span>{obj.documentName}</span>
                        </div>
                        <div className={styles.description}>
                          <span>{obj.FileRef}</span>
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
                            obj.isValid &&
                            obj.emptyField === "documentLink" &&
                            obj.documentLink === ""
                          }
                          errorMsg="Please enter document link"
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
                          href={obj.documentLink}
                          // target="_blank"
                          className={styles.documentLink}
                        >
                          {obj.documentLink}
                        </a>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "10px" }}>
                      {obj.isNew && (
                        <button className={styles.closeBtn}>
                          <img
                            src={checkBtn}
                            alt={"Add Document"}
                            onClick={() => checkinNewSupportingDocument(index)}
                          />
                        </button>
                      )}
                      {!currentSectionDetails?.sectionSubmitted &&
                        (currentDocRole?.primaryAuthor ||
                          currentDocRole?.sectionAuthor) && (
                          <button className={styles.closeBtn}>
                            <img
                              src={closeBtn}
                              alt={"Remove Document"}
                              onClick={() => removeSupportingDocument(index)}
                            />
                          </button>
                        )}
                    </div>
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
        <button className={"helpButton"}>Help?</button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            // margin: "10px 0px",
            justifyContent: "flex-end",
          }}
        >
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
          {(currentDocRole?.primaryAuthor || currentDocRole?.sectionAuthor) && (
            <>
              {(currentDocRole?.primaryAuthor ||
                currentDocRole?.reviewer ||
                currentDocRole?.approver) &&
                currentSectionDetails?.sectionSubmitted && (
                  <DefaultButton
                    text="Reject"
                    // disabled={sectionLoader}
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
                    text="Save and Close"
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
