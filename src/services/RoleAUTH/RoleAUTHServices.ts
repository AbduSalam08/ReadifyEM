/* eslint-disable no-debugger */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp";
// import { GROUPS } from "../../config/config";
import { setCurrentUserDetails } from "../../redux/features/MainSPContextSlice";
import { GROUPS } from "../../config/config";
// import SpServices from "../SPServices/SpServices";

export const RoleAuth = async (
  currentUser: any,
  dispatch?: any
): Promise<any> => {
  let currentUserDetails: any;

  await sp.web.siteGroups
    // .getByName("ReadifyEM_Admin")
    .getByName(GROUPS.AdminGroup)
    .users.get()
    .then((res: any) => {
      const defineUserIsAdmin: any[] = res?.filter((item: any) => {
        return currentUser?.Email === item?.UserPrincipalName;
      });

      console.log("defineUserIsAdmin: ", defineUserIsAdmin);

      // setting the current user details
      if (defineUserIsAdmin?.length === 0) {
        currentUserDetails = {
          userName: currentUser?.userName,
          email: currentUser?.Email,
          role: "User",
          id: defineUserIsAdmin[0]?.id,
        };
      } else {
        currentUserDetails = {
          userName: defineUserIsAdmin[0]?.Title,
          email: defineUserIsAdmin[0]?.UserPrincipalName,
          role: "Admin",
          id: defineUserIsAdmin[0]?.id,
        };
      }

      dispatch && dispatch(setCurrentUserDetails(currentUserDetails));
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};
