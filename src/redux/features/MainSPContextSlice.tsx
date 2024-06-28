/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData = {
  value: [],
};

const MainSPContext = createSlice({
  name: "MainSPContext",
  initialState: mainData,
  reducers: {
    setMainSPContext: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setMainSPContext } = MainSPContext.actions;
export default MainSPContext.reducer;
