/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.scss";

interface NavBarTabProps {
  tab: any;
  index: number;
  click: any;
  navBarProps?: any;
}

const NavBarTab = ({
  tab,
  index,
  click,
  navBarProps,
}: NavBarTabProps): JSX.Element => {
  return (
    <div
      className={`${styles.NavTab}  ${
        tab.isActive && navBarProps?.expand
          ? styles.selectedMax
          : tab.isActive && !navBarProps?.expand
          ? styles.selectedMin
          : !navBarProps?.expand
          ? styles.navLinkMin
          : ""
      }`}
      onClick={() => {
        click(index);
      }}
    >
      {/* Render icon, name, and route */}
      <NavLink to={tab.routePath} className={`${styles.navLink}`}>
        <div className={styles.imgWrapper}>
          <img src={tab.isActive ? tab.tabIconActive : tab.tabIcon} />
        </div>
        <span>{tab.tabName}</span>
      </NavLink>
    </div>
  );
};

export default NavBarTab;
