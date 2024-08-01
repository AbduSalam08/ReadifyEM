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
  isValid: boolean;
}

const SupportingDocuments: React.FC<Props> = ({ documentId, sectionId }) => {
  const navigate = useNavigate();
  // initial definitions data
  const [allDocumentsLink, setAllDocumentsLink] = useState<any[]>([]);
  const [filterDocuments, setFilterDocuments] = useState<any[]>([]);
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
    tempArray.unshift({
      ID: selectedDocuments.length + 1,
      documentName: "",
      documentLink: "",
      isSelected: false,
      isNew: true,
      status: true,
      isDeleted: false,
      isValid: false,
    });
    setSelectedDocuments([...tempArray]);
  };

  const checkinNewSupportingDocument = (index: number) => {
    const tempSelectedDocuments = [...selectedDocuments];
    if (
      tempSelectedDocuments[index].documentName !== "" &&
      tempSelectedDocuments[index].documentLink !== ""
    ) {
      tempSelectedDocuments[index].isNew = false;
    } else {
      tempSelectedDocuments[index].isValid = true;
    }
    setSelectedDocuments([...tempSelectedDocuments]);
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
        obj[key] = value;
        if (key === "documentName" && value !== "") {
          if (obj.documentLink !== "") {
            obj.isValid = false;
          } else {
            obj.isValid = true;
          }
        } else if (key === "documentLink" && value !== "") {
          if (obj.documentName !== "") {
            obj.isValid = false;
          } else {
            obj.isValid = true;
          }
        } else {
          obj["isValid"] = true;
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
      await updateSectionDetails(sectionId);
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
              //   setDefinitionsData(initialDefinitionsData);
              AddNewDocument();
            }}
          />
          {searchValue !== "" && (
            <div className={styles.filterSecWrapper}>
              {isEmpty(allDocumentsLink) && isEmpty(filterDocuments) && (
                <div className={styles.noDataFound}>
                  <span>No data found</span>
                </div>
              )}
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
        </div>{" "}
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
                          isValid={obj.isValid && obj.documentName === ""}
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
                          isValid={obj.isValid && obj.documentLink === ""}
                          errorMsg="Please enter document link"
                          topLabel
                        />
                      </div>
                    ) : (
                      <div style={{ width: "90%" }}>
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
        )}
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
          <DefaultButton
            text="Close"
            btnType="darkGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
          />
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
              await submitSupDocuments(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(SupportingDocuments);