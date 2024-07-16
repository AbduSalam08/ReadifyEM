/* eslint-disable @microsoft/spfx/import-requires-chunk-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/self-closing-comp */
import { HashRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMainSPContext } from "../redux/features/MainSPContextSlice";
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

const App = (props: any): JSX.Element => {
  const dispatch = useDispatch();
  // dispatching the main context into redux store
  useEffect(() => {
    dispatch(setMainSPContext(props.context));
  }, []);

  return (
    <div className={styles.appContainer}>
      {/* hash router */}
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
              <Route path="em_manual" Component={TableOfContents} />
              <Route path="my_tasks" Component={MyTasks} />
              <Route
                path="my_tasks/:docName/configure"
                Component={ConfigureSections}
              />
              <Route path="definitions" Component={Definitions} />
              <Route
                path="my_tasks/:docName/content_developer"
                Component={ContentDevelopment}
              />
              <Route path="sdd_templates" Component={SDDTemplates} />
            </Route>

            {/* USER ROUTES */}
            <Route path="/user" Component={RoleAuthorizationHOC}>
              <Route index Component={TableOfContents} />
              <Route path="em_manual" index Component={TableOfContents} />
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
    </div>
  );
};

export default App;
