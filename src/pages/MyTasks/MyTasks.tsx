/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
// react imports
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// custom components
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import SliderButton from "../../webparts/readifyEmMain/components/common/Buttons/SliderButton/SliderButton";
import CustomDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomDropDown";
// styles
import styles from "./MyTasks.module.scss";
import TaskCard from "../../webparts/readifyEmMain/components/TaskCard/TaskCard";
import {
  getAllTasksList,
  getUniqueTaskData,
} from "../../services/MyTasks/MyTasksServices";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserIsAdmin } from "../../constants/DefineUser";
import { CircularProgress } from "@mui/material";
import { DocRoles } from "../../constants/DocStatus";
import { Close } from "@mui/icons-material";
import CustomDateInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomDateInput";
import * as dayjs from "dayjs";
import {
  setCDDocDetails,
  setCDHeaderDetails,
  setCDSectionData,
} from "../../redux/features/ContentDevloperSlice";
import { setConfigurePageDetails } from "../../redux/features/SectionConfigurationSlice";
import { getSectionsDetails } from "../../services/ContentDevelopment/CommonServices/CommonServices";

const MyTasks = (): JSX.Element => {
  // router navigate
  const navigate = useNavigate();
  // dispatch
  const dispatch = useDispatch();
  // selector for current user
  const currentUserDetails: any = useSelector(
    (state: any) => state.MainSPContext.currentUserDetails
  );

  // check if the current user is admin
  const isAdmin: boolean = CurrentUserIsAdmin();

  const myTasksData: any = useSelector((state: any) => state.myTasksData.value);
  console.log("myTasksData: ", myTasksData);

  // main tasks data state
  const [tasksData, setTasksData] = useState({
    loading: false,
    data: [] as any[],
  });
  console.log("tasksData aaa: ", tasksData);

  // state to store the filter properties
  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
    filterByTaskStatusOptions: DocRoles,
    filterByTaskStatus: "",
    filterByTaskDueDate: "",
    taskModeOptions: ["Active", "Completed"],
    taskMode: 0,
  });

  const getMainData = async (): Promise<any> => {
    await getAllTasksList(currentUserDetails, setTasksData, dispatch);
  };

  // getting main data
  useEffect(() => {
    getMainData();
  }, []);

  // function to handle the completed and pending tasks
  const changeTaskMode = (taskMode: number): void => {
    if (taskMode === 0) {
      const filteredData: any[] = myTasksData?.filter(
        (task: any) => !task.completedAll
      );
      setTasksData({ loading: false, data: filteredData });
    } else {
      const filteredData: any[] = myTasksData?.filter(
        (task: any) => task.completedAll
      );
      setTasksData({ loading: false, data: filteredData });
    }
  };

  // function to handle the completed and pending tasks
  const filterByRole = (role: string): void => {
    const filteredData: any[] = myTasksData?.filter(
      (task: any) => task?.role?.toLowerCase() === role?.toLowerCase()
    );
    setTasksData({ loading: false, data: filteredData });
  };

  // function to handle the completed and pending tasks
  const taskSearchFilter = (searchQuery: string): void => {
    const filteredData: any[] = myTasksData?.filter((task: any) =>
      task?.docName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
    setTasksData({ loading: false, data: filteredData });
  };

  // Function to filter tasks by due date
  const filterByDueDate = (dueDate: string): void => {
    const filteredData: any[] = myTasksData?.filter((task: any) => {
      const taskDueDate = dayjs(task?.taskDueDate, "DD/MM/YYYY");
      const filterDate = dayjs(dueDate, "DD/MM/YYYY");
      return taskDueDate.isSame(filterDate, "date");
    });
    setTasksData({ loading: false, data: filteredData });
  };

  useEffect(() => {
    dispatch(setCDDocDetails(null));
    dispatch(setCDSectionData([]));
    dispatch(setCDHeaderDetails([]));
    dispatch(
      setConfigurePageDetails({
        pageKey: "add",
      })
    );
    const filteredData: any[] = myTasksData?.filter(
      (task: any) => !task.completedAll
    );
    setTasksData({ loading: false, data: filteredData });
  }, [myTasksData]);

  return (
    <div className={styles.myTasksWrapper}>
      <div className={styles.filtersSection}>
        <div className={styles.f1Section}>
          <PageTitle text={"My Tasks"} />

          {/* filters section */}
          <div>
            <CustomInput
              value={filterOptions.searchTerm}
              onChange={(value: string) => {
                setFilterOptions((prev) => ({
                  ...prev,
                  searchTerm: value,
                }));
                taskSearchFilter(value);
              }}
              // disabled={tasksData?.data?.length === 0 || tasksData?.loading}
              icon
              placeholder="Search"
            />
          </div>
        </div>

        <div className={styles.f2Section}>
          <SliderButton
            onChange={(value: any) => {
              setFilterOptions((prev: any) => ({
                ...prev,
                taskMode: prev.taskModeOptions.indexOf(value),
              }));
              changeTaskMode(filterOptions?.taskModeOptions.indexOf(value));
            }}
            options={["Active", "Completed"]}
            value={filterOptions.taskMode}
          />

          <div
            className={styles.flexcenter}
            style={{
              gap: "10px",
            }}
          >
            {filterOptions?.filterByTaskStatus ||
            filterOptions.filterByTaskDueDate ? (
              <button
                className={styles.clearFilterBtn}
                // style={{
                //   width: "290px",
                // }}
                onClick={() => {
                  setFilterOptions((prev: any) => ({
                    ...prev,
                    // searchTerm: "",
                    filterByTaskStatus: "",
                    filterByTaskDueDate: "",
                  }));
                  setTasksData((prev: any) => ({
                    ...prev,
                    data: myTasksData,
                  }));
                }}
              >
                Clear All Filters
                <Close
                  sx={{
                    fontSize: "15px",
                  }}
                />
              </button>
            ) : null}
            <CustomDateInput
              placeHolder="Filter by due date"
              onChange={(value: any) => {
                setFilterOptions((prev) => ({
                  ...prev,
                  filterByTaskDueDate: value,
                }));
                filterByDueDate(value);
              }}
              value={filterOptions.filterByTaskDueDate}
              error={false}
              errorMsg={""}
              size="240px"
              minWidth="240px"
              maxWidth="240px"
            />

            <CustomDropDown
              onChange={(value: string) => {
                setFilterOptions((prev) => ({
                  ...prev,
                  filterByTaskStatus: value,
                }));
                filterByRole(value);
              }}
              options={filterOptions.filterByTaskStatusOptions}
              value={filterOptions.filterByTaskStatus}
              placeholder="Filter by Role"
              size="MD"
              // disabled={tasksData?.data?.length === 0 || tasksData.loading}
            />
          </div>
        </div>
      </div>
      {tasksData?.data?.length === 0 && (
        <div className={`${styles.flexcenter} ${styles.loaderSection}`}>
          <span className={styles.emptyMsg}>No Tasks found</span>
        </div>
      )}
      <div className={styles.cardsSection}>
        {tasksData?.loading ? (
          <div className={`${styles.flexcenter} ${styles.loaderSection}`}>
            <CircularProgress
              sx={{
                width: "40px",
                height: "40px",
                animationDuration: "450ms",
                color: "#adadad",
              }}
              size={"30px"}
              disableShrink
              variant="indeterminate"
              color="inherit"
            />
          </div>
        ) : (
          tasksData.data?.length !== 0 &&
          tasksData.data?.map((item: any, index: number) => {
            console.log("item: ", item);
            const isPA = item?.role?.toLowerCase() === "primary author";

            const isConfigurationCard: boolean =
              isPA && item?.docStatus?.toLowerCase() === "not started";

            // const isSA = item?.role?.toLowerCase() === "section author";
            // const isConsultant = item?.role?.toLowerCase() === "consultant";
            // const isReviewer = item?.role?.toLowerCase() === "reviewer";
            // const isApprover = item?.role?.toLowerCase() === "approver";

            return (
              <TaskCard
                key={index}
                dueDate={item?.taskDueDate}
                btnText={
                  item?.role?.toLowerCase() === "primary author" &&
                  item?.docStatus?.toLowerCase() === "not started"
                    ? "Configure"
                    : "Open"
                }
                taskData={item}
                description={item?.pathName}
                onClick={async () => {
                  // handle the card configuration and card routes here
                  if (isConfigurationCard) {
                    await getUniqueTaskData(item?.taskID, dispatch);

                    if (item?.docVersion !== "1.0") {
                      dispatch(
                        setConfigurePageDetails({
                          pageKey: "version update",
                        })
                      );
                    } else {
                      dispatch(
                        setConfigurePageDetails({
                          pageKey: "add",
                        })
                      );
                    }

                    if (isAdmin) {
                      navigate(`/admin/my_tasks/${item?.docName}/configure`);
                    } else {
                      navigate(`/user/my_tasks/${item?.docName}/configure`);
                    }
                  } else {
                    // await getUniqueTaskData(item?.taskID, dispatch);

                    if (isAdmin) {
                      navigate(
                        `/admin/my_tasks/${item?.docName}/content_developer`
                      );
                      getSectionsDetails(item, currentUserDetails, dispatch);
                    } else {
                      navigate(
                        `/user/my_tasks/${item?.docName}/content_developer`
                      );
                      getSectionsDetails(item, currentUserDetails, dispatch);
                    }
                  }
                }}
                roles={item?.role}
                pillSize="SM"
                title={item?.docName}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default memo(MyTasks);
