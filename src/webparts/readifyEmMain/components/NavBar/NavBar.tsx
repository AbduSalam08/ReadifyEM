/* eslint-disable react/self-closing-comp */
import NavBarTab from "./NavBarTab";

// active tab images
import toc from "../../assets/navBar/Active/toc.svg";
import tasks from "../../assets/navBar/Active/tasks.svg";
import definitions from "../../assets/navBar/Active/definitons.svg";
import SDDTemplates from "../../assets/navBar/Active/SDDTemplates.svg";

// in active tab images
import tocInActive from "../../assets/navBar/InActive/toc.svg";
import tasksInActive from "../../assets/navBar/InActive/tasks.svg";
import definitionsInActive from "../../assets/navBar/InActive/definitons.svg";
import SDDTemplatesInActive from "../../assets/navBar/InActive/SDDTemplates.svg";
import { memo, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import styles from "./NavBar.module.scss";
const NavBar = ({ isAdmin }: { isAdmin: boolean }): JSX.Element => {
  const [navBarProps, setNavBarProps] = useState({
    expand: false,
  });

  const [navTabs, setNavTabs] = useState([
    {
      tabName: "EM Manual - Table Of Content",
      role: "common",
      tabIcon: tocInActive,
      tabIconActive: toc,
      isActive: true,
      routePath: "/em_manual",
    },
    {
      tabName: "My Tasks",
      role: "common",
      tabIcon: tasksInActive,
      tabIconActive: tasks,
      isActive: false,
      routePath: "/my_tasks",
    },
    {
      tabName: "Definitions",
      role: "admin",
      isActive: false,
      tabIconActive: definitions,
      tabIcon: definitionsInActive,
      routePath: "/definitions",
    },
    {
      tabName: "SDD - Templates",
      role: "admin",
      isActive: false,
      tabIconActive: SDDTemplates,
      tabIcon: SDDTemplatesInActive,
      routePath: "/sdd_templates",
    },
  ]);

  const toggleActive = (index: number): void => {
    const updatedDashboard = navTabs.map((e, i) => ({
      ...e,
      isActive: i === index,
    }));

    setNavTabs(updatedDashboard);
  };

  // Filter tabs based on user role
  const filteredTabs = isAdmin
    ? navTabs
    : navTabs.filter((tab) => tab.role === "common");

  return (
    <div
      className={
        navBarProps.expand ? styles.NavBarWrapperMax : styles.NavBarWrapperMin
      }
    >
      <div
        className={`${styles.MenuBtn} ${
          navBarProps.expand ? styles.expand : styles.MenuMin
        }`}
        onClick={() => {
          setNavBarProps((prev) => ({
            ...prev,
            expand: !prev.expand,
          }));
        }}
      >
        {navBarProps.expand ? <MenuOpenIcon /> : <MenuIcon />}
      </div>
      <div className={styles.NavContent}>
        {filteredTabs.map((tab, index) => (
          <NavBarTab
            key={index}
            tab={tab}
            index={index}
            click={toggleActive}
            navBarProps={navBarProps}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(NavBar);
