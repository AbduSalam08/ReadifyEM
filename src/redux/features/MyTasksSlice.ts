/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData = {
  value: [],
  uniqueTaskData: [],
};

const TasksDataSlice = createSlice({
  name: "myTasksData",
  initialState: mainData,
  reducers: {
    setTasksData: (state, action) => {
      state.value = action.payload;
    },
    setUniqueTasksData: (state, action) => {
      state.uniqueTaskData = action.payload;
    },
  },
});

export const { setTasksData, setUniqueTasksData } = TasksDataSlice.actions;
export default TasksDataSlice.reducer;
