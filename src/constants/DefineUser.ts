/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

export const CurrentUserIsAdmin = (): boolean => {
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );
  return currentUserDetails?.role === "Admin";
};
