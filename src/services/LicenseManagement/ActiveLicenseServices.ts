/* eslint-disable no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp";
import { GROUPS, LISTNAMES } from "../../config/config";
import {
  setLicenseDetails,
  setRolesDetails,
} from "../../redux/features/MainSPContextSlice";
import SpServices from "../SPServices/SpServices";
import { togglePopupVisibility } from "../../utils/togglePopup";

export const checkLicenseKey = async (dispatch: any): Promise<any> => {
  try {
    const response = await SpServices.SPReadItems({
      Listname: LISTNAMES.LicenseConfiguration,
    });
    if (response.length > 0) {
      const licenseDetails = {
        LicenseKey: response[0]?.Title,
        LicenseStatus: "Active",
        ActivateDate: response[0]?.ActivateDate,
        ExpiryDate: response[0]?.ExpiryDate,
        Valid: true,
        Message: "",
      };
      dispatch(setLicenseDetails(licenseDetails));
    }
  } catch (err: any) {
    console.log("Error : ", err);
  }
};

export const checkAndUpdateLicenseKey = async (
  formData: any,
  setLoaderState: any
): Promise<any> => {
  const payload = {
    Title: formData?.ActivateKey?.value,
    ActivateDate: new Date(),
    ExpiryDate: new Date(),
  };
  try {
    setLoaderState({
      isLoading: {
        inprogress: true,
        success: false,
        error: false,
      },
      visibility: true,
      text: "Check license key in progress. Please Wait...",
    });
    await SpServices.SPAddItem({
      Listname: LISTNAMES.LicenseConfiguration,
      RequestJSON: payload,
    })
      .then(async (res: any) => {
        // const licenseDetails = {
        //   LicenseKey: formData?.ActivateKey?.value,
        //   LicenseStatus: "Active",
        //   ActivateDate: new Date(),
        //   ExpiryDate: new Date(),
        //   Valid: true,
        //   Message: "",
        // };
        // const currentUser: any = await sp.web.currentUser.get();
        const group = await sp.web.siteGroups.add({ Title: "ReadifyEM_Admin" });
        // const group = await sp.web.siteGroups.add({
        //   Title: "ReadifyEM_Admin",
        //   Description:
        //     "Use this group to maintain a user with admin-level permissions and this group is used in the application for authorization.",
        //   OnlyAllowMembersViewMembership: false,
        //   Owner: currentUser?.Id,
        // });
        const roleDefinition = await sp.web.roleDefinitions
          .getByName("Full Control")
          .get();
        await sp.web.roleAssignments.add(group.data.Id, roleDefinition.Id);
        const currentUser = await sp.web.currentUser();
        await sp.web.siteGroups
          .getById(group.data.Id)
          .users.add(currentUser.LoginName);

        setLoaderState({
          isLoading: { inprogress: false, success: true, error: false },
          visibility: true,
          text: "License key checked successfully.",
        });
        // dispatch(setLicenseDetails(licenseDetails));
      })
      .catch((err: any) => {
        console.log("Error : ", err);
      });
  } catch (err: any) {
    console.log("Error : ", err);
  }
};

// User configure services

export const getReadifyEMRolesAndUsers = async (
  dispatch: any
): Promise<any> => {
  try {
    const adminUsers = await sp.web.siteGroups
      // .getByName("ReadifyEM_Admin")
      .getByName(GROUPS.AdminGroup)
      .users.get()
      .then((res: any) => {
        console.log("admin group response", res);

        const tempArr = res?.map((obj: any) => {
          return {
            Name: obj?.Title,
            Email: obj?.Email,
            Id: obj?.Id,
            LoginName: obj?.LoginName,
          };
        });
        return tempArr;
      })
      .catch((err) => console.log("Error : ", err));
    const memberGroup = await sp.web.associatedMemberGroup();
    const groupWithUsers = await sp.web.siteGroups
      .getById(memberGroup.Id)
      .users();

    const memberUsers = groupWithUsers?.map((obj: any) => {
      return {
        Name: obj?.Title,
        Email: obj?.Email,
        Id: obj?.Id,
        LoginName: obj?.LoginName,
      };
    });
    dispatch(
      setRolesDetails({ adminUsers: adminUsers, memberUsers: memberUsers })
    );
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const addUserToSiteGroup = async (
  isAdmin: boolean,
  userData: any,
  setPopupController: any,
  dispatch: any
): Promise<any> => {
  debugger;
  try {
    const user = await await sp.web.getUserById(userData?.value?.id).get();
    console.log(user);
    if (isAdmin) {
      const group = await sp.web.siteGroups.getByName(GROUPS.AdminGroup);
      await group.users.add(user?.LoginName).then(async (res: any) => {
        await getReadifyEMRolesAndUsers(dispatch);
      });
      togglePopupVisibility(setPopupController, 0, "close");
    } else {
      const memberGroup = await sp.web.associatedMemberGroup();
      await sp.web.siteGroups
        .getById(memberGroup.Id)
        .users.add(user?.LoginName)
        .then(async (res: any) => {
          await getReadifyEMRolesAndUsers(dispatch);
        });
      togglePopupVisibility(setPopupController, 0, "close");
    }
  } catch (err) {
    console.log("Error : ", err);
  }
};
export const removeUserToSiteGroup = async (
  isAdmin: boolean,
  userLoginName: string,
  dispatch: any
): Promise<any> => {
  debugger;
  try {
    if (isAdmin) {
      const group = await sp.web.siteGroups.getByName(GROUPS.AdminGroup);
      await group.users
        .removeByLoginName(userLoginName)
        .then(async (res: any) => {
          await getReadifyEMRolesAndUsers(dispatch);
        });
    } else {
      const memberGroup = await sp.web.associatedMemberGroup();
      await sp.web.siteGroups
        .getById(memberGroup.Id)
        .users.removeByLoginName(userLoginName)
        .then(async (res: any) => {
          await getReadifyEMRolesAndUsers(dispatch);
        });
    }
  } catch (err) {
    console.log("Error : ", err);
  }
};
