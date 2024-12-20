/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// import { memo, useEffect, useState } from "react";
import styles from "./SetupHeader.module.scss";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import DefaultButton from "../../common/Buttons/DefaultButton";
import { FileUpload } from "primereact/fileupload";
import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import "./SetupHeader.css";
import { useNavigate } from "react-router-dom";
import { LISTNAMES } from "../../../../../config/config";
import {
  // addAppendixHeaderAttachmentData,
  addHeaderAttachmentData,
  getSectionData,
  getSectionDataFromAppendixList,
  updateDocDataLocal,
} from "../../../../../utils/contentDevelopementUtils";
import { getHeaderSectionDetails } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
// import { ChevronRight } from "@mui/icons-material";
const sampleDocHeaderImg: any = require("../../../../../assets/images/png/imagePlaceholder.png");
import CloseIcon from "@mui/icons-material/Close";
import { removeVersionFromDocName } from "../../../../../utils/formatDocName";
import SpServices from "../../../../../services/SPServices/SpServices";
import { sp } from "@pnp/sp";
import { setCDDocDetails } from "../../../../../redux/features/ContentDevloperSlice";

interface Props {
  sectionDetails: any;
  version: string;
  type: string;
  headerTitle: string;
  appendixName?: string;
  primaryAuthorDefaultHeader?: boolean;
  noActionBtns?: boolean;
  appendixSection?: boolean;
  footerTitle?: boolean;
  currentDocRole?: any;
  onChange?: (value: any) => void;
  // onChange?: any;
  currentDocDetailsData?: any;
}

const SetupHeader: React.FC<Props> = ({
  version,
  type,
  headerTitle,
  primaryAuthorDefaultHeader,
  noActionBtns,
  appendixSection,
  appendixName,
  footerTitle,
  sectionDetails,
  onChange,
  currentDocRole,
  currentDocDetailsData,
}) => {
  const fileUploadRef = useRef<any>(null);
  const dispatch = useDispatch();
  const initialHeaderDetails = {
    version: version,
    type: type,
    headerTitle: headerTitle,
    appendixName: appendixName,
    footerTitle: footerTitle,
  };
  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });
  const CDHeaderDetails = useSelector(
    (state: any) => state.ContentDeveloperData.CDHeaderDetails
  );
  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );
  const tenantUrl: any = useSelector(
    (state: any) => state?.MainSPContext?.tenantUrl
  );
  const [totalSize, setTotalSize] = useState(0);
  const [sectionLoader, setSectionLoader] = useState(true);
  // const [expandHeader, setExpandHeader] = useState(true);
  const [file, setFile] = useState<{
    fileData: any;
    fileName: string;
  }>({
    fileData: [],
    fileName: "",
  });
  console.log("file", file);

  const [details, setDetails] = useState({
    footerTitle: footerTitle,
    footerValidation: false,
  });

  const navigate = useNavigate();

  const onTemplateSelect = (e: any): void => {
    let _totalSize = totalSize;
    const files = e.files;
    const extension: string = files[0]?.name
      ?.split(".")
      .slice(-1)[0]
      ?.toLowerCase();
    if (
      extension === "png" ||
      extension === "svg" ||
      extension === "jpg" ||
      extension === "jpeg"
    ) {
      Object.keys(files).forEach((key) => {
        _totalSize += files[key].size || 0;
      });
      setTotalSize(_totalSize);
      setFile({
        fileData: files[0],
        // fileName: `headerImg.${files[0]?.name?.split(".").slice(-1)[0]}`,
        fileName: `${files[0]?.name}`,
      });
      if (onChange) {
        onChange({
          fileData: files[0],
          // fileName: `headerImg.${files[0]?.name?.split(".").slice(-1)[0]}`,
          fileName: `${files[0]?.name}`,
        });
      }
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Invalid file format!",
        message: `${
          files[0]?.name?.split(".").slice(-1)[0]
        } format is not suppoted.`,
        duration: 3000,
      });
    }
  };

  const onTemplateClear = (): void => {
    setTotalSize(0);
    setFile({
      fileData: [],
      fileName: "",
    });
    // Clear the file upload component as well
    if (fileUploadRef.current) {
      fileUploadRef.current.clear(); // This clears the uploaded file from the UI
    }
    if (onChange) {
      onChange({
        fileData: [],
        fileName: "",
      });
    }
  };

  const onTemplateRemove = (file: any, callback: any): void => {
    setTotalSize(totalSize - file.size);
    setFile({
      fileData: [],
      fileName: "",
    });
    callback();
  };

  const itemTemplate = (fileData: any, props: any): any => {
    // const extension: string =
    //   fileData?.name?.split(".").slice(-1)[0] ||
    //   CDHeaderDetails?.fileName?.split(".").slice(-1)[0] ||
    //   fileData.name?.split(".").slice(-1)[0];
    // if (
    //   extension === "png" ||
    //   extension === "svg" ||
    //   extension === "jpg" ||
    //   extension === "jpeg"
    // ) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <img
            alt={file?.fileName ? file?.fileName : fileData.name}
            role="presentation"
            src={
              file.fileData?.ServerRelativeUrl
                ? file.fileData?.ServerRelativeUrl
                : fileData?.objectURL
                ? fileData?.objectURL
                : CDHeaderDetails?.imgURL
                ? CDHeaderDetails?.imgURL
                : `${tenantUrl}/${file.fileData?.ServerRelativeUrl}`
            }
            width={"100%"}
            style={{
              height: "150px",
            }}
          />
          {currentDocRole?.primaryAuthor && !appendixSection ? (
            <span className={styles.selectedFileName}>
              <p>
                {file?.fileName
                  ? file?.fileName
                  : fileData.name ||
                    file.fileData?.FileName ||
                    CDHeaderDetails?.fileName}
              </p>
              <Button
                type="button"
                icon="pi pi-times"
                className="p-button-outlined p-button-rounded p-button-danger ml-auto imageDeleteBtn"
                onClick={() => {
                  !props?.onRemove
                    ? setFile((prev: any) => ({
                        ...prev,
                        fileData: [],
                      }))
                    : onTemplateRemove(file, props.onRemove);
                }}
              />
            </span>
          ) : appendixSection && !sectionDetails?.sectionSubmitted ? (
            <span className={styles.selectedFileName}>
              <p>
                {file?.fileName
                  ? file?.fileName
                  : fileData.name ||
                    file.fileData?.FileName ||
                    CDHeaderDetails?.fileName}
              </p>
              <Button
                type="button"
                icon="pi pi-times"
                className="p-button-outlined p-button-rounded p-button-danger ml-auto imageDeleteBtn"
                onClick={() => {
                  !props?.onRemove
                    ? setFile((prev: any) => ({
                        ...prev,
                        fileData: [],
                        noContent: true,
                      }))
                    : onTemplateRemove(file, props.onRemove);
                }}
              />
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    );
    // } else {
    //   return emptyTemplate();
    // }
  };

  const emptyTemplate = (): JSX.Element | null => {
    if (!appendixSection) {
      return (
        <>
          {currentDocRole.primaryAuthor ? (
            <div className="flex align-items-center flex-column fileUploadSection">
              {/* <i
                className="pi pi-plus mt-3 p-5"
                style={{
                  fontSize: "5em",
                  borderRadius: "50%",
                  backgroundColor: "#e8e6e6",
                  color: "#c5c3c3",
                }}
              /> */}
              <p className="emptyMsgOfDND">Browse or drag and drop image</p>
            </div>
          ) : (
            <div className="flex align-items-center flex-column fileUploadSection">
              <img src={sampleDocHeaderImg} alt="No header image found!" />
            </div>
          )}
        </>
      );
    } else {
      return sectionDetails?.sectionSubmitted ? (
        <div className="flex align-items-center flex-column fileUploadSection">
          <img src={sampleDocHeaderImg} alt="No header image found!" />
        </div>
      ) : (
        <div className="flex align-items-center flex-column fileUploadSection">
          {/* <i
            className="pi pi-plus mt-3 p-5"
            style={{
              fontSize: "5em",
              borderRadius: "50%",
              backgroundColor: "#e8e6e6",
              color: "#c5c3c3",
            }}
          /> */}{" "}
          <p className="emptyMsgOfDND">Browse or drag and drop image</p>
        </div>
      );
    }
  };

  const headerTemplate = (options: any): any => {
    const { className, chooseButton } = options;

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <p className={styles.uploadLabel}>Document Logo</p>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
          }}
        >
          <div className="uploadImageSec">Upload Image</div>
          {chooseButton}
        </div>
      </div>
    );
  };

  const setFileDataInitial = (data: any): any => {
    setFile(data);
    if (onChange) {
      onChange(data);
    }
  };

  useEffect(() => {
    if (!appendixSection) {
      setSectionLoader(true);
      const getDataPromise: Promise<any> = getSectionData(
        sectionDetails,
        setFileDataInitial
      );
      Promise.all([getDataPromise])
        .then(() => {
          setSectionLoader(false);
        })
        .catch(() => {
          setSectionLoader(false);
        });
    } else {
      getSectionDataFromAppendixList(sectionDetails, setFileDataInitial);
    }
  }, [sectionDetails]);

  useEffect(() => {
    sp.web.lists
      .getByTitle(LISTNAMES.DocumentDetails)
      .items.getById(currentDocDetailsData?.documentDetailsID)
      .get()
      .then((res: any) => {
        const resp = res[0] || res;
        setDetails((prev: any) => ({
          ...prev,
          footerTitle: resp?.footerTitle,
        }));
      })
      .catch((err: any) => {
        console.log("Error : ", err);
      });
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(file);
    }
  }, [file]);

  return (
    <div className={styles.textPlayGround}>
      <div
        className={
          primaryAuthorDefaultHeader
            ? styles.headerWrapper
            : styles.headerWrapperAppendix
        }
        // onClick={() => {
        //   setExpandHeader(!expandHeader);
        // }}
      >
        {/* {!primaryAuthorDefaultHeader && (
          <ChevronRight
            style={{
              transform: !expandHeader ? "rotate(0deg)" : "rotate(90deg)",
              transition: ".2s all",
              marginRight: "5px",
            }}
          />
        )} */}
        <span>
          {currentDocRole?.primaryAuthor ? "Setup" : "Document"} Header
        </span>
      </div>
      {sectionLoader && !appendixSection ? (
        <div className="contentDevLoaderWrapper">
          <CircularSpinner />
        </div>
      ) : (
        <div
          className={
            // expandHeader
            //   ? styles.setupHeaderWrapperExpanded
            //   : styles.setupHeaderWrapper
            styles.setupHeaderWrapperExpanded
          }
        >
          <div className={styles.logoUploadWrapper}>
            <FileUpload
              ref={fileUploadRef}
              multiple={false}
              accept="image/*"
              maxFileSize={1000000}
              onSelect={onTemplateSelect}
              onClear={onTemplateClear}
              headerTemplate={
                currentDocRole?.primaryAuthor && !appendixSection
                  ? headerTemplate
                  : appendixSection && !sectionDetails?.sectionSubmitted
                  ? headerTemplate
                  : null
              }
              itemTemplate={itemTemplate}
              emptyTemplate={
                file.fileData?.ServerRelativeUrl ||
                (CDHeaderDetails?.imgURL && file.fileData?.length !== 0)
                  ? itemTemplate
                  : emptyTemplate
              }
              chooseLabel="Browse"
            />
          </div>
          <div className={styles.headerDetailsWrapper}>
            <CustomInput
              value={removeVersionFromDocName(initialHeaderDetails.headerTitle)}
              labelText="Header Title"
              withLabel
              topLabel
              secWidth="307px"
              readOnly={true}
            />
            {appendixSection && (
              <CustomInput
                value={initialHeaderDetails.appendixName}
                labelText="Appendix Name"
                withLabel
                topLabel
                secWidth="307px"
                readOnly={true}
              />
            )}
            <CustomInput
              value={initialHeaderDetails.type}
              labelText="Document Type"
              withLabel
              topLabel
              secWidth="307px"
              readOnly={true}
            />
            <CustomInput
              value={initialHeaderDetails.version}
              labelText="Current Version"
              withLabel
              topLabel
              secWidth="307px"
              readOnly={true}
            />
            <CustomInput
              value={details.footerTitle}
              labelText="Footer Title"
              withLabel
              // autoFocus
              readOnly={!currentDocRole?.primaryAuthor}
              placeholder="Enter here"
              topLabel
              secWidth="307px"
              onChange={(value: any) => {
                if (value.trimStart().length < 51) {
                  setDetails((prev: any) => ({
                    ...prev,
                    footerTitle: value,
                    footerValidation: false,
                  }));
                } else {
                  setDetails((prev: any) => ({
                    ...prev,
                    footerValidation: true,
                  }));
                }
              }}
              isValid={details.footerValidation}
              errorMsg="Footer title should not exceed 50 characters"
              // readOnly={true}
            />
            {!noActionBtns && currentDocRole?.primaryAuthor && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  gap: "10px",
                  marginTop: "30px",
                }}
              >
                <DefaultButton
                  text={<CloseIcon sx={{ Padding: "0px" }} />}
                  title="Close"
                  onlyIcon={true}
                  btnType="darkGreyVariant"
                  onClick={() => {
                    navigate(-1);
                  }}
                />
                <DefaultButton
                  text="Submit"
                  btnType="primary"
                  onClick={async () => {
                    debugger;
                    // if (appendixSection) {
                    //   await updatea(
                    //     "submit",
                    //     sectionDetails,
                    //     file
                    //   );
                    // } else {
                    if (file?.fileName === "") {
                      setToastMessage({
                        isShow: true,
                        severity: "warn",
                        title: "Image empty submission!",
                        message:
                          "A unexpected submission! please upload header image.",
                        duration: 3000,
                      });
                      return null;
                    }

                    setSectionLoader(true);

                    const dataAdded: Promise<any> =
                      await addHeaderAttachmentData(
                        "submit",
                        sectionDetails,
                        file,
                        AllSectionsDataMain,
                        currentDocDetailsData,
                        dispatch
                      );

                    const updateDocFooterTitle = await SpServices.SPUpdateItem({
                      Listname: LISTNAMES.DocumentDetails,
                      ID: currentDocDetailsData?.documentDetailsID,
                      RequestJSON: {
                        footerTitle: details.footerTitle,
                      },
                    });

                    Promise.all([dataAdded, updateDocFooterTitle])
                      .then(async () => {
                        await getHeaderSectionDetails(sectionDetails, dispatch);

                        setSectionLoader(false);
                        setToastMessage({
                          isShow: true,
                          severity: "success",
                          title: "Document header updated!",
                          message:
                            "The document header has been updated successfully.",
                          duration: 3000,
                        });
                      })
                      .catch((error) => {
                        console.error(
                          "Error adding header attachment data: ",
                          error
                        );
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

                    const updatedDocData = updateDocDataLocal(
                      [currentDocDetailsData],
                      currentDocDetailsData?.documentDetailsID,
                      {
                        footerTitle: details.footerTitle,
                      }
                    );

                    dispatch(setCDDocDetails(updatedDocData[0]));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />
    </div>
  );
};

export default SetupHeader;
