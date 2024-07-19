/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// import { memo, useEffect, useState } from "react";
import styles from "./SetupHeader.module.scss";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import DefaultButton from "../../common/Buttons/DefaultButton";
// import { ProgressBar } from "primereact/progressbar";
// import { FileUpload } from "primereact/fileupload";
// const add = require("../../../../../assets/images/png/add.png");
import { FileUpload } from "primereact/fileupload";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import "./SetupHeader.css";

interface Props {
  version: string;
  type: string;
  headerTitle: string;
}

const SetupHeader: React.FC<Props> = ({ version, type, headerTitle }) => {
  const fileUploadRef = useRef<any>(null);
  const initialHeaderDetails = {
    version: version,
    type: type,
    headerTitle: headerTitle,
  };
  const [headerDetails, setHeaderDetails] = useState(initialHeaderDetails);
  const [totalSize, setTotalSize] = useState(0);

  const handleOnChange = (value: string, key: string) => {
    console.log(value, key);
    setHeaderDetails({ ...headerDetails, [key]: value });
  };

  const onTemplateUpload = (e: any) => {
    let _totalSize = 0;
    e.files.forEach((file: any) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    //  toast.current.show({
    //    severity: "info",
    //    summary: "Success",
    //    detail: "File Uploaded",
    //  });
  };

  const onTemplateSelect = (e: any) => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });
    setTotalSize(_totalSize);
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };
  const onTemplateRemove = (file: any, callback: any) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const itemTemplate = (file: any, props: any) => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={50}
            height={50}
          />
          <span
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {file.name}
            <Button
              type="button"
              icon="pi pi-times"
              className="p-button-outlined p-button-rounded p-button-danger ml-auto imageDeleteBtn"
              onClick={() => onTemplateRemove(file, props.onRemove)}
            />
          </span>
        </div>
        {/* <Tag
           value={props.formatSize}
           severity="warning"
           className="px-3 py-2"
         /> */}
        {/* <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        /> */}
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column fileUploadSection">
        {/* <button className={styles.addBtn}>
          <img src={add} alt={"back to my tasks"} />
        </button> */}
        <i
          className="pi pi-plus mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "#e8e6e6",
            color: "#c5c3c3",
          }}
        ></i>
        {/* <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span> */}
      </div>
    );
  };

  const headerTemplate = (options: any) => {
    const { className, chooseButton } = options;
    // const value = totalSize / 10000;
    // const formatedValue =
    //   fileUploadRef && fileUploadRef.current
    //     ? fileUploadRef.current.formatSize(totalSize)
    //     : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* <DefaultButton btnType="lightGreyVariant" text="Upload Image" /> */}
        <div className="uploadImageSec">Upload Image</div>
        {chooseButton}
        {/* <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div> */}
      </div>
    );
  };

  return (
    <div className={styles.textPlayGround}>
      <div className={styles.headerWrapper}>
        <span>Setup Header</span>
      </div>
      <div className={styles.setupHeaderWrapper}>
        <div className={styles.logoUploadWrapper}>
          <p className={styles.uploadLabel}>Document Logo</p>
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
            // chooseOptions={chooseOptions}
            // uploadOptions={uploadOptions}
            // cancelOptions={cancelOptions}
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
          />
          <CustomInput
            value={headerDetails.version}
            labelText="Current Version"
            onChange={(value: any) => {
              handleOnChange(value, "version");
            }}
            withLabel
            topLabel
          />
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
        </div>
      </div>
    </div>
  );
};

export default SetupHeader;
