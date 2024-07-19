/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
import { memo, useEffect, useState } from "react";
import styles from "./SupportingDocuments.module.scss";
// import { RadioButton } from "primereact/radiobutton";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import Popup from "../../common/Popups/Popup";
// import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import DefaultButton from "../../common/Buttons/DefaultButton";
import SpServices from "../../../../../services/SPServices/SpServices";
// import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
// import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
const closeBtn = require("../../../../../assets/images/png/close.png");

interface Props {
  ID: number;
}
interface definitionDetails {
  ID: number;
  title: any;
  description: any;
  isSelected: boolean;
}
interface documentDetails {
  ID: number;
  documentName: any;
  documentLink: any;
  isSelected: boolean;
  isNew: boolean;
}
interface IDefinitionDetails {
  ID: number | null;
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
// const initialPopupController = [
//   {
//     open: false,
//     popupTitle: "Add New Definition",
//     popupWidth: "550px",
//     popupType: "custom",
//     defaultCloseBtn: false,
//     popupData: "",
//   },
// ];

const SupportingDocuments: React.FC<Props> = ({ ID }) => {
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
  const [allDefinitions, setAllDefinitions] = useState<any[]>([]);
  const [filterDefinitions, setFilterDefinitions] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");

  // popup view and actions controller
  //   const [popupController, setPopupController] = useState(
  //     initialPopupController
  //   );

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
  console.log(definitionsData, selectedDocuments, filterDefinitions);

  // util for closing popup
  //   const handleClosePopup = (index?: any): void => {
  //     togglePopupVisibility(setPopupController, index, "close");
  //   };

  //   const handleOnChange = (value: string | any, key: string): void => {
  //     if (key === "referenceAuthor") {
  //       console.log(value);
  //       setDefinitionsData((prev: any) => ({
  //         ...prev,
  //         referenceAuthor:
  //           value.length > 0
  //             ? [{ Id: value[0]?.id, Email: value[0]?.secondaryText }]
  //             : [],
  //       }));
  //     } else {
  //       setDefinitionsData((prev: any) => ({
  //         ...prev,
  //         [key]: value,
  //         IsDuplicate: false,
  //       }));
  //     }
  //   };

  // array of obj which contains all popup inputs
  //   const popupInputs: any[] = [
  //     [
  //       <div key={1} className={styles.defWrapper}>
  //         <CustomInput
  //           size="MD"
  //           labelText="Definition Name"
  //           withLabel
  //           icon={false}
  //           value={definitionsData.definitionName}
  //           isValid={
  //             definitionsData.definitionName === "" && !definitionsData.IsValid
  //               ? true
  //               : definitionsData.definitionName !== "" &&
  //                 definitionsData.IsDuplicate
  //               ? true
  //               : false
  //           }
  //           onChange={(value: any) => {
  //             handleOnChange(value, "definitionName");
  //           }}
  //           placeholder="Enter here"
  //           // isValid={!definitionsData.IsValid}
  //           errorMsg={
  //             definitionsData.definitionName !== "" && definitionsData.IsDuplicate
  //               ? definitionsData.ErrorMsg
  //               : "The definition name field is required"
  //           }
  //           key={1}
  //         />
  //         <CustomTextArea
  //           size="MD"
  //           labelText="Description"
  //           withLabel
  //           icon={false}
  //           mandatory={true}
  //           value={definitionsData.definitionDescription}
  //           onChange={(value: any) => {
  //             handleOnChange(value, "definitionDescription");
  //           }}
  //           placeholder="Enter Description"
  //           isValid={
  //             definitionsData.definitionDescription === "" &&
  //             !definitionsData.IsValid
  //           }
  //           errorMsg={"The description field is required"}
  //           key={2}
  //         />
  //         <div key={3} className={styles.referenceWrapper}>
  //           <span>References</span>
  //           <CustomInput
  //             size="MD"
  //             labelText="Title"
  //             withLabel
  //             icon={false}
  //             value={definitionsData.referenceTitle}
  //             onChange={(value: any) => {
  //               handleOnChange(value, "referenceTitle");
  //             }}
  //             inputWrapperClassName={styles.referenceInput}
  //             placeholder="Enter here"
  //             isValid={
  //               definitionsData.referenceTitle === "" && !definitionsData.IsValid
  //             }
  //             errorMsg={"The references title field is required"}
  //             key={3}
  //           />
  //           <CustomPeoplePicker
  //             size="MD"
  //             minWidth={"265px"}
  //             withLabel
  //             labelText="Author"
  //             onChange={(value: any) => {
  //               handleOnChange(value, "referenceAuthor");
  //             }}
  //             selectedItem={definitionsData?.referenceAuthor[0]?.Email}
  //             placeholder="Add people"
  //             isValid={
  //               definitionsData.referenceAuthor.length === 0 &&
  //               !definitionsData.IsValid
  //             }
  //             errorMsg={"The reference author field is required"}
  //             key={4}
  //           />
  //           <CustomInput
  //             size="MD"
  //             labelText="Link"
  //             withLabel
  //             icon={false}
  //             value={definitionsData.referenceLink}
  //             onChange={(value: any) => {
  //               handleOnChange(value, "referenceLink");
  //             }}
  //             placeholder="Enter here"
  //             isValid={
  //               definitionsData.referenceLink === "" && !definitionsData.IsValid
  //             }
  //             errorMsg={"The references Link field is required"}
  //             key={5}
  //           />
  //         </div>
  //       </div>,
  //     ],
  //   ];

  // array of obj which contains all popup action buttons
  //   const popupActions: any[] = [
  //     [
  //       {
  //         text: "Cancel",
  //         btnType: "darkGreyVariant",
  //         disabled: false,
  //         endIcon: false,
  //         startIcon: false,
  //         onClick: () => {
  //           handleClosePopup(0);
  //         },
  //       },
  //       {
  //         text: "Submit",
  //         btnType: "primary",
  //         disabled: false,
  //         endIcon: false,
  //         startIcon: false,
  //         onClick: () => {
  //           // handleSubmit();
  //         },
  //       },
  //     ],
  //   ];

  const handleSearchOnChange = (value: string) => {
    console.log(value);
    setSearchValue(value);
    let filterValues = allDefinitions?.filter((obj: any) => {
      if (obj.title.toLowerCase().includes(value.toLowerCase().trim())) {
        return obj;
      }
    });
    setFilterDefinitions(filterValues);
  };

  const getAllDefinition = async () => {
    await SpServices.SPReadItems({
      Listname: "Definition",
      Select: "*",
      Expand: "",
      Filter: [
        {
          FilterKey: "isApproved",
          Operator: "eq",
          FilterValue: 1,
        },
      ],
    })
      .then((res: any[]) => {
        let tempArray: definitionDetails[] = [];
        let tempSelectedDocumentsArray: documentDetails[] = [
          {
            ID: 1,
            documentName: "Document one",
            documentLink: "Document one Link",
            isSelected: true,
            isNew: false,
          },
          {
            ID: 3,
            documentName: "Document two",
            documentLink: "Document two Link",
            isSelected: true,
            isNew: false,
          },
          {
            ID: 4,
            documentName: "Document three",
            documentLink: "Document three Link",
            isSelected: true,
            isNew: false,
          },
          {
            ID: 5,
            documentName: "Document four",
            documentLink: "Document four Link",
            isSelected: true,
            isNew: false,
          },
          {
            ID: 6,
            documentName: "Document five",
            documentLink: "Document five Link",
            isSelected: true,
            isNew: false,
          },
        ];
        res?.forEach((item: any) => {
          tempArray.push({
            ID: item.ID,
            title: item.Title,
            description: item.description,
            isSelected: false,
          });
        });
        setAllDefinitions([...tempArray]);
        setSelectedDocuments([...tempSelectedDocumentsArray]);
      })
      .catch((err) => console.log(err));
  };

  const onSelectDefinition = (id: number) => {
    let tempArray = allDefinitions;
    let index = tempArray.findIndex((obj: any) => obj.ID == id);
    console.log(index);
    let definitionObject = tempArray[index];
    definitionObject.isSelected = !definitionObject.isSelected;
    tempArray[index] = definitionObject;
    setAllDefinitions([...tempArray]);
  };

  const AddNewDocument = () => {
    let tempArray = selectedDocuments;
    tempArray.unshift({
      ID: selectedDocuments.length + 1,
      documentName: "Document six",
      documentLink: "Document six Link",
      isSelected: false,
      isNew: true,
    });
    setAllDefinitions([...tempArray]);
  };

  const documentOnchange = (value: string, id: number, key: string) => {
    console.log(value, id);
    let tempArray: any[] = [...selectedDocuments];
    let index = tempArray.map((obj: any) => {
      if (obj.ID == id) {
        obj[key] = value;
        return obj;
      } else {
        return obj;
      }
    });
    setAllDefinitions([...index]);
  };

  useEffect(() => {
    getAllDefinition();
  }, []);

  return (
    <div>
      <div className={styles.textPlayGround}>
        <div className={styles.definitionHeaderWrapper}>
          <span>Add supporting documents links</span>
          <DefaultButton
            btnType="primaryBlue"
            text={"New"}
            size="medium"
            onClick={() => {
              // togglePopupVisibility(setPopupController, 0, "open");
              setDefinitionsData(initialDefinitionsData);
              AddNewDocument();
            }}
          />
        </div>
        <div className={styles.filterMainWrapper}>
          <CustomInput
            value={searchValue}
            placeholder="Search Documents"
            onChange={(value: any) => {
              handleSearchOnChange(value);
            }}
          />
          {searchValue !== "" && (
            <div className={styles.filterSecWrapper}>
              {filterDefinitions.map((obj: any, index: number) => {
                return (
                  <div key={index} className={styles.filterDefinitionSec}>
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
                          onSelectDefinition(obj.ID);
                          ev.preventDefault();
                        }}
                      />
                      {/* <RadioButton
                      inputId="ingredient1"
                      name="pizza"
                      value="Cheese"
                      onClick={(ev) => {
                        onSelectDefinition(obj.ID);
                        ev.preventDefault();
                      }}
                      checked={obj.isSelected}
                    />
                    <label htmlFor="ingredient1" className="ml-2">
                      {obj.title}
                    </label> */}
                    </div>
                    <div style={{ width: "30%" }}>
                      <span>{obj.title}</span>
                    </div>
                    <div style={{ width: "60%" }}>
                      <span>{obj.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div style={{ padding: "10px 0px" }}>
          {selectedDocuments.map((obj: any, index: number) => {
            return (
              <div
                key={index}
                className={styles.SelectedDocumentsSec}
                style={{ backgroundColor: obj.isNew ? "#593ABB10" : "" }}
              >
                {obj.isNew ? (
                  <div className={styles.documentInputSec}>
                    <CustomInput
                      onChange={(value: string) => {
                        documentOnchange(value, obj.ID, "documentName");
                      }}
                      value={obj.documentName}
                      placeholder="Enter here"
                      withLabel
                      labelText="Document Name"
                      topLabel
                    />
                    <CustomInput
                      onChange={(value: string) => {
                        documentOnchange(value, obj.ID, "documentLink");
                      }}
                      value={obj.documentLink}
                      placeholder="Enter here"
                      withLabel
                      labelText="Document Link"
                      topLabel
                    />
                  </div>
                ) : (
                  <div style={{ width: "90%" }}>
                    <p className={styles.documentName}>{obj.documentName}</p>
                    <a
                      href={obj.documentLink}
                      target="_blank"
                      className={styles.documentLink}
                    >
                      {obj.documentLink}
                    </a>
                  </div>
                )}
                <div>
                  <button className={styles.closeBtn}>
                    <img src={closeBtn} alt={"back to my tasks"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* {popupController?.map((popupData: any, index: number) => (
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
      ))} */}
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
            // _addData();
          }}
        />
      </div>
    </div>
  );
};

export default memo(SupportingDocuments);
