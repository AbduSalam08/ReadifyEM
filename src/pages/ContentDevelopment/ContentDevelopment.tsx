/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";

// import components
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
import DocumentTracker from "../../webparts/readifyEmMain/components/ContentDevelopment/DocumentTracker/DocumentTracker";
import RichText from "../../webparts/readifyEmMain/components/ContentDevelopment/RichText/RichText";
// import AppendixContent from "../../webparts/readifyEmMain/components/ContentDevelopment/AppendixContent/AppendixContent";
import ContentTypeConfirmation from "../../webparts/readifyEmMain/components/ContentDevelopment/ContentTypeConfirmation/ContentTypeConfirmation";
import {
  getPromotedComments,
  getSectionComments,
} from "../../services/ContentDevelopment/SectionComments/SectionComments";

// toggle popup funtion
import { togglePopupVisibility } from "../../utils/togglePopup";
// images
const commentIcon = require("../../assets/images/svg/violetCommentIcon.svg");
// styles
import styles from "./ContentDevelopment.module.scss";

// loader
import CircularSpinner from "../../webparts/readifyEmMain/components/common/AppLoader/CircularSpinner";

// import Services and buttons
import DefaultButton from "../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import CustomTextArea from "../../webparts/readifyEmMain/components/common/CustomInputFields/CustomTextArea";
import {
  addPromotedComment,
  changeDocStatus,
  changeSectionStatus,
  getAllSectionsChangeRecord,
  getSectionChangeRecord,
} from "../../services/ContentDevelopment/CommonServices/CommonServices";

import ChangeRecord from "../../webparts/readifyEmMain/components/ContentDevelopment/ChangeRecord/ChangeRecord";

import ToastMessage from "../../webparts/readifyEmMain/components/common/Toast/ToastMessage";
import { calculateDueDateByRole } from "../../utils/validations";
import {
  getCurrentLoggedPromoter,
  getCurrentPromoter,
  updateSectionDataLocal,
} from "../../utils/contentDevelopementUtils";
import SpServices from "../../services/SPServices/SpServices";
import { LISTNAMES } from "../../config/config";
import { setCDSectionData } from "../../redux/features/ContentDevloperSlice";
import References from "../../webparts/readifyEmMain/components/ContentDevelopment/References/References";
import dayjs from "dayjs";
import { removeVersionFromDocName } from "../../utils/formatDocName";

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
      popupWidth: "600px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "400px",
      popupType: "confirmation",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "400px",
      popupType: "confirmation",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "400px",
      popupType: "confirmation",
      defaultCloseBtn: false,
      popupData: "",
    },
  ];

  const [initialLoader, setInitialLoader] = useState(true);

  // selectors
  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  console.log("currentDocDetailsData: ", currentDocDetailsData);

  // initial States
  // AllSections State
  const [sectionDetails, setSectionDetails] = useState<any>(Details);
  const [AllSectionsData, setAllSectionsData] =
    useState<any>(AllSectionsDataMain);

  console.log("AllSectionsData: ", AllSectionsData);

  const [toggleCommentSection, setToggleCommentSection] = useState(false);
  const [checkChanges, setCheckChanges] = useState(false);
  console.log(checkChanges);

  // Active Section Index
  const [activeSection, setActiveSection] = useState<number>(0);
  const [tempActiveSection, setTempActiveSection] = useState<number>(0);

  // Promoted comments state
  const [promoteComments, setPromoteComments] = useState<any>({
    promoteComment: "",
    IsValid: false,
    ErrorMsg: "",
  });

  const [currentDocRole, setCurrentDocRole] = useState({
    primaryAuthor:
      currentDocDetailsData?.taskRole?.toLowerCase() === "primary author",
    reviewer: currentDocDetailsData?.taskRole?.toLowerCase() === "reviewer",
    approver: currentDocDetailsData?.taskRole?.toLowerCase() === "approver",
    sectionAuthor:
      currentDocDetailsData?.taskRole?.toLowerCase() === "section author",
    consultant: currentDocDetailsData?.taskRole?.toLowerCase() === "consultant",
  });

  const enabledSection = AllSectionsDataMain?.filter(
    (el: any) => el?.sectionPermission
  );

  const activeItemsFirstIndex = AllSectionsDataMain?.indexOf(enabledSection[0]);

  const [popupController, setPopupController] = useState(
    initialPopupController
  );
  // toast message state

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  const handleReviewerUpdate = async (
    currentDocDetailsData: any,
    totalReviewers: number,
    dispatch: any
  ) => {
    debugger;
    const currentPromoter = getCurrentPromoter(
      currentDocDetailsData?.reviewers
    );

    let updatedReviewers;

    // Update reviewers
    if (currentPromoter?.currentPromoter?.status === "in progress") {
      updatedReviewers = currentDocDetailsData?.reviewers?.map(
        (item: any, index: number) => {
          if (item?.id === currentPromoter?.currentOrder) {
            return { ...item, status: "completed" };
          } else if (item?.id === currentPromoter?.currentOrder + 1) {
            return { ...item, status: "in progress" };
          } else {
            return item;
          }
        }
      );

      if (updatedReviewers?.some((item: any) => item?.status === "completed")) {
        updatedReviewers?.map(async (el: any) => {
          if (el?.status === "completed") {
            await SpServices.SPReadItems({
              Listname: LISTNAMES.MyTasks,
              Select: "*, documentDetails/ID",
              Expand: "documentDetails",
              Filter: [
                {
                  FilterKey: "documentDetails",
                  Operator: "eq",
                  FilterValue: currentDocDetailsData?.documentDetailsID,
                },
                {
                  FilterKey: "role",
                  Operator: "eq",
                  FilterValue: "Reviewer",
                },
                {
                  FilterKey: "taskAssignee",
                  Operator: "eq",
                  FilterValue: el?.userData?.id,
                },
              ],
            })
              .then(async (res: any) => {
                if (res) {
                  res?.map(async (item: any) => {
                    await SpServices.SPUpdateItem({
                      Listname: LISTNAMES.MyTasks,
                      ID: item?.ID,
                      RequestJSON: {
                        completed: true,
                        completedOn: dayjs(new Date()).format("DD/MM/YYYY"),
                      },
                    });
                  });
                }
              })
              .catch((err: any) => {
                console.log("err: ", err);
              });
          }
        });
      }

      // Check if the current reviewer is the last one
      if (currentPromoter?.currentOrder === totalReviewers) {
        // Last reviewer completed, move to the first approver
        await changeDocStatus(
          currentDocDetailsData?.documentDetailsID,
          "In Review",
          "reviewers",
          updatedReviewers,
          currentDocDetailsData,
          dispatch,
          true // Mark that all reviewers have completed
        );

        // Now move to approvers
        updatedReviewers = currentDocDetailsData?.approvers?.map(
          (item: any, index: number) => {
            if (index === 0) {
              return { ...item, status: "in progress" };
            } else {
              return item;
            }
          }
        );

        await changeDocStatus(
          currentDocDetailsData?.documentDetailsID,
          "In Approval",
          "approvers",
          updatedReviewers,
          currentDocDetailsData,
          dispatch
        );
      } else {
        // Not the last reviewer, just update the reviewers
        await changeDocStatus(
          currentDocDetailsData?.documentDetailsID,
          "In Review",
          "reviewers",
          updatedReviewers,
          currentDocDetailsData,
          dispatch
        );
      }
    }

    if (!updatedReviewers) {
      console.error("No active reviewer found");
      return;
    }

    console.log("updatedReviewers: ", updatedReviewers);

    return updatedReviewers;
  };

  const handleApproverUpdate = async (
    currentDocDetailsData: any,
    totalApprovers: number,
    dispatch: any
  ) => {
    debugger;
    const currentPromoter = getCurrentPromoter(
      currentDocDetailsData?.approvers
    );

    let updatedApprovers;

    if (currentPromoter?.currentPromoter?.status === "in progress") {
      updatedApprovers = currentDocDetailsData?.approvers?.map(
        (item: any, index: number) => {
          if (item?.id === currentPromoter?.currentOrder) {
            // Mark the current approver as completed
            return { ...item, status: "completed" };
          } else if (
            item?.id === currentPromoter?.currentOrder + 1 &&
            currentPromoter?.currentOrder !== totalApprovers
          ) {
            // Move to the next approver only if it's not the last one
            return { ...item, status: "in progress" };
          } else {
            return item;
          }
        }
      );
    }

    if (!updatedApprovers) {
      console.error("No active approver found");
      return;
    }

    if (updatedApprovers?.some((item: any) => item?.status === "completed")) {
      updatedApprovers?.map(async (el: any) => {
        if (el?.status === "completed") {
          await SpServices.SPReadItems({
            Listname: LISTNAMES.MyTasks,
            Select: "*, documentDetails/ID",
            Expand: "documentDetails",
            Filter: [
              {
                FilterKey: "documentDetails",
                Operator: "eq",
                FilterValue: currentDocDetailsData?.documentDetailsID,
              },
              {
                FilterKey: "role",
                Operator: "eq",
                FilterValue: "Approver",
              },
              {
                FilterKey: "taskAssignee",
                Operator: "eq",
                FilterValue: el?.userData?.id,
              },
            ],
          })
            .then(async (res: any) => {
              if (res) {
                res?.map(async (item: any) => {
                  await SpServices.SPUpdateItem({
                    Listname: LISTNAMES.MyTasks,
                    ID: item?.ID,
                    RequestJSON: {
                      completed: true,
                      completedOn: dayjs(new Date()).format("DD/MM/YYYY"),
                    },
                  });
                });
              }
            })
            .catch((err: any) => {
              console.log("err: ", err);
            });
        }
      });
    }

    // If the current approver is the last one, mark the document as Approved
    if (currentPromoter?.currentOrder === totalApprovers) {
      await changeDocStatus(
        currentDocDetailsData?.documentDetailsID,
        "Current", // Set the document status to Approved
        "approvers",
        updatedApprovers,
        currentDocDetailsData,
        dispatch,
        true // Indicate that this is the last step in the flow
      );
    } else {
      await changeDocStatus(
        currentDocDetailsData?.documentDetailsID,
        "In Approval",
        "approvers",
        updatedApprovers,
        currentDocDetailsData,
        dispatch,
        false
      );
    }

    console.log("updatedApprovers: ", updatedApprovers);

    return updatedApprovers;
  };

  const submitPromotedComment = async () => {
    handleClosePopup(5);

    try {
      if (promoteComments.promoteComment?.trim() === "") {
        setPromoteComments({
          ...promoteComments,
          IsValid: true,
          ErrorMsg: "Please enter comments",
        });
        return;
      }

      setPromoteComments({
        ...promoteComments,
        IsValid: false,
        ErrorMsg: "",
      });

      await addPromotedComment(
        promoteComments.promoteComment,
        currentDocDetailsData,
        handleClosePopup,
        setToastMessage,
        currentUserDetails
      );

      const totalReviewers = currentDocDetailsData?.reviewers?.length || 0;
      const totalApprovers = currentDocDetailsData?.approvers?.length || 0;
      const currentPromoter = getCurrentPromoter(
        currentDocDetailsData?.reviewers
      );
      let updatedPromoters: any;

      if (
        (currentDocRole?.reviewer &&
          currentDocDetailsData?.documentStatus?.toLowerCase() ===
            "in review") ||
        currentDocDetailsData?.documentStatus?.toLowerCase() === "in rework" ||
        currentDocDetailsData?.reviewers?.some(
          (item: any) => item?.status?.toLowerCase() === "in progress"
        )
      ) {
        updatedPromoters = await handleReviewerUpdate(
          currentDocDetailsData,
          totalReviewers,
          dispatch
        );
      } else if (
        (currentDocRole?.approver &&
          currentDocDetailsData?.documentStatus?.toLowerCase() ===
            "in approval") ||
        currentDocDetailsData?.documentStatus?.toLowerCase() === "in rework" ||
        currentDocDetailsData?.approvers?.some(
          (item: any) => item?.status?.toLowerCase() === "in progress"
        )
      ) {
        updatedPromoters = await handleApproverUpdate(
          currentDocDetailsData,
          totalApprovers,
          dispatch
        );
      }

      const currentInProgressPromoter = updatedPromoters?.filter(
        (item: any) => item?.status === "in progress"
      )[0]?.id;

      console.log("currentInProgressPromoter: ", currentInProgressPromoter);

      const sectionPromoterCount = currentDocRole.reviewer
        ? totalReviewers
        : currentDocRole.approver && totalApprovers;

      const sectionPromoterKey = currentDocRole.approver
        ? "sectionApproved"
        : currentDocRole.reviewer && "sectionReviewed";
      const sectionPromoterType = currentDocRole.approver
        ? "approver"
        : currentDocRole.reviewer && "reviewer";

      const payLoad = AllSectionsDataMain?.filter(
        (item: any) => item?.sectionType?.toLowerCase() !== "header"
      )?.map((el: any) => {
        if (currentPromoter?.currentOrder === sectionPromoterCount) {
          return {
            ID: el?.ID,
            status:
              currentDocDetailsData?.documentStatus?.toLowerCase() ===
                "in review" &&
              updatedPromoters?.some(
                (item: any) => item?.status === "in progress"
              ) &&
              currentInProgressPromoter &&
              currentDocRole?.reviewer &&
              currentPromoter?.currentOrder === totalReviewers
                ? `Yet to be approved (1/${totalApprovers})`
                : currentDocDetailsData?.documentStatus?.toLowerCase() ===
                    "in review" &&
                  updatedPromoters?.some(
                    (item: any) => item?.status === "in progress"
                  ) &&
                  currentInProgressPromoter
                ? `Yet to be reviewed (${currentInProgressPromoter}/${totalReviewers})`
                : currentDocDetailsData?.documentStatus?.toLowerCase() ===
                    "in approval" &&
                  currentInProgressPromoter &&
                  updatedPromoters?.some(
                    (item: any) => item?.status === "in progress"
                  )
                ? `Yet to be approved (${currentInProgressPromoter}/${totalApprovers})`
                : "Approved",
            sectionReviewed:
              currentPromoter?.currentOrder === sectionPromoterCount &&
              sectionPromoterType === "approver",
            sectionApproved:
              currentPromoter?.currentOrder === sectionPromoterCount &&
              sectionPromoterType === "approver",
            sectionRework: false,
          };
        } else {
          return {
            ID: el?.ID,
            status:
              currentDocDetailsData?.documentStatus?.toLowerCase() ===
                "in review" &&
              updatedPromoters?.some(
                (item: any) => item?.status === "in progress"
              ) &&
              currentInProgressPromoter &&
              currentDocRole?.reviewer &&
              currentPromoter?.currentOrder === totalReviewers
                ? `Yet to be approved (1/${totalApprovers})`
                : currentDocDetailsData?.documentStatus?.toLowerCase() ===
                  "in review"
                ? `Yet to be reviewed (${currentInProgressPromoter}/${totalReviewers})`
                : currentDocRole?.approver &&
                  currentInProgressPromoter &&
                  currentPromoter?.currentOrder === totalApprovers
                ? "Approved"
                : currentDocDetailsData?.documentStatus?.toLowerCase() ===
                  "in approval"
                ? `Yet to be approved (${
                    currentInProgressPromoter || totalApprovers
                  }/${totalApprovers})`
                : "Approved",
            sectionReviewed: false,
            sectionApproved: false,
            sectionRework: false,
          };
        }
      });

      await changeSectionStatus(
        payLoad,
        AllSectionsDataMain,
        dispatch,
        sectionPromoterType,
        sectionPromoterKey,
        currentDocRole.reviewer
          ? currentPromoter?.currentOrder === totalReviewers
          : currentDocRole.approver
          ? currentPromoter?.currentOrder === totalApprovers
          : false
      );
    } catch (error) {
      console.error("Error in submitPromotedComment:", error);
    }
  };

  const markAllSection = async () => {
    const totalPromoters: any = currentDocRole?.reviewer
      ? {
          data: currentDocDetailsData?.reviewers,
          total: currentDocDetailsData?.reviewers?.length,
        }
      : currentDocRole?.approver
      ? {
          data: currentDocDetailsData?.approvers,
          total: currentDocDetailsData?.approvers?.length,
        }
      : {
          data: currentDocDetailsData?.reviewers,
          total: currentDocDetailsData?.reviewers?.length,
        };

    const currentPromoter: any = getCurrentPromoter(totalPromoters.data);

    await SpServices.SPReadItems({
      Listname: LISTNAMES.SectionDetails,
      Select: "*,documentOf/ID",
      Expand: "documentOf",
      Filter: [
        {
          FilterKey: "documentOf",
          FilterValue: currentDocDetailsData?.documentDetailsID,
          Operator: "eq",
        },
      ],
    })
      .then(async (res: any) => {
        console.log("res: ", res);
        const SectionPromoteKey: any = currentDocRole.reviewer
          ? "sectionReviewed"
          : "sectionApproved";
        const SectionLastPromotedKey: any = currentDocRole.reviewer
          ? "lastReviewedBy"
          : "lastApprovedBy";
        const updatedSections: any = res?.map((item: any) => {
          return {
            ID: item?.ID,
            status: `Yet to be ${
              currentDocRole.reviewer ? "reviewed" : "approved"
            } ${`${currentPromoter?.currentOrder}/${totalPromoters?.total}`}`,
            [`${SectionPromoteKey}`]: true,
            [`${SectionLastPromotedKey}`]: JSON.stringify(currentPromoter),
          };
        });

        await SpServices.batchUpdate({
          ListName: LISTNAMES.SectionDetails,
          responseData: updatedSections,
        })
          .then((res: any) => {
            console.log("res: ", res);

            // Initialize the shallow copy outside the loop
            let AllSectionDataLocalShallowCopy = [...AllSectionsData];

            for (const element of updatedSections) {
              AllSectionDataLocalShallowCopy = updateSectionDataLocal(
                AllSectionDataLocalShallowCopy,
                element?.ID,
                {
                  sectionStatus: element?.status,
                  [`${SectionPromoteKey}`]: true,
                  [`${SectionLastPromotedKey}`]:
                    JSON.stringify(currentPromoter),
                  sectionRework: false,
                }
              );
            }

            // Dispatch the update once after the loop
            dispatch(setCDSectionData(AllSectionDataLocalShallowCopy));
          })
          .catch((err: any) => {
            console.log("err: ", err);
          });
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  };

  const showActionBtns: boolean =
    currentDocDetailsData?.taskRole?.toLowerCase() !== "consultant" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "reviewer" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "approver" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "admin";

  const popupInputs: any[] = [
    [
      <SectionComments
        commentsData={AllSectionsData[activeSection]?.sectionComments}
        currentSectionData={AllSectionsData[activeSection]}
        currentDocRole={currentDocRole}
        isHeader={false}
        key={1}
        noCommentInput={true}
        viewOnly={true}
        promoteComments={true}
        currentDocDetails={currentDocDetailsData}
      />,
    ],
    [
      <DocumentTracker
        documentData={currentDocDetailsData}
        sectionsData={AllSectionsData}
        key={1}
      />,
    ],
    [
      <CustomInput
        size="MD"
        labelText="Document name"
        withLabel
        icon={false}
        value={removeVersionFromDocName(currentDocDetailsData?.documentName)}
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
        labelText="Document version"
        withLabel
        icon={false}
        value={currentDocDetailsData?.version}
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
        labelText="Document type"
        withLabel
        icon={false}
        value={currentDocDetailsData?.documentTemplateType?.Title}
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
      <CustomInput
        size="MD"
        labelText="Due on"
        withLabel
        icon={false}
        value={calculateDueDateByRole(
          currentDocDetailsData?.dueOnDate,
          "document"
        )}
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
        selectedItem={currentDocDetailsData?.reviewers?.map(
          (el: any) => el?.userData
        )}
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
        selectedItem={currentDocDetailsData?.approvers?.map(
          (el: any) => el?.userData
        )}
        readOnly={true}
        noRemoveBtn={true}
        multiUsers={true}
        // noBorderInput={true}
        key={5}
      />,
    ],
    [
      <CustomTextArea
        size="MD"
        labelText="Comments"
        withLabel
        icon={false}
        mandatory={true}
        value={promoteComments.promoteComment}
        onChange={(value: any) => {
          setPromoteComments({
            ...promoteComments,
            promoteComment: value,
            IsValid: false,
          });
        }}
        placeholder="Enter Description"
        isValid={promoteComments.IsValid}
        errorMsg={promoteComments.ErrorMsg}
        key={2}
      />,
    ],
    [],
    [
      <div key={1}>
        <CustomTextArea
          size="MD"
          labelText="Comments (Optional)"
          withLabel
          icon={false}
          mandatory={false}
          value={promoteComments.promoteComment}
          onChange={(value: any) => {
            setPromoteComments({
              ...promoteComments,
              promoteComment: value,
              IsValid: false,
            });
          }}
          placeholder="Enter Comments..."
          isValid={promoteComments.IsValid}
          errorMsg={promoteComments.ErrorMsg}
          topLabel={true}
        />
      </div>,
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
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(3);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await submitPromotedComment();
        },
      },
    ],
    [],
    [
      {
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(5);
          setPromoteComments({
            ...promoteComments,
            promoteComment: "",
            IsValid: false,
            ErrorMsg: "",
          });
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(5);
          if (promoteComments.promoteComment !== "") {
            debugger;
            await addPromotedComment(
              promoteComments.promoteComment,
              currentDocDetailsData,
              handleClosePopup,
              setToastMessage,
              currentUserDetails
            );
            setPromoteComments({
              ...promoteComments,
              promoteComment: "",
              IsValid: false,
              ErrorMsg: "",
            });
          }
          const totalReviewers = currentDocDetailsData?.reviewers?.length;
          const changeReviewer: any = currentDocDetailsData?.reviewers?.map(
            (e: any, idx: number) => {
              if (idx === 0) {
                return {
                  ...e,
                  status: "in progress",
                };
              } else {
                return { ...e };
              }
            }
          );
          console.log("changeReviewer: ", changeReviewer);
          const payLoad: any = AllSectionsDataMain?.filter(
            (item: any) => item?.sectionType?.toLowerCase() !== "header"
          )?.map((el: any) => {
            return {
              ID: el?.ID,
              status: `${`Yet to be reviewed (1/${totalReviewers})`}`,
            };
          });

          await changeDocStatus(
            currentDocDetailsData?.documentDetailsID,
            "In Review",
            "reviewers",
            changeReviewer,
            currentDocDetailsData,
            dispatch,
            false
          );
          await changeSectionStatus(payLoad, AllSectionsDataMain, dispatch);
          console.log("payLoad: ", payLoad);
          // await submitPromotedComment();
        },
      },
    ],
    [
      {
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(6);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(6);
          await markAllSection();
        },
      },
    ],
    [
      {
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(7);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(7);
          // await markAllSection();
        },
      },
    ],
    [
      {
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(8);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(8);
          setCheckChanges(false);
          setActiveSection(tempActiveSection);
          const Comments = getSectionComments(
            AllSectionsData[tempActiveSection].ID,
            currentDocDetailsData.version,
            dispatch
          );
          const changeRecordDetails = getSectionChangeRecord(
            AllSectionsData[tempActiveSection].ID,
            dispatch
          );
          console.log(Comments, changeRecordDetails);
          debugger;
          if (
            AllSectionsData[tempActiveSection].sectionType?.toLowerCase() ===
            "change record"
          ) {
            getAllSectionsChangeRecord(
              currentDocDetailsData.documentDetailsID,
              dispatch
            );
          }
        },
      },
    ],
  ];

  const currentPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  console.log("currentPromoter: ", currentPromoter);

  const popuphandleOnChanges = (
    value: number,
    condition: boolean,
    popupTitle: string
  ) => {
    if (condition) {
      setTempActiveSection(value);
      if (checkChanges) {
        togglePopupVisibility(
          setPopupController,
          8,
          "open",
          "Discard current changes"
        );
      } else {
        setActiveSection(value);
        const Comments = getSectionComments(
          AllSectionsData[value].ID,
          currentDocDetailsData.version,
          dispatch
        );
        const changeRecordDetails = getSectionChangeRecord(
          AllSectionsData[value].ID,
          dispatch
        );
        console.log(Comments, changeRecordDetails);
        debugger;
        if (
          AllSectionsData[value].sectionType?.toLowerCase() === "change record"
        ) {
          getAllSectionsChangeRecord(
            currentDocDetailsData.documentDetailsID,
            dispatch
          );
        }
      }
    } else {
      getPromotedComments(
        currentDocDetailsData.documentDetailsID,
        currentDocDetailsData.version,
        dispatch
      );
      togglePopupVisibility(setPopupController, value, "open", popupTitle);
    }
  };

  const enablePromote = (): boolean | undefined => {
    if (!currentDocDetailsData || !AllSectionsData) return false;

    const isInReview =
      currentDocDetailsData.documentStatus?.toLowerCase() === "in review";
    const isApproved =
      currentDocDetailsData.documentStatus?.toLowerCase() === "Approved";
    const isInApproval =
      currentDocDetailsData.documentStatus?.toLowerCase() === "in approval";
    const isInRework =
      currentDocDetailsData.documentStatus?.toLowerCase() === "in rework";

    const sectionsValid = AllSectionsData?.filter(
      (item: any) =>
        item?.sectionType?.toLowerCase() !== "header section" &&
        item?.sectionType?.toLowerCase() !== "change record" &&
        item?.sectionType?.toLowerCase() !== "references section"
    )?.every(
      (item: any) =>
        item?.sectionSubmitted &&
        (isInReview ? item?.sectionReviewed : item?.sectionApproved)
    );

    if ((isInReview || isInRework || isApproved) && currentDocRole?.reviewer) {
      return (
        sectionsValid &&
        currentDocDetailsData?.reviewers?.some(
          (item: any) => item?.status === "in progress"
        )
      );
    }
    if (
      (isInApproval || isInRework || isApproved) &&
      currentDocRole?.approver
    ) {
      return (
        currentPromoter?.status === "completed" ||
        (sectionsValid &&
          currentDocDetailsData?.approvers?.some(
            (item: any) => item?.status === "in progress"
          ))
      );
    }

    return false;
  };

  // const enablePromote = (): boolean => {
  //   if (!currentDocDetailsData || !AllSectionsData) return false;

  //   const isInReview =
  //     currentDocDetailsData.documentStatus?.toLowerCase() === "in review";
  //   const isApproved =
  //     currentDocDetailsData.documentStatus?.toLowerCase() === "approved";
  //   const isInApproval =
  //     currentDocDetailsData.documentStatus?.toLowerCase() === "in approval";
  //   const isInRework =
  //     currentDocDetailsData.documentStatus?.toLowerCase() === "in rework";

  //   const sectionsValid = AllSectionsData?.filter(
  //     (item: any) =>
  //       item?.sectionType?.toLowerCase() !== "header section" &&
  //       item?.sectionType?.toLowerCase() !== "change record" &&
  //       item?.sectionType?.toLowerCase() !== "references section"
  //   )?.every(
  //     (item: any) =>
  //       item?.sectionSubmitted &&
  //       (isInReview || isInRework
  //         ? item?.sectionReviewed || currentPromoter?.status === "completed"
  //         : item?.sectionApproved || currentPromoter?.status === "completed")
  //   );

  //   // Condition for reviewers
  //   if ((isInReview || isInRework || isApproved) && currentDocRole?.reviewer) {
  //     return (
  //       sectionsValid &&
  //       currentDocDetailsData?.reviewers?.some(
  //         (item: any) => item?.status === "in progress"
  //       )
  //     );
  //   }

  //   // Condition for approvers
  //   if (
  //     (isInApproval || isInRework || isApproved) &&
  //     currentDocRole?.approver
  //   ) {
  //     return (
  //       sectionsValid &&
  //       currentDocDetailsData?.approvers?.some(
  //         (item: any) => item?.status === "in progress"
  //       )
  //     );
  //   }

  //   return false;
  // };

  console.log("enablePromote: ", enablePromote());

  let markAsBtnText = "";

  if (
    currentDocRole.reviewer &&
    (currentPromoter?.status === "completed" ||
      AllSectionsData?.every((item: any) => item?.sectionReviewed))
  ) {
    // If the role is reviewer and all sections are reviewed
    markAsBtnText = "Reviewed";
  } else if (
    currentDocRole.approver &&
    (currentPromoter?.status === "completed" ||
      AllSectionsData?.every((item: any) => item?.sectionApproved))
  ) {
    // If the role is approver and all sections are approved
    markAsBtnText = "Approved";
  } else {
    // Default case
    markAsBtnText = `Mark as all ${
      currentDocRole.reviewer
        ? "reviewed"
        : currentDocRole.approver
        ? "approved"
        : "view"
    }`;
  }

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
        currentDocDetailsData.version,
        dispatch
      );
      console.log(Comments);
    }
  }, [AllSectionsDataMain?.length]);

  useEffect(() => {
    setAllSectionsData(AllSectionsDataMain);
  }, [AllSectionsDataMain]);

  useEffect(() => {
    setCurrentDocRole({
      primaryAuthor:
        currentDocDetailsData?.taskRole?.toLowerCase() === "primary author",
      reviewer: currentDocDetailsData?.taskRole?.toLowerCase() === "reviewer",
      approver: currentDocDetailsData?.taskRole?.toLowerCase() === "approver",
      sectionAuthor:
        currentDocDetailsData?.taskRole?.toLowerCase() === "section author",
      consultant:
        currentDocDetailsData?.taskRole?.toLowerCase() === "consultant",
    });
  }, [currentDocDetailsData]);

  return (
    <>
      {
        !initialLoader &&
        AllSectionsData?.length !== 0 &&
        currentDocDetailsData !== null ? (
          <div style={{ width: "100%" }}>
            <div style={{ width: "100%" }}>
              <Header
                currentDocRole={currentDocRole}
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
                <div className={styles.allSectionWrapper}>
                  <AllSections
                    currentDocRole={currentDocRole}
                    activeSection={activeSection}
                    currentDocDetailsData={currentDocDetailsData}
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
                {(currentDocRole.reviewer ||
                  currentDocRole.approver ||
                  currentDocRole.primaryAuthor) && (
                  <div
                    className={styles.promotedBtnWrapper}
                    style={{
                      justifyContent: currentDocRole.primaryAuthor
                        ? "flex-end"
                        : "space-between",
                    }}
                  >
                    {(currentDocRole.reviewer || currentDocRole.approver) && (
                      <DefaultButton
                        text={markAsBtnText}
                        disabled={
                          currentPromoter?.status === "completed" ||
                          currentDocDetailsData?.documentStatus?.toLowerCase() ===
                            "in rework" ||
                          (currentDocRole.reviewer &&
                            AllSectionsData?.filter(
                              (item: any) =>
                                item?.sectionType?.toLowerCase() !==
                                  "header section" &&
                                item?.sectionType?.toLowerCase() !==
                                  "references section" &&
                                item?.sectionType?.toLowerCase() !==
                                  "change record"
                            )?.every((item: any) => item?.sectionReviewed)) ||
                          (currentDocRole.approver &&
                            AllSectionsData?.filter(
                              (item: any) =>
                                item?.sectionType?.toLowerCase() !==
                                  "header section" &&
                                item?.sectionType?.toLowerCase() !==
                                  "references section" &&
                                item?.sectionType?.toLowerCase() !==
                                  "change record"
                            )?.every((item: any) => item?.sectionApproved))
                        }
                        btnType="secondary"
                        onClick={() => {
                          togglePopupVisibility(
                            setPopupController,
                            6,
                            "open",
                            `Are you sure you want to mark all section as ${
                              currentDocRole.reviewer ? "reviewed" : "approved"
                            }?`
                          );
                        }}
                      />
                    )}
                    {currentDocRole.primaryAuthor ? (
                      <DefaultButton
                        text="Promote"
                        disabled={
                          AllSectionsData?.filter(
                            (item: any) =>
                              item?.sectionType?.toLowerCase() !==
                                "header section" &&
                              item?.sectionType?.toLowerCase() !==
                                "references section" &&
                              item?.sectionType?.toLowerCase() !==
                                "change record"
                          )?.every((item: any) => item?.sectionSubmitted) &&
                          currentDocDetailsData?.documentStatus?.toLowerCase() ===
                            "in development"
                            ? false
                            : true
                        }
                        btnType="primary"
                        onClick={() => {
                          togglePopupVisibility(
                            setPopupController,
                            5,
                            "open",
                            "Are you sure to promote this document for review?"
                          );
                        }}
                      />
                    ) : (
                      <DefaultButton
                        text={
                          currentDocRole?.approver &&
                          currentPromoter?.id ===
                            currentDocDetailsData?.approvers?.length
                            ? "Publish"
                            : "Promote"
                        }
                        btnType="primary"
                        disabled={!enablePromote()}
                        onClick={() => {
                          togglePopupVisibility(
                            setPopupController,
                            3,
                            "open",
                            "Confirmation for completion"
                          );
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={styles.contentWrapper}>
                {AllSectionsData[activeSection]?.sectionName !== "" &&
                AllSectionsData[activeSection]?.sectionName?.toLowerCase() ===
                  "header" ? (
                  <SectionHeader
                    currentDocRole={currentDocRole}
                    currentDocDetailsData={currentDocDetailsData}
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
                    currentDocDetailsData={currentDocDetailsData}
                    currentDocRole={currentDocRole}
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
                      currentDocRole={currentDocRole}
                      version={currentDocDetailsData?.version}
                      type={currentDocDetailsData?.documentTemplateType?.Title}
                      headerTitle={currentDocDetailsData?.documentName}
                      sectionDetails={AllSectionsData[activeSection]}
                      primaryAuthorDefaultHeader={true}
                    />
                  </div>
                ) : AllSectionsData[
                    activeSection
                  ]?.sectionType?.toLowerCase() === "change record" ? (
                  <ChangeRecord />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "stretch",
                      // justifyContent: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width:
                          toggleCommentSection ||
                          AllSectionsData[
                            activeSection
                          ]?.sectionType?.toLowerCase() === "change record"
                            ? "100%"
                            : "75%",
                        height: "calc(95vh - 286px)",
                      }}
                    >
                      {AllSectionsData[
                        activeSection
                      ]?.sectionName?.toLowerCase() === "definitions" ? (
                        <Definition
                          currentDocRole={currentDocRole}
                          currentSectionDetails={AllSectionsData[activeSection]}
                          sectionId={AllSectionsData[activeSection]?.ID}
                          documentId={
                            AllSectionsData[activeSection]?.documentOfId
                          }
                          setCheckChanges={setCheckChanges}
                        />
                      ) : AllSectionsData[
                          activeSection
                        ]?.sectionType?.toLowerCase() ===
                        "references section" ? (
                        <References
                          allSectionsData={AllSectionsData}
                          documentId={
                            AllSectionsData[activeSection]?.documentOfId
                          }
                          sectionId={AllSectionsData[activeSection]?.ID}
                          currentDocRole={currentDocRole}
                          currentSectionDetails={AllSectionsData[activeSection]}
                        />
                      ) : AllSectionsData[
                          activeSection
                        ]?.sectionName?.toLowerCase() ===
                        "supporting materials" ? (
                        <SupportingDocuments
                          currentDocRole={currentDocRole}
                          currentSectionDetails={AllSectionsData[activeSection]}
                          sectionId={AllSectionsData[activeSection]?.ID}
                          documentId={
                            AllSectionsData[activeSection]?.documentOfId
                          }
                          setCheckChanges={setCheckChanges}
                        />
                      ) : AllSectionsData[activeSection]?.contentType ===
                        "initial" ? (
                        <ContentTypeConfirmation
                          sectionID={AllSectionsData[activeSection]?.ID}
                          currentSectionData={AllSectionsData[activeSection]}
                          currentDocRole={currentDocRole}
                          activeIndex={activeSection}
                          noActionBtns={!showActionBtns}
                          setSectionData={setAllSectionsData}
                        />
                      ) : AllSectionsData[activeSection]?.contentType ===
                        "list" ? (
                        <SectionContent
                          currentDocRole={currentDocRole}
                          activeIndex={activeSection}
                          setSectionData={setAllSectionsData}
                          currentSectionDetails={AllSectionsData[activeSection]}
                          sectionNumber={
                            AllSectionsData[activeSection]?.sectionOrder
                          }
                          ID={AllSectionsData[activeSection]?.ID}
                          noActionBtns={false}
                          setCheckChanges={setCheckChanges}
                        />
                      ) : (
                        <RichText
                          currentDocRole={currentDocRole}
                          activeIndex={activeSection}
                          setSectionData={setAllSectionsData}
                          noActionBtns={false}
                          ID={AllSectionsData[activeSection]?.ID}
                          currentSectionData={AllSectionsData[activeSection]}
                          checkChanges={setCheckChanges}
                        />
                      )}
                    </div>

                    {AllSectionsData[
                      activeSection
                    ]?.sectionType?.toLowerCase() !== "change record" && (
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
                        {toggleCommentSection && (
                          <button
                            className={styles.commentsToggleBtn}
                            onClick={() => {
                              setToggleCommentSection(false);
                            }}
                          >
                            <img src={commentIcon} alt={"comments"} />
                          </button>
                        )}
                        <SectionComments
                          currentSectionData={AllSectionsData[activeSection]}
                          currentDocRole={currentDocRole}
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
                          promoteComments={false}
                          currentDocDetails={currentDocDetailsData}
                        />
                      </div>
                    )}
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
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />
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
          popupHeight={index === 0 ? true : false}
        />
      ))}
    </>
  );
};

export default memo(ContentDevelopment);
