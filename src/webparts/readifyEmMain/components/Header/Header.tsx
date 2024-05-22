/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/self-closing-comp */

import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
const logo = require("../../../../assets/images/png/logo/Readify-EM.png");

const Header = (): JSX.Element => {
  const mainContext: any = useSelector(
    (state: any) => state.MainSPContext.value
  );
  console.log("mainContext: ", mainContext);

  const rootPath = true ? "/admin" : "/user";

  const navigate = useNavigate();
  const data = [
    {
      label: "Table of Contents",
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
  ];

  const [value, setValue] = useState(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log(
      "mainContext?._pageContext?._user?.email: ",
      mainContext?._pageContext?._user?.email
    );
    if (true) {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  }, []);

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
          {data.map(({ label, path }) => (
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

export default Header;
