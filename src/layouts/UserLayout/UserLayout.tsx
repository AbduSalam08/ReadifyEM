import { Outlet } from "react-router-dom";
import styles from "./UserLayout.module.scss";

const UserLayout = (): JSX.Element => {
  return (
    <div className={styles.UserLayout}>
      <Outlet />
    </div>
  );
};

export default UserLayout;
