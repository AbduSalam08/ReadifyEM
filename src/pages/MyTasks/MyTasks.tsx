/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
// react imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// custom components
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import PageTitle from "../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import SliderButton from "../../webparts/readifyEmMain/components/common/Buttons/SliderButton/SliderButton";
import CustomDropDown from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomDropDown";
import { DocStatus } from "../../constants/DocStatus";
// styles
import styles from "./MyTasks.module.scss";
import TaskCard from "../../webparts/readifyEmMain/components/TaskCard/TaskCard";

const MyTasks = (): JSX.Element => {
  // router navigate
  const navigate = useNavigate();
  // main tasks data state
  const [tasksData] = useState({
    loading: false,
    data: [] as any[],
  });

  // state to store the filter properties
  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
    filterByTaskStatusOptions: DocStatus,
    filterByTaskStatus: "",
    filterByTaskDueDate: "",
    taskModeOptions: ["Active", "Completed"],
    taskMode: 0,
  });

  return (
    <div className={styles.myTasksWrapper}>
      <div className={styles.filtersSection}>
        <div className={styles.f1Section}>
          <PageTitle text={"My Tasks"} />

          {/* filters section */}
          <CustomInput
            value={filterOptions.searchTerm}
            onChange={(value: string) => {
              setFilterOptions((prev) => ({
                ...prev,
                searchTerm: value,
              }));
            }}
            disabled={tasksData.data.length === 0 || tasksData.loading}
            icon
            placeholder="Search"
          />
        </div>

        <div className={styles.f2Section}>
          <SliderButton
            onChange={(value: any) => {
              setFilterOptions((prev: any) => ({
                ...prev,
                taskMode: prev.taskModeOptions.indexOf(value),
              }));
            }}
            options={["Active", "Completed"]}
            value={filterOptions.taskMode}
          />

          <CustomDropDown
            onChange={(value: string) => {
              setFilterOptions((prev) => ({
                ...prev,
                filterByStatus: value,
              }));
            }}
            options={filterOptions.filterByTaskStatusOptions}
            value={filterOptions.filterByTaskStatus}
            placeholder="Filter by Status"
            size="MD"
            disabled={tasksData.data.length === 0 || tasksData.loading}
          />
        </div>
      </div>

      <div className={styles.cardsSection}>
        <TaskCard
          dueDate="10/02/2024"
          description="Emergency Management Program"
          onClick={() => {
            navigate("/admin/configure");
          }}
          roles="Primary Author"
          pillSize="SM"
          title="Risk Management"
        />
      </div>
    </div>
  );
};

export default MyTasks;
