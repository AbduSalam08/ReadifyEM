/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// import { memo, useEffect, useState } from "react";
import styles from "./SetupHeader.module.scss";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import DefaultButton from "../../common/Buttons/DefaultButton";
import { FileUpload } from "primereact/fileupload";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import "./SetupHeader.css";

interface Props {
  version: string;
  type: string;
  headerTitle: string;
  primaryAuthorDefaultHeader?: boolean;
  noActionBtns?: boolean;
}

const SetupHeader: React.FC<Props> = ({
  version,
  type,
  headerTitle,
  primaryAuthorDefaultHeader,
  noActionBtns,
}) => {
  const fileUploadRef = useRef<any>(null);
  const initialHeaderDetails = {
    version: version,
    type: type,
    headerTitle: headerTitle,
  };
  const [headerDetails, setHeaderDetails] = useState(initialHeaderDetails);
  const [totalSize, setTotalSize] = useState(0);

  const handleOnChange = (value: string, key: string): void => {
    console.log(value, key);
    setHeaderDetails({ ...headerDetails, [key]: value });
  };

  const onTemplateUpload = (e: any): void => {
    let _totalSize = 0;
    e.files.forEach((file: any) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateSelect = (e: any): void => {
    let _totalSize = totalSize;
    const files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });
    setTotalSize(_totalSize);
  };

  const onTemplateClear = (): void => {
    setTotalSize(0);
  };
  const onTemplateRemove = (file: any, callback: any): void => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const itemTemplate = (file: any, props: any): any => {
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
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={"100%"}
            height={"100%"}
          />
          <span className={styles.selectedFileName}>
            {file.name}
            <Button
              type="button"
              icon="pi pi-times"
              className="p-button-outlined p-button-rounded p-button-danger ml-auto imageDeleteBtn"
              onClick={() => onTemplateRemove(file, props.onRemove)}
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
    console.log("options: ", options);
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
      <div className={styles.setupHeaderWrapper}>
        <div className={styles.logoUploadWrapper}>
          <FileUpload
            ref={fileUploadRef}
            // name="demo[]"
            // url="/api/upload"
            multiple
            accept="image/*"
            maxFileSize={1000000}
            onUpload={onTemplateUpload}
            onSelect={onTemplateSelect}
            // onError={onTemplateClear}
            onClear={onTemplateClear}
            headerTemplate={headerTemplate}
            itemTemplate={itemTemplate}
            emptyTemplate={emptyTemplate}
            // uploadLabel="Browse"
            chooseLabel="Browse"
          />
        </div>
        <div className={styles.headerDetailsWrapper}>
          <CustomInput
            value={headerDetails.headerTitle}
            labelText="Header Title"
            onChange={(value: any) => {
              handleOnChange(value, "headerTitle");
            }}
            withLabel
            topLabel
            secWidth="307px"
          />
          <CustomInput
            value={headerDetails.type}
            labelText="Document Type"
            onChange={(value: any) => {
              handleOnChange(value, "type");
            }}
            withLabel
            topLabel
            secWidth="307px"
          />
          <CustomInput
            value={headerDetails.version}
            labelText="Current Version"
            onChange={(value: any) => {
              handleOnChange(value, "version");
            }}
            withLabel
            topLabel
            secWidth="307px"
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
              <DefaultButton text="Cancel" btnType="darkGreyVariant" />
              <DefaultButton
                text="Submit"
                btnType="primary"
                onClick={() => {
                  // _addData();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupHeader;
