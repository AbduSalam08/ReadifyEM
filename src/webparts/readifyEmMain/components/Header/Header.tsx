/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/self-closing-comp */

import { Tab, Tabs } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useSelector } from "react-redux";
const logo = require("../../../../assets/images/png/logo/Readify-EM.png");

const Header = (): JSX.Element => {
  const currentUserDetails: any = useSelector(
    (state: any) => state.MainSPContext.currentUserDetails
  );
  console.log("currentUserDetails: ", currentUserDetails);
  const isAdmin: boolean = currentUserDetails?.role === "Admin";
  const rootPath = isAdmin ? "/admin" : "/user";
  console.log(
    "window.location.href: ",
    window.location.href.includes("workbench")
  );
  const isWorkBenchLink: boolean = window.location.href.includes("workbench");
  console.log("isWorkBenchLink: ", isWorkBenchLink);

  const navigate = useNavigate();

  const data = isAdmin
    ? [
        {
          label: "Table of contents",
          path: `${rootPath}/em_manual`,
        },
        {
          label: "My Tasks",
          path: `${rootPath}/my_tasks`,
        },

        {
          label: "Definitions",
          path: `${rootPath}/definitions`,
        },

        {
          label: "SDD Templates",
          path: `${rootPath}/sdd_templates`,
        },
      ]
    : [
        {
          label: "Table of contents",
          path: `${rootPath}/em_manual`,
        },
        {
          label: "My Tasks",
          path: `${rootPath}/my_tasks`,
        },
      ];

  const [value, setValue] = useState(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  }, [isAdmin]);

  // useEffect(() => {
  //   if (isWorkBenchLink) {
  //     console.log("isWorkBenchLink: ", isWorkBenchLink);
  //     navigate("/user");
  //   } else {
  //     console.log("isnotWorkBenchLink");
  //     navigate("/user");
  //   }
  // }, [isWorkBenchLink]);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.logo}>
        <img src={logo} alt="Readify EM Logo" />
        {/* <span>Readify EM</span> */}
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example"
        >
          {data?.map(({ label, path }) => (
            <Tab
              disableRipple
              key={label}
              label={label}
              onClick={() => {
                navigate(path);
              }}
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default memo(Header);
