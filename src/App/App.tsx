/* eslint-disable @microsoft/spfx/import-requires-chunk-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/self-closing-comp */
import { HashRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMainSPContext } from "../redux/features/MainSPContext";
import Header from "../webparts/readifyEmMain/components/Header/Header";

// lazy loaded components
const TableOfContents = lazy(
  () => import("../pages/TableOfContents/TableOfContents")
);
const RoleAuthorizationHOC = lazy(() => import("../HOC/RoleAuthorizationHOC"));

// loader component
import AppLoader from "../webparts/readifyEmMain/components/common/AppLoader/AppLoader";
// error element
import ErrorElement from "../webparts/readifyEmMain/components/common/ErrorElement/ErrorElement";

// global style sheet
import styles from "./App.module.scss";
import SDDTemplates from "../pages/SDDTemplates/SDDTemplates";

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
            {/* ADMIN ROUTES */}
            <Route path="*" Component={ErrorElement} />
            <Route path="/admin" Component={RoleAuthorizationHOC}>
              <Route index Component={TableOfContents} />
              <Route path="em_manual" Component={TableOfContents} />
              <Route path="my_tasks" element={<h1>My Tasks</h1>} />
              <Route path="definitions" element={<h1>definitions</h1>} />
              <Route path="sdd_templates" Component={SDDTemplates} />
            </Route>

            {/* USER ROUTES */}
            <Route path="/user" Component={RoleAuthorizationHOC}>
              <Route index Component={TableOfContents} />
              <Route path="em_manual" index Component={TableOfContents} />
              <Route path="my_tasks" element={<h1>My Tasks </h1>} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </div>
  );
};

export default App;
