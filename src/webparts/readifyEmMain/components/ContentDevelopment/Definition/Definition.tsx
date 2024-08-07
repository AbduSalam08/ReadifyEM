/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { memo, useEffect, useState } from "react";
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
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  getAllSectionDefinitions,
  getMasterDefinition,
  AddSectionDefinition,
  addNewDefinition,
  LoadDefinitionTableData,
} from "../../../../../services/ContentDevelopment/SectionDefinition/SectionDefinitionServices";
import { useNavigate } from "react-router-dom";
import { IPopupLoaders } from "../../../../../interface/MainInterface";
import { initialPopupLoaders } from "../../../../../config/config";
import AlertPopup from "../../common/Popups/AlertPopup/AlertPopup";
import { useDispatch, useSelector } from "react-redux";
import ToastMessage from "../../common/Toast/ToastMessage";
import { updateSectionDetails } from "../../../../../services/ContentDevelopment/SupportingDocument/SupportingDocumentServices";
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { addRejectedComment } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import SecondaryTextLabel from "../../common/SecondaryText/SecondaryText";

interface Props {
  documentId: number;
  sectionId: number;
  currentSectionDetails?: any;
  currentDocRole?: any;
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
];

const Definition: React.FC<Props> = ({
  documentId,
  sectionId,
  currentSectionDetails,
  currentDocRole,
}) => {
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
    (state: any) => state.SectionCommentsData.SectionComments
  );

  const initialDefinitionsData = {
    ID: null,
    definitionName: "",
    IsValid: true,
    ErrorMsg: "",
    IsDuplicate: false,
    definitionDescription: "",
    referenceTitle: "",
    referenceAuthorName: "",
    referenceAuthor: [],
    referenceLink: "",
    isApproved: true,
    isLoading: false,
  };
  const [sectionDefinitions, setSectionDefinitions] = useState<any[]>([]);
  const [filterDefinitions, setFilterDefinitions] = useState<any[]>([]);
  const [selectedDefinitions, setSelectedDefinitions] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [initialLoader, setInitialLoader] = useState(true);

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
    referenceAuthor: [],
    referenceLink: "",
    isApproved: true,
    isLoading: false,
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

  const validateSections = (): any => {
    // return true;
    const duplicateCheck = AllDefinitionData.filter((obj: any) => {
      return obj.definitionName === definitionsData.definitionName;
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
      } else if (definitionsData.referenceTitle === "") {
        setDefinitionsData((prev: any) => ({
          ...prev,
          IsValid: false,
          ErrorMsg: "referenceTitle",
        }));
      } else if (definitionsData.referenceAuthorName === "") {
        setDefinitionsData((prev: any) => ({
          ...prev,
          IsValid: false,
          ErrorMsg: "referenceAuthorName",
        }));
      } else if (definitionsData.referenceLink === "") {
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
    }
  };

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

  const addNewSectionDefinition = async (): Promise<any> => {
    if (validateSections()) {
      // Submit the form
      await addNewDefinition(
        definitionsData,
        documentId,
        sectionId,
        setPopupLoaders,
        setToastMessage,
        setSelectedDefinitions,
        setInitialLoader,
        setPopupController,
        togglePopupVisibility
      );
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
            mandatory={true}
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
            mandatory={true}
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
            mandatory={true}
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
            mandatory={true}
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
            labelText="Link"
            withLabel
            secWidth="100%"
            icon={false}
            mandatory={true}
            value={definitionsData.referenceLink}
            onChange={(value: any) => {
              handleOnChange(value, "referenceLink");
            }}
            placeholder="Enter here"
            isValid={
              definitionsData.referenceLink === "" &&
              !definitionsData.IsValid &&
              definitionsData.ErrorMsg === "referenceLink"
            }
            errorMsg={"The references Link field is required"}
            key={5}
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
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          submitSectionDefinition(true);
          // handleClosePopup(2);
          // await submitRejectedComment();
        },
      },
    ],
  ];

  const handleSearchOnChange = (value: string): void => {
    setSearchValue(value.trimStart());
    const filterValues = sectionDefinitions?.filter((obj: any) => {
      if (
        obj.definitionTitle.toLowerCase().includes(value.toLowerCase().trim())
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
    const sortedArray = tempSelectedDefinitionArray.sort(
      (a: any, b: any) => b.ID - a.ID
    );
    setSelectedDefinitions(await sortedArray);
    getMainDefinition(sortedArray);
  };

  const onSelectDefinition = (id: number): void => {
    const tempArray = filterDefinitions;
    let tempSelectedDocuments = [...selectedDefinitions];
    const index = tempArray.findIndex((obj: any) => obj.ID === id);
    const definitionObject = tempArray[index];
    definitionObject.isSelected = !definitionObject.isSelected;
    tempArray[index] = definitionObject;
    if (definitionObject.isSelected) {
      const isMatch = selectedDefinitions.some(
        (obj: any) => obj.definitionTitle === definitionObject.definitionTitle
      );
      if (isMatch) {
        const index = tempSelectedDocuments.findIndex((select: any) => {
          return select.definitionTitle === definitionObject.definitionTitle;
        });
        tempSelectedDocuments[index].isDeleted = false;
        setSelectedDefinitions([...tempSelectedDocuments]);
      } else {
        setSelectedDefinitions((prev: any) => {
          return [
            {
              ID: definitionObject.ID,
              definitionTitle: definitionObject.definitionTitle,
              definitionDescription: definitionObject.definitionDescription,
              referenceAuthor: definitionObject?.referenceAuthor,
              referenceLink: definitionObject.referenceLink,
              referenceTitle: definitionObject.referenceTitle,
              isSelected: false,
              isNew: false,
              status: true,
            },
            ...prev,
          ];
        });
      }
    } else {
      const isMatch = selectedDefinitions.some(
        (obj: any) => obj.definitionTitle === definitionObject.definitionTitle
      );
      if (isMatch) {
        const index = tempSelectedDocuments.findIndex((select: any) => {
          return select.definitionTitle === definitionObject.definitionTitle;
        });
        if (tempSelectedDocuments[index].status) {
          tempSelectedDocuments = tempSelectedDocuments.filter(
            (selectedObj: any) => {
              return (
                selectedObj.definitionTitle !== definitionObject.definitionTitle
              );
            }
          );
          setSelectedDefinitions([...tempSelectedDocuments]);
        } else {
          tempSelectedDocuments[index].isDeleted = true;
          setSelectedDefinitions([...tempSelectedDocuments]);
        }
      }
    }
    setFilterDefinitions([...tempArray]);
  };

  const submitSectionDefinition = async (
    submitCondition: boolean
  ): Promise<any> => {
    togglePopupVisibility(
      setPopupController,
      2,
      "close",
      "Are you sure want to submit this section?"
    );

    await AddSectionDefinition(
      [...selectedDefinitions],
      documentId,
      sectionId,
      setPopupLoaders,
      setToastMessage,
      setInitialLoader
    );

    if (submitCondition) {
      // getAllSelectedDocuments();
      await updateSectionDetails(sectionId, AllSectionsDataMain, dispatch);
    }
  };

  const removeDefinition = (index: number): any => {
    const tempSelectedDocuments = [...selectedDefinitions];
    tempSelectedDocuments[index].isDeleted = true;
    const filterSelectionDefinitions = sectionDefinitions.map((obj: any) => {
      if (
        obj.definitionTitle === tempSelectedDocuments[index].definitionTitle
      ) {
        return { ...obj, isDeleted: true, isSelected: false };
      } else {
        return obj;
      }
    });
    setSectionDefinitions([...filterSelectionDefinitions]);
    setSelectedDefinitions([...tempSelectedDocuments]);
  };

  useEffect(() => {
    getAllSecDefinitions();
    LoadDefinitionTableData(dispatch);
  }, []);

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
                  <div className={styles.inputmainSec}>
                    <CustomInput
                      value={searchValue}
                      secWidth="257px"
                      placeholder="Search definitions"
                      onChange={(value: any) => {
                        handleSearchOnChange(value);
                      }}
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
                    disabled={initialLoader}
                    btnType="primary"
                    text={"New"}
                    size="medium"
                    onClick={() => {
                      togglePopupVisibility(setPopupController, 0, "open");
                      setDefinitionsData(initialDefinitionsData);
                    }}
                  />
                </div>
                {searchValue !== "" && (
                  <div className={styles.filterSecWrapper}>
                    {isEmpty(filterDefinitions) && (
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
                        >
                          <div style={{ width: "10%" }}>
                            <Checkbox
                              checkedIcon={<RadioButtonCheckedIcon />}
                              icon={<RadioButtonUncheckedIcon />}
                              key={index}
                              checked={obj.isSelected}
                              onClick={(ev) => {
                                onSelectDefinition(obj.ID);
                                ev.preventDefault();
                              }}
                            />
                          </div>
                          <div
                            className={styles.title}
                            style={{ width: "30%" }}
                            onClick={(ev) => {
                              onSelectDefinition(obj.ID);
                              ev.preventDefault();
                            }}
                          >
                            <span>{obj.definitionTitle}</span>
                          </div>
                          <div
                            className={styles.description}
                            style={{ width: "60%" }}
                          >
                            <span>{obj.definitionDescription}</span>
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
              {selectedDefinitions.map((obj: any, index: number) => {
                return (
                  !obj.isDeleted && (
                    <div key={index} className={styles.SelectedDefinitionSec}>
                      <div style={{ width: "30%" }}>
                        <span className={styles.definitionTitle}>
                          {obj.definitionTitle}
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
                              onClick={() => removeDefinition(index)}
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
          <button className={"helpButton"}>Help?</button>

          <div
            style={{
              display: "flex",
              gap: "15px",
              // margin: "10px 0px",
              justifyContent: "flex-end",
              alignItems: "center",
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
              btnType="lightGreyVariant"
              onClick={() => {
                navigate(-1);
              }}
            />
            {(currentDocRole?.primaryAuthor ||
              currentDocRole?.sectionAuthor) && (
              <>
                {(currentDocRole?.primaryAuthor ||
                  currentDocRole?.reviewer ||
                  currentDocRole?.approver) &&
                  currentSectionDetails?.sectionSubmitted && (
                    <DefaultButton
                      text="Reject"
                      btnType="secondaryRed"
                      onClick={() =>
                        togglePopupVisibility(
                          setPopupController,
                          1,
                          "open",
                          "Reason for rejection"
                        )
                      }
                    />
                  )}
                {!currentSectionDetails?.sectionSubmitted && (
                  <>
                    <DefaultButton
                      text="Save and Close"
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
