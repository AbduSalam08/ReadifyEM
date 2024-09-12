/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData = {
  PageDetails: {},
  value: [],
  currentUserDetails: {
    userName: "",
    role: "",
    email: "",
    id: "",
  },
};

const MainSPContext = createSlice({
  name: "MainSPContext",
  initialState: mainData,
  reducers: {
    setPageDetails: (state, action) => {
      state.PageDetails = action.payload;
    },
    setMainSPContext: (state, action) => {
      state.value = action.payload;
    },
    setCurrentUserDetails: (state, payload) => {
      state.currentUserDetails = payload.payload;
    },
  },
});

export const { setMainSPContext, setCurrentUserDetails, setPageDetails } =
  MainSPContext.actions;
export default MainSPContext.reducer;
