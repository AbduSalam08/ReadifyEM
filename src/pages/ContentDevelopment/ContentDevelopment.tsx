/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";

import AllSections from "../../webparts/readifyEmMain/components/ContentDevelopment/AllSections/AllSections";
import Header from "../../webparts/readifyEmMain/components/ContentDevelopment/ContentDevHeader/ContentDevHeader";
import SectionHeader from "../../webparts/readifyEmMain/components/ContentDevelopment/SectionHeader/SectionHeader";
import SectionBanner from "../../webparts/readifyEmMain/components/ContentDevelopment/SectionBanner/sectionBanner";
import SectionComments from "../../webparts/readifyEmMain/components/ContentDevelopment/SectionComment/SectionComments";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import CustomPeoplePicker from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomPeoplePicker";
import CustomMutiplePeoplePicker from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomMutiplePeoplePicker";
import SpServices from "../../services/SPServices/SpServices";
// import ViewDetails from "../../webparts/readifyEmMain/components/ContentDevelopment/ViewDetails/ViewDetails";
import DocumentTracker from "../../webparts/readifyEmMain/components/ContentDevelopment/DocumentTracker/DocumentTracker";
import { togglePopupVisibility } from "../../utils/togglePopup";

const AllSectionsData = [
  {
    sectionName: "Section Title1",
    sectionStatus: "Content in progress",
    commentsCount: 5,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
      { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: true,
  },
  {
    sectionName: "Section Title2",
    sectionStatus: "Content in progress",
    commentsCount: 3,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
      { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: false,
  },
  {
    sectionName: "Section Title3",
    sectionStatus: "Rework in progress",
    commentsCount: 2,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
      { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: true,
  },
  {
    sectionName: "Section Title3",
    sectionStatus: "Rework in progress",
    commentsCount: 2,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: true,
  },
];

const Details = {
  sectionName: "Section Title1",
  sectionStatus: "Content in progress",
  sectionAuthor: {
    ID: 6,
    name: "Madhesh Maasi",
    email: "Madhesh@chandrudemo.onmicrosoft.com",
  },
  consultants: [
    { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
    { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
  ],
  primaryAuthor: [
    { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
  ],
  sectionAuthors: [
    { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
    { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
  ],
  reviewers: [
    { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
    { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
  ],
  Approvers: [
    { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
    { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
  ],
  version: "1.0",
  type: "insurance",
  createdDate: "03/03/24",
  lastReviewDate: "03/03/24",
  nextReviewDate: "03/03/24",
  comments: [
    {
      comment:
        "This is a comment This is a comment This is a comment This is a comment This is a comment This is a comment",
      commentAuthor: {
        name: "Kawin V",
        email: "Kawin@chandrudemo.onmicrosoft.com",
      },
      commentDateAndTime: "03/03/24",
      role: "Section Author",
    },
    {
      comment:
        "This is a comment This is a comment This is a comment This is a comment This is a comment This is a comment",
      commentAuthor: {
        name: "Madhesh Maasi",
        email: "Madhesh@chandrudemo.onmicrosoft.com",
      },
      commentDateAndTime: "03/03/24",
      role: "Section Author",
    },
  ],
  isLoading: false,
};
const docDetails = {
  documentName: "Document Name1",
  documentStatus: "In Development",
  primaryAuthor: {
    ID: 6,
    name: "Madhesh Maasi",
    email: "Madhesh@chandrudemo.onmicrosoft.com",
  },
  reviewers: [
    {
      id: 11,
      text: "Madhesh Maasi",
      email: "Madhesh@chandrudemo.onmicrosoft.com",
    },
    { id: 56, text: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    {
      id: 22,
      text: "kali muthu",
      email: "kalimuthu@chandrudemo.onmicrosoft.com",
    },
  ],
  approvers: [
    {
      id: 11,
      text: "Madhesh Maasi",
      email: "Madhesh@chandrudemo.onmicrosoft.com",
    },
    { id: 56, text: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    {
      id: 22,
      text: "kali muthu",
      email: "kalimuthu@chandrudemo.onmicrosoft.com",
    },
  ],
  createdDate: "03/03/24",
  dueOnDate: "03/03/24",
  nextReviewDate: "03/03/24",
  isLoading: false,
};

const ContentDevelopment = (): JSX.Element => {
  const initialPopupController = [
    {
      open: false,
      popupTitle: "",
      popupWidth: "513px",
      popupType: "custom",
      defaultCloseBtn: true,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "513px",
      popupType: "custom",
      defaultCloseBtn: true,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "513px",
      popupType: "custom",
      defaultCloseBtn: true,
      popupData: "",
    },
  ];

  // initial States

  // AllSections State
  const [allSections, setAllSections] = useState<any>([]);
  const [sectionDetails, setSectionDetails] = useState<any>(Details);
  const [documentDetails, setDocumentDetails] = useState<any>(docDetails);

  // Active Section Index
  const [activeSection, setActiveSection] = useState<number>(0);

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };
  // fn for onchange of definition name
  // const handleOnChangeFunction = (value: string | any, key: string): void => {
  //   if (key === "referenceAuthor") {
  //     console.log(value);
  //     setDocumentDetails((prev: any) => ({
  //       ...prev,
  //       referenceAuthor:
  //         value.length > 0
  //           ? [{ Id: value[0]?.id, Email: value[0]?.secondaryText }]
  //           : [],
  //     }));
  //   } else {
  //     setDocumentDetails((prev: any) => ({
  //       ...prev,
  //       [key]: value,
  //       IsDuplicate: false,
  //     }));
  //   }
  // };

  const popupInputs: any[] = [
    [
      <SectionComments
        commentsData={sectionDetails.comments}
        isHeader={false}
        key={1}
      />,
    ],
    [<DocumentTracker sectionData={sectionDetails} key={1} />],
    [
      <CustomInput
        size="MD"
        labelText="Document name"
        withLabel
        icon={false}
        value={documentDetails.documentName}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "definitionName");
        }}
        readOnly={true}
        noBorderInput={true}
        hideErrMsg={true}
        key={1}
      />,
      <CustomInput
        size="MD"
        labelText="Created on"
        withLabel
        icon={false}
        value={documentDetails.createdDate}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "definitionName");
        }}
        readOnly={true}
        noBorderInput={true}
        hideErrMsg={true}
        key={1}
      />,
      <CustomInput
        size="MD"
        labelText="Due on"
        withLabel
        icon={false}
        value={documentDetails.dueOnDate}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "definitionName");
        }}
        readOnly={true}
        noBorderInput={true}
        hideErrMsg={true}
        key={1}
      />,
      <CustomInput
        size="MD"
        labelText="Next review date"
        withLabel
        icon={false}
        value={documentDetails.nextReviewDate}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "definitionName");
        }}
        readOnly={true}
        noBorderInput={true}
        hideErrMsg={true}
        key={1}
      />,
      <CustomPeoplePicker
        size="MD"
        withLabel
        labelText="Primary author"
        personSelectionLimit={1}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={documentDetails?.primaryAuthor?.email}
        readOnly={true}
        // noBorderInput={true}
        key={5}
      />,
      <CustomMutiplePeoplePicker
        size="MD"
        withLabel
        labelText="Reviwers"
        personSelectionLimit={5}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={documentDetails?.reviewers}
        readOnly={true}
        key={5}
      />,
      <CustomMutiplePeoplePicker
        size="MD"
        withLabel
        labelText="Approvers"
        personSelectionLimit={5}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={documentDetails?.approvers}
        readOnly={true}
        key={5}
      />,
    ],
  ];

  const popupActions: any[] = [
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(0);
        },
      },
      // {
      //   text: "Submit",
      //   btnType: "primary",
      //   disabled: false,
      //   endIcon: false,
      //   startIcon: false,
      //   onClick: () => {
      //     // handleSubmit();
      //   },
      // },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(1);
        },
      },
      // {
      //   text: "Save changes",
      //   btnType: "primary",
      //   disabled: false,
      //   endIcon: false,
      //   startIcon: false,
      //   onClick: () => {
      //     handleUpdate();
      //   },
      // },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(2);
        },
      },
    ],
  ];

  useEffect(() => {
    setAllSections(AllSectionsData);
    setSectionDetails(Details);
    setDocumentDetails(docDetails);
    SpServices.getAllUsers()
      .then((res: any) => {
        res.forEach((obj: any) => {
          console.log(obj.Id, obj.LoginName);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const popuphandleOnChanges = (
    value: number,
    condition: boolean,
    popupTitle: string
  ) => {
    console.log(value, condition);

    if (condition) {
      setActiveSection(value);
    } else {
      togglePopupVisibility(setPopupController, value, "open", popupTitle);
    }
  };
  // const viewCommentFunction = (value: number) => {
  //    togglePopupVisibility(
  //      setPopupController,
  //      value,
  //      "open",
  //      `Promoted Comments`
  //    );
  // };

  return (
    <>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <Header
            documentName="Document Name"
            role="Section Author"
            documentStatus="In Development"
            onChange={(value: any, condition: boolean, popupTitle: string) =>
              popuphandleOnChanges(value, condition, popupTitle)
            }
          />
        </div>
        <div style={{ width: "100%", display: "flex" }}>
          <div
            style={{
              width: "320px",
              border: "1px solid #e4caca",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <AllSections
              activeSection={activeSection}
              data={allSections}
              onChange={(value: any, condition: boolean, popupTitle: string) =>
                popuphandleOnChanges(value, condition, popupTitle)
              }
              key={1}
            />
          </div>
          <div
            style={{
              width: "75%",
              padding: "10px",
              borderRadius: "5px",
              background: "#fff",
              marginLeft: "20px",
            }}
          >
            {sectionDetails?.sectionName !== "" && (
              <SectionHeader
                documentName={sectionDetails.sectionName}
                sectionAuthor={sectionDetails.sectionAuthor}
                consultants={sectionDetails.consultants}
              />
            )}
            <SectionBanner
              version={sectionDetails.version}
              type={sectionDetails.type}
              createDate={sectionDetails.createdDate}
              lastReviewDate={sectionDetails.lastReviewDate}
              nextReviewDate={sectionDetails.nextReviewDate}
            />
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "65%" }}>Section Content</div>
              <div style={{ width: "35%" }}>
                <SectionComments
                  commentsData={sectionDetails.comments}
                  isHeader={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          isLoading={sectionDetails?.isLoading}
          PopupType={popupData.popupType}
          onHide={() =>
            togglePopupVisibility(setPopupController, index, "close")
          }
          popupTitle={
            popupData.popupType !== "confimation" && popupData.popupTitle
          }
          popupActions={popupActions[index]}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={popupData.defaultCloseBtn || false}
          confirmationTitle={
            popupData.popupType !== "custom" ? popupData.popupTitle : ""
          }
        />
      ))}
    </>
  );
};

export default ContentDevelopment;
