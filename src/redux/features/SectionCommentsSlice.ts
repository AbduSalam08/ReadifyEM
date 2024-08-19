/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  SectionComments: [],
  promatedComments: [],
  allSectionsChangeRecord: [],
  sectionChangeRecord: {},
};

const SectionCommentsData = createSlice({
  name: "SectionCommentsData",
  initialState: mainData,
  reducers: {
    setSectionComments: (state, action) => {
      state.SectionComments = action.payload;
    },
    setPromatedComments: (state, action) => {
      state.promatedComments = action.payload;
    },
    setAllSectionsChangeRecord: (state, action) => {
      state.allSectionsChangeRecord = action.payload;
    },
    setSectionChangeRecord: (state, action) => {
      state.sectionChangeRecord = action.payload;
    },
  },
});

export const {
  setSectionComments,
  setPromatedComments,
  setAllSectionsChangeRecord,
  setSectionChangeRecord,
} = SectionCommentsData.actions;
export default SectionCommentsData.reducer;
