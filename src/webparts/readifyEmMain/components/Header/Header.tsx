/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react/self-closing-comp */

import { Tab, Tabs } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { FileUpload } from "primereact/fileupload";
import styles from "./Header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { togglePopupVisibility } from "../../../../utils/togglePopup";
// const logo = require("../../../../assets/images/png/logo/Readify-EM.png");
const sampleDocHeaderImg: any = require("../../../../assets/images/png/imagePlaceholder.png");
import Popup from "../../../../webparts/readifyEmMain/components/common/Popups/Popup";
import { CONFIG } from "../../../../config/config";
import ToastMessage from "../common/Toast/ToastMessage";
import { updatePageLog } from "../../../../services/ContentDevelopment/CommonServices/CommonServices";

const initialPopupController = [
  {
    open: false,
    popupTitle: "Change page title",
    popupWidth: "30vw",
    defaultCloseBtn: false,
    popupData: [],
  },
];

const Header = (): JSX.Element => {
  const fileUploadRef = useRef<any>(null);
  const dispatch = useDispatch();

  const pageDetailsState: any = useSelector(
    (state: any) => state?.MainSPContext?.PageDetails
  );

  const currentUserDetails: any = useSelector(
    (state: any) => state.MainSPContext.currentUserDetails
  );

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

  // A controller state for popup in TOC
  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  const [totalSize, setTotalSize] = useState(0);
  const [file, setFile] = useState<{
    fileData: any;
    fileName: string;
  }>(
    pageDetailsState.imageData
      ? {
          fileData: pageDetailsState?.imageData.fileData,
          fileName: pageDetailsState?.imageData.fileName,
        }
      : {
          fileData: [],
          fileName: "",
        }
  );

  console.log(file);

  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

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
    setFile({
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
                : fileData.name || file.fileData?.fileName}
            </p>
            <Button
              type="button"
              icon="pi pi-times"
              className="p-button-outlined p-button-rounded p-button-danger ml-auto imageDeleteBtn"
              onClick={() => {
                !props?.onRemove
                  ? setFile((prev: any) => ({
                      ...prev,
                      fileName: "",
                      fileData: [],
                    }))
                  : onTemplateRemove(file, props.onRemove);
              }}
            />
          </span>
        </div>
      </div>
    );
    // } else {
    //   return emptyTemplate();
    // }
  };

  const emptyTemplate = (): JSX.Element | null => {
    return (
      <>
        {/* <div className="flex align-items-center flex-column fileUploadSection">
                <p className="emptyMsgOfDND">Browse or drag and drop image</p>
              </div> */}
        <div className="flex align-items-center flex-column fileUploadSection">
          <img src={sampleDocHeaderImg} alt="No header image found!" />
        </div>
      </>
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

  const popupInputs: any[] = [
    [
      <div className={styles.logoUploadWrapper} key={1}>
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
            file.fileData?.ServerRelativeUrl || file.fileData?.length !== 0
              ? itemTemplate
              : emptyTemplate
          }
          chooseLabel="Browse"
        />
      </div>,
    ],
  ];

  const handlePageLogo = async (): Promise<void> => {
    if (file.fileName !== "") {
      await updatePageLog(
        dispatch,
        file,
        pageDetailsState,
        setToastMessage,
        handleClosePopup
      );
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Invalid file submit!",
        message: `Empty submission not allowed.`,
        duration: 3000,
      });
    }
  };

  // popup actions object
  const popupActions: any[] = [
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          setFile({
            fileData: pageDetailsState?.imageData
              ? pageDetailsState?.imageData?.fileData
              : [],
            fileName: pageDetailsState?.imageData
              ? pageDetailsState?.imageData?.fileName
              : "",
          });
          togglePopupVisibility(setPopupController, 0, "close");
        },
      },
      {
        text: "Save",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // togglePopupVisibility(
          //   setPopupController,
          //   3,
          //   "close",
          //   "Change page title",
          //   popupData
          // );
          // handleSubmit("sub group");
          await handlePageLogo();
        },
      },
    ],
  ];

  const isAdmin: boolean = currentUserDetails?.role === "Admin";

  const rootPath = isAdmin ? "/admin" : "/user";

  const navigate = useNavigate();

  const data = isAdmin
    ? [
        {
          label: "Home",
          path: `${rootPath}/home`,
        },
        {
          label: "My Tasks",
          path: `${rootPath}/my_tasks`,
        },

        {
          label: "Definitions",
          path: `${rootPath}/definitions`,
        },

        {
          label: "Templates",
          path: `${rootPath}/templates`,
        },
      ]
    : [
        {
          label: "Home",
          path: `${rootPath}/home`,
        },
        {
          label: "My Tasks",
          path: `${rootPath}/my_tasks`,
        },
      ];

  const [value, setValue] = useState(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  }, [isAdmin]);
  useEffect(() => {
    setFile({
      fileData: pageDetailsState?.imageData?.fileData,
      fileName: pageDetailsState?.imageData?.fileName,
    });
  }, [pageDetailsState]);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.logo}>
        <img
          role="presentation"
          src={
            file.fileData?.ServerRelativeUrl
              ? file.fileData?.ServerRelativeUrl
              : pageDetailsState?.imageData?.fileData?.ServerRelativeUrl
          }
          alt="Readify EM Logo"
        />
        {/* <span>Readify EM</span> */}
        {isAdmin && (
          <EditIcon
            className={styles.editIcon}
            onClick={() => {
              togglePopupVisibility(
                setPopupController,
                0,
                "open",
                "Change logo"
              );
            }}
          />
        )}
      </div>
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />

      <div className={styles.tabsWrapper}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example"
        >
          {data?.map(({ label, path }) => (
            <Tab
              disableRipple
              key={label}
              label={label}
              onClick={() => {
                navigate(path);
              }}
            />
          ))}
        </Tabs>
      </div>
      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          PopupType="custom"
          onHide={() =>
            togglePopupVisibility(setPopupController, index, "close")
          }
          popupTitle={popupData.popupTitle}
          popupActions={popupActions[index]}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={popupData.defaultCloseBtn}
        />
      ))}
    </div>
  );
};

export default memo(Header);
