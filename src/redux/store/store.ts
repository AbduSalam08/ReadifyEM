import { configureStore } from "@reduxjs/toolkit";
import MainSPContext from "../features/MainSPContextSlice";
import EMMTableOfContents from "../features/EMMTableOfContentSlice";
import SDDTemplatesSlice from "../features/SDDTemplatesSlice";
import MyTasksSlice from "../features/MyTasksSlice";
import DefinitionSlice from "../features/DefinitionSlice";
import ContentDevloperSlice from "../features/ContentDevloperSlice";
import SectionConfigurationSlice from "../features/SectionConfigurationSlice";
import SectionCommentsSlice from "../features/SectionCommentsSlice";
import PDFServicceSlice from "../features/PDFServicceSlice";

const store = configureStore({
  reducer: {
    MainSPContext: MainSPContext,
    EMMTableOfContents: EMMTableOfContents,
    SDDTemplatesData: SDDTemplatesSlice,
    myTasksData: MyTasksSlice,
    DefinitionsData: DefinitionSlice,
    ContentDeveloperData: ContentDevloperSlice,
    SectionConfiguration: SectionConfigurationSlice,
    SectionData: SectionCommentsSlice,
    PDFServiceData: PDFServicceSlice,
  },
});

export { store };
