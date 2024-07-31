const CONFIG = {
  webURL: "https://chandrudemo.sharepoint.com/sites/ReadifyEM",
  tenantURL: "https://chandrudemo.sharepoint.com",
};

const LISTNAMES = {
  DocumentDetails: "DocumentDetails",
  SDDTemplates: "SDDTemplates",
  SDDTemplatesMain: "SDDTemplatesMain",
  SectionDetails: "SectionDetails",
  SectionComments: "SectionComments",
  MyTasks: "MyTasks",
  Definition: "Definition",
  sectionDefinition: "SectionDefinition",
  sectionSupportingDoc: "SupportingDocuments",
  AppendixHeader: "AppendixHeader",
  AllDocuments: "AllDocuments",
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
