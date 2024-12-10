/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useState } from "react";
// import styles from "./UserConfigure.module.scss";
import styles from "./UserConfigure.module.scss";
import {
  addUserToSiteGroup,
  getReadifyEMRolesAndUsers,
  removeUserToSiteGroup,
} from "../../../services/LicenseManagement/ActiveLicenseServices";
// import Table from "../../../webparts/readifyEmMain/components/Table/Table";
import DefaultButton from "../../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
// const viewDocBtn: any = require("../../../assets/images/svg/viewEye.svg");
// import AddIcon from "@mui/icons-material/Add";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./UserConfigure.css";
import PageTitle from "../../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import Popup from "../../../webparts/readifyEmMain/components/common/Popups/Popup";
import { togglePopupVisibility } from "../../../utils/togglePopup";
import CustomPeoplePicker from "../../../webparts/readifyEmMain/components/common/CustomInputFields/CustomPeoplePicker";
import { validateField } from "../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import CircularSpinner from "../../../webparts/readifyEmMain/components/common/AppLoader/CircularSpinner";

const UserConfigure = (): JSX.Element => {
  const dispatch = useDispatch();
  const rolesDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.rolesDetails
  );
  const initialPopupController = [
    {
      open: false,
      popupTitle: "",
      popupWidth: "513px",
      popupType: "custom",
      defaultCloseBtn: true,
      popupData: "",
    },
  ];
  //   const [filterOptions, setFilterOptions] = useState({
  //     searchTerm: "",
  //   });
  const [formData, setFormData] = useState<any>({
    User: {
      value: [],
      isValid: true,
      errorMsg: "Select User",
      validationRule: { required: true, type: "array" },
    },
  });
  const [handleForm, setHandleForm] = useState<any>({
    type: "",
    group: "",
  });
  const [adminUsers, setadminUsers] = useState<any>({
    data: [],
    headers: ["Name", "Email"],
    loading: true,
  });
  const [memberUsers, setMemberUsers] = useState<any>({
    data: [],
    headers: ["Name", "Email"],
    loading: true,
  });
  const [popupController, setPopupController] = useState(
    initialPopupController
  );
  console.log("adminUsers", adminUsers);
  console.log("memberUsers", memberUsers);
  console.log("formData", formData);

  const handleInputChange = (
    field: string,
    value: any,
    isValid: boolean,
    errorMsg: string = ""
  ): void => {
    setFormData((prevData: any) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value: value ? value : [],
        isValid: isValid,
        errorMsg: isValid ? "" : errorMsg,
      },
    }));
  };
  const handleUserSubmit = async (isAdmin: boolean): Promise<any> => {
    if (isAdmin) {
      await addUserToSiteGroup(
        isAdmin,
        formData?.User,
        setPopupController,
        dispatch
      );
    } else {
      await addUserToSiteGroup(
        isAdmin,
        formData?.User,
        setPopupController,
        dispatch
      );
    }
  };

  const popupInputs: any[] = [
    [
      <div key={1}>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
          <div style={{ width: "100%" }}>
            <CustomPeoplePicker
              labelText="Shout-out to"
              isValid={!formData?.User?.isValid}
              errorMsg={formData?.User?.errorMsg}
              // selectedItem={[formData.User.value]}
              selectedItem={
                formData?.User?.value[0]?.secondaryText ||
                formData?.User?.value[0]?.email ||
                formData?.User
              }
              onChange={(item: any) => {
                const value = item[0];
                console.log("value: ", value);
                const { isValid, errorMsg } = validateField(
                  "User",
                  item,
                  formData?.User?.validationRule
                );
                handleInputChange("User", value, isValid, errorMsg);
              }}
            />
          </div>
        </div>
      </div>,
    ],
  ];
  const popupActions: any[] = [
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        size: "large",
        onClick: () => {
          togglePopupVisibility(setPopupController, 0, "close");
        },
      },
      {
        text: "Add",
        btnType: "primary",
        endIcon: false,
        startIcon: false,
        disabled: !Object.keys(formData).every((key) => formData[key].isValid),
        // disabled: !["SendTowards", "Description"].every(
        //   (key) => formData[key]?.isValid
        // ),
        size: "large",
        onClick: async () => {
          if (handleForm?.group === "Admin") {
            await handleUserSubmit(true);
            console.log("Admin");
          } else {
            await handleUserSubmit(false);
            console.log("Member");
          }
          // await handleUpdateShoutout();
        },
      },
    ],
  ];

  useEffect(() => {
    console.log("rolesDetails", rolesDetails);
    setadminUsers({
      ...adminUsers,
      data: rolesDetails?.adminUsers,
      loading: false,
    });
    setMemberUsers({
      ...memberUsers,
      data: rolesDetails?.memberUsers,
      loading: false,
    });
    // setFilterOptions({
    //   searchTerm: "",
    // });
  }, [rolesDetails]);
  useEffect(() => {
    getReadifyEMRolesAndUsers(dispatch);
  }, []);
  const adminActionBodyTemplate = (rowData: any): any => {
    return (
      <DefaultButton
        disableRipple={true}
        style={{
          minWidth: "auto",
        }}
        btnType={"actionBtn"}
        text={<PersonRemoveIcon />}
        onClick={() => {
          removeUserToSiteGroup(true, rowData?.LoginName, dispatch);
        }}
      />
    );
  };
  const membersActionBodyTemplate = (rowData: any): any => {
    return (
      <DefaultButton
        disableRipple={true}
        style={{
          minWidth: "auto",
        }}
        btnType={"actionBtn"}
        text={<PersonRemoveIcon />}
        onClick={() => {
          removeUserToSiteGroup(false, rowData?.LoginName, dispatch);
        }}
      />
    );
  };
  return (
    <div>
      <div className={styles.userConfigureWrapper}>
        <div className={`${styles.adminTableSection} admin`}>
          <div className={styles.pageTitleHeader}>
            <PageTitle text={"Admin"} />

            {/* filters section */}
            <div className={styles.filters}>
              {/* <CustomInput
                value={filterOptions.searchTerm}
                onChange={(value: string) => {
                  setFilterOptions((prev) => ({
                    ...prev,
                    searchTerm: value,
                  }));
                }}
                disabled={false}
                icon
                placeholder="Search"
              /> */}

              <div className={styles.rhs}>
                <DefaultButton
                  text={<PersonAddAlt1Icon />}
                  title="Reset Content"
                  onlyIcon={true}
                  disabled={false}
                  btnType="primary"
                  onClick={() => {
                    setHandleForm({
                      type: "New",
                      group: "Admin",
                    });
                    togglePopupVisibility(
                      setPopupController,
                      0,
                      "open",
                      "Add Admin"
                    );
                  }}
                />
              </div>
            </div>
          </div>
          {/* <Table
            data={adminUsers?.data}
            headers={adminUsers?.headers}
            filters={filterOptions}
            loading={adminUsers?.loading}
            loadData={setadminUsers}
            columns={["Name", "Email"]}
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
                        src={viewDocBtn}
                        style={{
                          minWidth: "auto",
                          height: "24px",
                        }}
                      />
                    }
                    key={index}
                    onClick={() => {
                      // togglePopupVisibility(setPopupController, 2, "open");
                      // setDefinitionsData(initialDefinitionsData);
                      // LoadDefinitionData(
                      //   item?.ID,
                      //   definitionsData,
                      //   setDefinitionsData,
                      //   item?.definitionName,
                      //   false,
                      //   dispatch
                      // );
                    }}
                  />
                </>
              );
            }}
            actions={true}
            defaultTable={true}
          /> */}
          {adminUsers?.loading ? (
            <CircularSpinner />
          ) : (
            <DataTable value={adminUsers?.data} className="p-datatable-sm">
              <Column
                className="col1"
                field="Name"
                header="Name"
                style={{ width: "30%" }}
              />
              <Column
                className="col1"
                field="Email"
                header="Email"
                style={{ width: "50%" }}
              />
              <Column
                className="col4"
                header="Action"
                style={{ width: "20%" }}
                body={adminActionBodyTemplate}
              />
            </DataTable>
          )}
        </div>
        <div className={`${styles.memberTableSection} member`}>
          <div className={styles.pageTitleHeader}>
            <PageTitle text={"Members"} />
            <div className={styles.filters}>
              {/* <CustomInput
                value={filterOptions.searchTerm}
                onChange={(value: string) => {
                  setFilterOptions((prev) => ({
                    ...prev,
                    searchTerm: value,
                  }));
                }}
                disabled={false}
                icon
                placeholder="Search"
              /> */}

              <div className={styles.rhs}>
                <DefaultButton
                  text={<PersonAddAlt1Icon />}
                  title="Reset Content"
                  onlyIcon={true}
                  disabled={false}
                  btnType="primary"
                  onClick={() => {
                    setHandleForm({
                      type: "New",
                      group: "Member",
                    });
                    togglePopupVisibility(
                      setPopupController,
                      0,
                      "open",
                      "Add Member"
                    );
                  }}
                />
              </div>
            </div>
          </div>
          {/* <Table
            data={memberUsers?.data}
            headers={memberUsers?.headers}
            filters={filterOptions}
            loading={memberUsers?.loading}
            loadData={setadminUsers}
            columns={["Name", "Email"]}
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
                        src={viewDocBtn}
                        style={{
                          minWidth: "auto",
                          height: "24px",
                        }}
                      />
                    }
                    key={index}
                    onClick={() => {
                      // togglePopupVisibility(setPopupController, 2, "open");
                      // setDefinitionsData(initialDefinitionsData);
                      // LoadDefinitionData(
                      //   item?.ID,
                      //   definitionsData,
                      //   setDefinitionsData,
                      //   item?.definitionName,
                      //   false,
                      //   dispatch
                      // );
                    }}
                  />
                </>
              );
            }}
            actions={true}
            defaultTable={true}
          /> */}
          <DataTable value={memberUsers?.data} className="p-datatable-sm">
            <Column
              className="col1"
              field="Name"
              header="Name"
              style={{ width: "30%" }}
            />
            <Column
              className="col1"
              field="Email"
              header="Email"
              style={{ width: "50%" }}
            />
            <Column
              className="col4"
              header="Action"
              style={{ width: "20%" }}
              body={membersActionBodyTemplate}
            />
          </DataTable>
        </div>
      </div>
      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          isLoading={popupData?.isLoading}
          PopupType={popupData.popupType}
          onHide={() => {
            togglePopupVisibility(setPopupController, index, "close");
          }}
          popupTitle={
            popupData.popupType !== "confimation" && popupData.popupTitle
          }
          popupActions={popupActions[index]}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={popupData.defaultCloseBtn || false}
          confirmationTitle={popupData?.confirmationTitle}
          popupHeight={index === 0 ? true : false}
        />
      ))}
    </div>
  );
};

export default memo(UserConfigure);
