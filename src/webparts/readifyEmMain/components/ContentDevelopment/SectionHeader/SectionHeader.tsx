/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-floating-promises */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import styles from "./SectionHeader.module.scss";
// import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// // import CustomMutiplePeoplePicker from "../../common/CustomInputFields/CustomMutiplePeoplePicker";

// interface Props {
//   documentName: string;
//   sectionAuthor: any;
//   PrimaryAuthor?: any;
//   isPrimaryAuthor?: boolean;
//   consultants: any[];
//   activeSectionData: any;
//   currentDocRole?: any;
// }

// const SectionHeader: React.FC<Props> = ({
//   documentName,
//   sectionAuthor,
//   consultants,
//   PrimaryAuthor,
//   isPrimaryAuthor,
//   activeSectionData,
//   currentDocRole,
// }) => {
//   console.log("consultants: ", consultants);
//   console.log("currentDocRole: ", currentDocRole);
//   const handleOnChangeFunction = (value: any): any => {
//     console.log("value");
//   };

//   const currentUserDetails: any = useSelector(
//     (state: any) => state?.MainSPContext?.currentUserDetails
//   );

//   useEffect(() => {
//     console.log();
//   }, [sectionAuthor, PrimaryAuthor, consultants]);

//   return (
//     <>
//       <div className={styles.headerContainer}>
//         <span className={styles.sectionName}>
//           {`${
//             documentName?.toLowerCase() === "header"
//               ? documentName
//               : `${activeSectionData?.sectionOrder + ". " + documentName}`
//           }`}
//           {activeSectionData?.sectionType?.toLowerCase() ===
//           "appendix section" ? (
//             <span className={styles.appendixPill}>Appendix</span>
//           ) : (
//             ""
//           )}
//         </span>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <div className={styles.authors}>
//             <span className={styles.label}>
//               {!isPrimaryAuthor
//                 ? `Section Author ${
//                     activeSectionData?.sectionAuthor[0]?.email ===
//                     currentUserDetails?.email
//                       ? "(you)"
//                       : ""
//                   }`
//                 : `Primary Author ${
//                     activeSectionData?.sectionAuthor[0]?.email ===
//                     currentUserDetails?.email
//                       ? "(you)"
//                       : ""
//                   }`}
//             </span>
//             <CustomPeoplePicker
//               size="SM"
//               maxWidth={"200px"}
//               minWidth={"200px"}
//               noRemoveBtn={true}
//               selectedItem={
//                 !isPrimaryAuthor ? sectionAuthor?.email : PrimaryAuthor?.email
//               }
//               onChange={(value: any) => {
//                 handleOnChangeFunction(value);
//               }}
//               isValid={false}
//               placeholder="Add Reference Author"
//               readOnly
//               hideErrMsg
//             />
//           </div>
//           {!isPrimaryAuthor && (
//             <div className={styles.authors}>
//               <span className={styles.label}>Consultant</span>
//               <CustomPeoplePicker
//                 size="SM"
//                 maxWidth={"200px"}
//                 minWidth={"200px"}
//                 personSelectionLimit={
//                   currentDocRole.sectionAuthor ? 5 : consultants?.length
//                 }
//                 selectedItem={consultants}
//                 onChange={(value: any) => {
//                   handleOnChangeFunction(value);
//                 }}
//                 isValid={false}
//                 placeholder="Add Reference Author"
//                 // readOnly
//                 hideErrMsg
//                 readOnly={
//                   currentDocRole.sectionAuthor
//                     ? !currentDocRole.sectionAuthor
//                     : !currentDocRole.primaryAuthor
//                 }
//                 noRemoveBtn={
//                   currentDocRole.sectionAuthor
//                     ? !currentDocRole.sectionAuthor
//                     : !currentDocRole.primaryAuthor
//                 }
//                 multiUsers={true}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SectionHeader;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SectionHeader.module.scss";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import { addSectionConsultants } from "../../../../../services/ContentDevelopment/SectionHeader/SectionHeader";
import { LISTNAMES } from "../../../../../config/config";
// import SpServices from "../../../../../services/SPServices/SpServices";
import { sp } from "@pnp/sp";
import ToastMessage from "../../common/Toast/ToastMessage";

interface Props {
  documentName: string;
  sectionAuthor: any;
  PrimaryAuthor?: any;
  isPrimaryAuthor?: boolean;
  consultants: any[];
  activeSectionData: any;
  currentDocRole?: any;
  currentDocDetailsData?: any;
}

const SectionHeader: React.FC<Props> = ({
  documentName,
  sectionAuthor,
  consultants,
  PrimaryAuthor,
  isPrimaryAuthor,
  activeSectionData,
  currentDocRole,
  currentDocDetailsData,
}) => {
  const dispatch = useDispatch();
  console.log(
    "currentDocDetailsData: ",
    currentDocDetailsData,
    "activeSectionData",
    activeSectionData
  );
  const [authorState, setAuthorState] = useState<any>(sectionAuthor);
  // toast message state

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

  console.log("authorState: ", authorState);
  const [consultantsState, setConsultantsState] = useState<any[]>(consultants);
  console.log("consultantsState: ", consultantsState);

  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  // selectors
  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const handleOnChangeFunction = (value: any): any => {
    console.log("value", value);
    setConsultantsState(value);
  };

  const onSubmitFunction = async (): Promise<any> => {
    debugger;
    if (consultantsState) {
      if (consultantsState.length !== 0) {
        addSectionConsultants(
          currentDocDetailsData,
          activeSectionData,
          consultantsState,
          currentUserDetails,
          dispatch,
          AllSectionsDataMain,
          setToastMessage
        );
      } else {
        setToastMessage({
          isShow: true,
          severity: "warn",
          title: "Empty consultant!",
          message: "Please select at least one consultant.",
          duration: 3000,
        });
      }
    } else {
      console.log("consultantsState is empty");
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Empty consultant!",
        message: "Please select at least one consultant.",
        duration: 3000,
      });
    }
  };

  const getupdatedAuthors = async (): Promise<any> => {
    await sp.web.lists
      .getByTitle(LISTNAMES.SectionDetails)
      .items.getById(activeSectionData?.ID)
      .select(
        "*, sectionAuthor/ID, sectionAuthor/Title,sectionAuthor/EMail, consultants/ID, consultants/Title, consultants/EMail"
      )
      .expand("sectionAuthor, consultants")
      .get()
      .then((res: any) => {
        const resp = res[0] || res;
        const currentSA = {
          ID: resp?.sectionAuthor?.ID,
          title: resp?.sectionAuthor?.Title,
          email: resp?.sectionAuthor?.EMail,
        };
        const currentCons = resp?.consultants?.map((item: any) => ({
          ID: item?.ID,
          title: item?.Title,
          email: item?.EMail,
        }));
        setConsultantsState(currentCons);
        setAuthorState(currentSA);
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  };

  useEffect(() => {
    getupdatedAuthors();
  }, []);

  useEffect(() => {
    getupdatedAuthors();
    setAuthorState(sectionAuthor);
    setConsultantsState(consultants);
  }, [activeSectionData?.ID]);

  return (
    <div className={styles.headerContainer}>
      <span className={styles.sectionName}>
        {`${
          documentName?.toLowerCase() === "header"
            ? documentName
            : `${activeSectionData?.sectionOrder + ". " + documentName}`
        }`}
        {activeSectionData?.sectionType?.toLowerCase() ===
        "appendix section" ? (
          <span className={styles.appendixPill}>Appendix</span>
        ) : (
          ""
        )}
      </span>
      {activeSectionData?.sectionType?.toLowerCase() !== "change record" &&
        activeSectionData?.sectionType?.toLowerCase() !==
          "references section" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div className={styles.authors}>
              <span className={styles.label}>
                {!isPrimaryAuthor
                  ? `Section Author ${
                      activeSectionData?.sectionAuthor[0]?.email ===
                      currentUserDetails?.email
                        ? "(you)"
                        : ""
                    }`
                  : `Primary Author ${
                      currentDocDetailsData?.primaryAuthor?.email ===
                      currentUserDetails?.email
                        ? "(you)"
                        : ""
                    }`}
              </span>
              <CustomPeoplePicker
                size="SM"
                maxWidth={"200px"}
                minWidth={"200px"}
                noRemoveBtn={true}
                selectedItem={
                  !isPrimaryAuthor
                    ? authorState?.email
                    : currentDocDetailsData?.primaryAuthor?.email
                }
                onChange={handleOnChangeFunction}
                isValid={false}
                placeholder="Add Reference Author"
                readOnly
                hideErrMsg
              />
            </div>
            {!isPrimaryAuthor && (
              <div className={styles.authors}>
                <span className={styles.label}>Consultant</span>
                <CustomPeoplePicker
                  size="SM"
                  maxWidth={"200px"}
                  minWidth={"200px"}
                  personSelectionLimit={
                    currentDocRole.sectionAuthor || currentDocRole.primaryAuthor
                      ? 5
                      : consultantsState?.length
                  }
                  selectedItem={consultantsState}
                  onChange={handleOnChangeFunction}
                  onSubmit={onSubmitFunction}
                  isValid={false}
                  placeholder="Add consultants"
                  readOnly={
                    (!currentDocRole.sectionAuthor ||
                      !currentDocRole.primaryAuthor) &&
                    activeSectionData?.sectionSubmitted
                  }
                  noRemoveBtn={
                    !(
                      currentDocRole.sectionAuthor ||
                      currentDocRole.primaryAuthor
                    ) && !activeSectionData?.sectionSubmitted
                  }
                  hasSubmitBtn={
                    (currentDocRole.sectionAuthor ||
                      currentDocRole.primaryAuthor) &&
                    !activeSectionData?.sectionSubmitted
                  }
                  multiUsers={true}
                  popupControl={true}
                  hideErrMsg
                />
              </div>
            )}
          </div>
        )}
      {toastMessage.isShow && (
        <ToastMessage
          severity={toastMessage.severity}
          title={toastMessage.title}
          message={toastMessage.message}
          duration={toastMessage.duration}
          isShow={toastMessage.isShow}
          setToastMessage={setToastMessage}
        />
      )}
    </div>
  );
};

export default SectionHeader;
