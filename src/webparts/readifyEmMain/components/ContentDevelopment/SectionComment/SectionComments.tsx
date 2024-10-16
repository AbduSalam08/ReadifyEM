/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState } from "react";
import styles from "./SectionComments.module.scss";
// import CustomInput from "../../common/CustomInputFields/CustomInput";
import CommentCard from "./CommentCard";
import { ChevronRight } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
// const commentIcon = require("../../../../../assets/images/svg/violetCommentIcon.svg");
const sendBtn = require("../../../../../assets/images/png/Send.png");

import { addSectionComment } from "../../../../../services/ContentDevelopment/SectionComments/SectionComments";
import { initialPopupLoaders } from "../../../../../config/config";
import { IPopupLoaders } from "../../../../../interface/MainInterface";
import AlertPopup from "../../common/Popups/AlertPopup/AlertPopup";
import ToastMessage from "../../common/Toast/ToastMessage";
import { InputTextarea } from "primereact/inputtextarea";
// import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";

interface Props {
  commentsData: any[];
  isHeader: boolean;
  noCommentInput?: boolean;
  viewOnly?: boolean;
  toggleCommentSection?: boolean;
  setToggleCommentSection?: any;
  documentId?: number;
  sectionId?: number;
  onClick?: any;
  currentSectionData?: any;
  currentDocRole?: any;
  promoteComments: boolean;
  currentDocDetails?: any;
}

const SectionComments: React.FC<Props> = ({
  commentsData,
  isHeader,
  noCommentInput,
  viewOnly,
  toggleCommentSection,
  setToggleCommentSection,
  documentId,
  sectionId,
  onClick,
  promoteComments,
  currentDocRole,
  currentSectionData,
  currentDocDetails,
}) => {
  const dispatch = useDispatch();

  // popup loaders and messages
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // selectors
  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionData.SectionComments
  );
  const promotedComments: any = useSelector(
    (state: any) => state.SectionData.promatedComments
  );
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );
  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  // initial States
  const [inputComment, setInputComment] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

  const onChangeFunction = (value: string): any => {
    setInputComment(value.trimStart());
  };

  const handleTextareaResize = async (): Promise<any> => {
    const textarea = document.querySelector("textarea"); // Adjust selector to target your specific textarea if needed
    if (textarea) {
      textarea.style.height = "54px"; // Reset the height first
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on content
    }
  };

  const sendSectionComment = async (): Promise<any> => {
    if (inputComment !== "") {
      const json = {
        comments: inputComment,
        sectionDetailsId: sectionId,
        createdById: currentUserDetails.id,
        role: currentDocDetailsData.taskRole,
        DocumentVersion: currentDocDetails.version,
      };
      await addSectionComment(
        json,
        AllSectionsComments,
        dispatch,
        currentUserDetails,
        setPopupLoaders,
        setToastMessage,
        sectionId,
        AllSectionsDataMain,
        setInputComment
      );
      handleTextareaResize();
      // if (clearInput) {
      //   setInputComment("");
      // }
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Warning",
        message: "Please enter your comments",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <div
        className={
          !toggleCommentSection
            ? promoteComments
              ? styles.promoteCommentSecMain
              : styles.commentSecMain
            : styles.closedCommentSection
        }
        style={{
          // backgroundColor: viewOnly ? "#93939335" : "#fff",
          border: viewOnly ? "none" : "1px solid #ebeaec",
          borderTopLeftRadius: toggleCommentSection ? "0" : "5px",
        }}
      >
        {isHeader && (
          <div className={styles.headerContainer}>
            {/* <button
              className={styles.commentsToggleBtn}
              onClick={() => {
                setToggleCommentSection(false);
              }}
            >
              <img src={commentIcon} alt={"comments"} />
            </button> */}
            <button
              className={styles.closeBtn}
              onClick={() => {
                setToggleCommentSection(true);
              }}
            >
              <ChevronRight />
            </button>
            <span className={styles.commentsTitle}>Comments</span>
          </div>
        )}
        <div
          className={
            promoteComments
              ? styles.promoteCommentBoxWrapper
              : styles.commentBoxWrapper
          }
        >
          <div className={styles.commentsWrapper}>
            {!promoteComments &&
              AllSectionsComments?.map((item: any, index: number) => {
                return <CommentCard index={index} item={item} key={index} />;
              })}
            {promoteComments &&
              promotedComments?.map((item: any, index: number) => {
                return <CommentCard index={index} item={item} key={index} />;
              })}
            {promoteComments ? (
              promotedComments.length === 0 ? (
                <div className={styles.noDataFound}>
                  <span>No comments found</span>
                </div>
              ) : null
            ) : AllSectionsComments.length === 0 ? (
              <div className={styles.noDataFound}>
                <span>No comments found</span>
              </div>
            ) : null}
            {/* {!promoteComments ? AllSectionsComments.length === 0 ?<div><span>No comments found</span></div>:null} */}
          </div>
          {!noCommentInput && (
            <div className={styles.commentsBar}>
              {/* <CustomInput
                value={inputComment}
                // disabled={currentSectionData?.sectionSubmitted}
                placeholder="Enter your comments here..."
                onChange={(value: string) => {
                  onChangeFunction(value);
                }}
                noBorderInput={true}
                inputWrapperClassName={styles.commentBoxInput}
                // submitBtn={true}
                onKeyDown={(ev: any) => {
                  if (ev.key === "Enter") {
                    sendSectionComment();
                  }
                }}
              /> */}
              {/* <CustomTextArea
                placeholder="Enter your comments"
                noBorderInput={true}
                inputWrapperClassName={styles.commentBoxInput}
                value={inputComment}
                rows={1}
                onChange={(value: string) => {
                  onChangeFunction(value);
                }}
                onKeyDown={(ev: any) => {
                  if (ev.key === "Enter") {
                    sendSectionComment();
                  }
                }}
              /> */}

              <InputTextarea
                v-model="value1"
                onKeyDown={(ev: any) => {
                  if (ev.key === "Enter") {
                    sendSectionComment();
                  }
                }}
                autoResize
                value={inputComment || ""}
                placeholder="Enter your comments"
                onChange={(e: any) => onChangeFunction(e.target.value)}
                // className={inputClassName}
                // rows={rows ? rows : 5}
                cols={30}
                style={{
                  // paddingLeft: icon ? "30px" : "0px",
                  border: "none",
                  padding: "10px",
                  width: "100%",
                  minHeight: "20px",
                  maxHeight: "100px",
                  height: inputComment === "" ? "20px" : "20px",
                  fontSize: "14px",
                  fontFamily: `interMedium, sans-serif`,
                }}
              />
              <button
                className={styles.sendBtn}
                disabled={currentSectionData?.sectionSubmitted}
                style={{
                  opacity: currentSectionData?.sectionSubmitted ? "0.5" : 1,
                }}
                onClick={(ev: any) => sendSectionComment()}
              >
                <img src={sendBtn} />
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />
      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders.isLoading}
        onClick={() => {
          setPopupLoaders(initialPopupLoaders);
          // setMainData();
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
      />
    </>
  );
};

export default SectionComments;
