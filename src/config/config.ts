const CONFIG = {
  webURL: "https://chandrudemo.sharepoint.com/sites/ReadifyEM",
};

const LISTNAMES = {
  DocumentDetails: "DocumentDetails",
  SDDTemplates: "SDDTemplates",
  SDDTemplatesMain: "SDDTemplatesMain",
  SectionDetails: "SectionDetails",
  MyTasks: "MyTasks",
};
const LIBNAMES = {
  AllDocuments: "AllDocuments",
};

const GROUPS = {
  AdminGroup: "ReadifyEM_Admin",
};

const initialPopupLoaders = {
  visibility: false,
  isLoading: {
    inprogres: false,
    success: false,
    error: false,
  },
  text: "",
  secondaryText: "",
};
export { CONFIG, LISTNAMES, initialPopupLoaders, LIBNAMES, GROUPS };
