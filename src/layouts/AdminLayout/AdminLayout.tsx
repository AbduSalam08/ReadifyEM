import { Outlet } from "react-router-dom";
// import Header from "../../components/Header/Header";
import styles from "./AdminLayout.module.scss";
const AdminLayout = (): JSX.Element => {
  return (
    <div className={styles.AdminLayout}>
      {/* <Header /> */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;
