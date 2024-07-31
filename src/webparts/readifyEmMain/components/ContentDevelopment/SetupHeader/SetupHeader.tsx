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
import { CONFIG } from "../../../../../config/config";
import {
  // addAppendixHeaderAttachmentData,
  addHeaderAttachmentData,
  getSectionData,
  getSectionDataFromAppendixList,
} from "../../../../../utils/contentDevelopementUtils";
import { getHeaderSectionDetails } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";

interface Props {
  sectionDetails: any;
  version: string;
  type: string;
  headerTitle: string;
  appendixName?: string;
  primaryAuthorDefaultHeader?: boolean;
  noActionBtns?: boolean;
  appendixSection?: boolean;
  onChange?: any;
}

const SetupHeader: React.FC<Props> = ({
  version,
  type,
  headerTitle,
  primaryAuthorDefaultHeader,
  noActionBtns,
  appendixSection,
  appendixName,
  sectionDetails,
  onChange,
}) => {
  const fileUploadRef = useRef<any>(null);
  const dispatch = useDispatch();
  const initialHeaderDetails = {
    version: version,
    type: type,
    headerTitle: headerTitle,
    appendixName: appendixName,
  };
  const CDHeaderDetails = useSelector(
    (state: any) => state.ContentDeveloperData.CDHeaderDetails
  );
  console.log("CDHeaderDetails: ", CDHeaderDetails);
  const [totalSize, setTotalSize] = useState(0);
  const [sectionLoader, setSectionLoader] = useState(true);
  const [file, setFile] = useState<{
    fileData: any;
    fileName: string;
  }>({
    fileData: [],
    fileName: "",
  });

  const navigate = useNavigate();

  const onTemplateSelect = (e: any): void => {
    let _totalSize = totalSize;
    const files = e.files;
    console.log("files: ", files);

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });
    setTotalSize(_totalSize);
    setFile({
      fileData: files[0],
      fileName: `headerImg.${files[0]?.name?.split(".").slice(-1)[0]}`,
    });
    onChange({
      fileData: files[0],
      fileName: `headerImg.${files[0]?.name?.split(".").slice(-1)[0]}`,
    });
  };

  // const onTemplateClear = (): void => {
  //   setTotalSize(0);
  //   setFile({
  //     fileData: [],
  //     fileName: "",
  //   });
  // };

  const onTemplateClear = (): void => {
    debugger;
    setTotalSize(0);
    setFile({
      fileData: [],
      fileName: "",
    });
    // Clear the file upload component as well
    if (fileUploadRef.current) {
      fileUploadRef.current.clear(); // This clears the uploaded file from the UI
    }
    onChange({
      fileData: [],
      fileName: "",
    });
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
              file.fileData.ServerRelativeUrl
                ? file.fileData.ServerRelativeUrl
                : fileData.objectURL
                ? fileData.objectURL
                : CDHeaderDetails?.imgURL
                ? CDHeaderDetails?.imgURL
                : `${CONFIG.tenantURL}/${file.fileData?.ServerRelativeUrl}`
            }
            width={"100%"}
            style={{
              height: "150px",
            }}
          />
          <span className={styles.selectedFileName}>
            <p>
              {file?.fileName
                ? file?.fileName
                : fileData.name || file.fileData?.FileName}
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
        </div>
      </div>
    );
  };

  const emptyTemplate = (): any => {
    return (
      <div className="flex align-items-center flex-column fileUploadSection">
        <i
          className="pi pi-plus mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "#e8e6e6",
            color: "#c5c3c3",
          }}
        />
      </div>
    );
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
    console.log("data: ", data);
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
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(file);
    }
  }, [file]);

  useEffect(() => {
    setFile((prev: any) => ({
      fileData: {
        ServerRelativeUrl: CDHeaderDetails?.imgURL,
        fileName: CDHeaderDetails?.fileName,
      },
      fileName: CDHeaderDetails?.fileName,
    }));
    console.log("file: ", file);
  }, []);

  return (
    <div className={styles.textPlayGround}>
      <div
        className={
          primaryAuthorDefaultHeader
            ? styles.headerWrapper
            : styles.headerWrapperAppendix
        }
      >
        <span>Setup Header</span>
      </div>
      {sectionLoader && !appendixSection ? (
        <div className="contentDevLoaderWrapper">
          <CircularSpinner />
        </div>
      ) : (
        <div className={styles.setupHeaderWrapper}>
          <div className={styles.logoUploadWrapper}>
            {/* <FileUpload
              ref={fileUploadRef}
              // name="demo[]"
              // url="/api/upload"
              multiple={false}
              accept="image/*"
              maxFileSize={1000000}
              onSelect={onTemplateSelect}
              // onError={onTemplateClear}
              onClear={onTemplateClear}
              headerTemplate={headerTemplate}
              itemTemplate={itemTemplate}
              emptyTemplate={
                file.fileData?.ServerRelativeUrl || CDHeaderDetails?.imgURL
                  ? itemTemplate
                  : emptyTemplate
              }
              // uploadLabel="Browse"
              chooseLabel="Browse"
            /> */}

            <FileUpload
              ref={fileUploadRef}
              multiple={false}
              accept="image/*"
              maxFileSize={1000000}
              onSelect={onTemplateSelect}
              onClear={onTemplateClear}
              headerTemplate={headerTemplate}
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
              value={initialHeaderDetails.headerTitle}
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
            {!noActionBtns && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  gap: "10px",
                  marginTop: "30px",
                }}
              >
                <DefaultButton
                  text="Cancel"
                  btnType="darkGreyVariant"
                  onClick={() => {
                    navigate(-1);
                  }}
                />
                <DefaultButton
                  text="Submit"
                  btnType="primary"
                  onClick={async () => {
                    // if (appendixSection) {
                    //   await updatea(
                    //     "submit",
                    //     sectionDetails,
                    //     file
                    //   );
                    // } else {

                    setSectionLoader(true);

                    const dataAdded: Promise<any> =
                      await addHeaderAttachmentData(
                        "submit",
                        sectionDetails,
                        file
                      );

                    Promise.all([dataAdded])
                      .then(async () => {
                        await getHeaderSectionDetails(sectionDetails, dispatch);
                        setSectionLoader(false);
                      })
                      .catch((error) => {
                        console.error(
                          "Error adding header attachment data: ",
                          error
                        );
                        setSectionLoader(false);
                      });

                    // }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupHeader;
