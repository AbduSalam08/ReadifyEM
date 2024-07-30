// /* eslint-disable no-debugger */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useNavigate } from "react-router-dom";
// import DefaultButton from "../../common/Buttons/DefaultButton";
// import ContentTypeConfirmation from "../ContentTypeConfirmation/ContentTypeConfirmation";
// import RichText from "../RichText/RichText";
// import SectionContent from "../SectionContent/SectionContent";
// import styles from "./AppendixContent.module.scss";
// import { UpdateAttachment } from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
// import { useState } from "react";
// // import { addAppendixHeaderAttachmentData, addHeaderAttachmentData } from "../../../../../utils/contentDevelopementUtils";
// import SetupHeader from "../SetupHeader/SetupHeader";
// import { addAppendixHeaderAttachmentData } from "../../../../../utils/contentDevelopementUtils";

// interface IAppendixSectionProps {
//   sectionDetails: any;
//   contentType?: any;
//   setSectionData?: any;
//   activeIndex?: any;
//   currentDocDetailsData?: any;
// }

// const AppendixContent = ({
//   sectionDetails,
//   contentType,
//   setSectionData,
//   activeIndex,
//   currentDocDetailsData,
// }: IAppendixSectionProps): JSX.Element => {
//   const navigate = useNavigate();
//   const showActionBtns: boolean =
//     currentDocDetailsData?.taskRole?.toLowerCase() !== "consultant" &&
//     currentDocDetailsData?.taskRole?.toLowerCase() !== "reviewer" &&
//     currentDocDetailsData?.taskRole?.toLowerCase() !== "approver" &&
//     currentDocDetailsData?.taskRole?.toLowerCase() !== "admin";

//   const [inputValue, setInputValue] = useState();
//   const [headerImgDetails, setHeaderImgDetails] = useState<any>();
//   console.log("inputValue: ", inputValue);

//   const convertToTxtFile = (): any => {
//     const blob = new Blob([JSON.stringify(inputValue)], {
//       type: "text/plain",
//     });
//     const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
//     return file;
//   };

//   const addData = async (submissionType?: any): Promise<any> => {
//     debugger;
//     const _file: any = await convertToTxtFile();
//     if (_file) {
//       await UpdateAttachment(
//         sectionDetails?.ID,
//         _file,
//         sectionDetails?.contentType,
//         submissionType === "submit",
//         "Sample.txt"
//       );
//     }
//     if (headerImgDetails?.fileName?.trim() !== "") {
//       await addAppendixHeaderAttachmentData(
//         submissionType,
//         sectionDetails,
//         headerImgDetails
//       );
//     }
//   };

//   return (
//     <>
//       <div className={styles.scrollableApxSection}>
//         <SetupHeader
//           type={currentDocDetailsData.documentType}
//           headerTitle={currentDocDetailsData.documentName}
//           appendixName={sectionDetails?.sectionName}
//           version={currentDocDetailsData.version}
//           sectionDetails={sectionDetails}
//           appendixSection={true}
//           primaryAuthorDefaultHeader={false}
//           noActionBtns={true}
//           onChange={(value: any) => {
//             setHeaderImgDetails(value);
//           }}
//         />
//         <div className={styles.appxContentWrapper}>
//           <span className={styles.label}>Content</span>

//           {contentType === "initial" ? (
//             <ContentTypeConfirmation
//               customWrapperClassName={styles.customInitialContent}
//               activeIndex={activeIndex}
//               setSectionData={setSectionData}
//             />
//           ) : contentType === "list" ? (
//             <SectionContent
//               activeIndex={activeIndex}
//               setSectionData={setSectionData}
//               sectionNumber={sectionDetails?.sectionOrder}
//               currentSectionDetails={sectionDetails}
//               ID={sectionDetails?.ID}
//               noActionBtns={true}
//               onChange={(value: any) => {
//                 setInputValue(value);
//               }}
//             />
//           ) : (
//             <RichText
//               activeIndex={activeIndex}
//               setSectionData={setSectionData}
//               currentSectionData={sectionDetails}
//               noActionBtns={true}
//               ID={sectionDetails?.ID}
//               onChange={(value: any) => {
//                 setInputValue(value);
//               }}
//             />
//           )}
//         </div>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: "15px",
//         }}
//       >
//         <button className={"helpButton"}>Help?</button>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "flex-end",
//             gap: "15px",
//           }}
//         >
//           <DefaultButton
//             text="Cancel"
//             btnType="darkGreyVariant"
//             onClick={() => {
//               navigate(-1);
//             }}
//           />
//           {showActionBtns && (
//             <>
//               <DefaultButton
//                 text="Reset content"
//                 btnType="secondaryRed"
//                 onClick={() => {
//                   setSectionData((prev: any) => {
//                     const updatedSections = [...prev];
//                     updatedSections[activeIndex] = {
//                       ...updatedSections[activeIndex],
//                       contentType: "initial",
//                     };
//                     return updatedSections;
//                   });
//                 }}
//               />
//               <DefaultButton
//                 text="Save and Close"
//                 btnType="lightGreyVariant"
//                 onClick={async () => {
//                   await addData();
//                 }}
//               />
//               <DefaultButton
//                 text="Submit"
//                 btnType="primary"
//                 onClick={async () => {
//                   await addData("submit");
//                 }}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default AppendixContent;

/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultButton from "../../common/Buttons/DefaultButton";
import ContentTypeConfirmation from "../ContentTypeConfirmation/ContentTypeConfirmation";
import RichText from "../RichText/RichText";
import SectionContent from "../SectionContent/SectionContent";
import SetupHeader from "../SetupHeader/SetupHeader";
import styles from "./AppendixContent.module.scss";
import {
  addAppendixHeaderAttachmentData,
  UpdateSectionAttachment,
} from "../../../../../utils/contentDevelopementUtils";

interface IAppendixSectionProps {
  sectionDetails: any;
  contentType?: any;
  setSectionData?: any;
  activeIndex?: any;
  currentDocDetailsData?: any;
}

const AppendixContent = ({
  sectionDetails,
  contentType,
  setSectionData,
  activeIndex,
  currentDocDetailsData,
}: IAppendixSectionProps): JSX.Element => {
  const navigate = useNavigate();
  const showActionBtns: boolean =
    currentDocDetailsData?.taskRole?.toLowerCase() !== "consultant" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "reviewer" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "approver" &&
    currentDocDetailsData?.taskRole?.toLowerCase() !== "admin";

  const [inputValue, setInputValue] = useState<any>();
  const [headerImgDetails, setHeaderImgDetails] = useState<any>();
  console.log("inputValue: ", inputValue);

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(inputValue)], {
      type: "text/plain",
    });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    debugger;
    const _file: any = await convertToTxtFile();
    if (_file) {
      await UpdateSectionAttachment(
        sectionDetails?.ID,
        _file,
        sectionDetails?.contentType,
        submissionType === "submit",
        "Sample.txt"
      );
    }
    if (headerImgDetails?.fileName !== "") {
      await addAppendixHeaderAttachmentData(
        submissionType,
        sectionDetails,
        headerImgDetails
      );
    }
  };

  return (
    <>
      <div className={styles.scrollableApxSection}>
        <SetupHeader
          type={currentDocDetailsData.documentType}
          headerTitle={currentDocDetailsData.documentName}
          appendixName={sectionDetails?.sectionName}
          version={currentDocDetailsData.version}
          sectionDetails={sectionDetails}
          appendixSection={true}
          primaryAuthorDefaultHeader={false}
          noActionBtns={true}
          onChange={(value: any) => {
            setHeaderImgDetails(value);
          }}
        />
        <div className={styles.appxContentWrapper}>
          <span className={styles.label}>Content</span>

          {contentType === "initial" ? (
            <ContentTypeConfirmation
              customWrapperClassName={styles.customInitialContent}
              activeIndex={activeIndex}
              setSectionData={setSectionData}
            />
          ) : contentType === "list" ? (
            <SectionContent
              activeIndex={activeIndex}
              setSectionData={setSectionData}
              sectionNumber={sectionDetails?.sectionOrder}
              currentSectionDetails={sectionDetails}
              ID={sectionDetails?.ID}
              noActionBtns={true}
              onChange={(value: any) => {
                setInputValue(value);
              }}
            />
          ) : (
            <RichText
              activeIndex={activeIndex}
              setSectionData={setSectionData}
              currentSectionData={sectionDetails}
              noActionBtns={true}
              ID={sectionDetails?.ID}
              onChange={(value: any) => {
                setInputValue(value);
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
        }}
      >
        <button className={"helpButton"}>Help?</button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "15px",
          }}
        >
          <DefaultButton
            text="Cancel"
            btnType="darkGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
          />
          {showActionBtns && (
            <>
              <DefaultButton
                text="Reset content"
                btnType="secondaryRed"
                onClick={() => {
                  setSectionData((prev: any) => {
                    const updatedSections = [...prev];
                    updatedSections[activeIndex] = {
                      ...updatedSections[activeIndex],
                      contentType: "initial",
                    };
                    return updatedSections;
                  });
                }}
              />
              <DefaultButton
                text="Save and Close"
                btnType="lightGreyVariant"
                onClick={async () => {
                  await addData();
                }}
              />
              <DefaultButton
                text="Submit"
                btnType="primary"
                onClick={async () => {
                  await addData("submit");
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppendixContent;
