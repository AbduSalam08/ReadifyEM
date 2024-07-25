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

import {
  getAllDocuments,
  getDocumentDeatils,
  getApprovedDocuments,
  submitSupportingDocuments,
} from "../../../../../services/ContentDevelopment/SupportingDocument/SupportingDocumentServices";
import { useNavigate } from "react-router-dom";

interface Props {
  documentId: number;
  sectionId: number;
}
interface documentDetails {
  ID: number;
  documentName: any;
  documentLink: any;
  isSelected: boolean;
  isNew: boolean;
  status: boolean;
  isDeleted: boolean;
}

const SupportingDocuments: React.FC<Props> = ({ documentId, sectionId }) => {
  const navigate = useNavigate();
  // initial definitions data
  const [allDocumentsLink, setAllDocumentsLink] = useState<any[]>([]);
  const [filterDocuments, setFilterDocuments] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<documentDetails[]>(
    []
  );
  const [searchValue, setSearchValue] = useState("");
  console.log(selectedDocuments, filterDocuments);

  const handleSearchOnChange = (value: string): any => {
    console.log(value);
    setSearchValue(value);
    const filterValues = allDocumentsLink?.filter((obj: any) => {
      if (obj.FileRef.toLowerCase().includes(value.toLowerCase().trim())) {
        return obj;
      }
    });
    setFilterDocuments(filterValues);
  };

  const getApprovedDocumentsLinks = async (documents: any) => {
    let approvedDocuments: any = await getApprovedDocuments(documents);
    setAllDocumentsLink(approvedDocuments);
  };

  const getMainDocumentDeatails = async (Data: any[]) => {
    let tempDocumentsDetails: any = await getDocumentDeatils(Data);
    getApprovedDocumentsLinks(tempDocumentsDetails);
  };

  const getAllSelectedDocuments = async () => {
    let tempSelectedDocumentsArray: any = await getAllDocuments(
      sectionId,
      documentId
    );
    setSelectedDocuments([...tempSelectedDocumentsArray]);
    getMainDocumentDeatails([...tempSelectedDocumentsArray]);
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
    tempArray.unshift({
      ID: selectedDocuments.length + 1,
      documentName: "Document six",
      documentLink: "Document six Link",
      isSelected: false,
      isNew: true,
      status: true,
      isDeleted: false,
    });
    setSelectedDocuments([...tempArray]);
  };

  const checkinNewSupportingDocument = (index: number) => {
    let tempSelectedDocuments = [...selectedDocuments];
    tempSelectedDocuments[index].isNew = false;
    setSelectedDocuments([...tempSelectedDocuments]);
  };
  const removeSupportingDocument = (index: number) => {
    let tempSelectedDocuments = [...selectedDocuments];
    tempSelectedDocuments[index].isDeleted = true;
    setSelectedDocuments([...tempSelectedDocuments]);
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
    setSelectedDocuments([...index]);
  };

  useEffect(() => {
    getAllSelectedDocuments();
  }, []);

  const submitSupDocuments = async () => {
    let reRender: boolean = await submitSupportingDocuments(
      [...selectedDocuments],
      documentId,
      sectionId
    );
    if (reRender) {
      getAllSelectedDocuments();
    }
  };

  return (
    <div className="sectionWrapper">
      <div className={styles.textPlayGround}>
        <div className={styles.definitionHeaderWrapper}>
          <span>Add supporting documents links</span>
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
        <div className={styles.filterMainWrapper}>
          <div className={styles.inputmainSec}>
            <CustomInput
              value={searchValue}
              placeholder="Search Documents"
              onChange={(value: any) => {
                handleSearchOnChange(value);
              }}
              secWidth="257px"
              // clearBtn
            />
            <button className={styles.closeBtn}>
              <img
                src={closeBtn}
                alt={"Add Document"}
                onClick={() => setSearchValue("")}
              />
            </button>
          </div>
          <DefaultButton
            btnType="primary"
            text={"New"}
            size="medium"
            onClick={() => {
              // togglePopupVisibility(setPopupController, 0, "open");
              //   setDefinitionsData(initialDefinitionsData);
              AddNewDocument();
            }}
          />
          {searchValue !== "" && (
            <div className={styles.filterSecWrapper}>
              {filterDocuments.map((obj: any, index: number) => {
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
                    <button className={styles.closeBtn}>
                      <img
                        src={closeBtn}
                        alt={"Remove Document"}
                        onClick={() => removeSupportingDocument(index)}
                      />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      {/* <div
        style={{
          display: "flex",
          gap: "15px",
          margin: "10px 0px",
          justifyContent: "end",
        }}
      >
        <DefaultButton
          text="Close"
          btnType="lightGreyVariant"
          onClick={() => {
            navigate(-1);
          }}
        />
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
            submitSupDocuments();
          }}
        />
      </div> */}

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
          <DefaultButton
            text="Close"
            btnType="lightGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
          />
          {/* <DefaultButton
          text="Reject"
          btnType="lightGreyVariant"
          onClick={() => {
            // _addData();
          }}
        /> */}
          <DefaultButton
            text="Submit"
            btnType="primary"
            onClick={() => {
              submitSupDocuments();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(SupportingDocuments);
