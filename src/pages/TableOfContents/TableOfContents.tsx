/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
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
import { emptyCheck } from "../../utils/validations";
import CustomTreeDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomTreeDropDown";
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const TableOfContents = (): JSX.Element => {
  const [screens, setScreens] = useState({
    toc: true,
    NewDocument: false,
  });

  const [filterOptions, setFilterOptions] = useState({
    search: "",
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
          }));
        },
      },
      {
        text: "Group",
        onClick: () => {
          togglePopupVisibility(0, "open");
        },
      },
      {
        text: "Sub Group",
        onClick: () => {
          togglePopupVisibility(1, "open");
        },
      },
    ],
  });

  const [popupData, setPopupData] = useState({
    addNewGroupName: {
      value: "",
      isValid: true,
      errorMsg: "group name required",
    },
    addNewSubGroupName: {
      value: "",
      isValid: true,
      errorMsg: "group name required",
    },
    sectionPath: {
      value: "",
      isValid: true,
      errorMsg: "group name required",
    },
  });
  console.log("popupData: ", popupData);

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

  const popupInputs: any = [
    <CustomInput
      key={1}
      size="MD"
      labelText="Name"
      withLabel
      icon={false}
      onChange={(value: string) => {
        console.log("value: ", value);
        handleInputChange(value, "addNewGroupName");
      }}
      value={popupData.addNewGroupName.value}
      placeholder="Enter here..."
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
            console.log("value: ", value);
            handleInputChange(value, "addNewSubGroupName");
          }}
          value={popupData.addNewSubGroupName.value}
          placeholder="Enter here..."
          isValid={!popupData.addNewSubGroupName.isValid}
          errorMsg={popupData.addNewSubGroupName.errorMsg}
        />
      </div>,
      <div key={"1.2"} className={styles.subGroupInput}>
        <CustomTreeDropDown
          key={3}
          labelText="Section path"
          withLabel={true}
          size="MD"
          onChange={(value: string) => {
            console.log("value: ", value);
            handleInputChange(value, "sectionPath");
          }}
          placeholder="Select"
          value={popupData.sectionPath.value}
          isValid={!popupData.sectionPath.isValid}
          errorMsg={popupData.sectionPath.errorMsg}
          options={[
            {
              key: "0",
              label: "Emergency Management Program Folder",
              data: "Emergency Management Program Folder",
              children: [
                {
                  key: "0-1",
                  label: "Policies & Procedures",
                  data: "Policies & Procedures Folder",
                },
              ],
            },
            {
              key: "1",
              label: "Emergency Operations Plan",
              data: "Emergency Operations Plan Folder",
            },
            {
              key: "2",
              label: "Corporate Business Continuity Plan (BCP)",
              data: "Corporate Business Continuity Plan (BCP) Folder",
            },
          ]}
        />
      </div>,
    ],
  ];

  const [popupController, setPopupController] = useState([
    {
      key: "new group",
      popupType: "custom",
      popupTitle: "Add New Group",
      popupWidth: "450px",
      actionBtns: [
        {
          text: "Cancel",
          btnType: "darkGreyVariant",
          disabled: false,
          endIcon: false,
          startIcon: false,
          onClick: () => {
            togglePopupVisibility(0, "close");
          },
        },
        {
          text: "Submit",
          btnType: "primary",
          disabled: false,
          endIcon: false,
          startIcon: false,
          onClick: () => {
            console.log("clicked submit");
          },
        },
      ],
      open: false,
    },
    {
      key: "new sub group",
      popupType: "custom",
      popupTitle: "Add New Sub Group",
      popupWidth: "500px",
      actionBtns: [
        {
          text: "Cancel",
          btnType: "darkGreyVariant",
          disabled: false,
          endIcon: false,
          startIcon: false,
          onClick: () => {
            togglePopupVisibility(1, "close");
          },
        },
        {
          text: "Submit",
          btnType: "primary",
          disabled: false,
          endIcon: false,
          startIcon: false,
          onClick: () => {
            console.log("clicked submit");
          },
        },
      ],
      open: false,
    },
  ]);

  const togglePopupVisibility = (
    popupIndex: number,
    action?: "open" | "close"
  ): void => {
    setPopupController((prev: any) => {
      const updatedPopups = [...prev];
      updatedPopups[popupIndex].open = action === "open";
      return updatedPopups;
    });

    setFilterOptions((prev) => ({
      ...prev,
      menuBtnExternalController: null,
    }));
  };

  // Define the initial state of the table
  const [tableData, setTableData] = useState({
    headers: [
      "Document Name",
      "Created At",
      "Next Review",
      "Status",
      "Visibility",
      "Action",
    ],
    loading: false,
    data: [],
  });

  console.log("tableData: ", tableData);

  // Define the LibraryItem interface
  interface LibraryItem {
    name: string;
    url: string;
    fields: any;
    items?: LibraryItem[];
  }

  // useEffect to fetch library items and update table data
  useEffect(() => {
    const getLibraryItems = async () => {
      setTableData((prevData) => ({ ...prevData, loading: true })); // Set loading to true
      const items = await fetchFoldersAndFiles(
        "/sites/ReadifyEM/AllDocuments/Main"
      );
      setTableData((prevData: any) => ({
        ...prevData,
        data: items,
        loading: false,
      }));
    };

    getLibraryItems();
  }, []);

  // Function to fetch folders and files
  const fetchFoldersAndFiles = async (
    folderUrl: string
  ): Promise<LibraryItem[]> => {
    const folder = sp.web.getFolderByServerRelativePath(folderUrl);

    const [folders, files] = await Promise.all([
      folder.folders(),
      folder.files(),
    ]);

    const folderItems: LibraryItem[] = [];

    for (const subFolder of folders) {
      const subFolderFields = await sp.web
        .getFolderByServerRelativePath(subFolder.ServerRelativeUrl)
        .listItemAllFields.get();
      const subFolderItems = await fetchFoldersAndFiles(
        subFolder.ServerRelativeUrl
      );
      folderItems.push({
        name: subFolder.Name,
        url: subFolder.ServerRelativeUrl,
        fields: {
          name: subFolder.Name,
          status: subFolderFields.status,
          nextReview: subFolderFields.nextReview,
          createdDate: subFolderFields.createdDate,
          isVisible: subFolderFields.isVisible,
          Action: "-",
        },
        items: subFolderItems,
      });
    }

    for (const file of files) {
      const fileFields = await sp.web
        .getFileByServerRelativePath(file.ServerRelativeUrl)
        .listItemAllFields.get();
      folderItems.push({
        name: file.Name,
        url: file.ServerRelativeUrl,
        fields: fileFields,
      });
    }

    return folderItems;
  };
  return (
    <div className={styles.tocWrapper}>
      <PageTitle
        text={
          screens.NewDocument ? "New Document" : "EM Manual - Table Of Contents"
        }
      />

      {screens.toc ? (
        <>
          {/* filters section */}
          <div className={styles.filters}>
            <CustomInput
              value={filterOptions.search}
              onChange={(value: string) => {
                setFilterOptions((prev) => ({
                  ...prev,
                  search: value,
                }));
              }}
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
              />

              <MenuButton
                menuVisibility={filterOptions.menuBtnExternalController}
                externalController={setFilterOptions}
                buttonText="Create New"
                menuItems={filterOptions.createOptions}
              />
            </div>
          </div>

          {/* table section */}
          <Table
            headers={tableData.headers}
            loading={tableData.loading}
            searchTerm={filterOptions.search}
            data={tableData.data}
          />
        </>
      ) : (
        screens.NewDocument && <NewDocument setScreens={setScreens} />
      )}

      {/* popup sections */}
      {popupController?.map((popupData, index) => (
        <Popup
          key={index}
          PopupType="custom"
          onHide={() => togglePopupVisibility(index, "close")}
          popupTitle={popupData.popupTitle}
          popupActions={popupData.actionBtns}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={false}
        />
      ))}
    </div>
  );
};

export default memo(TableOfContents);
