/* eslint-disable @microsoft/spfx/import-requires-chunk-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/self-closing-comp */
import { HashRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMainSPContext } from "../redux/features/MainSPContext";
import Header from "../webparts/readifyEmMain/components/Header/Header";

// lazy loaded components
const TableOfContents = lazy(
  () => import("../pages/TableOfContents/TableOfContents")
);
const RoleAuthorizationHOC = lazy(() => import("../HOC/RoleAuthorizationHOC"));
// const NewDocument = lazy(() => import("../pages/NewDocument/NewDocument"));

// loader component
import AppLoader from "../webparts/readifyEmMain/components/common/AppLoader/AppLoader";
// error element
import ErrorElement from "../webparts/readifyEmMain/components/common/ErrorElement/ErrorElement";

// global style sheet
import styles from "./App.module.scss";

const App = (props: any): JSX.Element => {
  // const [userName, setUserName] = useState<string | number | any>(null);
  // const [selectedOption, setSelectedOption] = useState<string | number | any>(
  //   "Select a number"
  // );
  // const [nodes, setNode[s] = useState<any>([]);
  // console.log("nodes: ", nodes);
  // const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
  // console.log("setSelectedNodeKeys: ", setSelectedNodeKeys);
  // console.log("selectedNodeKeys: ", selectedNodeKeys);

  const mainContext: any = useSelector(
    (state: any) => state.MainSPContext.value
  );
  console.log("mainContext: ", mainContext);
  // ADMIN
  //  - home TOC
  //  - My Tasks
  //  - Definitions
  //  - SDD Templates

  // NON ADMIN / USER
  //  - home TOC
  //  - My Tasks

  // const options = [
  //   {
  //     label: "2",
  //     value: "2",
  //   },
  //   {
  //     label: "4",
  //     value: "4",
  //   },
  //   {
  //     label: "8",
  //     value: "8",
  //   },
  // ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMainSPContext(props.context));
  }, []);

  return (
    <div className={styles.appContainer}>
      <HashRouter>
        <Header />
        {/* <AppLoader /> */}
        {/* <ErrorElement /> */}
        <Suspense fallback={<AppLoader />}>
          <Routes>
            {/* ADMIN ROUTES */}
            <Route path="*" Component={ErrorElement} />
            <Route path="/admin" Component={RoleAuthorizationHOC}>
              {/* <Route index Component={TableOfContents} /> */}
              {/* <Route index Component={TableOfContents} /> */}
              <Route index element={<h1>Table of Contents</h1>} />
              <Route path="em_manual" element={<h1>Table of Contents</h1>} />
              <Route path="my_tasks" element={<h1>My Tasks</h1>} />
              <Route path="definitions" element={<h1>definitions</h1>} />
              <Route
                path="sdd_templates"
                element={<h1>Standardized Document Developer Templates </h1>}
              />
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

      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomInput
          value={userName}
          size="MD"
          frontIcon={<SearchIcon />}
          onChange={(value) => {
            setUserName(value);
          }}
          placeholder="Search"
          type="text"
        />

        <CustomDropDown
          options={options}
          value={selectedOption}
          onChange={(value) => {
            console.log("value: ", value);
            setSelectedOption(value);
          }}
          placeholder="Select a number"
          size="MD"
        />

        <CustomTreeDropDown
          onChange={(value: any) => {
            setSelectedNodeKeys(value);
          }}
          value={selectedNodeKeys}
          options={nodes}
          placeholder="Select folder path"
        />
      </div> */}

      {/* <Button>Hello</Button> */}
    </div>
  );
};

export default App;
