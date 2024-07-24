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
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
const closeBtn = require("../../../../../assets/images/png/close.png");

import {
  getAllSectionDefinitions,
  getMasterDefinition,
  AddSectionDefinition,
  addNewDefinition,
} from "../../../../../services/ContentDevelopment/SectionDefinition/SectionDefinitionServices";

interface Props {
  documentId: number;
  sectionId: number;
}

interface IDefinitionDetails {
  ID: number | any;
  definitionName: string;
  IsValid: boolean;
  IsDuplicate: boolean;
  ErrorMsg: string;
  definitionDescription: string;
  referenceTitle: string;
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
];

const Definition: React.FC<Props> = ({ documentId, sectionId }) => {
  // initial definitions data
  const initialDefinitionsData = {
    ID: null,
    definitionName: "",
    IsValid: true,
    ErrorMsg: "",
    IsDuplicate: false,
    definitionDescription: "",
    referenceTitle: "",
    referenceAuthor: [],
    referenceLink: "",
    isApproved: true,
    isLoading: false,
  };
  const [sectionDefinitions, setSectionDefinitions] = useState<any[]>([]);
  const [filterDefinitions, setFilterDefinitions] = useState<any[]>([]);
  console.log("setFilterDefinitions: ", setFilterDefinitions);
  const [selectedDefinitions, setSelectedDefinitions] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");

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
    referenceAuthor: [],
    referenceLink: "",
    isApproved: true,
    isLoading: false,
  });
  console.log(
    selectedDefinitions,
    filterDefinitions,
    sectionDefinitions,
    definitionsData
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  const handleOnChange = (value: string | any, key: string): void => {
    if (key === "referenceAuthor") {
      console.log(value);
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

  const addNewSectionDefinition = async () => {
    let reRender = await addNewDefinition(
      definitionsData,
      documentId,
      sectionId
    );
    if (reRender) {
      togglePopupVisibility(setPopupController, 0, "close");
      getAllSecDefinitions();
    }
  };

  // array of obj which contains all popup inputs
  const popupInputs: any[] = [
    [
      <div key={1} className={styles.defWrapper}>
        <CustomInput
          size="MD"
          labelText="Definition Name"
          withLabel
          icon={false}
          secWidth="100%"
          value={definitionsData.definitionName}
          isValid={
            definitionsData.definitionName === "" && !definitionsData.IsValid
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
            definitionsData.definitionName !== "" && definitionsData.IsDuplicate
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
          value={definitionsData.definitionDescription}
          onChange={(value: any) => {
            handleOnChange(value, "definitionDescription");
          }}
          placeholder="Enter Description"
          isValid={
            definitionsData.definitionDescription === "" &&
            !definitionsData.IsValid
          }
          errorMsg={"The description field is required"}
          key={2}
        />
        <div key={3} className={styles.referenceWrapper}>
          <span>References</span>
          <CustomInput
            size="MD"
            labelText="Title"
            withLabel
            secWidth="100%"
            icon={false}
            value={definitionsData.referenceTitle}
            onChange={(value: any) => {
              handleOnChange(value, "referenceTitle");
            }}
            inputWrapperClassName={styles.referenceInput}
            placeholder="Enter here"
            isValid={
              definitionsData.referenceTitle === "" && !definitionsData.IsValid
            }
            errorMsg={"The references title field is required"}
            key={3}
          />
          <CustomPeoplePicker
            size="MD"
            minWidth={"265px"}
            withLabel
            labelText="Author"
            onChange={(value: any) => {
              handleOnChange(value, "referenceAuthor");
            }}
            selectedItem={definitionsData?.referenceAuthor[0]?.Email}
            placeholder="Add people"
            isValid={
              definitionsData.referenceAuthor.length === 0 &&
              !definitionsData.IsValid
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
            value={definitionsData.referenceLink}
            onChange={(value: any) => {
              handleOnChange(value, "referenceLink");
            }}
            placeholder="Enter here"
            isValid={
              definitionsData.referenceLink === "" && !definitionsData.IsValid
            }
            errorMsg={"The references Link field is required"}
            key={5}
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
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          addNewSectionDefinition();
        },
      },
    ],
  ];

  const handleSearchOnChange = (value: string): void => {
    console.log(value);
    setSearchValue(value);
    const filterValues = sectionDefinitions?.filter((obj: any) => {
      if (
        obj.definitionTitle.toLowerCase().includes(value.toLowerCase().trim())
      ) {
        return obj;
      }
    });
    setFilterDefinitions(filterValues);
  };

  const getMainDefinition = async (Data: any) => {
    let tempArray: any = await getMasterDefinition(Data);
    setSectionDefinitions(await tempArray);
  };

  const getAllSecDefinitions = async (): Promise<any> => {
    let tempArray: any = await getAllSectionDefinitions(documentId, sectionId);
    setSelectedDefinitions(await tempArray);
    getMainDefinition(tempArray);
  };

  const onSelectDefinition = (id: number): void => {
    const tempArray = filterDefinitions;
    let tempSelectedDocuments = [...selectedDefinitions];
    const index = tempArray.findIndex((obj: any) => obj.ID === id);
    console.log(index);
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

  const submitSectionDefinition = async () => {
    let reRender = await AddSectionDefinition(
      [...selectedDefinitions],
      documentId,
      sectionId
    );
    if (reRender) {
      getAllSecDefinitions();
    }
  };

  const removeDefinition = (index: number) => {
    let tempSelectedDocuments = [...selectedDefinitions];
    tempSelectedDocuments[index].isDeleted = true;
    setSelectedDefinitions([...tempSelectedDocuments]);
  };

  useEffect(() => {
    getAllSecDefinitions();
  }, []);

  return (
    <div className={"sectionWrapper"}>
      <div className={styles.textPlayGround}>
        <div className={styles.definitionHeaderWrapper}>
          <span>Setup Header</span>
        </div>
        <div className={styles.filterMainWrapper}>
          <div className={styles.TopFilters}>
            <CustomInput
              value={searchValue}
              secWidth="257px"
              placeholder="Search definitions"
              onChange={(value: any) => {
                handleSearchOnChange(value);
              }}
            />
            <DefaultButton
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
        <div style={{ padding: "10px 0px" }}>
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
                  <button className={styles.closeBtn}>
                    <img
                      src={closeBtn}
                      onClick={() => removeDefinition(index)}
                    />
                  </button>
                </div>
              )
            );
          })}
        </div>
        {popupController?.map((popupData: any, index: number) => (
          <Popup
            key={index}
            isLoading={definitionsData?.isLoading}
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

      <div
        style={{
          display: "flex",
          gap: "15px",
          margin: "10px 0px",
          justifyContent: "end",
        }}
      >
        <DefaultButton text="Close" btnType="lightGreyVariant" />
        <DefaultButton
          text="Reject"
          btnType="lightGreyVariant"
          onClick={() => {
            // _addData();
          }}
        />
        <DefaultButton
          text="Submit"
          btnType="primary"
          onClick={() => {
            submitSectionDefinition();
          }}
        />
      </div>
    </div>
  );
};

export default memo(Definition);
