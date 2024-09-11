/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import UserLayout from "../layouts/UserLayout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { RoleAuth } from "../services/RoleAUTH/RoleAUTHServices";

const RoleAuthorizationHOC = (): JSX.Element => {
  // redux dispatcher
  const dispatch = useDispatch();
  const mainContext: any = useSelector(
    (state: any) => state.MainSPContext.value
  );

  const currentUserDetails: any = useSelector(
    (state: any) => state.MainSPContext.currentUserDetails
  );

  const getRoleAuth = async (): Promise<any> => {
    const currentUserDetails: any = {
      userName: mainContext?._pageContext?._user?.displayName,
      Email: mainContext?._pageContext?._user?.email,
      id: mainContext?._pageContext?._user?.id,
    };
    await RoleAuth(currentUserDetails, dispatch);
  };

  useEffect(() => {
    getRoleAuth();
  }, []);

  return currentUserDetails?.role === "Admin" ? (
    <AdminLayout />
  ) : (
    <UserLayout />
  );
};

export default RoleAuthorizationHOC;
