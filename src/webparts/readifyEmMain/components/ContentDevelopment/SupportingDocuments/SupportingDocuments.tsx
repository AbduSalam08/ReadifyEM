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

  const handleSearchOnChange = (value: string): any => {
    console.log(value);
    setSearchValue(value);
    const filterValues = allDefinitions?.filter((obj: any) => {
      if (obj.title.toLowerCase().includes(value.toLowerCase().trim())) {
        return obj;
      }
    });
    setFilterDefinitions(filterValues);
  };

  const getAllDefinition = async (): Promise<any> => {
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
        const tempArray: definitionDetails[] = [];
        const tempSelectedDocumentsArray: documentDetails[] = [
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

  const onSelectDefinition = (id: number): void => {
    const tempArray = allDefinitions;
    const index = tempArray.findIndex((obj: any) => obj.ID === id);
    console.log(index);
    const definitionObject = tempArray[index];
    definitionObject.isSelected = !definitionObject.isSelected;
    tempArray[index] = definitionObject;
    setAllDefinitions([...tempArray]);
  };

  const AddNewDocument = (): any => {
    const tempArray = selectedDocuments;
    tempArray.unshift({
      ID: selectedDocuments.length + 1,
      documentName: "Document six",
      documentLink: "Document six Link",
      isSelected: false,
      isNew: true,
    });
    setAllDefinitions([...tempArray]);
  };

  const documentOnchange = (value: string, id: number, key: string): void => {
    // console.log(value, id);
    const tempArray: any[] = [...selectedDocuments];
    const index = tempArray.map((obj: any) => {
      if (obj.ID === id) {
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
    <div className="sectionWrapper">
      <div className={styles.textPlayGround}>
        <div className={styles.definitionHeaderWrapper}>
          <span>Add supporting documents links</span>
          <DefaultButton
            btnType="primary"
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
            secWidth="257px"
          />
          {searchValue !== "" && (
            <div className={styles.filterSecWrapper}>
              {filterDefinitions.map((obj: any, index: number) => {
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
                    <div className={styles.title}>
                      <span>{obj.title}</span>
                    </div>
                    <div className={styles.description}>
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
                      // target="_blank"
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
