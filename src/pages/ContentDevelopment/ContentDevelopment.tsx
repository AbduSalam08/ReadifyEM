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
// import SpServices from "../../services/SPServices/SpServices";
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
import { useDispatch, useSelector } from "react-redux";
import CircularSpinner from "../../webparts/readifyEmMain/components/common/AppLoader/CircularSpinner";
// import ErrorElement from "../../webparts/readifyEmMain/components/common/ErrorElement/ErrorElement";

// import Services

import { getSectionComments } from "../../services/ContentDevelopment/SectionComments/SectionComments";

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
  headerTitle: "Welcome aboard",
  version: "1.0",
  type: "insurance",
  createdDate: "03/03/24",
  lastReviewDate: "03/03/24",
  nextReviewDate: "03/03/24",
  isLoading: false,
};

const ContentDevelopment = (): JSX.Element => {
  // dispatch
  const dispatch = useDispatch();

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

  const [initialLoader, setInitialLoader] = useState(true);

  // selectors
  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  // initial States
  // AllSections State
  const [sectionDetails, setSectionDetails] = useState<any>(Details);
  const [AllSectionsData, setAllSectionsData] =
    useState<any>(AllSectionsDataMain);
  const [toggleCommentSection, setToggleCommentSection] = useState(false);

  // Active Section Index
  const [activeSection, setActiveSection] = useState<number>(0);

  const enabledSection = AllSectionsDataMain?.filter(
    (el: any) => el?.sectionPermission
  );

  const activeItemsFirstIndex = AllSectionsDataMain?.indexOf(enabledSection[0]);

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  const showActionBtns: boolean =
    currentDocDetailsData?.taskRole?.toLowerCase() !== "consultant" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "reviewer" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "approver" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "admin";

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
        value={currentDocDetailsData?.documentName}
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
        value={currentDocDetailsData?.createdDate}
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
        value={currentDocDetailsData?.dueOnDate}
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
        value={currentDocDetailsData?.nextReviewDate}
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
        selectedItem={currentDocDetailsData?.primaryAuthor?.email}
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
        personSelectionLimit={currentDocDetailsData?.reviewers?.length}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={currentDocDetailsData?.reviewers}
        readOnly={true}
        noRemoveBtn={true}
        multiUsers={true}
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
        personSelectionLimit={currentDocDetailsData?.approvers?.length}
        onChange={(value: any) => {
          // handleOnChangeFunction(value, "referenceAuthor");
        }}
        selectedItem={currentDocDetailsData?.approvers}
        readOnly={true}
        noRemoveBtn={true}
        multiUsers={true}
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
    if (condition) {
      setActiveSection(value);
      const Comments = getSectionComments(AllSectionsData[value].ID, dispatch);
      console.log(Comments);
    } else {
      togglePopupVisibility(setPopupController, value, "open", popupTitle);
    }
  };

  useEffect(() => {
    setSectionDetails(Details);
    setAllSectionsData(AllSectionsDataMain);
    // setActiveSection();
    setInitialLoader(currentDocDetailsData?.isLoading);
  }, [currentDocDetailsData?.isLoading]);

  useEffect(() => {
    setActiveSection(activeItemsFirstIndex);
  }, [activeItemsFirstIndex]);

  useEffect(() => {
    if (AllSectionsDataMain?.length !== 0) {
      setAllSectionsData(AllSectionsDataMain);
      const Comments = getSectionComments(
        AllSectionsDataMain[activeItemsFirstIndex].ID,
        dispatch
      );
      console.log(Comments);
    }
  }, [AllSectionsDataMain?.length]);

  useEffect(() => {
    setAllSectionsData(AllSectionsDataMain);
  }, [AllSectionsDataMain]);

  return (
    <>
      {
        !initialLoader &&
        AllSectionsData?.length !== 0 &&
        currentDocDetailsData !== null ? (
          <div style={{ width: "100%" }}>
            <div style={{ width: "100%" }}>
              <Header
                documentName={currentDocDetailsData?.documentName}
                currentDocDetailsData={currentDocDetailsData}
                role={currentDocDetailsData?.taskRole}
                documentStatus={currentDocDetailsData?.documentStatus}
                onChange={(
                  value: any,
                  condition: boolean,
                  popupTitle: string
                ) => popuphandleOnChanges(value, condition, popupTitle)}
              />
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div className={styles.sectionWrapper}>
                <AllSections
                  activeSection={activeSection}
                  data={AllSectionsData}
                  onChange={(
                    value: any,
                    condition: boolean,
                    popupTitle: string
                  ) => popuphandleOnChanges(value, condition, popupTitle)}
                  key={1}
                  // primaryAuthor={true}
                />
              </div>
              <div className={styles.contentWrapper}>
                {AllSectionsData[activeSection]?.sectionName !== "" &&
                AllSectionsData[activeSection]?.sectionName?.toLowerCase() ===
                  "header" ? (
                  <SectionHeader
                    activeSectionData={AllSectionsData[activeSection]}
                    documentName={AllSectionsData[activeSection]?.sectionName}
                    sectionAuthor={
                      AllSectionsData[activeSection]?.sectionAuthor[0]
                    }
                    consultants={AllSectionsData[activeSection]?.consultants}
                    PrimaryAuthor={
                      AllSectionsData[activeSection]?.sectionAuthor[0]
                    }
                    isPrimaryAuthor={true}
                  />
                ) : (
                  <SectionHeader
                    activeSectionData={AllSectionsData[activeSection]}
                    documentName={AllSectionsData[activeSection]?.sectionName}
                    sectionAuthor={
                      AllSectionsData[activeSection]?.sectionAuthor[0]
                    }
                    consultants={AllSectionsData[activeSection]?.consultants}
                    PrimaryAuthor={
                      AllSectionsData[activeSection]?.sectionAuthor[0]
                    }
                    isPrimaryAuthor={false}
                  />
                )}
                <SectionBanner
                  sectionDetails={AllSectionsData[activeSection]}
                  currentDocDetails={currentDocDetailsData}
                  appendixHeader={false}
                />
                {AllSectionsData[activeSection]?.sectionType?.toLowerCase() ===
                "header section" ? (
                  <div style={{ width: "100%" }}>
                    <SetupHeader
                      version={currentDocDetailsData?.version}
                      type={currentDocDetailsData?.documentType}
                      headerTitle={currentDocDetailsData?.documentName}
                      sectionDetails={AllSectionsData[activeSection]}
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
                      {AllSectionsData[
                        activeSection
                      ]?.sectionName?.toLowerCase() === "definitions" ? (
                        <Definition documentId={572} sectionId={85} />
                      ) : AllSectionsData[
                          activeSection
                        ]?.sectionType?.toLowerCase() === "appendix section" ? (
                        <AppendixContent
                          sectionDetails={AllSectionsData[activeSection]}
                          isLoading={
                            AllSectionsData[activeSection]?.length === 0
                          }
                          contentType={
                            AllSectionsData[activeSection]?.contentType
                          }
                          currentDocDetailsData={currentDocDetailsData}
                          activeIndex={activeSection}
                          setSectionData={setAllSectionsData}
                        />
                      ) : AllSectionsData[
                          activeSection
                        ]?.sectionName?.toLowerCase() ===
                        "supporting materials" ? (
                        <SupportingDocuments documentId={572} sectionId={85} />
                      ) : AllSectionsData[activeSection]?.contentType ===
                        "initial" ? (
                        <ContentTypeConfirmation
                          activeIndex={activeSection}
                          setSectionData={setAllSectionsData}
                        />
                      ) : AllSectionsData[activeSection]?.contentType ===
                        "list" ? (
                        <SectionContent
                          activeIndex={activeSection}
                          setSectionData={setAllSectionsData}
                          currentSectionDetails={AllSectionsData[activeSection]}
                          sectionNumber={
                            AllSectionsData[activeSection]?.sectionOrder
                          }
                          ID={AllSectionsData[activeSection]?.ID}
                          noActionBtns={!showActionBtns}
                        />
                      ) : (
                        <RichText
                          activeIndex={activeSection}
                          setSectionData={setAllSectionsData}
                          noActionBtns={!showActionBtns}
                          ID={AllSectionsData[activeSection]?.ID}
                          currentSectionData={AllSectionsData[activeSection]}
                        />
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
                        sectionId={AllSectionsData[activeSection]?.ID}
                        documentId={
                          AllSectionsData[activeSection]?.documentOfId
                        }
                        onClick={() => {
                          // setToggleCommentSection(true);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <CircularSpinner />
        )
        // initialLoader &&
        // AllSectionsData?.length === 0 &&
        // currentDocDetailsData === null ?
        //  :   (
        //   AllSectionsData?.length === 0 &&
        //   currentDocDetailsData === null && <ErrorElement />
        // )
      }
      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          isLoading={AllSectionsData[activeSection]?.isLoading}
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
