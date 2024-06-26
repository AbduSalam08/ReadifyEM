/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import UserLayout from "../layouts/UserLayout/UserLayout";

const RoleAuthorizationHOC = (): JSX.Element => {
  // const mainContext: any = useSelector(
  //   (state: any) => state.MainSPContext.value
  // );
  const [currentUser, setCurrentUser] = useState({
    admin: false,
    email: "abdulsalam@gmail.com",
  });

  useEffect(() => {
    if (true) {
      setCurrentUser((prev: any) => ({
        ...prev,
        admin: true,
      }));
    } else {
      setCurrentUser((prev: any) => ({
        ...prev,
        admin: false,
      }));
    }
  }, []);
  return currentUser.admin ? <AdminLayout /> : <UserLayout />;
};

export default RoleAuthorizationHOC;
