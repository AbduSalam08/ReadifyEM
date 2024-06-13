/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import styles from "./TableOfContents.module.scss";
import CustomDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomDropDown";
import { DocStatus } from "../../constants/DocStatus";
import MenuButton from "../../webparts/readifyEmMain/components/common/Buttons/MenuButton";
import Table from "../../webparts/readifyEmMain/components/Table/Table";
import NewDocument from "../NewDocument/NewDocument";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";
import { emptyCheck, trimStartEnd } from "../../utils/validations";
import CustomTreeDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomTreeDropDown";
import { useDispatch, useSelector } from "react-redux";
import AlertPopup from "../../webparts/readifyEmMain/components/common/Popups/AlertPopup/AlertPopup";
import { initialPopupLoaders } from "../../config/config";
import { IPopupLoaders } from "../../interface/MainInterface";
// import { sp } from "@pnp/sp";
import { Close } from "@mui/icons-material";
// services
import {
  LibraryItem,
  LoadTableData,
  createFolder,
} from "../../services/EMManual/EMMServices";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import { togglePopupVisibility } from "../../utils/togglePopup";
// utils
// images
const editIcon: any = require("../../assets/images/svg/normalEdit.svg");
const contentDeveloperEdit: any = require("../../assets/images/svg/editContentDeveloper.svg");
const viewDocBtn: any = require("../../assets/images/svg/viewEye.svg");

// constants
const initialPopupController = [
  { open: false, popupTitle: "Add new group", popupWidth: "27vw" },
  { open: false, popupTitle: "Add new subgroup", popupWidth: "31vw" },
  {
    open: false,
    popupTitle: "View Document",
    popupWidth: "70vw",
    defaultCloseBtn: true,
  },
];

const popupInitialData = {
  addNewGroupName: {
    value: "",
    isValid: true,
    errorMsg: "Please provide a group name",
  },
  addNewSubGroupName: {
    value: "",
    isValid: true,
    errorMsg: "Please provide a sub group name",
  },
  sectionPath: {
    value: "",
    isValid: true,
    errorMsg: "Please specify the location",
  },
};

const TableOfContents = (): JSX.Element => {
  //Dispatcher
  const dispatch = useDispatch();

  // reducer selectors
  const DocumentPathOptions: any = useSelector(
    (state: any) => state.EMMTableOfContents.foldersData
  );

  // main table data state
  const [tableData, setTableData] = useState({
    headers: [
      "Document Name",
      "Created At",
      "Next Review",
      "Status",
      // "Visibility",
    ],
    loading: false,
    data: [] as LibraryItem[],
  });

  // A state to manage loader popup's
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // main & all sub screens
  const [screens, setScreens] = useState({
    toc: true,
    NewDocument: false,
    pageTitle: "EM Manual - Table Of Contents",
    editDocumentData: [],
  });

  const [popupData, setPopupData] = useState<any>(popupInitialData);

  const [documentPdfURL, setDocumentPdfURL] = useState("");
  console.log("documentPdfURL: ", documentPdfURL);

  // A controller state for popup in TOC
  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // state to store the filter properties
  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
    filterByStatus: "",
    options: DocStatus,
    menuBtnExternalController: null,
    createOptions: [
      {
        text: "Document",
        onClick: () => {
          setScreens((prev) => ({
            ...prev,
            toc: false,
            NewDocument: true,
            pageTitle: "New Document",
          }));
        },
      },
      {
        text: "Group",
        onClick: () => {
          togglePopupVisibility(setPopupController, 0, "open");
          setPopupData(popupInitialData);
          setFilterOptions((prev) => ({
            ...prev,
            menuBtnExternalController: null,
          }));
        },
      },
      {
        text: "Sub Group",
        onClick: () => {
          togglePopupVisibility(setPopupController, 1, "open");
          setPopupData(popupInitialData);
          setFilterOptions((prev) => ({
            ...prev,
            menuBtnExternalController: null,
          }));
        },
      },
    ],
  });

  // input changing handlers for filter & popup data's
  const handleInputChange = (value: any, inputName: string): void => {
    setPopupData((prev: any) => {
      const updatedFormData = {
        ...prev,
        [inputName]: {
          ...prev[inputName],
          value: value,
          isValid:
            typeof value !== "object"
              ? emptyCheck(value) && value !== null && value !== undefined
              : value &&
                value.length !== 0 &&
                value !== null &&
                value !== undefined,
        },
      };
      return updatedFormData;
    });
  };

  // popup inputs object
  const popupInputs: any[] = [
    <CustomInput
      key={1}
      size="MD"
      labelText="Name"
      withLabel
      icon={false}
      onChange={(value: string) => {
        handleInputChange(value, "addNewGroupName");
      }}
      value={popupData.addNewGroupName.value}
      placeholder="Enter here"
      isValid={!popupData.addNewGroupName.isValid}
      errorMsg={popupData.addNewGroupName.errorMsg}
    />,
    [
      <div key={"1.1"} className={styles.subGroupInput}>
        <CustomInput
          key={2}
          size="MD"
          labelText="Name"
          withLabel
          icon={false}
          onChange={(value: string) => {
            handleInputChange(value, "addNewSubGroupName");
          }}
          value={popupData.addNewSubGroupName.value}
          placeholder="Enter here"
          isValid={!popupData.addNewSubGroupName.isValid}
          errorMsg={popupData.addNewSubGroupName.errorMsg}
        />
      </div>,
      <div key={"1.2"} className={styles.subGroupInput}>
        <CustomTreeDropDown
          key={3}
          labelText="Location"
          withLabel={true}
          size="MD"
          onChange={(value: string) => {
            handleInputChange(value, "sectionPath");
          }}
          placeholder="Select"
          value={popupData.sectionPath.value}
          isValid={!popupData.sectionPath.isValid}
          errorMsg={popupData.sectionPath.errorMsg}
          options={DocumentPathOptions}
        />
      </div>,
    ],
    [
      <div className={styles.DOCemptyMsg} key={3}>
        <span>Document is empty.</span>
      </div>,
    ],
  ];

  // submit handler for pou=pup submit events
  const handleSubmit = async (key: string): Promise<any> => {
    let isValid = false;
    let folderPath = "";
    if (key === "group") {
      isValid = emptyCheck(popupData.addNewGroupName.value);
      folderPath = `/sites/ReadifyEM/AllDocuments/${trimStartEnd(
        popupData.addNewGroupName.value
      )}`;
    } else if (key === "sub group") {
      isValid =
        emptyCheck(popupData.addNewSubGroupName.value) &&
        emptyCheck(popupData.sectionPath.value);

      folderPath = `${popupData.sectionPath.value}/${trimStartEnd(
        popupData.addNewSubGroupName.value
      )}`;
    }

    setPopupData((prev: any) => ({
      ...prev,
      addNewGroupName: {
        ...prev.addNewGroupName,
        isValid: key === "group" ? isValid : prev.addNewGroupName.isValid,
      },
      addNewSubGroupName: {
        ...prev.addNewSubGroupName,
        isValid:
          key === "sub group"
            ? emptyCheck(popupData.addNewSubGroupName.value)
            : prev.addNewSubGroupName.isValid,
      },
      sectionPath: {
        ...prev.sectionPath,
        isValid:
          key === "sub group"
            ? emptyCheck(popupData.sectionPath.value)
            : prev.sectionPath.isValid,
      },
    }));

    if (isValid) {
      try {
        const folder = await createFolder(folderPath);
        if (folder) {
          setPopupLoaders((prev: IPopupLoaders) => ({
            ...prev,
            visibility: true,
            text: `New ${key === "group" ? "Group" : "Sub Group"} created!`,
            secondaryText: `New ${key} "${
              key === "group"
                ? popupData.addNewGroupName.value
                : popupData.addNewSubGroupName.value
            }" created successfully!`,
            isLoading: {
              ...prev.isLoading,
              success: true,
              error: false,
              inprogres: false,
            },
          }));
          setPopupController(initialPopupController);
        }
      } catch (error: any) {
        console.log("error: ", error.message);

        let errorMessage = "Unable to create group.";
        let secondaryText =
          "An unexpected error occurred while creating a new group, please try again later.";

        const groupType: string = key === "group" ? "Group" : "Sub group";

        // Check if the error message is a string and contains "already exists"
        if (error.message.includes("already exists")) {
          errorMessage = `${groupType} name already exists.`;
          secondaryText = `The ${groupType} "${trimStartEnd(
            key === "group"
              ? popupData.addNewGroupName.value
              : popupData.addNewSubGroupName.value
          )}" is already exists, please use a different name.`;
        } else if (
          error.message.includes("contains invalid characters") ||
          error.message.includes("potentially dangerous Request")
        ) {
          errorMessage = `Invalid ${groupType} name`;
          secondaryText = `The ${groupType} "${trimStartEnd(
            key === "group"
              ? popupData.addNewGroupName.value
              : popupData.addNewSubGroupName.value
          )}" contains invalid characters, please use a different name.`;
        }

        setPopupLoaders((prev: IPopupLoaders) => ({
          ...prev,
          visibility: true,
          isLoading: {
            ...prev.isLoading,
            error: true,
            inprogres: false,
            success: false,
          },
          text: errorMessage,
          secondaryText: secondaryText,
        }));
        setPopupController(initialPopupController);
      }
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
          togglePopupVisibility(setPopupController, 0, "close");
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleSubmit("group");
        },
      },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          togglePopupVisibility(setPopupController, 1, "close");
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleSubmit("sub group");
        },
      },
    ],
    [
      {
        text: "Close",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          togglePopupVisibility(setPopupController, 2, "close");
        },
      },
    ],
  ];

  // fn to load all main data
  const setMainData = async (): Promise<any> => {
    await LoadTableData(dispatch, setTableData);
  };

  // lifecycle hooks
  useEffect(() => {
    setMainData();
  }, [dispatch]);

  // template for future use

  // const PDFView = (
  //   <object
  //     key={3}
  //     data={documentPdfURL}
  //     type="application/pdf"
  //     width="100%"
  //     height="600px"
  //   >
  //     <p className="textCenter">
  //       Your browser does not support PDFs. Please download the PDF to view it:
  //       <a href={documentPdfURL}>Download PDF</a>.
  //     </p>
  //   </object>
  // );

  // const PDFHtmlView = (
  //   <div className={styles.DOCemptyMsg}>
  //     <span>Document is empty.</span>
  //   </div>
  // );

  return (
    <div className={styles.tocWrapper}>
      <PageTitle text={screens.pageTitle} />

      {screens.toc ? (
        <>
          {/* filters section */}
          <div className={styles.filters}>
            <CustomInput
              value={filterOptions.searchTerm}
              onChange={(value: string) => {
                setFilterOptions((prev) => ({
                  ...prev,
                  searchTerm: value,
                }));
              }}
              disabled={tableData.data.length === 0 || tableData.loading}
              icon
              placeholder="Search"
            />

            <div className={styles.rhs}>
              <CustomDropDown
                onChange={(value: string) => {
                  setFilterOptions((prev) => ({
                    ...prev,
                    filterByStatus: value,
                  }));
                }}
                options={filterOptions.options}
                value={filterOptions.filterByStatus}
                placeholder="Filter by Status"
                size="MD"
                disabled={tableData.data.length === 0 || tableData.loading}
              />
              {filterOptions?.searchTerm || filterOptions?.filterByStatus ? (
                <button
                  className={styles.clearFilterBtn}
                  onClick={() => {
                    setFilterOptions((prev: any) => ({
                      ...prev,
                      searchTerm: "",
                      filterByStatus: "",
                    }));
                  }}
                >
                  Clear All Filters{" "}
                  <Close
                    sx={{
                      fontSize: "15px",
                    }}
                  />
                </button>
              ) : null}

              <MenuButton
                menuVisibility={filterOptions.menuBtnExternalController}
                externalController={setFilterOptions}
                buttonText="Create New"
                disabled={tableData.data.length === 0 || tableData.loading}
                menuItems={filterOptions.createOptions}
              />
            </div>
          </div>

          {/* table section */}
          <Table
            headers={tableData.headers}
            loading={tableData.loading}
            filters={filterOptions}
            data={tableData.data}
            actions={true}
            loadData={setMainData}
            renderActions={(item: any, index: number) => {
              return (
                <>
                  <DefaultButton
                    disableRipple={true}
                    style={{
                      minWidth: "auto",
                    }}
                    btnType={"actionBtn"}
                    text={
                      <img
                        src={contentDeveloperEdit}
                        style={{
                          width: "19px",
                        }}
                      />
                    }
                    disabled={
                      item?.fields.status?.toLowerCase() === "not started"
                    }
                    key={index}
                    onClick={() => {
                      console.log("clicked");
                    }}
                  />
                  <DefaultButton
                    disableRipple={true}
                    style={{
                      minWidth: "auto",
                    }}
                    btnType={"actionBtn"}
                    text={<img src={editIcon} />}
                    key={index}
                    onClick={() => {
                      setScreens((prev) => ({
                        ...prev,
                        NewDocument: true,
                        toc: false,
                        pageTitle: `Edit Document (${item.name})`,
                        editDocumentData: item,
                      }));
                    }}
                  />
                  <DefaultButton
                    disableRipple={true}
                    style={{
                      minWidth: "auto",
                    }}
                    btnType={"actionBtn"}
                    text={<img src={viewDocBtn} />}
                    key={index}
                    onClick={async () => {
                      setDocumentPdfURL(item.url);
                      togglePopupVisibility(
                        setPopupController,
                        2,
                        "open",
                        `View Document - ${item.name}`
                      );
                    }}
                  />
                </>
              );
            }}
          />
        </>
      ) : (
        screens.NewDocument && (
          <NewDocument
            setMainData={setMainData}
            screens={screens}
            setScreens={setScreens}
          />
        )
      )}

      {/* popup sections */}
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
          defaultCloseBtn={popupData.defaultCloseBtn || true}
        />
      ))}

      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders.isLoading}
        onClick={() => {
          setMainData();
          setPopupLoaders(initialPopupLoaders);
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
      />
    </div>
  );
};

export default memo(TableOfContents);
