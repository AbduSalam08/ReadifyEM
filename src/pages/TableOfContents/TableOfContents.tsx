/* eslint-disable no-debugger */
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
import {
  // calculateDueDateByRole,
  emptyCheck,
  trimStartEnd,
} from "../../utils/validations";
import CustomTreeDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomTreeDropDown";
import { useDispatch, useSelector } from "react-redux";
import AlertPopup from "../../webparts/readifyEmMain/components/common/Popups/AlertPopup/AlertPopup";
import { initialPopupLoaders, LISTNAMES } from "../../config/config";
import { IPopupLoaders } from "../../interface/MainInterface";
// import { sp } from "@pnp/sp";
import InfoIcon from "@mui/icons-material/Info";
import { ArrowRightAlt, Close } from "@mui/icons-material";
import { Fade, Tooltip } from "@mui/material";
// services
import {
  EditFolderAndChangeItemPath,
  LibraryItem,
  LoadTableData,
  createFolder,
  // findItemByUrl,
  // editFolder,
} from "../../services/EMManual/EMMServices";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import { togglePopupVisibility } from "../../utils/togglePopup";
import { filterDataByURL } from "../../utils/NewDocumentUtils";
import { CurrentUserIsAdmin } from "../../constants/DefineUser";
import { useNavigate } from "react-router-dom";
import {
  getSectionsDetails,
  updatePageTitle,
} from "../../services/ContentDevelopment/CommonServices/CommonServices";
import { setSectionsAttachments } from "../../redux/features/PDFServicceSlice";
// import { getDocumentRelatedSections } from "../../services/PDFServices/PDFServices";
// import SpServices from "../../services/SPServices/SpServices";
import PDFServiceTemplate from "../../webparts/readifyEmMain/components/Table/PDFServiceTemplate/PDFServiceTemplate";
// import * as dayjs from "dayjs";
// utils
// images
const editIcon: any = require("../../assets/images/svg/normalEdit.svg");
// const docFile: any = require("../../assets/images/codeunit.docx");
const contentDeveloperEdit: any = require("../../assets/images/svg/editContentDeveloper.svg");
// const editConfigurationImg: any = require("../../assets/images/svg/taskConfigurationEditIcon.svg");
const viewDocBtn: any = require("../../assets/images/svg/viewEye.svg");
const newversionBtn: any = require("../../assets/images/svg/newVersion.svg");
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { getNextVersions } from "../../utils/EMManualUtils";
import { removeVersionFromDocName } from "../../utils/formatDocName";
import ToastMessage from "../../webparts/readifyEmMain/components/common/Toast/ToastMessage";
import { InputSwitch } from "primereact/inputswitch";
import { sp } from "@pnp/sp";
// constants
const initialPopupController = [
  {
    open: false,
    popupTitle: "Add new group",
    popupWidth: "27vw",
    defaultCloseBtn: false,
    popupData: [],
  },
  {
    open: false,
    popupTitle: "Add new subgroup",
    popupWidth: "31vw",
    defaultCloseBtn: false,
    popupData: [],
  },
  {
    open: false,
    popupTitle: "View Document",
    popupWidth: "820px",
    defaultCloseBtn: true,
    popupData: [],
  },
  {
    open: false,
    popupTitle: "Change page title",
    popupWidth: "30vw",
    defaultCloseBtn: false,
    popupData: [],
  },
  {
    open: false,
    popupTitle: "",
    popupWidth: "35vw",
    defaultCloseBtn: false,
    popupData: [],
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
  homePageTitle: {
    value: "",
    isValid: true,
    errorMsg: "Please enter the page title",
  },
  initiatVersion: {
    value: "",
    isValid: true,
    errorMsg: "Please enter the page title",
  },
};

// TSX component with JSX features
const TableOfContents = (): JSX.Element => {
  const contextProps: any = useSelector(
    (state: any) => state?.MainSPContext?.value
  );
  const pageDetailsState: any = useSelector(
    (state: any) => state?.MainSPContext?.PageDetails
  );

  console.log("contextProps: ", contextProps);
  //Dispatcher
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // checking is that the current user is an admin or not.
  const isAdmin: boolean = CurrentUserIsAdmin();
  // reducer selectors
  const DocumentPathOptions: any = useSelector(
    (state: any) => state.EMMTableOfContents.foldersData
  );
  const TOCData: any = useSelector(
    (state: any) => state.EMMTableOfContents.tableData
  );
  const AllSectionsAttachments: any = useSelector(
    (state: any) => state.PDFServiceData.sectionsAttachments
  );
  console.log(AllSectionsAttachments);

  // main table data state
  const [tableData, setTableData] = useState({
    headers: isAdmin
      ? [
          "Document Name",
          "Ref ID",
          "Created At",
          "Next Review",
          "Status",
          "Visibility",
        ]
      : ["Document Name", "Ref ID", "Created At", "Next Review", "Status"],
    loading: false,
    data: [] as LibraryItem[],
  });

  // A state to manage loader popup's
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // main & all sub screens
  const [screens, setScreens] = useState<{
    toc: boolean;
    NewDocument: boolean;
    pageTitle: any;
    editDocumentData: any;
  }>({
    toc: true,
    NewDocument: false,
    pageTitle: pageDetailsState?.pageTitle || "Home",
    editDocumentData: [],
  });
  const [tempScreens, setTempScreens] = useState<{
    toc: boolean;
    NewDocument: boolean;
    pageTitle: any;
    editDocumentData: any;
  }>({
    toc: true,
    NewDocument: false,
    pageTitle: pageDetailsState?.pageTitle || "Home",
    editDocumentData: [],
  });

  // const [parsedJSON, setParsedJSON] = useState<any[]>([]);

  // state to manage all popup data
  const [popupData, setPopupData] = useState<any>(popupInitialData);
  const [docuementStatus, setDocuementStatus] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<number>(0);

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

  const [documentPdfURL, setDocumentPdfURL] = useState("");
  console.log(documentPdfURL);

  // A controller state for popup in TOC
  const [popupController, setPopupController] = useState(
    initialPopupController
  );
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  // current popupItem
  const currentPopupItem: any = popupController?.filter((e: any) => e?.open)[0];

  // state to store the filter properties
  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
    filterByStatus: "",
    isDraft: false,
    isArchived: false,
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
          togglePopupVisibility(setPopupController, 0, "open", "Add new group");
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
          togglePopupVisibility(
            setPopupController,
            1,
            "open",
            "Add new subgroup"
          );
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
          value: value.trimStart(),
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
          onChange={(value: string | any) => {
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
      <div key={3} style={{ padding: "5px" }}>
        {/* <span>Document is empty.</span> */}

        {docuementStatus ? (
          // <object
          //   key={3}
          //   data={documentPdfURL}
          //   // type="application/pdf"
          //   type="application/msword"
          //   width="100%"
          //   height="600px"
          // >
          //   <p className="textCenter">
          //     Your browser does not support PDFs. Please download the PDF to
          //     view it:
          //     <a href={documentPdfURL}>Download PDF</a>.
          //   </p>
          // </object>
          <iframe src={documentPdfURL} width="100%" height="600px">
            Your browser does not support iframes.
          </iframe>
        ) : (
          // <PDFServiceTemplate documentId={documentId} />
          // <iframe
          //   src={documentPdfURL}
          //   // style="width:600px; height:500px;"
          //   width="100%"
          //   height="600px"
          //   // frameborder="0"
          // ></iframe>
          <PDFServiceTemplate documentId={documentId} />
        )}
      </div>,
    ],
    [
      <div key={"1.4"} className={styles.homePageTitleText}>
        <CustomInput
          key={2}
          size="MD"
          labelText="Page Title"
          withLabel
          icon={false}
          onChange={(value: string) => {
            handleInputChange(value, "homePageTitle");
          }}
          value={popupData.homePageTitle.value}
          placeholder="Enter here"
          isValid={!popupData.homePageTitle.isValid}
          errorMsg={popupData.homePageTitle.errorMsg}
        />
      </div>,
    ],
    [
      <div key={1} className={styles.initiateVersionPopup}>
        <div className={styles.popupTitle}>
          Please select the type of version you&apos;d like to initiate:
        </div>
        <div className={styles.chechBoxWrapper}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Checkbox
              id="sectionDefinitionUniqueId"
              checkedIcon={<RadioButtonCheckedIcon />}
              icon={<RadioButtonUncheckedIcon />}
              key={1}
              checked={popupData.initiatVersion.value === "minor"}
              onClick={(ev) => {
                setPopupData((prev: any) => {
                  const updatedFormData = {
                    ...prev,
                    initiatVersion: {
                      ...prev.initiatVersion,
                      value: "minor",
                    },
                  };
                  return updatedFormData;
                });
              }}
            />
            <span
              style={{ fontWeight: "500" }}
              onClick={(ev) => {
                setPopupData((prev: any) => {
                  const updatedFormData = {
                    ...prev,
                    initiatVersion: {
                      ...prev.initiatVersion,
                      value: "minor",
                    },
                  };
                  return updatedFormData;
                });
              }}
            >
              Minor Version
            </span>
            <Tooltip
              title={"For small updates or revisions (e.g., 1.1, 1.2)."}
              placement="right"
              arrow
              TransitionComponent={Fade}
            >
              <InfoIcon
                sx={{
                  position: "absolute",
                  right: "-30px",
                  top: "10px",
                  color: "#0360a4",
                }}
              />
            </Tooltip>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Checkbox
              id="sectionDefinitionUniqueId"
              checkedIcon={<RadioButtonCheckedIcon />}
              icon={<RadioButtonUncheckedIcon />}
              key={1}
              checked={popupData.initiatVersion.value === "major"}
              onClick={(ev) => {
                setPopupData((prev: any) => {
                  const updatedFormData = {
                    ...prev,
                    initiatVersion: {
                      ...prev.initiatVersion,
                      value: "major",
                    },
                  };
                  return updatedFormData;
                });
              }}
            />
            <span
              style={{ fontWeight: "500" }}
              onClick={(ev) => {
                setPopupData((prev: any) => {
                  const updatedFormData = {
                    ...prev,
                    initiatVersion: {
                      ...prev.initiatVersion,
                      value: "major",
                    },
                  };
                  return updatedFormData;
                });
              }}
            >
              Major Version
            </span>
            <Tooltip
              title={"For significant updates or changes (e.g., 2.0, 3.0)."}
              placement="right"
              arrow
              TransitionComponent={Fade}
            >
              <InfoIcon
                sx={{
                  position: "absolute",
                  right: "-30px",
                  top: "10px",
                  color: "#0360a4",
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>,
    ],
  ];

  // Update page Title

  const handlePageTitle = (): any => {
    if (popupData.homePageTitle.value.trimStart() !== "") {
      updatePageTitle(
        dispatch,
        popupData.homePageTitle.value,
        pageDetailsState,
        setToastMessage,
        handleClosePopup
      );
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Invalid submission!",
        message: `Empty title submission not allowed.`,
        duration: 3000,
      });
    }
  };

  // submit handler for pou=pup submit events
  const handleSubmit = async (key: string): Promise<any> => {
    let isValid = false;
    let folderPath = "";

    const oldPath = currentPopupItem?.popupData?.url;

    const isEditPopup: boolean = currentPopupItem?.popupTitle
      ?.toLowerCase()
      ?.includes("edit");

    if (key === "group") {
      isValid = emptyCheck(popupData.addNewGroupName.value);
      folderPath = `/sites/ReadifyEM/AllDocuments/${trimStartEnd(
        popupData.addNewGroupName.value
      )}`;
    } else if (key === "sub group") {
      isValid =
        emptyCheck(popupData.addNewSubGroupName.value) &&
        emptyCheck(popupData.sectionPath.value);

      const splitLastPath = popupData.sectionPath.value?.split("/");
      const newUpdatedPath = splitLastPath?.pop(splitLastPath?.length - 1);
      const oldUpdatedPath = oldPath
        ?.split("/")
        ?.pop(splitLastPath?.length - 1);

      let replacedNewPath;
      if (popupData.sectionPath.value?.includes(oldUpdatedPath)) {
        replacedNewPath = popupData.sectionPath.value?.replace(
          newUpdatedPath,
          trimStartEnd(popupData.addNewSubGroupName.value)
        );
      } else {
        replacedNewPath = `${popupData.sectionPath.value}/${trimStartEnd(
          popupData.addNewSubGroupName.value
        )}`;
      }

      folderPath = isEditPopup
        ? replacedNewPath
        : `${popupData.sectionPath.value}/${trimStartEnd(
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
      if (!currentPopupItem) {
        console.error("No popup item found");
        return;
      }

      if (!oldPath && isEditPopup) {
        console.error("No old path found for update");
        return;
      }

      const popupLoadersErrorActions = (error: any): any => {
        let errorMessage = `Unable to ${
          isEditPopup ? "edit" : "create"
        } ${key}.`;
        let secondaryText = `An unexpected error occurred while ${
          isEditPopup ? "editing the" : "creating a new"
        } ${key}, please try again later.`;

        const groupType: string = key === "group" ? "Group" : "Sub group";
        const groupName =
          key === "group"
            ? popupData.addNewGroupName.value
            : popupData.addNewSubGroupName.value;

        if (error.message.includes("already exists")) {
          errorMessage = `${groupType} name already exists.`;
          secondaryText = `The ${groupType} "${trimStartEnd(
            groupName
          )}" already exists, please use a different name.`;
        } else if (
          error.message.includes("contains invalid characters") ||
          error.message.includes("potentially dangerous Request")
        ) {
          errorMessage = `Invalid ${groupType} name`;
          secondaryText = `The ${groupType} "${trimStartEnd(
            groupName
          )}" contains invalid characters, please use a different name.`;
        }

        setPopupLoaders((prev: IPopupLoaders) => ({
          ...prev,
          visibility: true,
          isLoading: {
            error: true,
            inprogres: false,
            success: false,
          },
          text: errorMessage,
          secondaryText: secondaryText,
        }));
        setPopupController(initialPopupController);
      };

      try {
        const actionType = isEditPopup ? "updated" : "created";

        const popupLoadersAction = (): void => {
          setPopupLoaders((prev: IPopupLoaders) => ({
            ...prev,
            visibility: true,
            text: `${
              key === "group" ? "Group" : "Sub group"
            } ${actionType} successfully !`,
            secondaryText: `The ${key} "${
              key === "group"
                ? popupData.addNewGroupName.value
                : popupData.addNewSubGroupName.value
            }" has been ${actionType} successfully!`,
            isLoading: {
              success: true,
              error: false,
              inprogres: false,
            },
          }));
          setPopupController(initialPopupController);
        };

        const checkNewPathFolder = filterDataByURL(
          folderPath?.split("/")?.slice(0, -1)?.join("/"),
          tableData.data
        );

        const hasDupicateInDestinationPath: any =
          checkNewPathFolder[0]?.items?.filter((item: any) => {
            return (
              item?.type === "folder" &&
              item?.name === folderPath?.split("/")[0]
            );
          });

        if (isEditPopup) {
          if (
            key === "sub group" &&
            hasDupicateInDestinationPath?.length === 0
          ) {
            setPopupController(initialPopupController);

            setPopupLoaders((prev: IPopupLoaders) => ({
              ...prev,
              visibility: true,
              isLoading: {
                ...prev.isLoading,
                inprogress: true,
              },
              text: "Updating sub folder, please wait...",
              //  secondaryText: secondaryText,
            }));
            const updateSubGroup = await EditFolderAndChangeItemPath(
              oldPath,
              folderPath
            );
            if (updateSubGroup === "true") {
              popupLoadersAction();
            } else {
              popupLoadersErrorActions(updateSubGroup);
            }
          } else if (key === "group") {
            setPopupController(initialPopupController);

            setPopupLoaders((prev: IPopupLoaders) => ({
              ...prev,
              visibility: true,
              isLoading: {
                ...prev.isLoading,
                inprogress: true,
              },
              text: "Updating folder, please wait...",
              //  secondaryText: secondaryText,
            }));
            const updateGroup = await EditFolderAndChangeItemPath(
              oldPath,
              folderPath
            );
            if (updateGroup === "true") {
              popupLoadersAction();
            } else {
              popupLoadersErrorActions(updateGroup);
            }
          } else {
            setPopupLoaders((prev: IPopupLoaders) => ({
              ...prev,
              visibility: true,
              isLoading: {
                ...prev.isLoading,
                error: true,
                inprogres: false,
                success: false,
              },
              text: "Group name already exist!",
              secondaryText: `The group name "${
                folderPath?.split("/")?.slice(-1)[0]
              }" already exist in the destination group, try different name.`,
            }));
            setPopupController(initialPopupController);
          }
        } else {
          const filterRecursiveByURLVal: any = filterDataByURL(
            popupData?.sectionPath?.value,
            tableData.data
          );

          const currentPathItems: any =
            filterRecursiveByURLVal[0]?.items?.filter(
              (el: any) => el.type === "folder"
            ) || 0;

          const currentPathItemsCount: any = currentPathItems?.length + 1;

          await createFolder(
            folderPath,
            key === "group"
              ? DocumentPathOptions?.length + 1
              : currentPathItemsCount
          );
          popupLoadersAction();
        }
      } catch (error: any) {
        popupLoadersErrorActions(error);
      }
    }
  };
  // handler that handles all popup inputs values
  const setPopupInputValues = (item: any, folderType?: any): void => {
    const groupTypeKey =
      folderType?.toLowerCase() === "parentfolder"
        ? "addNewGroupName"
        : "addNewSubGroupName";
    setPopupData((prev: any) => ({
      ...prev,
      [groupTypeKey]: {
        value: item?.name,
        isValid: true,
      },
      sectionPath: {
        value:
          groupTypeKey === "addNewSubGroupName"
            ? item?.url
            : prev?.sectionPath?.value,
        isValid: true,
      },
    }));
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
          dispatch(setSectionsAttachments([]));
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
          togglePopupVisibility(setPopupController, 3, "close");
        },
      },
      {
        text: "Save Changes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handlePageTitle();
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
          setPopupData((prev: any) => {
            const updatedFormData = {
              ...prev,
              initiatVersion: {
                ...prev.initiatVersion,
                value: "",
              },
            };
            return updatedFormData;
          });
          togglePopupVisibility(setPopupController, 4, "close");
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          // handleSubmit("sub group");
          if (popupData.initiatVersion.value !== "") {
            const updateTitle = tempScreens.pageTitle.replace(
              /\(.*\)/,
              `(${popupData.initiatVersion.value})`
            );
            setScreens((prev) => ({
              ...prev,
              ...tempScreens,
              pageTitle: updateTitle,
            }));
            togglePopupVisibility(setPopupController, 4, "close");
          } else {
            setToastMessage({
              isShow: true,
              severity: "warn",
              title: "Invalid submission!",
              message: `Please select initiate version.`,
              duration: 3000,
            });
          }
        },
      },
    ],
  ];

  // fn to load all main data
  const setMainData = async (): Promise<any> => {
    await LoadTableData(dispatch, setTableData, tableData, isAdmin);
  };

  // const readTextFileFromTXT = (data: any): void => {
  //   // setSectionLoader(true);
  //   SpServices.SPReadAttachments({
  //     ListName: "SectionDetails",
  //     ListID: data.ID,
  //     AttachmentName: data?.FileName,
  //   })
  //     .then((res: any) => {
  //       const parsedValue: any = JSON.parse(res);
  //       const sectionDetails = {
  //         text: data.sectionName,
  //         sectionOrder: data.sectionOrder,
  //         value: parsedValue,
  //       };
  //       // if (typeof parsedValue === "object") {
  //       setParsedJSON((prev: any) => {
  //         return [...prev, sectionDetails];
  //       });
  //       //   onChange && onChange([...parsedValue]);
  //       //   setSectionLoader(false);
  //       // } else {
  //       //   setSectionLoader(false);
  //       // }
  //     })
  //     .catch((err: any) => {
  //       console.log("err: ", err);
  //       // setSectionLoader(false);
  //     });
  // };

  // read attachments functions
  // const readSectionAttachments = (): any => {
  //   if (AllSectionsAttachments.length !== 0) {
  //     AllSectionsAttachments.forEach((item: any, index: number) => {
  //       const filteredItem: any = item?.filter(
  //         (item: any) => item?.FileName === "Sample.txt"
  //       );
  //       if (filteredItem.length > 0) {
  //         readTextFileFromTXT(filteredItem[0]);
  //         // setNewAttachment(false);
  //       } else {
  //         // setSectionLoader(false);
  //       }
  //     });
  //   }
  // };

  // lifecycle hooks
  useEffect(() => {
    if (TOCData?.data) {
      setTableData(TOCData);
    }
  }, [TOCData]);

  useEffect(() => {
    setMainData();
  }, [dispatch]);

  useEffect(() => {
    setScreens({
      ...screens,
      pageTitle: pageDetailsState?.pageTitle,
    });
  }, [pageDetailsState?.pageTitle]);

  // useEffect(() => {
  //   readSectionAttachments();
  // }, [AllSectionsAttachments]);

  // template for future use
  // const PDFView = (
  // <object
  //   key={3}
  //   data={documentPdfURL}
  //   type="application/pdf"
  //   width="100%"
  //   height="600px"
  // >
  //   <p className="textCenter">
  //     Your browser does not support PDFs. Please download the PDF to view it:
  //     <a href={documentPdfURL}>Download PDF</a>.
  //   </p>
  // </object>
  // );

  // const PDFHtmlView = (
  //   <div className={styles.DOCemptyMsg}>
  //     <span>Document is empty.</span>
  //   </div>
  // );

  return (
    <div className={styles.tocWrapper}>
      <div
        style={{
          justifyContent: isAdmin ? "flex-start" : "space-between",
        }}
        className={styles.topTOCHeader}
      >
        <div className={styles.flexcenter}>
          <PageTitle
            text={removeVersionFromDocName(
              screens.pageTitle ? screens.pageTitle : "Home"
            )}
          />
          {screens?.toc && isAdmin && (
            // <button
            //   onClick={() => {
            //     togglePopupVisibility(
            //       setPopupController,
            //       3,
            //       "open",
            //       "Change page title",
            //       popupData
            //     );
            //   }}
            // >
            //   <img src={editConfigurationImg} alt="editConfigurationImg" />
            // </button>
            <EditIcon
              className={styles.editIcon}
              onClick={() => {
                togglePopupVisibility(
                  setPopupController,
                  3,
                  "open",
                  "Change page title",
                  popupData
                );
              }}
            />
          )}

          {screens?.pageTitle?.toLowerCase()?.includes("initiate version") ? (
            screens?.pageTitle?.toLowerCase()?.includes("minor") ? (
              <div className={styles.versionPillsWrapper}>
                <div className={styles.versionPill}>
                  v{screens?.editDocumentData?.version}
                </div>
                <ArrowRightAlt
                  style={{
                    fontSize: "18px",
                    color: "#555",
                  }}
                />
                <div className={styles.versionPill}>
                  v
                  {
                    getNextVersions(screens?.editDocumentData?.version)
                      .minorVersion
                  }
                </div>
              </div>
            ) : (
              <div className={styles.versionPillsWrapper}>
                <div className={styles.versionPill}>
                  v{screens?.editDocumentData?.version}
                </div>
                <ArrowRightAlt
                  style={{
                    fontSize: "18px",
                    color: "#555",
                  }}
                />
                <div className={styles.versionPill}>
                  v
                  {
                    getNextVersions(screens?.editDocumentData?.version)
                      .majorVersion
                  }
                </div>
              </div>
            )
          ) : (
            ""
          )}
        </div>

        {!isAdmin && (
          <div>
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
          </div>
        )}
      </div>

      {screens.toc ? (
        <>
          {/* filters section */}
          {isAdmin && (
            <div className={styles.filters}>
              <div>
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
              </div>

              <div className={styles.rhs}>
                <span
                  style={{
                    color: "#160364",
                    fontFamily: "interMedium, sans-serif",
                  }}
                >
                  All Versions
                </span>
                <InputSwitch
                  checked={filterOptions.isArchived}
                  className="sectionToggler"
                  disabled={
                    tableData.data.length === 0 ||
                    tableData.loading ||
                    filterOptions.isDraft
                  }
                  onChange={(e) => {
                    setFilterOptions((prev) => ({
                      ...prev,
                      searchTerm: "",
                      filterByStatus: "",
                      isArchived: e.value,
                      isDraft: false,
                    }));
                  }}
                />
                <span
                  style={{
                    color: "#160364",
                    fontFamily: "interMedium, sans-serif",
                  }}
                >
                  Draft Documents
                </span>
                <InputSwitch
                  checked={filterOptions.isDraft}
                  className="sectionToggler"
                  disabled={
                    tableData.data.length === 0 ||
                    tableData.loading ||
                    filterOptions.isArchived
                  }
                  onChange={(e) => {
                    setFilterOptions((prev) => ({
                      ...prev,
                      searchTerm: "",
                      filterByStatus: "",
                      isDraft: e.value,
                      isArchived: false,
                    }));
                  }}
                />
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
                  disabled={
                    tableData.data.length === 0 ||
                    tableData.loading ||
                    filterOptions.isDraft ||
                    filterOptions.isArchived
                  }
                />
                {filterOptions?.searchTerm ||
                filterOptions?.filterByStatus ||
                filterOptions?.isArchived ||
                filterOptions?.isDraft ? (
                  <button
                    className={styles.clearFilterBtn}
                    onClick={() => {
                      setFilterOptions((prev: any) => ({
                        ...prev,
                        searchTerm: "",
                        filterByStatus: "",
                        isDraft: false,
                        isArchived: false,
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
                  disabled={tableData.loading}
                  menuItems={filterOptions.createOptions}
                />
              </div>
            </div>
          )}

          {/* table section */}
          <Table
            headers={tableData.headers}
            loading={tableData.loading}
            columns={[
              "refID",
              "createdDate",
              "nextReviewDate",
              "status",
              "isVisible",
            ]}
            filters={filterOptions}
            data={tableData.data}
            tableData={tableData}
            actions={true}
            defaultTable={false}
            loadData={setMainData}
            renderActions={(item: any, index: number) => {
              console.log("itemDetails", item);

              const nextReviewDate = dayjs(
                item?.fields?.nextReviewDate,
                "DD/MM/YYYY"
              );
              const isMinorVersion = dayjs().isBefore(nextReviewDate);
              const versionType = isMinorVersion ? "minor" : "major";
              const pageTitle = `${item.name} - Initiate version (${versionType})`;

              const latestDoc = item?.fileIDFromList === item?.fileID;

              return (
                <>
                  {isAdmin && latestDoc && (
                    <>
                      {item?.fields?.status?.toLowerCase() !== "approved" && (
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
                          onClick={(event: any) => {
                            // event.stopPropagation();
                            event.preventDefault();
                            if (isAdmin) {
                              navigate(
                                `/admin/my_tasks/${item?.docName}/content_developer`
                              );
                              const taskDetails = {
                                documentDetailsId: item?.ID,
                                role: "admin",
                              };
                              getSectionsDetails(
                                taskDetails,
                                null,
                                item.docVersion,
                                dispatch
                              );
                            }
                          }}
                        />
                      )}
                      {item?.fields?.status?.toLowerCase() !== "approved" && (
                        <DefaultButton
                          disableRipple={true}
                          style={{
                            minWidth: "auto",
                          }}
                          btnType={"actionBtn"}
                          text={<img src={editIcon} />}
                          key={index}
                          onClick={(event: any) => {
                            // event.stopPropagation();
                            event.preventDefault();
                            setScreens((prev) => ({
                              ...prev,
                              NewDocument: true,
                              toc: false,
                              pageTitle: `${item.name} - Edit Document`,
                              editDocumentData: item,
                            }));
                          }}
                        />
                      )}
                    </>
                  )}
                  <DefaultButton
                    disableRipple={true}
                    style={{
                      minWidth: "auto",
                    }}
                    btnType={"actionBtn"}
                    text={<img src={viewDocBtn} />}
                    key={index}
                    onClick={async (event: any) => {
                      // event.stopPropagation();
                      event.preventDefault();
                      // window.open(item?.url);
                      const fileDetails = await sp.web.lists
                        .getByTitle(LISTNAMES.AllDocuments)
                        .items.getById(item.fileID)
                        .select("FileRef", "FileLeafRef")();

                      const baseUrl = `${contextProps?._pageContext._site.absoluteUrl}/_layouts/15/Doc.aspx`;
                      const encodedFilePath = encodeURIComponent(
                        fileDetails?.FileRef
                      );
                      const encodedFileName = encodeURIComponent(
                        fileDetails.FileLeafRef
                      );
                      console.log(
                        fileDetails,
                        baseUrl,
                        encodedFilePath,
                        encodedFileName
                      );

                      setDocumentPdfURL(
                        `${baseUrl}?sourcedoc=${encodedFilePath}&file=${encodedFileName}&action=default`
                      );

                      setDocuementStatus(item?.isPdfGenerated);
                      togglePopupVisibility(
                        setPopupController,
                        2,
                        "open",
                        `Preview Document`,
                        "",
                        item?.isPdfGenerated ? "70vw" : "820px"
                        // `Preview Document - ${item.name}`
                      );
                      // getDocumentRelatedSections(item.ID, dispatch);
                      setDocumentId(item?.ID);
                    }}
                  />
                  {isAdmin &&
                    item?.fields?.status?.toLowerCase() === "approved" &&
                    latestDoc && (
                      <DefaultButton
                        disableRipple={true}
                        style={{
                          minWidth: "auto",
                        }}
                        btnType={"actionBtn"}
                        text={<img src={newversionBtn} />}
                        key={index}
                        onClick={(event: any) => {
                          // event.stopPropagation();
                          event.preventDefault();
                          if (versionType === "minor") {
                            setTempScreens((prev) => ({
                              ...prev,
                              NewDocument: true,
                              toc: false,
                              pageTitle: pageTitle,
                              editDocumentData: item,
                            }));

                            togglePopupVisibility(
                              setPopupController,
                              4,
                              "open",
                              `Change Document Version`
                            );
                          } else {
                            setScreens((prev) => ({
                              ...prev,
                              NewDocument: true,
                              toc: false,
                              pageTitle: pageTitle,
                              editDocumentData: item,
                            }));
                          }
                        }}
                      />
                    )}
                </>
              );
            }}
            renderActionsForFolders={(item: any, folderType: string) => {
              return (
                isAdmin && (
                  <DefaultButton
                    disableRipple={true}
                    style={{
                      minWidth: "auto",
                    }}
                    btnType={"actionBtn"}
                    text={<img src={editIcon} />}
                    key={folderType}
                    onClick={(event: any) => {
                      // event.stopPropagation();
                      event.preventDefault();
                      const popupType: number =
                        folderType?.toLowerCase() === "parentfolder" ? 0 : 1;
                      const popupTitle: string =
                        folderType?.toLowerCase() === "parentfolder"
                          ? "Edit Group"
                          : "Edit Sub Group";
                      togglePopupVisibility(
                        setPopupController,
                        popupType,
                        "open",
                        popupTitle,
                        item
                      );

                      setPopupInputValues(item, folderType);
                    }}
                  />
                )
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

export default memo(TableOfContents);
