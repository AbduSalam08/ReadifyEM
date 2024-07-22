/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";

import AllSections from "../../webparts/readifyEmMain/components/ContentDevelopment/AllSections/AllSections";
import Header from "../../webparts/readifyEmMain/components/ContentDevelopment/ContentDevHeader/ContentDevHeader";
import SectionHeader from "../../webparts/readifyEmMain/components/ContentDevelopment/SectionHeader/SectionHeader";
import SectionBanner from "../../webparts/readifyEmMain/components/ContentDevelopment/SectionBanner/sectionBanner";
import SectionComments from "../../webparts/readifyEmMain/components/ContentDevelopment/SectionComment/SectionComments";
import SectionContent from "../../webparts/readifyEmMain/components/ContentDevelopment/SectionContent/SectionContent";
import CustomInput from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import SetupHeader from "../../webparts/readifyEmMain/components/ContentDevelopment/SetupHeader/SetupHeader";
import CustomPeoplePicker from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomPeoplePicker";
import SupportingDocuments from "../../webparts/readifyEmMain/components/ContentDevelopment/SupportingDocuments/SupportingDocuments";
import Definition from "../../webparts/readifyEmMain/components/ContentDevelopment/Definition/Definition";
// import CustomMutiplePeoplePicker from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomMutiplePeoplePicker";
import SpServices from "../../services/SPServices/SpServices";
// import ViewDetails from "../../webparts/readifyEmMain/components/ContentDevelopment/ViewDetails/ViewDetails";
import DocumentTracker from "../../webparts/readifyEmMain/components/ContentDevelopment/DocumentTracker/DocumentTracker";
import { togglePopupVisibility } from "../../utils/togglePopup";
// images
const commentIcon = require("../../assets/images/svg/violetCommentIcon.svg");
// styles
import styles from "./ContentDevelopment.module.scss";
import RichText from "../../webparts/readifyEmMain/components/ContentDevelopment/RichText/RichText";
// import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import AppendixContent from "../../webparts/readifyEmMain/components/ContentDevelopment/AppendixContent/AppendixContent";
import ContentTypeConfirmation from "../../webparts/readifyEmMain/components/ContentDevelopment/ContentTypeConfirmation/ContentTypeConfirmation";

const AllSectionsData = [
  {
    sectionName: "Header",
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
    sectionName: "Introduction",
    sectionStatus: "Content in progress",
    commentsCount: 5,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
      { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: true,
    contentType: "initial",
  },
  {
    sectionName: "Purpose",
    sectionStatus: "Review in progress",
    commentsCount: 1,
    updateDate: "03/08/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: false,
    contentType: "initial",
  },
  {
    sectionName: "Objectives",
    sectionStatus: "Content in progress",
    commentsCount: 3,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
      { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: true,
    contentType: "initial",
  },
  {
    sectionName: "Appendix",
    sectionStatus: "Rework in progress",
    commentsCount: 2,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: true,
  },
  {
    sectionName: "Supporting Documents",
    sectionStatus: "Rework in progress",
    commentsCount: 2,
    updateDate: "03/07/24",
    sectionPersons: [
      { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
      { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    ],
    sectionPermission: true,
  },
  {
    sectionName: "Definition",
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
  sectionName: "Introduction",
  sectionStatus: "Content in progress",
  sectionAuthor: [
    {
      ID: 6,
      name: "Madhesh Maasi",
      email: "Madhesh@chandrudemo.onmicrosoft.com",
    },
  ],
  consultants: [
    { name: "Madhesh Maasi", email: "Madhesh@chandrudemo.onmicrosoft.com" },
    { name: "Kawin V", email: "Kawin@chandrudemo.onmicrosoft.com" },
    { name: "kali muthu", email: "kalimuthu@chandrudemo.onmicrosoft.com" },
  ],
  primaryAuthor: [
    {
      name: "Madhesh Maasi",
      email: "Madhesh@chandrudemo.onmicrosoft.com",
    },
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
  comments: [
    {
      comment: "This is a comment This is a comment",
      commentAuthor: {
        name: "Kawin V",
        email: "Kawin@chandrudemo.onmicrosoft.com",
      },
      commentDateAndTime: "03/03/24",
      role: "Section Author",
    },
    {
      comment: "This is a comment This is a comment",
      commentAuthor: {
        name: "Madhesh Maasi",
        email: "Madhesh@chandrudemo.onmicrosoft.com",
      },
      commentDateAndTime: "03/03/24",
      role: "Section Author",
    },
  ],
  headerTitle: "WelCome aboard",
  version: "1.0",
  type: "insurance",
  createdDate: "03/03/24",
  lastReviewDate: "03/03/24",
  nextReviewDate: "03/03/24",
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
  const [allSections, setAllSections] = useState<any>(AllSectionsData);
  const [sectionDetails, setSectionDetails] = useState<any>(Details);
  const [documentDetails, setDocumentDetails] = useState<any>(docDetails);
  const [toggleCommentSection, setToggleCommentSection] = useState(false);
  const [contentType, setContentType] = useState("initial");
  console.log("toggleCommentSection: ", toggleCommentSection);

  // Active Section Index
  const [activeSection, setActiveSection] = useState<number>(0);

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  const popupInputs: any[] = [
    [
      <SectionComments
        commentsData={sectionDetails.comments}
        isHeader={false}
        key={1}
        noCommentInput={true}
        viewOnly={true}
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
        minWidth={"250px"}
        maxWidth={"250px"}
        noBorderInput={true}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={documentDetails?.primaryAuthor?.email}
        readOnly={true}
        // noBorderInput={true}
        key={5}
        noRemoveBtn={true}
      />,
      <CustomPeoplePicker
        size="MD"
        withLabel
        minWidth={"250px"}
        maxWidth={"250px"}
        minHeight={"42px"}
        maxHeight={"42px"}
        labelText="Reviewers"
        personSelectionLimit={documentDetails?.reviewers?.length}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={documentDetails?.reviewers}
        readOnly={true}
        noRemoveBtn={true}
        // noBorderInput={true}
        key={5}
      />,
      <CustomPeoplePicker
        size="MD"
        withLabel
        minWidth={"250px"}
        maxWidth={"250px"}
        minHeight={"42px"}
        maxHeight={"42px"}
        labelText="Approvers"
        personSelectionLimit={documentDetails?.approvers?.length}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={documentDetails?.approvers}
        readOnly={true}
        noRemoveBtn={true}
        // noBorderInput={true}
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

  useEffect(() => {
    setAllSections(AllSectionsData);
    setSectionDetails(Details);
    setDocumentDetails(docDetails);
    SpServices.getAllUsers()
      .then((res: any) => {
        res.forEach((obj: any) => {
          console.log("obj.Id, obj.LoginName");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          <div className={styles.sectionWrapper}>
            <AllSections
              activeSection={activeSection}
              data={allSections}
              onChange={(value: any, condition: boolean, popupTitle: string) =>
                popuphandleOnChanges(value, condition, popupTitle)
              }
              key={1}
              // primaryAuthor={true}
            />
          </div>
          <div className={styles.contentWrapper}>
            {sectionDetails?.sectionName !== "" &&
            allSections[activeSection].sectionName === "Header" ? (
              <SectionHeader
                documentName={sectionDetails.sectionName}
                sectionAuthor={sectionDetails.sectionAuthor[0]}
                consultants={sectionDetails.consultants}
                PrimaryAuthor={sectionDetails.primaryAuthor[0]}
                isPrimaryAuthor={true}
              />
            ) : (
              <SectionHeader
                documentName={sectionDetails.sectionName}
                sectionAuthor={sectionDetails.sectionAuthor[0]}
                consultants={sectionDetails.consultants}
                PrimaryAuthor={sectionDetails.primaryAuthor[0]}
                isPrimaryAuthor={false}
              />
            )}
            <SectionBanner
              version={sectionDetails.version}
              type={sectionDetails.type}
              createDate={sectionDetails.createdDate}
              lastReviewDate={sectionDetails.lastReviewDate}
              nextReviewDate={sectionDetails.nextReviewDate}
            />
            {allSections[activeSection].sectionName === "Header" ? (
              <div style={{ width: "100%" }}>
                <SetupHeader
                  version={sectionDetails.version}
                  type={sectionDetails.type}
                  headerTitle={sectionDetails.headerTitle}
                  primaryAuthorDefaultHeader={true}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: toggleCommentSection ? "100%" : "75%",
                    height: "calc(100vh - 286px)",
                  }}
                >
                  {allSections[activeSection].sectionName === "Definition" ? (
                    <Definition ID={55} />
                  ) : allSections[activeSection].sectionName === "Appendix" ? (
                    <AppendixContent
                      sectionDetails={sectionDetails}
                      contentType={contentType}
                      setContentType={setContentType}
                    />
                  ) : allSections[activeSection].sectionName ===
                    "Supporting Documents" ? (
                    <SupportingDocuments ID={55} />
                  ) : contentType === "initial" ? (
                    <ContentTypeConfirmation setContentType={setContentType} />
                  ) : contentType === "list" ? (
                    <SectionContent sectionNumber={1} ID={55} />
                  ) : (
                    <RichText />
                  )}
                </div>
                <div
                  style={{
                    width: toggleCommentSection ? "1px" : "25%",
                    transition: "all .2s",
                    position: "relative",
                    height: "calc(100vh - 286px)",
                    border: toggleCommentSection
                      ? "1px solid #eee"
                      : "1px solid transparent",
                    // overflow: "hidden",
                  }}
                >
                  {toggleCommentSection ? (
                    <button
                      className={styles.commentsToggleBtn}
                      onClick={() => {
                        setToggleCommentSection(false);
                      }}
                    >
                      <img src={commentIcon} alt={"comments"} />
                    </button>
                  ) : (
                    ""
                  )}
                  <SectionComments
                    commentsData={sectionDetails.comments}
                    isHeader={true}
                    setToggleCommentSection={setToggleCommentSection}
                    toggleCommentSection={toggleCommentSection}
                  />
                </div>
              </div>
            )}
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

export default memo(ContentDevelopment);
