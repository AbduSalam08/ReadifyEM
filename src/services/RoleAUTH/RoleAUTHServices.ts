/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp";
// import { GROUPS } from "../../config/config";
import { setCurrentUserDetails } from "../../redux/features/MainSPContextSlice";
// import SpServices from "../SPServices/SpServices";

export const RoleAuth = async (
  currentUser: any,
  dispatch?: any
): Promise<any> => {
  let currentUserDetails: any;

  await sp.web.siteGroups
    // .getByName(GROUPS.AdminGroup)
    .getByName("ReadifyEM_Admin")
    .users.get()
    .then((res: any) => {
      const defineUserIsAdmin: any[] = res?.filter((item: any) => {
        return currentUser?.Email === item?.UserPrincipalName;
      });

      // setting the current user details
      if (defineUserIsAdmin?.length === 0) {
        currentUserDetails = {
          userName: currentUser?.userName,
          email: currentUser?.Email,
          role: "User",
        };
      } else {
        currentUserDetails = {
          userName: defineUserIsAdmin[0]?.Title,
          email: defineUserIsAdmin[0]?.UserPrincipalName,
          role: "Admin",
        };
      }

      dispatch && dispatch(setCurrentUserDetails(currentUserDetails));
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};