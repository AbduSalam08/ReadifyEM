/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData = {
  webUrl: "",
  tenantUrl: "",
  siteUrl: "",
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
    setWebUrl: (state, action) => {
      state.webUrl = action.payload;
    },
    setTenantUrl: (state, action) => {
      state.tenantUrl = action.payload;
    },
    setSiteUrl: (state, action) => {
      state.siteUrl = action.payload;
    },
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

export const {
  setMainSPContext,
  setCurrentUserDetails,
  setPageDetails,
  setWebUrl,
  setTenantUrl,
  setSiteUrl,
} = MainSPContext.actions;
export default MainSPContext.reducer;
