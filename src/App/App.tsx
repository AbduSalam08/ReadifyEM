/* eslint-disable @microsoft/spfx/import-requires-chunk-name */
/* eslint-disable @microsoft/spfx/import-requires-chunk-name */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/self-closing-comp */
import { HashRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMainSPContext,
  setSiteUrl,
  setTenantUrl,
  setWebUrl,
} from "../redux/features/MainSPContextSlice";
import Header from "../webparts/readifyEmMain/components/Header/Header";
// lazy loaded components
const TableOfContents = lazy(
  () => import("../pages/TableOfContents/TableOfContents")
);
import SDDTemplates from "../pages/SDDTemplates/SDDTemplates";
import MyTasks from "../pages/MyTasks/MyTasks";
import ConfigureSections from "../pages/ConfigureSections/ConfigureSections";
import Definitions from "../pages/Definitions/Definitions";
import ContentDevelopment from "../pages/ContentDevelopment/ContentDevelopment";

const RoleAuthorizationHOC = lazy(() => import("../HOC/RoleAuthHOC"));

// loader component
import AppLoader from "../webparts/readifyEmMain/components/common/AppLoader/AppLoader";
// error element
import ErrorElement from "../webparts/readifyEmMain/components/common/ErrorElement/ErrorElement";
// global style sheet
import styles from "./App.module.scss";
import { getPageTitle } from "../services/ContentDevelopment/CommonServices/CommonServices";
import ActivateLicense from "../pages/LicenseManagement/ActivateLicense/ActivateLicense";
import { checkLicenseKey } from "../services/LicenseManagement/ActiveLicenseServices";
import UserConfigure from "../pages/LicenseManagement/UserConfigure/UserConfigure";

// let nodemailer = require("nodemailer");

const App = (props: any): JSX.Element => {
  console.log("props", props);
  const dispatch = useDispatch();
  const licenseDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.licenseDetails
  );
  const [isActivated, setIsActivated] = useState<boolean>(false);
  console.log("licenseDetails", licenseDetails);

  // dispatching the main context into redux store

  useEffect(() => {
    checkLicenseKey(dispatch);
    dispatch(setWebUrl(props?.context?._pageContext?._site?.absoluteUrl));
    dispatch(
      setTenantUrl(
        props?.context?._pageContext?._site?.absoluteUrl.split("/sites")[0]
      )
    );
    dispatch(
      setSiteUrl(props?.context?._pageContext?._site?.serverRelativeUrl)
    );
    getPageTitle(dispatch);
    dispatch(setMainSPContext(props.context));
    setIsActivated(false);
  }, []);
  useEffect(() => {
    if (licenseDetails?.Valid) {
      setIsActivated(true);
    } else {
      setIsActivated(false);
    }
  }, [licenseDetails]);

  return (
    <div className={styles.appContainer}>
      {isActivated ? (
        <HashRouter>
          <Header />
          {/* suspence loader componen */}
          <Suspense fallback={<AppLoader />}>
            <Routes>
              {/* Invalid route page */}
              <Route path="*" Component={ErrorElement} />
              {/* ADMIN ROUTES */}
              <Route path="/admin" Component={RoleAuthorizationHOC}>
                <Route index Component={TableOfContents} />
                <Route path="home" Component={TableOfContents} />
                <Route path="my_tasks" Component={MyTasks} />
                <Route
                  path="my_tasks/:docName/configure"
                  Component={ConfigureSections}
                />
                <Route path="definitions" Component={Definitions} />
                {/* <Route path="definitions" element={<h1>Definitions</h1>} /> */}
                <Route
                  path="my_tasks/:docName/content_developer"
                  Component={ContentDevelopment}
                />
                <Route path="templates" Component={SDDTemplates} />
                <Route path="User Configure" Component={UserConfigure} />
              </Route>

              {/* USER ROUTES */}
              <Route path="/user" Component={RoleAuthorizationHOC}>
                <Route index Component={TableOfContents} />
                <Route path="home" index Component={TableOfContents} />
                <Route path="my_tasks" Component={MyTasks} />
                <Route
                  path="my_tasks/:docName/configure"
                  Component={ConfigureSections}
                />
                <Route
                  path="my_tasks/:docName/content_developer"
                  Component={ContentDevelopment}
                />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      ) : (
        <ActivateLicense />
      )}
    </div>
  );
};

export default App;
